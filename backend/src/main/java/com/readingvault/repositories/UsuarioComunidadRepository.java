package com.readingvault.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.UsuarioComunidad;

import jakarta.transaction.Transactional;

@Repository
public interface UsuarioComunidadRepository extends JpaRepository<UsuarioComunidad, Long> {
    // Este método buscará la fila que coincida con ambos IDs y la borrará
    @Transactional
    void deleteByComunidadIdComunidadAndUsuarioIdUsuario(Long idComunidad, Long idUsuario);
    
    // También te puede ser útil este para comprobar si ya existe la relación
    boolean existsByComunidadIdComunidadAndUsuarioIdUsuario(Long idComunidad, Long idUsuario);

    Optional<UsuarioComunidad> findByComunidadIdComunidadAndUsuarioIdUsuario(Long idComunidad, Long idUsuario);

    List<UsuarioComunidad> findByComunidadIdComunidad(Long idComunidad);
}