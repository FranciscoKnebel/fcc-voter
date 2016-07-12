var mongoose = require('mongoose');
var shortid = require('shortid');

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
			votes: Number,
			_id: false
		}
	],
	totalVotes: Number,
	_id: {
		type: String,
		'default': shortid.generate
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
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

pollSchema.methods.getOptions = function() {
	return this.options;
}

module.exports = mongoose.model('Poll', pollSchema);

function findOptionIndex(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return i;
		}
	}
	return null;
}
