const pool = require('../config/db');

// Buscar un usuario por su email
const findUserByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
};

// Crear un nuevo usuario
const createUser = async (email, passwordHash) => {
    const { rows } = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, passwordHash]
    );
    return rows[0];
};

// Actualizar el secreto de 2FA
const updateTwoFactorSecret = async (userId, secret) => {
    await pool.query('UPDATE users SET two_factor_secret = $1, is_two_factor_enabled = true WHERE id = $2', [secret, userId]);
};

// Validar la contraseña de un usuario
const validateUserPassword = async (email, password) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return null;
    const validPassword = await bcrypt.compare(password, rows[0].password);
    return validPassword ? rows[0] : null;
};

const bcrypt = require('bcryptjs');


module.exports = { findUserByEmail, createUser, updateTwoFactorSecret, validateUserPassword };
