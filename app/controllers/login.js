var crypto = require('crypto');
var passport = require('passport');
var settings = require('../../config/settings');
var orm     = require('orm');

module.exports = {
	loginPage: function(req, res) {
		res.render('signup', {title: 'YAMANA - Instagram visualizer for the big screen'});
	},

	login: function(req, res, next) {
		
	}
}