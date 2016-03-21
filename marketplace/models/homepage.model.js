var Geocoder = require('node-geocoder').getGeocoder("openstreetmap", "http", {});
var IpGeocoder = require('node-geocoder').getGeocoder("freegeoip", "http", {});
var Geolib = require('geolib'),
ServiceHelper = require('../helpers/service.helper').ServiceHelper,
cookieParser = require('cookie-parser')

var HomepageModel = {

  initialize: function(req, res, callback) {
    this.position = req.session.position;
    var model = this;
    model.user = req.session.user;
    ServiceHelper.getService('school', 'getSchools', {
      data: {},
      method: "POST"
    }, function(schools) {

      if (!schools)
        callback(false);
      else {
        model.schools = schools;
        
        ServiceHelper.getService('productList', 'getProductsByFilter', {
          data: {
            filter: {},
            order: {},
            limit: 8
          },
          method: "POST"
        }, function(products) {
          model.products = products;
          callback(model);
          
        });
        
        
      }
    });
  },

  loadSchool: function(req, schools, model, callback) {
    var schoolIndex = schools.length - 1;
    var schoolDistance = 0;

    for (var i = schools.length - 1; i >= 0; i--) {
      var distance = Geolib.getDistance({
        latitude: model.position.latitude,
        longitude: model.position.longitude
      }, {
        latitude: schools[i].latitude,
        longitude: schools[i].longitude
      });
      if (distance <= schoolDistance || i == schools.length - 1) {
        schoolIndex = i;
        schoolDistance = distance;
      }
    }

    model.school = schools[schoolIndex];
    callback(model);
  }
};

module.exports.HomepageModel = HomepageModel;
