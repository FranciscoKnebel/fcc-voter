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
		passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	}, function(req, email, password, done) {

		// asynchronous
		process.nextTick(function() {

			//  Whether we're signing up or connecting an account, we'll need
			//  to know if the email address is in use.
			User.findOne({
				'local.email': email
			}, function(err, existingUser) {

				// if there are any errors, return the error
				if (err)
					return done(err);

				// check to see if there's already a user with that email
				if (existingUser)
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

				//  If we're logged in, we're connecting a new local account.
				if (req.user) {
					var user = req.user;
					user.local.email = email;
					user.local.password = user.generateHash(password);
					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					} //  We're not logged in, so we're creating a brand new user.
					);
				} else {
					// create the user
					var newUser = new User();

					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

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
		clientID: configAuth.facebookAuth.clientID, clientSecret: configAuth.facebookAuth.clientSecret, callbackURL: configAuth.facebookAuth.callbackURL, passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		profileFields: ["emails", "displayName", "name"]
	}, function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			if (!req.user) {

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
			} else {
				// user already exists and is logged in, we have to link accounts
				var user = req.user; // pull the user out of the session

				// update the current users facebook credentials
				user.facebook.id = profile.id;
				user.facebook.token = token;
				user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
				user.facebook.email = profile.emails[0].value;

				// save the user
				user.save(function(err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		});
	}));

	//TWITTER
	passport.use(new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL,
		passReqToCallback: true
	}, function(req, token, tokenSecret, profile, done) {
		process.nextTick(function() {

			if (!req.user) {

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
			} else {
				var user = req.user;

				user.twitter.id = profile.id;
				user.twitter.token = token;
				user.twitter.username = profile.username;
				user.twitter.displayName = profile.displayName;

				// save the user
				user.save(function(err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		});

	}));

	//STEAM
	passport.use(new SteamStrategy({
		returnURL: configAuth.steamAuth.callbackURL,
		realm: configAuth.steamAuth.realmURL,
		apiKey: configAuth.steamAuth.apiKey
	}, function(identifier, profile, done) {
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
	}));

};
