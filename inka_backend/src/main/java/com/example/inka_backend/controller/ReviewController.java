package com.example.inka_backend.controller;

import com.example.inka_backend.dto.ReviewRequestDTO;
import com.example.inka_backend.dto.ReviewResponseDTO;
import com.example.inka_backend.security.JwtTokenProvider;
import com.example.inka_backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtTokenProvider jwtTokenProvider;

    public ReviewController(ReviewService reviewService,
                            JwtTokenProvider jwtTokenProvider) {
        this.reviewService = reviewService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // PUBLIC — anyone can read reviews for a product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByProduct(
            @PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // PUBLIC — average star rating for a product
    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getAverageRating(productId));
    }

    // PROTECTED — must send Authorization: Bearer <token> header
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @Valid @RequestBody ReviewRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {

        // Pull the customerId out of the JWT
        String token = authHeader.replace("Bearer ", "");
        Long customerId = jwtTokenProvider.getUserIdFromJWT(token);

        return ResponseEntity.ok(reviewService.createReview(request, customerId));
    }

    // PROTECTED — only the author can delete their own review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Long customerId = jwtTokenProvider.getUserIdFromJWT(token);

        reviewService.deleteReview(reviewId, customerId);
        return ResponseEntity.ok("Review deleted");
    }

        @GetMapping("/my-reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews(
            @RequestHeader("Authorization") String authHeader) {
 
        String token = authHeader.replace("Bearer ", "");
        Long customerId = jwtTokenProvider.getUserIdFromJWT(token);
 
        return ResponseEntity.ok(reviewService.getReviewsByCustomer(customerId));
    }
}