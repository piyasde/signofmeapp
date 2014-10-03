// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
//var mongojs = require('mongojs');
// load up the user 
//var configDB = require('./db.js');

// configuration ===============================================================
//var db = mongojs(configDB.dburl); // connect to our database
//var mycollection = db.collection('user');

var userwork = require('../userdao');

var async = require("async");




// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
            console.log(user);
            done(null, user);
    });

 
// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
		console.log(email);
		console.log(password);
		var userLocal = {};                
		console.log('11111');
		// we are checking to see name and password separately

		async.series([
		    function(callback) {
	
			userwork.findUser(email, function (err, user) {
				console.log(user);
				console.log("password -->>" +password);
				var userJson = JSON.parse(user);
				
				if (err)
					return callback(err);
				
				if (!user) 
					return callback('No user found.');

				if(userJson.length>0)
				{
					if (userJson[0].a.data.pwd != password)
						return callback('Oops! Wrong password.');
					console.log('successful user ---->>'+userJson[0].a.data.email); 
					var data = userJson[0].a.data;
					user = data;
					// User Profile
					console.log('userProfile1111 -->>');
					userLocal = user;
					return callback(null);	

				}
				else
				{
					return callback('No user found.');
				}
				
			
			  });
			},
		    function(callback) {
			userwork.findUserProfile(email, function (err, userProfile) {
						
						var userProfileJson; 
						userProfileJson = JSON.parse(userProfile);
						userLocal.userProfile = userProfileJson[0].a.data;
						console.log('p---->>'+JSON.stringify(userLocal.userProfile));
						return callback(null);	
					
			});	

		        },				
		], function(err) {
			if(err==='No user found.')
        			return done(null, false, req.flash('loginMessage', 'No user found.'));
			if(err==='Oops! Wrong password.')
        			return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));	
			if (err) {
			  console.error(err.stack || err);
			  return done(err);
			}
			user = 	userLocal;
			return done(null,user);
		      });	
		


    }));


};
