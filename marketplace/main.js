var express = require('express'),
        html = require('express-handlebars'),
        path = require('path'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        session = require('express-session'),
        Routes = require('./routes/routes').Routes,
        MongoStore = require('connect-mongo')(session),
        ConfigurationHelper = require('./helpers/configuration.helper').ConfigurationHelper;

/**
 * Classe principale - Keep it simple in here
 * @class Main 
 */
var Main = {
    /**
     * start : lance l'application express
     */
    start: function () {

        ConfigurationHelper.getConfig({application: 'marketplace', done: function (configuration) {

                // Ne pas toucher ce bloc
                var app = express();
                app.use(cookieParser());
                app.use(session({
                    cookie: {maxAge: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)},
                    store: new MongoStore({
                        url: configuration.database.address,
                        clear_interval: 3600
                    }, startContent),
                    secret: 'paces-store'
                }));

                function startContent() {
                    app.set('port', configuration.port);
                    app.set('views', __dirname + '/views');
                    app.engine('html', html({layoutsDir: path.join(app.settings.views, ""), defaultLayout: 'layout', extname: '.html'}));
                    app.set('view engine', 'html');
                    app.use(express.static(path.join(__dirname, 'public')));

                    app.use(bodyParser());

                    Routes.loadRoutes(app, configuration);

                    //lancement du serveur
                    app.listen(configuration.port, function () {
                        console.log('marketplace started on ' + (configuration.addressBasePath + ":" + configuration.port));
                    });
                }

            }});

    }

};

Main.start();