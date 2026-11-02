package com.maft.web;

import com.maft.domain.Inquiry;
import com.maft.repo.InquiryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryRepository repo;

    public InquiryController(InquiryRepository repo) {
        this.repo = repo;
    }

    /** All inquiries (admin only). */
    @GetMapping
    public List<Inquiry> all() {
        return repo.findAll();
    }

    /** Create a new inquiry (public - when customer submits cart). */
    @PostMapping
    public Inquiry create(@RequestBody Inquiry i) {
        String now = Instant.now().toString();
        if (i.createdAt == null) i.createdAt = now;
        i.updatedAt = now;
        if (i.status == null) i.status = "PENDING";
        return repo.save(i);
    }

    /** Get a single inquiry by id. */
    @GetMapping("/{id}")
    public ResponseEntity<Inquiry> one(@PathVariable String id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Update inquiry status/notes (admin only). */
    @PutMapping("/{id}")
    public ResponseEntity<Inquiry> update(@PathVariable String id, @RequestBody Inquiry i) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        i.id = id;
        i.updatedAt = Instant.now().toString();
        return ResponseEntity.ok(repo.save(i));
    }

    /** Delete an inquiry (admin only). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
