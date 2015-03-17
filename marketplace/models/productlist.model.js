var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductListModel = {

	defaultOrder : { order : "_id", reversed: true},

	initialize : function(req, callback){
		this.position = req.session.position;
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
		this.position = req.cookies.position;
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

		var universityId;
		if(req.cookies.position !== undefined)
			universityId = req.cookies.position.universityId;
		else if(req.cookies.position !== undefined)
			universityId = req.session.position.universityId;

		if(req.params.universityId !== undefined && req.params.universityId == "all") {
			model.universityName = "Tous les contenus";
			if(req.body.categories !== undefined && req.body.categories != "[]"){
				var filter = { categories : {$in: JSON.parse(req.body.categories)}};
			}
			ProductListModel.loadProducts(model, {}, order, callback);
		} else if(universityId !== undefined){

			var filter = {university : universityId};
			if(req.body.categories !== undefined && req.body.categories != "[]"){
				filter.categories = {$in: JSON.parse(req.body.categories)};
			}
			ProductListModel.loadSchool(model, filter, order, callback);
			
		} else {
			model.universityName = "Tous les contenus";
			if(req.body.categories !== undefined && req.body.categories != "[]"){
				var filter = { categories : {$in: JSON.parse(req.body.categories)} };
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
			model.currentSchool = school;
			ServiceHelper.getService('school', 'getSchools', {data: {}, method : "POST"}, function(schools){
				var otherSchools = [];
				for (var i = schools.length - 1; i >= 0; i--) {
					if(schools[i].name != model.currentSchool.name)
						otherSchools.push(schools[i]);
				};
				model.otherSchools = otherSchools;
				ProductListModel.loadProducts(model, filter, order, callback);
			});
		});
	},

	loadCategories : function(model, filter, callback){
		ServiceHelper.getService('category', 'getCategories', {data: {}, method : "POST"}, function(categories){
			var categoriesList = [];
			var categoriesSpecifiquesList = [];

			if(categories.length > 0){
				for (var i = 0; i < categories.length; i++) {
					if(categories[i].isSpecific !== undefined && categories[i].isSpecific == true)
						categoriesSpecifiquesList.push(_getCategorieObject(model,categories[i]));
					else
						categoriesList.push(_getCategorieObject(model,categories[i]));
				};
			}

			model.categories = categoriesList;
			model.categoriesSpecifiques = categoriesSpecifiquesList;
			callback(model);
		});
	},

	_getCategorieObject : function(model, category){
		var categoryObject = {category : category, count : 0};
		for (var i = model.products.length - 1; i >= 0; i--) {
			if(model.products[i].indexOf(category) != -1){
				categoryObject.count++;
			}
		};
		return categoryObject;
	}

};

module.exports.ProductListModel = ProductListModel;