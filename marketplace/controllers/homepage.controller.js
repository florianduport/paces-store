var model = require('../models/homepage.model').HomepageModel;

var HomepageController = {

	initialize : function(req, res){
	    model.initialize(req, res, function(model){
	    	res.render('pages/homepage', {model: model});
	    });
	}

};

module.exports.HomepageController = HomepageController;

