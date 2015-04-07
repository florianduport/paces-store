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
				model.req = req;
				model.callback = callback;
				ProductModel._getSeller(model, function(model){
					SchoolsHelper.loadSchool(model, { university : SchoolsHelper.loadUniversity(model.req)}, model.callback);
				});
			}
		});
	},

	_getSeller : function(model, callback){
		ServiceHelper.getService('seller', 'getSellerByUsername', {data: {"username" : product.seller}, method : "POST"}, function(seller){
			if(!seller)
				callback(false);
			else {
				model.seller = seller;
				ServiceHelper.getService('school', 'getSchoolByUrlId', {data: { universityId : model.seller.account.universityId }, method : "POST"}, function(university){
      				model.seller.account.university = university;
      				callback(model);
      			});

				
			}
		});
	},
};

module.exports.ProductModel = ProductModel;