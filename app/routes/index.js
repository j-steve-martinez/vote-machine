'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var index = path + '/public/index.html';



module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		// console.log('starting isAuthenticated');
		// console.log('req.session');
		// console.log(req.session);
		// console.log('req.user');
		// console.log(req.user);
		// console.log('req.rawHeaders');
		// console.log(req.rawHeaders);
		// console.log('req.url');
		// console.log(req.url);
		// console.log('req.path');
		// console.log(req.path);
		if (req.isAuthenticated()) {
			// console.log('isAuthenticated true');
			var hour = 36000000
			req.session.cookie.expires = new Date(Date.now() + hour)
			req.session.cookie.maxAge = hour
			return next();
		}	else {
			// console.log('isAuthenticated false');
			// console.log(req.url);
			res.json({id: false});
		}
	}

	var clickHandler = new ClickHandler();
	clickHandler.addDefault();

	app.route('/')
		.get(function (req, res) {
			// console.log(req.params);
			res.sendFile(index);
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	// get and take a poll
	app.route('/api/poll/:id')
		.get(clickHandler.getPoll)
		.put(clickHandler.takePoll)

	// get all polls
	app.route('/api/allPolls')
		.get(clickHandler.getAllPolls)

	// get user info
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			// console.log('/api/:id');
			// console.log('twitter');
			// console.log(req.user.twitter.id);
			// console.log('github');
			// console.log(req.user.github.id);
			if (req.user.twitter.id !== undefined) {
				res.json(req.user.twitter)
			} else if (req.user.github.id !== undefined) {
				res.json(req.user.github);
			}
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/'
		}));

	// add, get, edit, delete the user poll data
	// must be authenticated
	app.route('/api/:id/:poll')
		.get(isLoggedIn, clickHandler.getPolls)
		.put(isLoggedIn, clickHandler.editPoll)
		.post(isLoggedIn, clickHandler.addPoll)
		.delete(isLoggedIn, clickHandler.delPoll)

};
