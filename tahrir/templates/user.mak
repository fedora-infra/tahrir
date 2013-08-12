<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-30">
		<div class="shadow">
		<h1 class="section-header">User Info</h1>
		<div class="padded-content">

        ${self.functions.avatar_thumbnail(user, 'responsive', 100)}

		<p class="name">${user.nickname}</p>

		% if user.bio:
			<p class="description">${user.bio}</p>
		% endif

		<div class="metadata">
			<p>Arrived on ${user.created_on.strftime('%Y-%m-%d')}.</p>
			% if user.email == logged_in:
				<p>Email: ${user.email}</p>
			% endif

			% if rank != 0:
				<p>Ranked ${rank} out of ${user_count} ranked users
					(top ${percentile}%).</p>
			% else:
				<p>Not ranked yet.</p>
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

			<p>View user as: <a href="${request.route_url('user_json', id=user.nickname)}">
								JSON</a></p>
		</div>

		% if logged_in == user.email:

			% if len(invitations) > 0:
				<h3>Active Invitations</h3>
				% for i in invitations:
				<a href="${"/invitations/" + i.id + "/claim"}">
					${i.id[:7]}...</a>
					<a href="${"/invitations/" + i.id + "/qrcode"}">
					[QR code]</a>
					<br />
				% endfor
			% endif

			% if awarded_assertions:
			  <a href="javascript:claim_badges();">
				  <div class="pretty-button">
					  Export Badges
				  </div>
			  </a>
			% endif

            <form method="POST" action="https://www.libravatar.org/openid/login/">
                <input type="hidden" name="openid_identifier" value="${user.openid_identifier}"/>
                <input class="pretty-submit"
                       style="height: 50px; width: 100%;"
                       name="change-avatar"
                       type="submit"
                       value="Change Avatar" />
            </form>

			% if user.opt_out:
				<form method="POST">
					<input class="pretty-submit"
						   style="height: 50px; width: 100%;"
						   name="reactivate-account"
						   type="submit"
						   value="Reactivate Account" />
				</form>
			% else:
				<form method="POST">
					<input class="pretty-submit"
						   style="height: 50px;"
						   name="deactivate-account"
						   type="submit"
						   value="Deactivate Account" />
				</form>
			% endif

		% endif

		<!-- Change nickname button. -->
		% if logged_in == user.email and allow_changenick:
			<form method="POST">
				<input name="new-nickname"
					   placeholder="New nickname"
					   type="text"
					   style="width: 100%;"
					   required="required" />
				<input class="pretty-submit"
					   style="height: 50px;"
					   name="change-nickname"
					   type="submit"
					   value="Change Nickname" />
			</form>
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
			<div class="grid-container">
			<div style="text-align: center; font-size: 1.2em; padding: 20px;">
			% if len(user_badges) < 1:
				% if user.email == logged_in:
					<p>You have not earned any badges yet!</p>
				% else:
					<p>${user.nickname} has not earned any badges yet!</p>
				% endif
			% else:
				% if user.email == logged_in:
					<p>You have earned
				% else:
					<p>${user.nickname} has earned
				% endif
				<strong>${len(user_badges)}</strong>
				% if len(user_badges) == 1:
					badge
				% else:
					badges
				% endif
				(<strong>${"{0:.1f}".format(percent_earned)}%</strong> of total).
			% endif
			</div>
			% for i, badge in enumerate(user_badges):
				% if i % 3 == 0 and i != 0:
				</div><div class="grid-container">
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
