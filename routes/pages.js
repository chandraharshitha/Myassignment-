const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
router.get('/',authController.isLoggedIn,function (req, res) {
    res.render('pages/index')
});
router.get('/register', (req, res) => {
    res.sendFile("register.html", { root: './public/' })
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.sendFile("profile.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});
// router.get('/',authController.isLoggedIn, function(req, res) {
//     res.render('pages/index')
//    });
   //pdf 
router.get('/resume',authController.isLoggedIn, function(req, res) {
   res.download('resume.pdf' )
  });
  
// about page
router.get('/about',authController.isLoggedIn, function(req, res) {
   res.render('pages/about');
});
// contacts page
router.get('/contact', function(req, res) {
   res.render('pages/contact');
});
// projects page
router.get('/project', function(req, res) {
   res.render('pages/project');
});
// services page
router.get('/service', function(req, res) {
   res.render('pages/service');
});
// signup page
router.get('/signup', function(req, res) {
   res.render('pages/signup',{ message: req.flash('signupMessage') });
});
// login page
router.get('/login', function(req, res) {
   res.render('pages/login',{ message: req.flash('loginMessage') });
});
// conterv page
router.get('/conterv', function(req, res) {
   res.render('pages/contactservices');
});

module.exports = router;