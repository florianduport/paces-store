var Base = require('../base/base.routes').BaseRoutes,
ProductListService = require('./productList.service').ProductListService,
LoggerService = require('../logger/logger.service').LoggerService,
HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service Product
 * @class ProductRoutes
 */
var ProductListRoutes = {

    Base : Base,

    /**
    * loadRoutes : Charge les routes dans Express pour les rendre accessible
    * @param app : l'application express
    * @param configuration : la configuration de l'application (contient le chemin de l'url)
    */
    loadRoutes : function(app, configuration){

    	// get product list
    
    	app.post(configuration.routes.productList.getProductsByFilter, HmacHelper.verifyRequest, function(req, res){
            
    		//check parameters
            if( req.body === undefined || !req.body || 
                req.body.filter === undefined || !req.body.filter || 
                req.body.order === undefined || !req.body.order){
    			LoggerService.logError("services", "Wrong get product list parameters", {});
    			Base.send(req, res, false);
    		}
            else {
        		ProductListService.getProductsByFilter(req.body.filter, req.body.order, function(result){
        			Base.send(req, res, result);
        		});
            }   
    	});
    	
    }
    
};

module.exports.ProductListRoutes = ProductListRoutes;