$(document).ready(function () {

    if (navigator !== undefined && navigator.geolocation !== undefined && navigator.geolocation.getCurrentPosition !== undefined) {
        console.log("here");
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
        }, {
            
            //geoloc refused
            
        });
    }

    var applyFilter = function () {

        var position = $.cookie("position");
        var jsonPosition = JSON.parse($.cookie("position").substring(2));


        $(".thumbnail").addClass("animated fadeOut");
        var animationPlayed = false;
        var michelPlayer = false;
        $.post("/list/" + jsonPosition.universityId, {
            categories: $("input[name=categoriesSelected]").val(),
            keywords: $("#searchText").val(),
            sort: $("*[data-type=sort] option:selected").val(),
            ajax: true
        }, function (data) {
             playAnimation(data);
        });

        var playAnimation = function (data) {
            if (!animationPlayed) {
                $(".thumbnail").removeClass("animated fadeOut");
                $(".productList").html(data);
                $(".thumbnail").addClass("animated fadeIn");
                var name = "";
                var i = 0;
                $("input[filter-element]:checked + .category-name").each(
                        function (element) {
                            if (i > 0)
                                name += ', ';
                            name += $(this).html();
                            i++;
                        });
                loadAddToCartButtons();
                animationPlayed = true;
            }
        };
    };

    var handleFilter = function () {
        if ($(this).data("type") === "category") {
            var categories = $("input[name^=categorie_]:checked");
            $("input[name=categoriesSelected]").val("[");
            for (var i = categories.length - 1; i >= 0; i--) {
                $("input[name=categoriesSelected]").val($("input[name=categoriesSelected]").val() + "\"" + $(categories[i]).data("name") + "\"" + (i == 0 ? "" : ","));
            }
            ;
            $("input[name=categoriesSelected]").val($("input[name=categoriesSelected]").val() + "]");
        }
        applyFilter();
    };

    $("*[filter-element-change]").change(handleFilter);
    $("*[filter-element]").click(handleFilter);
    if ($("input[name^=categorie_]:checked").length > 0 && $("#searchText").val() === "") {
        handleFilter();
    }

    function getBootstrapDeviceSize() {
        return $('#users-device-size').find('div:visible').first().attr('id');
    }
    if (getBootstrapDeviceSize() === 'xs') {
        $('#matieres-cat').removeClass('in');
        $('#matieres-spe-cat').removeClass('in');
    }

    function toggleCategories() {
        try{
            
            var arrActiveUE = JSON.parse($('#categoriesSelected').val());
            if (arrActiveUE.length > 0) {
                var name = "Les contenus pour ";
                var i = 0;
                for (var val in arrActiveUE) {
                    if (i !== 0) {
                        name += ", ";
                    }
    //                console.log(arrActiveUE[val]);
                    name += arrActiveUE[val];
                    $('#toggle_cat_' + arrActiveUE[val]).addClass('bg-grey toggle-on');
                    $('#toggle_cat_' + arrActiveUE[val]).find(".badge").removeClass("badge-blue");
                    $('#toggle_cat_' + arrActiveUE[val]).find(".badge").addClass("badge-green");
                    i++;
                }
                $(".categories-names").html(name);
            } else {
                $(".categories-names").html("Tout le contenu");
            }
            
        } catch(e){
            
        }
    }
    toggleCategories();

    $(".list-group-item").click(function (e) {
        $(this).removeClass('bg-grey toggle-on');
        $(this).find(".badge").removeClass("badge-green");
        $(this).find(".badge").addClass("badge-blue");
        toggleCategories();
    });

});
