var model = require('../models/page.model').PageModel;

var PageController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	if(model == false){
	    		res.status(404);
	    		res.render('error');
	    	}
	    });
	},

	initializeError : function(req, res){
		model.initializeError(req, function(model){
	        res.render(model.type+"/error", {model: model});
	    });
	},

	initializeGeoloc : function(req, res, next){
	    model.initializeGeoloc(req, function(model){
	    	res.cookie("position", model.position);
	    	req.session.position = model.position;
	    	next();
	    });
	}

};

module.exports.PageController = PageController;

