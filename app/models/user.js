var orm = require("orm");
var settings = require("../../config/settings.js");


module.exports = function(orm, db) {
	var user = db.define("User", {
        id        : String,
        full_name : String,
        email     : String,
        password  : String,
        activated : Boolean,
        created	  : Date,
        last_seen : Date 
    }, 
    {
        methods: {
            fullName: function () {
                return this.full_name;
            }
        },
        validations: {
            age: orm.enforce.ranges.number(18, undefined, "under-age")
        }
    });
}

/*
CREATE TABLE users (id SERIAL PRIMARY KEY, username varchar(30) NOT NULL, email varchar(255) NOT NULL, password varchar(255) NOT NULL, active boolean NULL, created timestamp NOT NULL, last_seen timestamp NULL);
INSERT INTO films (username, email, password, date_prod, kind) VALUES ('T_601', 'Yojimbo', 106, '1961-06-16', 'Drama');
*/