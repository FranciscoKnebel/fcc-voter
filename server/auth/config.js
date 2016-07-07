module.exports = {

	'facebookAuth': {
		'clientID': process.env.FACEBOOK_CLIENT_ID,
		'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
		'callbackURL': process.env.FACEBOOK_CALLBACK
	},

	'twitterAuth': {
		'consumerKey': process.env.TWITTER_CONSUMER_KEY,
		'consumerSecret': process.env.TWITTER_CONSUMER_SECRET,
		'callbackURL': process.env.TWITTER_CALLBACK
	},

	'steamAuth': {
		'apiKey': process.env.STEAM_API_KEY,
		'realmURL': 'http://localhost:8080',
		'callbackURL': 'http://localhost:8080/auth/steam/callback'
	}

};
