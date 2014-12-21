var Base = require('../base/base.routes').BaseRoutes,
OrderService = require('./order.service').OrderService,
LoggerService = require('../logger/logger.service').LoggerService,
HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service Payment
 * @class CustomerRoutes
 */
var OrderRoutes = {

    Base : Base,

    /**
    * loadRoutes : Charge les routes dans Express pour les rendre accessible
    * @param app : l'application express
    * @param configuration : la configuration de l'application (contient le chemin de l'url)
    */
    loadRoutes : function(app, configuration){

    	// authenticate customer : /customer/authenticateCustomer
    
    	app.post(configuration.routes.order.getOrderById, HmacHelper.verifyRequest, function(req, res){
    		//check parameters
            if(req.body === undefined || !req.body || req.body.orderId === undefined){
    			LoggerService.logError("services", "Wrong payment create wallet parameters", {orderId : req.body.orderId !== undefined ? req.body.orderId : ""});
                console.log("wrong parameters for getOrderById");
    			Base.send(req, res, false);
    		}
    
    		OrderService.getOrderById(req.body.orderId, function(result){
    			Base.send(req, res, result);
    		});
    	});

        app.post(configuration.routes.order.createOrder, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.products === undefined || req.body.user === undefined){
                LoggerService.logError("services", "Wrong payment create wallet parameters", {products : req.body.products !== undefined ? req.body.products : ""});
                console.log("wrong parameters for createOrder");
                Base.send(req, res, false);
            }
    
            OrderService.createOrder(req.body.products, req.body.user, function(result){
                Base.send(req, res, result);
            });
        });

        app.post(configuration.routes.order.updateOrder, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.order === undefined){
                LoggerService.logError("services", "Wrong payment create wallet parameters", {order : req.body.order !== undefined ? req.body.order : ""});
                console.log("wrong parameters for updateOrder");
                Base.send(req, res, false);
            }
    
            OrderService.updateOrder(req.body.order, function(result){
                Base.send(req, res, result);
            });
        });

    }
    
};

module.exports.OrderRoutes = OrderRoutes;