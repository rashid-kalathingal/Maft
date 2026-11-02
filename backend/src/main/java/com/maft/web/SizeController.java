package com.maft.web;

import com.maft.domain.SizeOption;
import com.maft.repo.SizeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sizes")
public class SizeController {

    private final SizeRepository repo;

    public SizeController(SizeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<SizeOption> all() {
        return repo.findAll();
    }

    @PostMapping
    public SizeOption create(@RequestBody SizeOption s) {
        return repo.save(s);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SizeOption> update(@PathVariable String id, @RequestBody SizeOption s) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        s.id = id;
        return ResponseEntity.ok(repo.save(s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
