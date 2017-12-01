const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/Users');

module.exports = function(passport) {

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
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        userName : 'username',
        passWord : 'password',
        
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, userName, passWord, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            console.log('the username is ', userName)
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

        User.findOne({ userName : userName }, function(err, user) {
            // if there are any errors, return the error
            // console.log("before conditional", user)
            if (err) {
                console.log("passport error")
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                console.log("Existing user is: ", user)
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                console.log("made it to new user")
                // if there is no user with that email
                // create the user

                var newUser = new User();
                console.log(req.body.email);
                // set the user's local credentials
                newUser.email = req.body.email;
                newUser.passWord = newUser.generateHash(passWord);
                newUser.userName = req.body.username;
                newUser.firstName = req.body.firstName;
                newUser.lastName = req.body.lastName;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

}