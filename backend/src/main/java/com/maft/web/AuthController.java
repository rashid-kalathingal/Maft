package com.maft.web;

import com.maft.domain.AdminUser;
import com.maft.repo.AdminUserRepository;
import com.maft.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(String email, String password) {}

    private final AdminUserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(AdminUserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req == null || req.email() == null || req.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }
        AdminUser user = users.findByEmailIgnoreCase(req.email().trim()).orElse(null);
        if (user == null || !encoder.matches(req.password(), user.passwordHash)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password."));
        }
        String token = jwt.generateToken(user.email);
        return ResponseEntity.ok(Map.of("token", token, "email", user.email));
    }
}
