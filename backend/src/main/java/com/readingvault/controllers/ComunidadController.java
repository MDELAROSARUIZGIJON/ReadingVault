package com.readingvault.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.readingvault.models.Comunidad;
import com.readingvault.models.Libro;
import com.readingvault.models.MensajeComunidad;
import com.readingvault.models.Usuario;
import com.readingvault.models.UsuarioComunidad;
import com.readingvault.repositories.ComunidadRepository;
import com.readingvault.repositories.LibroRepository;
import com.readingvault.repositories.MensajeComunidadRepository;
import com.readingvault.repositories.UsuarioComunidadRepository;
import com.readingvault.repositories.UsuarioRepository;
import com.readingvault.services.CloudinaryService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/comunidades")
@CrossOrigin(origins = "http://localhost:5173")
public class ComunidadController {

    private final MensajeComunidadRepository mensajeComunidadRepository;

    @Autowired
    private ComunidadRepository comunidadRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioComunidadRepository usuarioComunidadRepository;

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    ComunidadController(MensajeComunidadRepository mensajeComunidadRepository) {
        this.mensajeComunidadRepository = mensajeComunidadRepository;
    }

    @GetMapping
    public ResponseEntity<List<Comunidad>> obtenerTodasLasComunidades() {
        List<Comunidad> comunidades = comunidadRepository.findAll();
        return ResponseEntity.ok(comunidades);
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearComunidad(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("idUsuario") Long idUsuario,
            @RequestParam(value = "idLibro", required = false) Long idLibro,
            @RequestParam(value = "tituloLibro", required = false) String tituloLibro,
            @RequestParam(value = "autorLibro", required = false) String autorLibro,
            @RequestParam(value = "portadaLibro", required = false) String portadaLibro,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {

        try {
            // Comprobamos que el usuario existe
            Usuario creador = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            Comunidad nuevaComunidad = new Comunidad();
            nuevaComunidad.setNombre(nombre);
            nuevaComunidad.setDescripcion(descripcion);
            nuevaComunidad.setFechaCreacion(LocalDate.now().toString());

            Libro libroParaVincular = null;

            if (idLibro != null) {
                // Si ya viene con un ID real de la base de datos, lo usamos
                libroParaVincular = libroRepository.findById(idLibro).orElse(null);
            } else if (tituloLibro != null && !tituloLibro.isEmpty()) {
                // Si no tiene ID (es de Google Books), miramos si ya existe por Título y Autor
                Optional<Libro> libroExistente = libroRepository.findByTituloAndAutor(tituloLibro, autorLibro);

                if (libroExistente.isPresent()) {
                    libroParaVincular = libroExistente.get();
                } else {
                    // Si el libro no existe de ninguna forma en nuestra BD, lo creamos
                    Libro nuevoLibro = new Libro();
                    nuevoLibro.setTitulo(tituloLibro);
                    nuevoLibro.setAutor(autorLibro != null ? autorLibro : "Autor Desconocido");
                    nuevoLibro.setFotoPortada(portadaLibro);
                    nuevoLibro.setDescripcion("Libro sincronizado automáticamente desde un club de lectura.");
                    nuevoLibro.setGeneros("General");

                    // Lo guardamos para que la base de datos le asigne un ID real
                    libroParaVincular = libroRepository.save(nuevoLibro);
                }
            }

            if (libroParaVincular != null) {
                nuevaComunidad.setLibro(libroParaVincular);
            }

            // Foto de la comunidad
            if (foto != null && !foto.isEmpty()) {
                String urlFoto = cloudinaryService.subirFoto(foto);
                nuevaComunidad.setFoto(urlFoto);
            } else {
                nuevaComunidad.setFoto(
                        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop");
            }

            // Guardamos la comunidad
            Comunidad comunidadGuardada = comunidadRepository.save(nuevaComunidad);

            // Relación del creador como admin
            UsuarioComunidad relacion = new UsuarioComunidad();
            relacion.setUsuario(creador);
            relacion.setComunidad(comunidadGuardada);
            relacion.setFechaUnion(LocalDate.now().toString());
            relacion.setRol("admin");

            usuarioComunidadRepository.save(relacion);

            return ResponseEntity.ok(comunidadGuardada);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear el club de lectura: " + e.getMessage());
        }
    }

    // Obtener el detalle de una comunidad (incluyendo libro y mensajes)
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerDetalleComunidad(@PathVariable("id") Long id) {
        try {
            Comunidad comunidad = comunidadRepository.findById(id)
                    .orElseThrow(() -> new Exception("La comunidad no existe"));

            // Para que los mensajes vengan ordenados por fecha descendente:
            // List<MensajeComunidad> mensajes =
            // mensajeRepository.findByComunidadOrderByFechaDesc(comunidad);
            // comunidad.setMensajes(mensajes);

            return ResponseEntity.ok(comunidad);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 2. Publicar un mensaje en el muro
    @PostMapping("/{id}/mensajes")
    public ResponseEntity<?> publicarMensaje(
            @PathVariable("id") Long idComunidad,
            @RequestBody Map<String, Object> payload) {
        try {
            Long idUsuario = Long.valueOf(payload.get("idUsuario").toString());
            String contenido = (String) payload.get("contenido");

            Comunidad comunidad = comunidadRepository.findById(idComunidad)
                    .orElseThrow(() -> new Exception("Comunidad no encontrada"));

            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            MensajeComunidad nuevoMensaje = new MensajeComunidad();
            nuevoMensaje.setContenido(contenido);
            nuevoMensaje.setUsuario(usuario);
            nuevoMensaje.setComunidad(comunidad);
            // Formateamos la fecha actual de forma amigable (Ej: "16 May, 13:20")
            nuevoMensaje.setFecha(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM, HH:mm")));

            mensajeComunidadRepository.save(nuevoMensaje);

            return ResponseEntity.ok(nuevoMensaje);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al publicar mensaje: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/unirse")
    @Transactional
    public ResponseEntity<?> unirseGrupo(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long idUsuario = payload.get("idUsuario");

        // Si ya existe devolvemos la comunidad actual
        // para que el frontend se sincronice sin romperse.
        if (usuarioComunidadRepository.existsByComunidadIdComunidadAndUsuarioIdUsuario(id, idUsuario)) {
            return ResponseEntity.ok(comunidadRepository.findById(id).get());
        }

        // Si no existe, lo creamos
        Comunidad comunidad = comunidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comunidad no encontrada"));
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UsuarioComunidad relacion = new UsuarioComunidad();
        relacion.setUsuario(usuario);
        relacion.setComunidad(comunidad);
        relacion.setRol("miembro");
        relacion.setFechaUnion(LocalDate.now().toString());

        usuarioComunidadRepository.save(relacion);

        // Forzamos el refresco para devolver la comunidad con el nuevo miembro
        return ResponseEntity.ok(comunidadRepository.findById(id).get());
    }

    @PostMapping("/{id}/actualizar-progreso")
    public ResponseEntity<?> actualizarProgreso(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Comunidad c = comunidadRepository.findById(id).get();
        c.setPaginaActual(Integer.parseInt(payload.get("pagina").toString()));
        c.setTotalPaginas(Integer.parseInt(payload.get("total").toString()));
        c.setNotaProgreso(payload.get("nota").toString());
        comunidadRepository.save(c);
        return ResponseEntity.ok(c);
    }

    @PostMapping("/{id}/cambiar-libro")
    public ResponseEntity<?> cambiarLibro(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Comunidad c = comunidadRepository.findById(id).get();
        Libro libroFinal = null;

        if (payload.containsKey("idLibro") && payload.get("idLibro") != null) {
            Long idLibro = Long.valueOf(payload.get("idLibro").toString());
            libroFinal = libroRepository.findById(idLibro).get();
        } else {
                // 1. Extraemos las variables del payload (¡Esto arregla las líneas rojas!)
                String titulo = (String) payload.get("tituloLibro");
                String autor = (String) payload.get("autorLibro");
                
                Libro nuevo = new Libro();
                nuevo.setTitulo(titulo);
                nuevo.setAutor(autor);
                nuevo.setFotoPortada((String) payload.get("portadaLibro"));
                
                // 2. Manejo limpio de las páginas (¡Esto arregla la línea amarilla!)
                if (payload.containsKey("paginasLibro") && payload.get("paginasLibro") != null) {
                    Object paginasObj = payload.get("paginasLibro");
                    if (paginasObj instanceof Integer) {
                        // Si el JSON ya lo mandó como número, lo usamos directo
                        nuevo.setPaginas((Integer) paginasObj);
                    } else {
                        // Si por algún motivo llega como texto, lo convertimos
                        nuevo.setPaginas(Integer.parseInt(paginasObj.toString()));
                    }
                }
                
                nuevo.setDescripcion("Añadido desde comunidad.");
                libroFinal = libroRepository.save(nuevo);
            }

        c.setLibro(libroFinal);
        c.setPaginaActual(0); // Reseteamos progreso
        c.setTotalPaginas(0);
        c.setNotaProgreso("");
        comunidadRepository.save(c);
        
        return ResponseEntity.ok(c);
    }

    @GetMapping("/buscar-libro-externo")
    public ResponseEntity<?> buscarLibroGoogle(@RequestParam("q") String query) {
        try {
            String queryLimpia = query.replace(" ", "%20");
            String url = "https://www.googleapis.com/books/v1/volumes?q=" + queryLimpia + "&maxResults=10";

            // Hacemos la llamada directa a Google Books
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String respuestaJson = restTemplate.getForObject(url, String.class);

            // Devolvemos el JSON de Google tal cual a React
            return ResponseEntity.ok(respuestaJson);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al buscar en Google Books: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/salir")
    @Transactional 
    public ResponseEntity<?> salirGrupo(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Long idUsuario = Long.valueOf(payload.get("idUsuario").toString());
        
        // Buscamos si existe la relación entre este usuario y esta comunidad
        Optional<UsuarioComunidad> relacion = usuarioComunidadRepository
                .findByComunidadIdComunidadAndUsuarioIdUsuario(id, idUsuario);
        
        // Si existe, la borramos
        if (relacion.isPresent()) {
            usuarioComunidadRepository.delete(relacion.get());
        }

        // Volvemos a buscar la comunidad (ahora ya sin ese miembro) para mandársela a React
        Comunidad comunidadActualizada = comunidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comunidad no encontrada"));
        
        return ResponseEntity.ok(comunidadActualizada);
    }

    @DeleteMapping("/mensajes/{idMensaje}")
    @Transactional
    public ResponseEntity<?> borrarMensaje(@PathVariable Long idMensaje) {
        // Buscamos el mensaje y lo eliminamos
        if (mensajeComunidadRepository.existsById(idMensaje)) {
            mensajeComunidadRepository.deleteById(idMensaje);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/mensajes/{idMensaje}")
    public ResponseEntity<?> editarMensaje(@PathVariable Long idMensaje, @RequestBody Map<String, String> payload) {
        return mensajeComunidadRepository.findById(idMensaje).map(msg -> {
            msg.setContenido(payload.get("contenido"));
            MensajeComunidad actualizado = mensajeComunidadRepository.save(msg);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

}