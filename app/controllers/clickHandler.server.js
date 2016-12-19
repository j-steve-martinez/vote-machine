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
		// mock data request from database
		console.log('clickHandler getAllPolls');
		res.json(polls);
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
		// Polls
		// 	.findOne()
		// 	.exec((err, result) => {
		// 		console.log('getPoll');
		// 	});
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
