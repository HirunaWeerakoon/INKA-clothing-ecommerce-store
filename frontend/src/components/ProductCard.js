import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">
            <span className="placeholder-text">INKA</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-category">{product.categoryName || product.category?.categoryName}</p>
        <p className="product-price">LKR {product.price?.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ProductCard;