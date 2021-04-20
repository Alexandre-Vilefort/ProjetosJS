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
const { google } = require('googleapis');//
const request = require('request');//
const cors = require('cors');//
const urlParse = require('url-parse');//
const queryParse = require('query-string');//
const { body, validationResult } = require('express-validator');

const app = express();

// usersContactsList = [];
// exports.usersContactsList = usersContactsList;

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
app.use(cors());
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
    // usersContactsList.push = {
    //     userId: req.user.id,
    //     contacts: contactsList
    // }
    req.user.contacts = contactsList;
});

app.get('/agenda',
    checkAuthenticated,
    (req, res) => {
        res.redirect('/agenda');
        res.json()
    });

app.get('/login',
    checkNotAuthenticated,
    (req, res) => {
        res.render('login.ejs');
    });

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register',
    checkNotAuthenticated,
    (req, res) => {
        res.render('register.ejs');
    });

app.post('/register',
    checkNotAuthenticated,
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 3 }),
    body('name').isLength({ min: 3 }),
    async (req, res) => {
        let test = true;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            console.log(result.errors[0].param);
            let errText = "";
            for (let er of result.errors) { errText = errText + ` ${er.param} inválido,` }
            res.render('register.ejs', { name: 'Erro, ' + errText });
            test = false
            return
        }
        try {
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

                //Enviar email de notificação do Cadastro
                wrapedSendMail(req.body.email);
                console.log(req.body)
                res.redirect('/login');
            }
        } catch (err) {
            console.log(err);
            res.render('register.ejs', { name: err });
        }
    });

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})

//####Importar contatos do Google People API#####

app.get('/getURLImp', (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUR_CLIENT_ID,
        process.env.YOUR_CLIENT_SECRET,
        process.env.YOUR_REDIRECT_URL
    );
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: process.env.SCOPES,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    });
    request(url, (err, response, body) => {
        if (err) console.log('error: ', err);
        console.log('statusCode: ', response && response.statusCode);
        res.redirect(url);
    })
});

app.get('/import', async (req, res) => {
    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUR_CLIENT_ID,
        process.env.YOUR_CLIENT_SECRET,
        process.env.YOUR_REDIRECT_URL
    );

    const { tokens } = await oauth2Client.getToken(code);
    //const { tokens } = oauth2Client.getToken(code);
    console.log(tokens);
    res.redirect('/agenda')

    oauth2Client.setCredentials(tokens);
    const service = google.people({ version: 'v1', auth: oauth2Client });
    service
    service.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,phoneNumbers',
    }, (err, res) => {
        if (err) {
            return console.error('The API returned an error: ' + err)
        } else { console.log("sem erro") }
        const connections = res.data.connections;
        if (connections) {
            console.log('Connections:');
            connections.forEach((person) => {
                let authContact = true;
                let countContact = 0;
                var newData = new Object();
                if ((person.names && person.names.length > 0)) {
                    newData.name = person.names[0].displayName;
                } else { authContact = false }

                if ((person.emailAddresses && person.emailAddresses.length > 0)) {
                    newData.email = person.emailAddresses[0].value;
                    countContact++;
                } else { newData.email = '' }

                if ((person.phoneNumbers && person.phoneNumbers.length > 0)) {
                    newData.phone = person.phoneNumbers[0].value;
                    countContact++;
                } else { newData.phone = '' }

                if (authContact && countContact) {

                    newData.categories = '';
                    newData.address = [''];

                    // let newAddress = new Object();

                    // newAddress.cep = '';
                    // newAddress.Logradouro = '';
                    // newAddress.Número = '';
                    // newAddress.Complemento = '';
                    // newAddress.Bairro = '';
                    // newAddress.Localidade = '';
                    // newAddress.Estado = '';
                    // addressList.push(newAddress);

                    console.log(newData.name, newData.email, newData.phone);
                    let isInContacts = false;
                    for (let cont of req.user.contacts){
                        if (cont.name == newData.name) isInContacts = true;
                    }
                    if (isInContacts == false) req.user.contacts.push(newData);
                }
            });
            writeOnJSON(req.user.contacts, req.user.id);
        }
    })
});

//####Fim Importar contatos

app.listen(app.get('port'), () => {
    console.log(`Server is running on http://${app.get('host')}:${app.get('port')}`);
});


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

async function writeOnJSON(jsonContent, userId) {
    console.log(`${userId}.json`);
    fs.writeFile(`dataBase/${userId}.json`, JSON.stringify(jsonContent, null, 2), function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
};