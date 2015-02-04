var oauth2orize = require('oauth2orize');
var passport 	= require('passport');
var crypto 		= require('crypto');

var UserModel       		= require('../app/models/user');
var RefreshTokenModel       		= require('../app/models/oauth_refreshtoken');
var AccessTokenModel       		= require('../app/models/oauth_accesstoken');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function (client, email, password, scope, done) {
    console.log('Receive: ' + email);
    console.log(client);
	UserModel.findOne({'local.email' : email}, function (err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
			return done(null, false);
		}

		// if the user is found but the password is wrong
        if (!user.validPassword(password)) {
            return done(null, false, { message: constants.ERROR9008 });
        }

        console.log('User ' + email + ' found.');

        // Remove refresh token 
        RefreshTokenModel.remove({ user: user._id, cliendId: client.clientId}, function (err) {
        	if (err) {
        		return done(err);
        	}
        });

        // Remove access token 
        AccessTokenModel.remove({ user: user._id, cliendId: client.clientId}, function (err) {
        	if (err) {
        		return done(err);
        	}
        });

        // Create access token value
        var tokenValue = crypto.randomBytes(32).toString('base64');

        // Create refresh token value
        var refreshTokenValue = crypto.randomBytes(32).toString('base64');

        var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, user: user._id });

        var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, user: user._id });

        refreshToken.save(function (err) {
            if (err) { 
            	return done(err); 
            }
        });

        var info = { scope: '*' };

        token.save(function (err, token) {
            if (err) { 
            	return done(err); 
            }

            done(null, tokenValue, refreshTokenValue, { 'expires_in': 3600 });
        });
	});
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
	RefreshTokenModel.findOne({ token: refreshToken}, function (err, token) {
		if (err) {
			return done(err);
		}

		if (!token) {
			return done(null, false);
		}

		UserModel.findById(token.userId, function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) { 
				return done(null, false); 
			}

			// Remove old refresh token
			RefreshTokenModel.remove({ user: user._id, clientId: client.clientId }, function (err) {
                if (err) {
                	return done(err);
                }
            });

			// Remove old access token
            AccessTokenModel.remove({ user: user._id, clientId: client.clientId }, function (err) {
                if (err) {
                	return done(err);
                }
            });

            // Create new access token value
            var tokenValue = crypto.randomBytes(32).toString('base64');

            // Create new refresh token value
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');

            var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, user: user._id });

            var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, user: user._id });

            // Save new refresh token
            refreshToken.save(function (err) {
                if (err) { return done(err); }
            });

            var info = { scope: '*' }

            // Save new access token
            token.save(function (err, token) {
                if (err) { return done(err); }
                done(null, tokenValue, refreshTokenValue, { 'expires_in': 3600});
            });
		});
	});
}));

// token endpoint
exports.token = [
	passport.authenticate(['local-login', 'oauth2-client-password'], { session: false}),
	server.token(),
	server.errorHandler()
]