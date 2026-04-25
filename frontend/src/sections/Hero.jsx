import { Link } from 'react-router-dom';
import '../assets/css/hero.css'


export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__texto">
        <div className="texto__nombre">
          <h1 className="texto__letras">
            Reading <span className="texto__letras--amarillo">Vault</span>
          </h1>
        </div>
        <div className="texto__slogan">
          <h3 className="texto__h3">
            Tu refugio personal para cada libro que formará parte de tu viaje
            literario
          </h3>
        </div>
        <div className="texto__boton">
          <Link to="/login" className="texto__enlace">
            ENTRAR
          </Link>
        </div>
      </div>
      {/*
            por aqui deberia de  estar el clip-path
            CSS clip-path (MDN Web Docs)URL
            CSS clip-path maker (bennettfeely.com/clippy/)URL
            Basic Shapes (MDN Web Docs)URL    
        */}


      <div className="hero__img">
        <picture className="img__picture">
            <img src="/img/libros-landing.jpg" alt="" className="img__imagen"/>
        </picture>
      </div>
    </section>
  );
}
