package com.example.inka_backend.controller;

import com.example.inka_backend.dto.AuthLoginRequest;
import com.example.inka_backend.dto.AuthRegisterRequest;
import com.example.inka_backend.dto.AuthResponse;
import com.example.inka_backend.model.Customer;
import com.example.inka_backend.model.UserRole;
import com.example.inka_backend.repository.CustomerRepository;
import com.example.inka_backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(CustomerRepository customerRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (customerRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already registered"));
        }

        Customer customer = new Customer();
        customer.setName(request.getName().trim());
        customer.setEmail(email);
        customer.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        customer.setRole(UserRole.USER);

        Customer saved = customerRepository.save(customer);

        String token = jwtTokenProvider.generateToken(
                saved.getCustomerId(),
                saved.getEmail(),
                saved.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);

        if (customerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        Customer customer = customerOpt.get();
        String passwordHash = customer.getPasswordHash();

        if (passwordHash == null || !passwordEncoder.matches(request.getPassword(), passwordHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        String token = jwtTokenProvider.generateToken(
                customer.getCustomerId(),
                customer.getEmail(),
                customer.getRole()
        );

        return ResponseEntity.ok(new AuthResponse(token));
    }
}
