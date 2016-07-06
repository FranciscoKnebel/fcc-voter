var express = require("express");
dotenv = require('dotenv').load();
mongoose = require('mongoose');
passport = require('passport');
flash = require('connect-flash');
morgan = require('morgan');
cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
session = require('express-session');

routes = require('./server/routes/index');
app = express();

mongoose.connect(process.env.MLAB_URL);

require('./server/auth/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extend: true
}));
app.set("view options", {
	layout: false
});
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + "/client/views");
app.set('view engine', 'ejs');

// passport
app.use(session({
	secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./server/auth/passport')(passport); // pass passport for configuration

app.use('/css', express.static(__dirname + '/client/css'));
app.use('/js', express.static(__dirname + '/client/js'));

routes(app, passport);

var port = process.env.PORT;
var listener = app.listen(port, function() {
	console.log("Listening on port " + listener.address().port);
});
