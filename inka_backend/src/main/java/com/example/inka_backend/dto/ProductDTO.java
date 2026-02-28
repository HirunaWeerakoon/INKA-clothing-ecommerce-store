package com.example.inka_backend.dto;

public class ProductDTO {
    private Long productId;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean isAvailable;
    private Long categoryId;
    private String image1;
    private String image2;
    private String image3;
    private String image4;
    private String image5;

    public Long getProductId() { return productId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public Integer getStock() { return stock; }
    public Boolean getIsAvailable() { return isAvailable; }
    public Long getCategoryId() { return categoryId; }
    public String getImage1() { return image1; }
    public String getImage2() { return image2; }
    public String getImage3() { return image3; }
    public String getImage4() { return image4; }
    public String getImage5() { return image5; }

    public void setProductId(Long productId) { this.productId = productId; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(Double price) { this.price = price; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setImage1(String image1) { this.image1 = image1; }
    public void setImage2(String image2) { this.image2 = image2; }
    public void setImage3(String image3) { this.image3 = image3; }
    public void setImage4(String image4) { this.image4 = image4; }
    public void setImage5(String image5) { this.image5 = image5; }
}