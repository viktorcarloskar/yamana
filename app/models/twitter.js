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