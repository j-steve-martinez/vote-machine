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
		.get(function (req, res) {
			var poll = {id: 1, name:'Best Mock Data'};
			var mockData = {
				uid: 1,
				title: 'Best Thing',
				list : [
					{key: 'item1', value: 2},
					{key: 'item2', value: 5},
					{key: 'item3', value: 9}
				]};
			res.json(mockData);
		});

	// get all polls
	app.route('/api/allPolls')
		.get(clickHandler.getAllPolls)

	// get user info
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	// get the user polls
  app.route('/api/profile/:id')
		.get(clickHandler.getUserPolls);

	// to add a new poll
	// user :id and :poll object
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
			// console.log(req.user.github);
			// console.log(req.post);
		});

	app.route('/api/profile/new')
		.get(isLoggedIn, function(req, res){
			console.log(req.params);
		})

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
