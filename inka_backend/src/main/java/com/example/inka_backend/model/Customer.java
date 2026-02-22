package com.example.inka_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String address;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;


}