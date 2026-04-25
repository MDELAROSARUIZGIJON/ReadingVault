export default function Servicios() {
  return (
    <section className="servicios">
      <div className="servicios__texto">
        <h2 className="servicios__titulo">
          ¿Qué puedes hacer en nuestra plataforma?
        </h2>
      </div>

      {/* cards de arriba */}
      <div className="servicios__cards">
        <div className="card">
          <div className="card__icono">
            <img src="" alt="" className="card__img" />
          </div>
          <div className="card__texto">
            <h3 className="card__titulo">Gestiona tu biblioteca personal</h3>
            <p className="card__descripcion">
              Lleva el control de los libros que has leído, estás leyendo o
              quieres leer. Organiza tu biblioteca de forma sencilla y visual
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card__icono">
            <img src="" alt="" className="card__img" />
          </div>
          <div className="card__texto">
            <h3 className="card__titulo">Visualiza tu progreso</h3>
            <p className="card__descripcion">
              Consulta estadísticas sobre tu ritmo de lectura: libros leídos,
              páginas, géneros favoritos y evolución a lo largo del tiempo.
            </p>
          </div>
        </div>

        {/* cards de abajo */}
        <div className="card">
          <div className="card__icono">
            <img src="" alt="" className="card__img" />
          </div>
          <div className="card__texto">
            <h3 className="card__titulo">Conecta con otros</h3>
            <p className="card__descripcion">
              Sigue a otros usuarios, comparte opiniones y descubre lecturas
              recomendadas por personas con tu mismo gusto
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card__icono">
            <img src="" alt="" className="card__img" />
          </div>
          <div className="card__texto">
            <h3 className="card__titulo">Grupos de lectura</h3>
            <p className="card__descripcion">
              Participa en grupos de lectura, comenta capítulos y motívate con
              retos compartidos junto a la comunidad
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
