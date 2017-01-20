'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var index = path + '/public/index.html';

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		// console.log('starting isAuthenticated');
		// console.log('req.session');
		// console.log(req.session);
		if (req.isAuthenticated()) {
			// console.log('isAuthenticated true');
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
			res.json(req.user)
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
		.patch(isLoggedIn, clickHandler.takeAuthPoll)
		.delete(isLoggedIn, clickHandler.delPoll)
};
