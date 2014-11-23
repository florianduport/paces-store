var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductListModel = {

	initialize : function(req, callback){
		var filter = {university : req.params.universityId};
		//console.log("universityId "+req.params.universityId)
		ServiceHelper.getService('productList', 'getProductsByFilter', {data: { filter : filter, order : "price", reversed : true}, method : "POST"}, function(products){
			
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