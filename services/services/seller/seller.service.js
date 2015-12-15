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
                    console.log("suce moi 1 fois")
                    return done(false);
                }
                //password should be sent with sha1 encryption
                sellers.findOne({ username: username, password: password }, function(err, user){
                    if (err || !user)
                    {
                        console.log("suce moi 2 fois")
                        console.log(username)
                        console.log(password)
                        console.log(user)
                        return done(false);
                    }
                    return done(true);
                });
            });
        });
    },

    /**
    * getCustomer : Récupère les informations de l'utilisateur
    * @param username : le nom d'utilisateur'
    * @param done : la méthode de retour
    * @return objet contenant les informations de l'utilisateur
    */
    getSellerById : function(userId, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Sellers", function(err, sellers){
                if (err || !sellers)
                {
                    return done(false);
                }
                //password should be sent with sha1 encryption
                sellers.findOne({ _id: ObjectID(userId)}, function(err, user){
                    if (err || !user)
                    {
                        return done(false);
                    }

                    return done(user);
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

                    return done(user);
                });
            });
        });
    },

    /**
    * getCustomer : Récupère les informations de l'utilisateur
    * @param username : le nom d'utilisateur'
    * @param done : la méthode de retour
    * @return objet contenant les informations de l'utilisateur
    */
    getFullSellerByUsername : function(username, done){
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

                    return done(user);
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
    getSellersByUsername : function(sellersParam, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Sellers", function(err, sellers){
                if (err || !sellers)
                {
                    return done(false);
                }
                //password should be sent with sha1 encryption
                sellers.find({username : { $in : sellersParam}}).toArray(function(err, sellersFound){
                    if (err || !sellersFound)
                    {
                        //console.log("===== NO SELLERS FOUND IN ");
                        //console.log(sellers);
                        done(false);
                    }

                    done(sellersFound);
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
    createSeller : function(username, password, firstName, lastName, paymentInfos, done){
        try{
            DatabaseHelper.getDatabase(function(db){

                if(username == "" ||
                    password == "" ||
                    firstName == "" ||
                    lastName == ""){
                    console.log(username+" "+password+" "+confirmedPassword+" "+firstName+" "+lastName)
                    done(false);
                } else {
                    var sellerObject = {
                        username : username,
                        password : sha1(password),
                        account : {
                            firstName : firstName,
                            lastName : lastName,
                            paymentInfos : paymentInfos
                        }
                    };

                    db.collection("Sellers", function(err, sellers){
                        if(!err && sellers !== undefined){
                            sellers.insert(sellerObject, { w: 0 });
                            done(true);
                        }
                        else {

                        console.log("mange mes couilles 2");
                        console.log(sellers);
                        
                          done(false);
                        }
                    });
                }

                
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

                        updatedUser.account.displayName = data.displayName;
                        updatedUser.account.firstName = data.firstName;
                        updatedUser.account.lastName = data.lastName;
                        updatedUser.account.universityId = data.universityId;
                        updatedUser.account.description = data.description;
                        updatedUser.account.address = data.address;
                        /*updatedUser.account.address.invoice = data.invoiceAddress;
                        updatedUser.account.address.shipping = data.shippingAddress;
                        updatedUser.account.phoneNumber = data.phoneNumber !== undefined ? data.phoneNumber : "";*/
                        updatedUser.account.paymentInfos.iban = data.paymentInfos.iban !== undefined ? data.paymentInfos.iban : "";
                        updatedUser.account.paymentInfos.bic = data.paymentInfos.bic !== undefined ? data.paymentInfos.bic : "";
                        updatedUser.account.paymentInfos.bankId = data.paymentInfos.bankId !== undefined ? data.paymentInfos.bankId : "";

                        Sellers.save(updatedUser, {w:1}, function(){
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
    },

    createForgottenPasswordToken : function(email, token, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Sellers", function(err, sellers){
                if (err || !sellers)
                {
                    done(false);
                }
                //password should be sent with sha1 encryption
                sellers.findOne({ username: email}, function(err, user){
                    if (err || !user)
                    {
                        done(false);
                    }
                    var expirationDate = Math.round(new Date().getTime() / 1000);
                    expirationDate += 3600;
                    user.changePasswordToken = {
                        expirationDate : expirationDate,
                        token : token
                    }
                    sellers.save(user, {w:1}, function(){
                        done(true);
                    });
                });
            });
        });
    },

    changePassword : function(email, newPassword, done){
        DatabaseHelper.getDatabase(function(db){
            db.collection("Sellers", function(err, sellers){
                if (err || !sellers)
                {
                    done(false);
                }
                //password should be sent with sha1 encryption
                sellers.findOne({ username: email}, function(err, user){
                    if (err || !user)
                    {
                        done(false);
                    }
                    user.password = sha1(newPassword);
                    user.changePasswordToken = undefined;
                    sellers.save(user, {w:1}, function(){
                        done(true);
                    });
                });
            });
        });
    }
};

module.exports.SellerService = SellerService;
