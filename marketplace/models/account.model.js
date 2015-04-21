var ServiceHelper = require('../helpers/service.helper').ServiceHelper,
sha1 = require('sha1');

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

    createCustomer : function(form, req, done){

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
		    		done(response);
		    	});
    		}
    	});

    	

    }
};

module.exports.AccountModel = AccountModel;