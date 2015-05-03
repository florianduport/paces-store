var ConfigurationHelper = require('../../../helpers/configuration.helper').ConfigurationHelper;
/**
 * Provider MangoPay
 * @class Provider
 */
var Provider = {

    /**
    * createWallet : créer le wallet dans mangopay
    * @param username : le nom d'utilisateur'
    * @param password : le mdp
    * @param done : la méthode de retour
    * @return True : si l'utilisateur existe. Sinon False.
    */
    createWallet : function(infos, done){
        
        if(infos !== undefined &&
            infos.username !== undefined && 
            infos.firstName !== undefined &&
            infos.lastName !== undefined) {

            ConfigurationHelper.getConfig({application : 'marketplace', done : function(configuration){
                    var mango = require('mangopay')(configuration.mangopay);

                    mango.user.signup({
                        Email: infos.username,
                        FirstName: infos.firstName,
                        LastName: infos.lastName,
                        Birthday: 315532861,
                        Nationality: "FR",
                        CountryOfResidence: "FR"
                    }, function(err, user, wallet){
                        if(err){
                            done(false);
                        }
                        done({user : user, wallet : wallet});
                    });
                }   
            });

        } else {
            done(false);
        }

    },

    getUsers : function(done){
        ConfigurationHelper.getConfig({application : 'marketplace', done : function(configuration){
                var mango = require('mangopay')(configuration.mangopay);
                /*mango.user.list(function(err,users){
                    done(users); 
                });*/
                mango.user.wallets({UserId : "5009340"}, function(err, events){done(events);});
            }
        });
    },

    payWithNewCard : function(user, card, sellers, lines, callback){
        ConfigurationHelper.getConfig({application : 'marketplace', done : function(configuration){
                var mango = require('mangopay')(configuration.mangopay);

                function payEachLine(i, user, card, lines) {
                    if(i<lines.length) {

                        var seller = lines[i].seller;
                        for (var k = sellers.length - 1; k >= 0; k--) {
                            if(sellers[k].username == lines[i].seller) {
                                seller = sellers[k];
                            }
                        };
                        amount = lines[i].amount;

                        var fees = configuration.fees*amount;

                        mango.card.create({
                          UserId: user.paymentInfos.accountId,
                          CardNumber: card.cardNumber,
                          CardExpirationDate: card.cardExpirationDate,
                          CardCvx: card.cardCvx,
                        }, function(err, cardObject, res){
                            if(!err){

                                mango.payin.createByToken({
                                  AuthorId: user.paymentInfos.accountId,          
                                  CreditedUserId : user.paymentInfos.accountId,    
                                  DebitedFunds: {            
                                        Currency: "EUR",
                                        Amount: ""+amount*100
                                  },
                                  Fees: {
                                        Currency: "EUR",
                                        Amount: "0"
                                  },
                                  CreditedWalletId: user.paymentInfos.walletId,
                                  CardId: cardObject.CardId,
                                  SecureModeReturnURL:"https://www.myurl.com"
                                 
                                }, function(err, payin, res){
                                    if(err){
                                        console.log("DEBUG ERROR 1");
                                        console.log(err);
                                        callback(false);
                                    } else {
                                        //TRANSFER
                                        console.log("CALL TRANSFER");
                                        console.log(amount*100);
                                        mango.wallet.transfer({
                                            AuthorId : user.paymentInfos.accountId, 
                                            DebitedFunds: {
                                                    Currency : "EUR", 
                                                    Amount : ""+amount*100
                                            }, 
                                            Fees : {
                                                    Currency : "EUR", 
                                                    Amount : ""+fees*100
                                            }, 
                                            DebitedWalletID : user.paymentInfos.walletId, 
                                            CreditedWalletID : seller.account.paymentInfos.walletId,
                                            CreditedUserId : seller.account.paymentInfos.accountId,
                                            Tag : "DefaultTag"
                                        }, function(err, transfer, res){
                                            if(!err){
                                                console.log("%%%%%%%%%%%%%%%%%%%%%");
                                                if(i+1 == lines.length){
                                                    callback(true);
                                                } else {
                                                    payEachLine(i+1, user, card, lines);
                                                }
                                            } else {
                                                console.log("error transfer");
                                                console.log(user.paymentInfos.accountId);
                                                console.log(err);
                                                console.log("DEBUG ERROR 2");
                                                callback(false);
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log("ERROR CREATING CARD");
                                console.log(err);
                                console.log(card.cardExpirationDate);

                                console.log("DEBUG ERROR 3");
                                callback(false);
                            }
                        }); 
                    }

                }
                payEachLine(0, user, card, lines);


            }
        });
    },

    payByCard : function(){
        
    }

};

module.exports.Provider = Provider;
