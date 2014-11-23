$(document).ready(function(){
	if(navigator !== undefined && navigator.geolocation !== undefined && navigator.geolocation.getCurrentPosition !== undefined){
		navigator.geolocation.getCurrentPosition(function(position){

			var currentPosition = JSON.parse($.cookie("position").replace("j:", ""));
			if(!currentPosition.isAlreadyCalculated){
				currentPosition.isNew = true;
				currentPosition.latitude = position.coords.latitude;
				currentPosition.longitude = position.coords.longitude;
				var currentPositionString = "j:"+JSON.stringify(currentPosition);
				console.log(currentPositionString);
				$.cookie("position", currentPositionString);
				window.location.reload();
			} 

		}, function(){}, {});
	}
});