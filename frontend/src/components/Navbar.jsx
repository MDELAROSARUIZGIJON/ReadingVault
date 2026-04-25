import { Link } from 'react-router-dom';
import '../assets/css/navbar.css'

export default function Navbar(){
    return (
        <nav className="navbar">

            {/* logo y nombre */}
            <div className="logo">
                <picture className="logo__img">
                    <img src="/logo-placeholder.png" alt="Logo Reading Vault" />
                </picture>
                <div className="logo__nombre">
                    <p className="logo__p">Reading <span className="logo__p--amarillo">Vault</span></p>
                </div>
            </div>

            {/* enlaces de la web */}
            <div className="enlaces">
                <div className="enlace">
                    <Link to="/" className="enlace__texto">Home</Link>
                </div>
                <div className="enlace">
                    <Link to="/comunidad" className="enlace__texto">Comunidad</Link>
                </div>
                <div className="enlace">
                    <Link to="/buscador" className="enlace__texto">Explorar</Link>
                </div>
                <div className="enlace">
                    <a href="#nosotros" className="enlace__texto">Nosotros</a>
                </div>
            </div>

            {/* enlaces login sesion */}
            <div className="usuarios">
                <div className="enlace">
                    <Link to="/registro" className="enlace__texto">Registro</Link>
                </div>
                <div className="login">
                    <Link to="/login" className="login__texto">Log In</Link>
                </div>
            </div>
        </nav>
    )
}