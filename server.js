const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'champion-hotel-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// ── API Routes ─────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/booking', bookingRoutes);

// ── Serve Static Frontend ──────────────────────────────────
// Serve all HTML, CSS, JS, images from the project root
app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
}));

// Fallback: serve index.html for any unknown non-API route
app.get('{*path}', (req, res) => {
  // Only for non-API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ status: 'error', message: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Initialize DB & Start Server ───────────────────────────
getDb(); // Creates tables and seeds data on first run

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🏨 Champion Hotel Management System       ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║   Server running at http://localhost:${PORT}    ║`);
  console.log('║                                              ║');
  console.log('║   Login Credentials:                         ║');
  console.log('║   Admin:    admin / Admin!234                 ║');
  console.log('║   Staff:    alex / Staff!234                  ║');
  console.log('║   Customer: guest@example.com / Guest!234     ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});
