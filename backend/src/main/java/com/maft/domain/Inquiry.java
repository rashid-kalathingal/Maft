package com.maft.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "inquiries")
public class Inquiry {
    @Id
    public String id;

    @Column(nullable = false)
    public String customerName;

    public String customerEmail;

    @Column(nullable = false)
    public String customerPhone;

    @Column(columnDefinition = "TEXT")
    public String customerAddress;

    @Column(columnDefinition = "TEXT", nullable = false)
    public String cartItems; // JSON string of cart items

    @Column(nullable = false)
    public String status = "PENDING"; // PENDING, RESPONDED, COMPLETED, CANCELLED

    @Column(columnDefinition = "TEXT")
    public String notes; // Admin notes

    @Column(nullable = false)
    public String createdAt;

    public String updatedAt;
}
