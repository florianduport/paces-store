var ServiceHelper = require('../helpers/service.helper').ServiceHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;

var ProductModel = {
  initialize: function(req, callback) {

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
        model.callback = callback;
        model.user = req.session.user;
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
  },
  _getSeller: function(model, callback) {
    ServiceHelper.getService('seller', 'getSellerByUsername', {
      data: {
        "username": product.seller
      },
      method: "POST"
    }, function(seller) {
      if (!seller)
        callback(false);
      else {
        model.seller = seller;
        ServiceHelper.getService("order", "getCountBySeller", {
          data: {
            seller: req.session.seller
          },
          method: "POST"
        }, function(result) {
          if (!result)
            model.seller.sellCount = 0;
          else
            model.seller.sellCount = result.count;
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
        limit: 4
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
    }
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
  }
};

module.exports.ProductModel = ProductModel;
