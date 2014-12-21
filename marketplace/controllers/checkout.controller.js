var model = require('../models/checkout.model').CheckoutModel;

var CheckoutController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	res.render("pages/checkout", {model : model});
	    });
	}, 
	payWithNewCard : function(req, res){
		model.payWithNewCard(req, function(model){
			if(!model){
				res.render('pages/checkout/error', {model: model});
			} else {
				res.redirect('/checkout/wait/'+model.orderId);
			}
		});
	},

	waitPayment : function(req, res){
		model.waitPayment(req, function(model){
			if(!model){
				res.render('pages/checkout/error', {model: model});
			}
			if(model.orderConfirmed){
				res.redirect('/checkout/success/'+model.orderId);
			} else {
				res.render('pages/checkout/wait', {model : model});
			}
		});
	},

	successPayment : function(req, res){
		model.successPayment(req, function(model){
			res.render('checkout/success', {model: model});
		});
	}

};

module.exports.CheckoutController = CheckoutController;

