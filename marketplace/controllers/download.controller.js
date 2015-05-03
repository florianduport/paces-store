var model = require('../models/download.model').DownloadModel;
var fs = require('fs');
var archiver = require('archiver');
var p = require('path');


var DownloadController = {

	checkDownload : function(req, res, next){
	    model.checkDownload(req, function(result){
	    	if(result){
	    		console.log("try to call next");
	    		next();
	    	} else {
	    		console.log("Check download failed");
	    		res.status(404);
	    		res.render('pages/error');
	    	}
	    });
	},

	downloadOrder : function(req, res){

		var archive = archiver('zip');

		archive.on('error', function(err) {
			console.log(err.message);
			//res.status(500).send({error: err.message});
		});


		model.downloadOrder(req, res, archive, function(archive){


			archive.finalize();

		});
	}

};

module.exports.DownloadController = DownloadController;

