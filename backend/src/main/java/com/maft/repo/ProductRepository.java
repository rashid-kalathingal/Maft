package com.maft.repo;

import com.maft.domain.Product;
import com.maft.web.ProductCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findBySlug(String slug);

    /**
     * Scalar-only projection of every product for list/card views. Selects no
     * element-collections, so it runs as a single fast query (the full entity's
     * eager variants/images/specs make a 200-row fetch time out over the pooler).
     */
    @Query("""
        select new com.maft.web.ProductCard(
            p.id, p.name, p.slug, p.sku, p.categoryId, p.shortDescription,
            p.price, p.imageLabel, p.thumbnailUrl, p.hasVariants, p.stockQuantity,
            p.isActive, p.isFeatured, p.isNewArrival, p.sortOrder,
            p.availability, p.qualityGrade, p.replacementGuarantee,
            p.createdAt, p.updatedAt)
        from Product p
        order by p.sortOrder asc
    """)
    List<ProductCard> findAllCards();
}
