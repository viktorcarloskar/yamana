var settings = {
	port       : Number(process.env.PORT || 5000),
	database   : {
			protocol  : "postgresql", // or "mysql"
			query     : { pool: true },
			host      : "database-url",
			database  : "database-name",
			user      : "database-user",
			password  : "database-password",
			port      : "1337",
			ssl       : true
		},
	crypt     : {
		iterations    :  1000,
		keylen        :  128,
		saltsize	  :  128
	},
	instagram : {
		client_id     : 'your-client-id',
		client_secret : 'your-client-secret',
		callback_url  : 'callback_url'
	},
	twitter : {
		consumer_key: 'your_consumer_key',
		consumer_secret: 'your_consumer_secret',
		access_token_key: 'your_access_token',
		access_token_secret: 'your_access_token_secret'
	},
	session       : {
		secret      : 'your_session_secret'
	}
}

module.exports = settings;
