$(document).ready(function(){

	loadAddToCartButtons();
	reloadCartCount();
});
var loadAddToCartButtons = function(){
	$(".add-to-cart-button").click(function(){
		$.ajax({
			url : "/addtocart/"+$(this).data("product"),
			success : function(cartCount){
				var message = "Ce produit a bien été ajouté à votre panier";
				if($.cookie("cart-count") == cartCount){
					message = "Ce produit est déjà présent dans votre panier";
				}
				$.cookie("cart-count", cartCount, {path : "/"});
				reloadCartCount();
				BootstrapDialog.show({
		            title : message,
		            buttons: [{
		                label: 'Continuer mes achats',
		                action: function(dialogItself){
		                    dialogItself.close();
		                }
		            },
		            {
		                label: 'Accéder au panier',
		                cssClass: 'btn-success',
		                action: function(){
		                    window.location.href = "/shoppingcart/";
		                }
		            }]
	        	});
			}
		});
	});
};
var reloadCartCount = function(){
		if($.cookie("cart-count") !== undefined){
				$("#cart-number-products").html($.cookie("cart-count"));
		}
		
	};