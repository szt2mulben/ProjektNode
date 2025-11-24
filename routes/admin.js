const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { ensureAdmin } = require('../middleware/auth');

router.get('/admin', ensureAdmin, async (req, res) => {
  const [users] = await pool.query('SELECT id, username, role FROM users ORDER BY username');
  res.render('admin/index', { title: 'Admin felület', users });
});

module.exports = router;
