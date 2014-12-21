var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
sha1 = require('sha1');
var ObjectID = require('mongodb').ObjectID
/**
 * Service Payment
 * @class PaymentService
 */
var OrderService = {

    
    getOrderById : function(orderId, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Orders", function(err, orders){
                if (err || !orders)
                {
                    done(false);
                } 
                //password should be sent with sha1 encryption
                orders.findOne({ _id: ObjectID(orderId)}, function(err, order){
                    if (err || !order)
                    {
                        done(false);
                    }
    
                    done(order); 
                });
            });
        });   
    },

    createOrder : function(products, user, done){
        try{
            DatabaseHelper.getDatabase(function(db){

                if(products === undefined || products.length == 0){
                    console.log("========= PAS DE PRODUITS ");
                    done(false);
                }

                var orderObject = {
                    products : products,
                    user : user
                };

                db.collection("Orders", function(err, orders){
                    if(!err){
                        orders.insert(orderObject, { w: 0 }, function(err){
                            if(err){
                                console.log("FAIL INSERT");
                                done(false);
                            }
                            console.log("CREATION OK");
                            done(orderObject);
                        });
                    }
                    else {
                        console.log("FAIL CREATION");
                      done(false);
                    }  
                });
            });
        }
        catch(err){
            done(false);
        }
    },

    updateOrder : function(order, done){
        try{
            DatabaseHelper.getDatabase(function(db){
                db.collection("Orders", function(err, Orders){
                    //password should be sent with sha1 encryption
                    Orders.findOne({ _id : ObjectID(order._id)}, function(err, orderFound){

                        var updatedOrder = order;
                        
                        Orders.save(updatedOrder, {w:1}, function(){
                            done(true);
                        });
                    });
                });
            });
        }
        catch(err){
            done(false);
        }
    }

};

module.exports.OrderService = OrderService;
