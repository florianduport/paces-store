$(document).ready(function () {

    var applyFilter = function () {

        var position = $.cookie("position");
        var jsonPosition = JSON.parse($.cookie("position").substring(2));


        $(".productList").addClass("animated bounceOutLeft");
        var animationPlayed = false;
        $.post("/list/" + jsonPosition.universityId, {
            categories: $("input[name=categoriesSelected]").val(),
            keywords: $("#searchText").val(),
            sort: $("*[data-type=sort] option:selected").val(),
            ajax: true
        }, function (data) {

            $(".productList").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                playAnimation(data);
            });
            //in case there's no animation end
            setTimeout(function () {
                playAnimation(data);
            }, 2000);
        });

        var playAnimation = function (data) {
            if (!animationPlayed) {
                $(".productList").removeClass("animated bounceOutLeft");
                $(".productList").addClass("animated bounceInRight");
                $(".productList").html(data);
                var name = "";
                var i = 0;
                $("input[filter-element]:checked + .category-name").each(
                        function (element) {
                            if (i > 0)
                                name += ', ';
                            name += $(this).html();
                            i++;
                        });
                if (!$(".categories-names").hasClass("search-names")) {
                    $(".categories-names").html(name + ' ');
                }
                loadAddToCartButtons();
                animationPlayed = true;
            }
        };
    };

    var handleFilter = function () {
        if ($(this).data("type") == "category") {
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
        var arrActiveUE = JSON.parse($('#categoriesSelected').val());
        if (arrActiveUE.length > 0) {
            for (var val in arrActiveUE) {
//                console.log(arrActiveUE[val]);
                $('i[id="toggle_cat_' + arrActiveUE[val] + '"]').removeClass('fa-toggle-off');
                $('i[id="toggle_cat_' + arrActiveUE[val] + '"]').addClass('fa-toggle-on');
            }
        }
    }

    toggleCategories();

    $(".categories-products *").click(function () {
        $('#matieres-cat .fa-2x').removeClass('fa-toggle-on');
        $('#matieres-cat .fa-2x').addClass('fa-toggle-off');
        toggleCategories();
    });

//    $('.thumbnail').hover( function(){
//        $(this).find('.thumbnail-seller').addClass('animated slideInUp');
//    });


    /* $(".categories-products").click(function () {
     var name = "";
     $("input[filter-element]:checked + name").each(
     function (element) {
     name += $(this).html();
     
     });
     $(".categories-names").html(name);
     });*/
});
