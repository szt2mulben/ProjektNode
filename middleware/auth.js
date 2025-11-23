function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Bejelentkezés szükséges.');
  return res.redirect('/app001/login');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') return next();
  req.flash('error', 'Nincs jogosultságod az Admin oldalhoz.');
  return res.redirect('/app001/');
}

module.exports = { ensureAuthenticated, ensureAdmin };
