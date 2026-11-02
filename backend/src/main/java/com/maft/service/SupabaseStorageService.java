package com.maft.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Profile("supabase")
public class SupabaseStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private com.maft.config.SupabaseStorageConfig config;

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        String fileName = generateFileName(file.getOriginalFilename());
        String path = folder.isEmpty() ? fileName : folder + "/" + fileName;

        String uploadUrl = String.format("%s/storage/v1/object/%s/%s",
                config.getSupabaseUrl(), config.getStorageBucket(), path);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("apikey", config.getSupabaseKey());
        headers.set("Authorization", "Bearer " + config.getSupabaseKey());

        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return fileName;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String publicUrl = String.format("%s/storage/v1/object/public/%s/%s",
                        config.getSupabaseUrl(), config.getStorageBucket(), path);
                log.info("Successfully uploaded image to Supabase: {}", publicUrl);
                return publicUrl;
            } else {
                throw new IOException("Failed to upload image: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error uploading image to Supabase", e);
            throw new IOException("Failed to upload image to Supabase: " + e.getMessage(), e);
        }
    }

    /** Total bytes used and file count across the whole storage bucket. */
    public long[] getUsage() {
        long[] acc = new long[] { 0L, 0L }; // {bytes, files}
        try {
            sumPrefix("", acc, 0);
        } catch (Exception e) {
            log.warn("Could not compute Supabase storage usage: {}", e.getMessage());
        }
        return acc;
    }

    private final com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();

    private void sumPrefix(String prefix, long[] acc, int depth) throws Exception {
        if (depth > 6) return; // guard against pathological nesting
        String listUrl = String.format("%s/storage/v1/object/list/%s",
                config.getSupabaseUrl(), config.getStorageBucket());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", config.getSupabaseKey());
        headers.set("Authorization", "Bearer " + config.getSupabaseKey());

        int offset = 0;
        while (true) {
            String body = String.format(
                    "{\"prefix\":\"%s\",\"limit\":1000,\"offset\":%d,\"sortBy\":{\"column\":\"name\",\"order\":\"asc\"}}",
                    prefix, offset);
            HttpEntity<String> req = new HttpEntity<>(body, headers);
            ResponseEntity<String> resp = restTemplate.postForEntity(listUrl, req, String.class);
            com.fasterxml.jackson.databind.JsonNode arr = mapper.readTree(resp.getBody());
            if (arr == null || !arr.isArray() || arr.isEmpty()) break;
            for (com.fasterxml.jackson.databind.JsonNode node : arr) {
                String name = node.path("name").asText("");
                com.fasterxml.jackson.databind.JsonNode meta = node.get("metadata");
                boolean isFile = node.hasNonNull("id") && meta != null && meta.has("size");
                if (isFile) {
                    acc[0] += meta.path("size").asLong(0);
                    acc[1] += 1;
                } else if (!name.isEmpty()) {
                    // Folder — recurse into it.
                    sumPrefix(prefix.isEmpty() ? name + "/" : prefix + name + "/", acc, depth + 1);
                }
            }
            if (arr.size() < 1000) break;
            offset += 1000;
        }
    }

    private String generateFileName(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return UUID.randomUUID().toString().replace("-", "") + extension;
    }
}
