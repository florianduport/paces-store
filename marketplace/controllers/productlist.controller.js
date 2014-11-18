var model = require('../models/productlist.model').ProductListModel;

var ProductListController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	res.send(model.products);
	        //res.render('pages/productList', {model: model});
	    });
	}

};

module.exports.ProductListController = ProductListController;
