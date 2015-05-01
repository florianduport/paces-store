var model = require('../models/account.model').AccountModel;

var AccountController = {

	initialize : function(req, res){
	    model.initialize(req, function(model){
	    	/*if(!model)
	    		res.redirect(301, '/'+req.params.appId+'/error');
	    	else
	        	res.render(model.type+'/pages/articles', {model: model});*/
	    });
	},
	
    /**
    * checkSignIn : Vérifie si l'utilisateur est connecté
    * @param req : requête http
    * @param res : reponse http
    * @param next : méthode de callback
    */
    checkSignIn : function(req, res, next){
        if(req.session.user !== undefined)
        {
            next();
        }
        else
        {
            model.displaySignIn(req, function(model){
                res.render('pages/signIn', {model: model});
            }); 
        }
    },

    /**
    * signIn : Connexion 
    * @param req : requête http
    * @param res : reponse http
    */
    signIn : function(req, res){
        var done = function(authenticated){
            res.redirect(req.get('referer'));
        };
        model.signIn(req.body.username, req.body.password, req, done);
    },

    /**
    * signUp : Création de compte 
    * @param req : requête http
    * @param res : reponse http
    */
    displaySignUp : function(req, res){
        model.displaySignUp(req, function(model){
            if(req.body !== undefined && req.body.ajax == "true"){
                res.render('pages/signUp', {model: model, layout : null});
            } else {
                res.render('pages/signUp', {model: model});
            }
        });
    },

    /**
    * signUp : Création de compte 
    * @param req : requête http
    * @param res : reponse http
    */
    signUp : function(req, res){
        var referer = req.get('referer');
        if(req.body !== undefined && req.body.referer !== undefined){
            referer = req.body.referer;
        }
        model.signUp(req, function(result){
            if(!result){
                res.render('pages/signUp', {model: {error: true, referer : req.get('referer')}});
            } else {
                model.signIn(req.body.username, req.body.password, req, function(){
                    res.redirect(referer);
                });
                
            }
        });
    },

    /**
    * signOut : Déconnexion 
    * @param req : requête http
    * @param res : reponse http
    */
    signOut : function(req, res){
        req.session.user = undefined;
        res.redirect('/');
    },

    createCustomer : function(req, res){
    	if(req.session.user === undefined && 
    		req.body.username !== undefined && 
    		req.body.password !== undefined &&
    		req.body.firstName !== undefined &&
    		req.body.lastName !== undefined){
    		var reqSignin = req;
    		model.createCustomer({
    			username : req.body.username,
    			password : req.body.password,
    			firstName : req.body.firstName,
    			lastName : req.body.lastName
    		}, req, function(resp){
    			if(resp){
    				var done = function(authenticated){
			            res.redirect(req.get('referer'));
			        };
			        AccountController.signIn(reqSignin, res);
    			}
    			else{
    				res.redirect(req.get('referer'));
    			}
    		});
    	}
    }

};

module.exports.AccountController = AccountController;

