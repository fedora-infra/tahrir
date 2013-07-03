<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-100">
	</div>
	<div class="clear"></div>
	<div class="grid-50">
		<h1 class="section-header">Your Rank</h1>
		<div class="padded-content">
		% if logged_in:
			% if rank == 0:
				<p>You are not ranked yet. There are ${user_count}
				ranked users.</p>
			% else:
				<p>You are ranked #${rank} out of ${user_count}
				ranked users.</p>
				<p>You are in
				the top ${"{0:.1f}".format(percentile)}%.</p>
				<h3>Competitors</h3>
				<table>
				% for person in competitors:
					% if person.email == logged_in:
					<tr>
					<td><strong>
						#${top_persons_sorted.index(person) + 1}</strong></td>
						</td>
					<td>${self.functions.avatar_thumbnail(person, 64, 33)}</td>
						<td><strong>
						<a href="${request.route_url('user',
							id=person.id)}">${person.nickname}</a></strong>
							</td>
					% else:
					<td>#${top_persons_sorted.index(person) + 1}</td>
					<td>${self.functions.avatar_thumbnail(person, 64, 33)}</td>
						<td><a href="${request.route_url('user',
							id=person.id)}">${person.nickname}</a></td>
					% endif
					</tr>
				% endfor
				</table>
			% endif
		% else:
			<p>Log in to see your rank. There are ${user_count}
			ranked users.</p>
		% endif
		</div> <!-- End padded content. -->
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-50">
		<h1 class="section-header">Leaderboard</h1>
		<div class="padded-content">
			<table>
			% for person in top_persons_sorted:
			<tr><td style="width: 20px;">#${top_persons_sorted.index(person) + 1}.</td>
				<td style="width: 64px;">${self.functions.avatar_thumbnail(person, 64, 33)}</td>
					<td><a href="${request.route_url('user', id=person.id)}">
						${person.nickname}</a>
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
