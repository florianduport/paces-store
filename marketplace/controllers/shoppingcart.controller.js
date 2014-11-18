var model = require('../models/shoppingcart.model').ShoppingCartModel;

var ShoppingCartController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	res.send(req.session.shoppingcart);
	    	/*if(!model)
	    		res.redirect(301, '/'+req.params.appId+'/error');
	    	else
	        	res.render(model.type+'/pages/articles', {model: model});*/
	    });
	},

	addToShoppingCart : function(req, res){
	    model.initialize(req, function(model){
	    	req.session.shoppingcart = "1";
	    	res.send("ajout ok");
	    	/*if(!model)
	    		res.redirect(301, '/'+req.params.appId+'/error');
	    	else
	        	res.render(model.type+'/pages/articles', {model: model});*/
	    });
	},

	removeFromShoppingCart : function(req, res){
	    model.initialize(req, function(model){
	    	/*if(!model)
	    		res.redirect(301, '/'+req.params.appId+'/error');
	    	else
	        	res.render(model.type+'/pages/articles', {model: model});*/
	    });
	}

};

module.exports.ShoppingCartController = ShoppingCartController;

