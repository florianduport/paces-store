var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ShoppingCartModel = {

	initialize : function(req, callback){

	    //récupérer toutes les infos du menu
		/*ServiceHelper.getService('application', 'getNavigation', {data: {"appId" : appId}, method : "POST"}, function(navigation){
			this.navigation = navigation;
			callback(this);
		});*/
	}
};

module.exports.ShoppingCartModel = ShoppingCartModel;