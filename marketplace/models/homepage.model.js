var Geocoder = require('node-geocoder').getGeocoder("openstreetmap", "http", {});
var IpGeocoder = require('node-geocoder').getGeocoder("freegeoip", "http", {});
ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var HomepageModel = {

	initialize : function(req, callback){

		
		if(req.cookies.position !== undefined){
			//Si on a une position dans les cookies => on l'utilise

			if(req.cookies.position.isNew !== undefined && req.cookies.position.isNew && !req.cookies.position.isAlreadyCalculated){
				//Si l'utilisateur vient de mettre à jour sa géoloc => on recharge la Ville
				Geocoder.reverse(req.cookies.position.latitude, req.cookies.position.longitude, function(err, res) {
					if(!err && res !== undefined && res.length > 0){
						this.position = req.cookies.position;
						this.position.isNew = false;
    					this.position.city = res[0].city;
    					this.position.latitude = req.cookies.position.latitude;
    					this.position.longitude = req.cookies.position.longitude;
    					this.position.isAlreadyCalculated = true;
    				}
    				callback(this);	
				});
			} else {
				this.position = req.cookies.position;
				callback(this);	
			}
		} else {
			//Sinon on géolocalise par l'IP

			//tips to debug
			var remoteAddress = req.socket.remoteAddress == "127.0.0.1" ? "88.121.230.3" : req.socket.remoteAddress;

			IpGeocoder.geocode(remoteAddress, function(err, res){
				if(!err && res !== undefined && res.length > 0){
					this.position = {};
					this.position.latitude = res[0].latitude;
					this.position.longitude = res[0].longitude;
					this.position.city = res[0].city;
					this.position.isNew = false;
					this.position.isAlreadyCalculated = false;
				}
				callback(this);
			});
		}
	}
};

module.exports.HomepageModel = HomepageModel;