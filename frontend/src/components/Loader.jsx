import React from 'react';
import '../assets/css/loader.css';

const Loader = ({ texto = "Cargando..." }) => {
  return (
    <div className="loader-container d-flex flex-column justify-content-center align-items-center text-center w-100" style={{ minHeight: "400px" }}>
      <div className="book">
        <div className="inner">
          <div className="left"></div>
          <div className="middle"></div>
          <div className="right"></div>
        </div>
        <ul>
          {[...Array(18)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </div>
      <h4 className="loader-texto mt-5 text-muted fw-bold">{texto}</h4>
    </div>
  );
};

export default Loader;