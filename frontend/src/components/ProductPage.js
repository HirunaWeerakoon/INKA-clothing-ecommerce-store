import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductPage.css';

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    axios.get('http://localhost:8080/api/products/1')
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => console.error('Error fetching product:', error));
  }, []);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="page-wrapper">


      {/* PRODUCT SECTION */}
      <div className="product-page">

        {/* LEFT - Images */}
        <div className="product-images">
          <div className="main-image-box"></div>
          <div className="thumbnail-row">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`thumbnail-box ${i === 0 ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>

        {/* RIGHT - Details */}
        <div className="product-details">
          <p className="review-count">♥ {product.reviewCount} REVIEWS</p>
          <h1 className="product-name">{product.name}</h1>
          <p className="rating">★★★★★ ({product.reviewCount} Reviews)</p>
          <h2 className="product-price">AED {product.price}</h2>
          <p className="vat">Inclusive of VAT</p>
          <p className="description">{product.description}</p>

          {/* Colors */}
          <div className="section">
            <p><strong>Color</strong></p>
            <div className="color-options">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className={`color-circle ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="section">
            <p><strong>Size</strong></p>
            <div className="size-options">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="size-guide">Size Guide</p>
          </div>

          {/* Buttons */}
          <div className="button-row">
            <button className="add-to-cart">ADD TO CART</button>
            <button className="wishlist">♡</button>
          </div>
          <p className="buy-now">Buy it now</p>

          {/* Features */}
          <div className="features">
            {product.features.map((feature, index) => (
              <p key={index}>✓ {feature}</p>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <span className={activeTab === 'description' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('description')}>Description</span>
        <span className={activeTab === 'sizeguide' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('sizeguide')}>Size Guide</span>
        <span className={activeTab === 'reviews' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('reviews')}>Reviews (12)</span>
      </div>

      {/* TAB CONTENT */}
      <div className="tab-content">
        {activeTab === 'description' && (
          <div>
            <h3>{product.name}</h3>
            <div className="description-images">
              {[0, 1, 2].map((i) => (
                <div key={i} className="desc-image-box"></div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'sizeguide' && <p>Size guide content here.</p>}
        {activeTab === 'reviews' && <p>Reviews content here.</p>}
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div className="also-like">
        <h2>You May Also Like</h2>
        <div className="also-like-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="also-like-card">
              <div className="also-like-image-box"></div>
              <p>INKA Classic Tee</p>
              <p>AED 100</p>
              <button className="add-to-cart-small">ADD TO CART</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ProductPage;