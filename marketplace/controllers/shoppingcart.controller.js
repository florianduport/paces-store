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
	    model.addToShoppingCart(req, function(model){
	    	console.log("test"+model.articleCount);
	    	res.send(200, ""+model.articleCount);
	    });
	},

	removeFromShoppingCart : function(req, res){
	    model.removeFromShoppingCart(req, function(model){
	    	res.send("suppression ok");
	    });
	}

};

module.exports.ShoppingCartController = ShoppingCartController;

