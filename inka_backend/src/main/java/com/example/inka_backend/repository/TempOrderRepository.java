package com.example.inka_backend.repository;

import com.example.inka_backend.model.TempOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempOrderRepository extends JpaRepository<TempOrder, Long> {
}
