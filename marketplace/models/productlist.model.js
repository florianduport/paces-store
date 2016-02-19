var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var ProductListModel = {

  defaultOrder: {
    order: "_id",
    reversed: true
  },

  initialize: function(req, callback) {
    this.position = req.session.position;
    var model = this;
    if (req.params.universityId !== undefined) {

      var filter = {
        university: req.params.universityId
      };
      ProductListModel.loadSchool(model, filter, ProductListModel.defaultOrder, callback);

    } else {
      model.universityName = "Tous les contenus";

      ProductListModel.loadProducts(model, {}, ProductListModel.defaultOrder, callback);
    }
  },

  initializeFilter: function(req, callback) {
    this.position = req.cookies.position;
    this.req = req;
    var model = this;
    model.ajax = req.body.ajax !== undefined && req.body.ajax == "true" ? true : false;

    if (req.body !== undefined && req.body.keywords !== undefined) {
      model.previousSearch = req.body.keywords;
    }

    var filter = ProductListModel._getFilter(this.req);

    var order = ProductListModel._getOrder(this.req);

    ProductListModel.loadSchool(model, filter, order, callback);

  },

  _getUniversityId: function(req) {
    var universityId;

    if (req.params.universityId !== undefined && req.params.universityId)
      universityId = req.params.universityId;
    else if (req.cookies.position !== undefined)
      universityId = req.cookies.position.universityId;
    else if (req.session.position !== undefined)
      universityId = req.session.position.universityId;
    else
      universityId = "all";

    return universityId;
  },

  _getOrder: function(req) {
    var order = {
      order: "_id",
      reversed: true
    };
    if (req.body.sort !== undefined) {
      if (req.body.sort == "priceDown")
        order = {
          order: "price",
          reversed: false
        };
      if (req.body.sort == "priceUp")
        order = {
          order: "price",
          reversed: true
        };
      if (req.body.sort == "dateDown")
        order = {
          order: "_id",
          reversed: true
        };
    }
    return order;
  },

  _getKeywords: function(req) {
    var keywords = "";
    if (req.body.keywords !== undefined && req.body.keywords.trim() !== "") {
      keywords = req.body.keywords.trim();
    }
    return keywords;
  },

  _getFilter: function(req) {
    var filter = {};

    var universityId = ProductListModel._getUniversityId(req);
    if (universityId !== undefined) {
      filter.university = universityId;
    }

    var keywords = ProductListModel._getKeywords(req);
    if (keywords !== undefined && keywords.length > 0) {
      filter["$text"] = {
        $search: keywords
      };
    }

    var categoriesText = req.body.categories;
    if (categoriesText !== undefined && categoriesText != "[]") {
      filter.categories = {
        $in: JSON.parse(categoriesText)
      };
    }
    return filter;
  },


  loadProducts: function(model, filter, order, callback) {
    ServiceHelper.getService('productList', 'getProductsByFilter', {
      data: {
        filter: filter,
        order: order
      },
      method: "POST"
    }, function(products) {

      if (!products)
        callback(false);
      else {
        model.products = products;
        ProductListModel.loadCategories(model, filter, function(model) {
          ProductListModel.loadSellers(model, callback);
        });
      }

    });
  },

  loadSchool: function(model, filter, order, callback) {
    ServiceHelper.getService('school', 'getSchoolByUrlId', {
      data: {
        universityId: filter.university
      },
      method: "POST"
    }, function(school) {
      model.universityName = school.name;
      model.currentSchool = school;
      ServiceHelper.getService('school', 'getSchools', {
        data: {},
        method: "POST"
      }, function(schools) {
        var otherSchools = [];
        for (var i = schools.length - 1; i >= 0; i--) {
          if (schools[i].name != model.currentSchool.name)
            otherSchools.push(schools[i]);
        };
        model.otherSchools = otherSchools;
        ProductListModel.loadProducts(model, filter, order, callback);
      });
    });
  },

  loadCategories: function(model, filter, callback) {
    ServiceHelper.getService('category', 'getCategories', {
      data: {},
      method: "POST"
    }, function(categories) {
      var categoriesList = [];
      var categoriesSpecifiquesList = [];

      var categoriesFilterList = "[";
      for (var i = categories.length - 1; i >= 0; i--) {
        categoriesFilterList += (i == categories.length - 1 ? "" : ",") + "\"" + (categories[i].shortName) + "\"";
      };
      categoriesFilterList += "]";

      var order = {
        order: "price",
        reversed: true
      };

      var filter = ProductListModel._getFilter(model.req);
      filter.categories = undefined;

      ServiceHelper.getService('productList', 'getProductsByFilter', {
        data: {
          filter: filter,
          order: order
        },
        method: "POST"
      }, function(products) {

        if (categories.length > 0) {
          for (var i = 0; i < categories.length; i++) {
            if (categories[i].isSpecific !== undefined && categories[i].isSpecific == true)
              categoriesSpecifiquesList.push(ProductListModel._getCategorieObject(model, categories[i], products));
            else
              categoriesList.push(ProductListModel._getCategorieObject(model, categories[i], products));
          };
        }
        model.categories = categoriesList;
        model.categoriesSpecifiques = categoriesSpecifiquesList;
        //ProductListModel.loadSellers(model, callback);
        callback(model);

      });
    });
  },

  loadSellers: function(model, callback) {
    var products = model.products;
    var sellersList = [];
    for (var i = products.length - 1; i >= 0; i--) {
      sellersList.push(products[i].seller);
    };
    ServiceHelper.getService('seller', 'getSellersByUsername', {
      data: {
        sellers: sellersList
      },
      method: "POST"
    }, function(sellers) {
      if (sellers) {
        for (var i = sellers.length - 1; i >= 0; i--) {
          for (var j = model.products.length - 1; j >= 0; j--) {
            if (model.products[j].seller == sellers[i].username) {
              model.products[j].sellerInfos = sellers[i].account;
            }
          };
        };
      }
      callback(model);
    });
  },

  _getCategorieObject: function(model, category, products) {
    var categoryObject = {
      category: category,
      count: 0
    };
    if (model.req !== undefined && model.req.body !== undefined && model.req.body.categories !== undefined && model.req.body.categories.indexOf(category.shortName) > -1) {
      categoryObject.isChecked = "checked";
    } else
      categoryObject.isChecked = "";
    for (var i = products.length - 1; i >= 0; i--) {
      if (products[i].categories !== undefined && products[i].categories.indexOf(category.shortName) > -1) {
        categoryObject.count++;
      }
    };
    return categoryObject;
  }

};

module.exports.ProductListModel = ProductListModel;
