<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-100">
	</div>
	<div class="clear"></div>
	<div class="grid-25">
		<h2 class="section-header">Your Rank</h2>
		<div class="padded-content">
		% if logged_in:
			% if rank == 0:
				You are not ranked yet. There are ${user_count}
				ranked users.
			% else:
				You are ranked ${rank} out of ${user_count}
				ranked users. You are in
				the top ${percentile}%.
			% endif
		% else:
			Log in to see your rank. There are ${user_count}
			ranked users.
		% endif
		</div> <!-- End padded content. -->
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-75">
		<div class="padded-content">
		<h2 class="section-header">Leaderboard</h2>
			<table>
	% for person in top_persons_sorted:
				<tr><td>#${top_persons_sorted.index(person) + 1}.
					<a href="${request.route_url('user', id=person.id)}">
						${person.email}</a>
						with <strong>${top_persons[person]}
				</strong>
				% if top_persons[person] == 1:
					badge.
				% else:
					badges.
				% endif
				</td></tr>
			% endfor
			</table>
		</div> <!-- End padded content. -->

	</div>
    
	<div class="clear spacer"></div>
</div>
