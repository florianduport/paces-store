/**
 * Configuration de l'application
 * @class ConfigurationHelper
 */
var ConfigurationLocalHelper = {

    /**
    * getLocalConfigFile
    * @params module id = chemin du ficheir appelant 
    * @return le chemin du fichier configuration.local.js
    */
    getLocalConfigFile : function(moduleId){
        if(moduleId.indexOf("marketplace") > 0)
            return './../../marketplace/configuration.local';
    }

};

module.exports.ConfigurationLocalHelper = ConfigurationLocalHelper;