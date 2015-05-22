var LocalStrategy   = require('passport-local').Strategy;
var models          = require('../app/models/');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        models(function (err, db) {
            if (err) return next(err);

            db.models.users.get(id, function(err, user) {
                done(err, user);
            });
        });
    });

 	// =========================================================================
    // LOCAL LOGIN  ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'login[email]',
        passwordField : 'login[password]',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        req.models.users.find({ 'email' :  email.toLowerCase() }, 1, function(err, users) {
            // if there are any errors, return the error before anything else
            var user;

            if (err)
                return done(err);

            // Even if limit is one, ORM2 still returns an array of users
            if (users.length)
                user = users[0]

            // if no user is found, return the message
            if (!user) {
                req.flash('loginMessage', 'Wrong credentials')
                return done(null, false); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            user.validPassword(password, function(result) {
                if (!result) {
                    req.flash('loginMessage', 'Wrong credentials')
                    return done(null, false); // create the loginMessage and save it to session as flashdata
                }
                else {
                    if (user.active) {
                        return done(null, user);
                    }
                    else {
                        req.flash('loginMessage', 'Sorry but your user is not activated. Please contact viktor@vigu.se to get access to the application.')
                        return done(null, false); // create the loginMessage and save it to session as flashdata
                    }
                }
            })
        });

    }));

};