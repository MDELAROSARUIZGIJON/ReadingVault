package com.readingvault.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.readingvault.models.Genero;
import com.readingvault.repositories.GeneroRepository; // Importante

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GeneroRepository generoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (generoRepository.count() == 0) {
            List<Genero> generos = List.of(
                new Genero("Arte", "art"),
                new Genero("Autoayuda", "self-help"),
                new Genero("Biografía", "biography"),
                new Genero("Ciencia Ficción", "science fiction"),
                new Genero("Clásicos", "classics"),
                new Genero("Crimen", "crime"),
                new Genero("Fantasía", "fantasy"),
                new Genero("Ficción", "fiction"),
                new Genero("Historia", "history"),
                new Genero("Comedia", "humor"),
                new Genero("Infantil", "juvenile fiction"),
                new Genero("Misterio", "mystery"),
                new Genero("Paranormal", "body, mind & spirit"),
                new Genero("Poesía", "poetry"),
                new Genero("Romance", "romance"),
                new Genero("Suspense", "suspense"),
                new Genero("Terror", "horror"),
                new Genero("Thriller", "thriller")
            );

            generoRepository.saveAll(generos);
            System.out.println(">> Base de datos poblada con éxito.");
        }
    }
}