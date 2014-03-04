var orm      = require('orm');
var settings = require('../../config/settings.js');

var connection = null;

function setup(db, cb) {
	require('./user')(orm, db);
	require('./viewer')(orm, db);
	//require('./go')(orm, db);

	return cb(null, db);
}

module.exports = function (cb) {
	if (connection) return cb(null, connection);
	var dbconn = process.env.DATABASE_URL || settings.database;
	orm.connect(dbconn, function (err, db) {
		if (err) return cb(err);
		connection = db;
		db.settings.set('instance.returnAllErrors', true);
		setup(db, cb);
	});
};