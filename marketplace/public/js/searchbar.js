$(document).ready(function(){
	$("#universitySelector").change(function(){
		var currentPosition = JSON.parse($.cookie("position").replace("j:", ""));
		currentPosition.universityId = $("#universitySelector").val();

		var currentPositionString = "j:"+JSON.stringify(currentPosition);
		$.cookie("position", currentPositionString);
		window.location.reload();
	});

	$("#submitSearch").click(function(){
		//input keywords
		if($("input[name=searchText]")[0] !== undefined){
			var keywordsElement = "<input type='hidden' name='keywords' value='"+$("input[name=searchText]").val()+"'/>";
			$("form[name=searchForm]").html($("form[name=searchForm]").html()+keywordsElement);
		}

		//input sort
		if($("select[data-type=sort]")[0] !== undefined){
			var sortElement = "<input type='hidden' name='sort' value='"+$("select[data-type=sort] option:selected").val()+"'/>";
			$("form[name=searchForm]").html($("form[name=searchForm]").html()+sortElement);
		}
		//input categories		
		if($("input[name=categoriesSelected]")[0] !== undefined){
			var categoriesElement = "<input type='hidden' name='categories' value='"+$("input[name=categoriesSelected]").val()+"'/>";
			$("form[name=searchForm]").html($("form[name=searchForm]").html()+categoriesElement);
		}

		

		$("form[name=searchForm]").submit();

	});
});