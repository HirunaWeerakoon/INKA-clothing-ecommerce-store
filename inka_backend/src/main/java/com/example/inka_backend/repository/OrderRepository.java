package com.example.inka_backend.repository;

import com.example.inka_backend.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
	@EntityGraph(attributePaths = "items")
	List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
