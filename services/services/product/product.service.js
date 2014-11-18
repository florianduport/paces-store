var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
ObjectID = require('mongodb').ObjectID
/**
 * Service Product
 * @class ProductService
 */
var ProductService = {

    /**
    * getProductById : Récupère un produit en base par son ID
    * @param productId : l'id du produit
    * @param done : la méthode de retour
    * @return True : si l'utilisateur existe. Sinon False.
    */
    getProductById : function(productId, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Products", function(err, products){
                if (err || !products)
                {
                    return done(false);
                } 
                //password should be sent with sha1 encryption
                products.findOne({ _id: ObjectID(productId) }, function(err, product){
                    if (err || !product)
                    {
                        return done(false);
                    }    
                    return done(product); 
                });
            });
        });
    }
};

module.exports.ProductService = ProductService;
