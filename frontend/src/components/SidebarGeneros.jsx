import React from 'react';
import '../assets/css/buscador.css';

// Componente para la barra lateral de filtros
const SidebarGeneros = ({ tusGeneros, todosLosGeneros, onGeneroClick, generoActivo }) => {
  return (
    <div className="sidebar-custom">
      
      {/* Sección: Favoritos del Usuario */}
      <h3 className="sidebar-custom__title">Tus géneros</h3>
      <hr className="sidebar-custom__divider" />
      
      {/* Lista dinámica de favoritos */}
      {tusGeneros && tusGeneros.length > 0 ? (
        <ul className="sidebar-custom__list">
          {tusGeneros.map((genero, idx) => (
            <li 
              key={`tus-${idx}`} 
              className={`sidebar-custom__item ${generoActivo === genero ? "active" : ""}`}
              onClick={() => onGeneroClick(genero)}
            >
              <i className="bi bi-star-fill me-2" style={{ fontSize: '0.8rem', color: '#ffc107' }}></i>
              {genero}
            </li>
          ))}
        </ul>
      ) : (
        <p className="sidebar-custom__empty text-muted ps-3">Aún no tienes favoritos</p>
      )}

      {/* Sección: Catálogo Completo */}
      <h3 className="sidebar-custom__title mt-5">Todos los géneros</h3>
      <hr className="sidebar-custom__divider" />
      
      <ul className="sidebar-custom__list">
        {todosLosGeneros.map((genero, idx) => (
          <li 
            key={`todos-${idx}`}
            className={`sidebar-custom__item ${generoActivo === genero ? "active" : ""}`}
            onClick={() => onGeneroClick(genero)}
          >
            {genero}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarGeneros;