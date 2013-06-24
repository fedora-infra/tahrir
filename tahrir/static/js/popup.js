var on_a_link = false;
var speed = 50;
$(document).ready(function() {
    var popup = $("div.popup").hide();
    $("li.popup").hover(
        // mouse-over
        function(event) {
            on_a_link = true;
            $.ajax(event.currentTarget.children[1].href, {
                success: function(html) {
                    // The next line solves the problem of the popup
                    // persisting due to aggressive mouse movement.
                    if (! on_a_link) { return; }
                    popup.html(html).show(speed).animate({
                        top: event.pageY-100,
                        left: 0,
                    }, speed);
                },
            });
        },
        // mouse-out
        function(event) {
            on_a_link = false;
            setTimeout(function(){
                if (! on_a_link) {
                    popup.hide(speed);
                }
            }, 500);
        }
    );
});