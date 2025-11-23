const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const pool = require('./config/db');
const initPassport = require('./config/passport');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionStore = new MySQLStore({}, pool.promise ? pool.promise() : pool);

app.use(session({
  secret: 'titkoskulcs',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use(flash());

initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

const BASE = '/app001';

app.use(BASE, require('./routes/index'));
app.use(BASE, require('./routes/auth'));
app.use(BASE, require('./routes/messages'));
app.use(BASE, require('./routes/crud'));
app.use(BASE, require('./routes/admin'));


app.listen(4001, () => {
  console.log('A szerver fut a 4001-es porton');
});
