require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);

// Registrar usuario
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) return res.status(400).json({ message: 'Usuario ya registrado' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'Usuario creado', user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

// Iniciar sesión
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        if (user.is_two_factor_enabled) {
            return res.status(200).json({ message: 'Se requiere autenticación 2FA', userId: user.id });
        }
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

// Habilitar 2FA
app.post('/api/auth/enable-2fa', async (req, res) => {
    const { userId } = req.body;
    try {
        const secret = speakeasy.generateSecret();
        await pool.query('UPDATE users SET two_factor_secret = $1, is_two_factor_enabled = true WHERE id = $2', [secret.base32, userId]);
        
        qrcode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
            if (err) return res.status(500).json({ message: 'Error generando QR' });
            res.json({ qrCodeUrl: imageUrl, secret: secret.base32 });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

// Verificar 2FA
app.post('/api/auth/verify-2fa', async (req, res) => {
    const { userId, token } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (rows.length === 0 || !rows[0].two_factor_secret) return res.status(400).json({ message: '2FA no activado' });
        
        const user = rows[0];
        const verified = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token,
        });
        
        if (!verified) return res.status(400).json({ message: 'Código inválido' });
        
        const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: authToken });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
