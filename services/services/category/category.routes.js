var Base = require('../base/base.routes').BaseRoutes,
  CategoryService = require('./category.service').CategoryService,
  LoggerService = require('../logger/logger.service').LoggerService,
  HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service Category
 * @class ProductRoutes
 */
var CategoryRoutes = {

  Base: Base,

  /**
   * loadRoutes : Charge les routes dans Express pour les rendre accessible
   * @param app : l'application express
   * @param configuration : la configuration de l'application (contient le chemin de l'url)
   */
  loadRoutes: function(app, configuration) {

    // get Categorys list

    app.post(configuration.routes.category.getCategories, HmacHelper.verifyRequest, function(req, res) {
      //console.log("here");
      //check parameters
      if (req.body === undefined || !req.body) {
        LoggerService.logError("services", "Wrong get Categories parameters", {});
        Base.send(req, res, false);
      } else {
        CategoryService.getCategories(function(result) {
          Base.send(req, res, result);
        });
      }
    });

  }

};

module.exports.CategoryRoutes = CategoryRoutes;
