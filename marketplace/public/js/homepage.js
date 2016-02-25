$(document).ready(function () {
    if (navigator !== undefined && navigator.geolocation !== undefined && navigator.geolocation.getCurrentPosition !== undefined) {
        navigator.geolocation.getCurrentPosition(function (position) {

            var currentPosition = JSON.parse($.cookie("position").replace("j:", ""));
            if (!currentPosition.isAlreadyCalculated) {
                currentPosition.isNew = true;
                currentPosition.latitude = position.coords.latitude;
                currentPosition.longitude = position.coords.longitude;
                var currentPositionString = "j:" + JSON.stringify(currentPosition);
                $.cookie("position", currentPositionString);
                window.location.reload();
            }

        }, function () {
        }, {});
    }

    $("paper-button").click(function () {
        window.location = "/list/" + $(this).data("list");
    });
    $("#change-city-button").click(function () {
        if ($(this).data("opened") === "false") {
            $(this).find("paper-dropdown").toggle();
            $(this).data("opened", "true");
        }
    });
    
    function selectUniversity(){
    	var currentPosition = JSON.parse($.cookie("position").replace("j:", ""));
		currentPosition.universityId = $("#universitySelectorHomepage").val();

		var currentPositionString = "j:"+JSON.stringify(currentPosition);
		$.cookie("position", currentPositionString);

		var container = $("<div>");
		var selectElement = $(window.localStorage.getItem("geolocZone"));
		$(selectElement).find("option").removeAttr("selected");
		$(selectElement).find("option").each(function(optionElement){
			if($(this).val() == $("#universitySelectorHomepage option:selected").val()){
				$(this).attr("selected", "selected");
			}
		});
		container.html(selectElement);

		window.localStorage.setItem("geolocZone", container.html());
		//console.log(container.html());
		window.location.href = "/list";
    }
    
    $("body").delegate("#universitySelectorHomepage + div + input", "click", function(){
        selectUniversity();
    });
    
	$("body").delegate("#universitySelectorHomepage", "change", function(){
	    selectUniversity();
	});
});