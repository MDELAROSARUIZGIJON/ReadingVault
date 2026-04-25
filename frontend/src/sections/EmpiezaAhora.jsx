import { Link } from 'react-router-dom';

export default function EmpiezaAhora() {
    return(
        <section className="empieza">
                <div className="empieza__slogan">
                    <h2 className="empieza__titulo">Leer es mejor cuando se comparte</h2>
                </div>

                <div className="empieza__descripcion">
                    <p className="empieza__parrafo">No solo llevas un registro de tus libros. Comparte experiencias, descubre nuevas lecturas y forma parte de una comunidad que disfruta leyendo tanto como tú.</p>
                    <div className="empieza__boton">
                        <Link to="/registro" className="empieza__enlace">EMPIEZA AHORA</Link>
                    </div>
                </div>
        </section>
    )
}