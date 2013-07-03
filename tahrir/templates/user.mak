<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-25 grid-parent">

		<div class="grid-80 push-10">
			<h2 class="header downshift">${user.nickname}</h2>
		</div>

		<div class="grid-100">
			${self.functions.avatar_thumbnail(user, 256, 100)}
		</div>

		% if user.email == logged_in:
			<div class ="grid-95 push-5">
				<!-- tried vertical-align, margins, and paddings of all sorts,
					 but to no avail. the "change avatar" link will not
					 behave. -->
					 <span style="display: inline-block; margin-top: -25px;"> 
				<a href="https://www.libravatar.org/account/upload_photo/">
					[change your avatar]</a></span>
			</div>

			% if user.email:
				<div class="grid-95 push-5">
					<strong>${user.email}</strong>
				</div>
			% endif
		% endif


		% if user.website:
			<div class="grid-95 push-5">
				% if user.website.startswith('http'):
					<a href="${user.website}">
				% else:
					<a href="http://${user.website}">
				% endif
					${user.website}</a>
			</div>
		% endif

		% if user.bio:
			<div class="grid-95 push-5">
				<p>${user.bio}</p>
			</div>
		% endif

		% if logged_in == user.email:
			% if awarded_assertions:
			<div class="grid-70 push-10 downshift-20">
			  <a href="javascript:claim_badges();">
				  <div class="section-header">
					  Export Badges
				  </div>
			  </a>
			</div>
			% endif
		% endif

	</div>

	<!-- COLUMN 2 (Right)-->
	<div class="grid-50 push-10 grid-parent">
		<div class="grid-container">
			<div class="grid-80 push-5">
				<h2 class="header downshift">Badges Earned</h2>
			</div>

		% for i, badge in enumerate(user_badges):
			% if i % 3 == 0 and i != 0:
		</div>
		<div class="grid-container">
			% endif
			${self.functions.badge_thumbnail(badge, 128, 33)}
		% endfor
		</div>
	</div>
    
	<div class="clear spacer"></div>
</div>
