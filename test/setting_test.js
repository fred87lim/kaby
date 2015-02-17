var request = require('superagent');
var assert = require('assert');
var expect = require('expect.js');
var assert = require("assert");
var superagent = require('superagent');
var utils = require('./utils');
//var User          = require('../test/users/models');
var config = require('../config/config');
var mongoose = require('mongoose');
var Dummy = require('../app/models/dummy');
var should = require('chai').should;
var UserRoute = require('../app/routes/userRoute');
var constants = require('../app/utils/constants');
var passport = require('passport');

var SettingController = require('../app/controllers/setting_controller');

/* add node js app reference */
var app = require('../web');

/* Initialize User Controller */
var userController = new UserRoute(app, passport);

var agent;
var loginToken;
var userId;
var resetToken;
var reviewers = [];

before (function (done) {
    agent = superagent.agent();
    done();
});

describe.skip('Test', function () {
    describe('Industry', function () {
        it('Find Industry By Keyword', function (done) {
            SettingController.findIndustryByKeyword('Infor', function (industries) {
                console.log(industries);
                done();
            });
        });
    })
})