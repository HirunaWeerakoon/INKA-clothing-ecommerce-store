-- =============================================
-- INKA Clothing E-Commerce — Seed Data
-- =============================================

-- Categories
INSERT INTO category (id, name, image_url) VALUES
(1, 'T-Shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
(2, 'Denims', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'),
(3, 'Tote Bags', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400'),
(4, 'Accessories', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400');


-- Products: T-Shirts (category_id = 1)
INSERT INTO products (product_id, category_id, name, description, price, stock, is_available, best_seller, image_url, image1, image2, image3, image4, image5) VALUES
(1, 1, 'Classic Black Tee', 'Premium 100% cotton black t-shirt with a relaxed fit. Perfect for everyday wear.', 2500.00, 50, TRUE, TRUE,
 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400',
 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'),

(2, 1, 'White Essential Tee', 'Clean white essential t-shirt made from soft organic cotton. A wardrobe staple.', 2200.00, 45, TRUE, TRUE,
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
 NULL, NULL),

(3, 1, 'Oversized Graphic Tee', 'Bold graphic print on an oversized silhouette. Stand out from the crowd.', 3200.00, 30, TRUE, TRUE,
 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
 NULL, NULL, NULL),

(4, 1, 'Vintage Wash Tee', 'Retro-inspired vintage wash t-shirt with a worn-in feel from day one.', 2800.00, 25, TRUE, FALSE,
 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
 NULL, NULL, NULL),

(5, 1, 'Stripe Crew Neck Tee', 'Classic striped crew neck with a modern slim fit. Timeless style.', 2600.00, 35, TRUE, FALSE,
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
 NULL, NULL, NULL, NULL);

-- Products: Denims (category_id = 2)
INSERT INTO products (product_id, category_id, name, description, price, stock, is_available, best_seller, image_url, image1, image2, image3, image4, image5) VALUES
(6, 2, 'Slim Fit Dark Wash Jeans', 'Modern slim fit jeans in dark indigo wash. Stretch denim for all-day comfort.', 5500.00, 20, TRUE, TRUE,
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
 NULL, NULL, NULL),

(7, 2, 'Relaxed Fit Light Wash Jeans', 'Casual relaxed fit jeans with a light wash finish. Perfect weekend wear.', 4800.00, 15, TRUE, FALSE,
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
 NULL, NULL, NULL),

(8, 2, 'Black Skinny Jeans', 'Sleek black skinny jeans with stretch fit. A must-have for any collection.', 5200.00, 30, TRUE, FALSE,
 'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=400',
 'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=600',
 NULL, NULL, NULL, NULL);

-- Products: Tote Bags (category_id = 3)
INSERT INTO products (product_id, category_id, name, description, price, stock, is_available, best_seller, image_url, image1, image2, image3, image4, image5) VALUES
(9, 3, 'Canvas Tote Bag', 'Sturdy canvas tote with INKA branding. Eco-friendly and stylish.', 1800.00, 40, TRUE, TRUE,
 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
 NULL, NULL, NULL, NULL),

(10, 3, 'Printed Art Tote', 'Artist collaboration tote bag with unique printed design. Limited edition.', 2200.00, 20, TRUE, FALSE,
 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
 NULL, NULL, NULL, NULL),

(12, 4, 'Leather Belt', 'Genuine leather belt with minimal metal buckle. Premium quality finish.', 3500.00, 25, TRUE, FALSE,
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
 NULL, NULL, NULL, NULL);


-- Customer (test user)
INSERT INTO customer (customerid, name, email, password, address, role) VALUES
(1, 'Lewis Hamilton', 'lewis@mercedes.com', 'password123', '44 Stevenage Road, London, UK', 'USER');

-- Sub Categories for T-Shirts (category_id = 1)
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Crew Neck', null, 1);
INSERT INTO sub_category (name, image_url, category_id) VALUES ('V-Neck', null, 1);
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Polo', null, 1);

-- Sub Categories for Denims (category_id = 2)
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Slim Fit', null, 2);
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Regular', null, 2);
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Wide Leg', null, 2);

-- Sub Categories for Tote Bags (category_id = 3)
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Small', null, 3);
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Medium', null, 3);
INSERT INTO sub_category (name, image_url, category_id) VALUES ('Large', null, 3);

