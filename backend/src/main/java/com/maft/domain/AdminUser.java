package com.maft.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin_users")
public class AdminUser {
    @Id
    public String id;
    @Column(unique = true, nullable = false)
    public String email;
    @Column(nullable = false)
    public String passwordHash;
    public String role = "ADMIN";
}
