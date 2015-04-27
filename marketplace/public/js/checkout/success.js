$(document).ready(function(){
	$("#goToMail").click(function(){
		var mailProvider = $(this).data("email").split("@")[1].split(".")[0];

		switch(mailProvider){
			case "gmail":
				window.open('http://mail.google.com/','_blank');
				break;
			case "hotmail":
				window.open('http://mail.live.com/','_blank');
				break;
		}
	});
});