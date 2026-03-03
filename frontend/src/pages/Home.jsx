import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        PRINT YOUR STYLE.<br />
                        WE PRINT THE ATTITUDE.
                    </h1>
                    <p className="hero-subtitle">
                        Premium custom t-shirt printing for brands,<br />
                        events & creators
                    </p>
                    <div className="hero-buttons">
                        <Link to="/shop" className="btn btn-primary dark-btn">SHOP NOW</Link>
                        <Link to="/custom" className="btn btn-outline">CUSTOM PRINT</Link>
                    </div>
                </div>
                <div className="hero-image-placeholder"></div>
            </section>

            {/* Shop By Category Section */}
            <section className="category-section">
                <h2 className="section-title">SHOP BY CATEGORY</h2>
                <div className="category-grid">
                    <Link to="/shop?category=tshirts" className="category-card">
                        <div className="category-box"></div>
                        <span className="category-label">T-SHIRTS</span>
                    </Link>
                    <Link to="/shop?category=denims" className="category-card">
                        <div className="category-box"></div>
                        <span className="category-label">DENIMS</span>
                    </Link>
                    <Link to="/shop?category=totebags" className="category-card">
                        <div className="category-box"></div>
                        <span className="category-label">TOTE BAGS</span>
                    </Link>
                    <Link to="/shop?category=accessories" className="category-card">
                        <div className="category-box"></div>
                        <span className="category-label">ACCESORIES</span>
                    </Link>
                </div>
            </section>

            {/* Create Your Own Design Banner */}
            <section className="custom-design-banner">
                <div className="banner-content">
                    <h2>CREATE YOUR OWN DESIGN</h2>
                    <p>Upload. Customize. Print. Delivered</p>
                    <Link to="/custom" className="btn btn-white">START DESIGN</Link>
                </div>
            </section>

            {/* Best Selling Section */}
            <section className="best-selling-section">
                <h2 className="section-title">Best Selling</h2>
                <div className="best-selling-grid">
                    <div className="product-placeholder"></div>
                    <div className="product-placeholder"></div>
                    <div className="product-placeholder"></div>
                </div>
            </section>
        </div>
    );
};

export default Home;
