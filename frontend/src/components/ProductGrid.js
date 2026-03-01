import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { AiOutlineFilter } from 'react-icons/ai';
import './ProductGrid.css';

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (products.length === 0) return <div className="no-products">No products found.</div>;

  return (
    <div className="product-section">
      <div className="filter-bar">
        <button className="filter-btn">
          <AiOutlineFilter size={14} />
          Filter
        </button>
        <span className="product-count">{products.length} items</span>
      </div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;