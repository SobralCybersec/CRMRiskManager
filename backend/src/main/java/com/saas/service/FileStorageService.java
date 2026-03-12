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

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final String UPLOAD_PATH = "uploads/avatars";
    private final Path uploadDir = Paths.get(UPLOAD_PATH);

    public FileStorageService() {
        createUploadDirectory();
    }

    private void createUploadDirectory() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar diretório de uploads", e);
        }
    }

    public String storeFile(MultipartFile file) {
        validateFile(file);

        String filename = generateUniqueFilename(file.getOriginalFilename());
        Path targetLocation = uploadDir.resolve(filename);

        copyFile(file, targetLocation);

        return "/" + UPLOAD_PATH + "/" + filename;
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Apenas imagens são permitidas");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("Imagem muito grande. Máximo 5MB");
        }
    }

    private String generateUniqueFilename(String originalFilename) {
        String extension = extractFileExtension(originalFilename);
        return UUID.randomUUID().toString() + extension;
    }

    private String extractFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return ".jpg";
    }

    private void copyFile(MultipartFile file, Path targetLocation) {
        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String fileUrl) {
        if (!isValidFileUrl(fileUrl)) {
            return;
        }

        String filename = extractFilename(fileUrl);
        Path filePath = uploadDir.resolve(filename);

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar arquivo: " + e.getMessage(), e);
        }
    }

    private boolean isValidFileUrl(String fileUrl) {
        return fileUrl != null && fileUrl.startsWith("/" + UPLOAD_PATH + "/");
    }

    private String extractFilename(String fileUrl) {
        return fileUrl.substring(("/" + UPLOAD_PATH + "/").length());
    }
}
