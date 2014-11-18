var model = require('../models/productlist.model').ProductListModel;

var ProductListController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	        
	    });
	}

};

module.exports.ProductListController = ProductListController;
