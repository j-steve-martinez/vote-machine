'use strict';
var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
          var hour = 36000000
          req.session.cookie.expires = new Date(Date.now() + hour)
          req.session.cookie.maxAge = hour
            return next();
        } else {
            res.redirect('/login');
        }
    }

    var clickHandler = new ClickHandler();

    app.route('/')
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + '/public/index.html');
        });


    app.route('/add')
        .get(function(req, res) {
            console.log('/add');
            console.log(req.isAuthenticated());
            console.log(req.user.github);
            res.redirect('/add/' + req.user.github.id);
            // res.send('Create and add page already for id ');
        });

    app.route('/add/:id')
        .get(function(req, res) {
            console.log('/add/:id');
            console.log(req.isAuthenticated());
            console.log(req.user.github);
            res.send('Create and add page already for id ' + req.params.id);
        });

    app.route('/login')
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.redirect('/');
            } else {
                res.sendFile(path + '/public/login.html');
            }
        });

    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/login');
        });

    app.route('/profile')
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + '/public/profile.html');
        });

    app.route('/api/:id')
        .get(isLoggedIn, function(req, res) {
            // console.log(req.user.github);
            res.json(req.user.github);
        });

    app.route('/poll/:id')
        .get(isLoggedIn, function(req, res) {
            res.json(req.user.github);
        });

    app.route('/auth/github')
        .get(passport.authenticate('github'));

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.route('/api/:id/clicks')
        .get(isLoggedIn, clickHandler.getClicks)
        .post(isLoggedIn, clickHandler.addClick)
        .delete(isLoggedIn, clickHandler.resetClicks);
};