package com.example.inka_backend.service;

import com.example.inka_backend.dto.CustomerDTO;
import com.example.inka_backend.model.Customer;
import com.example.inka_backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

// Service for admin user management operations
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final CustomerRepository customerRepository;

    // Get all registered users
    public List<CustomerDTO> getAllUsers() {
        return customerRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Delete a user by ID
    public void deleteUser(Long userId) {
        // Check if user exists before deleting
        if (!customerRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        customerRepository.deleteById(userId);
    }

    // Helper: converts Customer entity → CustomerDTO
    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setCustomerId(customer.getCustomerId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setRole(customer.getRole());
        return dto;
    }
}