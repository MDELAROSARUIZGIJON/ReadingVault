import React, { useState, useEffect } from 'react';
import '../assets/css/botonSubir.css';

export default function BotonSubir() {
  const [isVisible, setIsVisible] = useState(false);

  // Muestra el botón si el scroll baja de 300px
  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  // Sube al inicio suavemente
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Listener del scroll
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div 
      className={`boton-subir ${isVisible ? 'show' : ''}`} 
      onClick={scrollToTop}
      title="Volver arriba"
    >
      <i className="bi bi-chevron-up"></i>
    </div>
  );
}