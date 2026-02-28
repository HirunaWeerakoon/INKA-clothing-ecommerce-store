import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductPage.css';

const SearchIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const UserIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const CartIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);
const HeartIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

function StarRating({ rating = 4, max = 5 }) {
    return (
        <div className="pp-stars">
            {Array.from({ length: max }, (_, i) => (
                <span key={i} className={i < rating ? 'pp-star filled' : 'pp-star empty'}>★</span>
            ))}
        </div>
    );
}

const COLORS = [
    { label: 'Black', hex: '#111111' },
    { label: 'Tan', hex: '#C4A882' },
    { label: 'White', hex: '#FFFFFF' },
    { label: 'Light Gray', hex: '#D0D0D0' },
    { label: 'Navy', hex: '#3B4A6B' },
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
    const [selectedSize, setSelectedSize] = useState('');
    const [activeThumb, setActiveThumb] = useState(0);
    const [activeTab, setActiveTab] = useState('sizeguide');
    const [wishlisted, setWishlisted] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/products/19')
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error fetching product:', error));
    }, []);

    if (!product) return <div>Loading...</div>;

    // 1 main image + 4 thumbnails
    const thumbnails = [
        product.image2,
        product.image3,
        product.image4,
        product.image5,
    ];

    const mainImage = activeThumb === -1
        ? product.image1
        : thumbnails[activeThumb] || product.image1;

    const TABS = [
        { id: 'description', label: 'Description' },
        { id: 'sizeguide', label: 'Size Guide' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div className="pp-root">

            {/* NAVBAR */}
            <nav className="pp-nav">
                <span className="pp-logo">INKA</span>
                <ul className="pp-navlinks">
                    {['HOME', 'SHOP', 'CUSTOM', 'ABOUT'].map((link) => (
                        <li key={link} className={`pp-navlink${link === 'HOME' ? ' active' : ''}`}>
                            {link}
                        </li>
                    ))}
                </ul>
                <div className="pp-navicons">
                    <button className="pp-icon-btn" aria-label="Search"><SearchIcon /></button>
                    <button className="pp-icon-btn" aria-label="Account"><UserIcon /></button>
                    <button className="pp-icon-btn" aria-label="Cart"><CartIcon /></button>
                </div>
            </nav>

            {/* PRODUCT SECTION */}
            <section className="pp-product">

                {/* LEFT — images */}
                <div className="pp-images">

                    {/* Main image - shows image1 by default, changes on thumbnail click */}
                    <div className="pp-main-img">
                        {mainImage
                            ? <img src={mainImage} alt={product.name} className="pp-main-img-tag" />
                            : <span className="pp-no-image">No Image</span>
                        }
                    </div>

                    {/* 4 Thumbnails - image2, image3, image4, image5 */}
                    <div className="pp-thumbs">
                        {thumbnails.map((img, i) => (
                            <button
                                key={i}
                                className={`pp-thumb${activeThumb === i ? ' active' : ''}`}
                                onClick={() => setActiveThumb(i)}
                                style={{
                                    backgroundImage: img ? `url(${img})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: img ? 'transparent' : '#d9d9d9'
                                }}
                                aria-label={`Thumbnail ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT — details */}
                <div className="pp-details">
                    <h1 className="pp-name">{product.name}</h1>
                    <div className="pp-rating-row">
                        <StarRating rating={4} />
                        <span className="pp-review-count">(12 reviews)</span>
                    </div>
                    <p className="pp-price">Rs. {product.price}</p>
                    <p className="pp-vat">Inclusive of VAT</p>

                    {/* Color */}
                    <div className="pp-option-row">
                        <span className="pp-option-label">Color</span>
                        <div className="pp-colors">
                            {COLORS.map((c) => (
                                <button
                                    key={c.hex}
                                    className={`pp-color-swatch${selectedColor === c.hex ? ' selected' : ''}`}
                                    style={{ backgroundColor: c.hex }}
                                    onClick={() => setSelectedColor(c.hex)}
                                    aria-label={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="pp-option-row">
                        <span className="pp-option-label">Size</span>
                        <div className="pp-sizes">
                            {SIZES.map((s) => (
                                <button
                                    key={s}
                                    className={`pp-size-btn${selectedSize === s ? ' selected' : ''}`}
                                    onClick={() => setSelectedSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="pp-cta-row">
                        <button className="pp-add-to-cart">ADD TO CART</button>
                        <button
                            className={`pp-wishlist-btn${wishlisted ? ' active' : ''}`}
                            onClick={() => setWishlisted(!wishlisted)}
                            aria-label="Add to wishlist"
                        >
                            <HeartIcon />
                        </button>
                    </div>

                    {/* Stock info */}
                    <p className="pp-stock">
                        {product.isAvailable ? `In Stock: ${product.stock} items` : 'Out of Stock'}
                    </p>
                </div>
            </section>

            {/* TABS */}
            <div className="pp-tabs-bar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`pp-tab${activeTab === tab.id ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="pp-tab-content">
                {activeTab === 'description' && (
                    <div className="pp-tab-placeholder">
                        <p style={{ padding: '20px', fontSize: '15px' }}>{product.description}</p>
                    </div>
                )}
                {activeTab === 'sizeguide' && <div className="pp-tab-placeholder" />}
                {activeTab === 'reviews' && <div className="pp-tab-placeholder" />}
            </div>

            {/* RELATED PRODUCTS */}
            <section className="pp-related">
                <h2 className="pp-related-title">Related Products</h2>
                <div className="pp-related-grid">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="pp-related-card">
                            <div className="pp-related-img" />
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}