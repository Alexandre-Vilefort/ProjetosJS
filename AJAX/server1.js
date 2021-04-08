const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

//port
app.set('port', process.env.PORT || 8000);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//static files
app.use(express.static('public'));

//start server
 app.listen(app.get('port'),function(){
     console.log(`server on port ${app.get('port')}`);
 });
//Funcionando!!


