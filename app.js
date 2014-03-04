var express   = require('express');
var hbs 	  = require('hbs');
var pg        = require('pg');
var orm 	  = require('orm');
var passport  = require('passport');
var flash     = require('connect-flash');

var app       = express();

var routes    = require('./app/routes.js');
var models    = require('./app/models/');
var settings  = require('./config/settings.js');


app.configure(function() {
	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser('Hellooooooo ')); // read cookies (needed for auth)
	app.use(express.json());
	app.use(express.urlencoded()); // get information from html forms

	// required for passport
	app.use(express.session({ secret: 'boomshackalackakakakakkaa' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

	require('./config/passport')(passport);

	app.use(function (req, res, next) {
      models(function (err, db) {
        if (err) return next(err);

        req.models = db.models;
        req.db     = db;

        return next();
      });
    }),

	hbs.registerHelper('isCurrentUser',function(input){
	  return Session.get("isCurrentUser");
	});

	// HTML render engine
	app.set('view engine', 'html');
	app.engine('html', hbs.__express);

	// Views dir and public dir
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public'));
});

//console.log(answ);

// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport); 

// Run the application
app.listen(settings.port, function() {
  console.log("Listening on " + settings.port);
});