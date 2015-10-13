$(document).ready(function () {

    loadAddToCartButtons();
    reloadCartCount();
    shoppingcartButton();
    checkoutButton();

    $(document).delegate("button[removeFromShoppingCart]", 'click', function () {
        $.get("/removefromcart/" + $(this).data("productid"), {}, function (data) {
            window.location.reload();
        });
    });
});
var loadAddToCartButtons = function () {
    $(".add-to-cart-button").click(function () {
        $.ajax({
            url: "/addtocart/" + $(this).data("product"),
            success: function (cartCount) {

                $.cookie("cart-count", cartCount, {path: "/"});
                reloadCartCount();
                displayShoppingCartPopup();
            }
        });
    });
};
var reloadCartCount = function () {
    if ($.cookie("cart-count") !== undefined && $.cookie("cart-count") !== "0") {
        $("#cart-number-products").html($.cookie("cart-count"));
    }
};

var shoppingcartButton = function () {
    $("#shoppingcart-button").click(function () {
        displayShoppingCartPopup();
    });
};

var displayShoppingCartPopup = function () {
    if ($.cookie("cart-count") !== undefined && $.cookie("cart-count") !== "0") {
        $.ajax({
            url: "/shoppingcart/",
            data: {
                ajax: true
            },
            method: "POST",
            success: function (cartContent) {
                var cartContentDom = $("<div>");
                cartContentDom.html(cartContent);

                BootstrapDialog.show({
                    title: "<i class='glyphicon glyphicon-shopping-cart'></i> Votre panier",
                    type: BootstrapDialog.TYPE_SUCCESS,
                    message: cartContent,
                    buttons: [
                        {
                            label: 'Commander (' + $(cartContentDom).find("#shoppingcartTotal-hidden").val() + ')',
                            cssClass: 'btn-success',
                            action: function () {
                                var checkoutForm = $("<form action='/checkout/' method='post' id='checkout'>");
                                $(checkoutForm).appendTo("body").submit();
                            }
                        }]
                });
            }
        });
    } else {
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_SUCCESS,
            title: "<i class='glyphicon glyphicon-shopping-cart'></i> Votre panier",
            message: "Votre panier est vide ! ",
            buttons: [
                {
                    label: 'Continuer mes achats',
                    action: function (dialogItself) {
                        dialogItself.close();
                    }
                }]
        });
    }
};

var checkoutButton = function () {
    $(".checkout-product-button").click(function () {
        $.ajax({
            url: "/productcheckout/" + $(this).data("product"),
            method: "POST",
            success: function (cartContent) {
                var cartCount = $.cookie("cart-count") !== undefined ? parseInt($.cookie("cart-count")) : 0;
                $.cookie("cart-count", 1, {path: "/"});
                reloadCartCount();
                var checkoutForm = $("<form action='/checkout/' method='post' id='checkout'>");
                $(checkoutForm).appendTo("body").submit();
                //$(checkoutForm).submit();
            }
        });
    });
};