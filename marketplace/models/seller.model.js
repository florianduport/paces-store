var ServiceHelper = require('../helpers/service.helper').ServiceHelper,
  MailHelper = require('../helpers/mail.helper').MailHelper,
  fs = require('fs'),
  sha1 = require('sha1');
var ConfigurationHelper = require('../helpers/configuration.helper').ConfigurationHelper;
var SchoolsHelper = require('../helpers/schools.helper').SchoolsHelper;

var SellerModel = {
  displaySellerHome: function(req, callback) {
    var model = this;
    ServiceHelper.getService("seller", "getSellerByUsername", {
      data: {
        username: req.session.seller
      },
      method: "POST"
    }, function(seller) {

      model.seller = seller;

      ServiceHelper.getService("order", "getCountBySeller", {
        data: {
          seller: req.session.seller
        },
        method: "POST"
      }, function(result) {
        if (!result)
          model.seller.sellCount = 0;
        else
          model.seller.sellCount = result.count;

        ServiceHelper.getService("order", "getOrdersBySeller", {
          data: {
            seller: req.session.seller
          },
          method: "POST"
        }, function(result) {
          model.seller.orders = result;

          ServiceHelper.getService("payment", "getWalletInfos", {
            data: {
              paymentInfos: model.seller.account.paymentInfos
            },
            method: "POST"
          }, function(walletInfos) {
            if (walletInfos)
              model.seller.sellBalance = walletInfos[0].Balance.Amount;

            ConfigurationHelper.getConfig({
              application: 'marketplace',
              done: function(configuration) {
                model.withdrawEnabled = configuration.minWithdrawAmount < model.seller.sellBalance;
                callback(model);
              }
            });

          });

        });

      });

    });
  },
  initialize: function(req, callback) {

  },
  displaySignIn: function(req, callback) {
    var model = this;
    model.req = req;
    model.displayCheckoutSteps = false;
    if (req.get('referer') !== undefined && req.get('referer').indexOf("checkout") > -1) {
      model.displayCheckoutSteps = true;
    }
    callback(model);
  },
  displaySignUp: function(req, callback) {
    var model = this;
    model.req = req;

    SchoolsHelper.loadSchool({
      model: model,
      callback: function(model) {
        if (req.session.error)
          model.error = req.session.error;
        else
          model.error = false;
        callback(model);
      }
    });
  },
  signIn: function(username, password, req, done) {


    ServiceHelper.getService("seller", "authenticateSeller", {
      data: {
        username: username,
        password: sha1(password)
      },
      method: "POST"
    }, function(resp) {
      if (resp === undefined || !resp || resp !== true) {
        req.session.error = true;
        return done(false);
      }
      req.session.error = false;
      req.session.seller = username;

      return done(true);
    });

  },
  signUp: function(req, done) {
    if (req.body !== undefined &&
      req.body.displayName !== undefined &&
      req.body.firstName !== undefined &&
      req.body.lastName !== undefined &&
      req.body.username !== undefined &&
      req.body.password !== undefined &&
      req.body.passwordConfirmation !== undefined &&
      req.body.passwordConfirmation === req.body.password) {

      SellerModel.createseller({
        username: req.body.username,
        displayName: req.body.displayName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
      }, req, function(response) {
        if (!response) {
          done(false);
        } else {
          SellerModel.signIn(req.body.username, req.body.password, req, done);
        }
      });

    } else {
      done(false);
    }

  },
  createseller: function(form, req, done) {
    ConfigurationHelper.getConfig({
      application: 'marketplace',
      done: function(configuration) {
        var bannedDomains = configuration.mail.bannedDomains;
        var domainToCheck = form.username.split("@")[1];
        var isBannedDomain = false;
        for (var i = bannedDomains.length - 1; i >= 0; i--) {
          if (bannedDomains[i] == domainToCheck)
            isBannedDomain = true;
        }

        if(form.pictureFile === undefined){
          form.pictureFile = "/img/default-profile.png";
        }
        if (isBannedDomain) {
          done(false);
        } else {

          ServiceHelper.getService("seller", "getSellerByUsername", {
            data: {
              username: form.username
            },
            method: "POST"
          }, function(response) {
            if (response) {
              //seller already exist !
              done(false);
            } else {

              ServiceHelper.getService("payment", "createWallet", {
                data: {
                  infos: {
                    username: form.username,
                    firstName: form.firstName,
                    lastName: form.lastName
                  }
                },
                method: "POST"
              }, function(paymentInfos) {
                if (paymentInfos === undefined) {
                  done(false);
                } else {
                  ServiceHelper.getService("seller", "createSeller", {
                    data: {
                      username: form.username,
                      password: form.password,
                      displayName: form.displayName,
                      firstName: form.firstName,
                      lastName: form.lastName,
                      picture: form.pictureFile,
                      paymentInfos: {
                        accountId: paymentInfos.user.Id,
                        walletId: paymentInfos.wallet.Id
                      }
                    },
                    method: "POST"
                  }, function(response) {

                    MailHelper.subscribe(form);
                    done(response);
                  });
                }
              });
            }
          });
        }
      }
    });
  },
  displayForgottenPassword: function(req, callback) {
    var model = this;
    callback(model);
  },
  forgottenPassword: function(req, callback) {
    var model = this;
    model.isPostForm = true;


    //check if seller exists
    if (req.body.username !== undefined) {
      //console.log(req.body.username);
      ServiceHelper.getService("seller", "getFullSellerByUsername", {
        data: {
          username: req.body.username
        },
        method: "POST"
      }, function(user) {
        if (user) {
          //create token :
          var token = Math.floor((Math.random() * 1000000) + 1);
          var userId = user["_id"];
          //console.log(userId);
          //attach token to user (with lifetime)
          ServiceHelper.getService("seller", "createForgottenPasswordToken", {
            data: {
              username: req.body.username,
              token: token
            },
            method: "POST"
          }, function(response) {
            if (response) {

              var changePasswordLink = "/changePassword/" + userId + "/" + token;

              //sends email
              MailHelper.changePasswordEmail({
                email: req.body.username,
                changePasswordLink: changePasswordLink
              });


              callback(model);

            }
          });
        }
      });
    } else {
      callback(false);
    }
  },
  displayChangePassword: function(req, callback) {
    var model = this;
    if (req.params.userId !== undefined && req.params.token !== undefined) {

      //check if token is valid
      ServiceHelper.getService("seller", "getSellerById", {
        data: {
          userId: req.params.userId
        },
        method: "POST"
      }, function(seller) {

        if (seller === undefined || !seller ||
          seller.changePasswordToken === undefined || !seller.changePasswordToken) {
          //console.log("here");
          callback(false);
        } else {
          var nowTimestamp = new Date();
          var expirationDate = new Date(seller.changePasswordToken.expirationDate * 1000);
          if (nowTimestamp < expirationDate && seller.changePasswordToken.token == req.params.token) {
            model.username = seller.username;
            callback(model);
          } else {
            callback(false);
          }
        }

      });
    } else {
      callback(false);
    }
  },
  changePassword: function(req, callback) {
    var model = this;
    if (req.body.newPassword !== undefined) {

      //check if token is valid
      ServiceHelper.getService("seller", "changePassword", {
        data: {
          username: req.body.username,
          newPassword: req.body.newPassword
        },
        method: "POST"
      }, function(result) {

        callback(true);

      });
    } else {
      callback(false);
    }
  },
  displayProducts: function(req, callback) {
    var filter = {
      seller: req.session.seller
    };
    var model = this;
    ServiceHelper.getService('productList', 'getProductsByFilter', {
      data: {
        filter: filter,
        order: {}
      },
      method: "POST"
    }, function(products) {

      ServiceHelper.getService("seller", "getSellerByUsername", {
        data: {
          username: req.session.seller
        }
      }, function(seller) {
        model.seller = seller;
        model.products = products;
        for (var i = model.products.length - 1; i >= 0; i--) {
          model.products[i].sellerInfos = seller.account;
        };
        callback(model);
      });
    });
  },
  editProduct: function(req, callback) {
    
    ConfigurationHelper.getConfig({
      application: "services",
      done: function(config) {
        var model = this;
        ServiceHelper.getService("seller", "getSellerByUsername", {
          data: {
            username: req.session.seller
          }
        }, function(seller) {
          model.seller = seller;
          ServiceHelper.getService('product', 'getProductById', {
            data: {
              "productId": req.params.product
            },
            method: "POST"
          }, function(product) {
            model.product = product;
            SellerModel._loadProductFormInfos(model, function(model) {
  
              var files = [];
  
              try {
                var folder = __dirname + "/../files/products/" + model.product["_id"] + "/";
                var filenames = fs.readdirSync(folder);
                for (var k = filenames.length - 1; k >= 0; k--) {
                  files.push(filenames[k]);
                };
  
                if (files.length > -1) {
                  model.product.file = files[0];
                }
              } catch (err) {
                console.log("file not found for product");
              }
  
  
              callback(model);
            });
          });
        });
      }
    });
  },
  addProduct: function(req, callback) {

        var model = this;
        model.product = {};
        ServiceHelper.getService("seller", "getSellerByUsername", {
          data: {
            username: req.session.seller
          }
        }, function(seller) {
          model.seller = seller;
          SellerModel._loadProductFormInfos(model, function(model) {
            callback(model);
          });
        });
  },
  _loadProductFormInfos: function(model, callback) {

    ServiceHelper.getService('school', 'getSchools', {
      data: {},
      method: "POST"
    }, function(schools) {
      model.schools = schools;
      for (var i = model.schools.length - 1; i >= 0; i--) {
        model.schools[i].selected = model.product.university == model.schools[i].universityId;
      };
      ServiceHelper.getService('category', 'getCategories', {
        data: {},
        method: "POST"
      }, function(categories) {
        model.categories = categories;
        for (var i = model.categories.length - 1; i >= 0; i--) {
          model.categories[i].selected = model.product.categories !== undefined && model.product.categories.indexOf(model.categories[i].shortName) > -1;
        };
        callback(model);
      });

    });
  },
  saveProduct: function(req, callback) {

    var product = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      university: req.body.university,
      categories: [req.body.categories],
      time: [req.body.time],
      image: req.body.image
    }
    var file = req.files !== undefined && req.files.productFile !== undefined ? req.files.productFile : undefined;

    var saveFile = function(callback, productId) {
      console.log(productId);
      if (file !== undefined) {
        //fs.unlink(__dirname+"/../files/products/"+productId+"/", function (err) {
        try {
          fs.readFile(file.path, function(err, data) {
            if (err)
              console.log(err);
            var newPath = __dirname + "/../files/products/" + productId + "/" + file.name;
            if (!fs.existsSync(__dirname + "/../files/products/" + productId + "/")) {
              fs.mkdirSync(__dirname + "/../files/products/" + productId + "/");
            }
            fs.writeFile(newPath, data, function(err) {

              if (err)
                console.log(err);
              callback(true);
            });
          });
        } catch (err) {
          console.log(err);
          console.log('err');
          callback(false);
        }
        //});

      } else {
        callback(true);
      }
    }

    if (req.body["_id"] !== undefined && req.body["_id"] !== "") {

      product.id = req.body["_id"];

      ServiceHelper.getService('product', 'updateProduct', {
        data: product,
        method: "POST"
      }, function(productId) {
        saveFile(callback, productId);
      });
    } else {

      product.seller = req.session.seller;

      ServiceHelper.getService('product', 'createProduct', {
        data: product,
        method: "POST"
      }, function(productId) {
        saveFile(callback, productId);
      });
    }
  },
  displayEditAccount: function(req, callback) {
    var model = this;
    ServiceHelper.getService("seller", "getSellerByUsername", {
      data: {
        username: req.session.seller
      }
    }, function(seller) {
      model.seller = seller;
      
      
      if(seller !== undefined && seller.account !== undefined && seller.account.picture !== undefined){
        seller.account.pictureName = seller.account.picture.split('/')[seller.account.picture.split('/').length-1];
      }
      
      ServiceHelper.getService('school', 'getSchools', {
        data: {},
        method: "POST"
      }, function(schools) {
        model.schools = schools;
        for (var i = model.schools.length - 1; i >= 0; i--) {
          model.schools[i].selected = (model.schools[i].universityId == model.seller.account.universityId);
        };
        callback(model);
      });
    });
  },
  editAccount: function(req, callback) {
    
    var model = this;
    
    ServiceHelper.getService("seller", "getSellerByUsername", {
      data: {
        username: req.session.seller
      }
    }, function(seller) {

      var file = req.files !== undefined && req.files.pictureFile !== undefined ? req.files.pictureFile : undefined;

      var updatedSeller = seller;
      
      var editAccountInternal = function(){
        updatedSeller.account.displayName = req.body["displayName"];
        updatedSeller.account.firstName = req.body["firstName"];
        updatedSeller.account.lastName = req.body["lastName"];
        updatedSeller.account["description"] = req.body["description"];
        updatedSeller.account.universityId = req.body["university"];
        updatedSeller.account.address = req.body["address"];
        updatedSeller.account.paymentInfos.iban = req.body["iban"];
        updatedSeller.account.paymentInfos.bic = req.body["bic"];
        var bankAccountInfos = {
          ownerName: updatedSeller.account.firstName + " " + updatedSeller.account.lastName,
          user: updatedSeller.account.paymentInfos.accountId,
          ownerAddress: updatedSeller.account.address,
          iban: updatedSeller.account.paymentInfos.iban,
          bic: updatedSeller.account.paymentInfos.bic
        };
        ServiceHelper.getService("payment", "registerBankAccount", {
          data: {
            infos: bankAccountInfos
          }
        }, function(bankAccount) {
          
          if(!bankAccount){
            callback(false);
          } else {
            updatedSeller.account.paymentInfos.bankId = bankAccount.Id;
            ServiceHelper.getService("seller", "updateSeller", {
              data: updatedSeller
            }, function(seller) {
              callback(model);
            });
          }
          
        });
      }
      
      if (file !== undefined && file.name !== '') {
        try {
          fs.readFile(file.path, function(err, data) {
            if (err)
              console.log(err);
            var newPath = __dirname + "/../public/img/sellers/" + seller["_id"] + "/" + file.name;
            if (!fs.existsSync(__dirname + "/../public/img/sellers/" + seller["_id"] + "/")) {
              fs.mkdirSync(__dirname + "/../public/img/sellers/" + seller["_id"] + "/");
            } else {
              fs.readdirSync(__dirname + "/../public/img/sellers/" + seller["_id"]).forEach(function(file,index){
                var curPath = __dirname + "/../public/img/sellers/" + seller["_id"] + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { 
                } else { // delete file
                  fs.unlinkSync(curPath);
                }
              });
            }
            fs.writeFile(newPath, data, function(err) {
              if (err)
                console.log(err);
              
              updatedSeller.account.picture = "/img/sellers/"+seller["_id"]+"/"+file.name;
              
              editAccountInternal();
            });
          });
        } catch (err) {
          callback(false);
        }

      } else {
        updatedSeller.account.picture = seller.account.picture;
        editAccountInternal();
      } 

    });
  },
  withdrawMoney: function(req, callback) {
    var model = this;



    ServiceHelper.getService("seller", "getSellerByUsername", {
      data: {
        username: req.session.seller
      }
    }, function(seller) {
      var withdrawOrder = {
        AuthorId: seller.account.paymentInfos.accountId,
        DebitedWalletId: seller.account.paymentInfos.walletId,
        BankAccountId: seller.account.paymentInfos.bankId,
        BIC: seller.account.paymentInfos.bic
      };

      ServiceHelper.getService("payment", "getWalletInfos", {
        data: {
          paymentInfos: seller.account.paymentInfos
        },
        method: "POST"
      }, function(walletInfos) {
        withdrawOrder.DebitedFunds = {
          Amount: walletInfos[0].Balance.Amount
        }

        ConfigurationHelper.getConfig({
          application: 'marketplace',
          done: function(configuration) {
            if (configuration.minWithdrawAmount > walletInfos[0].Balance.Amount) {
              model.withdrawResult = false;
              callback(model);
            } else {
              ServiceHelper.getService("payment", "withdrawMoney", {
                data: withdrawOrder
              }, function(withdrawResult) {
                model.withdrawResult = withdrawResult;
                callback(model);
              });
            }
          }
        });

      });

    });

  },
  wallet: function(req, callback) {
    var model = this;
    ServiceHelper.getService("seller", "getSellerByUsername", {
      data: {
        username: req.session.seller
      },
      method: "POST"
    }, function(seller) {

      model.seller = seller;

      ServiceHelper.getService("order", "getCountBySeller", {
        data: {
          seller: req.session.seller
        },
        method: "POST"
      }, function(result) {
        if (!result)
          model.seller.sellCount = 0;
        else
          model.seller.sellCount = result.count;

        ServiceHelper.getService("payment", "getWalletInfos", {
          data: {
            paymentInfos: model.seller.account.paymentInfos
          },
          method: "POST"
        }, function(walletInfos) {
          if (walletInfos)
            model.seller.sellBalance = walletInfos[0].Balance.Amount;

          ConfigurationHelper.getConfig({
            application: 'marketplace',
            done: function(configuration) {
              model.withdrawEnabled = configuration.minWithdrawAmount < model.seller.sellBalance;
              callback(model);
            }
          });

        });

      });

    });
  },
};

module.exports.SellerModel = SellerModel;
