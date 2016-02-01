var DatabaseHelper = require('../../helpers/database.helper').DatabaseHelper,
  ObjectID = require('mongodb').ObjectID
  /**
   * Service School
   * @class SchoolService
   */
var SchoolService = {

  /**
   * getSchoolById : Récupère une université en base par son ID
   * @param shoolId : l'id de l'université
   * @param done : la méthode de retour
   * @return Produit / Sinon False
   */
  getSchoolById: function(schoolId, done) {
    DatabaseHelper.getDatabase(function(db) {
      db.collection("Schools", function(err, schoolsCollection) {
        if (err || !schoolsCollection) {
          return done(false);
        }
        schoolsCollection.findOne({
          _id: ObjectID(schoolId)
        }, function(err, school) {
          if (err || !school) {
            return done(false);
          }
          return done(school);
        });
      });
    });
  },

  /**
   * getSchoolByUrlId : Récupère une université en base par son url
   * @param shoolUrlId : l'url de l'université
   * @param done : la méthode de retour
   * @return Produit / Sinon False
   */
  getSchoolByUrlId: function(shoolUrlId, done) {
    DatabaseHelper.getDatabase(function(db) {
      db.collection("Schools", function(err, schoolsCollection) {
        if (err || !schoolsCollection) {
          console.log(err);
          return done(false);
        }
        schoolsCollection.findOne({
          universityId: shoolUrlId
        }, function(err, school) {
          if (err || !school) {
            return done(false);
          }
          return done(school);
        });
      });
    });
  },

  getSchools: function(done) {
    DatabaseHelper.getDatabase(function(db) {
      db.collection("Schools", function(err, schoolsCollection) {
        if (err || !schoolsCollection) {
          return done(false);
        }
        schoolsCollection.find({}).toArray(function(err, schools) {
          if (err || !schools) {
            return done(false);
          }
          return done(schools);
        });
      });
    });
  }

  /*createSchool : function(name, description, price, city, seller, done){
      DatabaseHelper.getDatabase(function(db){
          db.collection("Schools", function(err, Schools){
              if (err || !Schools)
              {
                  return done(false);
              }

              var SchoolObject = {
                  name : name,
                  description : description,
                  price : price,
                  city : city,
                  seller : seller,
                  data : {
                      sellCount : 0,
                      alertCount : 0
                  }
              }

              Schools.insert(SchoolObject, { w: 0 });
          });
      });
  },

  updateSchool : function(id, name, description, price, city, done){
      DatabaseHelper.getDatabase(function(db){
          db.collection("Schools", function(err, Schools){
              if (err || !Schools)
              {
                  return done(false);
              }

              collection.update({ _id: ObjectID(id)}, {$set:{
                      name : name,
                      description : description,
                      price : price,
                      city : city
              }});
          });
      });
  }*/
};

module.exports.SchoolService = SchoolService;
