const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

//setting
app.set('port', process.env.PORT || 8000);
app.set('host', 'localhost');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use('/api', require('./routes/agenda/apiAgenda'));
app.use('/', require('./routes/login/server-login'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

//start server
app.listen(app.get('port'), function () {
   console.log(`Server is running on http://${app.get('host')}:${app.get('port')}`);
   //console.log(`server on port ${app.get('port')}`);
});