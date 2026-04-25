import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
// hay q importar paginas de login y registro, como la landing
// import Login from "./pages/Login";
// import Registro from "./pages/Registro";
// import BuscadorLibros from "./pages/BuscadorLibros";

function App() {
  return (
    <router>
      <Navbar />
      <Routes>
        {/* la ruta principal sera la landing page */}
        <Route path="/" element={<Landing />}></Route>

        {/* Demás rutas */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/registro" element={<Registro />} />
        <Route path="/buscadorLibros" element={<BuscadorLibros />} />

        <Footer />
      </Routes>
    </router>
  );
}

export default App;
