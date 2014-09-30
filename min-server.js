var express  = require('express');
var engines = require('consolidate');
var app      = express();
var port     = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', engines.ejs);
app.set('view engine', 'html');
var HTTPStatus = require('http-status');

var passport = require('passport');
var flash 	 = require('connect-flash');
var helmet = require('helmet');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
require('./dataaccess/dataconfig/passport')(passport); // pass passport for configuration

// Later we will fix security issues
//https://blog.liftsecurity.io/2012/12/07/writing-secure-express-js-apps
//https://github.com/evilpacket/helmet
// currently using defauts
//app.use(helmet());
//app.use(helmet({ xframe: false, hsts: false }));
//app.use(helmet.xframe('sameorigin'));


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use( bodyParser.urlencoded() );       // to support JSON-encoded bodies

// required for passport
app.use(session({ secret: 'thisissignofme' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./server-routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);


console.log('The magic happens on port ' + port);
