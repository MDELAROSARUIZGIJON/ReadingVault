package com.readingvault.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Comunidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idComunidad;

    @ManyToOne
    @JoinColumn(name = "id_libro")
    private Libro libro; // la comunidad es de un libro

    private String nombre;
    private String descripcion;
    private String fechaCreacion;
    private Integer paginaActual = 0;
    private Integer totalPaginas = 0;
    private String notaProgreso = "";

    private String foto;

    @OneToMany(mappedBy = "comunidad", cascade = CascadeType.ALL, orphanRemoval = true, fetch = jakarta.persistence.FetchType.EAGER)
    @JsonManagedReference
    private List<UsuarioComunidad> miembros = new ArrayList<>();

    @OneToMany(mappedBy = "comunidad", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MensajeComunidad> mensajes = new ArrayList<>();

}
