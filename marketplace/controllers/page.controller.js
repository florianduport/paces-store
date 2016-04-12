var model = require('../models/page.model').PageModel,
  https = require("https");
var ConfigurationHelper = require('../helpers/configuration.helper').ConfigurationHelper;

var PageController = {
  initialize: function(req, res) {
    model.initialize(req, function(model) {
      if (model == false) {
        res.status(404);
        res.render('pages/error');
      }
    });
  },
  initializeError: function(req, res) {
    model.initializeError(req, function(model) {
      res.render(model.type + "/error", {
        model: model
      });
    });
  },
  initializeGeoloc: function(req, res, next) {
    model.initializeGeoloc(req, function(model) {
      res.cookie("position", model.position);
      req.session.position = model.position;
      next();
    });
  },
  getGeolocZone: function(req, res) {
    model.getGeolocZone(req, function(model) {
      res.cookie("position", model.position);
      req.session.position = model.position;
      res.render('blocks/geolocZone', {
        model: model,
        layout: null
      });
    });
  },
  displayContact: function(req, res) {
    model.displayContact(req, function(model) {
      res.render('pages/contact', {
        model: model
      });
    });
  },
  contactUs: function(req, res) {
    model.contactUs(req, function(model) {
      res.render('pages/contact', {
        model: model
      });
    });
  },
  displayAbout: function(req, res) {
    var model = {};
    model.user = req.session.user;
    res.render('pages/about', {model : model});
  },
  test: function(req, res) {
    /*var options = {
     Host: 'api.sandbox.mangopay.com',
     port: 443,
     path: '/v2/paces-store/',
     Authorization : 'Basic cGFjZXNzdG9yZTpWdDU2eVdUbmFnbTM3VzJHTHJrS2p1eGU3UEdKVlVTYXM3M3NoQm12Q01CNURPN0hBVg==',
     "Content-Type" : 'application/json'
     };


     options = {};
     options.host = "www.google.fr";
     options.port = 443;
     options.path = "/";

     request = https.get(options, function(response){
     var body = "";
     response.on('data', function(data) {
     body += data;
     });
     response.on('end', function() {
     res.send(body);
     })
     response.on('error', function(e) {
     res.send("Got error: " + e.message);
     });
     });*/
    model.test(req, function(model) {
      res.send(model);
    });


  },
  testInc: function(req, res) {

    var i = 0;
    while (i < 100) {
      model.testInc(i, function(model) {
      });
      i++;
    }
    res.send("ok");
  }
};

module.exports.PageController = PageController;
