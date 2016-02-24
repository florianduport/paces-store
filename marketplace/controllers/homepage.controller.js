var model = require('../models/homepage.model').HomepageModel,
  html = require('express-handlebars'),
  promise = require('promise');
var HomepageController = {

  initialize: function(req, res) {

    HomepageController.app;

    model.initialize(req, res, function(model) {
      res.render('pages/homepage', {
        model: model,
        layout: null
      });
    });
  }

};

module.exports.HomepageController = HomepageController;
