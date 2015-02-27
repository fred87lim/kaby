// web.js
var express = require("express"),
	users = require('./routes/users');

// EJS is not cool, so we use swig.
var swig = require('swig');
//swig.setDefaults({ varControls: ['<%=', '%>'] });
var passport = require('passport');
var flash = require('connect-flash');
var logfmt = require("logfmt");
var mongoose = require('mongoose');

/* Configuration file */
var config = require('./config/config');

// Oauth Model
var OauthModel = require('./app/models/oauth');

// node-oauth2-server
var oauthserver = require('node-oauth2-server');

/* We need to export app for unit testing */
var app = exports.app = express();


// Winston for log
var winston = require('winston');
// By default, only the Console transport is set on the default logger
// add or remove transports via the add() and remove() methods
winston.add(winston.transports.File, { filename: 'logs/somefile.log' });
//winston.remove(winston.transports.Console);

/* Set database connection string based on current setting. It is either 'production', 'test' or 'development' */
winston.log('info', 'Mode: ' + app.settings.env);
app.set('dbUrl', config.db[app.settings.env]);

// test winston page controller
var PageController = require('./app/controllers/page_controller');
PageController.findPageByUsername({username: 'ASE_SG'}, function (result) {
    //console.log(result);
    //winston.log('info', result);
});

var session = require('express-session');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var nodemailer = require("nodemailer");
var fs = require('fs');
var paypal = require('./app/paypal.js');
var favicon = require('serve-favicon');

var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);

try {
    var configJSON = fs.readFileSync(__dirname + "/config/config.json");
    //var config = JSON.parse(configJSON.toString());
} catch (e) {
    console.error("File config.json not found or is invalid: " + e.message);
    process.exit(1);
}

app.oauth = oauthserver({
  model: OauthModel,
  grants: ['password', 'authorization_code', 'refresh_token'],
  debug: true
});

//paypal.init(config);
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/fonts'));


app.use(favicon(__dirname + '/public/img/favicon.ico'));

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "tranhungnguyen@gmail.com",
        pass: "Hungnguyen"
    }
});

var configDB = require('./config/database.js');
//mongoose.connect(configDB.url);

/* Establish mongoose connection */
mongoose.connect(app.get('dbUrl'));

require('./config/passport')(passport, smtpTransport);

app.use(logfmt.requestLogger());
app.use(require('connect').bodyParser());
app.set('views', __dirname + '/views');

app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

// read cookie
app.use(cookieParser());

// This is where all the magic happen!
app.engine('html', swig.renderFile);

// Set up ejs for templating
//app.set('view engine', 'ejs');
app.set('view engine', 'html');

// required for passport
app.use(session({ secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var port = Number(process.env.PORT || 5000);

// routes ==========
require('./app/routes.js')(app, passport);
require('./app/routes/post.js')(app, passport);

server.listen(port, function() {
  console.log("Listening on " + port);
});

//io.listen(server);
var clients = [];

// a map of usernames to socket ids - so we can message clients individually.
var users = {};

// io.sockets.on('connection', function (socket) {

//     // login a user with there provided name
//     socket.on('log in', function (data) {
//         users[data.loginUsername] = socket.id;
//         console.log(data.loginUsername + ' is connecting to socket server.');
//     });

//     socket.on('disconnect', function() {
//       console.log('Got disconnect! ' + socket.id);

//       var i = clients.indexOf(socket.id);
//       clients.splice(i, 1)
//     });

//     //send data to client
//     // setInterval(function(){
//     //     //socket.emit('date', {'date': new Date()});
//     //     io.sockets.socket(clients[0]).emit('news', 'Welcome onboard User 1 ' + new Date());
//     // }, 2000);

//     // User wants to send an message
//     socket.on('send_message', function (data) {
//         io.sockets.socket(users[data.username]).emit('new message', {username: data.username, message: data.message});
//     });

//     socket.on('follow_noti', function (data) {
//         io.sockets.socket(users[data.loginUser]).emit('follow_noti', 
//             {username: data.loginUser, message: 'is now following you'});
//         console.log('follow notification ' + data.loginUser);
//     });

//     clients.push(socket.id);

//     //socket.emit('send message', { hello: 'world' });
//     //io.sockets.socket(clients[0]).emit('news', 'Welcome onboard User 1 ' + socket.id);
//     socket.on('join', function (data) {
//         console.log('Socket: ' + JSON.stringify(data));


//     });
// });