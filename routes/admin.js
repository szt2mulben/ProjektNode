const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { ensureAdmin } = require('../middleware/auth');

router.get('/admin', ensureAdmin, async (req, res) => {
  try {
    const [[{ userCount }]] = await pool.query(
      'SELECT COUNT(*) AS userCount FROM users'
    );

    const [[{ messageCount }]] = await pool.query(
      'SELECT COUNT(*) AS messageCount FROM messages'
    );

    const [[{ laptopCount }]] = await pool.query(
      'SELECT COUNT(*) AS laptopCount FROM gep'
    );

    res.render('admin/index', {
      title: 'Admin – Vezérlőpult',
      stats: {
        userCount,
        messageCount,
        laptopCount
      }
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt az admin felület betöltésekor.');
    res.redirect('/app001/');
  }
});

module.exports = router;
