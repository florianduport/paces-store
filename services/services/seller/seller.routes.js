var Base = require('../base/base.routes').BaseRoutes,
SellerService = require('./seller.service').SellerService,
LoggerService = require('../logger/logger.service').LoggerService,
HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service Seller
 * @class SellerRoutes
 */
var SellerRoutes = {

    Base : Base,

    /**
    * loadRoutes : Charge les routes dans Express pour les rendre accessible
    * @param app : l'application express
    * @param configuration : la configuration de l'application (contient le chemin de l'url)
    */
    loadRoutes : function(app, configuration){

    	// authenticate Seller : /seller/authenticateSeller
    
    	app.post(configuration.routes.seller.authenticateSeller, HmacHelper.verifyRequest, function(req, res){
    		//check parameters
            if(req.body === undefined || !req.body || req.body.username === undefined || !req.body.username || req.body.password === undefined || !req.body.password){
    			LoggerService.logError("services", "Wrong Seller authenticate parameters", {username : req.body.username !== undefined ? req.body.username : ""});
    			Base.send(req, res, false);
    		}
    
    		SellerService.authenticateSeller(req.body.username, req.body.password, function(result){
    			Base.send(req, res, result);
    		});
    	});

        // get Seller by username : /seller/getByUsername

        app.post(configuration.routes.seller.getSellerByUsername, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.username === undefined || !req.body.username){
                LoggerService.logError("services", "Wrong Seller get by username parameters", {});
                Base.send(req, res, false);
            }
            SellerService.getSellerByUsername(req.body.username, function(result){
                Base.send(req, res, result);
            });
        });

        // get Sellers by username : /seller/getSellersByUsername

        app.post(configuration.routes.seller.getSellersByUsername, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.sellers === undefined){
                LoggerService.logError("services", "Wrong Sellers get by username parameters", {});
                Base.send(req, res, false);
            }
            SellerService.getSellersByUsername(req.body.sellers, function(result){
                Base.send(req, res, result);
            });
        });

        //create : /seller/create
        app.post(configuration.routes.seller.createSeller, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || 
                req.body.username === undefined || !req.body.username || 
                req.body.password === undefined || !req.body.password || 
                req.body.confirmedPassword === undefined || !req.body.confirmedPassword ||
                req.body.firstName === undefined || !req.body.firstName ||
                req.body.lastName === undefined || !req.body.lastName){
                LoggerService.logError("services", "Wrong create Seller parameters", {});
                Base.send(req, res, false);
            }
            SellerService.createSeller(req.body.username, req.body.password, req.body.confirmedPassword, req.body.firstName, req.body.lastName, function(result){
                Base.send(req, res, result);
            });
        });

        // update : /seller/update

        app.post(configuration.routes.seller.updateSeller, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.username === undefined || !req.body.username || req.body.account === undefined || !req.body.account){
                LoggerService.logError("services", "Wrong update Seller parameters", {});
                Base.send(req, res, false);
            }
            SellerService.updateSeller(req.body.username, req.body.account, function(result){
                Base.send(req, res, result);
            });
        });
    	
    }
    
};

module.exports.SellerRoutes = SellerRoutes;