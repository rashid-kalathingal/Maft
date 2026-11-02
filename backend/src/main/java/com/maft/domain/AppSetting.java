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

/** Single-row settings table (id = "default"). */
@Entity
@Table(name = "app_settings")
public class AppSetting {
    public static final String SINGLETON_ID = "default";

    @Id
    public String id = SINGLETON_ID;
    public String businessName;
    public String tagline;
    public String address;
    public String phonePrimary;
    public String phoneSecondary;
    public String whatsappNumber;
    public boolean showStock;
    public int productsPerPage = 16;
    @Lob
    public String logoUrl;
    @Lob
    public String faviconUrl;
    /** ISO timestamp of the last favicon change (used to enforce the 45-day limit). */
    public String faviconUpdatedAt;

    /** Previously used brand logos, so an admin can re-select one. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "app_setting_logo_history", joinColumns = @JoinColumn(name = "setting_id"))
    @OrderColumn(name = "pos")
    @Lob
    @Column(name = "url")
    public List<String> logoHistory = new ArrayList<>();
}
