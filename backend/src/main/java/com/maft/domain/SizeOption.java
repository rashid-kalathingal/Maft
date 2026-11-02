package com.maft.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sizes")
public class SizeOption {
    @Id
    public String id;
    public String label;
    public Double value;
    public String unit;
    public int sortOrder;
    public boolean isActive = true;
}
