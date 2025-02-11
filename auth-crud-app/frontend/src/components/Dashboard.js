import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
    }

    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>
            <button onClick={logout}>Cerrar Sesión</button>
        </div>
    );
}

export default Dashboard;
