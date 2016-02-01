var model = require('../models/shoppingcart.model').ShoppingCartModel;

var ShoppingCartController = {

  initialize: function(req, res) {
    model.initialize(req, function(model) {
      if (req.body.ajax)
        res.render("pages/shoppingcart", {
          layout: false,
          model: model
        });
      else
        res.render("pages/shoppingcart", {
          model: model
        });
    });
  },

  addToShoppingCart: function(req, res) {
    model.addToShoppingCart(req, function(model) {
      console.log("test" + model.articleCount);
      res.send(200, "" + model.articleCount);
    });
  },

  removeFromShoppingCart: function(req, res) {
    model.removeFromShoppingCart(req, res, function(model) {
      res.send("suppression ok");
    });
  },

  productCheckout: function(req, res) {
    model.productCheckout(req, res, function(model) {
      res.send("ok");
    });
  }

};

module.exports.ShoppingCartController = ShoppingCartController;
