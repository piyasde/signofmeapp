// server.js

// BASE SETUP
// ==============================================

var express = require('express');
var app     = express();
var port    = 	process.env.PORT || 8080;
var bodyParser = require('body-parser');
var HTTPStatus = require('http-status');
app.use( bodyParser.urlencoded() );       // to support JSON-encoded bodies

var Linkedin = require('node-linkedin')('', '', 'http://localhost:8080/oauth/linkedin/callback');

//

app.get('/oauth/linkedin', function(req, res) {
    // This will ask for permisssions etc and redirect to callback url.
    Linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo']);
});

app.get('/oauth/linkedin/callback', function(req, res) {
    Linkedin.auth.getAccessToken(res, req.query.code, function(err, results) {
        if ( err )
            return console.error(err);

        /**
         * Results have something like:
         * {"expires_in":5184000,"access_token":". . . ."}
         */
	var linkedInVar = JSON.parse(results);
        console.log(results);
	console.log(linkedInVar);
	console.log(linkedInVar.access_token);


	var linkedin = Linkedin.init(linkedInVar.access_token);
	linkedin.people.me(['id', 'first-name', 'last-name','positions','educations'], function(err, $in) {
	    // Loads the profile of access token owner.
	    console.log($in.educations.values.length);
	    console.log($in.positions.values.length);
	    var i = 0;
            var educationVar = $in.educations.values;
            var positionVar = $in.positions.values;
	    while(i<positionVar.length)
		{
			console.log(positionVar[i].title)
			i++;
		}

	
	});

        return res.redirect('/');
    });
});


// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
