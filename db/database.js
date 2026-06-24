const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'hotel.db');

let db;

function getDb() {
  if (db) return db;

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  createTables();
  seedData();

  return db;
}

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_type TEXT NOT NULL DEFAULT 'customer' CHECK(user_type IN ('customer', 'staff', 'admin')),
      email TEXT UNIQUE,
      username TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_number TEXT NOT NULL UNIQUE,
      room_type TEXT NOT NULL,
      rate REAL NOT NULL,
      status TEXT DEFAULT 'available' CHECK(status IN ('available', 'occupied', 'maintenance')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      room_id INTEGER NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      guests INTEGER DEFAULT 1,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS food_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      room_id INTEGER,
      order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'ordered' CHECK(status IN ('ordered', 'preparing', 'ready', 'delivered', 'cancelled')),
      total_amount REAL DEFAULT 0,
      delivery_time DATETIME,
      estimated_delivery_time DATETIME,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      reservation_id INTEGER,
      reference TEXT UNIQUE NOT NULL,
      amount_due REAL NOT NULL,
      amount_paid REAL NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'partially_paid', 'paid', 'cancelled')),
      issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES food_orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
}

function seedData() {
  // Check if users already exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) return;

  console.log('🌱 Seeding database with initial data...');

  // Seed users — Passwords: Admin!234, Staff!234, Guest!234
  const adminHash = bcrypt.hashSync('Admin!234', 10);
  const staffHash = bcrypt.hashSync('Staff!234', 10);
  const guestHash = bcrypt.hashSync('Guest!234', 10);
  // Also support the temp login from the frontend
  const tempHash = bcrypt.hashSync('8848joseph', 10);

  const insertUser = db.prepare(`
    INSERT INTO users (user_type, email, username, password_hash, full_name)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run('admin', 'gm@championhotel.com', 'admin', adminHash, 'General Manager');
  insertUser.run('staff', 'frontdesk@championhotel.com', 'alex', staffHash, 'Alex Johnson');
  insertUser.run('customer', 'guest@example.com', null, guestHash, 'Jane Smith');
  insertUser.run('customer', 'kilonzojoseph8848@gmail.com', null, tempHash, 'Joseph Kilonzo');

  // Seed rooms
  const insertRoom = db.prepare(`
    INSERT INTO rooms (room_number, room_type, rate, status)
    VALUES (?, ?, ?, ?)
  `);

  const rooms = [
    ['101', 'Standard', 5000, 'available'],
    ['102', 'Standard', 5000, 'occupied'],
    ['103', 'Standard', 5000, 'available'],
    ['104', 'Standard', 5000, 'maintenance'],
    ['105', 'Standard', 5000, 'available'],
    ['201', 'Deluxe', 10000, 'available'],
    ['202', 'Deluxe', 10000, 'occupied'],
    ['203', 'Deluxe', 10000, 'available'],
    ['204', 'Deluxe', 10000, 'available'],
    ['301', 'Executive Suite', 15000, 'available'],
    ['302', 'Executive Suite', 15000, 'occupied'],
    ['303', 'Executive Suite', 15000, 'available'],
    ['401', 'Presidential Suite', 35000, 'available'],
    ['402', 'Presidential Suite', 35000, 'occupied'],
  ];

  const insertRooms = db.transaction(() => {
    for (const room of rooms) {
      insertRoom.run(...room);
    }
  });
  insertRooms();

  console.log('✅ Database seeded successfully!');
  console.log('   Admin:    admin / Admin!234');
  console.log('   Staff:    alex / Staff!234');
  console.log('   Customer: guest@example.com / Guest!234');
}

module.exports = { getDb };
