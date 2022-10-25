const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    debug: false
});
exports.login = async (req, res,next) => {
    try {
        const  password  = req.body.password;
        const email =req.body.email
        if (!email || !password) {
            return  res.render('pages/signup', {
                message: "Please Provide an email and password"
            });
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            console.log(results);
            if (!results || !await bcrypt.compare(password, results[0].password)) {
                res.status(401).render('pages/login', {
                    message: 'Email or Password is incorrect'
                });
            }
             else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: 
                      new Date(Date.now() + (30*24*3600000))
                    ,
                    httpOnly: true
                }
                res.cookie('userSave', token, cookieOptions);
                res.status(200).redirect("/business");
            }
        });
    } catch (err) {
        console.log(err);
    }
}
exports.register = (req, res) => {
    req.assert('name', 'Name is required').notEmpty()        //Validate name
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('email', 'A valid email is required').notEmpty()  //Validate email

    
    console.log('req.1');
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;
    db.query('SELECT email from  users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
            console.log('req.body1');

        } else {
            if (results.length > 0) {
                console.log('req.body2');

                return res.render('pages/signup', {
                    message: 'The email is already in use'
                });
            } else if (password != passwordConfirm) {
                return res.render('pages/signup', {
                    message: 'Password dont match'
                });
            } 
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                return res.render('pages/bussn', {
                    message: 'User registered'
                });
            }
        });
    });
    res.redirect('/business');
}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.userSave) {
        try {
            // 1. Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                process.env.JWT_SECRET
            );
            console.log(decoded);

            // 2. Check if the user still exist
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
                console.log(results);
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.log(err)
            return next();
        }
    } else {
        next();
        return res.redirect('/')
    }
}
exports.logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).redirect("/");
}