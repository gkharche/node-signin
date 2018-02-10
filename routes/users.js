const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {checkAuthenticated} = require('./../helpers/auth');


const Users = require('./../models/Users');


router.get('/',function(req,res){
    res.render('home');
});


router.get('/home', checkAuthenticated, function (req, res) {
    res.render('users/dashboard');
});

router.post('/signin',function(req,res,next){

    //1. pass req,res,and callback function to passport authenticated 
    //define the passport statergy
    passport.authenticate('local', {
        successRedirect: '/users/home',
        failureRedirect: '/users/signin',
        failureFlash: true
    })(req,res,next);

});

router.get('/signin', function (req, res) {
    res.render('users/signin');
});

router.get('/signup',function(req,res){
    req.flash('success_msg', 'Email Alredy Exist.!');
    res.render('users/signup');
});

router.post('/signup',function(req,res){

    let errors = [];
    if(!req.body.name){
        errors.push({text:'Please enter User Name'});
    }
    if (!req.body.email) {
        errors.push({ text: 'Please enter Email' });
    }
    if (!req.body.password) {
        errors.push({ text: 'Please enter Password' });
    }
    if(req.body.password !=  req.body.password2){
        errors.push({ text: 'Password And Confirm Password Not Match.!' });  
    }
    if (errors.length > 0) {
        res.render('users/signup', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }

    //save into database
    //create new 

    var newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    //check if user already exit
    Users.findOne({email:newUser.email})
        .then(function(user){

            if (user){

                req.flash('error_msg', 'Email Alredy Exist.!');
                res.redirect('/users/signup');
            }else{

                //rengare sal and has password
                bcrypt.genSalt(10, function (err, salt) {

                    bcrypt.hash(newUser.password, salt, function (err, hash) {

                        //assing new has to password of newUser object
                        newUser.password = hash;
                        //console.log(newUser);

                        //save into database
                        newUser.save()
                            .then(function (user) {
                                req.flash('success_msg','You are successfuly registerd.');
                                res.redirect('/users/signin');
                            })
                            .catch(function (err) {
                                if (err) throw err;
                                return;
                            });

                    }); //end of hash

                });// end of genSalt

            }
        });
   
});

router.get('/logout',function(req,res){
    req.logout();
    req.flash('success_msg','You are logout');
    res.redirect('/users/signin');
});


module.exports = router;
