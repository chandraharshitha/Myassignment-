// load the things we need
const express = require("express");
const path = require("path")
const mysql = require("mysql");
const app = express();
var session = require('express-session');
var flash = require('express-flash');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000
// third party 
dotenv.config();

app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());

// database 

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL CONNECTED")
    }
})




// set the view engine to ejs
app.set('views', './views');
app.set('view engine', 'ejs');



// use res.render to load up an ejs view file
//pdf



// index page 
// app.get('/', function(req, res) {
//      res.render('pages/index', )
//     });
//     //pdf 
// app.get('/resume', function(req, res) {
//     res.download('resume.pdf' )
//    });
   
// // about page
// app.get('/about', function(req, res) {
//     res.render('pages/about');
// });
// // contacts page
// app.get('/contact', function(req, res) {
//     res.render('pages/contact');
// });
// // projects page
// app.get('/project', function(req, res) {
//     res.render('pages/project');
// });
// // services page
// app.get('/service', function(req, res) {
//     res.render('pages/service');
// });
// // signup page
// app.get('/signup', function(req, res) {
//     res.render('pages/signup');
// });
// // login page
// app.get('/login', function(req, res) {
//     res.render('pages/login');
// });
// // conterv page
// app.get('/conterv', function(req, res) {
//     res.render('pages/contactservices');
// });

app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
console.log('8080 is the magic port');
