// app/routes.js
var controllers = require('./controllers');

module.exports = function(app, passport) {

	// =================================
	// HOMEPAGE
	// =================================
	app.all('/', isLoggedIn, function(req, res) {
		renderHome(res, '');
	})

	// =================================
	// LOGIN PAGE
	// =================================
	app.get('/login', function(req, res) {
		res.locals.message = req.flash('loginMessage')
		res.render('login', {title: 'YAMANA - Instagram visualizer for the big screen'});
	})

	// =================================
	// LOGIN POST
	// =================================
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

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
		res.render('dashboard', {title: 'YAMANA - Dashboard'});
	});
	// =================================
	// SETTINGS
	// =================================

	// =================================
	// VIEWER PAGE
	// =================================
	app.get('/viewer', controllers.viewer.userViewers);

	// =================================
	// WATCHER POST
	// =================================

	// =================================
	// VIEWER
	// =================================

	// =================================
	// AUTH INSTAGRAM
	// =================================
	app.get('/auth/instagram', function(req, res) {
		res.send('Suceess');
	});
	// =================================
	// CALLBACK INSTAGRAM
	// =================================
	app.get('/callback/instagram', function(req, res) {
		res.send('Suceess');
	});
	// =================================
	// CALLBACK INSTAGRAM
	// =================================
	app.post('/callback/instagram', function(req, res) {
		if(req.param("hub.challenge") != null)
    		res.send(request.param("hub.challenge"));
    	else 
    		console.log("ERROR on suscription request");
	});

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

	app.get('/create', isLoggedIn, function(req, res) {

		res.send()
	})
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		res.locals = {
			loggedIn: true,
			name: req.user.full_name
		}
		return next();
	}
	else {
		// if they aren't redirect them to the home page
		res.locals = {
				loggedIn: false
			}
		if(req.route.path != '/')
			res.redirect('/');
		else
			renderHome(res, '');
	}	
}
function renderHome(res, msg) {
	res.render('home', {title: 'YAMANA - Instagram visualizer for the big screen'});
}