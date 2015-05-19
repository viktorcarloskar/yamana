var ig 		   = require('instagram-node-lib');
var settings  = require('../../config/settings')
var models    = require('../models/');
var Hashids   = require('hashids'),
	hashids     = new Hashids('mmmbophashhansonmmmbopanderzfavoriter', 10);
var moment    = require('moment');


ig.set('client_id', settings.instagram.client_id);
ig.set('client_secret', settings.instagram.client_secret);
//ig.set('callback_url', settings.instagram.callback_url);
ig.set('maxSockets', 10);

var clients = [];

module.exports = {

	
	// dashboard.html load function.
	// Loads all the viewers for the logged in user
	userViewers: function(req, res, next) {
		req.models.viewers.find({user_id: req.user.id}, function(err, viewers) {
			if (err)
				throw err;
			hashIds(viewers, function(result) {
				res.render('dashboard', {title: 'YAMANA - Dashboard', viewers: result});
			})
			// addImages(viewers, function(err, data) {
			// 	console.log(data);
			// 	res.render('dashboard', {title: 'YAMANA - Dashboard', viewers: data.viewers});
			// });

		})
	},

	addViewer: function(req, res, next) {
		//req.models.viewers.add()
	},
	startSubscription: function(req, res, next) {

	},
	
	// viewer.html init function
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
	newViewer: function(req, res, next) {
		var viewer = req.body.viewer;
		createViewer(req, res, viewer, function(err, result) {
			res.render('dashboard');
		})
	},

	
	// On new websocket connection
	newConn: function(socket) {
		return true;
	},

	// On websocket 'fetch' call
	// Saves the socket connection, sends the latest instagram images and starts a subscription at instagram
	init: function(socket, data) {
		
		// Handle if viewer has had images pushed before
		var lastId;
		if (data.min_id) 
			lastId = min_id;
		else
			lastId = null;

		//Send recent images
		var viewerId;
		if (data.var) {
				viewerId = hashids.decrypt(data.var);
				models(function (err, db) {
						if (err) return next(err);

						db.models.viewers.get(viewerId, function(err, viewer) {
								getRecent(viewer.hashtag, lastId, function(images, pagination) {
									socket.emit('instagram', {images: images, min_id: lastId});

									// Save socket for sending updates
									clients.push({socket: socket, min_id: pagination.min_tag_id, hashtag: viewer.hashtag});

									console.log("Added client: " + socket.id)
									// Start subscription of images
									var response = ig.tags.subscribe({ object_id: viewer.hashtag, callback_url: (settings.instagram.callback_url + '/' + socket.id)});
									console.log("Ig sub response: " + response)
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
		var socketId = req.params.id
		console.log(data);

		if (data) {
			data.forEach(function(obj) {

				var client;
				
				client = clients.filter(function(i) {
					if (i.socket.id == socketId)
						return i;
				})
				console.log("clients found with id %s : %s", socketId, client.length)
				client = client[0]

				if (client) {
					getRecent(obj.object_id, client.min_id, function(data, pagination) {
						console.log('Data is %s long', data.length);
						if (data.length > 0) {
							images = data;
							client.socket.emit('instagram', {images: images, min_id: client.min_id});
							setMinId(client, pagination);
						}
					})	
				}
				else {
					ig.subscriptions.unsubscribe({id: obj.subscription_id});
					console.log('Unsubscribed subscription: ' + obj.id);
				}
				
				/*
				console.log(tag);
				// Async fix variables
				var tasksToGo = clients.length;
				var sentData = false;
				var images = null;
				var hashtag = tag.object_id;

				console.log("Tasks to go:" + tasksToGo);

				// Loops all connected clients to know wich one to send to
				clients.forEach(function(client) {
					console.log('Client: %s, %s', client.socket.id, client.hashtag);
					// Yeah, a bit ineffective BUT only IF two clients is subscribing to
					// the same hashtag
					console.log('Is this the same? %s == %s', client.hashtag, hashtag);
					if (client.hashtag.toLowerCase() == hashtag.toLowerCase()) {
						console.log('Min_id: %s', client.min_id);
						getRecent(tag.object_id, client.min_id, function(data, pagination) {
							console.log('Data is %s long', data.length);
							if (data.length > 0) {
								images = data;
								client.socket.emit('instagram', {images: images, min_id: client.min_id});
								console.log('Sent data to client:');
								console.log(images);
								// Find socket and set min id to get next time
								setMinId(client, pagination);
							}
							sentData = true;
						})
					}
					if (--tasksToGo === 0 && !sentData) {
						ig.subscriptions.unsubscribe({id: client.socket.id});
						console.log('Subscription not attached to socket');
					}
				})
				*/
			});
		}
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

// Function for fetching instagram images
// Returns nothing, uses callback with instagram data and pagination.
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
// Function for setting the minId in the client object
function setMinId(client, data){
		client.min_id = data.min_tag_id;
}
// Function for setting the hashtag value in the client object
function setHashtag(client, hashtag){
		client.hashtag = hashtag;
}
// 
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
// Function that hashes all the ids of the viewers and sets the datetimes to more readable units
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
				created : moment(viewer.created).fromNow(),
				last_opened : viewer.last_opened
			})
			if (--tasksToGo === 0)
				callback(res);
		})
	}
}

// Function for adding a new viewer
function createViewer(req, res, viewer, callback) {
	var insert = {}; 
	
	// Validations
	// Validating that hashtag var doesn't contain a #
	if (viewer.hashtag.indexOf('#') === -1) {
		viewer.hashtag = viewer.hashtag.substring(1, viewer.hashtag.length)
	};
	// Validating user
	models(function (err, db) {
		db.models.users.get({id: req.user.id}, function(err, user) {
			if(err) {
				throw err;
			}
			insert.hashtag = viewer.hashtag;
			insert.user_id = user.id;
			db.models.viewers.create(insert, function(err, results) {
				if (err) 
					throw err;
				console.log(results);
				callback(err, result);
			})
		})
	})

}
