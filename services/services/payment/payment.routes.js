var Base = require('../base/base.routes').BaseRoutes,
  PaymentService = require('./payment.service').PaymentService,
  LoggerService = require('../logger/logger.service').LoggerService,
  HmacHelper = require('./../../helpers/hmac.helper').HmacHelper;

/**
 * Routes du service Payment
 * @class CustomerRoutes
 */
var PaymentRoutes = {

  Base: Base,

  /**
   * loadRoutes : Charge les routes dans Express pour les rendre accessible
   * @param app : l'application express
   * @param configuration : la configuration de l'application (contient le chemin de l'url)
   */
  loadRoutes: function(app, configuration) {

    // authenticate customer : /customer/authenticateCustomer

    app.post(configuration.routes.payment.createWallet, HmacHelper.verifyRequest, function(req, res) {
      //check parameters
      if (req.body === undefined || !req.body || req.body.infos === undefined || !req.body.infos) {
        LoggerService.logError("services", "Wrong payment create wallet parameters", {
          infos: req.body.infos !== undefined ? req.body.infos : ""
        });
        console.log("wrong parameters for wallet creation");
        Base.send(req, res, false);
      }

      PaymentService.createWallet(req.body.infos, function(result) {
        Base.send(req, res, result);
      });
    });

    app.post(configuration.routes.payment.registerBankAccount, HmacHelper.verifyRequest, function(req, res) {
      //check parameters
      if (req.body === undefined || !req.body) {
        LoggerService.logError("services", "Wrong payment register bank account parameters", {
          infos: req.body !== undefined ? req.body : ""
        });
        Base.send(req, res, false);
      }

      PaymentService.registerBankAccount(req.body, function(result) {
        Base.send(req, res, result);
      });
    });

    app.post(configuration.routes.payment.getUsers, HmacHelper.verifyRequest, function(req, res) {

      PaymentService.getUsers(function(result) {
        Base.send(req, res, result);
      });
    });

    app.post(configuration.routes.payment.getWalletInfos, HmacHelper.verifyRequest, function(req, res) {
      //check parameters
      if (req.body === undefined || !req.body || req.body.paymentInfos === undefined || !req.body.paymentInfos) {
        console.log("wrong parameters for wallet infos");
        Base.send(req, res, false);
      }
      PaymentService.getWalletInfos(req.body.paymentInfos, function(result) {
        Base.send(req, res, result);
      });
    });

    app.post(configuration.routes.payment.payWithNewCard, HmacHelper.verifyRequest, function(req, res) {
      //check parameters
      if (req.body === undefined || !req.body || req.body.card === undefined || req.body.user === undefined || req.body.sellers === undefined || req.body.lines === undefined) {
        LoggerService.logError("services", "Wrong payment pay with new card parameters", {
          card: req.body.card !== undefined ? req.body.card : ""
        });
        console.log("wrong parameters for pay with new card");
        Base.send(req, res, false);
      }

      PaymentService.payWithNewCard(req.body.user, req.body.card, req.body.sellers, req.body.lines, function(result) {
        Base.send(req, res, result);
      });
    });


    app.post(configuration.routes.payment.withdrawMoney, HmacHelper.verifyRequest, function(req, res) {
      //check parameters
      if (req.body === undefined || !req.body) {
        LoggerService.logError("services", "Wrong withdrawMoney parameters", {});
        Base.send(req, res, false);
      }

      PaymentService.withdrawMoney(req.body, function(result) {
        Base.send(req, res, result);
      });
    });
  }

};

module.exports.PaymentRoutes = PaymentRoutes;
