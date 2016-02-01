var model = require('../models/product.model').ProductModel;

var ProductController = {

  initialize: function(req, res) {
    model.initialize(req, function(model) {
      res.render('pages/product', {
        model: model
      });
    });
  },

  rateProduct: function(req, res) {
    model.rateProduct(req, function(result) {
      res.send(result);
    });
  }

};

module.exports.ProductController = ProductController;
