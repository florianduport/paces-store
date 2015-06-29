var ServiceHelper = require('../helpers/service.helper').ServiceHelper,
MailHelper = require('../helpers/mail.helper').MailHelper,
sha1 = require('sha1');
var ConfigurationHelper = require('../helpers/configuration.helper').ConfigurationHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;

var SellerModel = {

    displaySellerHome : function(req, callback){
        var model = this;
        ServiceHelper.getService("seller", "getSellerByUsername", {data : { username : req.session.seller }, method : "POST"}, function(seller){

            model.seller = seller;
                
            ServiceHelper.getService("order", "getCountBySeller", {data : { seller : req.session.seller }, method : "POST"}, function(result){
                if(!result)
                    model.seller.sellCount = 0;
                else
                    model.seller.sellCount = result.count;

                ServiceHelper.getService("payment", "getWalletInfos", {data : { paymentInfos : model.seller.account.paymentInfos }, method : "POST"}, function(walletInfos){
                    if(walletInfos)
                       model.seller.sellBalance = walletInfos[0].Balance.Amount;
                    callback(model);
                });

            });

        });
    },

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
        callback(model);
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


        ServiceHelper.getService("seller", "authenticateSeller", {data : {username : username, password : sha1(password)}, method: "POST"}, function(resp){
            if(resp === undefined || !resp || resp !== true)
            {
                req.session.error = true;
                return done(false);
            }
            req.session.error = false;
            req.session.seller = username;

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

            AccountModel.createseller({
                username : req.body.username,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                password : req.body.password
            }, req, done);

        } else {
            done(false);
        }

    },

    createseller : function(form, req, done){
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
                ServiceHelper.getService("seller", "getSellerByUsername", {data : {
                    username : form.username
                }, method : "POST"}, function(response){
                    if(response){
                        //seller already exist ! 
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
                                ServiceHelper.getService("seller", "createSeller", {data : {
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


        //check if seller exists
        if(req.body.username !== undefined){
            console.log(req.body.username);
           ServiceHelper.getService("seller", "getFullSellerByUsername", {data : {
                    username : req.body.username
                }, method : "POST"}, function(user){
                if(user){
                   //create token : 
                   var token = Math.floor((Math.random() * 1000000) + 1);
                   var userId = user["_id"];
                   console.log(userId);
                   //attach token to user (with lifetime)
                    ServiceHelper.getService("seller", "createForgottenPasswordToken", {data : {
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
            ServiceHelper.getService("seller", "getSellerById", {data : {
                userId : req.params.userId
            }, method : "POST"}, function(seller){ 

                if(seller === undefined || !seller || 
                    seller.changePasswordToken === undefined || !seller.changePasswordToken){
                    console.log("here");
                    callback(false);
                } else {
                    var nowTimestamp = new Date();
                    var expirationDate = new Date(seller.changePasswordToken.expirationDate * 1000);
                    if(nowTimestamp < expirationDate && seller.changePasswordToken.token == req.params.token) {
                        model.username = seller.username;
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
            ServiceHelper.getService("seller", "changePassword", {data : {
                username : req.body.username,
                newPassword : req.body.newPassword
            }, method : "POST"}, function(result){ 

                callback(true);

            });
        } else {
            callback(false);
        }
    },

    displayProducts : function(req, callback){
        var filter = {
            seller : req.session.seller
        };
        var model = this;
        ServiceHelper.getService('productList', 'getProductsByFilter', {data: {filter : filter, order : {}}, method : "POST"}, function(products){
            
            ServiceHelper.getService("seller", "getSellerByUsername", {data : { username : req.session.seller } }, function(seller){

                model.products = products;
                for (var i = model.products.length - 1; i >= 0; i--) {
                    model.products[i].sellerInfos = seller.account;
                };
                callback(model);
            });
        });
    },

    editProduct : function(req, callback){
        var model = this;
        ServiceHelper.getService('product', 'getProductById', {data: {"productId" : req.params.product}, method : "POST"}, function(product){
            model.product = product;
            SellerModel._loadProductFormInfos(model, function(model){
                callback(model);
            });
        });
    },

    addProduct : function(req, callback){
        this.product = {};
        SellerModel._loadProductFormInfos(this, function(model){
            callback(model);
        });
    },

    _loadProductFormInfos : function(model, callback){

        ServiceHelper.getService('school', 'getSchools', {data: {}, method : "POST"}, function(schools){
            model.schools = schools;
            for (var i = model.schools.length - 1; i >= 0; i--) {
                model.schools[i].selected = model.product.university == model.schools[i].universityId;
            };
            ServiceHelper.getService('category', 'getCategories', {data: {}, method : "POST"}, function(categories){
                model.categories = categories;
                for (var i = model.categories.length - 1; i >= 0; i--) {
                    model.categories[i].selected= model.product.categories !== undefined && model.product.categories.indexOf(model.categories[i].shortName) > -1;
                };
                callback(model);
            });

        });
    }

};

module.exports.SellerModel = SellerModel;