import React, { useState, useEffect } from "react";
import RetoHeader from "../components/RetoHeader";
import "../assets/css/paginaReto.css";

const Reto = () => {
  const [paginasPasadas, setPaginasPasadas] = useState([]);
  const [datosReto, setDatosReto] = useState({
    leidos: 0,
    objetivo: 20,
    paginasTotales: 0,
    diasSeguidos: 47,
  });
  const [librosLeyendo, setLibrosLeyendo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [nuevaPagina, setNuevaPagina] = useState(0);
  const [paso, setPaso] = useState(1);
  const [puntuacion, setPuntuacion] = useState(0);

  // Estados para el Toast
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const mostrarNotificacion = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  };

  const ULTIMA_PAGINA_ID = 3;

  useEffect(() => {
    const sesion = JSON.parse(localStorage.getItem("usuario"));
    if (sesion) {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      fetch(
        `http://localhost:8080/api/bibliotecas/usuario/${sesion.idUsuario}/completa`,
        { headers },
      )
        .then((res) => res.json())
        .then((items) => {
          const librosLeidos = items.filter(
            (item) => item.estanteria?.nombre === "Leído",
          );
          const sumaPaginas = librosLeidos.reduce(
            (acc, item) => acc + (item.libro?.paginas || 0),
            0,
          );
          const librosActivos = items.filter(
            (item) => item.estanteria?.nombre === "Leyendo",
          );

          setLibrosLeyendo(librosActivos);

          setDatosReto((prev) => ({
            ...prev,
            leidos: librosLeidos.length,
            paginasTotales: sumaPaginas,
          }));
        })
        .catch((err) => console.error("Error cargando reto:", err));
    }
  }, []);
  console.log(librosLeyendo);
  const finalizarLibro = () => {
    if (libroSeleccionado) {
      setNuevaPagina(libroSeleccionado.libro.paginas);
      setPaso(2);
    }
  };

  const guardarTodo = () => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    fetch(`http://localhost:8080/api/bibliotecas/actualizar-estanteria`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        idLibroEstanteria: libroSeleccionado.id,
        nuevoNombreEstanteria: "Leído",
      }),
    })
      .then((res) => {
        if (res.ok) {
          setLibrosLeyendo((prev) =>
            prev.filter((l) => l.id !== libroSeleccionado.id),
          );
          setDatosReto((prev) => ({
            ...prev,
            leidos: prev.leidos + 1,
            paginasTotales:
              prev.paginasTotales + libroSeleccionado.libro.paginas,
          }));

          setIsModalOpen(false);
          setPaso(1);
          setLibroSeleccionado(null);

          // USAMOS TU NOTIFICACIÓN
          mostrarNotificacion(
            "¡Libro completado y añadido a tu reto!",
            "success",
          );
        }
      })
      .catch((err) => console.error("Error al guardar:", err));
  };

  const manejarPasoPagina = (id) => {
    if (id !== ULTIMA_PAGINA_ID && !paginasPasadas.includes(id)) {
      setPaginasPasadas([...paginasPasadas, id]);
    }
  };

  const reiniciarLibro = () => setPaginasPasadas([]);

  const librosRestantes = Math.max(datosReto.objetivo - datosReto.leidos, 0);
  const porcentaje = Math.min(
    (datosReto.leidos / datosReto.objetivo) * 100,
    100,
  );

  return (
    <div className="pagina-reto">
      <RetoHeader />

      <main className="reto-main-content">
        {/* TARJETA 3 - ESTADÍSTICAS */}
        <section
          className={`reto-card ultima-hoja ${paginasPasadas.includes(3) ? "pagina-pasada" : ""}`}
          style={{ zIndex: 1 }}
        >
          <div className="reto-card__title-container">
            <h3 className="reto-card__title">Estadísticas de lectura</h3>
          </div>
          <div className="reto-card__body flex-column align-items-center">
            <div className="d-flex justify-content-around w-100 mt-5">
              <div className="text-center">
                <h4
                  style={{ color: "var(--color-amarillo)", fontSize: "3rem" }}
                >
                  47
                </h4>
                <p style={{ fontSize: "1.2rem" }}>Días seguidos</p>
              </div>
              <div className="text-center">
                <h4 style={{ color: "var(--color-salmon)", fontSize: "3rem" }}>
                  {datosReto.leidos}
                </h4>
                <p style={{ fontSize: "1.2rem" }}>Libros leídos</p>
              </div>
            </div>
            <button
              onClick={reiniciarLibro}
              className="btn-add-progress"
              style={{ marginTop: "50px" }}
            >
              Cerrar Libro
            </button>
          </div>
        </section>

        {/* TARJETA 2 - PÁGINAS */}
        <section
          className={`reto-card ${paginasPasadas.includes(2) ? "pagina-pasada" : ""}`}
          style={{ zIndex: 2 }}
          onClick={() => manejarPasoPagina(2)}
        >
          <div className="reto-card__title-container">
            <h3 className="reto-card__title">Páginas leídas en total</h3>
          </div>
          <div className="reto-card__body">
            <div className="reto-card__icon-circle">
              <i className="bi bi-text-paragraph"></i>
            </div>
            <div className="reto-card__data" style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-verde-oscuro)",
                  paddingTop: "20px",
                }}
              >
                Has devorado un total de{" "}
                <strong>{datosReto.paginasTotales} páginas</strong>
              </p>
            </div>
          </div>
        </section>

        {/* TARJETA 1 - PROGRESO */}
        <section
          className={`reto-card ${paginasPasadas.includes(1) ? "pagina-pasada" : ""}`}
          style={{ zIndex: 3 }}
          onClick={() => manejarPasoPagina(1)}
        >
          <div className="reto-card__title-container">
            <h3 className="reto-card__title">Progreso de tu reto</h3>
          </div>
          <div className="reto-card__body">
            <div className="reto-card__icon-circle">
              <i className="bi bi-book"></i>
            </div>
            <div className="reto-card__data" style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-verde-oscuro)",
                  paddingTop: "20px",
                }}
              >
                {librosRestantes > 0 ? (
                  <>
                    Te quedan sólo <strong>{librosRestantes} libros</strong>{" "}
                    para completar el desafío.
                  </>
                ) : (
                  <strong>¡Felicidades! Has completado tu reto anual.</strong>
                )}
              </p>
              <div className="reto-progress-bar">
                <div
                  className="reto-progress-bar__fill"
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="reto-banner">
        <div className="reto-banner__textboton">
          <div className="reto-banner__text">
            <h2 className="text-verde">Cada página cuenta,</h2>
            <h2 className="text-amarillo">tú marcas el ritmo</h2>
          </div>
          <div className="reto-banner__button-wrapper">
            <button
              className="btn-progreso"
              onClick={() => {
                setIsModalOpen(true);
                setPaso(1);
              }}
            >
              <span>Añadir progreso de lectura</span>
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-progreso-nuevo">
            {paso === 1 ? (
              <>
                <h3 className="modal-titulo">¿Por qué página vas?</h3>
                <div className="modal-body-custom">
                  <select
                    className="modal-select"
                    value={libroSeleccionado?.id || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        setLibroSeleccionado(null);
                        return;
                      }
                      // Buscamos con == para evitar problemas de tipos (string vs number)
                      const lib = librosLeyendo.find((l) => l.id == val);

                      if (lib) {
                        setLibroSeleccionado(lib);
                        setNuevaPagina(0);
                        setPaso(1);
                      }
                    }}
                  >
                    <option value="">Selecciona un libro...</option>
                    {librosLeyendo.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.libro.titulo}
                      </option>
                    ))}
                  </select>
                  {libroSeleccionado && (
                    <div className="modal-inputs-wrapper">
                      <div className="input-group-custom">
                        <input
                          type="number"
                          className="modal-input-num"
                          value={nuevaPagina}
                          placeholder="0"
                          onChange={(e) => {
                            const val = e.target.value;

                            if (val === "") {
                              setNuevaPagina("");
                              return;
                            }

                            const num = parseInt(val);

                            if (
                              !isNaN(num) &&
                              num <= libroSeleccionado.libro.paginas
                            ) {
                              setNuevaPagina(num);
                            }
                          }}
                        />
                        <span className="separador">de</span>
                        <span className="total-badge">
                          {libroSeleccionado.libro.paginas || 0}
                        </span>
                      </div>
                      <button
                        className="btn-finalizar-directo"
                        onClick={finalizarLibro}
                      >
                        <i className="bi bi-check-circle-fill"></i> ¡Ya lo he
                        terminado!
                      </button>
                    </div>
                  )}
                </div>
                <div className="modal-botones">
                  <button
                    className="btn-cancelar"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-guardar-progreso"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Guardar
                  </button>
                </div>
              </>
            ) : (
              <div className="modal-puntuacion text-center">
                <h3 className="modal-titulo">¡Enhorabuena!</h3>
                <p>
                  ¿Qué te ha parecido{" "}
                  <strong>{libroSeleccionado?.libro.titulo}</strong>?
                </p>
                <div className="estrellas-wrapper my-4">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <i
                      key={estrella}
                      className={`bi ${puntuacion >= estrella ? "bi-star-fill" : "bi-star"} estrella-icon`}
                      onClick={() => setPuntuacion(estrella)}
                    ></i>
                  ))}
                </div>
                <button
                  className="btn-guardar-progreso w-100"
                  onClick={guardarTodo}
                >
                  Finalizar lectura
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {mensaje.texto && (
        <div className={`vault-toast vault-toast--${mensaje.tipo}`}>
          {mensaje.tipo === "success" ? (
            <i className="bi bi-check-circle-fill me-2"></i>
          ) : (
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
          )}
          {mensaje.texto}
        </div>
      )}
    </div>
  );
};

export default Reto;
