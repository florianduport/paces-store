var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductListModel = {

	initialize : function(req, callback){
		var filter = {name : "Produit de test 2"};
		ServiceHelper.getService('productList', 'getProductsByFilter', {data: { filter : filter}, method : "POST"}, function(products){
			console.log(products);
			if(!products)
				callback(false);
			else {
				this.products = products;
				callback(this);
			}

		});
	}

};

module.exports.ProductListModel = ProductListModel;