package com.example.inka_backend.config;

import com.example.inka_backend.model.*;
import com.example.inka_backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(
            ProductRepository productRepo,
            CategoryRepository categoryRepo,
            CustomerRepository customerRepo) {
        return args -> {
            // 1. Create Categories
            Category oversized = new Category();
            oversized.setCategoryName("Oversized Tees");

            Category hoodies = new Category();
            hoodies.setCategoryName("Hoodies");

            categoryRepo.saveAll(List.of(oversized, hoodies));

            // 2. Create Products linked to Categories
            Product tee1 = new Product();
            tee1.setName("Inka Signature Black Tee");
            tee1.setPrice(2500.0);
            tee1.setCategory(oversized);
            tee1.setStock(50);
            tee1.setIsAvailable(true);

            Product hoodie1 = new Product();
            hoodie1.setName("Midnight Urban Hoodie");
            hoodie1.setPrice(4500.0);
            hoodie1.setCategory(hoodies);
            hoodie1.setStock(20);
            hoodie1.setIsAvailable(true);

            productRepo.saveAll(List.of(tee1, hoodie1));

            // 3. Create a Test Customer
            Customer testCustomer = new Customer();
            testCustomer.setName("John");
            testCustomer.setEmail("test@inka.com");
            testCustomer.setPassword("encoded_password_here");
            testCustomer.setRole(UserRole.USER);

            customerRepo.save(testCustomer);

            System.out.println(">> Inka Apparel Database Populated Successfully!");
        };
    }
}