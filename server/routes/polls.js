var Poll = require('../models/poll');

module.exports = function(app) {

	app.get('/poll/new', isLoggedIn, function(req, res) {
		var newPoll = new Poll();

		var options = [];
		options.push({text: "Option 1", votes: 0});
		options.push({text: "Option 2", votes: 1});

		newPoll.title = "Poll Title";
		newPoll.created = new Date();
		newPoll.owner = req.user;
		newPoll.options = options;
		newPoll.totalVotes = 0 + 1;

		newPoll.save(function(err) {
			if (err)
				throw err;
			}
		);

		newPoll.voteFor(options[0]);

		newPoll.save(function(err) {
			if (err)
				throw err;
			res.contentType('application/json');
			res.send(newPoll);
		});

	});

	app.get('/poll/:pollID', isLoggedIn, function(req, res) {
		res.send(req.params.pollID);
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/');
	}
