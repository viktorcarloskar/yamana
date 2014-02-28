module.exports = {
	signupPage: function(req, res) {
		res.render('signup', {title: 'YAMANA - Instagram visualizer for the big screen'});
	},

	registerUser: function(req, res, next) {
		
	},
	registerFacebook: function(req, res, next) {

	},
	registerGoogle: function(req, res, next) {
		res.render('signup', {title: 'YAMANA - Instagram visualizer for the big screen'});
	},
	registerTwitter: function(req, res, next) {

	}
}