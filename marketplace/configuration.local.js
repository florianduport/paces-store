/**
 * Surcharge de la configuration en BDD
 * @class LocalConfig
 */
var LocalConfig = {

  /**
   * Override attributes form db config here
   */
  //pbligatoire
  database: {
    address: "mongodb://paces-store:Answer&&Pigeon2010@94.23.203.174:27017/paces-store"
  },

  addressBasePath: "https://paces-store-jewelz.c9users.io",
  port: 8080,
  hmacEnabled: false,
  debugEnabled: false,
  parentFolder: "/home/florian/paces-store/marketplace/"

};

module.exports.LocalConfig = LocalConfig;
