const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { ensureAdmin } = require('../middleware/auth');

router.get('/crud/processzor', ensureAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, gyarto, tipus FROM processzor ORDER BY gyarto, tipus'
    );

    res.render('crud/processzor_list', {
      title: 'Processzorok – CRUD',
      cpus: rows
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt a processzorok lekérdezésekor.');
    res.redirect('/app001/');
  }
});

router.get('/crud/processzor/uj', ensureAdmin, (req, res) => {
  res.render('crud/processzor_form', {
    title: 'Új processzor felvitele',
    mode: 'create',
    cpu: { gyarto: '', tipus: '' }
  });
});

router.post('/crud/processzor', ensureAdmin, async (req, res) => {
  const { gyarto, tipus } = req.body;

  if (!gyarto || !tipus) {
    req.flash('error', 'Minden mező kitöltése kötelező.');
    return res.redirect('/app001/crud/processzor/uj');
  }

  try {
    await pool.query(
      'INSERT INTO processzor (gyarto, tipus) VALUES (?, ?)',
      [gyarto, tipus]
    );
    req.flash('success', 'Új processzor sikeresen felvéve.');
    res.redirect('/app001/crud/processzor');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt az új processzor mentésekor.');
    res.redirect('/app001/crud/processzor/uj');
  }
});

router.get('/crud/processzor/:id/szerkesztes', ensureAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT id, gyarto, tipus FROM processzor WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      req.flash('error', 'Nincs ilyen ID-jú processzor.');
      return res.redirect('/app001/crud/processzor');
    }

    res.render('crud/processzor_form', {
      title: 'Processzor módosítása',
      mode: 'edit',
      cpu: rows[0]
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt a processzor betöltésekor.');
    res.redirect('/app001/crud/processzor');
  }
});

router.put('/crud/processzor/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { gyarto, tipus } = req.body;

  if (!gyarto || !tipus) {
    req.flash('error', 'Minden mező kitöltése kötelező.');
    return res.redirect(`/app001/crud/processzor/${id}/szerkesztes`);
  }

  try {
    await pool.query(
      'UPDATE processzor SET gyarto = ?, tipus = ? WHERE id = ?',
      [gyarto, tipus, id]
    );
    req.flash('success', 'Processzor adatai frissítve.');
    res.redirect('/app001/crud/processzor');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt a módosítás során.');
    res.redirect(`/app001/crud/processzor/${id}/szerkesztes`);
  }
});

router.delete('/crud/processzor/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM processzor WHERE id = ?', [id]);
    req.flash('success', 'Processzor törölve.');
    res.redirect('/app001/crud/processzor');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt a törlés során.');
    res.redirect('/app001/crud/processzor');
  }
});

module.exports = router;
