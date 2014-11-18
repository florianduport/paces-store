var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
ObjectID = require('mongodb').ObjectID
/**
 * Service Product
 * @class ProductService
 */
var ProductListService = {

    /**
    * getProductsByFilter : Récupère un ensemble de produits correspondant aux critères demandés
    * @param filter : le filtre à appliquer
    * @param done : la méthode de retour
    * @return Liste de produit / Sinon False
    */
    getProductsByFilter : function(filter, done){

        DatabaseHelper.getDatabase(function(db){
            db.collection("Products", function(err, products){
                if (err || !products)
                {
                    return done(false);
                } 
                //password should be sent with sha1 encryption
                products.find(filter).toArray(function(err, products){
                    if (err || !products)
                    {
                        return done(false);
                    }    
                    return done(products); 
                });
            });
        });

    }
};

module.exports.ProductListService = ProductListService;
