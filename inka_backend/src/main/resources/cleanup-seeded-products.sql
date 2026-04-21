-- One-time cleanup for legacy seeded products from data.sql.
-- Safe guard: deletes only the exact seeded IDs with expected seeded names.
-- This will not delete products manually added through admin unless they use one of these same IDs + names.

START TRANSACTION;

-- Preview rows that will be removed
SELECT product_id, name, category_id, price, image_url
FROM products
WHERE (product_id, name) IN (
  (1, 'Classic Black Tee'),
  (2, 'White Essential Tee'),
  (3, 'Oversized Graphic Tee'),
  (4, 'Vintage Wash Tee'),
  (5, 'Stripe Crew Neck Tee'),
  (6, 'Slim Fit Dark Wash Jeans'),
  (7, 'Relaxed Fit Light Wash Jeans'),
  (8, 'Black Skinny Jeans'),
  (9, 'Canvas Tote Bag'),
  (10, 'Printed Art Tote'),
  (12, 'Leather Belt')
)
ORDER BY product_id;

-- Delete only seeded hardcoded products
DELETE FROM products
WHERE (product_id, name) IN (
  (1, 'Classic Black Tee'),
  (2, 'White Essential Tee'),
  (3, 'Oversized Graphic Tee'),
  (4, 'Vintage Wash Tee'),
  (5, 'Stripe Crew Neck Tee'),
  (6, 'Slim Fit Dark Wash Jeans'),
  (7, 'Relaxed Fit Light Wash Jeans'),
  (8, 'Black Skinny Jeans'),
  (9, 'Canvas Tote Bag'),
  (10, 'Printed Art Tote'),
  (12, 'Leather Belt')
);

-- Verify remaining product count
SELECT COUNT(*) AS remaining_products FROM products;

COMMIT;
