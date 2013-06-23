/* This script adds to the badge builder view. */

$(document).ready(function() {

    var badgeName = $('input[name=badge-name]').val();
    var badgeDescription = $('input[name=badge-description]').val();
    var badgeCreator = $('input[name=badge-creator]').val();

    function generateOutput() {
        return "%YAML 1.2\n"
             + "---\n"
             + "\n"
             + "# This is some metadata about the badge.\n"
             + "name:           " + badgeName + "\n"
             + "description:    " + badgeDescription + "\n"
             + "creator:        " + badgeCreator + "\n"
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

    $('input[name=badge-description]').keyup(function() {
        badgeDescription = $(this).val();
        updateTextarea();
    });

    $('input[name=badge-creator]').keyup(function() {
        badgeCreator = $(this).val();
        updateTextarea();
    });
});
