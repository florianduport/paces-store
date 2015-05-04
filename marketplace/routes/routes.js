var PageController = require('./../controllers/page.controller').PageController,
HomepageController = require('./../controllers/homepage.controller').HomepageController,
ProductListController = require('./../controllers/productlist.controller').ProductListController,
ProductController = require('./../controllers/product.controller').ProductController,
ShoppingCartController = require('./../controllers/shoppingcart.controller').ShoppingCartController,
CheckoutController = require('./../controllers/checkout.controller').CheckoutController,
AccountController = require('./../controllers/account.controller').AccountController,
DownloadController = require('./../controllers/download.controller').DownloadController
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
    	DownloadController.app = app;
		//routes / mapping controller
		
		//CATALOG
		//app.get('/', PageController.initializeGeoloc, HomepageController.initialize);
		app.get('/', PageController.initializeGeoloc, ProductListController.initializeFilter);
		
		app.post('/search/', PageController.initializeGeoloc, ProductListController.initializeFilter);
		app.get('/search/', PageController.initializeGeoloc, function(req, res){ res.redirect('/'); });
		
		app.get('/list/:universityId', PageController.initializeGeoloc, ProductListController.initialize);
		app.get('/list/', PageController.initializeGeoloc, ProductListController.initialize);
		app.post('/list/:universityId', PageController.initializeGeoloc, ProductListController.initializeFilter);
		app.post('/list/', PageController.initializeGeoloc, ProductListController.initializeFilter);
		app.get('/product/:product', PageController.initializeGeoloc, ProductController.initialize);

		//SHOPPING CART
		app.get('/shoppingcart/', ShoppingCartController.initialize);
		app.post('/shoppingcart/', ShoppingCartController.initialize);
		app.get('/addtocart/:product', ShoppingCartController.addToShoppingCart);
		app.get('/removefromcart/:product', ShoppingCartController.removeFromShoppingCart);
		app.post('/productcheckout/:product', ShoppingCartController.productCheckout);

		//CHECKOUT
		app.post('/checkout/', AccountController.checkSignIn, CheckoutController.initialize);		
		app.get('/checkout/', AccountController.checkSignIn, CheckoutController.initialize);
		app.post('/checkout/payWithNewCard', AccountController.checkSignIn, CheckoutController.payWithNewCard);
		app.get('/checkout/wait/:orderId', AccountController.checkSignIn, CheckoutController.waitPayment);
		app.get('/checkout/success/:orderId', AccountController.checkSignIn, CheckoutController.successPayment);

		app.post('/download/:orderId', AccountController.checkSignIn, DownloadController.checkDownload, DownloadController.downloadOrder);

		//CUSTOMER ACCOUNT
		app.get('/signin', AccountController.signIn);
		app.post('/signin', AccountController.signIn);
		app.post('/signup/display', AccountController.displaySignUp);
		app.post('/signup', AccountController.signUp);
		app.get('/signout', AccountController.signOut);
		app.post('/createCustomer', AccountController.createCustomer);
		app.post('/geoloc', PageController.getGeolocZone);


		app.get('/contact', AccountController.checkSignIn, PageController.displayContact);
		app.post('/contact', AccountController.checkSignIn, PageController.contactUs);

		app.get('/test', PageController.test);
		app.get('/testInc', PageController.testInc);

		app.get('/*', PageController.initialize);

    }

};

module.exports.Routes = Routes;