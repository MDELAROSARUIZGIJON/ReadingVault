package com.readingvault.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.Estanteria;

@Repository
public interface EstanteriaRepository extends JpaRepository<Estanteria, Long> {
}
