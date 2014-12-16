$(document).ready(function(){

	var applyFilter = function(){
		$(".productList").addClass("animated bounceOutLeft");
		var animationPlayed = false;
		$.post("", {
			category : $("*[current-category=true]").data("value"),
			sort : $("*[data-type=sort] option:selected").val(),
			ajax: true
		}, function(data){

			$(".productList").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
				playAnimation(data);
			});
			//in case there's no animation end
			setTimeout(function(){
				playAnimation(data);
			}, 2000)
		});

		var playAnimation = function(data){
			if(!animationPlayed){
				$(".productList").removeClass("animated bounceOutLeft");
				$(".productList").addClass("animated bounceInRight");
				$(".productList").html(data);
				loadAddToCartButtons();
				animationPlayed = true;
			}
		};
	};



	$("*[filter-element]").click(function(){
		if($(this).data("type") == "category"){
			$("*[current-category=true]").attr("current-category", "false");
			$(this).attr("current-category", "true");
		}
		applyFilter();
	});

});