var model = require('../models/productlist.model').ProductListModel;

var ProductListController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	//res.send(model.products);
	        if(req.params.universityId !== undefined){
	        	res.cookie("current-university", req.params.universityId);
	    	}
	        res.render('pages/productList', {model: model});
	    });
	},

	initializeFilter : function(req, res){
		model.initializeFilter(req, function(model){
			if(req.params.universityId !== undefined){
	        	res.cookie("current-university", req.params.universityId);
	    	}
	        if(model.ajax == true){
				res.render('blocks/productListBlock', {model: model});
			} else {
				res.render('pages/productList', {model: model});
			}
		});
	}

};

module.exports.ProductListController = ProductListController;
