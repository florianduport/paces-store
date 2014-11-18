var express = require('express'),
path = require('path'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
session = require('express-session'),
Routes = require('./routes/routes').Routes,
ConfigurationHelper = require('./helpers/configuration.helper').ConfigurationHelper;

/**
 * Classe principale - Keep it simple in here
 * @class Main 
 */
var Main = {

    /**
    * start : lance l'application express
    */
    start : function(){

    	ConfigurationHelper.getConfig({application : 'marketplace', done : function(configuration){

			// Ne pas toucher ce bloc
			var app = express();
			app.use(cookieParser());
			app.use(session({ 
				secret: 'paces-store',
    			maxAge  : new Date(Date.now() + 3600000), //1 Hour
    			expires : new Date(Date.now() + 3600000)
    		}));

			app.set('port', configuration.port);
			app.set('views', __dirname + '/views');
			app.set('view engine', 'jade');
			app.use(express.static(path.join(__dirname, 'public')));

			app.use(bodyParser());

			Routes.loadRoutes(app, configuration);

			//lancement du serveur
			app.listen(configuration.port, function(){
			    console.log('marketplace started on '+(configuration.addressBasePath+":"+configuration.port));      
			});

		}});

	}

};

Main.start();