/* This script adds to the badge builder view. */

$(document).ready(function() {

    var badgeName = "";

    function generateOutput() {
        return "%YAML 1.2\n"
             + "---\n"
             + "\n"
             + "# This is some metadata about the badge.\n"
             + "name:           " + badgeName + "\n"
             + "description:    Blahhh\n"
             + "creator:        Joe\n"
             + "\n"
             + "# This is a link to the discussion about adopting this as "
             + "a for-real badge.\n";
    }

    function updateTextarea() {
        $('textarea#preview').val(generateOutput());
    }
                   

    $('input[name=badge-name]').keyup(function() {
        badgeName = $(this).val();
        updateTextarea();
    });
});
