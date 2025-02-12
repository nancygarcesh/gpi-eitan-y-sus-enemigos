import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CredentialManager from './pages/CredentialManager';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/credentials" element={<CredentialManager />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
