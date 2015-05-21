var crypto = require('crypto');
var orm = require("orm");
var settings = require("../../config/settings.js");


module.exports = function(orm, db) {
	var viewer = db.define("viewers", {
        hashtag       : String,
        created       : Date,
        last_opened   : Date,
        token         : String,
        user_id       : String,
        show_twitter  : Boolean,
        show_instagram: Boolean
    }, 
    {
        methods: {
            user: function () {
                db.models.users.get(this.user_id, function(err, user) {
                    if (err) 
                        throw err;
                    else
                        return user;
                })
            }
        },
        validations: {
            //age: orm.enforce.ranges.number(18, undefined, "under-age")
        }
    });
}

/*
CREATE TABLE viewers (id SERIAL PRIMARY KEY, hashtag varchar(255) NOT NULL, created timestamp NOT NULL default CURRENT_TIMESTAMP, last_opnened timestamp, token varchar(255), user_id integer NOT NULL, CONSTRAINT viewer_user_id_fkey FOREIGN KEY user_id REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE);
INSERT INTO films (username, email, password, date_prod, kind) VALUES ('T_601', 'Yojimbo', 106, '1961-06-16', 'Drama');
*/