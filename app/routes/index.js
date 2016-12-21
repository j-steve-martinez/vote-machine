'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

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
			res.json({pollId: false});
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
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

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	// get the poll data
	app.route('/api/poll/:id')
		.get(clickHandler.getPoll)
		.put(clickHandler.editPoll)

	// get all polls
	app.route('/api/allPolls')
		.get(clickHandler.getAllPolls)

	// get user info
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	// get the user polls
  app.route('/api/:id/profile')
		.get(clickHandler.getUserPolls);

	// to add a new user poll
	app.route('/api/:id/new')
		.post(function (req, res) {
			console.log('new poll ok');
			console.log(req.params);
			console.log(req.session);
			// console.log(req);
			req.on('data', function(chunk) {
				console.log("Received body data:");
				console.log(chunk.toString());
				res.json({pollId: 1})
			});
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

};
