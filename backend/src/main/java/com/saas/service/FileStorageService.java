package com.saas.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private final Path uploadDir = Paths.get("uploads/avatars");

    public FileStorageService() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar diretório de uploads", e);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Apenas imagens são permitidas");
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("Imagem muito grande. Máximo 5MB");
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            Path targetLocation = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/avatars/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith("/uploads/avatars/")) {
                String filename = fileUrl.substring("/uploads/avatars/".length());
                Path filePath = uploadDir.resolve(filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            System.err.println("Erro ao deletar arquivo: " + e.getMessage());
        }
    }
}
