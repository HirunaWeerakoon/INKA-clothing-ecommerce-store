package com.example.inka_backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class AdminOrderDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    
    // Order fields
    private String orderType;
    private String status;
    private String currency;
    private Long subtotalAmount;
    private Long shippingAmount;
    private Long totalAmount;
    private String stripeSessionId;
    private String stripePaymentIntentId;
    private LocalDateTime createdAt;
    
    private List<AdminOrderItemDTO> items;
}
