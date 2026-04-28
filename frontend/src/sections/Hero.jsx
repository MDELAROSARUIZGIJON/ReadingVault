import { Link } from 'react-router-dom';
import '../assets/css/hero.css';

export default function Hero() {
  // Comprobamos la sesión en el localStorage
  const estaLogueado = !!localStorage.getItem("usuario");

  return (
    <section className="hero">
      
      <div className="container-custom">
        <div className="hero__texto-bloque">
          {/* Aparece desde abajo (fade-up) inmediatamente */}
          <h1 className="hero__titulo" data-aos="fade-up">
            <span className="hero__titulo--verde">Reading</span> 
            <span className="hero__titulo--amarillo">Vault</span>
          </h1>
          
          {/* Aparece un poco después (delay de 200ms) */}
          <h3 className="hero__slogan" data-aos="fade-up" data-aos-delay="200">
            Tu refugio personal para cada libro que formará parte de tu viaje literario
          </h3>
          
          {/* a /home si logueado, a /login si no */}
          <div data-aos="fade-up" data-aos-delay="400">
            <Link to={estaLogueado ? "/home" : "/login"} className="hero__boton">
              ENTRAR
            </Link>
          </div>
        </div>
      </div>

      {/* La imagen entra desde la derecha con un efecto de fade */}
      <div className="hero__img-wrap" data-aos="fade-left" data-aos-delay="300">
        <picture>
          <img 
            src="/img/libros-landing.jpg" 
            alt="Estantería de libros" 
            className="hero__img-element"
          />
        </picture>
      </div>

    </section>
  );
}