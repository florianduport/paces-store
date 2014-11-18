var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductListModel = {

	initialize : function(req, callback){
		/*this.appId = req.params.appId;

		ServiceHelper.getService('application', 'getPage', {data: {"appId" : this.appId, "page" : req.params.page}, method : "POST"}, function(page){
			if(!page)
				callback(false);
			else {
				this.page = page;
				this.navigation = page.navigation;
				callback(this);
			}
		})*/
	}

};

module.exports.ProductListModel = ProductListModel;