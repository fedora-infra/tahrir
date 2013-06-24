<%inherit file="master.mak"/>
<script type="text/javascript" src="/static/js/builder.js"></script>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-25">
	<p>Badges can be awarded automatically when certain critera
		are met. This is done with data collected by
		<a href="https://github.com/fedora-infra/datanommer">
		datanommer</a> from the
		<a href="https://github.com/fedora-infra/fedmsg">fedmsg</a>
		bus. A text file written in
		<a href="https://en.wikipedia.org/wiki/Yaml">YAML</a> is used
		to define when and how a particular badge is awarded.
	</p>
	<p>This tool may be used by administrators to create badge files
		for new badges, or by regular users to create badge files for
		badges they want to submit to an administrator for
		consideration.
	</p>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-75">
	<form id="builder-form">
		<legend>Badge Builder</legend>
		<table>
		<tr><td><label for="badge-name">Badge Name</label></td>
			<td><input name="badge-name" tabindex="1" /></td>
			<td><label for="discussion">Discussion URL</label></td>
			<td><input name="discussion" tabindex="4" /></td></tr>
		<tr><td><label for="badge-description">Badge Description</label></td>
			<td><input name="badge-description" tabindex="2" /></td>
			<td><label for="image">Image URL</label></td>
			<td><input name="image" tabindex="5" /></td></tr>
		<tr><td><label for="badge-creator">Badge Creator</label></td>
			<td><input name="badge-creator" tabindex="3"
			% if default_creator:
					   value="${default_creator}"
			% endif
				 /></td>
			<td><label for="issuer">Issuer ID</label></td>
			<td><input name="issuer" tabindex="6" /></td></tr>
			<td><label for="triggerTopic">Trigger Topic</label></td>
			<td><input name="triggerTopic" tabindex="7" /></td>
			<td><label for="criteria">Criteria</label></td>
			<td><input name="criteria" tabindex="8" /></td></tr>
		</table>
	</form>
	<h3>Preview</h3>
	<form id="preview-options-form">
		<table style="width: 300px;">
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
    
	<div class="clear spacer"></div>
</div>
