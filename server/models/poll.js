var mongoose = require( 'mongoose' );
var shortid = require( 'shortid' );

var pollSchema = mongoose.Schema( {
	title: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	options: [ {
		text: String,
		votes: Number
	} ],
	totalVotes: Number,
	link: {
		type: String,
		'default': shortid.generate
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
} );

pollSchema.methods.voteFor = function ( optionID ) {
	var selectedIndex = findOptionIndex( this.options, '_id', optionID );

	if ( selectedIndex !== null ) {
		this.options[ selectedIndex ].votes++;
		this.markModified( 'options' );

		this.totalVotes++;
		this.markModified( 'totalVotes' );

		this.save( function ( err ) {
			if ( err )
				throw err;

			return this.totalVotes;
		} );
	} else {
		console.log( "Selected option not found." );
		return null;
	}
}

pollSchema.methods.getOptions = function () {
	return this.options;
}

module.exports = mongoose.model( 'Poll', pollSchema );

function findOptionIndex( array, key, value ) {
	for ( var i = 0; i < array.length; i++ ) {
		if ( array[ i ][ key ] == value ) {
			return i;
		}
	}
	return null;
}
