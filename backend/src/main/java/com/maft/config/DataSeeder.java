package com.maft.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maft.domain.*;
import com.maft.repo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

/** Seeds the catalogue from bundled JSON and bootstraps the admin user on first run. */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoryRepository categories;
    private final ColourRepository colours;
    private final SizeRepository sizes;
    private final ProductRepository products;
    private final AppSettingRepository settings;
    private final AdminUserRepository admins;
    private final PasswordEncoder encoder;

    @Value("${app.admin.email:admin@maftmarketing.com}")
    private String adminEmail;
    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public DataSeeder(CategoryRepository categories, ColourRepository colours, SizeRepository sizes,
                      ProductRepository products, AppSettingRepository settings,
                      AdminUserRepository admins, PasswordEncoder encoder) {
        this.categories = categories;
        this.colours = colours;
        this.sizes = sizes;
        this.products = products;
        this.settings = settings;
        this.admins = admins;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categories.count() == 0) categories.saveAll(read("categories", new TypeReference<List<Category>>() {}));
        if (colours.count() == 0) colours.saveAll(read("colours", new TypeReference<List<Colour>>() {}));
        if (sizes.count() == 0) sizes.saveAll(read("sizes", new TypeReference<List<SizeOption>>() {}));
        if (products.count() == 0) {
            List<Product> list = read("products", new TypeReference<List<Product>>() {});
            products.saveAll(list);
            log.info("Seeded {} products", list.size());
        }
        if (settings.count() == 0) {
            AppSetting s = readOne("settings", AppSetting.class);
            s.id = AppSetting.SINGLETON_ID;
            settings.save(s);
        }
        // Bootstrap a single admin ONLY when the table is completely empty
        // (e.g. a brand-new environment). Real admin accounts are provisioned
        // directly in the database, so this never recreates a removed user.
        if (admins.count() == 0) {
            AdminUser u = new AdminUser();
            u.id = UUID.randomUUID().toString();
            u.email = adminEmail;
            u.passwordHash = encoder.encode(adminPassword);
            u.role = "ADMIN";
            admins.save(u);
            log.info("Bootstrapped initial admin user: {}", adminEmail);
        }
    }

    private <T> T read(String name, TypeReference<T> type) throws Exception {
        try (InputStream in = new ClassPathResource("seed/" + name + ".json").getInputStream()) {
            return mapper.readValue(in, type);
        }
    }

    private <T> T readOne(String name, Class<T> type) throws Exception {
        try (InputStream in = new ClassPathResource("seed/" + name + ".json").getInputStream()) {
            return mapper.readValue(in, type);
        }
    }
}
