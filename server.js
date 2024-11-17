// server.js

// set up ======================================================================
// get all the tools we need
/*
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port); */

//above is original code

//new code below

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');

const configDB = require('./config/database.js');
//const Movie = require('./app/models/movie');

const path = require('path');
const Movie = require(path.resolve(__dirname, 'app', 'models', 'movie'));




; // MongoDB model for movies
require('./config/passport')(passport);

mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'rcbootcamp2021b',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(express.static(path.join(__dirname, 'public')));


let db;

// Connect to MongoDB
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    require('./app/routes')(app, passport, db);

});

// Routes

app.listen(port, () => console.log(`Server running on port ${port}`));

