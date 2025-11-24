const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', (req, res) => {
  res.render('index', { title: 'Főoldal' });
});

router.get('/adatbazis', async (req, res) => {
  try {
    const [cpus] = await pool.query(
      'SELECT id, gyarto, tipus FROM processzor ORDER BY gyarto, tipus'
    );

    const [oses] = await pool.query(
      'SELECT id, nev FROM oprendszer ORDER BY nev'
    );

    const [laptops] = await pool.query(`
      SELECT g.id,
             g.gyarto,
             g.tipus,
             g.kijelzo,
             g.memoria,
             g.merevlemez,
             g.videovezerlo,
             g.ar,
             g.db,
             p.gyarto   AS cpu_gyarto,
             p.tipus    AS cpu_tipus,
             o.nev      AS oprendszer
      FROM gep g
      JOIN processzor p ON g.processzorid = p.id
      JOIN oprendszer o ON g.oprendszerid = o.id
      ORDER BY g.gyarto, g.tipus
      LIMIT 50
    `);

    res.render('adatbazis', {
      title: 'Adatbázis menü',
      cpus,
      oses,
      laptops
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt az adatbázis lekérdezésekor.');
    res.redirect('/app001/');
  }
});

module.exports = router;
