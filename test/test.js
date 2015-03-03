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
var UserController = require('../app/controllers/user_controller');

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
            SettingController.findIndustryByKeyword('tech', function (industries) {
                console.log(industries);
                done();
            });
        });
		
		it('Find Industry By Id', function (done) {
            SettingController.findIndustryById('54e3f743aba48f04065ff258', function (industry) {
                console.log(industry);
                done();
            });
        });
    })
});

describe('User Controller', function () {
    describe('User Profile', function () {
        it.skip('Save Basic Information', function (done) {
            UserController.saveBasicInfo({
                userId: '547afde26c42c55805536095',
                location: '54d22ef42dd03b5103c1f68e',
                birthday: {
                    day: 23,
                    month: 4,
                    year: 1900,
                    privacy: '548d273a5b8e03c003c2eab1'
                },
                description: 'Test Description'
            }, function (result) {
                console.log(result);
                done();
            });
        });

        it('Add Experience with company name', function (done) {
            UserController.addExperience({
                userId: '54eddf70ef940c2a050bc3b5',
                location: '54eddf81caaf5f2d05aa6e23',
                title: 'Software Engineer',
                companyName: 'Google',
                companyId: null,
                isWorking: false,
                date: {
                    start: {
                        month: 3,
                        year: 2008
                    },
                    end: {
                        month: 5,
                        year: 2012
                    }
                },
                description: 'Test Description'
            }, function (result) {
                console.log(result);
                done();
            });
        });

        it('Add Experience with company id', function (done) {
            UserController.addExperience({
                userId: '54eddf70ef940c2a050bc3b5',
                location: '54eddf81caaf5f2d05aa6e24',
                title: '',
                companyName: 'Google',
                companyId: '54eddf71ef940c2a050bc3cc',
                isWorking: true,
                date: {
                    start: {
                        month: 6,
                        year: 2012
                    }
                },
                description: 'Test Description'
            }, function (result) {
                console.log(result);
                done();
            });
        });
    })
});

