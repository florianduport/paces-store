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
                if(filter["$text"] !== undefined){
                    sortObject.score = {}; 
                    sortObject.score["$meta"] = "textScore";
                }

                if(filter["_id"] && typeof(filter["_id"]) === "object"){
                   if(filter["_id"]["$in"] !== undefined && filter["_id"]["$in"].length > 0){
                        filter["_id"]["$in"] = filter["_id"]["$in"].map(function(id) { return ObjectID(id); });
                   } 
                }

                products.find(filter, { "score" : { "$meta" : "textScore"}}).sort(sortObject).toArray(function(err, products){
                    console.log(err);
                    if (err || !products)
                    {
                        return done(false);
                    }    
                    for(var i = 0; i < products.length; i++) {
                        products[i].truncateName = products[i].name.substr(0, 19);
                    }
                    return done(products); 
                });
            });
        });
    }

};

module.exports.ProductListService = ProductListService;
