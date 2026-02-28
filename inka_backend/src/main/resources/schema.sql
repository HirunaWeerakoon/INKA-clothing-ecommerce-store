-- 1. Category Table
CREATE TABLE Category (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(100) NOT NULL
);

-- 2. Product Table
CREATE TABLE Product (
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
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Address TEXT,
    Role ENUM('USER', 'ADMIN') DEFAULT 'USER' -- Added for your Admin Panel
);

-- 4. Cart Table
CREATE TABLE Cart (
    CartID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT,
    ProductID INT,
    AddedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CheckedOutDate TIMESTAMP NULL,
    CartItemName VARCHAR(255),
    Quantity INT NOT NULL,
    CustomDesignURL VARCHAR(500), -- To store the Firebase link
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- 5. Order Table
CREATE TABLE `Order` (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CartID INT,
    CustomerID INT,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DeliveryAddress TEXT,
    TotalAmount DECIMAL(10, 2),
    Quantity INT,
    FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

-- 6. Payment Table
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT,
    PaymentMethod VARCHAR(50),
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsPaid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID)
);

-- 7. Review Table
CREATE TABLE Review (
    ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT,
    ProductID INT,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);




