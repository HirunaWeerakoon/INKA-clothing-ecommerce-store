-- Insert a test customer to allow the frontend user account details to be fetched successfully
-- The frontend is configured to fetch customer with ID 1
INSERT INTO Customer (Name, Email, Password, Address, Role) 
VALUES ('Lewis Hamilton', 'lewis@mercedes.com', 'password123', 'No.44, Silverstone', 'USER');
