const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/kapcsolat', ensureAuthenticated, (req, res) => {
  res.render('messages/contact', { title: 'Kapcsolat' });
});

router.post('/kapcsolat', ensureAuthenticated, async (req, res) => {
  const { name, email, subject, body } = req.body;

  try {
    await pool.query(
      'INSERT INTO messages (name, email, subject, body) VALUES (?, ?, ?, ?)',
      [name, email, subject, body]
    );
    req.flash('success', 'Üzenetedet fogadtuk.');
    res.redirect('/app001/kapcsolat');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt az üzenet mentésekor.');
    res.redirect('/app001/kapcsolat');
  }
});

router.get('/uzenetek', ensureAuthenticated, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  res.render('messages/list', { title: 'Üzenetek', messages: rows });
});

module.exports = router;
