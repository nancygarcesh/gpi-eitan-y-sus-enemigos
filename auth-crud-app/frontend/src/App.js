import { Routes, Route } from "react-router-dom"; // Importamos las herramientas de rutas
import Login from "./components/Login"; 
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext"; // Importamos el contexto de autenticación

function App() {
    return (
        <AuthProvider> 
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
