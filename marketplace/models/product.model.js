var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductModel = {

	initialize : function(req, callback){

		ServiceHelper.getService('product', 'getProductById', {data: {"productId" : req.params.product}, method : "POST"}, function(product){
			if(!product)
				callback(false);
			else {
				this.product = product;
				var model = this;
				ProductModel.loadCategories(model, callback);

			}
		});
	},

	loadCategories : function(model, callback){
		ServiceHelper.getService('category', 'getCategories', {data: {}, method : "POST"}, function(categories){
			model.categories = categories;
			callback(model);
		});
	}

};

module.exports.ProductModel = ProductModel;