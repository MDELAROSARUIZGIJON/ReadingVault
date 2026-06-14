package com.readingvault.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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

import com.readingvault.models.Genero;
import com.readingvault.models.Usuario;
import com.readingvault.repositories.ComunidadRepository;
import com.readingvault.repositories.EstanteriaRepository;
import com.readingvault.repositories.GeneroRepository;
import com.readingvault.repositories.LibroEstanteriaRepository;
import com.readingvault.repositories.UsuarioRepository;
import com.readingvault.services.CloudinaryService;
import com.readingvault.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private GeneroRepository generoRepository;
    @Autowired
    private EstanteriaRepository estanteriaRepository;
    @Autowired
    private LibroEstanteriaRepository libroEstanteriaRepository;
    @Autowired
    private ComunidadRepository comunidadRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPerfil(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(id);

        return usuario.map(u -> {
            u.setPassword(null);
            return ResponseEntity.ok(u);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodosLosUsuarios() {
        // 1. Obtenemos todos los usuarios de la base de datos
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        // 2. Estructura de respuesta combinada para React
        List<Map<String, Object>> respuesta = new java.util.ArrayList<>();
        
        for (Usuario u : usuarios) {
            Map<String, Object> userMap = new java.util.HashMap<>();
            userMap.put("idUsuario", u.getIdUsuario());
            userMap.put("nombreUsuario", u.getNombreUsuario());
            userMap.put("fotoPerfil", u.getFotoPerfil());
            userMap.put("rol", u.getRol());
            userMap.put("biografia", u.getBiografia());
            userMap.put("localidad", u.getLocalidad());
            
            // 3. Buscamos la estantería "Leído" de este usuario concreto
            List<com.readingvault.models.Estanteria> estanteriasLeido = estanteriaRepository
                    .findByUsuarioIdUsuarioAndNombreIgnoreCase(u.getIdUsuario(), "Leído");
            
            long leidos = 0;
            
            // 4. Si encontramos la estantería, le pedimos los libros a la tabla intermedia
            if (!estanteriasLeido.isEmpty()) {
                Long idEstanteria = estanteriasLeido.get(0).getIdEstanteria();
                leidos = libroEstanteriaRepository.findByEstanteriaIdEstanteria(idEstanteria).size();
            }
            
            // Pasamos el total real calculado a la tarjeta de React
            userMap.put("totalLibros", leidos);
            
            respuesta.add(userMap);
        }
        
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/{id}/actualizar")
    public ResponseEntity<?> actualizarDatos(@PathVariable Long id, @RequestBody Usuario usuarioDatos)
            throws Exception {
        Usuario actualizado = usuarioService.actualizarPerfil(id, usuarioDatos);
        if (actualizado != null) {
            actualizado.setPassword(null);
            return ResponseEntity.ok(actualizado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    @PutMapping("/{id}/generos")
    public ResponseEntity<?> actualizarGeneros(@PathVariable Long id, @RequestBody List<String> nombresGeneros) {
        try {
            // Convertimos nombres a entidades existentes en la BD
            Set<Genero> generos = nombresGeneros.stream()
                    .map(nombre -> generoRepository.findByNombre(nombre)
                            .orElseThrow(() -> new RuntimeException(
                                    "El género '" + nombre + "' no existe en la base de datos")))
                    .collect(Collectors.toSet());

            // El servicio se encarga de la persistencia
            Usuario usuarioActualizado = usuarioService.actualizarGenerosFavoritos(id, generos);

            // Limpiar password por seguridad
            usuarioActualizado.setPassword(null);

            return ResponseEntity.ok(usuarioActualizado);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar géneros: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/actualizar-foto")
    public ResponseEntity<?> actualizarFoto(@PathVariable Long id, @RequestParam("foto") MultipartFile archivo) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            // Subir a Cloudinary y obtener URL
            String urlNube = cloudinaryService.subirFoto(archivo);

            // Guardar esa URL directamente en la base de datos
            usuario.setFotoPerfil(urlNube);
            usuarioService.guardarSinEncriptar(usuario);

            return ResponseEntity.ok(Map.of("fotoPerfil", urlNube));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/eliminar-foto")
    public ResponseEntity<?> eliminarFoto(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            // Ponemos la URL por defecto (la misma que usas en el frontend como fallback)
            String fotoDefecto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            usuario.setFotoPerfil(fotoDefecto);

            // Guardamos el cambio
            usuarioService.guardarSinEncriptar(usuario);

            return ResponseEntity.ok(Map.of("fotoPerfil", fotoDefecto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar foto: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/eliminar")
    public ResponseEntity<?> eliminarCuenta(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            // Borrar la foto de Cloudinary si no es la por defecto
            String urlFoto = usuario.getFotoPerfil();
            if (urlFoto != null && urlFoto.contains("cloudinary")) {
                String publicId = cloudinaryService.extraerPublicId(urlFoto);
                cloudinaryService.eliminarFoto(publicId);
            }

            // Borrar de la base de datos
            usuarioService.eliminar(id);

            return ResponseEntity.ok(Map.of("mensaje", "Usuario y datos eliminados con éxito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/actualizar-reto")
    public ResponseEntity<?> actualizarReto(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        // Validar que nos llega el número
        if (!payload.containsKey("objetivoLectura")) {
            return ResponseEntity.badRequest().body("Falta el campo objetivoLectura");
        }
        
        int nuevoObjetivo = Integer.parseInt(payload.get("objetivoLectura").toString());
        
        // Buscar al usuario, cambiar el campo y GUARDAR
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setObjetivoLectura(nuevoObjetivo);
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Manejar la privacidad
    @PutMapping("/{id}/privacidad")
    public ResponseEntity<?> actualizarPrivacidad(@PathVariable Long id, @RequestBody Map<String, String> privacidad) {
        try {
            Usuario actualizado = usuarioService.actualizarPrivacidad(id, privacidad);
            
            actualizado.setPassword(null);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{idUsuario}/contar")
        public ResponseEntity<Long> contarGrupos(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(comunidadRepository.countByMiembrosUsuarioIdUsuario(idUsuario));
    }
}