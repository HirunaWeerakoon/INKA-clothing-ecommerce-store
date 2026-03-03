package com.example.inka_backend.dto;

<<<<<<< HEAD
import lombok.Data;

@Data
public class CategoryDTO {

    private Long categoryId;
    private String categoryName;
}
=======
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
}
>>>>>>> c971c6435acab964ff6867b026128d673319fedd
