package com.maft.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Spec {
    @Column(name = "spec_key")
    public String key;
    @Column(name = "spec_value", columnDefinition = "TEXT")
    public String value;
}
