var ServiceHelper = require('../helpers/service.helper').ServiceHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;

var ShoppingCartModel = {
    initialize: function (req, callback) {
        this.shoppingcartIds = req.session.shoppingcart !== undefined && req.session.shoppingcart.length > 0 ? req.session.shoppingcart : [];
        this.shoppingcart = {products: []};
        this.req = req;
        var filter = {_id: {$in: this.shoppingcartIds}};
        var model = this;
        ServiceHelper.getService('productList', 'getProductsByFilter', {data: {filter: filter, order: {}}, method: "POST"}, function (products) {
            if (!products) {
                callback(model);
            }
            else {
                model.shoppingcart.products = products
                model.shoppingcart.total = 0;
                for (var i = model.shoppingcart.products.length - 1; i >= 0; i--) {
                    model.shoppingcart.total = parseInt(model.shoppingcart.total) + parseInt(model.shoppingcart.products[i].price);
                }
                ;

                SchoolsHelper.loadSchool({model: model, filter: {university: SchoolsHelper.loadUniversity(req)}, callback: callback});
            }
        });
    },
    addToShoppingCart: function (req, callback) {
        this.articleCount = req.session.shoppingcart !== undefined ? req.session.shoppingcart.length : 0;
        var model = this;
        if (req.params !== undefined && req.params.product !== undefined && req.params.product !== "") {
            ServiceHelper.getService('product', 'getProductById', {data: {"productId": req.params.product}, method: "POST"}, function (product) {
                if (!product) {
                    callback(model);
                }
                else {
                    if (req.session.shoppingcart === undefined) {
                        req.session.shoppingcart = [];
                    }
                    if (req.session.shoppingcart.indexOf(req.params.product) == -1) {
                        req.session.shoppingcart.push(req.params.product);
                        model.articleCount = req.session.shoppingcart.length;
                        callback(model);
                    }
                    else {
                        callback(model);
                    }
                }
            });
        } else {
            callback(model);
        }
    },
    removeFromShoppingCart: function (req, res, callback) {
        if (req.params !== undefined && req.params.product !== undefined && req.params.product !== "") {
            if (req.session !== undefined && req.session.shoppingcart !== undefined && req.session.shoppingcart.length > 0 && req.session.shoppingcart.indexOf(req.params.product) != -1) {
                req.session.shoppingcart.splice(req.session.shoppingcart.indexOf(req.params.product), 1);
                if (req.cookies["cart-count"] !== undefined && req.cookies["cart-count"] > 0)
                    res.cookie("cart-count", req.cookies["cart-count"] - 1);
                callback(true);
            } else {
                callback(false);
            }
        }
        else {
            callback(false);
        }
    },
    removeAllFromShoppingCart: function (req, res, callback) {
        console.log("REMOVE ALL FROM SHOPPINGCART");
        if (req.session !== undefined && req.session.shoppingcart !== undefined && req.session.shoppingcart.length > 0) {
            console.log("REMOVE ALL FROM SHOPPINGCART");
            req.session.shoppingcart = [];
            res.cookie("cart-count", 0);
            callback(true);
        } else {
            callback(false);
        }
    },
    productCheckout: function (req, res, callback) {
        if (req.params !== undefined && req.params.product !== undefined && req.params.product !== "") {
            req.session.shoppingcart = [];
            req.session.shoppingcart.push(req.params.product);
            callback(true);
        }
        else {
            callback(false);
        }
    }
};

module.exports.ShoppingCartModel = ShoppingCartModel;