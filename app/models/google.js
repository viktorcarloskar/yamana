var orm = require("orm");
var settings = require("../../config/settings.js");

module.exports = function(orm, db) {
	var user = db.define("Google", {
        id        : String,
        token     : String,
        email     : String,
        name      : String,
        user_id   : int
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
CREATE TABLE google (id SERIAL PRIMARY KEY, token varchar(255) NOT NULL, email varchar(255) NOT NULL, name varchar(30) NOT NULL, user_id integer references users(id));
*/