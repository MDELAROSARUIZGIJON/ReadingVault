import '../assets/css/navbar.css'

export default function Navbar(){
    return (
        <nav className="navbar">

            {/* logo y nombre */}
            <div className="logo">
                <picture className="logo__img">
                    <img src="" alt="Logo Reading Vault" />
                </picture>
                <div className="logo__nombre">
                    <p className="logo__p">Reading <span className="logo__p--amarillo">Vault</span></p>
                </div>
            </div>

            {/* enlaces de la web */}
            <div className="enlaces">
                <div className="enlace">
                    <link to="/" className="enlace__texto">Home</link>
                </div>
                <div className="enlace">
                    <link to="/comunidad" className="enlace__texto">Comunidad</link>
                </div>
                <div className="enlace">
                    <link href="/explorar" className="enlace__texto">Explorar</link>
                </div>
                <div className="enlace">
                    <a href="#nosotros" className="enlace__texto">Nosotros</a>
                </div>
            </div>

            {/* enlaces login sesion */}
            <div className="usuarios">
                <div className="enlace">
                    <link to="/registro" className="enlace__texto">Registro</link>
                </div>
                <div className="login">
                    <link to="/login" className="login__texto">Log In</link>
                </div>
            </div>
        </nav>
    )
}