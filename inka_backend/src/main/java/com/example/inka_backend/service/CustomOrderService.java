package com.example.inka_backend.service;

import com.example.inka_backend.dto.CustomOrderDTO;
import com.example.inka_backend.model.CustomOrder;
import com.example.inka_backend.repository.CustomOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomOrderService {

    private final CustomOrderRepository customOrderRepository;

    public CustomOrder placeOrder(CustomOrderDTO dto) {
        CustomOrder order = new CustomOrder();
        order.setCustomerId(dto.getCustomerId());
        order.setCategoryName(dto.getCategoryName());
        order.setSubCategoryName(dto.getSubCategoryName());
        order.setGsm(dto.getGsm());
        order.setMaterial(dto.getMaterial());
        order.setSize(dto.getSize());
        order.setColor(dto.getColor());
        order.setQuantity(dto.getQuantity());
        order.setDesignImageUrl(dto.getDesignImageUrl());
        order.setTotalPrice(dto.getTotalPrice());
        order.setStatus("PENDING");
        return customOrderRepository.save(order);
    }

    public List<CustomOrder> getOrdersByCustomer(Long customerId) {
        return customOrderRepository.findByCustomerId(customerId);
    }

    public List<CustomOrder> getAllOrders() {
        return customOrderRepository.findAll();
    }
}