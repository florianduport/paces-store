var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
sha1 = require('sha1');
/**
 * Service Seller
 * @class SellerService
 */
var SellerService = {

    /**
    * authenticateSeller : Vérifie si le couple user / mdp existe en base
    * @param username : le nom d'utilisateur'
    * @param password : le mdp
    * @param done : la méthode de retour
    * @return True : si l'utilisateur existe. Sinon False.
    */
    authenticateSeller : function(username, password, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Sellers", function(err, sellers){
                if (err || !sellers)
                {
                    return done(false);
                } 
                //password should be sent with sha1 encryption
                sellers.findOne({ username: username, password: password }, function(err, user){
                    if (err || !user)
                    {
                        return done(false);
                    }    
                    return done(true); 
                });
            });
        });
    },
    
    /**
    * getSeller : Récupère les informations de l'utilisateur
    * @param username : le nom d'utilisateur'
    * @param done : la méthode de retour
    * @return objet contenant les informations de l'utilisateur
    */  
    getSellerByUsername : function(username, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Sellers", function(err, sellers){
                if (err || !sellers)
                {
                    return done(false);
                } 
                //password should be sent with sha1 encryption
                sellers.findOne({ username: username}, function(err, user){
                    if (err || !user)
                    {
                        return done(false);
                    }
    
                    return done(user.account); 
                });
            });
        });   
    },

    /**
    * createSeller : Modifie les informations de l'utilisateur
    * @param username : le nom d'utilisateur
    * @param password : le mot de passe
    * @param confirmedPassword : le mot de passe 2
    * @param firstName : le prénom
    * @param lastName : le nom
    * @param done : la méthode de retour
    * @return le résultat de l'operation True / False
    */
    createSeller : function(username, password, confirmedPassword, firstName, lastName, done){
        try{
            DatabaseHelper.getDatabase(function(db){

                if(username == "" || 
                    password == "" ||
                    confirmedPassword == ""||
                    password != confirmedPassword ||
                    firstName == "" ||
                    lastName == ""){
                    done(false);
                }

                var sellerObject = {
                    ussername : username,
                    password : sha1(password),
                    account : {
                        firstName : firstName,
                        lastName : lastName
                    }
                };

                db.collection("Sellers", function(err, sellers){
                    if(!err && sellers !== undefined && !sellers){
                        sellers.insert(sellerObject, { w: 0 });
                        done(true);
                    }
                    else
                      done(false);  
                });
            });
        }
        catch(err){
            done(false);
        }
        
    },
    /**
    * updateSeller : Modifie les informations de l'utilisateur
    * @param username : le nom d'utilisateur
    * @param data : les données du compte mis à jour
    * @param done : la méthode de retour
    * @return objet contenant les informations de l'utilisateur
    */
    updateSeller : function(username, data, done){
        try{
            DatabaseHelper.getDatabase(function(db){
                db.collection("Sellers", function(err, Sellers){
                    //password should be sent with sha1 encryption
                    Sellers.findOne({ username: username}, function(err, user){

                        var updatedUser = user;
                        
                        if(data.password !== undefined)
                            updatedUser.password = sha1(data.password);
                        
                        updatedUser.account.firstName = data.firstName;
                        updatedUser.account.lastName = data.lastName;
                        updatedUser.account.address.invoice = data.invoiceAddress;
                        updatedUser.account.address.shipping = data.shippingAddress;
                        updatedUser.account.phoneNumber = data.phoneNumber !== undefined ? data.phoneNumber : "";
                        
                        SellerHelper.save(updatedUser, function(){
                            done(true);
                        });
                    });
                });
            });
        }
        catch(err){
            done(false);
        }
        
    },
    
    /**
    * getSeller : Récupère les 100 derniers utilisateurs
    * @param done : la méthode de retour
    * @return objet contenant les 100 derniers utilisateurs
    */
    getSellers : function(done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Sellers", function(err, SellersCollection){
                //password should be sent with sha1 encryption
                SellersCollection.find({}, {}, {limit : 100}).toArray(function(err, Sellers){
                    if (err || !user)
                    {
                        return done(false);
                    }
                    
                    return done(Sellers); 
                });
            });
        });   
    }
};

module.exports.SellerService = SellerService;
