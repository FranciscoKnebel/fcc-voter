var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var SteamStrategy = require("passport-steam").Strategy;

var User = require('../models/user');
var configAuth = require('./config');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	//LOCAL SIGNUP
	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	}, function(req, email, password, done) {
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({
				'local.email': email
			}, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err);

				// check to see if theres already a user with that email
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser = new User();
					profile
					// set the user's local credentials
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}

			});

		});

	}));

	//LOCAL LOGIN
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {
		User.findOne({
			'local.email': email
		}, function(err, user) {
			if (err)
				return done(err);

			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));

			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', "Oops! Wrong password"));

			return done(null, user);
		});
	}));

	//Facebook
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ["emails", "displayName", "name"]
	}, function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({
				'facebook.id': profile.id
			}, function(err, user) {

				if (err)
					return done(err);

				// if the user is found, then log them in
				if (user) {
					return done(null, user); // user found, return that user
				} else {
					var newUser = new User();

					newUser.facebook.id = profile.id;
					newUser.facebook.token = token; // we will save the token that facebook provides to the user
					newUser.facebook.name = profile.displayName;
					newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

					newUser.save(function(err) {
						if (err)
							throw err;

						return done(null, newUser);
					});
				}
			});
		});
	}));


	//TWITTER
	passport.use(new TwitterStrategy({
			consumerKey: configAuth.twitterAuth.consumerKey,
			consumerSecret: configAuth.twitterAuth.consumerSecret,
			callbackURL: configAuth.twitterAuth.callbackURL
		},
		function(token, tokenSecret, profile, done) {
			process.nextTick(function() {

				User.findOne({
					'twitter.id': profile.id
				}, function(err, user) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err);

					// if the user is found then log them in
					if (user) {
						return done(null, user); // user found, return that user
					} else {
						// if there is no user, create them
						var newUser = new User();

						// set all of the user data that we need
						newUser.twitter.id = profile.id;
						newUser.twitter.token = token;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;

						// save our user into the database
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});

			});

		}));

	//STEAM
	passport.use(new SteamStrategy({
			returnURL: configAuth.steamAuth.callbackURL,
			realm: configAuth.steamAuth.realmURL,
			apiKey: configAuth.steamAuth.apiKey
		},
		function(identifier, profile, done) {
			process.nextTick(function() {

				User.findOne({
					'steam.id': identifier
				}, function(err, user) {

					if (err)
						return done(err);

					if (user) {
						return done(null, user);
					} else {
						var newUser = new User();

						newUser.id = identifier; //do something with profile

						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						})
					}
				});
			});
		}
	));

};
