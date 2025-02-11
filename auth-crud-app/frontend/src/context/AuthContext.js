import { createContext, useState, useEffect } from "react";

const AuthContext = createContext(); // Se crea un contexto

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Estado para el usuario

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token }); // Si hay un token en localStorage, el usuario sigue autenticado
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
