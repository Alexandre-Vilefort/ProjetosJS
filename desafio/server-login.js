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
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();

usersContactsList = [];
exports.usersContactsList = usersContactsList; 

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
app.use('/agenda', checkAuthenticated);
app.use('/agenda', express.static(path.join(__dirname, 'public')));

//Methods
app.get('/', checkAuthenticated, (req, res) => {
    res.redirect('/agenda');
    let contactsList = require(`./dataBase/${req.user.id}.json`);
    usersContactsList.push = {
        userId : req.user.id, 
        contacts : contactsList}
    req.user.contacts = contactsList;    
});

app.get('/agenda', checkAuthenticated, (req, res) => {
    res.redirect('/agenda');
    res.json()
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
        let test = true;
        const testEmail = await new Promise((resolve, reject) => {

            for (var user of users) {
                if (user.email == req.body.email) {
                    test = false;
                }
            }
            if (test) {
                resolve(true)
            } else {
                reject("Email já cadastrado")
            }
        });
        if (test) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            let newId = Date.now().toString()
            users.push({
                id: newId,
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

            fs.writeFile(`dataBase/${newId}.json`, JSON.stringify(new Array(), null, 2), function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("JSON file has been saved.");
            });

            wrapedSendMail(req.body.email);
            console.log(req.body)
            res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
        res.render('register.ejs', { name : err });
    }
});

app.delete('/logout', (req, res) => {
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

function setMailOptions(reciever) {
    var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: reciever,
        subject: 'Confirmação do Cadastro',
        text: 'Cadastro no app Agenda feito com sucesso'
    }
    return mailOptions;
}

async function wrapedSendMail(reciever) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: process.env.SENDER_EMAIL_SERVICE,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_EMAIL_PASSWORD
            }
        });
        let mailOptions = setMailOptions(reciever);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve('falha no envio do email');
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve('email enviado com sucesso');
            }
        })
    })
}