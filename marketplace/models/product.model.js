var ServiceHelper = require('../helpers/service.helper').ServiceHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;

var ProductModel = {

	initialize : function(req, callback){

		ServiceHelper.getService('product', 'getProductById', {data: {"productId" : req.params.product}, method : "POST"}, function(product){
			if(!product)
				callback(false);
			else {
				this.product = product;
				var model = this;

				SchoolsHelper.loadSchool(model, { university : SchoolsHelper.loadUniversity(req)}, callback);
			}
		});
	}


};

module.exports.ProductModel = ProductModel;