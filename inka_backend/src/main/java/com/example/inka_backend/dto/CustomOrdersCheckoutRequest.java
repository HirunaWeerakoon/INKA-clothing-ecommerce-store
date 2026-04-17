package com.example.inka_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CustomOrdersCheckoutRequest {
    private List<Long> customOrderIds;
}
