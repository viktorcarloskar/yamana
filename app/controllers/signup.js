var crypto = require('crypto');
var settings = require('../../config/settings');
var orm     = require('orm');

module.exports = {
	signupPage: function(req, res) {
		res.locals.message = req.flash('signupMessage');
		res.render('signup', {title: 'YAMANA - Instagram visualizer for the big screen'});
	},

	// Function for registering new users
	// Responds with http code 200 if succeeded
	// Else redirects to /signup
	registerUser: function(req, res, next) {
		var name = req.body.user.name;
		var email = req.body.user.email;
		var password = req.body.user.password;
		var salt;
		var hash;
		crypto.randomBytes(settings.crypt.saltsize, function(err, buf) {
			if(err) throw err;
			salt = buf.toString('hex');
			//console.log('Have %d bytes of random data: %s', buf.length, buf);
			crypto.pbkdf2(password, salt, settings.crypt.iterations, settings.crypt.keylen, function(err, key) {
				if(err) throw err;
				hash = key.toString('hex');
				nextStep();
			});
		})
		function nextStep() {
			var params = {
				full_name : name,
				email     : email.toLowerCase(),
				salt      : salt,
				password  : hash,
				activated : false
			};
			req.models.users.create(params, function(err, message) {
				if(err) {
					if (Array.isArray(err)) {
						return res.send(200, {errors: err})
					}
					else {
						return next(err);
					}
				}
				return res.send(200, message);
			})
			//Store in db
			//try to store
			//if error from db return error message
			//else redirect to dashboard
		}
		res.redirect('/signup');
	},
	// Not in use
	registerFacebook: function(req, res, next) {

	},
	// Not in use
	registerGoogle: function(req, res, next) {
		res.render('signup', {title: 'YAMANA - Instagram visualizer for the big screen'});
	},
	// Not in use
	registerTwitter: function(req, res, next) {

	}
}