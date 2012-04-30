var on_a_link = false;
var speed = 50;
$(document).ready(function() {
    $("div.popup").hide();
    $("li.popup").hover(
        // mouse-over
        function(event) {
            $.ajax(event.currentTarget.children[1].href, {
                success: function(html) {
                    on_a_link = true;
                    $("div.popup").show(speed);
                    $("div.popup").animate({
                        top: event.pageY-100,
                        left: 0,
                    }, speed);
                    $("div.popup").html(html);
                },
            });
        },
        // mouse-out
        function(event) {
            on_a_link = false;
            setTimeout(function(){
                if (! on_a_link) {
                    $("div.popup").hide(speed);
                }
            }, 500);
        }
    );
});
