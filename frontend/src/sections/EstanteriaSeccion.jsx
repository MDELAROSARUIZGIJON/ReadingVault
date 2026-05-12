import React from "react";
import LibroCard from "../components/LibroCard";

const EstanteriaSeccion = ({ titulo, libros, alVerMas }) => {
  const limite = libros.slice(0, 5);

  return (
    <section className="estanteria-container-white">
      <div className="estanteria-white-header">
        <h2 className="estanteria-white-title">{titulo}</h2>
      </div>
      
      <div className="estanteria-white-body">
        <div className="libros-fila-grid">
          {limite.length > 0 ? (
            limite.map((item) => {
                const libroAjustado = {
                ...item.libro,
                portada: item.libro.portada || item.libro.fotoPortada || item.libro.imagen
                };
                return <LibroCard key={item.id} libro={libroAjustado} />;
            })
          ) : (
            <p className="vacio-text">No hay libros aquí todavía.</p>
          )}
        </div>
        <div className="ver-mas-container">
          <span className="link-ver-mas" onClick={alVerMas}>
            Ver más...
          </span>
        </div>
      </div>
    </section>
  );
};

export default EstanteriaSeccion;