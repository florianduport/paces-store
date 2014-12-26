var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
sha1 = require('sha1');
/**
 * Service Payment
 * @class PaymentService
 */
var PaymentService = {


    Provider : require('./providers/mangopay.provider').Provider,


    /**
    * createWallet : créer le wallet dans mangopay
    * @param username : le nom d'utilisateur'
    * @param password : le mdp
    * @param done : la méthode de retour
    * @return True : si l'utilisateur existe. Sinon False.
    */
    createWallet : function(infos, done){
        PaymentService.Provider.createWallet(infos, done);
        /*DatabaseHelper.getDatabase(function(db){
            db.collection("Customers", function(err, customers){
                if (err || !customers)
                {
                    return done(false);
                } 
                //password should be sent with sha1 encryption
                customers.findOne({ username: username, password: password }, function(err, user){
                    if (err || !user)
                    {
                        console.log("no user found =========="+username+"/"+password);
                        return done(false);
                    }    
                    return done(true); 
                });
            });
        });*/
        
    },

    getUsers : function(done){
        PaymentService.Provider.getUsers(done);
    },

    payWithNewCard : function(user, card, sellers, lines, done){
        PaymentService.Provider.payWithNewCard(user, card, sellers, lines, done);
    }

};

module.exports.PaymentService = PaymentService;
