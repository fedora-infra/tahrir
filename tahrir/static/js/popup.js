$(document).ready(function() {
    $("div.popup").hide();
    $("a.popup").hover(
        // mouse-over
        function(event) {
            $.ajax(event.currentTarget.href, {
                success: function(html) {
                    $("div.popup").show(200);
                    $("div.popup").html(html);
                },
            });
        },
        // mouse-out
        function(event) {
            $("div.popup").hide(200);
        }
    );
});
