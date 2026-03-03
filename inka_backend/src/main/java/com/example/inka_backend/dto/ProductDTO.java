package com.example.inka_backend.dto;

<<<<<<< HEAD
import lombok.Data;

@Data  // Lombok: auto-generates getters, setters, toString, equals
public class ProductDTO {

=======
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
>>>>>>> c971c6435acab964ff6867b026128d673319fedd
    private Long productId;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean isAvailable;
<<<<<<< HEAD
    private String imageUrl;

    // Instead of sending the whole Category object,
    // we just send the category name as a simple String
    private Long categoryId;
    private String categoryName;
}
=======
    private Boolean bestSeller;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
}
>>>>>>> c971c6435acab964ff6867b026128d673319fedd
