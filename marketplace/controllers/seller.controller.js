var model = require('../models/seller.model').SellerModel;

var SellerController = {
  displaySellerHome: function(req, res) {
    model.displaySellerHome(req, function(model) {
      res.render('pages/seller/home', {
        model: model,
        layout: 'pages/seller/layout'
      });
    });
  },
  /**
   * checkSignIn : Vérifie si l'utilisateur est connecté
   * @param req : requête http
   * @param res : reponse http
   * @param next : méthode de callback
   */
  checkSignIn: function(req, res, next) {

    if (req.session.seller !== undefined) {
      next();
    } else {
      model.displaySignIn(req, function(model) {
        res.render('pages/seller/signIn', {
          model: model
        });
      });
    }
  },
  /**
   * signIn : Connexion
   * @param req : requête http
   * @param res : reponse http
   */
  signIn: function(req, res) {
    var done = function(authenticated) {
      res.redirect(req.get('referer'));
    };
    model.signIn(req.body.username, req.body.password, req, done);
  },
  /**
   * signUp : Création de compte
   * @param req : requête http
   * @param res : reponse http
   */
  displaySignUp: function(req, res) {
    model.displaySignUp(req, function(model) {
      if (req.body !== undefined && req.body.ajax == "true") {
        res.render('pages/seller/signUp', {
          model: model,
          layout: null
        });
      } else {
        res.render('pages/seller/signUp', {
          model: model
        });
      }
    });
  },
  /**
   * signUp : Création de compte
   * @param req : requête http
   * @param res : reponse http
   */
  signUp: function(req, res) {
    var referer = req.get('referer');
    if (req.body !== undefined && req.body.referer !== undefined) {
      referer = req.body.referer;
    }
    model.signUp(req, function(result) {
      if (!result) {
        res.render('pages/seller/signUp', {
          model: {
            error: true,
            referer: req.get('referer')
          }
        });
      } else {
        model.signIn(req.body.username, req.body.password, req, function() {
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
  signOut: function(req, res) {
    req.session.seller = undefined;
    res.redirect('/');
  },
  displayForgottenPassword: function(req, res) {
    model.displayForgottenPassword(req, function(model) {
      res.render('pages/seller/forgottenPassword', {
        model: model
      });
    });
  },
  forgottenPassword: function(req, res) {
    model.forgottenPassword(req, function(model) {
      res.render('pages/seller/forgottenPassword', {
        model: model
      });
    });
  },
  displayChangePassword: function(req, res) {
    model.displayChangePassword(req, function(model) {
      if (!model) {
        res.status(404);
        res.render('pages/error');
      } else {
        res.render('pages/seller/changePassword', {
          model: model
        });
      }
    });
  },
  changePassword: function(req, res) {
    model.changePassword(req, function(model) {
      res.redirect('/');
    });
  },
  displayProducts: function(req, res) {
    model.displayProducts(req, function(model) {
      if (!model) {
        res.status(404);
        res.render('pages/error');
      } else {
        res.render('pages/seller/productList', {
          model: model,
          layout: 'pages/seller/layout'
        });
      }
    });
  },
  editProduct: function(req, res) {
    model.editProduct(req, function(model) {
      res.render('pages/seller/productForm', {
        model: model,
        layout: 'pages/seller/layout'
      });
    });
  },
  addProduct: function(req, res) {
    model.addProduct(req, function(model) {
      res.render('pages/seller/productForm', {
        model: model,
        layout: 'pages/seller/layout'
      });
    });
  },
  saveProduct: function(req, res) {
    model.saveProduct(req, function(model) {
      res.redirect('/seller/products');
    });
  },
  displayEditAccount: function(req, res) {
    model.displayEditAccount(req, function(model) {
      res.render('pages/seller/account', {
        model: model,
        layout: 'pages/seller/layout'
      });
    });
  },
  editAccount: function(req, res) {
    model.editAccount(req, function(model) {
      res.redirect('/seller');
    });
  },
  withdrawMoney: function(req, res) {
    model.withdrawMoney(req, function(model) {
      res.render('pages/seller/withdrawMoney', {
        model: model,
        layout: 'pages/seller/layout'
      });
    });
  },
  wallet: function(req, res) {
    model.wallet(req, function(model) {
      res.render('pages/seller/wallet', {
        model: model,
        layout: 'pages/seller/layout'
      });
    });
  }
};

module.exports.SellerController = SellerController;
