<%inherit file="master.mak"/>
<div class="page">
<p>The admin panel is currently under reconstruction.</p>

<div class="grid-50">
<form class="admin-form">
<legend>Add Person</legend>
	<table>
	<tr><td><label for="person-email">Email</label></td>
	<td><input name="person-email" type="email" /></td></tr>
	<tr><td><label for="person-nickname">Nickname</label></td>
	<td><input name="person-nickname" /><td></tr>
	<tr><td><label for="person-website">Website</label></td>
	<td><input name="person-website" /><td></tr>
	<tr><td><label for="person-bio">Bio</label></td>
	<td><input name="person-bio" /><td></tr>
	<tr><td colspan="2">
		<input name="add-person" type="submit" value="Add" /></td></tr>
	</table>
</form>

</div>

<div class="grid-50">
<form class="admin-form">
<legend>Add Issuer</legend>
	<table>
	<tr><td><label for="issuer-origin">Origin</label></td>
	<td><input name="issuer-origin" /></td>
	</tr><tr>
	<td><label for="issuer-name">Name</label></td>
	<td><input name="issuer-name" /></td>
	</tr><tr>
	<td><label for="issuer-org">Organization</label></td>
	<td><input name="issuer-org" /></td>
	</tr><tr>
	<td><label for="issuer-contact">Contact</label></td>
	<td><input name="issuer-contact" /></td>
	</tr><tr>
	<td colspan="2"><input name="add-issuer" type="submit" value="Add" /></td>
	</tr>
	</table>
</form>
</div>

<div class="clear"></div>
