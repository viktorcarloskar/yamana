// app/routes.js
var controllers = require('./controllers');

module.exports = function(app, passport) {

	// =================================
	// HOMEPAGE
	// =================================
	app.all('/', function(req, res) {
		res.render('home', {title: 'YAMANA - Instagram visualizer for the big screen'});
	})

	// =================================
	// LOGIN PAGE
	// =================================
	app.get('/login', function(req, res) {
		//res.render('home', {title: 'YAMANA - Instagram visualizer for the big screen'});
		res.send('LOGIN');
	})

	// =================================
	// LOGIN POST
	// =================================
	app.post('/login', function(req, res) {
		res.render('home', {title: 'YAMANA - Instagram visualizer for the big screen'});
	})

	// =================================
	// SIGNUP PAGE
	// =================================
	app.get('/signup', controllers.signup.signupPage);

	// =================================
	// SIGNUP POST
	// =================================
	app.post('/signup/user'    , controllers.signup.registerUser);
	app.get('/signup/facebook' , controllers.signup.registerFacebook);
	app.get('/signup/google'   , controllers.signup.registerGoogle);
	app.get('/signup/twitter'  , controllers.signup.registerTwitter);

	// =================================
	// LOGOUT 
	// =================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// =================================
	// ABOUT
	// =================================

	// =================================
	// DASHBOARD
	// =================================
	app.get('/dashboard', isLoggedIn, function(req, res) {
		res.render('dashboard', {})
	});
	// =================================
	// SETTINGS
	// =================================

	// =================================
	// WATCHER PAGE
	// =================================

	// =================================
	// WATCHER POST
	// =================================

	// =================================
	// VIEWER
	// =================================

	// =================================
	// AUTH GOOGLE
	// =================================
	app.get('/auth/google', function(req, res) {

	});
	// =================================
	// AUTH CALLBACK GOOGLE
	// =================================
	app.get('/auth/google/callback', function(req, res) {

	});

	// =================================
	// AUTH FACEBOOK
	// =================================
	app.get('/auth/facebook', function(req, res) {

	});

	// =================================
	// AUTH TWITTER
	// =================================
	app.get('/auth/twitter', function(req, res) {

	});

	app.get('/create', function(req, res) {

		res.send()
	})
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}