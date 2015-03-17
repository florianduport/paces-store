$(document).ready(function(){
	$("input[removeFromShoppingCart]").click(function(){
		$.get("/removefromcart/"+$(this).data("productid"), {}, function(data){
			window.location.reload();
		});
	});
});