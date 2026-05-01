package com.readingvault.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LibroExternoDTO {

    // Título del libro
    private String title;

    // Lista de autores
    private List<String> authorNames;

    // Número de páginas
    private int numberOfPages;

    // URL de la imagen de portada
    private String coverId;

    // Valoración media
    private double averageRating;

    // Descripción completa del libro
    private String description;
    
    // Fecha de publicación
    private String fechaPublicacion;
    
    // ISBN
    private String isbn;

    // Campo auxiliar para facilitar el guardado
    private String nombrePrimerAutor;

    /**
     * Lógica para obtener siempre un autor válido al persistir el libro.
     */
    public String getNombrePrimerAutor() {
        if (nombrePrimerAutor != null && !nombrePrimerAutor.isEmpty()) {
            return nombrePrimerAutor;
        }
        return (authorNames != null && !authorNames.isEmpty()) 
                ? authorNames.get(0) 
                : "Autor desconocido";
    }

    public void setNombrePrimerAutor(String nombrePrimerAutor) {
        this.nombrePrimerAutor = nombrePrimerAutor;
    }
}