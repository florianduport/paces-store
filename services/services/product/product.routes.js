var Base = require('../base/base.routes').BaseRoutes,
ProductService = require('./product.service').ProductService,
LoggerService = require('../logger/logger.service').LoggerService,
HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service Product
 * @class ProductRoutes
 */
var ProductRoutes = {

    Base : Base,

    /**
    * loadRoutes : Charge les routes dans Express pour les rendre accessible
    * @param app : l'application express
    * @param configuration : la configuration de l'application (contient le chemin de l'url)
    */
    loadRoutes : function(app, configuration){

    	// get product
    
    	app.post(configuration.routes.product.getProductById, HmacHelper.verifyRequest, function(req, res){

    		//check parameters
            if(req.body === undefined || !req.body || req.body.productId === undefined || !req.body.productId){
    			LoggerService.logError("services", "Wrong get product parameters", {});
    			Base.send(req, res, false);
    		}
            else {
        		ProductService.getProductById(req.body.productId, function(result){
        			Base.send(req, res, result);
        		});
            }
    	});
    	
    }
    
};

module.exports.ProductRoutes = ProductRoutes;