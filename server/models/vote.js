var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
	poll: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Poll'
	},
	voted: [ip: String]
});

module.exports = mongoose.model('Vote', voteSchema);
