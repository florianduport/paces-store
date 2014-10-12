$(document).ready(function(){

	//check animation => lancer les animations sur les éléments directement visibles
	checkAnimation();

	$(window).scroll( function(){
		//relancer les animations potentielles à chaque scroll
		checkAnimation();
	});
});


var delayedAnimation = function(animationElement, animation, timeout){
	setTimeout(function(){ 
		animationElement.removeClass("visibility-hidden");
		animationElement.addClass(animation+" animated"); 
	}, timeout);
}

var checkAnimation = function(){
	//tous les éléments à animer sont à ajouter ici
	//cf classes d'animations de ANIMATE.CSS
	var animationArray = [
		{selector: ".logo-paces-store", animation: "bounceIn", timeout: 1000},
		{selector: ".newsletter-form", animation: "tada", timeout: 1000},
		{selector: "#video-container", animation: "tada", timeout: 0},
	];

	for(i = 0; i < animationArray.length; i++) {

		var elementArray = $(animationArray[i].selector);
		
		if(elementArray.length > 0){

			var element = $(elementArray[0]);
			var objectBottom = element.position().top + element.outerHeight();
            var windowBottom = $(window).scrollTop() + $(window).height();

            if( windowBottom > objectBottom ){
            		delayedAnimation(element, animationArray[i].animation, animationArray[i].timeout !== undefined ? animationArray[i].timeout : 0);
            }

		}
		else {
			console.log("couldn't find element "+animationArray[i].selector);
		}
	}
};
