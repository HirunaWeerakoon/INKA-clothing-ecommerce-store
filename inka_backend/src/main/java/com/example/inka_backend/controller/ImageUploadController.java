package com.example.inka_backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    private final Cloudinary cloudinary;

    public ImageUploadController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // POST /api/images/upload — uploads image to Cloudinary, returns the URL
    @PostMapping("/upload")
    public ResponseEntity<Map> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "inka-reviews",
                            "resource_type", "image"
                    )
            );
            return ResponseEntity.ok(Map.of(
                    "url", uploadResult.get("secure_url").toString()
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Image upload failed"));
        }
    }
}