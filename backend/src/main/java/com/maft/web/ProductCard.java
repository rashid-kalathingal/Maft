package com.maft.web;

/**
 * Lightweight product projection for catalogue/admin lists. Carries only scalar
 * fields (no variants, specifications or full image collection), so a list of
 * all products loads in a single fast query — unlike the full entity, whose
 * eager element-collections make a 200-product fetch time out over the pooler.
 */
public record ProductCard(
        String id,
        String name,
        String slug,
        String sku,
        String categoryId,
        String shortDescription,
        Double price,
        String imageLabel,
        String thumbnailUrl,
        boolean hasVariants,
        int stockQuantity,
        boolean isActive,
        boolean isFeatured,
        boolean isNewArrival,
        int sortOrder,
        String availability,
        String qualityGrade,
        boolean replacementGuarantee,
        String createdAt,
        String updatedAt
) {}
