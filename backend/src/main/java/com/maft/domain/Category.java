package com.maft.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    public String id;
    public String name;
    public String slug;
    @Column(columnDefinition = "TEXT")
    public String description;
    public String icon;
    /** Optional uploaded category image (Supabase URL); falls back to the mapped/default image when empty. */
    @Column(columnDefinition = "TEXT")
    public String imageUrl;
    public int sortOrder;
    public boolean isActive = true;
}
