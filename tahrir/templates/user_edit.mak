<%inherit file="master.mak"/>
<div class="page">
	<div class="grid-50">
		<div class="shadow">
		<h1 class="section-header">User Details</h1>
		<div class="padded-content">

		<p><strong>Email:</strong> ${user.email}</p>
		<p><strong>Nickname:</strong> ${user.nickname}</p>
		<p><strong>Website:</strong> ${user.website}</p>
		<p><strong>Bio:</strong> ${user.bio}</p>

		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div>

	<div class="grid-50">
		<div class="shadow">
		<h1 class="section-header">Edit Details</h1>
		<div class="padded-content">

			<p>Fields left blank will not be updated.</p>

			<form method="POST">
				<input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
				% if allow_changenick:
				<input name="new-nickname"
					   placeholder="New nickname"
					   type="text"
					   style="width: 100%;" />
        % endif
				<input name="new-website"
					   placeholder="New website"
					   type="url"
					   style="width: 100%;" />
				<input name="new-bio"
					   placeholder="New bio"
					   type="text"
					   maxlength=139
					   style="width: 100%;" />
				<input class="pretty-submit"
					   style="height: 50px; width:100%"
					   name="edit-profile"
					   type="submit"
					   value="Update Profile" />
			</form>

		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div>

	<div class="clear spacer"></div>
