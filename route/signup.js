/* given roues and their controler*/
const express = require('express')

const CustomerController = require("../controller/signup");

const router = express.Router();

router.post("/signup", CustomerController.signup);
router.post("/signin", CustomerController.signin);
router.post("/admin_signin", CustomerController.admin_signin);

router.get('/admin-login', function(req, res) {
    if(req.session.userDetails) res.redirect("/")
    else{
        res.render('signup/admin-login', {
            user: (req.session.userDetails) ? req.session.userDetails : ''
        });
    }
});

router.get('/register', function(req, res) {
    if(req.session.userDetails) res.redirect("/")
    else{
        let result = (typeof req.session.userDetails !== "undefined" ? 'signup/signin' : 'signup/signup');
        res.render(result, {
            user: (req.session.userDetails) ? req.session.userDetails : ''
        });
    }
});

router.get('/onboard', function(req, res) {
    res.render('signup/onboard', {
        user: (req.session.userDetails) ? req.session.userDetails : ''
    });
});

// router.get('/homepage', function(req, res) {
//     res.render('signup/signin', {
//         user: (req.session.userDetails) ? req.session.userDetails : ''
//     });
// });

router.get('/forgotpassword', function(req, res) {
    res.render('forgotpass/forgot-password', {
        user: (req.session.userDetails) ? req.session.userDetails : ''
    });
});

router.get('/vendordash', function(req, res) {
    res.render('vendor/vendordashboard', {
        user: (req.session.userDetails) ? req.session.userDetails : ''
    });
});

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.render('signup/signup', {
            user: ''
        });
    });
});

router.get('/adminlogout', function(req, res) {
    req.session.destroy(function(err) {
        res.render('signup/admin-login', {
            user: ''
        });
    });
});

module.exports = router;