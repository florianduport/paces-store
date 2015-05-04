ConfigurationHelper = require('./configuration.helper').ConfigurationHelper;
Request = require('request');
var mailchimpApi = require('mailchimp-api');
var mandrill = require('mandrill-api/mandrill');

/**
 * Gestion des mails ( + MailChimp)
 * @class ConfigurationHelper
 */
var MailHelper = {

	subscribe : function(infos){
		ConfigurationHelper.getConfig({application: 'marketplace', done: function (configuration) {

			MailHelper.mailChimpSubscribe(configuration, infos);


			var mandrill_client = new mandrill.Mandrill(configuration.mail.mandrill.key);
			var template_name = "mail-de-bienvenue";
			var template_content = [{
			        "name": "EMAIL",
			        "content": infos.username
			    }];
			var message = {
			    "html": "<p>Example HTML content</p>",
			    "text": "Bienvenue !",
			    "subject": "Merci pour votre inscription",
			    "from_email": "noreply@paces-store.fr",
			    "from_name": "Paces-Store",
			    "to": [{
			            "email": infos.username,
			            "name": infos.firstName + " " + infos.lastName,
			            "type": "to"
			        }]
			};
			var async = false;
			var ip_pool = "Main Pool";
			mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool, "send_at": Date.now}, function(result) {
				//NOTHING TO DO
			}, function(e) {
			    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
			});
		}});

	},

    /**
    * subscribe a new customer on mailchimp
    */
    mailChimpSubscribe : function(configuration, infos){
		Request({
             uri : "https://us10.api.mailchimp.com/2.0/lists/list",
             method : "POST",
             headers: {
                  "Content-Type": "application/json"
             },
             timeout : 15000,
             json : {
             	apikey : configuration.mail.mailchimp.key,
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
	    			apikey : configuration.mail.mailchimp.key,
	    			id : list.id,
	    			email : {
	    				email : infos.username
	    			},
	    			merge_vars : {
	    				fname : infos.firstName,
	    				lname : infos.lastName
	    			},
	    			update_existing : true,
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
    },

    contactUs : function(infos){
		ConfigurationHelper.getConfig({application: 'marketplace', done: function (configuration) {

			var mandrill_client = new mandrill.Mandrill(configuration.mail.mandrill.key);
			var template_name = "mail-de-contact";
			var template_content = 
				[{
			        "name": "USERNAME",
			        "content": infos.username
			    },
			    {
			        "name": "EMAIL",
			        "content": infos.email
			    },
			    {
			    	"name": "SUBJECTMESSAGE",
			        "content": infos.subject
			    },
			    {
			    	"name": "MESSAGE",
			        "content": infos.message
			    }];
			var message = {
			    "html": "<p>Example HTML content</p>",
			    "text": "Bienvenue !",
			    "subject": "Formulaire de contact Paces-Store",
			    "from_email": "noreply@paces-store.fr",
			    "from_name": "Paces-Store",
			    "to": [{
			            "email": "florianduport@gmail.com",
			            "name": "Florian Duport",
			            "type": "to"
			        },{
			            "email": "paxeld@gmail.com",
			            "name": "Pierre-Axel Domicile",
			            "type": "to"
			        },{
			            "email": "admingrospigeon@gmail.com ",
			            "name": "Big Pigeon",
			            "type": "to"
			        }],
			    "global_merge_vars" :  
				[{
			        "name": "USERNAME",
			        "content": infos.username
			    },
			    {
			        "name": "USEREMAIL",
			        "content": infos.email
			    },
			    {
			    	"name": "SUBJECTMESSAGE",
			        "content": infos.subject
			    },
			    {
			    	"name": "MESSAGE",
			        "content": infos.message
			    }]
			};
			var async = false;
			var ip_pool = "Main Pool";


			mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool, "send_at": Date.now}, function(result) {
				//NOTHING TO DO
			}, function(e) {
			    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
			});
		}});    	
    }



};

module.exports.MailHelper = MailHelper;