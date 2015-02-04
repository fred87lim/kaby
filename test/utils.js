'use strict';

/*
* Modified from https://github.com/elliotf/mocha-mongoose
*/

var config = require('../config/config');
var mongoose = require('mongoose');

var Client = require('../app/models/oauth_client');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'development';

before(function (done) {
	this.timeout(15000);
 	function clearDB() {
 		console.log('Clearing database....')
   		for (var i in mongoose.connection.collections) {
    		mongoose.connection.collections[i].remove(function() {});
   		}

        // save client Id
        var client  = new Client();
        client.clientId = 'papers3';
        client.clientSecret = '123';
        console.log('Initializing client....');
        client.save(function (err) {
            if (err) {
                console.log(err);
            }
            console.log('Saving client....');
        });
   		//return done();
 	}

 	if (mongoose.connection.readyState === 0) {
    	console.log(config.db.test);
   		mongoose.connect(config.db.development, function (err) {
     		if (err) {
        		console.log(err);
     		}
     		clearDB();
     		done();
   		});
   		
 	} else {
	   clearDB();
	   done();
 	}
 	
}); 

after(function (done) {
	mongoose.disconnect();
 	return done();
});