describe.skip('Recruitment', function () {
    describe('#Signup()', function () {
        it('SIGNUP: kabuky_knight@yahoo.com', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
            .send({ email: 'kabuky_knight@yahoo.com', 
                username: 'kabuky', 
                firstName: 'Anthony', 
                lastName: 'Tran',
                password: 'myl0v3'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.local.email.should.equal('kabuky_knight@yahoo.com');   
                done();
            });
        });

        it('SIGNUP: tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
            .send({ email: 'tranhungnguyen@gmail.com', 
                username: 'anthony', 
                firstName: 'Tran', 
                lastName: 'Nguyen',
                password: 'myl0v3'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.local.email.should.equal('tranhungnguyen@gmail.com');   
                done();
            });
        });

        it('SIGNUP: projectx_user1@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
            .send({ email: 'projectx_user1@gmail.com', 
                username: 'projectx_user1', 
                firstName: 'User', 
                lastName: 'One',
                password: 'myl0v3'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.local.email.should.equal('projectx_user1@gmail.com');   
                done();
            });
        });

        it('SIGNUP: projectx_user2@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
            .send({ email: 'projectx_user2@gmail.com', 
                username: 'projectx_user2', 
                firstName: 'User', 
                lastName: 'Two',
                password: 'myl0v3'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.local.email.should.equal('projectx_user2@gmail.com');   
                done();
            });
        });

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'richardbranson@yahoo.com', 
                    username: 'richardbranson', 
                    firstName: 'Richard', 
                    lastName: 'Branson',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('richardbranson@yahoo.com');
                    reviewers.push(res.body.data._id);
                    done();
                });      
        });

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'barackobama@yahoo.com', 
                    username: 'barackobama', 
                    firstName: 'Barack', 
                    lastName: 'Obama',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('barackobama@yahoo.com');
                    reviewers.push(res.body.data._id);
                    done();
                });      
        });

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'jeffweiner@yahoo.com', 
                    username: 'jeffweiner', 
                    firstName: 'Jeff', 
                    lastName: 'Weiner',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('jeffweiner@yahoo.com');
                    reviewers.push(res.body.data._id); 
                    done();
                });      
        });

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'eduardosaverin@yahoo.com', 
                    username: 'eduardosaverin', 
                    firstName: 'Eduardo', 
                    lastName: 'Saverin',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('eduardosaverin@yahoo.com');
                    reviewers.push(res.body.data._id);
                    done();
                });      
        });

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'ariannahuffington@yahoo.com', 
                    username: 'ariannahuffington', 
                    firstName: 'Arianna', 
                    lastName: 'Huffington',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('ariannahuffington@yahoo.com');
                    reviewers.push(res.body.data._id);
                    done();
                });      
        });

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'seanparker@yahoo.com', 
                    username: 'seanparker', 
                    firstName: 'Sean', 
                    lastName: 'Parker',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('seanparker@yahoo.com');
                    reviewers.push(res.body.data._id);
                    done();
                });      
        });

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'michaeldell@yahoo.com', 
                    username: 'michaeldell', 
                    firstName: 'Michael', 
                    lastName: 'Dell',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('michaeldell@yahoo.com');
                    reviewers.push(res.body.data._id); 
                    done();
                });      
        });
    });
    
    var loginToken1;
    var loginToken2;
    var loginToken3;
    var loginToken4;

    var accessToken;
    var refreshToken;
    var clientSecretBase64 = new Buffer('123').toString('base64');
    var clientCredentials = 'papers3' + clientSecretBase64;

    describe('#login()', function () {
        it('LOGIN: kabuky_knight@yahoo.com', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'kabuky_knight@yahoo.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                loginToken1 = res.body.data.loginToken;
                res.body.status.should.equal('OK');
                done();
            });      
        });

        // AUTHENTICATION WITH OAUTH2
        it('Authentication with Oath2', function (done) {
            agent.post('http://localhost:5000/api/v2/oauth/token')
            .type('form')
            .auth(clientCredentials, '') // Not sure what does this mean. Try remove it also same result
            .send({
                grant_type: 'password',
                client_id: 'papers3',
                client_secret: '123',
                username: 'kabuky_knight@yahoo.com',
                email: 'kabuky_knight@yahoo.com',                  
                password: 'myl0v3'})
            //.expect(200)
            .end(function (req, res) {
                console.log(res.body);
                assert(res.body.access_token, 'Ensure the access_token was set');
                assert(res.body.refresh_token, 'Ensure the refresh_token was set');
                done();
            });      
        });

        it('LOGIN: tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'tranhungnguyen@gmail.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                loginToken2 = res.body.data.loginToken;
                res.body.status.should.equal('OK');
                done();
            });      
        });

        it('LOGIN: projectx_user1@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'projectx_user1@gmail.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                loginToken3 = res.body.data.loginToken;
                res.body.status.should.equal('OK');
                done();
            });      
        });

        it('LOGIN: projectx_user2@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'projectx_user2@gmail.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                loginToken4 = res.body.data.loginToken;
                res.body.status.should.equal('OK');
                done();
            });      
        });

        /* ================== ADD EDUCATION ==================*/
        it('ADD EDUCATION', function (done) {
            agent.post('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken2,
                school_name: 'University of Illinois at Urbana-Champaign',
                school_id: null,
                degree: 'Bachelor of Science',
                study_field: 'Electrical Engineering',
                date_started: {
                    day: 20,
                    month: 8,
                    year: 2009
                },
                date_ended: {
                    day: 20,
                    month: 5,
                    year: 2012
                },
                grade: 4.95,
                activities: 'Additional Honors & Awards',
                description: 'A*STAR NSS Scholarship',
                education_level: 'Undergraduate'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                educationId = res.body.data._id;
                done();
            });
        });

        it('ADD EDUCATION', function (done) {
            agent.post('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken1,
                school_name: 'University of Illinois at Urbana-Champaign',
                school_id: null,
                degree: 'Bachelor of Science',
                study_field: 'Electrical Engineering',
                date_started: {
                    day: 20,
                    month: 8,
                    year: 2009
                },
                date_ended: {
                    day: 20,
                    month: 5,
                    year: 2012
                },
                grade: 4.95,
                activities: 'Additional Honors & Awards',
                description: 'A*STAR NSS Scholarship',
                education_level: 'Undergraduate'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                educationId = res.body.data._id;
                done();
            });
        });

        /* ================== ADD EDUCATION ==================*/
        it('ADD EDUCATION', function (done) {
            agent.post('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken3,
                school_name: 'Carnegie Mellon University',
                school_id: null,
                degree: 'Bachelor of Science',
                study_field: 'Electrical and Electronics Engineering',
                date_started: {
                    day: 20,
                    month: 8,
                    year: 2009
                },
                date_ended: {
                    day: 20,
                    month: 5,
                    year: 2012
                },
                grade: 4.95,
                activities: 'Drawing, running',
                description: 'Education Description',
                education_level: 'Undergraduate'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                educationId = res.body.data._id;
                done();
            });
        });

        /* ================== ADD EDUCATION ==================*/
        it('ADD EDUCATION', function (done) {
            agent.post('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken1,
                school_name: 'Standford University',
                school_id: null,
                degree: 'Bachelor of Science',
                study_field: 'Electrical and Electronics Engineering',
                date_started: {
                    day: 20,
                    month: 8,
                    year: 2009
                },
                date_ended: {
                    day: 20,
                    month: 5,
                    year: 2012
                },
                grade: 4.95,
                activities: 'Drawing, running',
                description: 'Education Description',
                education_level: 'Undergraduate'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                educationId = res.body.data._id;
                done();
            });
        });

        /* ================== ADD EDUCATION ==================*/
        it('ADD EDUCATION', function (done) {
            agent.post('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken4, school_name: 'National University of Singapore', school_id: null, degree: 'Bachelor of Science', study_field: 'Electrical and Computer Engineering',
                date_started: {
                    day: 20, month: 8, year: 2009
                },
                date_ended: {
                    day: 20,
                    month: 5,
                    year: 2012
                },
                grade: 4.95,
                activities: 'Soccer, Teakwondo, Chess, Start-up, Entrepreneur',
                description: 'Education Description',
                education_level: 'Undergraduate'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                educationId = res.body.data._id;
                done();
            });
        });

        /* ================== ADD EXPERIENCE ==================*/
        it('ADD EXPERIENCE', function (done) {
            var companyName = 'ASE Singapore';
            agent.post('http://localhost:5000/api/v2/experience')
            .send({
                login_token: loginToken1,
                company_name: companyName,
                company_id: null,
                title: 'Analyst Programmer',
                location: 'Woodlands',
                is_working: true,
                date_started: {
                    day: 13,
                    month: 6,
                    year: 2012
                },
                description: 'Working under Test System group'})
            .set('Accept', 'application/json')
            .end(function (req, res) {

                res.body.status.should.equal('OK');
                res.body.data.companyName.should.equal(companyName);
                done();
            });
        });

        
        /* ================== ADD EXPERIENCE ==================*/
        it('ADD EXPERIENCE', function (done) {
            var companyName = 'Havas Media Group';
            agent.post('http://localhost:5000/api/v2/experience')
            .send({
                login_token: loginToken1,
                company_name: companyName,
                company_id: null,
                title: 'Global Social Manager',
                location: 'Woodlands',
                is_working: false,
                date_started: {
                    day: 4,
                    month: 5,
                    year: 2012
                },
                date_ended: {
                    day: 4,
                    month: 6,
                    year: 2013
                },
                description: 'My responsibilities include actively marketing Havas Media and its various entities with a series of B2B projects and content marketing efforts in the overall digital ecosystem. This includes establishing frameworks, new business development, training business leaders, and building thought leadership around the group. I currently work closely with our teams in London, New York, Manila, China, and Singapore. '})
            .set('Accept', 'application/json')
            .end(function (req, res) {

                res.body.status.should.equal('OK');
                res.body.data.companyName.should.equal(companyName);
                done();
            });
        });

        /* ================== ADD EXPERIENCE ==================*/
        it('ADD EXPERIENCE', function (done) {
            var companyName = 'Havas Media Group';
            agent.post('http://localhost:5000/api/v2/experience')
            .send({
                login_token: loginToken1,
                company_name: companyName,
                company_id: null,
                title: 'Social Media Strategist',
                location: 'Woodlands',
                is_working: false,
                date_started: {
                    day: 4,
                    month: 10,
                    year: 2010
                },
                date_ended: {
                    day: 4,
                    month: 4,
                    year: 2012
                },
                description: 'Event presenting Havas Media Singapores insights from our original joint research with Facebook, which included speakers from Facebook including the Head of Measurement & Research (APAC) at Facebook, and the President/CEO of Media Contacts Philippines. '})
            .set('Accept', 'application/json')
            .end(function (req, res) {

                res.body.status.should.equal('OK');
                res.body.data.companyName.should.equal(companyName);
                done();
            });
        });
    });

    /*=================== CREATE NEW PAGE ===================*/
    describe('#createNewPage', function () {
        var title = '';
        var content = '';
        it('Create New Page', function (done) {
            agent.post('http://localhost:5000/api/v2/page')
            .send({
                login_token: loginToken1,
                name: 'ASE Singapore',
                username: 'ASE_SG',
                description: 'ASE Singapore Pte. Ltd. is one of the total test solutions providers in Singapore with the primary objective of providing a more integrated supply chain with real time services to meet customers’ needs of semiconductor packaging and testing in the ASEAN cluster.',
                website: 'http://www.aseglobal.com.sg',
                page_type: 'COMPANY'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.username.should.equal('ASE_SG');
                done();
            });      
        });
    });

    /*=================== LOG IN AS ADMIN ===================*/
    var adminToken;
    var jobId;
    describe('#loginAsAdmin()', function () {
        /* Change password with invalid user id */
        it('LOGIN AS ADMIN', function (done) {
            agent.get('http://localhost:5000/api/v2/page/ASE_SG')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;

                agent.post('http://localhost:5000/api/v2/page/login')
                .send({
                    login_token: loginToken1,
                    page_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    adminToken = res.body.data.token;
                    done();
                });
            });      
        });

        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/jeffweiner')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken1,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    connectId = res.body.data._id;
                    agent.post('http://localhost:5000/api/v2/login')
                    .send({ 
                        email: 'jeffweiner@yahoo.com',                  
                        password: 'myl0v3',
                        rememberme: true})
                    .set('Accept', 'application/json')
                    .end(function (req, res) {
                        var loginToken = res.body.data.loginToken;
                        agent.put('http://localhost:5000/api/v2/connect')
                        .send({
                            login_token: loginToken,
                            connect_id: connectId
                        })
                        .set('Accept', 'application/json')
                        .end(function (req, res) {
                            res.body.status.should.equal('OK');
                            done();
                        });
                    });
                });
            });      
        });

        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/barackobama')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken1,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    connectId = res.body.data._id;
                    agent.post('http://localhost:5000/api/v2/login')
                    .send({ 
                        email: 'barackobama@yahoo.com',                  
                        password: 'myl0v3',
                        rememberme: true})
                    .set('Accept', 'application/json')
                    .end(function (req, res) {
                        var loginToken = res.body.data.loginToken;
                        agent.put('http://localhost:5000/api/v2/connect')
                        .send({
                            login_token: loginToken,
                            connect_id: connectId
                        })
                        .set('Accept', 'application/json')
                        .end(function (req, res) {
                            res.body.status.should.equal('OK');
                            done();
                        });
                    });
                });
            });      
        });

        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/michaeldell')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken1,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    connectId = res.body.data._id;
                    agent.post('http://localhost:5000/api/v2/login')
                    .send({ 
                        email: 'michaeldell@yahoo.com',                  
                        password: 'myl0v3',
                        rememberme: true})
                    .set('Accept', 'application/json')
                    .end(function (req, res) {
                        var loginToken = res.body.data.loginToken;
                        agent.put('http://localhost:5000/api/v2/connect')
                        .send({
                            login_token: loginToken,
                            connect_id: connectId
                        })
                        .set('Accept', 'application/json')
                        .end(function (req, res) {
                            res.body.status.should.equal('OK');
                            done();
                        });
                    });
                });
            });      
        });

        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/ariannahuffington')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken1,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    connectId = res.body.data._id;
                    agent.post('http://localhost:5000/api/v2/login')
                    .send({ 
                        email: 'ariannahuffington@yahoo.com',                  
                        password: 'myl0v3',
                        rememberme: true})
                    .set('Accept', 'application/json')
                    .end(function (req, res) {
                        var loginToken = res.body.data.loginToken;
                        agent.put('http://localhost:5000/api/v2/connect')
                        .send({
                            login_token: loginToken,
                            connect_id: connectId
                        })
                        .set('Accept', 'application/json')
                        .end(function (req, res) {
                            res.body.status.should.equal('OK');
                            done();
                        });
                    });
                });
            });      
        });

        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/seanparker')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken1,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    var connectId = res.body.data._id;
                    agent.post('http://localhost:5000/api/v2/login')
                    .send({ 
                        email: 'seanparker@yahoo.com',                  
                        password: 'myl0v3',
                        rememberme: true})
                    .set('Accept', 'application/json')
                    .end(function (req, res) {
                        var loginToken = res.body.data.loginToken;
                        agent.put('http://localhost:5000/api/v2/connect')
                        .send({
                            login_token: loginToken,
                            connect_id: connectId
                        })
                        .set('Accept', 'application/json')
                        .end(function (req, res) {
                            res.body.status.should.equal('OK');
                            done();
                        });
                    });
                });
            });      
        });

        /*=================== POST NEW JOB ===================*/
        it('POST NEW JOB', function (done) {
            agent.get('http://localhost:5000/api/v2/page/ASE_SG')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                var title = 'Software Engineer';
                agent.post('http://localhost:5000/api/v2/job')
                .send({
                    login_token: loginToken1,
                    admin_token: adminToken,
                    page_id: target,
                    title: title,
                    description: 'Description',
                    requirements: 'requirements',
                    industries: 'industries',
                    salary_min: 3000,
                    salary_max: 5000,
                    salary_currency: 'SGD',
                    experience_min: 2,
                    experience_max: 5,
                    perks: 'Perks',
                    quantity: 2,
                    location: 'Woodlands',
                    date_expire: '2015-09-23 23:59:59',
                    reviewers: reviewers
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.title.should.equal(title);
                    jobId = res.body.data._id;
                    done();
                });
            });      
        });

        /*=================== POST NEW JOB ===================*/
        var jobId2;
        it('POST NEW JOB', function (done) {
            agent.get('http://localhost:5000/api/v2/page/ASE_SG')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                var title = 'System Architect';
                agent.post('http://localhost:5000/api/v2/job')
                .send({
                    login_token: loginToken1,
                    admin_token: adminToken,
                    page_id: target,
                    title: title,
                    description: 'Responsible for designing whole system',
                    requirements: 'System Architect requirements',
                    industries: 'Information Techonology',
                    salary_min: 3000,
                    salary_max: 5000,
                    salary_currency: 'SGD',
                    experience_min: 2,
                    experience_max: 5,
                    perks: 'Perks',
                    quantity: 2,
                    location: 'Woodlands',
                    date_expire: '2015-09-23 23:59:59',
                    reviewers: reviewers
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.title.should.equal(title);
                    jobId2 = res.body.data._id;
                    done();
                });
            });      
        });

        /* APPLY JOB Login Token2 */
        it('APPLY JOB tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/job/application')
            .send({
                login_token: loginToken2,
                job_id: jobId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* APPLY JOB Login Token3 */
        it('APPLY JOB tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/job/application')
            .send({
                login_token: loginToken3,
                job_id: jobId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* APPLY JOB Login Token3 */
        it('APPLY JOB tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/job/application')
            .send({
                login_token: loginToken3,
                job_id: jobId2})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* APPLY JOB Login Token4 */
        it('APPLY JOB tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/job/application')
            .send({
                login_token: loginToken4,
                job_id: jobId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                console.log(res.body);
                res.body.status.should.equal('OK');
                done();
            });
        });

        it('FIND APPLICATION BY JOB ID', function (done) {
            var query = 'http://localhost:5000/api/v2/job/' + jobId + '?login_token=' + loginToken1 + '&admin_token=' + adminToken;
            
            agent.get( query)
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /*=================== FIND JOB LISTING BY COMPANY ID ===================*/
        it('FIND JOB LISTING BY COMPANY ID', function (done) {
            agent.get('http://localhost:5000/api/v2/page/ASE_SG')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                console.log(loginToken1 + ' / ' + adminToken);
                agent.post('http://localhost:5000/api/v2/company/jobs')
                .send({
                    login_token: loginToken1,
                    admin_token: adminToken,
                    page_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    console.log(res.body);
                    res.body.status.should.equal('OK');
                    done();
                });
            });      
        });

        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/eduardosaverin')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken1,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    connectId = res.body.data._id;
                    agent.post('http://localhost:5000/api/v2/login')
                    .send({ 
                        email: 'eduardosaverin@yahoo.com',                  
                        password: 'myl0v3',
                        rememberme: true})
                    .set('Accept', 'application/json')
                    .end(function (req, res) {
                        var loginToken = res.body.data.loginToken;
                        agent.put('http://localhost:5000/api/v2/connect')
                        .send({
                            login_token: loginToken,
                            connect_id: connectId
                        })
                        .set('Accept', 'application/json')
                        .end(function (req, res) {
                            res.body.status.should.equal('OK');
                            done();
                        });
                    });
                });
            });      
        });

        
    });

    
});

