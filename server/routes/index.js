var polls = require('./polls');

var localAuth = require('./auth/local');
var facebookAuth = require('./auth/facebook');
var twitterAuth = require('./auth/twitter');

module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('public/index.ejs');
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('authenticated/profile.ejs', {user: req.user}); // get the user out of session and pass to template
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	localAuth(app, passport);
	facebookAuth(app, passport);
	twitterAuth(app, passport);

	polls(app);

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/');
	}

function getUserIP(req) {
	var ip;

	if (req.headers['x-forwarded-for'])
		ip = req.headers['x-forwarded-for'].split(",")[0];
	else if (req.connection && req.connection.remoteAddress)
		ip = req.connection.remoteAddress;
	else
		ip = req.ip;

	return ip;
}
