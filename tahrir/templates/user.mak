<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-30">
		<div class="shadow">
		<h1 class="section-header">User Info</h1>
		<div class="padded-content">

        ${self.functions.avatar_thumbnail(user, 256, 100)}

		<p class="name">${user.nickname}</p>
		
		% if user.bio:
			<p class="description">${user.bio}</p>
		% endif

		<div class="metadata">
			<p>Arrived on ${user.created_on.strftime('%Y-%m-%d')}.</p>
			% if user.email == logged_in:
				<p>Email: ${user.email}</p>
			% endif

			% if user.website:
				<p>Website: 
				% if user.website.startswith('http'):
					<a href="${user.website}">
				% else:
					<a href="http://${user.website}">
				% endif
					${user.website}</a></p>
			% endif
		</div>

		<!-- Change nickname button. -->
		% if logged_in == user.email:
			<form method="POST">
				<input name="new-nickname" type="text"
					   required="required" />
				<input name="change-nickname" type="submit"
					   value="Change Nickname" />
			</form>
		% endif

		% if logged_in == user.email:
			% if awarded_assertions:
			  <a href="javascript:claim_badges();">
				  <div class="pretty-button">
					  Export Badges
				  </div>
			  </a>
			% endif
			<a href="https://www.libravatar.org/account/upload_photo/">
				<div class="pretty-button">Change Avatar</div></a>
		% endif
		
		% if user.email == logged_in:
		% endif
		
		
		</div> <!-- End shadow. -->
		</div> <!-- End padded content. -->

	</div> <!-- End column 1. -->

	<!-- COLUMN 2 (Right)-->
	<div class="grid-70">
		<div class="shadow">
		<h1 class="section-header">Badges Earned</h1>
		<div class="padded-content">
			<div>
			% for i, badge in enumerate(user_badges):
				% if i % 3 == 0 and i != 0:
				</div><div>
				% endif
				${self.functions.badge_thumbnail(badge, 128, 33)}
			% endfor
			</div>
		</div>

		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->

	</div> <!-- End column 2. -->
    
	<div class="clear spacer"></div>
</div>
