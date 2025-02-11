const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
};

const createUser = async (email, passwordHash) => {
    const { rows } = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, passwordHash]
    );
    return rows[0];
};

const updateTwoFactorSecret = async (userId, secret) => {
    await pool.query('UPDATE users SET two_factor_secret = $1, is_two_factor_enabled = true WHERE id = $2', [secret, userId]);
};

const validateUserPassword = async (email, passwordHash) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, passwordHash]);
    return rows[0];
};

module.exports = { findUserByEmail, createUser, updateTwoFactorSecret, validateUserPassword };
