/*
 * EXPOSE REQUIRED METHODS TO node-oauth2-server API.
 * IT WILL BE PASSED TO node-oauth2-server CONFIGURATION WHEN INITIALIZING OAUTH2 SERVER IN APPLICATION (web.js)
 */
var AuthCode = require('./oauth_authcode');
var AccessToken = require('./oauth_accesstoken');
var RefreshToken = require('./oauth_refreshtoken');
var User = require('./user');
var Client = require('./oauth_client');

// Authorization Code
module.exports.getAuthCode = AuthCode.getAuthCode;
module.exports.saveAuthCode = AuthCode.saveAuthCode;

// Access Token
module.exports.getAccessToken = AccessToken.getAccessToken;
module.exports.saveAccessToken = AccessToken.saveAccessToken;

// Refresh Token
module.exports.saveRefreshToken = RefreshToken.saveRefreshToken;
module.exports.getRefreshToken = RefreshToken.getRefreshToken;

module.exports.getUser = User.getUser;
module.exports.getClient = Client.getClient;
module.exports.grantTypeAllowed = Client.grantTypeAllowed;