package com.readingvault.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Inyección de variables seguras
    public CloudinaryService(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {
        
        // Instancia con credenciales ocultas
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
    }

    public String subirFoto(MultipartFile archivo) throws IOException {
        // Sube a la carpeta asignada
        Map uploadResult = cloudinary.uploader().upload(archivo.getBytes(), 
            ObjectUtils.asMap("folder", "fotos-perfil-readingvault"));
        
        // Devuelve URL segura
        return uploadResult.get("secure_url").toString();
    }

    public String extraerPublicId(String url) {
        if (url == null || !url.contains("cloudinary")) return null;
        
        try {
            // Extrae ruta base
            String[] parts = url.split("/");
            String folderAndName = parts[parts.length - 2] + "/" + parts[parts.length - 1];
            
            // Retira extensión
            return folderAndName.substring(0, folderAndName.lastIndexOf("."));
        } catch (Exception e) {
            return null;
        }
    }

    public void eliminarFoto(String publicId) throws IOException {
        if (publicId == null) return;
        // Borra recurso de la nube
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}