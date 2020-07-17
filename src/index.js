const passport = require('passport');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const path = require('path');
const exphbs = require('express-handlebars');

// Initializations
const app = express();
require('./database');
require('./config/passport');

// Settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}))
app.set('view engine', '.hbs')

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mipalabrasecreta',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
// Globals Variables
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use(require('./routes/index'))
app.use('/notes', require('./routes/notes'))
app.use('/users', require('./routes/users'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Server start :D
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'))
})