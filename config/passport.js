const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Users = require('./../models/Users');


module.exports = function(passport){

    passport.use(new localStrategy({ usernameField: 'email' }, function (email, password, done) {
        //login form connected to the strategy
        //Match the user
        // check for the user
            Users.findOne({
                email: email
            })
            .then(function (user) {
                if (!user) {
                    return done(null, false, { message: "User not Found" })
                }
                bcrypt.compare(password, user.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user, { message: 'Password Correct' });
                    }else{
                        return done(null,false,{message:'Password dose not Match'   })
                    }
                });
            })
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        Users.findById(id, function (err, user) {
            done(err, user);
        });
    });

}
