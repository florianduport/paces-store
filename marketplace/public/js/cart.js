var loadAddToCartButtons = function(){
	$(".add-to-cart-button").click(function(){
		$.ajax({
			url : "/addtocart/"+$(this).data("product"),
			success : function(cartCount){
				$.cookie("cart-count", cartCount, {path : "/"});
				reloadCartCount();
			}
		});
	});
};

var reloadCartCount = function(){
	if($.cookie("cart-count") !== undefined){
		if($.cookie("cart-count") == 1){
			$("#cart-number-products").html("1 produit");
		}
		else if($.cookie("cart-count") > 1){
			$("#cart-number-products").html($.cookie("cart-count")+" produits");
		}	
	}
	
};
$(document).ready(function(){

	loadAddToCartButtons();
	reloadCartCount();
});