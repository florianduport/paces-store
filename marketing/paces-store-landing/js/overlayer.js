var closeOverlayer = function(){
	$("#overlayer").remove();
	$("#message-box").addClass("fadeOutDown");
	$("#message-box").addClass("animated");
	setTimeout(function(){
		$("#message-box").remove();
	}, 1000);
}
$(document).ready(function(){
	$(".close").click(closeOverlayer);
	$("#overlayer").click(closeOverlayer);
	$("#message-box > .row").click(closeOverlayer);
	$("#message-box-content").click(function(e){e.stopPropagation();});
});
