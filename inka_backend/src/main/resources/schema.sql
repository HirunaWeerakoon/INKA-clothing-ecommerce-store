-- Disable FK checks to allow clean drops regardless of leftover tables
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS Customer;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Category Table
CREATE TABLE IF NOT EXISTS category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255)
);

-- 2. Product Table
CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT,
    name VARCHAR(255),
    description VARCHAR(255),
    price DOUBLE NOT NULL,
    stock INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    best_seller BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- 3. Customer Table
CREATE TABLE IF NOT EXISTS Customer (
    CustomerID BIGINT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Role ENUM('USER', 'ADMIN') DEFAULT 'USER'
);