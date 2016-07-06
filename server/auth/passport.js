var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var twitterStrategy = require("passport-twitter").Strategy;

var User = require('../models/user');
var configAuth = require('./config');

module.exports = function(passport) {
	passport
		.serializeUser(function(user, done) {
			done(null, user.id);
		});

	passport.deserializeUser(function(id, done) {
		User
			.findById(id, function(err, user) {
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
		process
			.nextTick(function() {

				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
				User
					.findOne({
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
		User
			.findOne({
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
		process
			.nextTick(function() {
				User
					.findOne({
						'facebook.id': profile.id
					}, function(err, user) {

						if (err)
							return done(err);

						// if the user is found, then log them in
						if (user) {
							return done(null, user); // user found, return that user
						} else {
							var newUser = new User();

							// set all of the facebook information in our user model
							console.log(profile);
							newUser.facebook.id = profile.id; // set the users facebook id
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

};

/*    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());


    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  In a
    // production-quality application, this would typically be as simple as
    // supplying the user ID when serializing, and querying the user record by ID
    // from the database when deserializing.  However, due to the fact that this
    // example does not have a database, the complete Twitter profile is serialized
    // and deserialized.
    passport.serializeUser(function(user, cb) {
      cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
      cb(null, obj);
    });

    passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://127.0.0.1/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
      console.log(profile);
      return cb(null, profile);
    }));
    /*User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
    app.get('/auth', function(req, res) {
      res.render('index.html'); //Show login screen
    });

    app.get("/auth/twitter", passport.authenticate('twitter'));

    app.get("/auth/twitter/callback", passport.authenticate('twitter', { failureRedirect: '/auth' }),
      function(req, res) {
        res.redirect('/');
    });
*/
