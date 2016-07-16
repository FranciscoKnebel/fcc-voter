module.exports = function(app, passport) {
	app.get('/login', isLoggedOut, function(req, res) {
		res.render('public/login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', isLoggedOut, passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/auth', function(req, res) {
		res.redirect('/login');
	});

	app.get('/signup', isLoggedOut, function(req, res) {
		res.render('public/signup.ejs', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', isLoggedOut, passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/connect/local', isLoggedIn, function(req, res) {
		res.render('public/connect-local.ejs', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/connect/local', isLoggedIn, passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/');
}

function isLoggedOut(req, res, next) {
	if (req.isUnauthenticated()) {
		return next();
	}
	res.redirect('/');
}
