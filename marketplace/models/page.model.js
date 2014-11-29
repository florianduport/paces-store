var Geocoder = require('node-geocoder').getGeocoder("openstreetmap", "http", {});
var IpGeocoder = require('node-geocoder').getGeocoder("freegeoip", "http", {});
var Geolib = require('geolib');
ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var PageModel = {

	initialize : function(req, callback){
		this.appId = req.params.appId;
		callback(false);
		/*ServiceHelper.getService('application', 'getPage', {data: {"appId" : this.appId, "page" : req.params.page}, method : "POST"}, function(page){
			if(!page)
				callback(false);
			else {
				this.page = page;
				this.navigation = page.navigation;
				callback(this);
			}
		})*/
	},

	initializeError : function(req, callback){
		this.appId = req.params.appId;

		ServiceHelper.getService('application', 'getApplicationType', {data: {"appId" : this.appId}, method : "POST"}, function(type){
			if(type === false)
				callback(false);
			this.type = type;
			callback(this);
		})
	},

	initializeGeoloc : function(req, callback){

		this.loadPosition(req, this, function(model){
			callback(model);
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
	}
};

module.exports.PageModel = PageModel;