$(document).ready(function(){

	$(".checkoutLink").click(function(){
		var checkoutForm = $("<form action='/checkout/' method='post' id='checkout'>");
        $(checkoutForm).submit();
	});
});