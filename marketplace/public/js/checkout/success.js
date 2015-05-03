var active = true;
$(document).ready(function(){
	/*$("#goToMail").click(function(){
		var mailProvider = $(this).data("email").split("@")[1].split(".")[0];

		switch(mailProvider){
			case "gmail":
				window.open('http://mail.google.com/','_blank');
				break;
			case "hotmail":
				window.open('http://mail.live.com/','_blank');
				break;
		}
	});*/
	setInterval(updateTime, 1000);
	$("#goToHomepage").click(function(){
		window.location.href="/";
	})
});


var updateTime = function(){
	var time = parseInt($(".count").html());
	if(time-1 == 0 && active){
		active = false;
		$(".hidden").removeClass("hidden");
		$("#downloadForm").submit();
	} else if(time > 0) {	
		$(".count").html(time-1);
	}
};