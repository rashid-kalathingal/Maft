package com.maft.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    public String id;
    public String name;
    public String slug;
    public String sku;
    public String categoryId;

    @Column(columnDefinition = "TEXT")
    public String shortDescription;
    @Column(columnDefinition = "TEXT")
    public String description;
    public String imageLabel;

    public boolean hasVariants;

    /** Optional price (INR). Null/empty means "enquire for price". */
    public Double price;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_variants", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "pos")
    public List<Variant> variants = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "pos")
    @Lob
    @Column(name = "url")
    public List<String> imageUrls = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_specifications", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "pos")
    public List<Spec> specifications = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    public String packingInfo;
    public int stockQuantity;

    public boolean isActive = true;
    public boolean isFeatured;
    public boolean isNewArrival;
    public int sortOrder;

    /** AVAILABLE | NOT_AVAILABLE | STOCK_CLEARING (from the catalogue's NA / stock-clearing notes). */
    public String availability = "AVAILABLE";
    /** Optional quality grade: NORMAL | HEAVY | HIGH | PREMIUM (blank = unspecified). */
    public String qualityGrade;
    /** True when the item carries the "Replacement Guarantee" note. */
    public boolean replacementGuarantee;

    public String createdAt;
    public String updatedAt;
}
