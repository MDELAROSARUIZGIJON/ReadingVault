import { useState, useEffect, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import "../assets/css/ajustes.css"; 

export default function EditarPerfilForm({ user }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    localidad: "",
    biografia: "",
    nombreUsuario: "",
    email: "",
    password: "",
  });

  // --- 2. ESTADOS PARA EL RECORTE ---
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [zoom, setZoom] = useState(1.2);
  const editorRef = useRef(null);
  // Estado para la previsualización local antes de recargar la página
  const [fotoPrevisualizacion, setFotoPrevisualizacion] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellidos: user.apellidos || "",
        fechaNacimiento: user.fechaNacimiento || "",
        localidad: user.localidad || "",
        biografia: user.biografia || "",
        nombreUsuario: user.nombreUsuario || "",
        email: user.email || "",
        password: "",
      });
      // Inicializar la foto con la que viene de la base de datos
      setFotoPrevisualizacion(user.fotoPerfil);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. MODIFICAR: Función para capturar foto, NO SUBIRLA AÚN ---
  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    // Validar que sean solo imágenes
    if (!archivo.type.startsWith("image/")) {
      alert("Por favor, selecciona una imagen válida (jpg, png).");
      return;
    }

    // EN LUGAR DE SUBIR, ABRIMOS EL EDITOR
    setImagenOriginal(archivo);
    // Limpiamos el input file para que se pueda volver a seleccionar la misma imagen
    e.target.value = ""; 
  };

  // --- 4. NUEVA FUNCIÓN: PROCESAR RECORTE Y SUBIR A BACKEND ---
  const handleGuardarRecorte = async () => {
    if (editorRef.current) {
      // 1. Obtener el recorte del lienzo (Canvas)
      const canvas = editorRef.current.getImageScaledToCanvas();

      // 2. Convertir el lienzo a un Blob JPEG comprimido (ligero para Cloudinary)
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const token = localStorage.getItem("token");

        // 3. Reutilizamos tu lógica de FormData existente
        const formDataFoto = new FormData();
        // Importante: 'blob' sustituye al 'archivo' original, 'perfil.jpg' es el nombre
        formDataFoto.append("foto", blob, "perfil.jpg"); 

        try {
          // Reutilizamos tu llamada fetch actual
          const response = await fetch(
            `http://localhost:8080/api/usuarios/${user.idUsuario}/actualizar-foto`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formDataFoto,
            }
          );

          if (response.ok) {
            const data = await response.json();

            // Actualizar el LocalStorage (tu lógica actual)
            const userSesion = JSON.parse(localStorage.getItem("usuario"));
            userSesion.fotoPerfil = data.fotoPerfil;
            localStorage.setItem("usuario", JSON.stringify(userSesion));

            // Actualizar previsualización local y cerrar editor
            setFotoPrevisualizacion(data.fotoPerfil);
            setImagenOriginal(null); // Oculta el modal
            setZoom(1.2); // Resetea zoom

            alert("¡Foto de perfil actualizada!");

            // Recargar para ver los cambios en todas partes (tu lógica actual)
            // window.location.reload(); 
            // ^--- Opcional: Si actualizas fotoPrevisualizacion, no necesitas reload inmediato
          } else {
            alert("Error al subir la foto.");
          }
        } catch (error) {
          console.error("Error de red:", error);
        }
      }, "image/jpeg", 0.8); // Comprimimos al 80% de calidad
    }
  };

  const handleEliminarFoto = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar tu foto de perfil?"
      )
    )
      return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${user.idUsuario}/eliminar-foto`,
        {
          method: "POST", 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Actualizar el LocalStorage
        const userSesion = JSON.parse(localStorage.getItem("usuario"));
        userSesion.fotoPerfil = data.fotoPerfil;
        localStorage.setItem("usuario", JSON.stringify(userSesion));

        // Actualizar previsualización local
        setFotoPrevisualizacion(data.fotoPerfil);
        alert("Foto eliminada correctamente");
        // window.location.reload();
      } else {
        alert("No se pudo eliminar la foto.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  // ... handleSubmit sin cambios ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const idUsuario = user.idUsuario;
    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${idUsuario}/actualizar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const usuarioActualizado = await response.json();
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        alert("¡Perfil actualizado con éxito!");
        window.location.href = "/perfilUsuario";
      } else {
        const errorText = await response.text();
        alert("Error al actualizar: " + errorText);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const FOTO_DEFAULT = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <>
      <form onSubmit={handleSubmit} className="row g-4">
        {/* COLUMNA IZQUIERDA (Sin cambios) */}
        <div className="col-lg-8">
          <div className="ajustes-form-container">
            <h4 className="mb-4 fw-bold">Datos Personales</h4>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="label-ajustes">Nombre</label>
                <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Apellidos</label>
                <input type="text" name="apellidos" className="form-control" value={formData.apellidos} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Ciudad/Localidad</label>
                <input type="text" name="localidad" className="form-control" value={formData.localidad} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="label-ajustes">Sobre mí (Biografía)</label>
                <textarea name="biografia" className="form-control" rows="3" value={formData.biografia} onChange={handleChange}></textarea>
              </div>

              <h4 className="mt-5 mb-3 fw-bold">Credenciales y Acceso</h4>
              <div className="col-md-6">
                <label className="label-ajustes">Nombre de usuario</label>
                <input type="text" name="nombreUsuario" className="form-control" value={formData.nombreUsuario} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Correo Electrónico</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <label className="label-ajustes">Nueva Contraseña</label>
                <input type="password" name="password" className="form-control" placeholder="Dejar en blanco para no cambiar" value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <div className="text-center mt-5">
              <button type="submit" className="btn-vault px-5 py-2 shadow">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (Cambio en img src) */}
        <div className="col-lg-4 text-center">
          <div className="perfil-card p-4 h-100 d-flex flex-column align-items-center">
            <h5 className="sidebar-titulo-ajustes">Foto de Perfil</h5>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFotoChange}
              accept="image/*"
            />
            <img
              // Usamos el estado de previsualización local
              src={fotoPrevisualizacion || FOTO_DEFAULT}
              className="foto-perfil-circulo mb-3"
              alt="Perfil"
              // Usamos objectFit para que no se deforme la preview
              style={{ objectFit: 'cover' }} 
            />

            <div className="d-grid gap-2 w-100">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => fileInputRef.current.click()}
              >
                Cambiar Foto
              </button>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleEliminarFoto}>
                Eliminar Foto
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* --- MODAL DE RECORTE --- */}
      {imagenOriginal && (
        <div className="crop-modal-overlay">
          <div className="crop-modal-content text-center">
            <h4 className="mb-2">Ajusta tu foto</h4>
            <p className="text-muted mb-3">Arrastra la imagen para encuadrar tu perfil.</p>
            
            <div className="editor-wrapper d-inline-block border bg-light">
              <AvatarEditor
                ref={editorRef}
                image={imagenOriginal}
                width={200}
                height={200}
                border={50}
                borderRadius={100}
                scale={zoom}
                rotate={0}
              />
            </div>

            {/* Control de Zoom */}
            <div className="zoom-control mt-3 d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-zoom-out"></i>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="form-range"
                style={{ maxWidth: '200px' }}
              />
              <i className="bi bi-zoom-in"></i>
            </div>

            <div className="action-buttons mt-4 gap-2 d-flex justify-content-center">
              <button 
                onClick={() => setImagenOriginal(null)} // Cancela y cierra
                className="btn btn-outline-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={handleGuardarRecorte} // Procesa, comprime y sube
                className="btn btn-primary"
              >
                Aplicar y Subir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}