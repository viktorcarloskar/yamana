var orm = require("orm");
var settings = require("../../config/settings.js");

module.exports = function(orm, db) {
	var user = db.define("Twitter", {
        id          : String,
        token       : String,
        displayName : String,
        username    : String,
        user_id     : int
    }, 
    {
        methods: {
            
        },
        validations: {
            //age: orm.enforce.ranges.number(18, undefined, "under-age")
        }
    });
}

/*
CREATE TABLE twitter (id SERIAL PRIMARY KEY, token varchar(255) NOT NULL, displayname varchar(255) NOT NULL, username varchar(30) NOT NULL, user_id integer references users(id));
*/