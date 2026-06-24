const express = require('express');
const { getDb } = require('../db/database');

const router = express.Router();

// GET /api/rooms/available?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD
router.get('/available', (req, res) => {
  const db = getDb();
  const checkIn = req.query.check_in || new Date().toISOString().split('T')[0];
  const checkOut =
    req.query.check_out ||
    new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const rooms = db
    .prepare(
      `SELECT r.*
       FROM rooms r
       WHERE r.status = 'available'
       AND r.id NOT IN (
         SELECT room_id
         FROM reservations
         WHERE (check_in <= ? AND check_out >= ?)
         AND status IN ('confirmed', 'checked_in')
       )`
    )
    .all(checkOut, checkIn);

  res.json({ status: 'success', data: rooms });
});

// GET /api/rooms — all rooms (staff/admin)
router.get('/', (req, res) => {
  const db = getDb();
  const rooms = db.prepare('SELECT * FROM rooms ORDER BY room_number').all();
  res.json({ status: 'success', data: rooms });
});

// GET /api/rooms/:id — single room
router.get('/:id', (req, res) => {
  const db = getDb();
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);

  if (!room) {
    return res.status(404).json({ status: 'error', message: 'Room not found' });
  }

  res.json({ status: 'success', data: room });
});

// POST /api/rooms — create room (admin)
router.post('/', (req, res) => {
  if (!req.session.user || req.session.user.user_type !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  }

  const db = getDb();
  const { room_number, room_type, rate, status } = req.body;

  if (!room_number || !room_type || !rate) {
    return res.status(400).json({
      status: 'error',
      message: 'room_number, room_type, and rate are required',
    });
  }

  const result = db
    .prepare('INSERT INTO rooms (room_number, room_type, rate, status) VALUES (?, ?, ?, ?)')
    .run(room_number, room_type, rate, status || 'available');

  const newRoom = db.prepare('SELECT * FROM rooms WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    status: 'success',
    message: 'Room created successfully',
    data: newRoom,
  });
});

module.exports = router;
