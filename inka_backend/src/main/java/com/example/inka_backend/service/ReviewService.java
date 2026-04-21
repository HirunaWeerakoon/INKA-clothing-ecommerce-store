package com.example.inka_backend.service;

import com.example.inka_backend.dto.ReviewRequestDTO;
import com.example.inka_backend.dto.ReviewResponseDTO;
import com.example.inka_backend.exception.AlreadyReviewedException;
import com.example.inka_backend.model.Customer;
import com.example.inka_backend.model.Product;
import com.example.inka_backend.model.Review;
import com.example.inka_backend.repository.CustomerRepository;
import com.example.inka_backend.repository.ProductRepository;
import com.example.inka_backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import com.example.inka_backend.repository.OrderItemRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         CustomerRepository customerRepository,
                         OrderItemRepository orderItemRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<ReviewResponseDTO> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long productId) {
        Double avg = reviewRepository.findAverageRatingByProductId(productId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public List<ReviewResponseDTO> getReviewsByCustomer(Long customerId) {
        return reviewRepository.findByCustomer_CustomerId(customerId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ReviewResponseDTO createReview(ReviewRequestDTO request, Long customerId) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check for duplicate — return 409 with a clear message instead of crashing
        // Check if customer has purchased the product
        if (!orderItemRepository.existsByProductIdAndCustomerId(
                request.getProductId(), customerId)) {
            throw new RuntimeException("You can only review products you have purchased");
        }

// Check for duplicate review
        if (reviewRepository.existsByProduct_ProductIdAndCustomer_CustomerId(
                request.getProductId(), customerId)) {
            throw new AlreadyReviewedException("You have already submitted a review for this product");
        }
        Review review = new Review();
        review.setProduct(product);
        review.setCustomer(customer);
        review.setRating(request.getRating() != null ? request.getRating() : 0);
        review.setTitle(request.getTitle());
        review.setBody(request.getBody());
        review.setSizePurchased(request.getSizePurchased());
        review.setImageUrl(request.getImageUrl()); // Cloudinary image URL

        Review saved = reviewRepository.save(review);
        return toResponseDTO(saved);
    }

    public void deleteReview(Long reviewId, Long customerId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponseDTO toResponseDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setReviewId(review.getReviewId());
        dto.setProductId(review.getProduct().getProductId());
        dto.setProductName(review.getProduct().getName());
        dto.setCustomerId(review.getCustomer().getCustomerId());
        dto.setCustomerName(review.getCustomer().getName());
        dto.setCustomerPictureUrl(review.getCustomer().getPictureUrl());
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setBody(review.getBody());
        dto.setSizePurchased(review.getSizePurchased());
        dto.setImageUrl(review.getImageUrl()); // Cloudinary image URL
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}