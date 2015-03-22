$(document).ready(function () {

    var applyFilter = function () {

        var position = $.cookie("position");
        var jsonPosition = JSON.parse($.cookie("position").substring(2));


        $(".productList").addClass("animated bounceOutLeft");
        var animationPlayed = false;
        $.post("/list/" + jsonPosition.universityId, {
            categories: $("input[name=categoriesSelected]").val(),
            keywords : $("#searchText").val(),
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
                        	if(i > 0)
                        		name+=', '; 
                            name += $(this).html();
                            i++;
                        });
                $(".categories-names").html(name+' ');
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


    /* $(".categories-products").click(function () {
     var name = "";
     $("input[filter-element]:checked + name").each(
     function (element) {
     name += $(this).html();
     
     });
     $(".categories-names").html(name);
     });*/
});