package com.maft.web;

import com.maft.domain.Colour;
import com.maft.repo.ColourRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colours")
public class ColourController {

    private final ColourRepository repo;

    public ColourController(ColourRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Colour> all() {
        return repo.findAll();
    }

    @PostMapping
    public Colour create(@RequestBody Colour c) {
        return repo.save(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Colour> update(@PathVariable String id, @RequestBody Colour c) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        c.id = id;
        return ResponseEntity.ok(repo.save(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
