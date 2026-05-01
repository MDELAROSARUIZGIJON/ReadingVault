package com.readingvault.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.dto.LibroExternoDTO;
import com.readingvault.models.Estanteria;
import com.readingvault.models.Libro;
import com.readingvault.models.LibroEstanteria;
import com.readingvault.repositories.EstanteriaRepository;
import com.readingvault.repositories.LibroEstanteriaRepository;
import com.readingvault.repositories.LibroRepository;

import jakarta.transaction.Transactional;

@Service
public class EstanteriaService {

    @Autowired
    private EstanteriaRepository estanteriaRepository;

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private LibroEstanteriaRepository libroEstanteriaRepository;

    // Guarda libro localmente y lo asocia a la estantería
    @Transactional
    public void agregarLibroAEstanteria(LibroExternoDTO libroExterno, Long usuarioId, String nombreEstanteria) {
        
        // Recupera el libro o lo crea con los datos completos
        Libro libroLocal = libroRepository
                .findByTituloAndAutor(libroExterno.getTitle(), libroExterno.getNombrePrimerAutor())
                .orElseGet(() -> {
                    Libro nuevoLibro = new Libro();
                    nuevoLibro.setTitulo(libroExterno.getTitle());
                    nuevoLibro.setAutor(libroExterno.getNombrePrimerAutor());
                    
                    // Asigna descripción o el texto mejorado si no hay datos
                    nuevoLibro.setDescripcion(libroExterno.getDescription() != null ? 
                            libroExterno.getDescription() : 
                            (libroExterno.getNumberOfPages() > 0 ? "Páginas: " + libroExterno.getNumberOfPages() : "Sin descripción disponible."));
                    
                    nuevoLibro.setFotoPortada(libroExterno.getCoverId());
                    
                    // Guarda la fecha e ISBN
                    nuevoLibro.setFechaPublicacion(libroExterno.getFechaPublicacion());
                    nuevoLibro.setIsbn(libroExterno.getIsbn());
                    
                    return libroRepository.save(nuevoLibro);
                });

        // Limpia relaciones anteriores
        eliminarLibroDeUsuario(usuarioId, libroLocal.getTitulo(), libroLocal.getAutor());

        // Sale si la orden es cancelar
        if ("cancelar".equalsIgnoreCase(nombreEstanteria)) {
            return; 
        }

        // Busca estantería y guarda la relación
        Estanteria estanteria = estanteriaRepository.findByUsuario_IdUsuarioAndNombre(usuarioId, nombreEstanteria)
                .orElseThrow(() -> new RuntimeException("La estantería '" + nombreEstanteria + "' no existe para este usuario"));

        LibroEstanteria relacion = new LibroEstanteria();
        relacion.setEstanteria(estanteria);
        relacion.setLibro(libroLocal); 
        libroEstanteriaRepository.save(relacion);
    }

    // Borra el libro de las estanterías del usuario
    @Transactional
    public void eliminarLibroDeUsuario(Long idUsuario, String titulo, String autor) {
        Optional<Libro> libro = libroRepository.findByTituloAndAutor(titulo, autor);

        if (libro.isPresent()) {
            libroEstanteriaRepository.deleteByLibroAndEstanteria_Usuario_IdUsuario(libro.get(), idUsuario);
        }
    }

    // Busca la estantería donde está el libro
    public Optional<String> obtenerNombreEstanteriaDelLibro(Long idUsuario, String titulo, String autor) {
        return libroRepository.findByTituloAndAutor(titulo, autor)
            .flatMap(libro -> libroEstanteriaRepository
                .findByLibroAndEstanteria_Usuario_IdUsuario(libro, idUsuario)
                .map(relacion -> relacion.getEstanteria().getNombre()));
    }

    // Crea estantería
    public Estanteria crearEstanteria(Estanteria estanteria) {
        return estanteriaRepository.save(estanteria);
    }

    // Busca estantería
    public Optional<Estanteria> buscarPorUsuarioYNombre(Long idUsuario, String nombre) {
        return estanteriaRepository.findByUsuario_IdUsuarioAndNombre(idUsuario, nombre);
    }

    // Guarda estantería
    public Estanteria guardar(Estanteria estanteria) {
        return estanteriaRepository.save(estanteria);
    }
}