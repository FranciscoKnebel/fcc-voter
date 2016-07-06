module.exports = {

	'facebookAuth': {
		'clientID': process.env.FACEBOOK_CLIENT_ID,
		'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
		'callbackURL': 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth': {
		'consumerKey': process.env.TWITTER_CONSUMER_KEY,
		'consumerSecret': process.env.TWITTER_CONSUMER_SECRET,
		'callbackURL': 'http://127.0.0.1/auth/twitter/callback'
	},

	'googleAuth': {
		'clientID': 'your-secret-clientID-here',
		'clientSecret': 'your-client-secret-here',
		'callbackURL': 'http://localhost:8080/auth/google/callback'
	}

};
