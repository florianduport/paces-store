var Geocoder = require('node-geocoder').getGeocoder("openstreetmap", "http", {});
var IpGeocoder = require('node-geocoder').getGeocoder("freegeoip", "http", {});
var Geolib = require('geolib');
ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var HomepageModel = {

	initialize : function(req, callback){

		this.loadPosition(req, this, function(model){
			ServiceHelper.getService('school', 'getSchools', {data: {}, method : "POST"}, function(schools){
			
				if(!schools)
					callback(false);
				else {
					model.loadSchool(req, schools, model, function(model){
						callback(model);
					});
				}

			});
		});
		
	},

	loadPosition : function(req, model, callback){

		if(req.cookies.position !== undefined){
			//Si on a une position dans les cookies => on l'utilise

			if(req.cookies.position.isNew !== undefined && req.cookies.position.isNew && !req.cookies.position.isAlreadyCalculated){
				//Si l'utilisateur vient de mettre à jour sa géoloc => on recharge la Ville
				Geocoder.reverse(req.cookies.position.latitude, req.cookies.position.longitude, function(err, res) {
					if(!err && res !== undefined && res.length > 0){
						console.log("city : ");
						model.position = req.cookies.position;
						model.position.isNew = false;
    					model.position.city = res[0].city !== undefined ? res[0].city : model.position.city;
    					model.position.latitude = req.cookies.position.latitude;
    					model.position.longitude = req.cookies.position.longitude;
    					model.position.isAlreadyCalculated = true;
    				}
    				callback(model);	
				});
			} else {
				model.position = req.cookies.position;
				callback(model);	
			}
		} else {
			//Sinon on géolocalise par l'IP

			//tips to debug
			var remoteAddress = req.socket.remoteAddress == "127.0.0.1" ? "88.121.230.3" : req.socket.remoteAddress;

			IpGeocoder.geocode(remoteAddress, function(err, res){
				if(!err && res !== undefined && res.length > 0){
					model.position = {};
					model.position.latitude = res[0].latitude;
					model.position.longitude = res[0].longitude;
					model.position.city = res[0].city;
					model.position.isNew = false;
					model.position.isAlreadyCalculated = false;
				}
				callback(model);
			});
		}
	},

	loadSchool : function(req, schools, model, callback){
		var schoolIndex = schools.length - 1;
		var schoolDistance = 0;

		for (var i = schools.length - 1; i >= 0; i--) {
			var distance = Geolib.getDistance({
				latitude : model.position.latitude,
				longitude : model.position.longitude
			}, {
				latitude : schools[i].latitude,
				longitude : schools[i].longitude
			});
			if(distance <= schoolDistance || i == schools.length - 1){
				schoolIndex = i;
				schoolDistance = distance;
			}
		}

		model.school = schools[schoolIndex];
		callback(model);
	}
};

module.exports.HomepageModel = HomepageModel;