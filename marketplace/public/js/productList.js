$(document).ready(function(){

	var applyFilter = function(){

		var position = $.cookie("position");
		var jsonPosition = JSON.parse($.cookie("position").substring(2));


		$(".productList").addClass("animated bounceOutLeft");
		var animationPlayed = false;
		$.post("/list/"+jsonPosition.universityId, {
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

	var handleFilter = function(){
		if($(this).data("type") == "category"){
			$("*[current-category=true]").attr("current-category", "false");
			$(this).attr("current-category", "true");
		}
		applyFilter();
	};

	$("*[filter-element-change]").change(handleFilter);
	$("*[filter-element]").click(handleFilter);

});