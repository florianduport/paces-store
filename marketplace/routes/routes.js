var PageController = require('./../controllers/page.controller').PageController,
HomepageController = require('./../controllers/homepage.controller').HomepageController,
ProductListController = require('./../controllers/productlist.controller').ProductListController,
ProductController = require('./../controllers/product.controller').ProductController,
ShoppingCartController = require('./../controllers/shoppingcart.controller').ShoppingCartController,
AccountController = require('./../controllers/account.controller').AccountController
/**
* Charge les routes de account controller
* @class AccountRoutes
*/
var Routes = {
    /**
    * loadRoutes : Charge les routes dans Express pour les rendre accessible
    * @param app : l'application express
    * @param configuration : la configuration de l'application (contient le chemin de l'url)
    */
    loadRoutes : function(app, configuration){

		//routes / mapping controller
		
		//CATALOG
		app.get('/', PageController.initializeGeoloc, HomepageController.initialize);
		app.get('/list/:universityId', PageController.initializeGeoloc, ProductListController.initialize);
		app.get('/list/', PageController.initializeGeoloc, ProductListController.initialize);
		app.post('/list/:universityId', PageController.initializeGeoloc, ProductListController.initializeFilter);
		app.post('/list/', PageController.initializeGeoloc, ProductListController.initializeFilter);
		app.get('/product/:product', PageController.initializeGeoloc, ProductController.initialize);

		//SHOPPING CART
		app.get('/shoppingcart/', ShoppingCartController.initialize);
		app.get('/addtocart/:product', ShoppingCartController.addToShoppingCart);
		app.get('/removefromcart/:product', ShoppingCartController.removeFromShoppingCart);

		//CUSTOMER ACCOUNT
		app.get('/account/connect', AccountController.initialize);
		app.post('/account/connect', AccountController.initialize);
		app.get('/account/disconnect', AccountController.initialize);

		app.get('/*', PageController.initialize);

    }

};

module.exports.Routes = Routes;