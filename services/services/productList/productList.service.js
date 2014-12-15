var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
ObjectID = require('mongodb').ObjectID
/**
 * Service Product
 * @class ProductService
 */
var ProductListService = {

    /*
    * getProductsByFilter : Récupère un ensemble de produits correspondant aux critères demandés
    * @param filter : le filtre à appliquer
    * @param done : la méthode de retour
    * @return Liste de produit / Sinon False
    */
    getProductsByFilter : function(filter, order, done){

        DatabaseHelper.getDatabase(function(db){
            db.collection("Products", function(err, products){
                if (err || !products)
                {
                    return done(false);
                } 

                var sortObject = {};
                sortObject[order.order] = order.reversed !== undefined && order.reversed == true ? -1 : 1;

                products.find(filter).sort(sortObject).toArray(function(err, products){
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
