// load the things we need
var express = require('express');
var app = express();


app.use(express.static("public"));

// set the view engine to ejs
app.set('views', './views');
app.set('view engine', 'ejs');



// use res.render to load up an ejs view file
//pdf



// index page 
app.get('/', function(req, res) {
     res.render('pages/index', )
    });
    //pdf 
app.get('/resume', function(req, res) {
    res.download('resume.pdf' )
   });
   
// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});
// contacts page
app.get('/contact', function(req, res) {
    res.render('pages/contact');
});
// projects page
app.get('/project', function(req, res) {
    res.render('pages/project');
});
// services page
app.get('/service', function(req, res) {
    res.render('pages/service');
});

app.listen(8080);
console.log('8080 is the magic port');
