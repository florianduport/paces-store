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
            	console.log("============callback1");
                callback(false);
            }
            
            //POUR CHAQUE SELLER => PAIEMENT 
        	var filter = {_id : { $in : req.session.shoppingcart}};
			ServiceHelper.getService('productList', 'getProductsByFilter', {data: {filter : filter, order : {}}, method : "POST"}, function(products){
				if(!products){
					console.log("============callback2");
					callback(false);
				}

				ServiceHelper.getService('order', 'createOrder', {data: {products : products, user : req.session.user}, method : "POST"}, function(order){ 
					if(!order){
						console.log("============callback3");
						callback(false);
					}
					else {
						var createdOrder = order;
						console.log("=====ORDER=======");
						console.log(order);
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
		         		console.log(lines);
		         		console.log("¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨");

		         		var sellers = [];
		         		for (var i = lines.length - 1; i >= 0; i--) {
		         			sellers.push(lines[i].seller);
		         		};

	         			ServiceHelper.getService("seller", "getSellersByUsername", {data : {sellers : sellers}, method: "POST"}, function(sellers){
	         				if(!sellers){
				        		console.log("FAIL TO GET SELLERS");
				        		callback(false);
				        	}
				        	else {
					            ServiceHelper.getService("payment", "payWithNewCard", {data : {
							 		user : user,  
							 		card : {
							 			cardNumber : req.body.cardNumber,
							 			cardExpirationDate : req.body.cardExpirationDateMonth+"/"+req.body.cardExpirationDateYear,
							 			cardCvx : req.body.cardCvx
							 		},
							 		lines : lines
							 	}, method: "POST"}, function(resp){
							 		if(!resp){
							 			console.log("FAIL TO PAY WITH NEW CARD");
				        				callback(false);
							 		}
						            console.log("/////////////////////////////////////////////////");
						            console.log("////// paywithnewcard");
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
							 			console.log("============callback");
										callback(model);
							 		});

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
		console.log("WAIT PAYMENT **********");
		console.log(req.params.orderId);
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