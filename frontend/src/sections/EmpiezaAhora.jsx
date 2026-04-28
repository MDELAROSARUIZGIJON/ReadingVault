import { Link } from 'react-router-dom';
import '../assets/css/empieza.css';

export default function EmpiezaAhora() {
  // Comprueba si hay sesión activa
  const estaLogueado = !!localStorage.getItem("usuario");

  return(
    <section className="empieza">
      <div className="container-custom">
        <div className="empieza__flex">
          <div className="empieza__col-izq">
            <h2 className="empieza__titulo">Leer es mejor cuando se comparte</h2>
          </div>

          <div className="empieza__col-der">
            <p className="empieza__parrafo">
              No solo llevas un registro de tus libros. Comparte experiencias, 
              descubre nuevas lecturas y forma parte de una comunidad que disfruta leyendo tanto como tú.
            </p>
            <div className="empieza__boton-container">
              {/* Enlace y texto dinámicos según estado de login */}
              <Link to={estaLogueado ? "/home" : "/login"} className="empieza__enlace">EMPIEZA AHORA</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}