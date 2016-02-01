var ServiceHelper = require('../helpers/service.helper').ServiceHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;
var ProductListModel = require('./productlist.model').ProductListModel;

var ProductModel = {
initialize: function(req, callback) {
  var model = this;
  model.req = req;
  ProductListModel.loadCategories(model, {}, function(modelLIst) {
    ServiceHelper.getService('product', 'getProductById', {
      data: {
        "productId": req.params.product
      },
      method: "POST"
    }, function(product) {
      if (!product)
        callback(false);
      else {
        this.product = product;
        var model = this;
        model.req = req;
        model.categories = modelLIst.categories;
        model.categoriesSpecifiques = modelLIst.categoriesSpecifiques;
        model.callback = callback;
        ProductModel._getSeller(model, function(model) {
          SchoolsHelper.loadSchool({
            model: model,
            filter: {
              university: SchoolsHelper.loadUniversity(model.req)
            },
            callback: model.callback
          });
        });
      }
    });
  });

  ServiceHelper.getService('school', 'getSchoolByUrlId', {
    data: {
      universityId: model.seller.account.universityId
    },
    method: "POST"
  }, function(university) {
    model.seller.account.university = university;
    ProductModel._getOtherProducts(model, function(model) {
      callback(model);
    });
  });


}
});
},
_getOtherProducts: function(model, callback) {
    var filter = {};
    filter.university = ProductModel._getUniversityId(model.req);
    filter.categories = {
      $in: model.product.categories
    };

    var order = ProductModel._getOrder(model.req);
    ServiceHelper.getService('productList', 'getProductsByFilter', {
      data: {
        filter: filter,
        order: order,
        limit: 3
      },
      method: "POST"
    }, function(products) {
      if (products) {
        model.products = products;
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
      }
    });
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
    return order;
  },
  rateProduct: function(req, callback) {
    if (req.body === undefined && req.body.rateValue === undefined && req.params.product !== undefined) {
      callback(false);
    } << << << < HEAD
    var rateValue = req.body.rateValue;

    ServiceHelper.getService('product', 'rateProduct', {
      data: {
        "productId": req.params.product,
        "rateValue": rateValue
      },
      method: "POST"
    }, function(result) {
      callback(result);
    });
  } === === =
  /*loadCategories : function(model, filter, callback){
          ServiceHelper.getService('category', 'getCategories', {data: {}, method : "POST"}, function(categories){
                  var categoriesList = [];
                  var categoriesSpecifiquesList = [];

                  var categoriesFilterList = "[";
                  for (var i = categories.length - 1; i >= 0; i--) {
                          categoriesFilterList +=  (i == categories.length - 1 ? "" : ",")+"\""+(categories[i].shortName)+"\"";
                  };
                  categoriesFilterList += "]";

                  var order = {order : "price", reversed : true};

                  var filter = ProductListModel._getFilter(model.req);
                  filter.categories = undefined;

                  ServiceHelper.getService('productList', 'getProductsByFilter', {data: {filter : filter, order : order}, method : "POST"}, function(products){

                          if(categories.length > 0){
                                  for (var i = 0; i < categories.length; i++) {
                                          if(categories[i].isSpecific !== undefined && categories[i].isSpecific == true)
                                                  categoriesSpecifiquesList.push(ProductListModel._getCategorieObject(model,categories[i], products));
                                          else
                                                  categoriesList.push(ProductListModel._getCategorieObject(model,categories[i], products));
                                  };
                          }
                          model.categories = categoriesList;
                          model.categoriesSpecifiques = categoriesSpecifiquesList;
                          ProductListModel.loadSellers(model, callback);

                  });
          });
  }*/
  >>> >>> > 2 a5e55f00a263cff2d0bc66e73738a45372006fd
};

module.exports.ProductModel = ProductModel;
