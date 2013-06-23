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

<div class="grid-50">
<form class="admin-form">
<legend>Add Badge</legend>
	<table>
	<tr><td><label for="badge-name">Name</label></td>
	<td><input name="badge-name" /></td>
	</tr><tr>
	<td><label for="badge-image">Image</label></td>
	<td><input name="badge-image" /></td>
	</tr><tr>
	<td><label for="badge-description">Description</label></td>
	<td><input name="badge-description" /></td>
	</tr><tr>
	<td><label for="badge-criteria">Criteria</label></td>
	<td><input name="badge-criteria" /></td>
	</tr><tr>
	<td><label for="badge-issuer">Issuer ID</label></td>
	<td><input name="badge-issuer" /></td>
	</tr><tr>
	<td><label for="badge-tags">Tags</label></td>
	<td><input name="badge-tags" /></td>
	</tr><tr>
	<td colspan="2"><input name="add-badge" type="submit" value="Add" /></td>
	</tr>
	</table>
</form>
</div>

<div class="grid-50">
<form class="admin-form">
<legend>Add Invitation</legend>
	<table>
	<tr><td><label for="invitation-created">Creation Date</label></td>
	<td><input name="invitation-created" type="date"/></td>
	</tr><tr>
	<td><label for="invitation-expires">Expiration Date</label></td>
	<td><input name="invitation-expires" type="date" /></td>
	</tr><tr>
	<td><label for="invitation-badge-id">Badge ID</label></td>
	<td><input name="invitation-badge-id" /></td>
	</tr><tr>
	<td><label for="invitation-issuer-id">Issuer ID</label></td>
	<td><input name="invitation-issuer-id" /></td>
	</tr><tr>
	<td colspan="2"><input name="add-invitation"
		type="submit" value="Add" /></td>
	</tr>
	</table>
</form>
</div>

<div class="clear"></div>

<div class="grid-50">
<form class="admin-form">
<legend>Add Assertion</legend>
	<table>
	<tr><td><label for="assertion-badge-id">Badge ID</label></td>
	<td><input name="assertion-badge-id" /></td>
	</tr><tr>
	<td><label for="assertion-person-id">Person ID</label></td>
	<td><input name="assertion-person-id" /></td>
	</tr><tr>
	<td colspan="2"><input name="add-assertion"
		type="submit" value="Add" /></td>
	</tr>
	</table>
</form>
</div>
