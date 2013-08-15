function activate_social_links() {
    // Set up the gplus link
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // Set up the twitter link
    (function(d,s,id){
        var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
        if(!d.getElementById(id)){js=d.createElement(s);
            js.id=id;
            js.src=p+'://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js,fjs);
        }
    })(document, 'script', 'twitter-wjs');

    $("#social-activate").slideUp('slow');
    setTimeout(function() {
        $("#twitter-container, #gplus-container").show();
    }, 500);
}

$(document).ready(function() {
    $("#twitter-container, #gplus-container").hide();
})
