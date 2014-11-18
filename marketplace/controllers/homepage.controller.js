var model = require('../models/homepage.model').HomepageModel;

var HomepageController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	//res.send(200, "ok");
	       	res.render('pages/homepage', {model: model});
	    });
	}

};

module.exports.HomepageController = HomepageController;

