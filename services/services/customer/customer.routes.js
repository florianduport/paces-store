var Base = require('../base/base.routes').BaseRoutes,
CustomerService = require('./customer.service').CustomerService,
LoggerService = require('../logger/logger.service').LoggerService,
HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service Customer
 * @class CustomerRoutes
 */
var CustomerRoutes = {

    Base : Base,

    /**
    * loadRoutes : Charge les routes dans Express pour les rendre accessible
    * @param app : l'application express
    * @param configuration : la configuration de l'application (contient le chemin de l'url)
    */
    loadRoutes : function(app, configuration){

    	// authenticate customer : /customer/authenticateCustomer
    
    	app.post(configuration.routes.customer.authenticateCustomer, HmacHelper.verifyRequest, function(req, res){
    		//check parameters
            if(req.body === undefined || !req.body || req.body.username === undefined || !req.body.username || req.body.password === undefined || !req.body.password){
    			LoggerService.logError("services", "Wrong customer authenticate parameters", {username : req.body.username !== undefined ? req.body.username : ""});
    			Base.send(req, res, false);
    		}
    
    		CustomerService.authenticateCustomer(req.body.username, req.body.password, function(result){
    			Base.send(req, res, result);
    		});
    	});

        // get customer by username : /customer/getByUsername

        app.post(configuration.routes.customer.getCustomerByUsername, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.username === undefined || !req.body.username){
                LoggerService.logError("services", "Wrong customer get by username parameters", {});
                Base.send(req, res, false);
            }
            CustomerService.getCustomerByUsername(req.body.username, function(result){
                Base.send(req, res, result);
            });
        });
        app.post(configuration.routes.customer.getFullCustomerByUsername, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.username === undefined || !req.body.username){
                LoggerService.logError("services", "Wrong customer get full by username parameters", {});
                Base.send(req, res, false);
            }
            CustomerService.getFullCustomerByUsername(req.body.username, function(result){
                Base.send(req, res, result);
            });
        });

        // get customer by username : /customer/getById

        app.post(configuration.routes.customer.getCustomerById, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.userId === undefined || !req.body.userId){
                LoggerService.logError("services", "Wrong customer get by id parameters", {});
                Base.send(req, res, false);
            }
            CustomerService.getCustomerById(req.body.userId, function(result){
                Base.send(req, res, result);
            });
        });

        //create : /customer/create
        app.post(configuration.routes.customer.createCustomer, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || 
                req.body.username === undefined || !req.body.username || 
                req.body.password === undefined || !req.body.password || 
                req.body.firstName === undefined || !req.body.firstName ||
                req.body.lastName === undefined || !req.body.lastName ||
                req.body.paymentInfos === undefined){
                LoggerService.logError("services", "Wrong create customer parameters", {});
                Base.send(req, res, false);
            }
            CustomerService.createCustomer(req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.paymentInfos, function(result){
                Base.send(req, res, result);
            });
        });

        //create : /customer/createForgottenPasswordToken
        app.post(configuration.routes.customer.createForgottenPasswordToken, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || 
                req.body.username === undefined || !req.body.username|| 
                req.body.token === undefined || !req.body.token){
                LoggerService.logError("services", "Wrong createForgottenPasswordToken parameters", {});
                Base.send(req, res, false);
            }
            CustomerService.createForgottenPasswordToken(req.body.username, req.body.token, function(result){
                Base.send(req, res, result);
            });
        });

        //create : /customer/changePassword
        app.post(configuration.routes.customer.changePassword, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || 
                req.body.username === undefined || !req.body.username|| 
                req.body.newPassword === undefined || !req.body.newPassword){
                LoggerService.logError("services", "Wrong changePassword parameters", {});
                Base.send(req, res, false);
            }
            CustomerService.changePassword(req.body.username, req.body.newPassword, function(result){
                Base.send(req, res, result);
            });
        });

        // update : /customer/update
        app.post(configuration.routes.customer.updateCustomer, HmacHelper.verifyRequest, function(req, res){
            //check parameters
            if(req.body === undefined || !req.body || req.body.username === undefined || !req.body.username || req.body.account === undefined || !req.body.account){
                LoggerService.logError("services", "Wrong update customer parameters", {});
                Base.send(req, res, false);
            }
            CustomerService.updateCustomer(req.body.username, req.body.account, function(result){
                Base.send(req, res, result);
            });
        });
    	
    }
    
};

module.exports.CustomerRoutes = CustomerRoutes;