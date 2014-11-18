var model = require('../models/account.model').AccountModel;

var AccountController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	/*if(!model)
	    		res.redirect(301, '/'+req.params.appId+'/error');
	    	else
	        	res.render(model.type+'/pages/articles', {model: model});*/
	    });
	}

};

module.exports.AccountController = AccountController;

