module.exports = function ( app, passport ) {
	app.get( '/auth/facebook', isLoggedOut, passport.authenticate( 'facebook', {
		scope: 'email'
	} ) );

	app.get( '/auth/facebook/callback', passport.authenticate( 'facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	} ) );

	app.get( '/connect/facebook', isLoggedIn, passport.authorize( 'facebook', {
		scope: 'email'
	} ) );

	app.get( '/unlink/facebook', isLoggedIn, function ( req, res ) {
		var user = req.user;
		user.facebook.token = undefined;
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
