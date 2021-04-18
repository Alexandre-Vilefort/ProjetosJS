if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');

const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const morgan = require('morgan');
const fs = require('fs');

const app = express();


const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    //find user based on email, getUserByEmail on passport-config.js 
    id => users.find(user => user.id === id)
    //find user based on id, getUserById on passport-config.js 
);

const users = require('./users.json');

//setting
app.set('port', process.env.PORT || 8000);
app.set('host', 'localhost');
app.set('view-engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//Routes
app.use('/api', require('./routes/agenda/apiAgenda'));

//Static Files
app.use('/agenda',checkAuthenticated);
app.use('/agenda',express.static(path.join(__dirname, 'public')));

//Methods
// app.get('/', checkAuthenticated, (req, res) => {
//     res.render('index.ejs', { name: req.user.name });
// });
app.get('/', checkAuthenticated, (req, res) => {
    res.redirect('/agenda');
});

app.get('/agenda', checkAuthenticated, (req, res) => {
    res.redirect('/agenda');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        fs.writeFile('users.json', JSON.stringify(users, null, 2), function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
    } catch {
        res.redirect('/register')
    }
    console.log(users)
});

app.delete('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.listen(app.get('port'), function () {
    console.log(`Server is running on http://${app.get('host')}:${app.get('port')}`);
 });