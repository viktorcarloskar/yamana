var ig 		   = require('instagram-node-lib');
var settings  = require('../../config/settings')
var models    = require('../models/');
var Hashids   = require('hashids'),
	hashids     = new Hashids('mmmbophashhansonmmmbopanderzfavoriter', 10);


ig.set('client_id', settings.instagram.client_id);
ig.set('client_secret', settings.instagram.client_secret);
ig.set('callback_url', settings.instagram.callback_url);
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
		clients.push(socket);
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
								getRecent(viewer.hashtag, 10, function(data) {
									socket.emit('instagram', data);
								});
								//Starts instagram subscription
								ig.tags.subscribe({ object_id: viewer.hashtag, id: socket.id});
						});
				});
		}

		console.log('Data from fetch');
		console.log(data);
		console.log(clients.length)
	},
	igHandshake: function(req, res) {
		ig.subscriptions.handshake(req, res);
	},
	igPost: function(req, res) {
		console.log(req);
	},
	closedConn: function(socket) {
		var index = clients.indexOf(socket);
		if (index > -1) {
			clients.splice(index, 1);
		}
	}
}
function getRecent(tag, num, callback) {
	ig.tags.recent({name: tag, complete: function(result, limit){
		callback(result);
	}});
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
