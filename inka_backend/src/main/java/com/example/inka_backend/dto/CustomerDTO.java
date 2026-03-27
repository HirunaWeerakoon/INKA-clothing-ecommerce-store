package com.example.inka_backend.dto;

import com.example.inka_backend.model.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    // Customer ID
    private Long customerId;

    // Customer display name from Google
    private String name;

    // Customer email address
    private String email;

    // Customer role — USER or ADMIN
    private UserRole role;
}