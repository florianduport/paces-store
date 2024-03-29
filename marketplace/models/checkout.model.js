var ServiceHelper = require('../helpers/service.helper').ServiceHelper;
var MailHelper = require('../helpers/mail.helper').MailHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;

var CheckoutModel = {
  initialize: function(req, callback) {

    /*var model = this;
     model.req = req;
     SchoolsHelper.loadSchool({model : model, callback : function(model){
     callback(model);
     }});*/

    this.shoppingcartIds = req.session.shoppingcart !== undefined && req.session.shoppingcart.length > 0 ? req.session.shoppingcart : [];
    this.shoppingcart = {
      products: []
    };
    this.req = req;
    var filter = {
      _id: {
        $in: this.shoppingcartIds
      }
    };
    var model = this;
    model.user = req.session.user;
    ServiceHelper.getService('productList', 'getProductsByFilter', {
      data: {
        filter: filter,
        order: {}
      },
      method: "POST"
    }, function(products) {
      if (!products) {
        callback(model);
      } else {
        model.shoppingcart.products = products;
        model.shoppingcart.total = 0;
        for (var i = model.shoppingcart.products.length - 1; i >= 0; i--) {
          model.shoppingcart.total = parseFloat(model.shoppingcart.total) + parseFloat(model.shoppingcart.products[i].price);
        }

        SchoolsHelper.loadSchool({
          model: model,
          callback: function(model) {
            callback(model);
          }
        });
      }
    });
  },
  payWithNewCard: function(req, callback) {
    var model = this;
    model.user = req.session.user;
    ServiceHelper.getService("customer", "getCustomerByUsername", {
      data: {
        username: req.session.user
      },
      method: "POST"
    }, function(user) {
      if (user === undefined || !user) {
        callback(false);
      }

      //POUR CHAQUE SELLER => PAIEMENT
      var filter = {
        _id: {
          $in: req.session.shoppingcart
        }
      };
      ServiceHelper.getService('productList', 'getProductsByFilter', {
        data: {
          filter: filter,
          order: {}
        },
        method: "POST"
      }, function(products) {
        if (!products) {
          callback(false);
        }

        ServiceHelper.getService('order', 'createOrder', {
          data: {
            products: products,
            user: req.session.user
          },
          method: "POST"
        }, function(order) {
          if (!order) {
            callback(false);
          } else {
            var createdOrder = order;
            model.orderId = order._id;

            var lines = [];
            for (var i = products.length - 1; i >= 0; i--) {

              var lineIndex = -1;
              for (var j = lines.length - 1; j >= 0; j--) {
                if (lines[j].seller == products[i].seller) {
                  lineIndex = j;
                }
              };

              if (lineIndex == -1) {
                lines.push({
                  seller: products[i].seller,
                  amount: products[i].price
                });
              } else {
                lines[lineIndex].amount = lines[lineIndex].amount + products[i].price;
              }
            };

            var sellers = [];
            for (var i = lines.length - 1; i >= 0; i--) {
              sellers.push(lines[i].seller);
            };

            ServiceHelper.getService("seller", "getSellersByUsername", {
              data: {
                sellers: sellers
              },
              method: "POST"
            }, function(sellers) {
              if (!sellers) {

                callback(false);
              } else {
                ServiceHelper.getService("payment", "payWithNewCard", {
                  data: {
                    user: user,
                    card: {
                      cardNumber: req.body.number.replace(/ /g, ""),
                      cardExpirationDate: req.body.expiry.replace(/ /g, "").replace("/", ""),
                      cardCvx: req.body.cvc.replace(/ /g, "")
                    },
                    sellers: sellers,
                    lines: lines
                  },
                  method: "POST"
                }, function(resp) {

                  if (!resp) {
                    callback(false);
                  } else {
                    //MAJ ORDER STATE
                    if (order.linesConfirmed === undefined)
                      order.linesConfirmed = 0;

                    order.linesConfirmed = order.linesConfirmed + 1;
                    order.downloadCount = 0;

                    if (order.linesConfirmed == lines.length) {
                      order.orderConfirmed = true;
                    }
                    ServiceHelper.getService('order', 'updateOrder', {
                      data: {
                        order: createdOrder
                      },
                      method: "POST"
                    }, function(orderModified) {
                      MailHelper.orderConfirm({
                        email: req.session.user,
                        orderId: order["_id"]
                      });
                      callback(model);
                    });
                  }
                });
              }
            });
          }
        });
      });
    });

  },
  waitPayment: function(req, callback) {
    var model = this;
    ServiceHelper.getService('order', 'getOrderById', {
      data: {
        orderId: req.params.orderId
      },
      method: "POST"
    }, function(order) {
      model.orderId = order._id;
      model.orderConfirmed = order.orderConfirmed;

      callback(model);
    });
  },
  successPayment: function(req, callback) {
    var model = this;
    model.email = req.session.user;
    model.orderId = req.params.orderId;
    callback(this);
  }
};

module.exports.CheckoutModel = CheckoutModel;
