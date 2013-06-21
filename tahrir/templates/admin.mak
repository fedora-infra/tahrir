<%inherit file="master.mak"/>
<div class="page">
<p>The admin panel is currently under reconstruction.</p>

<div class="grid-50">
<form class="admin-form">
<legend>Add Person</legend>
	<div>
	<label for="person-email">Email</label>
	<input name="person-email" type="email" />
	</div><div>
	<input name="add-person" type="submit" value="Add" />
	</div>
</form>

</div>

<div class="grid-50">
<form class="admin-form">
<legend>Add Issuer</legend>
	<div>
	<label for="issuer-origin">Origin</label>
	<input name="issuer-origin" />
	</div><div>
	<label for="issuer-name">Name</label>
	<input name="issuer-name" />
	</div><div>
	<label for="issuer-org">Organization</label>
	<input name="issuer-org" />
	</div><div>
	<label for="issuer-contact">Contact</label>
	<input name="issuer-contact" />
	</div><div>
	<input name="add-issuer" type="submit" value="Add" />
	</div>
</form>
</div>

<div class="clear"></div>
</form>
</div>
