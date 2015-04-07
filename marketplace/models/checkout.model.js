var ServiceHelper = require('../helpers/service.helper').ServiceHelper;

var CheckoutModel = {

	initialize : function(req, callback){
		callback(this);
	},

	payWithNewCard : function(req, callback){
		var model = this;
		ServiceHelper.getService("customer", "getCustomerByUsername", {data : {username : req.session.user}, method: "POST"}, function(user){
            if(user === undefined || !user)
            {
                callback(false);
            }
            
            //POUR CHAQUE SELLER => PAIEMENT 
        	var filter = {_id : { $in : req.session.shoppingcart}};
			ServiceHelper.getService('productList', 'getProductsByFilter', {data: {filter : filter, order : {}}, method : "POST"}, function(products){
				if(!products){
					callback(false);
				}

				ServiceHelper.getService('order', 'createOrder', {data: {products : products, user : req.session.user}, method : "POST"}, function(order){ 
					if(!order){
						callback(false);
					}
					else {
						var createdOrder = order;
						model.orderId = order._id;

		         		var lines = [];
		         		for (var i = products.length - 1; i >= 0; i--) {

		         			var lineIndex = -1;
		         			for (var j = lines.length - 1; j >= 0; j--) {
		         				if(lines[j].seller == products[i].seller){
		         					lineIndex = j;
		         				}
		         			};

		         			if(lineIndex == -1){
		         				lines.push({seller : products[i].seller, amount : products[i].price});
		         			} else {
		         				lines[lineIndex].amount = lines[lineIndex].amount+products[i].price;
		         			}
		         		};

		         		var sellers = [];
		         		for (var i = lines.length - 1; i >= 0; i--) {
		         			sellers.push(lines[i].seller);
		         		};

	         			ServiceHelper.getService("seller", "getSellersByUsername", {data : {sellers : sellers}, method: "POST"}, function(sellers){
	         				if(!sellers){
	         					console.log("FAAAAAAAAIL");
				        		callback(false);
				        	}
				        	else {
					            ServiceHelper.getService("payment", "payWithNewCard", {data : {
							 		user : user,  
							 		card : {
							 			cardNumber : req.body.number.replace(/ /g, ""),
							 			cardExpirationDate : req.body.expiry.replace(/ /g, "").replace("/", ""),
							 			cardCvx : req.body.cvc.replace(/ /g, "")
							 		},
							 		sellers : sellers,
							 		lines : lines
							 	}, method: "POST"}, function(resp){
							 		console.log("msg received");
							 		console.log("resp :");
							 		console.log(resp);
							 		if(!resp){
				        				callback(false);
							 		}
							 		else {
								 		//MAJ ORDER STATE
								 		if(order.linesConfirmed === undefined)
								 			order.linesConfirmed = 0;

								 		order.linesConfirmed = order.linesConfirmed +1;

								 		if(order.linesConfirmed == lines.length) {
								 			order.orderConfirmed = true;
								 		} 
								 		console.log(order.linesConfirmed);
								 		console.log(order.orderConfirmed);
								 		ServiceHelper.getService('order', 'updateOrder', {data: {order : createdOrder}, method : "POST"}, function(orderModified){ 
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

	waitPayment : function(req, callback){
		var model = this;
		ServiceHelper.getService('order', 'getOrderById', {data: {orderId : req.params.orderId}, method : "POST"}, function(order){
			model.orderId = order._id;
			model.orderConfirmed = order.orderConfirmed;

			callback(model);
		});
	},

	successPayment : function(req, callback){
		callback(this);
	}
};

module.exports.CheckoutModel = CheckoutModel;