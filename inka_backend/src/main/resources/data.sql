-- Seed categories
INSERT IGNORE INTO category (name, image_url) VALUES ('Oversized Tees', NULL);
INSERT IGNORE INTO category (name, image_url) VALUES ('Hoodies', NULL);

-- Seed products (category_id 1 = Oversized Tees, 2 = Hoodies)
INSERT IGNORE INTO products (name, description, price, stock, is_available, best_seller, image_url, category_id)
VALUES ('Inka Signature Black Tee', 'Premium oversized tee with Inka branding', 2500.00, 50, TRUE, TRUE, NULL, 1);

INSERT IGNORE INTO products (name, description, price, stock, is_available, best_seller, image_url, category_id)
VALUES ('Midnight Urban Hoodie', 'Streetwear-style hoodie for urban adventures', 4500.00, 20, TRUE, TRUE, NULL, 2);

-- Seed a test customer (frontend fetches customer ID 1)
INSERT IGNORE INTO Customer (Name, Email, Password, Address, Role)
VALUES ('Lewis Hamilton', 'lewis@mercedes.com', 'password123', 'No.44, Silverstone', 'USER');
