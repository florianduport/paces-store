var MongoClient = require('mongodb').MongoClient,
LocalConfig = require('./../configuration.local').LocalConfig;
DatabaseInstance = undefined;
/**
 * Connexion à la BDD
 * @class DatabaseHelper
 */
var DatabaseHelper = {

    getDatabase : function(ToExecute){
        if(DatabaseInstance !== undefined) {
            ToExecute(DatabaseInstance);
            return;
        } else {
            DatabaseHelper._openNewConnection(ToExecute);
        } 
    },

    _openNewConnection : function(ToExecute){
        MongoClient.connect(LocalConfig.database.address, function(err, db) {
            if(err){
                console.log(err);
                DatabaseHelper._openNewConnection(ToExecute);
            } else {
                DatabaseInstance = db;
                ToExecute(DatabaseInstance);
            }
        });
    }

};


module.exports.DatabaseHelper = DatabaseHelper;