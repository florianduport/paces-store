var ServiceHelper = require('../helpers/service.helper').ServiceHelper,
MailHelper = require('../helpers/mail.helper').MailHelper,
sha1 = require('sha1');
var ConfigurationHelper = require('../helpers/configuration.helper').ConfigurationHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;

var AccountModel = {

	initialize : function(req, callback){

	    //récupérer toutes les infos du menu
		/*ServiceHelper.getService('application', 'getNavigation', {data: {"appId" : appId}, method : "POST"}, function(navigation){
			this.navigation = navigation;
			callback(this);
		});*/
	},

    displaySignIn : function(req, callback){
        var model = this;
        model.req = req;
        model.displayCheckoutSteps = false;
        if(req.get('referer') !== undefined && req.get('referer').indexOf("checkout") > -1){
            model.displayCheckoutSteps = true;
        }
        SchoolsHelper.loadSchool({model : model, callback : function(model){
            if(req.session.error)
            model.error = req.session.error;
            else
                model.error = false;
            callback(model);
        }});
    },

    displaySignUp : function(req, callback){
        var model = this;
        model.req = req;

        SchoolsHelper.loadSchool({model : model, callback : function(model){
            if(req.session.error)
            model.error = req.session.error;
            else
                model.error = false;
            callback(model);
        }});
    },

    signIn : function(username, password, req, done){


        ServiceHelper.getService("customer", "authenticateCustomer", {data : {username : username, password : sha1(password)}, method: "POST"}, function(resp){
            if(resp === undefined || !resp || resp !== true)
            {
                req.session.error = true;
                return done(false);
            }
            req.session.error = false;
            req.session.user = username;

            return done(true);
        });

    },

    signUp : function(req, done){
        if(req.body !== undefined &&
            req.body.firstName !== undefined &&
            req.body.lastName !== undefined &&
            req.body.username !== undefined &&
            req.body.password !== undefined &&
            req.body.passwordConfirmation !== undefined &&
            req.body.passwordConfirmation == req.body.password){

            AccountModel.createCustomer({
                username : req.body.username,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                password : req.body.password
            }, req, done);

        } else {
            done(false);
        }

    },

    createCustomer : function(form, req, done){
        ConfigurationHelper.getConfig({application: 'marketplace', done: function (configuration) {
            var bannedDomains = configuration.mail.bannedDomains;
            var domainToCheck = form.username.split("@")[1];
            var isBannedDomain = false;
            for (var i = bannedDomains.length - 1; i >= 0; i--) {
                if(bannedDomains[i] == domainToCheck)
                    isBannedDomain = true;
            };

            if(isBannedDomain){
                done(false);
            } else {
                ServiceHelper.getService("customer", "getCustomerByUsername", {data : {
                    username : form.username
                }, method : "POST"}, function(response){
                    if(response){
                        //Customer already exist !
                        done(false);
                    } else {
                        ServiceHelper.getService("payment", "createWallet", {data : {
                            infos : {
                                username : form.username,
                                firstName : form.firstName,
                                lastName : form.lastName
                            }
                        }, method : "POST"}, function(paymentInfos){
                            if(paymentInfos === undefined){
                                done(false);
                            } else {
                                ServiceHelper.getService("customer", "createCustomer", {data : {
                                    username : form.username,
                                    password : sha1(form.password),
                                    firstName : form.firstName,
                                    lastName : form.lastName,
                                    paymentInfos : {
                                        accountId : paymentInfos.user.Id,
                                        walletId : paymentInfos.wallet.Id
                                    }
                                }, method : "POST"}, function(response){

                                    MailHelper.subscribe(form);
                                    done(response);
                                });
                            }
                        });
                    }
                });
            }
        }});
    },

    displayForgottenPassword : function(req, callback){
        var model = this;
        callback(model);
    },

    forgottenPassword : function(req, callback){
        var model = this;
        model.isPostForm = true;


        //check if customer exists
        if(req.body.username !== undefined){
            //console.log(req.body.username);
           ServiceHelper.getService("customer", "getFullCustomerByUsername", {data : {
                    username : req.body.username
                }, method : "POST"}, function(user){
                if(user){
                   //create token :
                   var token = Math.floor((Math.random() * 1000000) + 1);
                   var userId = user["_id"];
                   //console.log(userId);
                   //attach token to user (with lifetime)
                    ServiceHelper.getService("customer", "createForgottenPasswordToken", {data : {
                        username : req.body.username,
                        token : token
                    }, method : "POST"}, function(response){
                        if(response){

                            var changePasswordLink = "/changePassword/"+userId+"/"+token;

                            //sends email
                            MailHelper.changePasswordEmail({
                                email : req.body.username,
                                changePasswordLink : changePasswordLink
                            });


                            callback(model);

                        }
                    });
                }
            });
        } else {
            callback(false);
        }
    },

    displayChangePassword : function(req, callback){
        var model = this;
        if(req.params.userId !== undefined && req.params.token !== undefined){

            //check if token is valid
            ServiceHelper.getService("customer", "getCustomerById", {data : {
                userId : req.params.userId
            }, method : "POST"}, function(customer){

                if(customer === undefined || !customer ||
                    customer.changePasswordToken === undefined || !customer.changePasswordToken){
                    //console.log("here");
                    callback(false);
                } else {
                    var nowTimestamp = new Date();
                    var expirationDate = new Date(customer.changePasswordToken.expirationDate * 1000);
                    if(nowTimestamp < expirationDate && customer.changePasswordToken.token == req.params.token) {
                        model.username = customer.username;
                        callback(model);
                    } else {
                        callback(false);
                    }
                }

            });
        } else {
            callback(false);
        }
    },

    changePassword : function(req, callback){
        var model = this;
        if(req.body.newPassword !== undefined){

            //check if token is valid
            ServiceHelper.getService("customer", "changePassword", {data : {
                username : req.body.username,
                newPassword : req.body.newPassword
            }, method : "POST"}, function(result){

                callback(true);

            });
        } else {
            callback(false);
        }
    }

};

module.exports.AccountModel = AccountModel;
