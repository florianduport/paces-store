$(document).ready(function () {

    var enableOnlyAtScroll0 = true;
    var isStartAtScroll0 = $(window).scrollTop() == 0;

    if (!enableOnlyAtScroll0 || (enableOnlyAtScroll0 && isStartAtScroll0)) {

        //check animation => lancer les animations sur les éléments directement visibles
        checkAnimation();

        $(window).scroll(function () {
            //relancer les animations potentielles à chaque scroll
            checkAnimation();
        });

    }
    else {
        $("*").removeClass("visibility-hidden");
    }
});

//tous les éléments à animer sont à ajouter ici
//cf classes d'animations de ANIMATE.CSS
var animationArray = [
    {selector: ".thumbnail", animation: "fadeInUp", outerHeight: 50, timeout: 0, count: 1},
];

var delayedAnimation = function (animationDomElement, animationObject) {

    if (animationObject.count > 0 || animationObject.count == -1) {
        setTimeout(function () {
            animationDomElement.removeClass("visibility-hidden");
            animationDomElement.addClass(animationObject.animation + " animated");

            if (animationObject.count > 0)
                animationObject.count = animationObject.count - 1;
            //reboot
            setTimeout(function () {
                animationDomElement.removeClass("animated");
                animationDomElement.removeClass(animationObject.animation);
            }, 3000)

        }, animationObject.timeout !== undefined ? animationObject.timeout : 0);
    }
}

var checkAnimation = function () {


    for (i = 0; i < animationArray.length; i++) {

        var elementArray = $(animationArray[i].selector);

        if (elementArray.length > 0) {

            var element = $(elementArray[0]);
            var objectBottom = element.position().top + animationArray[i].outerHeight;
            var windowBottom = $(window).scrollTop() + $(window).height();

            if (objectBottom < windowBottom) {
                delayedAnimation(element, animationArray[i]);
            }

        }
        else {
            console.log("couldn't find element " + animationArray[i].selector);
        }
    }
};
