package com.maft.web;

import com.maft.service.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final Path uploadDir;
    private final Environment env;

    /** Storage quota in bytes used for the usage meter (default 1 GB = Supabase free tier). */
    @Value("${app.storage.limit-bytes:1073741824}")
    private long storageLimitBytes;

    @Autowired(required = false)
    private SupabaseStorageService storageService;

    public UploadController(@Value("${app.upload-dir:./uploads}") String dir,
                          Environment env) throws IOException {
        this.uploadDir = Paths.get(dir).toAbsolutePath();
        Files.createDirectories(this.uploadDir);
        this.env = env;
    }

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file,
                                   @RequestParam(value = "folder", defaultValue = "") String folder) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Empty file."));
        }
        String ct = file.getContentType();
        if (ct == null || !ct.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed."));
        }

        // Use Supabase Storage if supabase profile is active
        if (env.matchesProfiles("supabase") && storageService != null) {
            try {
                String publicUrl = storageService.uploadImage(file, folder);
                return ResponseEntity.ok(Map.of("url", publicUrl));
            } catch (IOException e) {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to upload to Supabase: " + e.getMessage()));
            }
        }

        // Fallback to local storage
        String ext = switch (ct) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/jpeg" -> ".jpg";
            default -> "";
        };
        String name = UUID.randomUUID().toString().replace("-", "") + ext;
        Path target = uploadDir.resolve(name);
        file.transferTo(target);
        return ResponseEntity.ok(Map.of("url", "/uploads/" + name));
    }

    /** Storage usage meter: bytes used, file count and the configured limit. */
    @GetMapping("/usage")
    public ResponseEntity<?> usage() {
        long usedBytes;
        long fileCount;
        String source;

        if (env.matchesProfiles("supabase") && storageService != null) {
            long[] u = storageService.getUsage();
            usedBytes = u[0];
            fileCount = u[1];
            source = "supabase";
        } else {
            long[] u = localUsage();
            usedBytes = u[0];
            fileCount = u[1];
            source = "local";
        }

        long limit = storageLimitBytes > 0 ? storageLimitBytes : 1L;
        double percent = Math.min(100.0, Math.round((usedBytes * 10000.0) / limit) / 100.0);
        return ResponseEntity.ok(Map.of(
                "usedBytes", usedBytes,
                "limitBytes", limit,
                "freeBytes", Math.max(0, limit - usedBytes),
                "fileCount", fileCount,
                "percentUsed", percent,
                "source", source));
    }

    private long[] localUsage() {
        final long[] acc = new long[2];
        try (var paths = Files.walk(uploadDir)) {
            paths.filter(Files::isRegularFile).forEach(p -> {
                try {
                    acc[0] += Files.size(p);
                    acc[1] += 1;
                } catch (IOException ignored) { /* skip unreadable file */ }
            });
        } catch (IOException ignored) { /* dir missing */ }
        return acc;
    }
}
