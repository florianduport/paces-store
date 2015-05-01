var MongoClient = require('mongodb').MongoClient;
ConfigurationLocalHelper = require('./configuration.local.helper').ConfigurationLocalHelper,
LocalConfig = require(ConfigurationLocalHelper.getLocalConfigFile(module.parent.parent.id)).LocalConfig;

/**
 * Connexion à la BDD
 * @class DatabaseHelper
 */
var DatabaseHelper = {

    DatabaseInstance : undefined,

    dbOptions : {
        server: {
            'auto_reconnect': true,
            'poolSize': 20,
            socketOptions: {keepAlive: 1}  
        }
    },

    getDatabase : function(ToExecute){
        if(DatabaseHelper.DatabaseInstance !== undefined) {
            ToExecute(DatabaseHelper.DatabaseInstance);
            return;
        } else {
            DatabaseHelper._openNewConnection(ToExecute);
        } 
    },

    _openNewConnection : function(ToExecute){
        MongoClient.connect(LocalConfig.database.address, DatabaseHelper.dbOptions, function(err, db) {
            if(err){
                console.log(err);
                DatabaseHelper._openNewConnection(ToExecute);
            } else {
                DatabaseHelper.DatabaseInstance = db;
                ToExecute(DatabaseInstance);
            }
        });
    }
};


module.exports.DatabaseHelper = DatabaseHelper;