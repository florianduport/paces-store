$(document).ready(function () {
    var __slice = [].slice;
    (function (e, t) {
        var n;
        n = function () {
            function t(t, n) {
                var r, i, s, o = this;
                this.options = e.extend({}, this.defaults, n);
                this.$el = t;
                s = this.defaults;
                for (r in s) {
                    i = s[r];
                    if (this.$el.data(r) != null) {
                        this.options[r] = this.$el.data(r)
                    }
                }
                this.createStars();
                this.syncRating();
                this.$el.on("mouseover.starrr", "span", function (e) {
                    return o.syncRating(o.$el.find("span").index(e.currentTarget) + 1)
                });
                this.$el.on("mouseout.starrr", function () {
                    return o.syncRating()
                });
                this.$el.on("click.starrr", "span", function (e) {
                    return o.setRating(o.$el.find("span").index(e.currentTarget) + 1)
                });
                this.$el.on("starrr:change", this.options.change)
            }
            t.prototype.defaults = {rating: void 0, numStars: 5, change: function (e, t) {
                }};
            t.prototype.createStars = function () {
                var e, t, n;
                n = [];
                for (e = 1, t = this.options.numStars; 1 <= t ? e <= t : e >= t; 1 <= t ? e++ : e--) {
                    n.push(this.$el.append("<span class='glyphicon .glyphicon-star-empty'></span>"))
                }
                return n
            };
            t.prototype.setRating = function (e) {
                if (this.options.rating === e) {
                    e = void 0
                }
                this.options.rating = e;
                this.syncRating();
                return this.$el.trigger("starrr:change", e)
            };
            t.prototype.syncRating = function (e) {
                var t, n, r, i;
                e || (e = this.options.rating);
                if (e) {
                    for (t = n = 0, i = e - 1; 0 <= i ? n <= i : n >= i; t = 0 <= i ? ++n : --n) {
                        this.$el.find("span").eq(t).removeClass("glyphicon-star-empty").addClass("glyphicon-star")
                    }
                }
                if (e && e < 5) {
                    for (t = r = e; e <= 4 ? r <= 4 : r >= 4; t = e <= 4 ? ++r : --r) {
                        this.$el.find("span").eq(t).removeClass("glyphicon-star").addClass("glyphicon-star-empty")
                    }
                }
                if (!e) {
                    return this.$el.find("span").removeClass("glyphicon-star").addClass("glyphicon-star-empty")
                }
            };
            return t
        }();
        return e.fn.extend({starrr: function () {
                var t, r;
                r = arguments[0], t = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                return this.each(function () {
                    var i;
                    i = e(this).data("star-rating");
                    if (!i) {
                        e(this).data("star-rating", i = new n(e(this), r))
                    }
                    if (typeof r === "string") {
                        return i[r].apply(i, t)
                    }
                })
            }})
    })(window.jQuery, window);
    $(function () {
        return $(".starrr").starrr()
    })

    var applyFilter = function () {
        var university = $.cookie("current-university") !== undefined ? $.cookie("current-university") : "";
        var formData = "<input type='hidden' name='category' value='" + $("*[current-category=true]").data("value") + "' />";
        var formData = formData + "<input type='hidden' name='sort' value='dateDown' />";
        var formData = formData + "<input type='hidden' name='ajax' value='false' />";
        var form = $("<form method='post' action='/list/" + university + "'>" + formData + "</form>");

        form.submit();/*
         $.post("", {
         category : $("*[current-category=true]").data("value"),
         sort : $("*[data-type=sort] option:selected").val(),
         ajax: true
         }, function(data){
         $(".productList").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
         $(".productList").removeClass("animated bounceOutLeft");
         $(".productList").addClass("animated bounceInRight");
         $(".productList").html(data);
         });
         });*/
    };

    $("*[filter-element]").click(function () {
        if ($(this).data("type") == "category") {
            $("*[current-category=true]").attr("current-category", "false");
            $(this).attr("current-category", "true");
        }
        applyFilter();
    });
    $('.starrr').on('starrr:change', function (e, value) {
        ratingsField.val(value);
    });

});