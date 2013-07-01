<%inherit file="master.mak"/>
<div class="page">
	<div class="grid-100">
		<h1 class="section-header">Profile</h1>
	</div>

	<div class="clear"></div>

	<!-- COLUMN 1 (Left)-->
	<div class="grid-25">
		<h3>${user.nickname}</h3>
		<table>
			<tr><td>Email</td><td>
			% if user.email:
				${user.email}
			% else:
				<span class="weak">None.</span>
			% endif
			</td></tr>
			<tr><td>Website</td><td>
			% if user.website:
				${user.website}
			% else:
				<span class="weak">None.</span>
			% endif
			</td></tr>
			<tr><td>Bio</td><td>
			% if user.bio:
				${user.bio}
			% else:
				<span class="weak">None.</span>
			% endif
			</td></tr>
		</table>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-75">
		<h3>Badges Earned</h3>
		% for badge in user_badges:
			<a href="${request.route_url('badge', id=badge.id)}"><img class="badge"
			% if badge.image.startswith("http"):
				src="${badge.image}"
			% else:
				src="${base_url}/pngs/${badge.image}"
			% endif
				alt="${badge.id} icon" /></a>
		% endfor
	</div>
    
	<div class="clear spacer"></div>
</div>
