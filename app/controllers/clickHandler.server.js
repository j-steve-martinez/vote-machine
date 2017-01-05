'use strict';
// var QueryString = require('querystring');
var Users = require('../models/users.js');
var Poll = require('../models/polls.js');
// var ListItem = require('../models/listItem.js');

function ClickHandler () {
	this.getAllPolls = function(req, res){
		Poll.find().exec((err, data) => {
			if (err) throw err;
     // console.log('clickHandler getAllPolls');
     // console.log(polls);
			res.json(data);
		});
	}

	this.addDefault = ()=>{
		Poll.find({}, (err, data) => {
			if (err) {
				throw err
			}
			if (data.length === 0) {
				// add default poll
				console.log('add default');
				var poll = new Poll({
					name : "Do You Like This App?",
					uid : 'default',
					list : [
						{key : 'Yes', value : 0},
						{key : 'No', value : 0}]
				});
				poll.save((err, data) => {
					if (err) throw err;
					console.log('save');
					console.log(data);
				})
			}
		});
	}

	// get all user polls
	this.getPolls = function(req, res){
		console.log('getPolls');
		console.log(req.user);
		var id = req.user.id;
		Poll
			.find()
			.exec((err, data) => {
				if (err) { throw err;	}
				// console.log('getUserPolls');
				var polls = data.filter(poll => {
					if (poll.uid.toString() === id) {
						return poll;
					}
				});
				console.log(polls);
				res.json(polls);
			});
	}

	this.addPoll = (req, res) => {
		// console.log(req.params);
		req.on('data', function(body) {
			var data = JSON.parse(body);
			console.log(data);
			var name = data.name;
			var uid = +data.uid;

			Poll.find({name : data.name, uid : data.uid}, (err, poll) => {
				if (err) {
					throw err;
				}

				if (poll.length) {
					// console.log('sending json');
					res.json({isExists : true, isSaved : false});
				} else {
					var newPoll = new Poll(data);
					// console.log('newPoll');
					// console.log(newPoll);
					// Saving it to the database.
					newPoll.save(function (err, data) {
						if (err) {
							// console.log ('Error on save!');
							res.json({isExists : false, isSaved : false});
						}
						// console.log('data saved');
						// console.log(data);
						res.json({isExists : false, isSaved : true, poll : data});
					});
				}
			});
		});
	}

	this.getPoll = (req, res) => {
		// console.log('getPoll');
		// console.log(req.params.id);
		Poll
			.findOne({'_id': req.params.id})
			.exec((err, poll) => {
				// console.log(req.url);
				// console.log('Poll Data');
				// console.log(poll);
				res.json(poll)
			});
	}

	this.takePoll = (req, res) => {
		// console.log('editPoll');
		// console.log(req.params.id);
		req.on('data', function(body) {
			// console.log("Received body data:");
			// console.log(chunk.toString());
			var data = JSON.parse(body);
			// console.log('data list');
			// console.log(data);
			var id = data.id;
			var name = data.name;
			var key = data.key;
			// console.log(id);
			// console.log(name);
			// console.log(key);
			Poll
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
					// console.log('edited poll');
					// console.log(poll);
					res.json(poll);
				});
		});
	}

	this.editPoll = (req, res) => {
		// console.log('editPoll');
		// console.log(req.params.poll);
		// console.log(req.data);
		req.on('data', body => {
			// console.log('data');
			// console.log(JSON.parse(body));
			var data = JSON.parse(body);
			var id = req.params.poll;
			var name = data.name;
			var key = data.key;
			var value = data.value;
			// console.log(id);
			// console.log(name);
			// console.log(key);
			// console.log(value);
			// var item = new ListItem();
			Poll
				.update({
					'_id': id,
					'name' : name
				},
					{ $push : { list: { key: key, value : value}}}
				)
				.exec((err, poll) => {
					// console.log('edited poll');
					// console.log(poll);
					res.json(poll);
				});
		});
	}

	this.delPoll = (req, res) => {
		// console.log('del getPoll');
		// console.log(req.params.id);
		Poll
		  .findByIdAndRemove(req.params.poll)
			.exec((err, poll) => {
				// console.log(req.url);
				// console.log('del Poll Data');
				// console.log(poll);
				res.json(poll)
			});
	}

}

module.exports = ClickHandler;
