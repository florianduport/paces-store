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
                            console.log("========== false2");
                            done(false);
                        }
                        done({user : user, wallet : wallet});
                    });
                }   
            });

        } else {
            console.log("========== false1");
            console.log(infos);
            console.log(infos !== undefined);
            console.log(infos.username !== undefined);
            console.log(infos.firstName !== undefined);
            console.log(infos.lastName !== undefined);
            done(false);
        }

    },

    getUsers : function(done){
        ConfigurationHelper.getConfig({application : 'marketplace', done : function(configuration){
                var mango = require('mangopay')(configuration.mangopay);
                 mango.user.list(function(err,users){
                    done(users); 
                });
            }
        });
    },

    payWithNewCard : function(user, card, lines, done){

        function payEachLine(i) {
            if(i<lines.length) {
                seller = lines[i].seller;
                amount = lines[i].amount;

                var fees = (10/100)*amount;

                mango.card.create({
                  UserId: user.account.paymentInfos.accountId,
                  CardNumber: card.cardNumber,
                  CardExpirationDate: card.cardExpirationDate,
                  CardCvx: card.cardCvx,
                }, function(err, card, res){
                    if(!err){

                        //TRANSFER

                        mango.wallet.transfer({
                            AuthorId : user.account.paymentInfos.accountId, 
                            DebitedFunds: {
                                    Currency : "EUR", 
                                    Amount : ""+amount
                            }, 
                            Fees : {
                                    Currency : "EUR", 
                                    Amount : ""+fees
                            }, 
                            DebitedWalletID : user.account.paymentInfos.accountId, 
                            CreditedWalletID : seller.account.paymentInfos.walletId,
                            CreditedUserId : seller.account.paymentInfos.accountId,
                            Tag : "DefaultTag"
                        }, function(err, transfer, res){
                            if(!err){
                                if(i+1 == lines.length){
                                    done(true);
                                } else {
                                    payEachLine(i+1);
                                }
                            } else {
                                done(false);
                            }
                        });

                    } else {
                        done(false);
                    }
                }); 
            }

        }
        payEachLine(0);





    }

};

module.exports.Provider = Provider;
