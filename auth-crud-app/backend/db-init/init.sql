-- Crear la tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    two_factor_secret TEXT,
    is_two_factor_enabled BOOLEAN DEFAULT FALSE
);
