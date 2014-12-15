var Base = require('../base/base.routes').BaseRoutes,
SchoolService = require('./school.service').SchoolService,
LoggerService = require('../logger/logger.service').LoggerService,
HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service School
 * @class ProductRoutes
 */
var SchoolRoutes = {

    Base : Base,

    /**
    * loadRoutes : Charge les routes dans Express pour les rendre accessible
    * @param app : l'application express
    * @param configuration : la configuration de l'application (contient le chemin de l'url)
    */
    loadRoutes : function(app, configuration){

        // get schools list
    
        app.post(configuration.routes.school.getSchools, HmacHelper.verifyRequest, function(req, res){
            
            //check parameters
            if( req.body === undefined || !req.body){
                LoggerService.logError("services", "Wrong get schools parameters", {});
                Base.send(req, res, false);
            }
            else {
                SchoolService.getSchools(function(result){
                    Base.send(req, res, result);
                });
            }   
        });     

        // get school by url id
    
        app.post(configuration.routes.school.getSchoolByUrlId, HmacHelper.verifyRequest, function(req, res){
            
            //check parameters
            if( req.body === undefined || !req.body || req.body.universityId === undefined || !req.body.universityId){
                LoggerService.logError("services", "Wrong get school by url id parameters", {});
                Base.send(req, res, false);
            }
            else {
                SchoolService.getSchoolByUrlId(req.body.universityId, function(result){
                    Base.send(req, res, result);
                });
            }   
        });
    	
    }
    
};

module.exports.SchoolRoutes = SchoolRoutes;