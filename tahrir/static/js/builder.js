/* This script adds to the badge builder view. */

$(document).ready(function() {

    var badgeName = $('input[name=badge-name]').val();
    var badgeDescription = $('input[name=badge-description]').val();
    var badgeCreator = $('input[name=badge-creator]').val();
    var discussion = $('input[name=discussion]').val();
    var image = $('input[name=image]').val();
    var issuer = $('input[name=issuer]').val();
    var triggerTopic = $('input[name=triggerTopic]').val();
    var criteria = $('input[name=criteria]').val();

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
             + "a for-real badge.\n"
             + "discussion:     " + discussion + "\n"
             + "\n"
             + "# A link to the image for the badge.\n"
             + "image_url:      " + image + "\n"
             + "\n"
             + "# The issuer.\n"
             + "issuer_id:      " + issuer + "\n"
             + "\n"
             + "# We'll perform our more costly check (defined below)\n"
             + "# only when we receive messages that match this trigger.\n"
             + "trigger:\n"
             + "  topic:        " + triggerTopic + "\n"
             + "\n"
             + "# Once the check has been triggered, this defines what we"
             + " actually check.\n"
             + "criteria:       " + criteria + "\n"
             // TODO: Figure out best way to add criteria here.
             + "(This section is under construction.)";

    }

    function updateTextarea() {
        $('textarea#preview').val(generateOutput());
    }

    // We call this once to make sure things are proper on page load.
    updateTextarea();

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

    $('input[name=discussion]').keyup(function() {
        discussion = $(this).val();
        updateTextarea();
    });

    $('input[name=image]').keyup(function() {
        image = $(this).val();
        updateTextarea();
    });

    $('input[name=issuer]').keyup(function() {
        issuer = $(this).val();
        updateTextarea();
    });

    $('input[name=triggerTopic]').keyup(function() {
        triggerTopic = $(this).val();
        updateTextarea();
    });

    $('input[name=criteria]').keyup(function() {
        criteria = $(this).val();
        updateTextarea();
    });

    // Handling for preview form:
    $('input[name=read-only]').click(function() {
        if ($(this).is(':checked')) {
            $('textarea#preview').prop('readonly', 'readonly');
        }
        else { 
            $('textarea#preview').prop('readonly', '');
        }
    });

    // Set read-only based on checkbox on page load.
    if ($('input[name=read-only]').is(':checked')) {
        $('textarea#preview').prop('readonly', 'readonly');
    }
    else { 
        $('textarea#preview').prop('readonly', '');
    }
});
