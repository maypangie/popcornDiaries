
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

