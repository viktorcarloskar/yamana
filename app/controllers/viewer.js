var ig 		   = require('instagram-node-lib');
var settings  = require('../../config/settings')
var models    = require('../models/');
var Hashids   = require('hashids'),
	hashids     = new Hashids('mmmbophashhansonmmmbopanderzfavoriter', 10);


ig.set('client_id', settings.instagram.client_id);
ig.set('client_secret', settings.instagram.client_secret);
//ig.set('callback_url', settings.instagram.callback_url);
ig.set('maxSockets', 10);

var clients = [];

module.exports = {
	userViewers: function(req, res, next) {
		console.log();
		req.models.viewers.find({user_id: req.user.id}, function(err, viewers) {
			if (err)
				throw err;
			hashIds(viewers, function(result) {
				res.render('dashboard', {title: 'YAMANA - Dashboard', viewers: result});
				console.log(result);
			})
			// addImages(viewers, function(err, data) {
			// 	console.log(data);
			// 	res.render('dashboard', {title: 'YAMANA - Dashboard', viewers: data.viewers});
			// });

		})
	},
	startSubscription: function(req, res, next) {

	},
	getViewer: function(req, res, next) {
		var viewerId = hashids.decrypt(req.param('id'));

		req.models.viewers.get(viewerId, function(err, result) {
			if (err)
				res.send(err);
			if (result.user_id != req.user.id)
				res.send('You do not have access to this viewer');
			res.render('viewer', {layout: false});
		})
	},
	newConn: function(socket) {
		return true;
	},
	init: function(socket, data) {
		//Send recent images
		var viewerId;
		if (data.var) {
				viewerId = hashids.decrypt(data.var);
				models(function (err, db) {
						if (err) return next(err);

						db.models.viewers.get(viewerId, function(err, viewer) {
								getRecent(viewer.hashtag, null, function(images, pagination) {
									socket.emit('instagram', images);

									// Save socket for sending updates
									clients.push({socket: socket, min_id: pagination.min_tag_id, hashtag: viewer.hashtag});

									// Start subscription of images
									ig.tags.subscribe({ object_id: viewer.hashtag, callback_url: (settings.instagram.callback_url + '/')});
								})
						});
				});
		}
	},

	// Function that responds to instagrams handshake method for verification
	igHandshake: function(req, res) {
		ig.subscriptions.handshake(req, res);
	},

	// Function that handles the data from instagram
	igPost: function(req, res) {
		//The raw data from instagram
		var data = req.body;

		console.log(data);
		console.log('Nr of clients: %s', clients.length);

		data.forEach(function(tag) {
			// Async fix variables
			var tasksToGo = clients.length;
			var sentData = false;
			var images = null;
			var hashtag = tag.object_id;

			// Loops all connected clients to know wich one to send to
			if (tasksToGo === 0)
				clients.forEach(function(client) {
					console.log('Client: %s, %s', client.socket.id, client.hashtag);
					// Yeah, a bit ineffective BUT only IF two clients is subscribing to
					// the same hashtag
					if (client.hashtag == hashtag) {
						console.log('Min_id: %s', client.min_id);
						getRecent(tag.object_id, client.min_id, function(data, pagination) {
							if (data.length > 0) {
								images = data;
								client.socket.emit('instagram', images);
								// Find socket and set min id to get next time
								setMinId(client, pagination);
							}
							sentData = true;
						})
					}
					if (--tasksToGo === 0 && !sentData) {
						ig.subscriptions.unsubscribe({id: tag.id});
						console.log('Subscription not attached to socket');
					}
			})
		});
	},

	// If connection to client is terminated
	closedConn: function(socket) {
		// This is terribly wrong
		clients.forEach(function(client) {
			if (client.socket.id = socket.id) {
				ig.subscriptions.unsubscribe({id: socket.id});
			}
		})
	}
}

function getRecent(tagName, min_id, next) {
	if (min_id) {
			ig.tags.recent({name: tagName, min_tag_id: min_id, complete: function(data, pagination) {
				next(data, pagination);
			}});
	}
	else {
			ig.tags.recent({name: tagName, complete: function(data, pagination) {
				next(data, pagination);
			}});
	}
}
function setMinId(client, data){
		client.min_id = data.min_tag_id;
}
function setHashtag(client, hashtag){
		client.hashtag = hashtag;
}
function addImages(viewers, callback) {
	var jsonViewers = {viewers: []};
	var j = 0;
	for (var i = 0; i < viewers.length; i++) {
		getRecent(viewers[i].hashtag, 3, function(images) {
			jsonViewers.viewers.push({
				hashtag: viewers[j].hashtag,
				created: viewers[j].created,
				last_used: viewers[j].last_opened,
				images: images
			})
			nextStep(i + 1);
			j++;
		});
	};
	function nextStep(i) {
		if (i >= viewers.length)
			callback(null, jsonViewers);
	}
}
function hashIds(viewers, callback) {
	var res = []
	var tasksToGo = viewers.length;
	if (tasksToGo === 0)
		callback(viewers);
	else {
		viewers.forEach(function(viewer) {
			res.push({
				id : hashids.encrypt(viewer.id),
				hashtag : viewer.hashtag,
				created : viewer.created,
				last_opened : viewer.last_opened
			})
			if (--tasksToGo === 0)
				callback(res);
		})
	}
}
