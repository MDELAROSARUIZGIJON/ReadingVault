package com.readingvault.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar los datos de libros obtenidos de la API de Google Books.
 */
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

    // Aquí se guarda directamente la URL de la imagen (thumbnail)
    private String coverId;

    /**
     * Devuelve el primer autor de la lista. Si no hay autores, devuelve "Autor
     * desconocido".
     */
    public String getNombrePrimerAutor() {
        return (authorNames != null && !authorNames.isEmpty()) ? authorNames.get(0) : "Autor desconocido";
    }
}
