var ServiceHelper = require('./service.helper').ServiceHelper;

/**
 * Chargement des universités (utile pour la searchBar)
 * @class SchoolsHelper
 */
var SchoolsHelper = {

    loadUniversity : function(req){
        if(req.cookies.position !== undefined && req.cookies.position.universityId !== undefined)
            return req.cookies.position.universityId;
        else if(req.session.position !== undefined && req.session.position.universityId !== undefined)
            return req.session.position.universityId;
        else
            return "All";
    },

    loadSchool : function(model, filter, callback){
        ServiceHelper.getService('school', 'getSchoolByUrlId', {data: { universityId : filter.university }, method : "POST"}, function(school){
            model.universityName = school.name;
            model.currentSchool = school;
            ServiceHelper.getService('school', 'getSchools', {data: {}, method : "POST"}, function(schools){
                var otherSchools = [];
                for (var i = schools.length - 1; i >= 0; i--) {
                    if(schools[i].name != model.currentSchool.name)
                        otherSchools.push(schools[i]);
                };
                model.otherSchools = otherSchools;
                callback(model);
            });
        });
    }

};


module.exports.SchoolsHelper = SchoolsHelper;