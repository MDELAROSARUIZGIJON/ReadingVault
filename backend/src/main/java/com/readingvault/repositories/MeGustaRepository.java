package com.readingvault.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.MeGusta;

@Repository
public interface MeGustaRepository extends JpaRepository<MeGusta, Long> {
}
