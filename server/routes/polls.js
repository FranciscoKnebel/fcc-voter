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

	app.get('/profile/getpolls', isLoggedIn, function(req, res) {
		var owner = req.user;
		var polls = [];

		if (!owner.ownedPolls)
			res.send(polls);
		else {
			Poll.find({
				'owner': owner.id
			}, function(err, foundPolls) {
				if (err)
					throw err;

				//order from most recent to least.
				var result = foundPolls.sort(function(a, b) {
					a = new Date(a.createdAt);
					b = new Date(b.createdAt);
					return a > b ? -1 : a < b ? 1 : 0;
				});

				res.status(200).send(result);
			});
		}
	});

	app.get('/poll/', function(req, res) {
		res.redirect('/');
	});
}

function savePollToUser(req, poll) {
	var owner = poll.owner;
	console.log("Saving poll to user " + owner.id);
	User.findByIdAndUpdate(owner.id, {
			$push: {
				ownedPolls: poll
			}
		}, {
			safe: true,
			upsert: true
		},
		function(err, usr) {
			if (err)
				throw err;

			console.log("Saved poll to user " + usr.id);
			req.session.passport.user.ownedPolls = usr.ownedPolls;
		});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/');
}
