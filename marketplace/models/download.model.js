var ServiceHelper = require('../helpers/service.helper').ServiceHelper;
var fs = require('fs');
var archiver = require('archiver');
var p = require('path');
var ShoppingCartModel = require('./shoppingcart.model').ShoppingCartModel;

var DownloadModel = {

	checkDownload : function(req, callback){
		console.log("check download");
		//check si la commande n'a pas déjà été téléchargée plus de 3 fois.
		if(req.params !== undefined && req.params.orderId !== undefined){

			ServiceHelper.getService('order', 'getOrderById', {data: {orderId : req.params.orderId}, method : "POST"}, function(order){

				if(order === undefined || order.downloadCount === undefined || order.products === undefined || order.products.length < 1 || order.downloadCount > 2){
					console.log("failed");
					callback(false);
				} else {
					callback(true);
				}
			});

		} else {
			console.log("failed");
			callback(false);
		}
	},

	downloadOrder : function(req, res, archive, callback){
		//récupère tous les fichiers de la commande
		//génère un .zip contenant le tout
		//update le downloadCount de l'order
		//retourne le fichier pour téléchargement
		console.log("DOWNLOAD ORDER");
		ServiceHelper.getService('order', 'getOrderById', {data: {orderId : req.params.orderId}, method : "POST"}, function(order){
			
			var parentFolder = ""; 
			for(var j = 0; j < 5; j++){ 
				parentFolder += __dirname.split('/')[j]+"/"; 
			}
			try{
                            for (var i = order.products.length - 1; i >= 0; i--) {
				var folder = parentFolder+"files/products/"+order.products[i]["_id"]+"/";
				var filenames = fs.readdirSync(folder);
				for (var k = filenames.length - 1; k >= 0; k--) {
					files.push(folder+filenames[k]);
				};
                            }
                        } catch(e){
                            callback(false);
                        }
			var files = [];

			
			//on stream closed we can end the request
			res.on('close', function() {
				console.log('Archive wrote %d bytes', archive.pointer());
				return res.status(200).send('OK').end();
			});

			//set the archive name
			var today = new Date();
		    var dd = today.getDate();
		    var mm = today.getMonth()+1; //January is 0!

		    var yyyy = today.getFullYear();
		    if(dd<10){
		        dd='0'+dd
		    } 
		    if(mm<10){
		        mm='0'+mm
		    } 
		    var today = dd+''+mm+''+yyyy;
			res.attachment('commande-paces-store-'+today+'.zip');

			//this is the streaming magic
			archive.pipe(res);


			for(var i in files) {
				archive.append(fs.createReadStream(files[i]), { name: p.basename(files[i]) });
			}
			ServiceHelper.getService('order', 'incrementDownloadCount', {data: {orderId : req.params.orderId}, method : "POST"}, function(){
				
			});
			ShoppingCartModel.removeAllFromShoppingCart(req, res, function(){
				callback(archive);
			});
		});
	},

	getDownloadOrder : function(req, callback){
		var model = this;
		model.orderId = req.params.orderId;
		callback(model);
	}
};

module.exports.DownloadModel = DownloadModel;