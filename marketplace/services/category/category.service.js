var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
  ObjectID = require('mongodb').ObjectID

/**
 * Service Category
 * @class CategoryService
 */
var CategoryService = {


  getCategories: function(done) {
    DatabaseHelper.getDatabase(function(db) {
      db.collection("Categories", function(err, categoriesCollection) {
        if (err || !categoriesCollection) {
          return done(false);
        }
        categoriesCollection.find({}).sort({
          order: 1
        }).toArray(function(err, categories) {
          if (err || !categories) {
            return done(false);
          }
          return done(categories);
        });
      });
    });
  }
};

module.exports.CategoryService = CategoryService;
