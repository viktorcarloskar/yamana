var orm      = require('orm');
var settings = require('../../config/settings.js');

var connection = null;

function setup(db, cb) {
	require('./user')(orm, db);
	//require('./go')(orm, db);

	return cb(null, db);
}

module.exports = function (cb) {
	if (connection) return cb(null, connection);

	orm.connect(settings.database, function (err, db) {
	if (err) return cb(err);

		db.settings.set('instance.returnAllErrors', true);
		setup(db, cb);
	});
};