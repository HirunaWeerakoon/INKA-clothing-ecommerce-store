package com.example.inka_backend.repository;

import com.example.inka_backend.model.CustomOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomOrderRepository
        extends JpaRepository<CustomOrder, Long> {
    List<CustomOrder> findByCustomerId(Long customerId);
}
