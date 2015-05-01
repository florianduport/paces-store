$(document).ready(function(){
	$("input.signUp").click(function(){
		$(".signInContainer").addClass("animated bounceOutLeft");
		$.post("/signUp/display", {
            ajax: true
        }, function (data) {

            $(".signInContainer").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                playAnimation(data);
            });
            //in case there's no animation end
            setTimeout(function () {
                playAnimation(data);
            }, 2000);
        });

	});

	$("body").delegate(".backToSignUp", "click", function(){
		window.location.reload();
	});
});
var animationPlayed = false;
var playAnimation = function (data) {
    if (!animationPlayed) {
        $(".signInContainer").removeClass("animated bounceOutLeft");
        $(".signInContainer").addClass("animated bounceInRight");
        $(".signInContainer").html(data);
        animationPlayed = true;
    }
};