package com.maft.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "colours")
public class Colour {
    @Id
    public String id;
    public String name;
    public String hexCode;
    public String secondaryHexCode;
    public boolean isActive = true;
}
