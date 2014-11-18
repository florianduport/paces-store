var model = require('../models/product.model').ProductModel;

var ProductController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	res.render('pages/product', {model: model});
	    });
	}

};

module.exports.ProductController = ProductController;

