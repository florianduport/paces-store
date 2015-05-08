/**
 * Surcharge de la configuration en BDD
 * @class LocalConfig 
 */
var LocalConfig = {

	/**
	* Override attributes form db config here
	*/
	//pbligatoire
	database : {
		address : "mongodb://paces-store:Answer&&Pigeon2010@94.23.203.174:27017/paces-store"
	},
<<<<<<< HEAD
	addressBasePath : "http://localhost",
=======
	addressBasePath : "http://giantapp.fr",
>>>>>>> preprod
	hmacEnabled : false
	
};

module.exports.LocalConfig = LocalConfig;