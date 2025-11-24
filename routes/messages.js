const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/kapcsolat', (req, res) => {
  res.render('messages/contact', { title: 'Kapcsolat' });
});

router.post('/kapcsolat', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    req.flash('error', 'Minden mező kitöltése kötelező.');
    return res.redirect('/app001/kapcsolat');
  }

  try {
    await pool.query(
      'INSERT INTO messages (name, email, subject, body) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    req.flash('success', 'Üzenetedet sikeresen elküldted.');
    res.redirect('/app001/kapcsolat');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt az üzenet mentése közben.');
    res.redirect('/app001/kapcsolat');
  }
});

module.exports = router;
