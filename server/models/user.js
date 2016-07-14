var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String,
		_id: false
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String,
		_id: false
	},
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String,
		image: String,
		_id: false
	},
	defined: {
		username: String,
		email: String,
		image: String,
		_id: false
	},
	ownedPolls: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Poll'
	}]
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
