var ServiceHelper = require('./service.helper').ServiceHelper;

/**
 * Chargement des universités (utile pour la searchBar)
 * @class SchoolsHelper
 */
var SchoolsHelper = {

  loadUniversity: function(req) {
    if (req.cookies.position !== undefined && req.cookies.position.universityId !== undefined)
      return req.cookies.position.universityId;
    else if (req.session.position !== undefined && req.session.position.universityId !== undefined)
      return req.session.position.universityId;
    else
      return "All";
  },

  loadSchool: function(params) {
    var model = params.model;
    var filter = params.filter !== undefined ? params.filter : {
      university: SchoolsHelper._getUniversityId(model.req)
    };
    var callback = params.callback;

    ServiceHelper.getService('school', 'getSchoolByUrlId', {
      data: {
        universityId: filter.university
      },
      method: "POST"
    }, function(school) {
      model.universityName = school.name;
      model.currentSchool = school;
      ServiceHelper.getService('school', 'getSchools', {
        data: {},
        method: "POST"
      }, function(schools) {
        var otherSchools = [];
        for (var i = schools.length - 1; i >= 0; i--) {
          if (schools[i].name != model.currentSchool.name)
            otherSchools.push(schools[i]);
        };
        model.otherSchools = otherSchools;
        callback(model);
      });
    });
  },

  _getUniversityId: function(req) {
    var universityId;

    if (req.params.universityId !== undefined && req.params.universityId)
      universityId = req.params.universityId;
    else if (req.cookies.position !== undefined)
      universityId = req.cookies.position.universityId;
    else if (req.session.position !== undefined)
      universityId = req.session.position.universityId;
    else
      universityId = "all";

    return universityId;
  },

};


module.exports.SchoolsHelper = SchoolsHelper;
