package com.example.inka_backend.repository;


import com.example.inka_backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email); // Vital for the Login API

     // Used by CustomOAuth2UserService to find or create the user
    Optional<Customer> findByGoogleId(String googleId);
}