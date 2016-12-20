'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');
// mock data
var polls = [
	{id: 1, uid: 1, name:'Best This'},
	{id: 2, uid: 2, name:'Is That Good'},
	{id: 3, uid: 1, name:'Is it Bad'},
	{id: 4, uid: 2, name:'Are you That Good'},
	{id: 5, uid: 1, name:'Is That Really Good'}
];

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
		console.log(req.auth);
		var userPolls = polls.map(poll => {
			console.log('clickHandler getUserPolls');
			if (poll.uid === 1) {
				return poll;
			}
		});
		res.json(userPolls)
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
			console.log(data.list);
			var myList = data.list;
			Polls
				.findOneAndUpdate({'_id': req.params.id}, { $set : { list: myList }})
				.exec((err, poll) => {
					console.log('edited poll');
					console.log(poll);
					res.json(poll);
				});
		});
	}

	this.addPoll = (req, res) => {
		console.log(req.params);
		// Polls
		// 	.findOne({} (err, poll) => {
		//
		// 	})
	}
	// this.editPoll = (req, res) => {}
	// this.deletePoll = (req, res) => {}

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
