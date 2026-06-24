const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/database');

const router = express.Router();

// POST /api/booking — create a new booking
router.post('/', (req, res) => {
  const db = getDb();
  const { room_id, check_in, check_out, guests, guest_details } = req.body;

  // Validate required fields
  if (!room_id || !check_in || !check_out || !guests || !guest_details) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: room_id, check_in, check_out, guests, guest_details',
    });
  }

  // Validate dates
  const d1 = new Date(check_in);
  const d2 = new Date(check_out);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) {
    return res.status(400).json({ status: 'error', message: 'Invalid dates' });
  }

  // Validate guest details
  const requiredGuestFields = ['full_name', 'email', 'phone', 'id_number'];
  for (const field of requiredGuestFields) {
    if (!guest_details[field] || String(guest_details[field]).trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: `Missing guest detail: ${field}`,
      });
    }
  }

  try {
    // Use a transaction for atomicity
    const result = db.transaction(() => {
      // Check room availability
      const available = db
        .prepare(
          `SELECT COUNT(*) as cnt FROM rooms r
           WHERE r.id = ? AND r.status = 'available'
           AND r.id NOT IN (
             SELECT room_id FROM reservations
             WHERE (check_in <= ? AND check_out >= ?)
             AND status IN ('confirmed', 'checked_in')
           )`
        )
        .get(room_id, check_out, check_in);

      if (available.cnt === 0) {
        throw new Error('ROOM_UNAVAILABLE');
      }

      // Find or create user
      let userId;
      const existingUser = db
        .prepare('SELECT id FROM users WHERE email = ? LIMIT 1')
        .get(guest_details.email);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const randomPwd = Math.random().toString(36).slice(2);
        const hash = bcrypt.hashSync(randomPwd, 10);
        const userResult = db
          .prepare(
            'INSERT INTO users (user_type, email, password_hash, full_name) VALUES (?, ?, ?, ?)'
          )
          .run('customer', guest_details.email, hash, guest_details.full_name);
        userId = userResult.lastInsertRowid;
      }

      // Create reservation
      const ref = 'CHM' + Date.now() + Math.floor(Math.random() * 9000 + 1000);
      const resResult = db
        .prepare(
          `INSERT INTO reservations (user_id, room_id, check_in, check_out, guests, status, notes)
           VALUES (?, ?, ?, ?, ?, 'confirmed', ?)`
        )
        .run(userId, room_id, check_in, check_out, guests, guest_details.special_requests || null);

      const reservationId = resResult.lastInsertRowid;

      // Calculate cost
      const room = db.prepare('SELECT rate FROM rooms WHERE id = ?').get(room_id);
      const nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      const subtotal = room.rate * nights;
      const tax = subtotal * 0.16;
      const total = subtotal + tax;

      // Create invoice
      db.prepare(
        `INSERT INTO invoices (user_id, reservation_id, reference, amount_due, amount_paid, status)
         VALUES (?, ?, ?, ?, 0, 'pending')`
      ).run(userId, reservationId, ref, total);

      // Audit log
      db.prepare(
        `INSERT INTO audit_log (user_id, action, details)
         VALUES (?, 'booking_created', ?)`
      ).run(
        userId,
        JSON.stringify({
          reservation_id: reservationId,
          reference: ref,
          room_id,
          check_in,
          check_out,
        })
      );

      return { booking_reference: ref, reservation_id: reservationId, total_amount: total };
    })();

    res.json({
      status: 'success',
      message: 'Booking created',
      data: result,
    });
  } catch (err) {
    if (err.message === 'ROOM_UNAVAILABLE') {
      return res.status(409).json({ status: 'error', message: 'Room unavailable' });
    }
    console.error('Booking error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to create booking' });
  }
});

// GET /api/booking — list bookings for current user
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ status: 'error', message: 'Not authenticated' });
  }

  const db = getDb();
  const bookings = db
    .prepare(
      `SELECT r.*, rm.room_number, rm.room_type, rm.rate
       FROM reservations r
       JOIN rooms rm ON rm.id = r.room_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`
    )
    .all(req.session.user.id);

  res.json({ status: 'success', data: bookings });
});

module.exports = router;
