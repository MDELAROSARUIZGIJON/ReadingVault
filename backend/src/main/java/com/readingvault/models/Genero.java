package com.readingvault.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class Genero {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGenero;
    
    private String nombre;
    private String nombreIngles;

    public Genero(String nombre, String nombreIngles) {
        this.nombre = nombre;
        this.nombreIngles = nombreIngles;
    }
}