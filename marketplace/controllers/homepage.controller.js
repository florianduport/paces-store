var model = require('../models/homepage.model').HomepageModel;

var HomepageController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	res.cookie("position", model.position);
	       	res.render('pages/homepage', {model: model});
	    });
	}

};

module.exports.HomepageController = HomepageController;

