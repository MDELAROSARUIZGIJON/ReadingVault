import React, { useState } from 'react';
import '../assets/css/crearGrupoModal.css';

const CrearGrupoModal = ({ show, onClose, onGrupoCreado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    foto: null
  });

  // --- ESTADOS EXCLUSIVOS DEL MODAL PARA EL BUSCADOR DE LIBROS ---
  const [busquedaLibro, setBusquedaLibro] = useState('');
  const [resultadosLibros, setResultadosLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  // --- ESTA ES LA FUNCIÓN QUE BUSCA EN EL BACKEND DE PEDRO ---
  const handleBuscarLibro = async (e) => {
    const texto = e.target.value;
    setBusquedaLibro(texto);

    // Si escribe menos de 3 letras, limpiamos la lista
    if (texto.length < 3) {
      setResultadosLibros([]);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      // Llamamos al endpoint de búsqueda
      const response = await fetch(`http://localhost:8080/api/libros/buscar?q=${encodeURIComponent(texto)}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });     
      if (response.ok) {       
        const librosEncontrados = await response.json();
        setResultadosLibros(librosEncontrados);
      }
    } catch (error) {
      console.error("Error buscando libros:", error);
    }
  };

  const seleccionarLibro = (libro) => {
    setLibroSeleccionado(libro);
    setBusquedaLibro(''); 
    setResultadosLibros([]); 
  };

  const quitarLibro = () => {
    setLibroSeleccionado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const sesion = JSON.parse(localStorage.getItem("usuario"));

    if (!sesion) {
        alert("Debes iniciar sesión para crear un grupo.");
        return;
    }

    const dataToSend = new FormData();
    dataToSend.append("nombre", formData.nombre);
    dataToSend.append("descripcion", formData.descripcion);
    dataToSend.append("idUsuario", sesion.idUsuario);
    if (formData.foto) dataToSend.append("foto", formData.foto);
    
   
   if (libroSeleccionado) {
        const idDelLibro = libroSeleccionado.idLibro || libroSeleccionado.id;
        
        if (idDelLibro) {
            // Si el libro tiene ID (es local), mandamos solo el ID
            dataToSend.append("idLibro", idDelLibro);
        } else {
            // Si viene de Google Books, mandamos sus datos para que el backend lo registre solo
            dataToSend.append("tituloLibro", libroSeleccionado.titulo || "");
            dataToSend.append("autorLibro", libroSeleccionado.autor || "");
            dataToSend.append("portadaLibro", libroSeleccionado.portada || libroSeleccionado.fotoPortada || "");
        }
    }

    try {
      const response = await fetch("http://localhost:8080/api/comunidades/crear", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: dataToSend
      });

      if (response.ok) {
        const comunidadCreada = await response.json();
        onClose(); 
        if (onGrupoCreado) onGrupoCreado();
      } else {
        alert("Hubo un error al crear el grupo.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-custom">
        <div className="modal-header-custom">
          <h3 className="modal-title-custom">Crear nuevo Club de Lectura</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-custom">
          
          <div className="form-group mb-3">
            <label className="form-label fw-bold">Nombre del Grupo</label>
            <input 
              type="text" 
              className="form-control input-vault" 
              name="nombre"
              placeholder="Ej: Fantasía Épica BCN"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- ZONA DEL BUSCADOR DE LIBROS --- */}
          <div className="form-group mb-3 position-relative">
            <label className="form-label fw-bold">Libro inicial</label>
            
            {!libroSeleccionado ? (
              <>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                  <input 
                    type="text" 
                    className="form-control input-vault border-start-0" 
                    placeholder="Escribe el título para buscar..."
                    value={busquedaLibro}
                    onChange={handleBuscarLibro}
                  />
                </div>
                
                {resultadosLibros.length > 0 && (
                  <ul 
                    className="list-group position-absolute w-100 shadow-lg mt-1 bg-white" 
                    style={{ 
                      zIndex: 9999, 
                      maxHeight: '220px', 
                      overflowY: 'auto', 
                      borderRadius: '10px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    {resultadosLibros.map(libro => (
                      <li 
                        key={libro.idLibro || libro.isbn || Math.random()} 
                        className="list-group-item list-group-item-action d-flex align-items-center gap-3" 
                        onClick={() => seleccionarLibro(libro)}
                        style={{ 
                          cursor: 'pointer', 
                          backgroundColor: '#ffffff', // Forzamos fondo blanco puro
                          border: 'none',
                          borderBottom: '1px solid #f0f0f0',
                          padding: '10px 15px'
                        }}
                      >
                        <img 
                          src={libro.portada || libro.fotoPortada || "https://via.placeholder.com/40x60"} 
                          alt="Portada" 
                          style={{ 
                            width: '45px', 
                            height: '65px', 
                            objectFit: 'cover', 
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                          }} 
                        />
                        <div className="d-flex flex-column">
                           <span className="fw-bold text-dark">{libro.titulo}</span>
                           {/* Añadimos también el autor pequeñito para que quede más profesional */}
                           <span className="text-muted small">{libro.autor}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-between p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: 'var(--color-verde-oscuro)' }}>
                <div className="d-flex align-items-center gap-3">
                   <img 
                      src={libroSeleccionado.portada || libroSeleccionado.fotoPortada} 
                      alt="Portada" 
                      style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                   />
                   <span className="fw-bold text-dark">{libroSeleccionado.titulo}</span>
                </div>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={quitarLibro}>
                    <i className="bi bi-trash"></i>
                </button>
              </div>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-bold">Descripción</label>
            <textarea 
              className="form-control input-vault" 
              name="descripcion"
              rows="3"
              placeholder="¿De qué trata este club? ¿Cada cuánto leéis?"
              value={formData.descripcion}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group mb-4">
            <label className="form-label fw-bold">Foto de portada (Opcional)</label>
            <input 
              type="file" 
              className="form-control input-vault" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="modal-footer-custom">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-crear">Crear Grupo</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CrearGrupoModal;