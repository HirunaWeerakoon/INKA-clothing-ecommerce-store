package com.example.inka_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class TempCheckoutRequest {
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Double totalAmount;
    private String originalImageUrl;
    private String mergedImageUrl;
    
    // Accept items as any list, we'll convert to JSON internally
    private List<Object> cartItems;
}
