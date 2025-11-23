const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const pool = require('../config/db');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Regisztráció' });
});

router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;

  if (!username || !password || !password2) {
    req.flash('error', 'Minden mező kitöltése kötelező.');
    return res.redirect('/app001/register');
  }

  if (password !== password2) {
    req.flash('error', 'A két jelszó nem egyezik.');
    return res.redirect('/app001/register');
  }

  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      req.flash('error', 'Ez a felhasználónév már foglalt.');
      return res.redirect('/app001/register');
    }

    const hash = await bcrypt.hash(password, 10);

    let role = 'user';
    const [countRows] = await pool.query('SELECT COUNT(*) AS db FROM users');
    if (countRows[0].db === 0) {
      role = 'admin';
    }

    await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hash, role]
    );

    req.flash('success', 'Sikeres regisztráció, most jelentkezz be!');
    res.redirect('/app001/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt a regisztráció során.');
    res.redirect('/app001/register');
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Bejelentkezés' });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/app001/',
    failureRedirect: '/app001/login',
    failureFlash: true
  })
);

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Sikeresen kijelentkeztél.');
    res.redirect('/app001/');
  });
});

module.exports = router;
