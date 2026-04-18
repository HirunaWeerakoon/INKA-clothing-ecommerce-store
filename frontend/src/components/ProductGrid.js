import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { AiOutlineFilter } from 'react-icons/ai';
import './ProductGrid.css';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'denims', label: 'Denims' },
  { id: 'tshirts', label: 'T-Shirts' },
  { id: 'totebags', label: 'Tote Bags' },
  { id: 'accessories', label: 'Accessories' },
];

const CATEGORY_ID_TO_FILTER = {
  1: 'tshirts',
  2: 'denims',
  3: 'totebags',
  4: 'accessories',
};

const normalizeCategory = (value = '') => value.toString().toLowerCase().replace(/[^a-z]/g, '');

function ProductGrid() {
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const categoryQuery = searchParams.get('category');

    if (!categoryQuery) {
      setSelectedFilter('all');
      return;
    }

    const parsedCategoryId = Number.parseInt(categoryQuery, 10);
    const matchedById = CATEGORY_ID_TO_FILTER[parsedCategoryId];

    if (matchedById) {
      setSelectedFilter(matchedById);
      return;
    }

    const normalizedQuery = normalizeCategory(categoryQuery);
    const matchedByName = CATEGORY_FILTERS.find((filter) =>
      normalizeCategory(filter.id) === normalizedQuery || normalizeCategory(filter.label) === normalizedQuery
    );

    setSelectedFilter(matchedByName ? matchedByName.id : 'all');
  }, [searchParams]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'all') {
      return products;
    }

    return products.filter((product) => {
      const productCategory = normalizeCategory(product.categoryName || product.category?.categoryName || '');
      return productCategory === selectedFilter;
    });
  }, [products, selectedFilter]);

  if (loading) return <div className="loading">Loading...</div>;
  if (products.length === 0) return <div className="no-products">No products found.</div>;

  return (
    <div className="product-section">
      <div className="filter-bar">
        <div className="filter-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="filter-btn"
            onClick={() => setIsDropdownOpen((open) => !open)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <AiOutlineFilter size={14} />
            Filter
          </button>
          {isDropdownOpen && (
            <div className="filter-menu" role="menu" aria-label="Product category filters">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`filter-option ${selectedFilter === filter.id ? 'filter-option--active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="product-count">{filteredProducts.length} items</span>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="no-products">No products found for this category.</div>
      ) : (
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
      )}
    </div>
  );
}

export default ProductGrid;