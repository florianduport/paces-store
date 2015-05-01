ConfigurationHelper = require('./configuration.helper').ConfigurationHelper;
Request = require('request');
var mailchimpApi = require('mailchimp-api');

/**
 * Gestion des mails ( + MailChimp)
 * @class ConfigurationHelper
 */
var MailHelper = {

	subscribe : function(infos){
		MailHelper.mailChimpSubscribe(infos);
	},

    /**
    * subscribe a new customer on mailchimp
    */
    mailChimpSubscribe : function(infos){
    	ConfigurationHelper.getConfig({application: 'marketplace', done: function (configuration) {


    		Request({
                 uri : "https://us10.api.mailchimp.com/2.0/lists/list",
                 method : "POST",
                 headers: {
                      "Content-Type": "application/json"
                 },
                 timeout : 15000,
                 json : {
                 	apikey : configuration.mailchimp.key,
                 	filters  : {
                 		list_name : "Paces-Store"
                 	}
                 }
            }, function(error, response, body){
                 //console.log(error);
                 //console.log(response);
                 
                 if(!error){
                 	var list = body.data[0];

					var data = {
		    			apikey : configuration.mailchimp.key,
		    			id : list.id,
		    			email : {
		    				email : infos.username
		    			},
		    			merge_vars : {
		    				fname : infos.firstName,
		    				lname : infos.lastName
		    			},
		    			double_optin : false,
		    			send_welcome : true
		    		};
                 	Request({
		                 uri : "https://us10.api.mailchimp.com/2.0/lists/subscribe",
		                 method : "POST",
		                 headers: {
		                      "Content-Type": "application/json"
		                 },
		                 timeout : 15000,
		                 json : data
		            }, function(error, response, body){
		            	console.log(body);
		                return true;
		            });
                 }
                 
                 return true;
            });

    		/*

    		*/


    	}});
    }



};

module.exports.MailHelper = MailHelper;