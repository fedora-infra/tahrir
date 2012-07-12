var on_a_link = false;
var speed = 50;
$(document).ready(function() {
    $("div.popup").hide();
    $("li.popup").hover(
        // mouse-over
        function(event) {
            on_a_link = true;
            $.ajax(event.currentTarget.children[1].href, {
                success: function(html) {
                    // The next line solves the problem of the popup
                    // persisting due to aggressive mouse movement.
                    if (! on_a_link) { return; }
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
