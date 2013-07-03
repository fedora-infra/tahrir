<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-33">
		<h1 class="section-header">Latest Awards</h1>
		<div class="padded-content">
			% for assertion in latest_awards:
			<div class="grid-container">
				${self.functions.avatar_thumbnail(assertion.person, 64, 33)}
				<div class="grid-33">
					was awarded
					<span class="date">${assertion.issued_on.strftime("%Y-%m-%d")}</span>
				</div>
				${self.functions.badge_thumbnail(assertion.badge, 64, 33)}
			</div>
			% endfor
		</div> <!-- End padded content. -->
	</div>
	<!-- COLUMN 2 (Middle)-->
	<div class="grid-33">
		<h1 class="section-header">New Contributors</h1>
		<div class="padded-content">
			% for person in sorted(newest_persons, key=lambda x: x.id, reverse=True):
				<div class="grid-container">
					${self.functions.avatar_thumbnail(person, 64, 33)}
					<div class="grid-33">
						<a href="${request.route_url('user', id=person.nickname or person.id)}">
							${person.nickname or person.email}
						</a>
						<span class="date">${person.created_on.strftime("%Y-%m-%d")}</span>
					</div>
				</div> <!-- end grid-container -->
			% endfor
		</div> <!-- End padded content. -->

	</div>
	<!-- COLUMN 3 (Right)-->
	<div class="grid-33">
		<h1 class="section-header">Top Contributors</h1>
		<div class="padded-content">
			% for person in top_persons_sorted:
				<div class="grid-container">
					${self.functions.avatar_thumbnail(person, 64, 33)}
					<div class="grid-66 text-64">
						<a href="${request.route_url('user', id=person.nickname or person.id)}">
							${person.nickname or person.email}
						</a>
						with <strong>${top_persons[person]}</strong>
						% if top_persons[person] == 1:
							badge.
						% else:
							badges.
						% endif
					</div>
				</div> <!-- end grid-container -->
			% endfor
		</div> <!-- End padded content. -->
	</div>
    
	<div class="clear spacer"></div>
</div>

