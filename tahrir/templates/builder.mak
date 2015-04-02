<%inherit file="master.mak"/>
<script type="text/javascript" src="${request.static_url('%s:static/js/builder.js' % theme_name)}"></script>
<div class="page">
  <div class="grid-100">
    <h1 class="section-header">Badge Builder</h1>
    <div class="padded-content">
      <p>
        Badges can be awarded automatically when certain critera
        are met. This is done with data collected by
        <a href="https://github.com/fedora-infra/datanommer">datanommer</a>
        from the
        <a href="https://github.com/fedora-infra/fedmsg">fedmsg</a>
        bus. A text file written in
        <a href="https://en.wikipedia.org/wiki/Yaml">YAML</a> is used
        to define when and how a particular badge is awarded.
      </p>
      <p>
        This tool may be used by administrators to create badge files
        for new badges, or by regular users to create badge files for
        badges they want to submit to an administrator for
        consideration. This builder does not submit badges anywhere,
        it is simply a useful browser tool.
      </p>
    </div>
    <div class="clear"></div>
    <!-- COLUMN 1 (Left)-->
    <div class="grid-50">
      <h3>Badge Builder</h3>
      <form id="builder-form" method="POST">
        <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
        <table>
          <tr>
            <td><label for="badge-name">Badge Name</label></td>
            <td><input name="badge-name" tabindex="1" /></td>
            <td><label for="discussion">Discussion URL</label></td>
            <td><input name="discussion" tabindex="4" /></td>
          </tr>
          <tr>
            <td><label for="badge-description">Badge Description</label></td>
            <td><input name="badge-description" tabindex="2" /></td>
            <td><label for="image">Image URL</label></td>
            <td><input name="image" tabindex="5" /></td>
          </tr>
          <tr>
            <td><label for="badge-creator">Badge Creator</label></td>
            <td>
              <input name="badge-creator" tabindex="3" value="${default_creator if default_creator else ''}" />
            </td>
            <td><label for="issuer">Issuer ID</label></td>
            <td>
              <input name="issuer" tabindex="6" value="${request.registry.settings.get('tahrir.default_issuer', '')}" />
            </td>
          </tr>
          <tr>
            <td><label for="trigger-topic">Trigger Topic</label></td>
            <td><input name="trigger-topic" tabindex="7" /></td>
            <td><label for="criteria">Criteria</label></td>
            <td><input name="criteria" tabindex="8" /></td>
          </tr>
          <tr>
            <td colspan="4">
              <input name="generate" type="submit" action="${request.route_url('builder')}" value="Generate" />
            </td>
          </tr>
        </table>
      </form>
    </div>
    <!-- COLUMN 2 (Right)-->
    <div class="grid-50">
  <!--- COMMENT OUT THE PREVIEW AREA FOR NOW
      <h3>Preview</h3>
  <p>Preview will work only if JavaScript is enabled.</p>
  <form id="preview-options-form">
    <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
    <table>
      <tr><td>
          <label for="read-only">Preview is read only?
            <span class="sublabel">Any changes will be
              undone if any of the above fields are altered.</span>
          </label></td>
        <td><input type="checkbox" name="read-only" checked="checked"/></td></r>
</table>
</form>
<textarea id="preview"
          form="builder-form" readonly="readonly"
          rows="25" cols="80"></textarea>
</div>
</div>

END COMMENTING OUT PREVIEW AREA -->

  <h3>Output</h3>
  % if badge_yaml:
    <textarea rows="30" cols="80">${badge_yaml}</textarea>
  % else:
    <textarea rows="30" cols="80">Badge YAML will appear here.</textarea>
  % endif

  <div class="clear spacer"></div>
</div>
