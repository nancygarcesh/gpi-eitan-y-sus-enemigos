import React from "react"; // Importa React
import ReactDOM from "react-dom/client"; // Importa la librería para renderizar la app
import { BrowserRouter } from "react-router-dom"; // Habilita las rutas en la app
import App from "./App"; // Importa el componente principal

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
