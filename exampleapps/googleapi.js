var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var readline = require('readline');
var plus = google.plus('v1');

var express = require('express');
var app     = express();
var port    = 	process.env.PORT || 8080;
var bodyParser = require('body-parser');
var HTTPStatus = require('http-status');
app.use( bodyParser.urlencoded() );       // to support JSON-encoded bodies


// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '';
var CLIENT_SECRET = '';
var REDIRECT_URL = 'http://localhost:8080/oauth2callback';

var API_KEY = ''; // specify your API key here

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function(code) {
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      console.log('tokens are -->>'+tokens);	
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}

//app.get('/oauth/google', function(req, res) {
//    // This will ask for permisssions etc and redirect to callback url.
//    Linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo']);
//});

/*
// retrieve an access token
getAccessToken(oauth2Client, function() {
  // retrieve user profile
  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
    console.log(profile.displayName, ':', profile.tagline);
  });
});
*/
app.get('/', function(req, res) {
	res.send('It is a google plus app..');
});

/*
app.get('/oauth2callback', function(req, res) {
    var code = req.query.code;
    console.log(code);
    oauth2Client.getToken(code, function(err, tokens) {
      console.log('tokens are -->>'+tokens);	
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
       plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
	    if (err) {
	      console.log('An error occured', err);
	      return;
	    }
	    console.log(profile);
	    //console.log(profile.displayName, ':', profile.tagline);
	    res.redirect('/');	
	  });
    });  	
});
*/
app.get('/oauth2callback', function(req, res) {
  //  var code = req.query.code;
   // console.log(code);
//    oauth2Client.getToken(code, function(err, tokens) {
//      console.log('tokens are -->>'+tokens);	
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
//      oauth2Client.setCredentials(tokens);
	var userGplus = req.query.user;



	plus.people.get({ auth: API_KEY, userId: '+'+ userGplus }, function(err, user) {
	  console.log('Result: ' + (err ? err.message : user));
	  console.log(user);
	  console.log(user.circledByCount);
	  res.redirect('/');		
	});

});


app.listen(port);
console.log('Magic happens on port ' + port);
