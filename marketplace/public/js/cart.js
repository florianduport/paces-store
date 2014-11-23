$(document).ready(function(){
	$(".add_to_cart_button").click(function(){
		$.ajax({
			url : "/addtocart/"+$(this).data("product"),
			success : function(cartCount){
				$.cookie("cart_count", cartCount);
				reloadCartCount();
			}
		});
	});
	var reloadCartCount = function(){
		if($.cookie("cart_count") !== undefined){
			if($.cookie("cart_count") == 1){
				$("#cart_number_products").html("1 produit");
			}
			else if($.cookie("cart_count") > 1){
				$("#cart_number_products").html($.cookie("cart_count")+" produits");
			}	
		}
		
	}
	reloadCartCount();
});