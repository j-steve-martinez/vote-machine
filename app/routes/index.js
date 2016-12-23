'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var index = path + '/public/index.html';

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		console.log('starting isAuthenticated');
		console.log(req.session);
		console.log(req.user);
		if (req.isAuthenticated()) {
			console.log('isAuthenticated true');
			var hour = 36000000
			req.session.cookie.expires = new Date(Date.now() + hour)
			req.session.cookie.maxAge = hour
			return next();
		}	else {
			console.log('isAuthenticated false');
			console.log(req.url);
			res.json({id: false});
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			console.log(req.params);
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

	app.route('/poll/:id')
		.get((req, res) => {
			console.log(req.params.id);
			res.sendFile(path + '/public/poll.html');
		})

	// get the poll data
	app.route('/api/poll/:id')
		.get(clickHandler.getPoll)
		.put(clickHandler.takePoll)

	// get all polls
	app.route('/api/allPolls')
		.get(clickHandler.getAllPolls)

	// get user info
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			console.log('/api/:id');
			console.log('twitter');
			console.log(req.user.twitter.id);
			console.log('github');
			console.log(req.user.github.id);
			if (req.user.twitter.id !== undefined) {
				res.json(req.user.twitter)
			} else if (req.user.github.id !== undefined) {
				res.json(req.user.github);
			}
		});

	// get the user polls
  app.route('/api/:id/profile')
		.get(clickHandler.getUserPolls);

	// to add a new user poll
	app.route('/api/:id/new')
		.post(clickHandler.addUserPoll);

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

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

};
