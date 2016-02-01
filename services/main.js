var Express = require('express'),
  BodyParser = require('body-parser'),
  ConfigurationHelper = require('./helpers/configuration.helper').ConfigurationHelper;

/**
 * Classe principale - Keep it simple in here
 * @class Main
 */
var Main = {

  /**
   * _routes : Retourne les classes de routing
   * Ajouter ici tous les nouveaux routing de nouveaux services
   */
  _routes: [
    require('./services/logger/logger.routes').LoggerRoutes,
    require('./services/customer/customer.routes').CustomerRoutes,
    require('./services/seller/seller.routes').SellerRoutes,
    require('./services/payment/payment.routes').PaymentRoutes,
    require('./services/order/order.routes').OrderRoutes,
    require('./services/product/product.routes').ProductRoutes,
    require('./services/productList/productList.routes').ProductListRoutes,
    require('./services/school/school.routes').SchoolRoutes,
    require('./services/category/category.routes').CategoryRoutes,
    require('./helpers/error.helper').ErrorHelper //last one
  ],

  /**
   * start : lance l'application express
   */
  start: function() {

    var app = Express();
    app.use(BodyParser.json());

    var routes = this._routes;

    ConfigurationHelper.getConfig({
      application: 'services',
      done: function(configuration) {
        app.set('port', configuration.port);

        //load all routes
        for (var i = 0; i < routes.length; i++) {
          routes[i].loadRoutes(app, configuration);
        }

        //lancement du serveur
        app.listen(configuration.port, function() {
          console.log('services started on ' + (configuration.addressBasePath + ":" + configuration.port));
        });
      }
    });

  }

};

Main.start();
