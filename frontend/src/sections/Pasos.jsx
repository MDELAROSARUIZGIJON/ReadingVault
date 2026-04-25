export default function Pasos() {
    return(
        <section className="pasos">
            <div className="pasos__cards">

                {/* Primera card */}
                <div className="card">
                    <div className="card__icono">
                        <picture className="card__picture">
                            <img src="" alt="" className="card__img"/>
                        </picture>
                    </div>

                    <div className="card__texto">
                        <h2 className="card__titulo">Crea tu cuenta</h2>
                        <p className="card__descripcion">Regístrate en segundos y personaliza tu perfil lector.</p>
                    </div>
                </div>

                {/* Segunda card */}
                <div className="card">
                    <div className="card__icono">
                        <picture className="card__picture">
                            <img src="" alt="" className="card__img"/>
                        </picture>
                    </div>

                    <div className="card__texto">
                        <h2 className="card__titulo">Añade tus libros</h2>
                        <p className="card__descripcion">Marca tus libros como leídos, en progreso o pendientes.</p>
                    </div>
                </div>


                {/* Tercera card */}
                <div className="card">
                    <div className="card__icono">
                        <picture className="card__picture">
                            <img src="" alt="" className="card__img"/>
                        </picture>
                    </div>

                    <div className="card__texto">
                        <h2 className="card__titulo">Analiza tu lectura</h2>
                        <p className="card__descripcion">Consulta estadísticas y visualiza tu evolución.</p>
                    </div>
                </div>


                {/* Cuarta card */}
                <div className="card">
                    <div className="card__icono">
                        <picture className="card__picture">
                            <img src="" alt="" className="card__img"/>
                        </picture>
                    </div>

                    <div className="card__texto">
                        <h2 className="card__titulo">Comparte y participa</h2>
                        <p className="card__descripcion">Conecta con amigos y forma parte de grupos de lectura</p>
                    </div>
                </div>
            </div>
        </section>
    )
}