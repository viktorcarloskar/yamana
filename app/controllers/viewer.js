var instagram = require('instagram-node-lib');

instagram.set('client_id', 'efd32b9729b747578ae2c934b9b69a5b');
instagram.set('client_secret', '62d8bf1ba7f14e24891eb1a89cff25eb');

module.exports = {
	userViewers: function(req, res, next) {
		console.log(getRecent('idaginatt'));
		res.send('hello');
	},
	startSubscription: function(req, res, next) {

	}
}
function getRecent(tag) {
	var images = instagram.tags.recent({name: tag});
	return images;
}