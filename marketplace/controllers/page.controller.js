var model = require('../models/page.model').PageModel;

var PageController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    });
	},

	initializeError : function(req, res){
		model.initializeError(req, function(model){
	        res.render(model.type+"/error", {model: model});
	    });
	}

};

module.exports.PageController = PageController;

