const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { findUserByEmail, createUser, updateTwoFactorSecret, validateUserPassword } = require('../models/userModel');

const register = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Usuario ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword);
    res.status(201).json({ message: 'Usuario creado', user: newUser });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await validateUserPassword(email, password);

        if (!user) return res.status(400).json({ message: 'Usuario no encontrado o contraseña incorrecta' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        if (user.is_two_factor_enabled) {
            return res.status(200).json({ message: 'Se requiere autenticación 2FA', userId: user.id });
        }

        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};


const enable2FA = async (req, res) => {
    const { userId } = req.body;
    const secret = speakeasy.generateSecret();
    await updateTwoFactorSecret(userId, secret.base32);

    qrcode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
        if (err) return res.status(500).json({ message: 'Error generando QR' });

        res.json({ qrCodeUrl: imageUrl, secret: secret.base32 });
    });
};

const verify2FA = async (req, res) => {
    const { userId, token } = req.body;
    const user = await findUserByEmail(userId);

    if (!user || !user.two_factor_secret) return res.status(400).json({ message: '2FA no activado' });

    const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token,
    });

    if (!verified) return res.status(400).json({ message: 'Código inválido' });

    const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: authToken });
};

module.exports = { register, login, enable2FA, verify2FA };
