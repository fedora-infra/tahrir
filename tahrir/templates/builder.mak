<%inherit file="master.mak"/>
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
			<td><input name="badge-name" /></td></tr>
		</table>
		<h3>Preview</h3>
		<textarea form="builder-form" readonly="readonly"
				  rows="25" cols="80"></textarea>
	</form>
	</div>
    
	<div class="clear spacer"></div>
</div>
