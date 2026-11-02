package com.maft.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Variant {
    @Column(name = "variant_id")
    public String id;
    public String sku;
    public String sizeId;
    public String colourId;
    public int stockQuantity;
    public boolean isActive = true;
}
