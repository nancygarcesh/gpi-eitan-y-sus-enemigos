import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CredentialManager from './pages/CredentialManager';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Inicio</Link> | <Link to="/credentials">Gestionar Credenciales</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Bienvenido a la Gestión de Credenciales</h1>} />
          <Route path="/credentials" element={<CredentialManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
