package com.maft.web;

import com.maft.domain.Product;
import com.maft.repo.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    /** All products (admin view). The frontend filters/sorts client-side. */
    @GetMapping
    public List<Product> all() {
        return repo.findAll();
    }

    /** Lookup by id or slug (public product page uses the slug). */
    @GetMapping("/{idOrSlug}")
    public ResponseEntity<Product> one(@PathVariable String idOrSlug) {
        return repo.findById(idOrSlug)
                .or(() -> repo.findBySlug(idOrSlug))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product create(@RequestBody Product p) {
        String now = Instant.now().toString();
        if (p.createdAt == null) p.createdAt = now;
        p.updatedAt = now;
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product p) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        p.id = id;
        p.updatedAt = Instant.now().toString();
        return ResponseEntity.ok(repo.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
