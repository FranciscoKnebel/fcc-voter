var Poll = require('../models/poll');

module.exports = function(app) {

	app.get('/poll/new', isLoggedIn, function(req, res) {
		res.render("newPoll.ejs");
	});

	app.post('/poll/new', isLoggedIn, function(req, res) {
		var newPoll = new Poll();

		var pollOptions = [];
		var passedOptions = req.body.options;
		for (var i = 0; i < passedOptions.length; i++) {
			pollOptions.push({text: passedOptions[i].text, votes: 0});
		}

		newPoll.title = req.body.question;
		newPoll.owner = req.user;
		newPoll.options = pollOptions;
		newPoll.totalVotes = 0;

		newPoll.save(function(err) {
			if(err)
				throw err;
		});

		res.send("New question from " + newPoll.user._id);
	});

	app.get('/poll/:pollID', function(req, res) {
		//check db for polls with _id equal to req.params.pollID
		Poll.findOne({'_id': req.params.pollID}, function(err, result) {
			if(err)
				throw err;

			if(!result)
				res.render('poll.ejs', {pollID: req.params.pollID});
			res.render('poll.ejs', {poll: result, pollID: req.params.pollID});
		});
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/');
	}
