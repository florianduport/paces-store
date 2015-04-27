var active = true;
$(document).ready(function(){
	
	setInterval(updateTime, 1000);
	
});
var updateTime = function(){
	var time = parseInt($(".count").html());
	if(time-1 == 0 && active){
		active = false;
		window.location.href = "/";
	} else {	
		$(".count").html(time-1);
	}
};