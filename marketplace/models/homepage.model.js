var Geocoder = require('node-geocoder').getGeocoder("openstreetmap", "http", {});
var IpGeocoder = require('node-geocoder').getGeocoder("freegeoip", "http", {});
var Geolib = require('geolib');
ServiceHelper = require('../helpers/service.helper').ServiceHelper;
cookieParser = require('cookie-parser')

var HomepageModel = {

	initialize : function(req, res, callback){
    	this.position = req.session.position;
		var model = this;
		ServiceHelper.getService('school', 'getSchools', {data: {}, method : "POST"}, function(schools){
			
			if(!schools)
				callback(false);
			else {
				model.loadSchool(req, schools, model, function(model){
					if(model.position.city === undefined || model.position.city === ""){
						model.position.city = model.school.city;
					}
					callback(model);
				});
			}
		});
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