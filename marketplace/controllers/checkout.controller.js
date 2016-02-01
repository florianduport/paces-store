var model = require('../models/checkout.model').CheckoutModel;

var CheckoutController = {

  initialize: function(req, res) {
    if (req.session.shoppingcart === undefined || req.session.shoppingcart.length == 0) {
      res.redirect('/');
    } else {

      model.initialize(req, function(model) {
        res.render("pages/checkout", {
          model: model
        });
      });
    }
  },
  payWithNewCard: function(req, res) {
    if (req.body.number && req.body.expiry && req.body.cvc && req.body.name) {
      model.payWithNewCard(req, function(model) {
        if (!model) {
          res.render('pages/checkout/error', {
            model: model
          });
        } else {
          res.redirect('/checkout/wait/' + model.orderId);
        }
      });
    } else {
      res.redirect('/checkout');
    }
  },

  waitPayment: function(req, res) {
    model.waitPayment(req, function(model) {
      if (!model) {
        res.render('pages/checkout/error', {
          model: model
        });
      }
      if (model.orderConfirmed) {
        res.redirect('/checkout/success/' + model.orderId);
      } else {
        res.render('pages/checkout/wait', {
          model: model
        });
      }
    });
  },

  successPayment: function(req, res) {
    model.successPayment(req, function(model) {
      res.render('pages/checkout/success', {
        model: model
      });
    });
  }

};

module.exports.CheckoutController = CheckoutController;
