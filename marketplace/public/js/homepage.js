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
});