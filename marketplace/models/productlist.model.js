var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductListModel = {

	initialize : function(req, callback){
		var filter = {city : "Paris"};
		ServiceHelper.getService('productList', 'getProductsByFilter', {data: { filter : filter, order : "price", reversed : true}, method : "POST"}, function(products){
			console.log(products);
			if(!products)
				callback(false);
			else {
				this.products = JSON.stringify(products);
				callback(this);
			}

		});
	}

};

module.exports.ProductListModel = ProductListModel;