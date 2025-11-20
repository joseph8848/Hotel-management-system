-- Hotel Management System database schema

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('customer', 'staff', 'admin') NOT NULL DEFAULT 'customer',
    email VARCHAR(191) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    room_type VARCHAR(50) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    room_id INT UNSIGNED NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests SMALLINT DEFAULT 1,
    status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    room_id INT UNSIGNED,
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ordered', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'ordered',
    total_amount DECIMAL(10,2) DEFAULT 0,
    delivery_time DATETIME NULL,
    estimated_delivery_time DATETIME NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    reservation_id INT UNSIGNED,
    reference VARCHAR(40) UNIQUE NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('pending', 'partially_paid', 'paid', 'cancelled') DEFAULT 'pending',
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity SMALLINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES food_orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    action VARCHAR(120) NOT NULL,
    details TEXT,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed admin and sample staff account (replace password hashes using PHP password_hash)
INSERT INTO users (user_type, email, username, password_hash, full_name)
VALUES
    ('admin', 'gm@championhotel.com', 'admin', '$2y$10$z6h0pA2zS0Za8LbN9A0aeOj5BS0bhtRh4ALY72FviLHRiech2m2bK', 'General Manager'),
    ('staff', 'frontdesk@championhotel.com', 'alex', '$2y$10$J7gwWruDjVUxXVkkVqKOreZzQTRwLAA6k7zfIXOXRCF81A6/vgS5W', 'Alex Johnson'),
    ('customer', 'guest@example.com', NULL, '$2y$10$FH46U5Urk3xeK4KxUIhX/.6v0cGNHcMZt3vR62ByHgU1xY9tx5BcK', 'Jane Smith');
-- Passwords: Admin!234, Staff!234, Guest!234
