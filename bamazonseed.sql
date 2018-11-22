DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price DECIMAL(10,2),
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

USE bamazon;

DELETE FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES 
	("Secret Poo Spray", "Cosmetics", 2.50, 10),
    ("After Sun Spray", "Cosmetics", 2.75, 50),
    ("Go Away Itch Roll-On", "Cosmetics", 1.50, 20),
    ("Healing Balm", "Cosmetics", .75, 100),	
    ("Cocoa Butter Aloe Lotion", "Cosmetics", 2.00, 50),
    ("Skeeter Beater Bug Spray", "Cosmetics", 2.75, 20),    
    ("Peppermint Lip Balm", "Cosmetics", .80, 100),
    ("Bath Bombs", "Bath and Body", 3.50, 50),
    ("Bubble Bath Bombs", "Bath and Body", 3.75, 50),    
    ("Paw Butter", "Pets", 4.25, 200);
    