describe.skip('UserController', function () {
    
    describe('#signup()', function() {

        /* Test new user sign up */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'kabuky_knight@yahoo.com', 
                    username: 'kabuky', 
                    firstName: 'Anthony', 
                    lastName: 'Tran',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('kabuky_knight@yahoo.com');   
                    done();
                });      
        });

        /* Sign up with new email */
        it('SIGN UP: tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'tranhungnguyen@gmail.com', 
                    username: 'anthony', 
                    firstName: 'Smith', 
                    lastName: 'Johnson',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('tranhungnguyen@gmail.com');   
                    done();
                });      
        });

        /* Sign up with new email */
        it('Sign up with new email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'nonexistingemail@gmail.com', 
                    username: 'LydiaLucy', 
                    firstName: 'Lydia', 
                    lastName: 'Lucy',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.local.email.should.equal('nonexistingemail@gmail.com');   
                    done();
                });      
        });

        /* Sign up with existing email */
        it('Sign up with existing email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'kabuky_knight@yahoo.com', 
                    username: 'smith', 
                    firstName: 'Anthony', 
                    lastName: 'Tran',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('FAILED');
                    res.body.message.should.equal(constants.ERROR9000); 
                    done();
                });      
        });

        /* Sign up with invalid email */
        it('Sign up with invalid email', function (done) {
            agent.post('http://localhost:5000/api/v2/signup')
                .send({ email: 'kabuky_knightyahoocom', 
                    username: 'smith', 
                    firstName: 'Anthony', 
                    lastName: 'Tran',
                    password: 'myl0v3'})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('FAILED');
                    res.body.message.should.equal(constants.ERROR9005);
                    done();
                });      
        });

        

        
    });

    describe('#login()', function () {
        /* Test new user sign up with existing email */
        it('Log in user with given email', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'kabuky_knight@yahoo.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                loginToken = res.body.data.loginToken;
                res.body.status.should.equal('OK');
                done();
            });      
        });

        /* Log in with wrong password */
        it('Log in user with wrong password', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'kabuky_knight@yahoo.com',                  
                password: 'wrongpassword',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9008);
                done();
            });      
        });

        /* Log in with non existing email */
        it('Log in user with non-existing email', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'kabuky_nonexisting@yahoo.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9009);
                done();
            });      
        });

        
    });

    describe('#logout()', function () {
        /* Log out user with incorrect login token */
        it('Log out user with incorrect login token', function (done) {
            agent.post('http://localhost:5000/api/v2/logout')
            .send({ 
                loginToken: 'thisisaincorrectlogintoken'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9011);
                done();
            });      
        });

        /* Log out user with given login token */
        it('Log out user with given login token', function (done) {
            agent.post('http://localhost:5000/api/v2/logout')
            .send({ 
                loginToken: loginToken})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });      
        });
    });

    describe('#requestPasswordReset()', function () {
        /* Log out user with incorrect login token */
        it('Request Password Reset', function (done) {
            /* By default, mocha timeout is 2000ms. Increase the timeout interval as sending might take sometime */
            this.timeout(15000);
            agent.post('http://localhost:5000/api/v2/user/password/reset')
            .send({ 
                email: 'kabuky_knight@yahoo.com'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                userId      = res.body.data.userId;
                resetToken  = res.body.data.resetToken;
                done();
            });      
        });

        /* Reset With Same Password */
        it('Reset With Same Password', function (done) {
            //'http://' + req.headers.host + '/reset/'
            agent.post('http://localhost:5000/api/v2/recover/password').send({
                userId: userId,
                resetToken: resetToken,
                password: 'myl0v3',
                passwordConfirm: 'myl0v3'
            }).end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9013);
                done();
            });
        });

        /* Reset With Passwords don't match */
        it('Reset With Mismatched passwords', function (done) {
            //'http://' + req.headers.host + '/reset/'
            agent.post('http://localhost:5000/api/v2/recover/password').send({
                userId: userId,
                resetToken: resetToken,
                password: 'myl0v3',
                passwordConfirm: 'dontmatch'
            }).end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9014);
                done();
            });
        });

        /* Reset With Same Password */
        it('Reset With New Password', function (done) {
            //'http://' + req.headers.host + '/reset/'
            agent.post('http://localhost:5000/api/v2/recover/password').send({
                userId: userId,
                resetToken: resetToken,
                password: 'Hungnguy3n',
                passwordConfirm: 'Hungnguy3n'
            }).end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* Log in with old password */
        it('Log in user with old password', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'kabuky_knight@yahoo.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9008);
                done();
            });      
        });

        /* Log in with new password */
        it('Log in user with new password', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'kabuky_knight@yahoo.com',                  
                password: 'Hungnguy3n',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                loginToken = res.body.data.loginToken;
                userId = res.body.data._id;
                done();
            });      
        });

        /* Change password with invalid login token */
        it('Change Password with invalid login token', function (done) {
            agent.post('http://localhost:5000/api/v2/change/password')
            .send({ 
                userId: userId,
                loginToken: 'Thisisinvalidtoken',
                password: 'N3wW0r1d',
                passwordConfirm: 'N3wW0r1d'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9015);
                done();
            });      
        });

        /* Change password with invalid user id */
        it('Change Password with invalid user id', function (done) {
            agent.post('http://localhost:5000/api/v2/change/password')
            .send({ 
                userId: '53eba108dd9ce1ad0c487de8',
                loginToken: loginToken,
                password: 'N3wW0r1d',
                passwordConfirm: 'N3wW0r1d'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('FAILED');
                res.body.message.should.equal(constants.ERROR9015);
                done();
            });
        });

        /* Change password with invalid user id */
        it('Change Password', function (done) {
            agent.post('http://localhost:5000/api/v2/change/password')
            .send({ 
                userId: userId,
                loginToken: loginToken,
                password: 'N3wW0r1d',
                passwordConfirm: 'N3wW0r1d'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });      
        });
    });

    /*=================== TEST FOLLOW ===================*/
    describe('#follow', function () {
        /* Change password with invalid user id */
        it('Follow a user', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/anthony')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;

                agent.post('http://localhost:5000/api/v2/user/follow')
                .send({
                    login_token: loginToken,
                    user_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.user.id.should.equal(target);
                    done();
                });
            });      
        });

        it('Follow a user', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/LydiaLucy')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;

                agent.post('http://localhost:5000/api/v2/user/follow')
                .send({
                    login_token: loginToken,
                    user_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.user.id.should.equal(target);
                    done();
                });
            });      
        });

        var connectId;
        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/LydiaLucy')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                console.log(target);
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.target.should.equal(target);
                    connectId = res.body.data._id;
                    done();
                });
            });      
        });

        /* ====================== ACCEPT CONNECT REQUEST ================ */
        it('ACCEPT CONNECT REQUEST', function (done) {
            agent.put('http://localhost:5000/api/v2/connect')
            .send({
                login_token: loginToken,
                connect_id: connectId
            })
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* ====================== REMOVE CONNECT REQUEST ================ */
        it('ACCEPT CONNECT REQUEST', function (done) {
            agent.post('http://localhost:5000/api/v2/connect/remove')
            .send({
                login_token: loginToken,
                connect_id: connectId
            })
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        var connectAnthonyId;
        /* ====================== CONNECT USER ================ */
        it('CONNECT USER', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/anthony')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                console.log(target);
                agent.post('http://localhost:5000/api/v2/connect')
                .send({
                    login_token: loginToken,
                    target_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.target.should.equal(target);
                    connectAnthonyId = res.body.data._id;
                    done();
                });
            });      
        });

        /* ====================== IGNORE CONNECT REQUEST ================ */
        it('IGNORE CONNECT REQUEST', function (done) {
            agent.post('http://localhost:5000/api/v2/connect/ignore')
            .send({
                login_token: loginToken,
                connect_id: connectAnthonyId
            })
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });
    });

    /*=================== TEST UNFOLLOW ===================*/
    describe('#unfollow', function () {
        /* Change password with invalid user id */
        it('Unfollow a user', function (done) {
            agent.get('http://localhost:5000/api/v2/user/username/anthony')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;

                agent.post('http://localhost:5000/api/v2/user/unfollow')
                .send({
                    login_token: loginToken,
                    user_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.user.id.should.equal(target);
                    done();
                });
            });      
        });
    });

    /*=================== CREATE NEW PAGE ===================*/
    describe('#createNewPage', function () {
        var title = '';
        var content = '';
        it('Create New Page', function (done) {
            agent.post('http://localhost:5000/api/v2/page')
            .send({
                login_token: loginToken,
                name: 'ASE Singapore',
                username: 'ASE_SG',
                description: 'ASE Singapore Pte. Ltd. is one of the total test solutions providers in Singapore with the primary objective of providing a more integrated supply chain with real time services to meet customers’ needs of semiconductor packaging and testing in the ASEAN cluster.',
                website: 'http://www.aseglobal.com.sg',
                page_type: 'COMPANY'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.username.should.equal('ASE_SG');
                done();
            });      
        });
    });

    /*=================== TEST FOLLOW A PAGE ===================*/
    describe('#follow', function () {
        /* Change password with invalid user id */
        it('Follow a page', function (done) {
            agent.get('http://localhost:5000/api/v2/page/ASE_SG')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;

                agent.post('http://localhost:5000/api/v2/page/follow')
                .send({
                    login_token: loginToken,
                    page_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data._id.should.equal(target);
                    done();
                });
            });      
        });
    });

    /*=================== UNFOLLOW A PAGE ===================*/
    describe('#unfollow', function () {
        /* Change password with invalid user id */
        it('Unfollow a Page', function (done) {
            agent.get('http://localhost:5000/api/v2/page/ASE_SG')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;

                agent.post('http://localhost:5000/api/v2/page/unfollow')
                .send({
                    login_token: loginToken,
                    page_id: target
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data._id.should.equal(target);
                    done();
                });
            });      
        });
    });

    /*=================== POST NEW ARTICLE ===================*/
    describe('#postNewArticle', function () {
        /* Change password with invalid user id */
        var articleId;
        var commentId;
        it('Post New Article', function (done) {
            agent.post('http://localhost:5000/api/v2/article')
            .send({ 
                title: 'In America, Labor Is Friendless',
                login_token: loginToken,
                content: '<div id="articleBody"><p>I imagine that labor is feeling quite wistful about Labor Day 2014. It has been a while since labor, especially organized labor, has had much to celebrate. And the prospects going forward aren’t particularly bright.</p><p>Real wages for production and non-supervisory workers have declined since the mid-1970s.&nbsp; The share of jobs that are unionized has plummeted back almost to the level it was before 1935 when the National Labor Relations Act (NLRA) facilitated a huge increase in unionization.&nbsp; High unemployment has persisted in the jobless recovery. For those fortunate enough to have full time employment, job security is down, and pension and health benefits are shrinking. No trend for labor is positive.</p><p>Worse still, it is arguable that its longtime friend in Washington has abandoned traditional labor.&nbsp; Throughout most of the 20<sup>th</sup> century, labor could count on having the Democratic party squarely in its corner. President Roosevelt rode to the rescue of labor in 1935 with the NLRA to fight back against the corporations who were subjecting labor to hostile, dangerous, insecure and low-paying workplaces. Throughout most of the rest of the 20<sup>th</sup> century, a Democratic presidential hopeful could not dream of winning the party’s nomination without gaining the endorsement of the President of the AFL-CIO – who always had a key speaking role at the Democratic Convention.</p><p>Meanwhile, the Republican Party battled on behalf of capital, supporting right-to-work states, deregulating industries, and lowering tax rates.&nbsp; That was the 20<sup>th</sup> century alignment.</p><p>It began to change at the end of the 20<sup>th</sup> century. A key marker occurred in 1992 when President Bill Clinton signed into law a tax change that allowed only the first $1 million in CEO compensation to be deducted for corporate income tax purposes. It was supposed to discourage corporations from paying their CEOs more than what was then thought to be an excessive $1 million (imagine that!) – and failed spectacularly as they were given stock options instead, which made them wealthier than ever before.</p><p>But in whose favor was this measure intended? Labor?&nbsp; Hardly. There was no obvious benefit to them.&nbsp; Capital? Yes indeed. Shareholders were complaining about CEOs demanding ever-higher compensation – and the Democrats responded to help capital reign in CEO talent. Arguably the attention to the needs of capital has continued in the Obama administration. This administration featured enthusiastic embrace of the TARP bailouts of banks that protected their shareholders first and foremost and the continued low interest policies that favor capital owners.&nbsp; Of course, the argument can be made that these policies help labor too, by avoiding a recession/depression. But the careful attention to capital first is a relatively new behavior for the Democrats.</p><p>Meanwhile, the Republican Party has increasingly shifted its allegiance to high-end talent, a tiny offshoot of labor that began to emerge around 1960. &nbsp;&nbsp;During the Reagan era, for instance, they cut the top marginal income tax rate from 70% in 1980 to 50% just two years later. By 1988 it was 28%. In seven years, an executive earning a million-dollar salary went from keeping $340,000 after federal taxes to keeping $725,000. That’s quite a raise. (The marginal rate for labor — median-income families — fell only about 10% over the same time-span.)</p><p>Republicans have&nbsp;also defended private equity investment managers in maintaining the favorable capital gains treatment that their carried interest fees are accorded by the tax system.&nbsp; While hedge fund managers and the like are often seen as representatives of capital, in fact they ought to be considered high-end talent: their investor-customers are in fact the representatives of capital. The GOP&nbsp;even went as far as putting forward a card-carrying member of the high-end talent class, ex-strategy consultant and private equity manager Mitt Romney, as its Presidential candidate in 2012.</p><p>So in the modern economy, capital has the Democratic Party as its friend and high-end talent has the Republican Party as its new BFF.&nbsp; But who wakes up in the morning thinking first of labor, even Monday morning on Labor Day? Arguably it is no one. Labor is on its own politically in America in the 21<sup>st</sup> century – and that can’t feel too comforting.</p></div>',
                tags: ['economy' , 'american government', 'roger Martin', '  aMeriCan    goVernMent  ']})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.title.should.equal('In America, Labor Is Friendless');
                articleId = res.body.data._id;
                done();
            });
        });

        /* Edit article */
        it('Edit Article', function (done) {
            agent.put('http://localhost:5000/api/v2/article')
            .send({ 
                title: '(Edited) In America, Labor Is Friendless',
                login_token: loginToken,
                article_id: articleId,
                content: 'This is Edit Article',
                tags: ['New York' , 'Official Polistics', 'Adam Smoith', '  aMeriCan    goVernMent  ']})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.title.should.equal('(Edited) In America, Labor Is Friendless');
                done();
            });
        });

        /* =================== COMMENT ARTICLE ==================*/
        it('COMMENT ARTICLE', function (done) {
            var comment_content = 'This is an interesting article';
            agent.post('http://localhost:5000/api/v2/comment')
            .send({
                login_token: loginToken,
                article_id: articleId,
                comment_content: comment_content})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.content.should.equal(comment_content);
                commentId = res.body.data._id;
                done();
            });
        });

        /* =================== COMMENT ARTICLE ==================*/
        it('COMMENT ARTICLE', function (done) {
            var comment_content = 'This article is totally wrong';
            agent.post('http://localhost:5000/api/v2/comment')
            .send({
                login_token: loginToken,
                article_id: articleId,
                comment_content: comment_content})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.content.should.equal(comment_content);
                done();
            });
        });

        /* =================== EDIT COMMENT ==================*/
        it('EDIT COMMENT ARTICLE', function (done) {
            var comment_content = '(Edited) This is an interesting article';
            agent.put('http://localhost:5000/api/v2/comment')
            .send({
                login_token: loginToken,
                comment_id: commentId,
                comment_content: comment_content})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.content.should.equal(comment_content);
                done();
            });
        });

        /* =================== DELETE COMMENT ==================*/
        it('DELETE COMMENT', function (done) {
            agent.del('http://localhost:5000/api/v2/comment')
            .send({
                login_token: loginToken,
                comment_id: commentId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        var likeId;
        /* =================== LIKE ARTICLE ==================*/
        it('LIKE ARTICLE', function (done) {
            var comment_content = 'This article is totally wrong';
            agent.post('http://localhost:5000/api/v2/like')
            .send({
                login_token: loginToken,
                article_id: articleId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.parentId.should.equal(articleId);
                likeId = res.body.data._id;
                done();
            });
        });

        /* =================== UNLIKE ARTICLE ==================*/
        it('UNLIKE ARTICLE', function (done) {
            var comment_content = 'This article is totally wrong';
            agent.del('http://localhost:5000/api/v2/unlike')
            .send({
                login_token: loginToken,
                like_id: likeId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                console.log(res.body);
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* =================== CREATE READING LIST ==================*/
        var readingListId;
        it('CREATE NEW READING LIST', function (done) {
            var list_name = 'Entrepreneur Start Up';
            agent.post('http://localhost:5000/api/v2/readinglist')
            .send({
                login_token: loginToken,
                list_name: list_name,
                privacy: 'PUBLIC',
                description: 'This is description of new reading list.'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.name.should.equal(list_name);
                readingListId = res.body.data._id;
                done();
            });
        });

        /* =================== EDIT READING LIST ==================*/
        it('EDIT READING LIST', function (done) {
            var list_name = '(Edited) Entrepreneur Start Up';
            agent.put('http://localhost:5000/api/v2/readinglist')
            .send({
                login_token: loginToken,
                list_id: readingListId,
                list_name: list_name,
                privacy: 'PUBLIC',
                description: '(Edited) This is description of new reading list.'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.name.should.equal(list_name);
                done();
            });
        });

        /* =================== ADD ARTICLE TO READING LIST ==================*/
        it('ADD ARTICLE TO READING LIST', function (done) {
            agent.post('http://localhost:5000/api/v2/readinglist/add')
            .send({
                login_token: loginToken,
                list_id: readingListId,
                article_id: articleId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* =================== REMOVE ARTICLE FROM READING LIST ==================*/
        it('REMOVE ARTICLE FROM READING LIST', function (done) {
            agent.post('http://localhost:5000/api/v2/readinglist/remove')
            .send({
                login_token: loginToken,
                list_id: readingListId,
                article_id: articleId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        var educationId;
        /* ================== ADD EDUCATION ==================*/
        it('ADD EDUCATION', function (done) {
            agent.post('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken,
                school_name: 'Massachusetts Institue of Techonology (MIT)',
                school_id: null,
                degree: 'Bachelor of Science',
                study_field: 'Computer Science',
                date_started: {
                    day: 20,
                    month: 8,
                    year: 2009
                },
                date_ended: {
                    day: 20,
                    month: 5,
                    year: 2012
                },
                grade: 4.95,
                activities: 'Soccer, Teakwondo, Chess, Start-up, Entrepreneur',
                description: 'Education Description',
                education_level: 'Undergraduate'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                educationId = res.body.data._id;
                done();
            });
        });

        /* ================== EDIT EDUCATION ==================*/
        it('EDIT EDUCATION', function (done) {
            agent.put('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken,
                education_id: educationId,
                school_name: '(Edited) Massachusetts Institue of Techonology (MIT)',
                school_id: null,
                degree: '(Edited) Bachelor of Science',
                study_field: '(Edited) Computer Science',
                date_started: {
                    day: 4,
                    month: 3,
                    year: 2004
                },
                dateEnded: {
                    day: 4,
                    month: 3,
                    year: 2008
                },
                grade: 3.95,
                activities: '(Edited) Soccer, Teakwondo, Chess, Start-up, Entrepreneur',
                description: '(Edited) Education Description',
                education_level: 'Undergraduate'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /* ================== REMOVE EDUCATION ==================*/
        it('REMOVE EDUCATION', function (done) {
            agent.del('http://localhost:5000/api/v2/education')
            .send({
                login_token: loginToken,
                education_id: educationId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        var experienceId;
        /* ================== ADD EXPERIENCE ==================*/
        it('ADD EXPERIENCE', function (done) {
            var companyName = 'ASE Singapore';
            agent.post('http://localhost:5000/api/v2/experience')
            .send({
                login_token: loginToken,
                company_name: companyName,
                company_id: null,
                title: 'Analyst Programmer',
                location: 'Woodlands',
                is_working: true,
                date_started: {
                    day: 13,
                    month: 6,
                    year: 2012
                },
                description: 'Working under Test System group'})
            .set('Accept', 'application/json')
            .end(function (req, res) {

                res.body.status.should.equal('OK');
                res.body.data.companyName.should.equal(companyName);
                experienceId = res.body.data._id;
                done();
            });
        });

        /* ================== EDIT EDUCATION ==================*/
        it('EDIT EXPERIENCE', function (done) {
            var companyName = '(Edited) ASE Singapore';
            agent.put('http://localhost:5000/api/v2/experience')
            .send({
                login_token: loginToken,
                experience_id: experienceId,
                company_name: companyName,
                company_id: null,
                title: '(Edited) Analyst Programmer',
                location: '(Edited) Woodlands',
                is_working: true,
                date_started: {
                    day: 4,
                    month: 3,
                    year: 2004
                },
                date_ended: {
                    day: 4,
                    month: 3,
                    year: 2008
                },
                description: '(Edited) Working under Test System group'})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                res.body.data.companyName.should.equal(companyName);
                done();
            });
        });

        /* ================== REMOVE EDUCATION ==================*/
        it('REMOVE EXPERIENCE', function (done) {
            agent.del('http://localhost:5000/api/v2/experience')
            .send({
                login_token: loginToken,
                experience_id: experienceId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                done();
            });
        });

        /*=================== POST NEW JOB ===================*/
        var jobId;
        it('POST NEW JOB', function (done) {
            agent.get('http://localhost:5000/api/v2/page/ASE_SG')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                var target = res.body.data._id;
                var title = 'Software Engineer';
                agent.post('http://localhost:5000/api/v2/job')
                .send({
                    login_token: loginToken,
                    page_id: target,
                    title: title,
                    description: 'Description',
                    requirements: 'requirements',
                    industries: 'industries',
                    salary_min: 3000,
                    salary_max: 5000,
                    salary_currency: 'SGD',
                    experience_min: 2,
                    experience_max: 5,
                    perks: 'Perks',
                    quantity: 2,
                    location: 'Woodlands',
                    date_expire: '2015-09-23 23:59:59'
                })
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    res.body.data.title.should.equal(title);
                    jobId = res.body.data._id;
                    done();
                });
            });      
        });

        /*=================== APPLY JOB ===================*/
        var applicationId;
        it('APPLY JOB', function (done) {
            agent.post('http://localhost:5000/api/v2/job/application')
            .send({
                login_token: loginToken,
                job_id: jobId})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                res.body.status.should.equal('OK');
                applicationId = res.body.data._id;
                done();
            });    
        });

        /* Test new user sign up with existing email */
        var loginToken1;
        it('APPLY JOB tranhungnguyen@gmail.com', function (done) {
            agent.post('http://localhost:5000/api/v2/login')
            .send({ 
                email: 'tranhungnguyen@gmail.com',                  
                password: 'myl0v3',
                rememberme: true})
            .set('Accept', 'application/json')
            .end(function (req, res) {
                console.log(res.body);
                loginToken1 = res.body.data.loginToken;
                agent.post('http://localhost:5000/api/v2/job/application')
                .send({
                    login_token: loginToken1,
                    job_id: jobId})
                .set('Accept', 'application/json')
                .end(function (req, res) {
                    res.body.status.should.equal('OK');
                    applicationId = res.body.data._id;
                    done();
                });
            });      
        });

        /*=================== UNAPPLY JOB ===================*/
        // it('UNAPPLY JOB', function (done) {
        //     agent.del('http://localhost:5000/api/v2/job/application')
        //     .send({
        //         login_token: loginToken,
        //         application_id: applicationId})
        //     .set('Accept', 'application/json')
        //     .end(function (req, res) {
        //         console.log(res.body);
        //         res.body.status.should.equal('OK');
        //         done();
        //     });    
        // });
    });
});