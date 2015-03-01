var PageController = require('./../controllers/page.controller').PageController,
HomepageController = require('./../controllers/homepage.controller').HomepageController,
ProductListController = require('./../controllers/productlist.controller').ProductListController,
ProductController = require('./../controllers/product.controller').ProductController,
ShoppingCartController = require('./../controllers/shoppingcart.controller').ShoppingCartController,
CheckoutController = require('./../controllers/checkout.controller').CheckoutController,
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

    	PageController.app = app;
    	HomepageController.app = app;
    	ProductListController.app = app;
    	ProductController.app = app;
    	ShoppingCartController.app = app;
    	CheckoutController.app = app;
    	AccountController.app = app;
		//routes / mapping controller
		
		//CATALOG
		//app.get('/', PageController.initializeGeoloc, HomepageController.initialize);
		app.get('/', PageController.initializeGeoloc, ProductListController.initializeFilter);
		
		app.get('/list/:universityId', PageController.initializeGeoloc, ProductListController.initialize);
		app.get('/list/', PageController.initializeGeoloc, ProductListController.initialize);
		app.post('/list/:universityId', PageController.initializeGeoloc, ProductListController.initializeFilter);
		app.post('/list/', PageController.initializeGeoloc, ProductListController.initializeFilter);
		app.get('/product/:product', PageController.initializeGeoloc, ProductController.initialize);

		//SHOPPING CART
		app.get('/shoppingcart/', ShoppingCartController.initialize);
		app.get('/addtocart/:product', ShoppingCartController.addToShoppingCart);
		app.get('/removefromcart/:product', ShoppingCartController.removeFromShoppingCart);

		//CHECKOUT
		app.get('/checkout/', AccountController.checkSignIn, CheckoutController.initialize);
		app.post('/checkout/payWithNewCard', AccountController.checkSignIn, CheckoutController.payWithNewCard);
		app.get('/checkout/wait/:orderId', AccountController.checkSignIn, CheckoutController.waitPayment);
		app.get('/checkout/success/:orderId', AccountController.checkSignIn, CheckoutController.successPayment);


		//CUSTOMER ACCOUNT
		app.get('/signin', AccountController.signIn);
		app.post('/signin', AccountController.signIn);
		app.get('/signout', AccountController.signOut);
		app.post('/createCustomer', AccountController.createCustomer);

		app.get('/test', PageController.test);
		app.get('/testInc', PageController.testInc);

		app.get('/*', PageController.initialize);

    }

};

module.exports.Routes = Routes;