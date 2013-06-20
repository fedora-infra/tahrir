<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-25">
		<h3>${user.email}</h3>
		<table>
			<tr><td>
			% if user.nickname:
				${user.nickname}
			% else:
				No nickname set.
			% endif
			</td></tr>
			<tr><td>
			% if user.website:
				${user.website}
			% else:
				No website set.
			% endif
			</td></tr>
			<tr><td>
			% if user.bio:
				${user.bio}
			% else:
				No bio set.
			% endif
			</td></tr>
		</table>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-75">
		<h3>Badges Earned</h3>
	</div>
    
	<div class="clear spacer"></div>
</div>
