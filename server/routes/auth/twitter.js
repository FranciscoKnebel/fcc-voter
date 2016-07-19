module.exports = function ( app, passport ) {
	app.get( '/auth/twitter', isLoggedOut, passport.authenticate( 'twitter' ) );

	app.get( '/auth/twitter/callback', isLoggedOut, passport.authenticate( 'twitter', {
		successRedirect: '/profile',
		failureRedirect: '/'
	} ) );

	app.get( '/connect/twitter', passport.authorize( 'twitter', {
		scope: 'email'
	} ) );

	/*app.get('/connect/twitter/callback', isLoggedIn, passport.authorize('twitter', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));*/

	app.get( '/unlink/twitter', isLoggedIn, function ( req, res ) {
		var user = req.user;
		user.twitter.token = undefined;
		user.save( function ( err ) {
			res.redirect( '/profile' );
		} );
	} );
}

function isLoggedIn( req, res, next ) {
	if ( req.isAuthenticated() )
		return next();
	else
		res.redirect( '/' );
}

function isLoggedOut( req, res, next ) {
	if ( req.isUnauthenticated() ) {
		return next();
	}
	res.redirect( '/' );
}
