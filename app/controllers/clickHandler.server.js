'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function ClickHandler () {
	this.getAllPolls = function(req, res){
		Polls
		.find()
		.exec(function (err, polls) {
			if (err) { throw err; }
			console.log('clickHandler getAllPolls');
			console.log(polls);
			res.json(polls);
		});
	}

	this.getUserPolls = function(req, res){
		console.log(req.params.id);
		Polls
			.find()
			.exec((err, data) => {
				if (err) { throw err;	}
				console.log('getUserPolls');
				var polls = data.filter(poll => {
					if (poll.uid === +req.params.id) {
						return poll;
					}
				});
				res.json(polls);
			});
	}

	this.getPoll = (req, res) => {
		console.log('getPoll');
		console.log(req.params.id);
		Polls
			.findOne({'_id': req.params.id})
			.exec((err, poll) => {
				console.log('Poll Data');
				console.log(poll);
				res.json(poll)
			});
	}

	this.editPoll = (req, res) => {
		console.log('editPoll');
		console.log(req.params.id);
		req.on('data', function(chunk) {
			console.log("Received body data:");
			console.log(chunk.toString());
			var data = JSON.parse(chunk.toString());
			console.log('data list');
			console.log(data);
			var id = data.id;
			var name = data.name;
			var key = data.key;
			console.log(id);
			console.log(name);
			console.log(key);
			Polls
				.findOneAndUpdate({
					'_id': data.id,
					'name' : data.name,
					'list.key' : data.key
				},
					{ $inc : { 'list.$.value': 1 }},
					// get the update poll
					{ new: true }
				)
				.exec((err, poll) => {
					console.log('edited poll');
					console.log(poll);
					res.json(poll);
				});
		});
	}

	this.addPoll = (req, res) => {
		console.log(req.params);
		req.on('data', function(chunk) {
			var data = JSON.parse(chunk.toString());
			console.log('addPoll got chunk');
			console.log(data);
		});
		// Polls
		// 	.findOne({} (err, poll) => {
		//
		// 	})
	}

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = ClickHandler;
