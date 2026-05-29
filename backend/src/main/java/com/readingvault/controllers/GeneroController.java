package com.readingvault.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readingvault.models.Genero;
import com.readingvault.repositories.GeneroRepository;

@RestController
@RequestMapping("/api/generos")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class GeneroController {

    @Autowired
    private GeneroRepository generoRepository;

    @GetMapping
    public List<Genero> obtenerTodos() {
        return generoRepository.findAll();
    }
}