import { Link } from 'react-router-dom';

export default function Footer(){
    return(
        <section className="footer">
            <div className="footer__slogan">
                <h2 className="slogan__titulo">Reading<span className="slogan__titulo--amarillo">Vault</span></h2>
                <p className="slogan__descripcion">Tu refugio personal para cada libro que formará parte de tu viaje literario</p>
                <div className="slogan__redes">
                    <img src="" alt="facebook" className="slogan__red"/>
                    <img src="" alt="twitter" className="slogan__red"/>
                    <img src="" alt="instagram" className="slogan__red"/>
                </div>
            </div>

            <div className="footer__logo">
                <picture className="logo__picture">
                    <img src="" alt="logo" className="logo__img"/>
                </picture>
            </div>

            <div className="footer__enlaces">
                <div className="enlaces__web">
                    <h2 className="web__titulo"><a href="" className="web__enlace--grande">ReadingVault</a></h2>
                    <Link to="/buscadorLibros" className="web__enlace">Libros</Link>
                    <Link to="/explorar" className="web__enlace">Explorar</Link>
                </div>
                <div className="enlaces__comunidad">
                    <h2 className="comunidad__titulo"><a href="" className="comunidad__enlace--grande">ReadingVault</a></h2>
                    <Link to="/comunidad" className="comunidad__enlace">Grupos de lectura</Link>
                    <Link to="/invitarAmigo" className="comunidad__enlace">invitar a un amigo</Link>
                </div>
            </div>

            <div className="footer__legal">
                <div className="legal__derechos">
                    <p>2026. Todos los derechos reservados</p>
                </div>

                <div className="legal__enlaces">
                    <Link to="/privacidad" className="legal__enlace">Política de privacidad</Link>
                    <Link to="/condiciones" className="legal__enlace">Términos y condiciones</Link>
                </div>
            </div>
        </section>
    )
}