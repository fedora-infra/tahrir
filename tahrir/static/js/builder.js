/* This script adds to the badge builder view. */

$(document).ready(function() {

    function generateOutput() {
        return "%YAML 1.2\n"
             + "---\n"
             + "\n"
             + "# This is some metadata about the badge.\n"
             + "name:           Blah\n"
             + "description:    Blahhh\n"
             + "creator:        Joe\n"
             + "\n"
             + "# This is a link to the discussion about adopting this as "
             + "a for-real badge.\n";
    }

    $('input#lol').keydown(function() {
        var previewVal = $(this).val();
        $('textarea#preview').val(generateOutput());
    });
});
