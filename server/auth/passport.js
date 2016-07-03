
var twitterStrategy = require("passport-twitter").Strategy;

var User = require('../models/user');

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
