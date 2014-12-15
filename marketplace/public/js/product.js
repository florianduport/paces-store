$(document).ready(function(){

	var applyFilter = function(){
		var formData = "<input type='hidden' name='category' value='"+$("*[current-category=true]").data("value")+"' />";
		var formData = formData + "<input type='hidden' name='sort' value='dateDown' />";
		var formData = formData + "<input type='hidden' name='ajax' value='false' />";
		var form = $("<form method='post' action='/list/"+$.cookie("current-university")+"'>"+formData+"</form>");

		form.submit();/*
		$.post("", {
			category : $("*[current-category=true]").data("value"),
			sort : $("*[data-type=sort] option:selected").val(),
			ajax: true
		}, function(data){
			$(".productList").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
				$(".productList").removeClass("animated bounceOutLeft");
				$(".productList").addClass("animated bounceInRight");
				$(".productList").html(data);
			});
		});*/
	};

	$("*[filter-element]").click(function(){
		if($(this).data("type") == "category"){
			$("*[current-category=true]").attr("current-category", "false");
			$(this).attr("current-category", "true");
		}
		applyFilter();
	});

});