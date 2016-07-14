var Poll = require('../models/poll');
var User = require('../models/user');

module.exports = function(app) {

	app.get('/poll/new', isLoggedIn, function(req, res) {
		res.render("authenticated/newPoll.ejs", {
			user: req.user
		});
	});

	app.post('/poll/new', isLoggedIn, function(req, res) {
		var newPoll = new Poll();

		var pollOptions = [];
		var passedOptions = req.body.options;
		for (var i = 0; i < passedOptions.length; i++) {
			pollOptions.push({
				text: passedOptions[i].text,
				votes: 0
			});
		}

		newPoll.title = req.body.question;
		newPoll.owner = req.user;
		newPoll.options = pollOptions;
		newPoll.totalVotes = 0;

		newPoll.save(function(err) {
			if (err)
				throw err;
			console.log("Saved poll " + newPoll.link + " to db");
			savePollToUser(req, newPoll);

			var response = {
				title: newPoll.title,
				options: newPoll.options,
				link: newPoll.link
			}

			res.status("200").send(response);
		});
	});

	app.get('/poll/:ID', function(req, res) {
		//check db for polls with _id equal to req.params.pollID
		var ID = req.params.ID;

		Poll.findOne({
			'link': ID
		}, function(err, result) {
			if (err)
				throw err;


			if (!result) {
				res.render('public/poll.ejs', {
					found: false,
					ID: ID
				});
			} else {
				res.render('public/poll.ejs', {
					found: true,
					poll: result,
					ID: ID
				});
			}
		});
	});

	app.get('/poll/', function(req, res) {
		res.redirect('/');
	});
}

function savePollToUser(req, poll) {
	var owner = poll.owner;
	var updatedPolls = [];
	console.log("Saving poll to user " + owner.id);

	if (owner.ownedPolls)
		updatedPolls = owner.ownedPolls;

	updatedPolls.push(poll);
	User.findOneAndUpdate({
		'_id': owner.id
	}, {
		ownedPolls: updatedPolls
	}, function(err, user) {
		if (err)
			throw err;

		req.session.passport.user.ownedPolls = updatedPolls;
	});

	return;
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/');
}
