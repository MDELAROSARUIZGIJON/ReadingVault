import React from "react";

const SideBarBiblioteca = ({ vistaActual, setVistaActual }) => {
  const estanterias = [
    { id: "todas", nombre: "Todas", icono: "bi-grid-fill" },
    { id: "Leyendo", nombre: "Leyendo", icono: "bi-book-half" },
    { id: "Pendiente", nombre: "Pendientes", icono: "bi-clock-history" },
    { id: "Leído", nombre: "Leídos", icono: "bi-check-circle-fill" },
  ];

  return (
    <aside className="sidebar-custom">
      <h3 className="sidebar-custom__title">Mi Vault</h3>
      <hr className="sidebar-custom__divider" />
      
      <ul className="sidebar-custom__list">
        {estanterias.map((e) => (
          <li 
            key={e.id} 
            className={`sidebar-custom__item ${vistaActual === e.id ? "active" : ""}`}
            onClick={() => setVistaActual(e.id)}
          >
            {e.nombre}
            
            
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBarBiblioteca;