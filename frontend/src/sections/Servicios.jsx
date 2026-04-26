import React, { useEffect, useRef } from 'react';
import '../assets/css/servicios.css';

export default function Servicios() {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.servicios__card');

    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        perspective(1000px)
        rotateX(${y * 12}deg)
        rotateY(${x * -12}deg)
        scale(1.03)
      `;
    };

    const handleMouseLeave = (card) => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    cards.forEach(card => {
      const moveFn = (e) => handleMouseMove(e, card);
      const leaveFn = () => handleMouseLeave(card);
      card.addEventListener('mousemove', moveFn);
      card.addEventListener('mouseleave', leaveFn);
      
      card._cleanup = () => {
        card.removeEventListener('mousemove', moveFn);
        card.removeEventListener('mouseleave', leaveFn);
      };
    });

    return () => cards.forEach(card => card._cleanup && card._cleanup());
  }, []);

  return (
    <section className="servicios">
      <div className="container-custom">
        
        <div className="servicios__header text-center" data-aos="fade-up">
          <h2 className="servicios__main-titulo">
            ¿Qué puedes hacer en nuestra plataforma?
          </h2>
        </div>

        <div className="servicios__grid" ref={gridRef}>
          
          <div className="servicios__card" style={{ animationDelay: '0.2s' }}>
            <div className="card__icono-container">
              <img className="card__icono-img" src="/img/libros.svg" alt="Biblioteca" />
            </div>
            <h3 className="card__titulo">Gestiona tu biblioteca personal</h3>
            <p className="card__descripcion">
              Lleva el control de los libros que has leído, estás leyendo o quieres leer.
            </p>
          </div>

          <div className="servicios__card" style={{ animationDelay: '0.6s' }}>
            <div className="card__icono-container">
              <img className="card__icono-img" src="/img/barras.svg" alt="Progreso" />
            </div>
            <h3 className="card__titulo">Visualiza tu progreso</h3>
            <p className="card__descripcion">
              Consulta estadísticas sobre tu ritmo de lectura y evolución.
            </p>
          </div>

          <div className="servicios__card" style={{ animationDelay: '1s' }}>
            <div className="card__icono-container">
              <img className="card__icono-img" src="/img/people.svg" alt="Conecta" />
            </div>
            <h3 className="card__titulo">Conecta con otros</h3>
            <p className="card__descripcion">
              Sigue a otros usuarios y comparte opiniones con personas con tu mismo gusto.
            </p>
          </div>

          <div className="servicios__card" style={{ animationDelay: '1.4s' }}>
            <div className="card__icono-container">
              <img className="card__icono-img" src="/img/sofa.svg" alt="Grupos" />
            </div>
            <h3 className="card__titulo">Grupos de lectura</h3>
            <p className="card__descripcion">
              Participa en grupos de lectura y motívate con retos compartidos.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}