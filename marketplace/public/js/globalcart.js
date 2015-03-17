$(document).ready(function(){
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
				$("#cart-number-products").html($.cookie("cart-count"));
		}
		
	};
	loadAddToCartButtons();
	reloadCartCount();
});