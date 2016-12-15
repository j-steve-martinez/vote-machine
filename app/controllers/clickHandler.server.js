'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function ClickHandler () {
	this.getAllPolls = function(req, res){
		// mock data request from database
		console.log('clickHandler getAllPolls');
		var polls = [
			{id: 1, name:'Best This'},
			{id: 2, name:'Is That Good'},
			{id: 3, name:'Is it Bad'},
			{id: 4, name:'Are you That Good'},
			{id: 5, name:'Is That Really Good'}
		];
		res.json(polls);
	}

	this.getUserPolls = function(req, res){

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
