$(document).ready(function() {
	$("body").delegate("#universitySelector", "change", function(){
		var currentPosition = JSON.parse($.cookie("position").replace("j:", ""));
		currentPosition.universityId = $("#universitySelector").val();

		var currentPositionString = "j:"+JSON.stringify(currentPosition);
		$.cookie("position", currentPositionString);

		var container = $("<div>");
		var selectElement = $(window.localStorage.getItem("geolocZone"));
		$(selectElement).find("option").removeAttr("selected");
		$(selectElement).find("option").each(function(optionElement){
			if($(this).val() == $("#universitySelector option:selected").val()){
				$(this).attr("selected", "selected");
			}
		});
		container.html(selectElement);

		window.localStorage.setItem("geolocZone", container.html());
		//console.log(container.html());
		window.location.reload();
	});

  	if(window.localStorage.getItem("geolocZone") != null){
  		updateGeolocZone(window.localStorage.getItem("geolocZone"));
  	} else {
  		
		$.ajax({
			url : "/geoloc",
			data : {
				ajax : true
			},
			method: "POST",
			success : function(geolocContent){
				updateGeolocZone(geolocContent);
			}
		});
  	}
});

var updateGeolocZone = function(content){
	$("#geolocZone").html(content);
	window.localStorage.setItem("geolocZone", content);
	$('#universitySelector').selectpicker();
}
