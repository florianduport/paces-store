var html = require('express-handlebars'),
  layouts = require('handlebars-layouts'),
  path = require('path');
/**
 * Chargement de handlebars (utilisé dans le main.js)
 * @class HandlebarsHelper
 */
var HandlebarsHelper = {
  initHandlebars: function(app) {
    var handlebars = html.create({
      layoutsDir: path.join(app.settings.views, ""),
      defaultLayout: 'layout',
      extname: '.html',
      partialsDir: [
        __dirname + '/../views/blocks/',
        __dirname + '/../views/pages/seller/blocks/'
      ]
    });

    HandlebarsHelper.initHelpers(handlebars);

    //load partials views
    handlebars.getPartials().then(function(partials) {
      app.partials = partials;
    });
    layouts(handlebars.handlebars);

    return handlebars.engine;
  },
  initHelpers: function(handlebars) {



    handlebars.handlebars.registerHelper('contains', function(v1, operator, v2, options) {
      return v1.indexOf(v2) > -1 ? options.fn(this) : options.inverse(this);
    });

    handlebars.handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
      console.log(v1);
      console.log(v2);
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });
    handlebars.handlebars.registerHelper("prettifyDate", function(timestamp) {
      return new Date(timestamp).toString('yyyy-MM-dd')
    });

    handlebars.handlebars.registerHelper('contains', function(v1, operator, v2, options) {
      return v1.indexOf(v2) > -1 ? options.fn(this) : options.inverse(this);
    });

    handlebars.handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
      console.log(v1);
      console.log(v2);
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });

  }

};


module.exports.HandlebarsHelper = HandlebarsHelper;
