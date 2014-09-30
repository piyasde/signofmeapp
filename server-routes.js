// server.js

// BASE SETUP
// ==============================================

var express = require('express');
//var engines = require('consolidate');
//var app     = express();
//var port    = 	process.env.PORT || 8080;
//app.use(express.static(__dirname));
//app.set('views', __dirname + '/public');
//app.engine('html', engines.ejs);
//app.set('view engine', 'html');
//var bodyParser = require('body-parser');
//var HTTPStatus = require('http-status');
//app.use( bodyParser.urlencoded() );       // to support JSON-encoded bodies


var userwork = require('./dataaccess/userdao');
var config = require('./utilpackages/config');
var util = require('./utilpackages/util');
var async = require("async");


// ROUTES
// ==============================================

// sample route with a route the way we're used to seeing it
module.exports = function(app, passport) {
	app.get('/sample', function(req, res) {
		res.send('this is a sample!');	
	});
	// we'll create our routes here

	// get an instance of router
	var router = express.Router();

	// route middleware that will happen on every request
	router.use(function(req, res, next) {

		// log each request to the console
		console.log(req.method, req.url);

		// continue doing what we were doing and go to the route
		next();	
	});


	// about page route (http://localhost:8080/about)
	router.get('/about', function(req, res) {
		res.send('im the about page!');	
	});

	// apply the routes to our application
	app.use('/', router);
	// login routes

	// home page route (http://localhost:8080)
	router.get('/', function(req, res) {
			res.render('login.ejs',{ user: req.user, dirname : config.getRootDirectory(), message: req.flash('loginMessage') });
	});

	app.route('/login')

		// show the form (GET http://localhost:8080/login)
		.get(function(req, res) {
			res.render('login.ejs',{ user: req.user, dirname : config.getRootDirectory() , message: req.flash('loginMessage')  });
		})

		// process the form (POST http://localhost:8080/login)

		.post( //function(req, res) {
			//console.log('general post');
			//console.log(req.body);
		        //console.log(req.body.password);
			//console.log(req.body.email);

			passport.authenticate('local-login', { 
				       successRedirect: '/myprofile',
                                       failureRedirect: '/login',
				       failureFlash : true 
				})
			);
			//});

	app.route('/registration')

		// show the form (GET http://localhost:8080/login)
		.get(function(req, res) {
			res.render('registration.ejs');
		})

		// process the form (POST http://localhost:8080/login)
		.post(function(req, res) {
			res.set({'Content-Type': 'text/html'});
			console.log('processing');
			console.log(req.body);
		        console.log(req.body.name);
			console.log(req.body.email);
			var jsonBody = req.body;
			userwork.insertUser(req.body, function (err, contents) {
			    console.log(contents);
				if (err) {
					res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error');
				}
				else {
					var json = JSON.parse(contents);
					console.log("neo22221111--" +json[0].user.data.name);
					//console.log(contents[0].user.name);
					var userMsg = "Hi " + json[0].user.data.name + ", your registration is successful.";
					res.render('afterregistration.ejs', { message: userMsg }); 
					//res.send(HTTPStatus.OK,contents);
				}
			});
		});

	app.route('/updateuserdata')

		// process the form (POST http://localhost:8080/editprofile)
		.post(function(req, res) {
			res.set({'Content-Type': 'text/json'});
			console.log('processing');
			console.log(req.body);
		        var jsonEditUser = req.body.edituser;
			console.log(jsonEditUser);
			//var jsonEditUser = JSON.parse(jsonBody);
			//res.setHeader('Content-Type', 'application/json');
    			async.series([
		    		function(callback) {
					userwork.updateUser(jsonEditUser, function (err, contents) {
						util.debugMessage('contents -->> ' + contents);
						if(err)
						{
							return callback('Internal server error');
						}
						else
						{
							//jsonEditUser = JSON.parse(contents);
							return callback(null);							
						}	
					});
				},
		    		function(callback) {
					userwork.insertOrUpdateUserProfile(jsonEditUser, function (err, contents) {
						util.debugMessage('contents -->> ' + contents);
						if(err)
						{
							return callback('Internal server error');
						}
						else
						{
							//jsonEditUser = JSON.parse(contents);
							return callback(null);							
						}	
					});
				},
				function(callback) {
					userwork.insertOrUpdateUserRelationShip(jsonEditUser, function (err, contents) {
						util.debugMessage('contents -->> ' + contents);
						if(err)
						{
							return callback('Internal server error');
						}
						else
						{
							//jsonEditUser = JSON.parse(contents);
							return callback(null);							
						}	
					});
				},
				
			], function(err) {
				if (err) {
				  console.error(err.stack || err);
				}
				res.end(JSON.stringify(jsonEditUser));
				//return done(null,user);
		        });	

			
			/*
			userwork.insertUser(req.body, function (err, contents) {
			    console.log(contents);
				if (err) {
					res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error');
				}
				else {
					var json = JSON.parse(contents);
					console.log("neo22221111--" +json[0].user.data.name);
					//console.log(contents[0].user.name);
					var userMsg = "Hi " + json[0].user.data.name + ", your registration is successful.";
					res.render('afterregistration.ejs', { message: userMsg }); 
					//res.send(HTTPStatus.OK,contents);
				}
			});
			*/
		});



	app.route('/myprofile')
		// show the form (GET http://localhost:8080/login)
		.get(isLoggedIn , function(req, res) {
			res.render('myprofile.ejs', {
				user : req.user // get the user out of session and pass to template
				, dirname : "http://localhost:8080"
			});
		});
	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/');
		

	});
	// Now for angular services
	app.route('/users/:useremail/profileurl')
		.get(function(req, res) {
			console.log(req.params.useremail);
			userwork.findUser(req.params.useremail, function (err, user) {
				console.log(user);
				var userJson = JSON.parse(user);
				console.log("user.pwd -->>" +userJson[0].a.data.pwd);
				res.writeHead(200, {'Content-Type': 'application/json'});
				str='[';
				str = str + '{ "name" : "' + userJson[0].a.data.name + '",' +'\n';
				str = str + ' "email" : "' + userJson[0].a.data.email + '"},' +'\n';
				str = str.trim();
				str = str.substring(0,str.length-1);
				str = str + ']';
				res.end( str);
			});
	});
	// Angular HTMLs	
	app.route('/getProfile/:useremail')
		.get(isLoggedIn ,function(req, res) {
			res.render('getprofile.ejs',{ user: req.user, dirname : config.getRootDirectory() });
		});
	app.route('/editProfile/:useremail')
		.get(isLoggedIn ,function(req, res) {
			res.render('editprofile.ejs',{ user: req.user, dirname : config.getRootDirectory() });
		});		
	
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}



// START THE SERVER
// ==============================================
//app.listen(port);
//console.log('Magic happens on port ' + port);
