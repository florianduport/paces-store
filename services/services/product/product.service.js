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
    * @return Produit / Sinon False
    */
    getProductById : function(productId, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Products", function(err, products){
                if (err || !products)
                {
                    return done(false);
                } 
                products.findOne({ _id: ObjectID(productId) }, function(err, product){
                    if (err || !product)
                    {
                        return done(false);
                    }    
                    return done(product); 
                });
            });
        }); 
    },

    createProduct : function(name, description, price, university, categories, time, seller, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Products", function(err, products){
                if (err || !products)
                {
                    console.log("no products !!!!");
                    return done(false);
                } 

                var productObject = {
                    name : name,
                    description : description,
                    price : price,
                    university : university,
                    categories : categories,
                    seller : seller,
                    time : time,
                    rating : {
                        value : 0,
                        count : 0
                    },
                    data : {
                        sellCount : 0,
                        alertCount : 0
                    }
                }

                products.insert(productObject, { w: 0 }, function(){
                    return done(true);
                });
            });
        });
    },

    updateProduct : function(id, name, description, price, university, time, categories, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Products", function(err, products){
                if (err || !products)
                {
                    return done(false);
                } 

                products.findOne({ _id: ObjectID(id) }, function(err, product){
                    if (err || !product)
                    {
                        return done(false);
                    }

                    var updatedProduct = product;
                    updatedProduct.name = name;
                    updatedProduct.description = description;
                    updatedProduct.price = price;
                    updatedProduct.university = university;
                    updatedProduct.categories = categories;
                    updatedProduct.time = time;
                    
                    products.save(updatedProduct, {w:1}, function(){
                        done(true);
                    }); 
                });
            });
        });
    },

    rateProduct : function(productId, rateValue, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Products", function(err, products){
                if (err || !products)
                {
                    return done(false);
                } 
                products.findOne({ _id: ObjectID(productId) }, function(err, product){
                    if (err || !product)
                    {
                        return done(false);
                    }
                    //secure data
                    if(product.rating === undefined){
                        product.rating = { value : 0, count : 0 };
                    } else if(product.rating.value === undefined){
                        product.rating.value = 0;
                    } else if(product.rating.roundValue === undefined){
                        product.rating.roundValue = 0;
                    } else if(product.rating.count === undefined){
                        product.rating.count = 0;
                    }

                    if(product.rating.count == 0){
                        product.rating.count = 1;
                        product.rating["value"] = rateValue;
                    } else {
                        var ratingsTotal = product.rating["value"] * product.rating.count;

                        ratingsTotal = parseInt(parseInt(ratingsTotal) + parseInt(rateValue));

                        product.rating.count = product.rating.count + 1;
                        product.rating.value = ratingsTotal / product.rating.count;
                        product.rating.roundValue = Math.round(ratingsTotal / product.rating.count);

                    }

                    products.save(product, {w:1}, function(){
                        done(true);
                    });
                });
            });
        });      
    }
};

module.exports.ProductService = ProductService;
