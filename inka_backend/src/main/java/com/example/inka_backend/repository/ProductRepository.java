package com.example.inka_backend.repository;

import com.example.inka_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

<<<<<<< HEAD
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get only products that are available (isAvailable = true)
    List<Product> findByIsAvailableTrue();

    // Get products that belong to a specific category
    List<Product> findByCategoryId(Long categoryId);
=======
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByBestSellerTrue();

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByIsAvailableTrue();
>>>>>>> c971c6435acab964ff6867b026128d673319fedd
}