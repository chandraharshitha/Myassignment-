const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const mysql = require("mysql");
//
var createError = require('http-errors');
 var path = require('path');
 var cookieParser = require('cookie-parser');
 var logger = require('morgan');
 var expressValidator = require('express-validator');
 var flash = require('express-flash');
 var session = require('express-session');
 var bodyParser = require('body-parser');
 var expressValidator = require('express-validator');
 router.use(expressValidator())
 
//

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
});



router.get('/profile', authController.isLoggedIn, function (req, res) {
   res.render('pages/index')
});


router.get('/profile', authController.isLoggedIn, (req, res) => {
   if (req.user) {
      res.render('pages/index')
   } else {
      res.render('pages/login', { message: req.flash('loginMessage') });
   }
});
//pdf 
router.get('/resume', authController.isLoggedIn, function (req, res) {
   res.download('resume.pdf')
});

// about page
router.get('/about', authController.isLoggedIn, function (req, res) {
   res.render('pages/about');
});
// contacts page
router.get('/contact', authController.isLoggedIn, function (req, res) {
   res.render('pages/contact');
});
// projects page
router.get('/project', authController.isLoggedIn, function (req, res) {
   res.render('pages/project');
});
// services page
router.get('/service', authController.isLoggedIn, function (req, res) {
   res.render('pages/service');
});
// signup page
router.get('/', function (req, res) {
   res.render('pages/signup', { message: req.flash('signupMessage') });
});
// login page
router.get('/login', function (req, res) {
   res.render('pages/login', { message: req.flash('loginMessage') });
});
// conterv page
router.get('/conterv', function (req, res) {
   res.render('pages/contactservices');
});

// crud 


// router.get('/business', function(req, res, next) {

//    db.query('SELECT * FROM users ORDER BY name asc',function(err,rows)     {

//           if(err){
//            req.flash('error', err); 
//            res.render('pages/bussn',{page_title:"Users - Node.js",data:''});   
//           }else{

//               res.render('pages/bussn',{page_title:"Users - Node.js",data:rows});
//           }

//            });

//       });
//       router.get('/edit/:id', function(request, response, next){

//          var id = request.body.id;

//          var query = `SELECT * FROM users WHERE id = "${id}"`;

//          database.query(query, function(error, data){
//       'pages/bussn'
//             response.render('pages/bussn', {title: 'Edit MySQL Table Data', action:'edit', sampleData:data[0]});

//          });

//       });


router.get('/business', authController.isLoggedIn,function (req, res, next) {

   db.query('SELECT * FROM users ORDER BY name asc', function (err, rows) {

      if (err) {
         req.flash('error', err);
         res.render('pages/bussn', { page_title: "Users - Node.js", data: '' });
      } else {

         res.render('pages/bussn', { page_title: "Users - Node.js", data: rows });
      }

   });

});
// SHOW ADD USER FORM
router.get('/add', authController.isLoggedIn, function (req, res, next) {
   // render to views/user/add.ejs
   res.render('pages/add', {
      title: 'Add New Customers',
      name: '',
      email: '',
      number:''
   });
});
// ADD NEW USER POST ACTION
router.post('/add', authController.isLoggedIn, function (req, res, next) {
   req.assert('name', 'Name is required').notEmpty()        //Validate name
   req.assert('email', 'A valid email is required').isEmail()  //Validate email
   req.assert('number','a valid number is required').isAlphanumeric()
   var errors = req.validationErrors()
   if (!errors) {   //No errors were found.  Passed Validation!
      var user = {
         name: req.sanitize('name').escape().trim(),
         email: req.sanitize('email').escape().trim(),
         number: req.sanitize('number').escape().trim()

      }
      db.query('INSERT INTO users SET ?', user, function (err, result) {
         //if(err) throw err
         if (err) {
            req.flash('error', err)
            // render to views/user/add.ejs
            res.render('pages/add', {
               title: 'Add New Customer',
               name: user.name,
               email: user.email,
               number:user.email
            });
         } else {
            req.flash('success', 'Data added successfully!');
            res.redirect('/business');
         }
      });
   }
   else {   //Display errors to user
      var error_msg = ''
      errors.forEach(function (error) {
         error_msg += error.msg + '<br>'
      });
      req.flash('error', error_msg)
      /**
      * Using req.body.name 
      * because req.param('name') is deprecated
      */
      res.render('pages/add', {
         title: 'Add New Customer',
         name: req.body.name,
         email: req.body.email,
         number:req.body.number
      });
   }
});
// SHOW EDIT USER FORM
router.get('/edit/:id', authController.isLoggedIn, function (req, res, next) {
   var userId =req.params.id
   db.query('SELECT * FROM users WHERE id = ' + req.params.id, function (err, rows, fields) {
      if (err) throw err
      // if user not found
      if (rows.length <= 0) {
         req.flash('error', 'Customers not found with id = ' + req.params.id);
         res.redirect('/business')
      }
      else { // if user found
         // render to views/user/edit.ejs template file
         res.render('pages/edit', {
            title: 'Edit User',
            //data: rows[0],
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            number: rows[0].number
         });
      }
   });
});
// EDIT USER POST ACTION
router.post('/update/:id' , authController.isLoggedIn,function (req, res, next) {
   console.log('allan')
   req.assert('name', 'Name is required').notEmpty()           //Validate nam           //Validate age
   req.assert('email', 'A valid email is required').isEmail()  //Validate email
   req.assert('number','a valid number is required').isAlphanumeric()

   var errors = req.validationErrors()
   if (!errors) {
      var user = {
         name: req.sanitize('name').escape().trim(),
         email: req.sanitize('email').escape().trim(),
         number: req.sanitize('number').escape().trim()

      }
      db.query('UPDATE users SET ? WHERE id = ' + req.body.params, user, function (err, result) {
         //if(err) throw err
         if (err) {
            req.flash('error', err)
            // render to views/user/add.ejs
            res.render('pages/add', {
               title: 'Edit Customer',
               id: req.params.id,
               name: req.body.name,
               email: req.body.email,
               number: req.body.number

            });
         } else {
            req.flash('success', 'Data updated successfully!');
            res.redirect('/business');
         }
      });
   }
   else {   //Display errors to user
      var error_msg = ''
      errors.forEach(function (error) {
         error_msg += error.msg + '<br>'
      });
      req.flash('error', error_msg)
      /**
      * Using req.body.name 
      * because req.param('name') is deprecated
      */
      res.render('pages/edit', {
         title: 'Edit Customer',
         id: req.params.id,
         name: req.body.name,
         email: req.body.email,
        number: req.body.number
      });
   };
});
// DELETE USER
router.get('/delete/(:id)', authController.isLoggedIn, function (req, res, next) {
   var user = { id: req.params.id }
   db.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (err, result) {
      //if(err) throw err
      if (err) {
         req.flash('error', err)
         // redirect to users list page
         res.redirect('/business');
      } else {
         req.flash('success', 'Customer deleted successfully! id = ' + req.params.id)
         // redirect to users list page
         res.redirect('/business');
      }
   });
});

//ends here
module.exports = router;