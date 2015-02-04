// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
var BasicStrategy           = require('passport-http').BasicStrategy;
var BearerStrategy          = require('passport-http-bearer').Strategy;

var crypto = require('crypto');
var constants = require('../app/utils/constants');
// load up the user model
var User       		= require('../app/models/user');
var async = require('async');
// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport, smtpTransport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Facebook
    passport.use(new FacebookStrategy({ 
    	clientID 		: configAuth.facebookAuth.clientID,
    	clientSecret 	: configAuth.facebookAuth.clientSecret,
    	callbackURL 	: configAuth.facebookAuth.callbackURL,
    	passReqToCallback : true
    },

    // facebook will send back the token and profile
    function (req, token, refreshToken, profile, done) {

        // Get user agent information
        var newUserAgent = req.headers['user-agent'];
        var newIpAddress = req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

    	// asynchronous
    	process.nextTick(function () {

    		// check if user is already logged in
    		if (!req.user) {

    		// find the user in the database based on their facebook id
    		User.findOne({ 'facebook.id' : profile.id }, function (err, user) {

    			if (err)
    				return done(err);

    			// if the user is found, the log them in
    			if (user) {

    				// if there is a user id already but no token
    				// (user was linked at one point and then removed)
    				// just add our token and profile information
    				if (!user.facebook.token) {
    					user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
	                        user.facebook.email = profile.emails[0].value;

	                        user.save(function(err) {
	                            if (err)
	                                throw err;
	                            return done(null, user);
	                        });
    				}
    				return done(null, user);
    			} else {
    				// if there is no user found with that facebook id,
    				// create them
    				var newUser = new User();

    				newUser.facebook.id = profile.id;
    				newUser.facebook.name = profile.name.givenName + ' ' +
    					profile.name.familyName;

    				// facebook can return multiple emails
    				newUser.facebook.email = profile.emails[0].value;
                    
                    // save facebook token in session
                    req.session.fbToken = token;

                    user.facebook.platforms.push({ userAgent : newUserAgent, 
                        ipAddress: newIpAddress, token: token});

    				// save new user to the database
    				newUser.save(function (err) {
    					if (err)
    						throw err;

    					return done(null, newUser);
    				});
    			}
    		});

    	} else {
    		// user already exist and is logged in, we have to link accounts
    		var user = req.user;

    		// update the current users facebook credentials
    		user.facebook.id = profile.id;
    		user.facebook.name = profile.name.givenName + ' ' +
    					profile.name.familyName;
    		user.facebook.email = profile.emails[0].value;
            user.platforms.push({ userAgent : newUserAgent, 
                        ipAddress: newIpAddress, token: token, provider: 'facebook'});

            // save facebook token in session
            req.session.fbToken = token;

    		user.save(function (err) {
    			if (err)
    				throw err;

                

    			return done(null, user);
    		});
    	}
    	});
    }));

    passport.use(new ClientPasswordStrategy (function (clientId, clientSecret, done) {
        ClientModel.findOne({ clientId: clientId}, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false, { message: constants.ERROR9000 });
            }

            if (client.clientSecret != clientSecret) { 
                return done(null, false); 
            }

            return done(null, client);
        });
    }));

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
    // 1. When user signs up with email, we need to send activation code to confirm the email belongs 
    // to user. If user signs up using social network, we dont need to send activation code, since it
    // has already been authenticated.

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, { message: constants.ERROR9000 });
            } else {

                // We need to create two crypto code here.
                var createResetToken = function (callback) {
                    crypto.randomBytes(48, function (err, buf) {
                        var token = buf.toString('hex');
                        callback(null, token);
                    });
                }

                var createActivationCode = function (callback) {
                    crypto.randomBytes(48, function (err, buf) {
                        var token = buf.toString('hex');
                        callback(null, token);
                    });
                }

                async.parallel({
                        resetToken: createResetToken,
                        activationCode: createActivationCode
                    },
                    function (err, results) {
                        var newUser            = new User();

                        // set the user's local credentials
                        newUser.local.email    = email;
                        newUser.local.username = req.body.username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.firstName = req.body.firstName;
                        newUser.local.lastName = req.body.lastName;
                        newUser.local.resetPasswordToken = results.resetToken;
                        newUser.local.activationCode = results.activationCode;

                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                if (err.errors['local.email']) {
                                    return done(null, false, { message: err.errors['local.email'].message});
                                } else if (err.errors.local.username) {
                                    return done(null, false, { message: err.errors['local.username'].message});
                                }
                            }

                            // send email with activation code to user for confirmation.
                            // setup e-mail data with unicode symbols
                            var mailOptions = {
                                from: "Fred Foo ✔ <tranhungnguyen@gmail.com>", // sender address
                                to: newUser.local.email, // list of receivers
                                subject: "Hello ✔", // Subject line
                                text: "Hello world ✔", // plaintext body

                                // Yahoo mail sucks. It does not show the link.
                                html: "<a href='http://localhost:5000/activate/" + newUser.local.activationCode 
                                    + "'>Click on this link to activate your account</b>" // html body
                            }

                            // send mail with defined transport object
                            smtpTransport.sendMail(mailOptions, function(error, response){
                                if(error){
                                    console.log(error);
                                }else{
                                    console.log("Message sent: " + response.message);
                                }

                                // if you don't want to use this transport object anymore, uncomment following line
                                //smtpTransport.close(); // shut down the connection pool, no more messages
                            });
                            return done(null, newUser);
                        });
                        //----------------------
                });

				// if there is no user with that email
                // create the user
                // crypto.randomBytes(48, function (ex, buf) {
                //     var code = buf.toString('hex');

                //     var newUser            = new User();

                //     // set the user's local credentials
                //     newUser.local.email    = email;
                //     newUser.local.username = req.body.username;
                //     newUser.local.password = newUser.generateHash(password);
                //     newUser.local.firstName = req.body.firstName;
                //     newUser.local.lastName = req.body.lastName;

                //     newUser.local.activationCode = code;

                //     // save the user
                //     newUser.save(function(err) {
                //         if (err) {
                //             if (err.errors['local.email']) {
                //                 return done(null, false, { message: err.errors['local.email'].message});
                //             } else if (err.errors.local.username) {
                //                 return done(null, false, { message: err.errors['local.username'].message});
                //             }
                //         }

                //         // send email with activation code to user for confirmation.
                //         // setup e-mail data with unicode symbols
                //         var mailOptions = {
                //             from: "Fred Foo ✔ <tranhungnguyen@gmail.com>", // sender address
                //             to: newUser.local.email, // list of receivers
                //             subject: "Hello ✔", // Subject line
                //             text: "Hello world ✔", // plaintext body

                //             // Yahoo mail sucks. It does not show the link.
                //             html: "<a href='http://localhost:5000/activate/" + code 
                //                 + "'>Click on this link to activate your account</b>" // html body
                //         }

                //         // send mail with defined transport object
                //         smtpTransport.sendMail(mailOptions, function(error, response){
                //             if(error){
                //                 console.log(error);
                //             }else{
                //                 console.log("Message sent: " + response.message);
                //             }

                //             // if you don't want to use this transport object anymore, uncomment following line
                //             //smtpTransport.close(); // shut down the connection pool, no more messages
                //         });
                //         return done(null, newUser);
                //     });
                // });                
            }

        });    

        });

    }));

	// Local login
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, email, password, done) {
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to
        console.log(email + "/" + password);
        var newUserAgent = req.headers['user-agent'];
        var newIpAddress = req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

        require('crypto').randomBytes(48, function (ex, buf) {
            var userToken = buf.toString('hex');

            /* Check if user has already registered with given email */
            User.findOne({ 'local.email' : email}, function (err, user) {
            
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: constants.ERROR9009 });
                //return done(null, false, { message: 'bad password' });
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, { message: constants.ERROR9008 });
            }

            /*
             * If user found, log him in.
             */
            if (user) {
                /*
                 *  Create token and save to platform
                 */
                 user.platforms.push({ userAgent : newUserAgent, 
                        ipAddress: newIpAddress, token: userToken, provider: 'local'});
                 user.save(function(err) {
                    if (err)
                        throw err;
                });
            }
            return done(null, user, {loginToken : userToken});
        });
        });

		
	}));

};