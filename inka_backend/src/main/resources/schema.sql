-- 1. Category Table
CREATE TABLE IF NOT EXISTS Category (
                                        CategoryID INT PRIMARY KEY AUTO_INCREMENT,
                                        CategoryName VARCHAR(100) NOT NULL
);

-- 2. Product Table
CREATE TABLE IF NOT EXISTS Product (
                                       ProductID INT PRIMARY KEY AUTO_INCREMENT,
                                       CategoryID INT,
                                       Name VARCHAR(255) NOT NULL,
                                       Description TEXT,
                                       Price DECIMAL(10, 2) NOT NULL,
                                       Stock INT DEFAULT 0,
                                       IsAvailable BOOLEAN DEFAULT TRUE,
                                       FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- 3. Customer Table
CREATE TABLE IF NOT EXISTS Customer (
                                        CustomerID INT PRIMARY KEY AUTO_INCREMENT,
                                        Name VARCHAR(255) NOT NULL,
                                        Email VARCHAR(255) UNIQUE NOT NULL,
                                        Password VARCHAR(255) NOT NULL,
                                        Address TEXT,
                                        Role ENUM('USER', 'ADMIN') DEFAULT 'USER'
);