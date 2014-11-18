var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductModel = {

	initialize : function(req, callback){

		ServiceHelper.getService('product', 'getProductById', {data: {"productId" : req.params.product}, method : "POST"}, function(product){
			if(!product)
				callback(false);
			else {
				this.product = product;
				callback(this);
			}
		});
	}

};

module.exports.ProductModel = ProductModel;