var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductListModel = {

	defaultOrder : { order : "_id", reversed: true},

	initialize : function(req, callback){
		var model = this;
		if(req.params.universityId !== undefined){

			var filter = {university : req.params.universityId};
			ProductListModel.loadSchool(model, filter, ProductListModel.defaultOrder, callback);
			
		} else {
			model.universityName = "Tous les contenus";

			ProductListModel.loadProducts(model, {}, ProductListModel.defaultOrder, callback);
		}
	},

	initializeFilter : function(req, callback){
		var model = this;
		model.ajax = req.body.ajax !== undefined && req.body.ajax == "true" ? true : false;

		var order = {order : "price", reversed : true};
		if(req.body.sort !== undefined){
			if(req.body.sort == "priceDown")
				order = {order : "price", reversed : false};
			if(req.body.sort == "priceUp")
				order = {order : "price", reversed : true};
			if(req.body.sort == "dateDown")
				order = {order : "_id", reversed : true};
		}
		if(req.params.universityId !== undefined){

			var filter = {university : req.params.universityId};
			if(req.body.category !== undefined){
				filter.categories = req.body.category;
			}
			ProductListModel.loadSchool(model, filter, order, callback);
			
		} else {
			model.universityName = "Tous les contenus";
			if(req.body.category !== undefined){
				var filter = { categories : req.body.category };
			}
			ProductListModel.loadProducts(model, {}, order, callback);
		}
	},

	loadProducts : function(model, filter, order, callback){
		ServiceHelper.getService('productList', 'getProductsByFilter', {data: { filter : filter, order : order}, method : "POST"}, function(products){
			
			if(!products)
				callback(false);
			else {
				model.products = products;
				ProductListModel.loadCategories(model, filter, callback);
			}

		});	
	},

	loadSchool : function(model, filter, order, callback){
		ServiceHelper.getService('school', 'getSchoolByUrlId', {data: { universityId : filter.university }, method : "POST"}, function(school){
			model.universityName = school.name;
			ProductListModel.loadProducts(model, filter, order, callback);
		});
	},

	loadCategories : function(model, filter, callback){
		ServiceHelper.getService('category', 'getCategories', {data: {}, method : "POST"}, function(categories){
			model.categories = categories;
			callback(model);
		});
	}

};

module.exports.ProductListModel = ProductListModel;