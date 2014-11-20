var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ShoppingCartModel = {

	initialize : function(req, callback){
		callback(this);
	    //récupérer toutes les infos du menu
		/*ServiceHelper.getService('application', 'getNavigation', {data: {"appId" : appId}, method : "POST"}, function(navigation){
			this.navigation = navigation;
			callback(this);
		});*/
	},
	addToShoppingCart : function(req, callback){
		if(req.params !== undefined && req.params.product !== undefined && req.params.product !== ""){
			ServiceHelper.getService('product', 'getProductById', {data: {"productId" : req.params.product}, method : "POST"}, function(product){
				if(!product)
					callback(false);
				else {
					if(req.session.shoppingcart === undefined){
						req.session.shoppingcart = [];
					}
					if(req.session.shoppingcart.indexOf(req.params.product) == -1){
						req.session.shoppingcart.push(req.params.product);
						callback(true);
					} 
					else {
						callback(false);
					}
				}
			});
		} else {
			callback(false);
		} 
	},
	removeFromShoppingCart : function(req, callback){
		console.log(req.session.shoppingcart);
		console.log("ok");
		if(req.params !== undefined && req.params.product !== undefined && req.params.product !== ""){
			if(req.session !== undefined  && req.session.shoppingcart !== undefined && req.session.shoppingcart.length > 0 && req.session.shoppingcart.indexOf(req.params.product) != -1){
				req.session.shoppingcart.splice(req.session.shoppingcart.indexOf(req.params.product), 1);
				callback(true);
			} else {
				callback(false);
			}
		}
		else{
			callback(false);
		}
	}
};

module.exports.ShoppingCartModel = ShoppingCartModel;