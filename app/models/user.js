var crypto = require('crypto');
var orm = require("orm");
var settings = require("../../config/settings.js");


module.exports = function(orm, db) {
	var user = db.define("users", {
        full_name : String,
        email     : String,
        salt      : String,
        password  : String,
        active    : Boolean,
        last_seen : Date 
    }, 
    {
        methods: {
            fullName: function () {
                return this.full_name;
            },
            validPassword: function(password, next) {
                var userPass = this.password.toString('hex');
                var userSalt = this.salt;
                crypto.pbkdf2(password, userSalt, settings.crypt.iterations, settings.crypt.keylen, function(err, key) {
                    if(err) throw err;
                    if (userPass == key.toString('hex')) {
                        next(true);
                    }
                    else {
                        next(false);
                    }
                });
            }
        },
        validations: {
            //age: orm.enforce.ranges.number(18, undefined, "under-age")
        }
    });
}

/*
CREATE TABLE users (id SERIAL PRIMARY KEY, username varchar(30) NOT NULL, email varchar(255) NOT NULL, password varchar(255) NOT NULL, active boolean NULL, created timestamp NOT NULL, last_seen timestamp NULL);
INSERT INTO films (username, email, password, date_prod, kind) VALUES ('T_601', 'Yojimbo', 106, '1961-06-16', 'Drama');
*/