var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
	title: String,
	created: Date,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	options: [
		{
			text: String,
			votes: Number
		}
	],
	totalVotes: Number
});

pollSchema.methods.voteFor = function(option) {
	var selectedIndex = findOptionIndex(this.options, 'text', option.text);

	if (!selectedIndex) {
		this.options[selectedIndex].votes++;
		this.markModified('options');

		this.totalVotes++;
		this.markModified('totalVotes');
	}
}

pollSchema.set('toJSON', {virtuals: true});

pollSchema.set('versionKey', false);

module.exports = mongoose.model('Poll', pollSchema);

function findOptionIndex(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return i;
		}
	}
	return null;
}
