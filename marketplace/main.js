var express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  Routes = require('./routes/routes').Routes,
  MongoStore = require('connect-mongo')(session),
  ConfigurationHelper = require('./helpers/configuration.helper').ConfigurationHelper,
  HandlebarsHelper = require('./helpers/handlebars.helper').HandlebarsHelper;




/**
 * Classe principale - Keep it simple in here
 * @class Main
 */
var Main = {
  /**
   * start : lance l'application express
   */
   
     _serviceRoutes: [
    //require('./services/logger/logger.routes').LoggerRoutes,
    require('./services/customer/customer.routes').CustomerRoutes,
    /*require('./services/seller/seller.routes').SellerRoutes,
    require('./services/payment/payment.routes').PaymentRoutes,
    require('./services/order/order.routes').OrderRoutes,
    require('./services/product/product.routes').ProductRoutes,
    require('./services/productList/productList.routes').ProductListRoutes,
    require('./services/school/school.routes').SchoolRoutes,
    require('./services/category/category.routes').CategoryRoutes,
    require('./helpers/error.helper').ErrorHelper //last one */
  ],
  
  start: function() {

    ConfigurationHelper.getConfig({
      application: 'marketplace',
      done: function(configuration) {

        // Ne pas toucher ce bloc
        var app = express();
        app.use(cookieParser());
        app.use(session({
          cookie: {
            maxAge: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          store: new MongoStore({
            url: configuration.database.address,
            clear_interval: 3600
          }, startContent),
          secret: 'paces-store'
        }));

        function startContent() {
          app.set('port', configuration.port);
          app.set('views', __dirname + '/views');

          app.engine('html', HandlebarsHelper.initHandlebars(app));
          app.set('view engine', 'html');

          app.use(express.static(path.join(__dirname, 'public')));

          app.set('trust proxy', function (ip) {
            return true;
          });


          app.use(bodyParser({
            keepExtensions: true,
            uploadDir: __dirname + "/files/tmp"
          }));

          Routes.loadRoutes(app, configuration);

          var serviceRoutes = Main._serviceRoutes;
          //load all routes
          for (var i = 0; i < serviceRoutes.length; i++) {
            serviceRoutes[i].loadRoutes(app, configuration);
          } 

          //lancement du serveur
          app.listen(configuration.port, function() {
            console.log('marketplace started on ' + (configuration.addressBasePath + ":" + configuration.port));
          });
        }

      }
    });

  }

};

Main.start();
