var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
ConfigurationHelper = require('../../helpers/configuration.helper').ConfigurationHelper,
sha1 = require('sha1'),
ObjectID = require('mongodb').ObjectID;
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
            ConfigurationHelper.getConfig({application : 'marketplace', done : function(configuration){
                DatabaseHelper.getDatabase(function(db){

                    if(products === undefined || products.length == 0){
                        done(false);
                    }

                    var amount = 0;
                    for (var i = products.length - 1; i >= 0; i--) {
                        amount = amount+products[i].price;
                    };

                    var orderObject = {
                        products : products,
                        user : user,
                        fees : configuration.fees*amount,
                        amount : amount,
                        createDate : Date.now()
                    };

                    db.collection("Orders", function(err, orders){
                        if(!err){
                            orders.insert(orderObject, { w: 0 }, function(err){
                                if(err){
                                    done(false);
                                }
                                done(orderObject);
                            });
                        }
                        else {
                          done(false);
                        }  
                    });
                });
            }});
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
                        updatedOrder._id = ObjectID(updatedOrder._id);

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
