'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		console.log('starting isAuthenticated');
		if (req.isAuthenticated()) {
			console.log('isAuthenticated true');
			var hour = 36000000
			req.session.cookie.expires = new Date(Date.now() + hour)
			req.session.cookie.maxAge = hour
			return next();
		}	else {
			console.log('isAuthenticated false');
			res.json({id: false});
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

	app.route('/api/poll/:id')
		.get(function (req, res) {
			var poll = {id: 1, name:'Best This'};
			res.json(poll);
		});

	app.route('/api/allPolls')
		// .get(isLoggedIn, clickHandler.getAllPolls)
		.get(function (req, res) {
			// mock data request from database
			var allPolls = [
				{id: 1, name:'Best This'},
				{id: 2, name:'Is That Good'}
			];
			res.json(allPolls);
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/api/:id/:poll')
		.get(isLoggedIn, function (req, res) {
			console.log(req.user.github);
			var id = req.params.id;
			var poll = req.params.poll;
			res.json({id:id, poll:poll});
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
