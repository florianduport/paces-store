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

        //Create product

        app.post(configuration.routes.product.createProduct, HmacHelper.verifyRequest, function(req, res){

            //check parameters
            if(req.body === undefined || !req.body || 
                req.body.name === undefined || !req.body.name ||
                req.body.description === undefined || !req.body.description ||
                req.body.price === undefined || !req.body.price ||
                req.body.university === undefined || !req.body.university ||
                req.body.categories === undefined || !req.body.categories ||
                req.body.seller === undefined || !req.body.seller){
                LoggerService.logError("services", "Wrong create product parameters", {});
                Base.send(req, res, false);
            }
            else {
                ProductService.createProduct(req.body.name, 
                                            req.body.description, 
                                            req.body.price,
                                            req.body.university,
                                            req.body.categories,
                                            req.body.seller,
                                             function(result){
                    Base.send(req, res, result);
                });
            }
        });

        //update product

        app.post(configuration.routes.product.updateProduct, HmacHelper.verifyRequest, function(req, res){

            //check parameters
            if(req.body === undefined || !req.body ||
                req.body.id === undefined || !req.body.id || 
                req.body.name === undefined || !req.body.name ||
                req.body.description === undefined || !req.body.description ||
                req.body.price === undefined || !req.body.price ||
                req.body.university === undefined || !req.body.university||
                req.body.categories === undefined || !req.body.categories){
                LoggerService.logError("services", "Wrong update product parameters", {});
                Base.send(req, res, false);
            }
            else {

                ProductService.updateProduct(req.body.id,
                                            req.body.name, 
                                            req.body.description, 
                                            req.body.price,
                                            req.body.university,
                                            req.body.categories,
                                             function(result){
                    Base.send(req, res, result);
                });
            }
        });

        app.post(configuration.routes.product.rateProduct, HmacHelper.verifyRequest, function(req, res){

            //check parameters
            if(req.body === undefined || !req.body ||
                req.body.productId === undefined || !req.body.productId || 
                req.body.rateValue === undefined || !req.body.rateValue ){
                LoggerService.logError("services", "Wrong rate product parameters", {});
                Base.send(req, res, false);
            }
            else {
                ProductService.rateProduct(req.body.productId,
                                            req.body.rateValue,
                                             function(result){
                    Base.send(req, res, result);
                });
            }
        });

        /*
        app.post(configuration.routes.product.createProduct, HmacHelper.verifyRequest, function(req, res){

            //check parameters
            if(req.body === undefined || !req.body || 
                req.body.name === undefined || !req.body.name ||
                req.body.description === undefined || !req.body.description ||
                req.body.price === undefined || !req.body.price ||
                req.body.city === undefined || !req.body.city ||
                req.body.seller === undefined || !req.body.seller){
                LoggerService.logError("services", "Wrong create product parameters", {});
                Base.send(req, res, false);
            }
            else {
                ProductService.createProduct(req.body.name, 
                                            req.body.description, 
                                            req.body.price,
                                            req.body.city,
                                            req.body.seller,
                                             function(result){
                    Base.send(req, res, result);
                });
            }
        });
*/

    }
    
};

module.exports.ProductRoutes = ProductRoutes;