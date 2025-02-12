import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const CredentialManager = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const encryptPassword = (password) => {
    const secretKey = 'mySecretKey123';
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setMessage('Todos los campos son obligatorios.');
      return;
    }

    const encryptedPassword = encryptPassword(credentials.password);

    try {
      await axios.post('http://localhost:5000/api/credentials', {
        username: credentials.username,
        password: encryptedPassword,
      });
      setMessage('Credenciales almacenadas exitosamente.');
    } catch (error) {
      setMessage('Error al guardar credenciales.');
    }
  };

  return (
    <div>
      <h2>Gestión de Credenciales</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input type="text" name="username" value={credentials.username} onChange={handleChange} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} />
        </div>
        <button type="submit">Guardar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CredentialManager;
