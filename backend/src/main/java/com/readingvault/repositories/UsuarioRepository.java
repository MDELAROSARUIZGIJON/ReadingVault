// Repositorio para la tabla 'usuario'
package com.readingvault.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Aquí puedes buscar por email, útil para el futuro login
    Usuario findByEmail(String email);
}