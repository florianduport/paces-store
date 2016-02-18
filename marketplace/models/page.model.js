var Geocoder = require('node-geocoder').getGeocoder("openstreetmap", "http", {});
var IpGeocoder = require('node-geocoder').getGeocoder("freegeoip", "http", {});
var Geolib = require('geolib');
var ServiceHelper = require('../helpers/service.helper').ServiceHelper;
var MailHelper = require('../helpers/mail.helper').MailHelper;

var PageModel = {

  initialize: function(req, callback) {
    this.appId = req.params.appId;
    callback(false);

  },

  initializeError: function(req, callback) {
    this.appId = req.params.appId;

    ServiceHelper.getService('application', 'getApplicationType', {
      data: {
        "appId": this.appId
      },
      method: "POST"
    }, function(type) {
      if (type === false)
        callback(false);
      this.type = type;
      callback(this);
    })
  },

  initializeGeoloc: function(req, callback) {
    this.position = req.session.position;
    var model = this;
    this.loadPosition(req, this, function(model) {
      if (model.position !== undefined && model.position.universityId === undefined) {
        //console.log("here");
        //console.log(model.position);
        ServiceHelper.getService('school', 'getSchools', {
          data: {},
          method: "POST"
        }, function(schools) {

          if (!schools) {
            callback(false);
          } else {
            model.loadSchool(req, schools, model, function(model) {
              if (model.position.city === undefined || model.position.city === "") {
                model.position.city = model.school.city;
              }
              model.position.universityId = model.school.universityId;
              //console.log(model.position.universityId);

              callback(model);
            });
          }
        });
      } else {
        callback(model);
      }
    });

  },

  loadSchool: function(req, schools, model, callback) {
    var schoolIndex = schools.length - 1;
    var schoolDistance = 0;

    for (var i = schools.length - 1; i >= 0; i--) {
      try{
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
      } catch(e){
        console.log("ERROR GEOLOC");
        console.log(model.position);
      }
    }

    model.school = schools[schoolIndex];
    model.otherSchools = []
    for (var i = schools.length - 1; i >= 0; i--) {
      if (i != schoolIndex)
        model.otherSchools.push(schools[i]);
    };
    callback(model);
  },

  loadPosition: function(req, model, callback) {
    if (req.cookies.position !== undefined) {
      //Si on a une position dans les cookies => on l'utilise

      if (req.cookies.position.isNew !== undefined && req.cookies.position.isNew && !req.cookies.position.isAlreadyCalculated) {
        //Si l'utilisateur vient de mettre à jour sa géoloc => on recharge la Ville
        Geocoder.reverse(req.cookies.position.latitude, req.cookies.position.longitude, function(err, res) {
          if (!err && res !== undefined && res.length > 0) {
            model.position = req.cookies.position;
            model.position.isNew = false;
            model.position.city = res[0].city !== undefined ? res[0].city : model.position.city;
            model.position.latitude = req.cookies.position.latitude;
            model.position.longitude = req.cookies.position.longitude;
            model.position.isAlreadyCalculated = true;
          }
          callback(model);
        });
      } else {
        model.position = req.cookies.position;
        callback(model);
      }
    } else {
      //Sinon on géolocalise par l'IP

      //tips to debug
      var remoteAddress = req.socket.remoteAddress == "127.0.0.1" ? "88.121.230.3" : req.socket.remoteAddress;

      IpGeocoder.geocode(remoteAddress, function(err, res) {
        if (!err && res !== undefined && res.length > 0) {
          model.position = {};
          model.position.latitude = res[0].latitude;
          model.position.longitude = res[0].longitude;
          model.position.city = res[0].city;
          model.position.isNew = false;
          model.position.isAlreadyCalculated = false;
        } else {
          //that's baaaaaad

          model.position = {
            latitude: "48.856614",
            longitude: "2.352222",
            city: undefined,
            isNew: false,
            isAlreadyCalculated: false
          };
        }
        callback(model);
      });
    }
  },

  getGeolocZone: function(req, callback) {

    var model = this;
    model.position = req.session.position;
    PageModel.loadPosition(req, this, function(model) {
      ServiceHelper.getService('school', 'getSchools', {
        data: {},
        method: "POST"
      }, function(schools) {

        if (!schools) {
          callback(false);
        } else {
          PageModel.loadSchool(req, schools, model, function(model) {
            if (model.position.city === undefined || model.position.city === "") {
              model.position.city = model.school.city;
            }
            model.position.universityId = model.school.universityId;
            //console.log(model.position.universityId);
            callback(model);
          });

        }
      });
    });

  },

  displayContact: function(req, callback) {
    this.email = req.session.user;
    callback(this);
  },

  contactUs: function(req, callback) {
    this.email = req.session.user;
    var model = this;
    MailHelper.contactUs(req.body);
    model.formSuccess = true;
    callback(model);
  },

  test: function(req, callback) {
    var model = this;
    ServiceHelper.getService('payment', 'getUsers', {
      data: {},
      method: "POST"
    }, function(users) {
      model.users = users;
      callback(model);
    })
  },

  testInc: function(i, callback) {
    //console.log(i);
    callback(this);
  }
};

module.exports.PageModel = PageModel;
