const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/database');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, username, password, user_type } = req.body;
  const db = getDb();

  if (!password) {
    return res.status(400).json({
      status: 'error',
      message: 'Password is required',
    });
  }

  let user;

  if (user_type === 'customer') {
    // Customer logs in with email
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }
    user = db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1').get(email);
  } else {
    // Staff/Admin logs in with username
    if (!username) {
      return res.status(400).json({
        status: 'error',
        message: 'Username is required',
      });
    }
    user = db
      .prepare('SELECT * FROM users WHERE username = ? AND user_type IN (?, ?) LIMIT 1')
      .get(username, 'staff', 'admin');
  }

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials. Please check your details and try again.',
    });
  }

  // Set session
  req.session.user = {
    id: user.id,
    email: user.email,
    username: user.username,
    user_type: user.user_type,
    full_name: user.full_name,
  };

  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ status: 'error', message: 'Session error' });
    }

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: req.session.user,
      },
    });
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Logout failed' });
    }
    res.json({ status: 'success', message: 'Logout successful' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authenticated',
    });
  }

  res.json({
    status: 'success',
    data: req.session.user,
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, full_name } = req.body;
  const db = getDb();

  if (!email || !password || !full_name) {
    return res.status(400).json({
      status: 'error',
      message: 'Email, password, and full name are required',
    });
  }

  // Check if user already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({
      status: 'error',
      message: 'An account with this email already exists',
    });
  }

  const hash = bcrypt.hashSync(password, 10);

  const result = db
    .prepare('INSERT INTO users (user_type, email, password_hash, full_name) VALUES (?, ?, ?, ?)')
    .run('customer', email, hash, full_name);

  // Auto-login after registration
  req.session.user = {
    id: result.lastInsertRowid,
    email,
    user_type: 'customer',
    full_name,
  };

  res.status(201).json({
    status: 'success',
    message: 'Registration successful',
    data: { user: req.session.user },
  });
});

module.exports = router;
