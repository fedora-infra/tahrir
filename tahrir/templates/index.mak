<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-33">
		<h2 class="section-header">Latest Awards</h2>
		<div class="padded-content">
			<table>
			% for assertion in latest_awards:
			<tr>
			<td><a href="/badge/${assertion.badge_id}">
				<img class="badge"
% if badge_images[assertion.badge_id].startswith("http"):
					src="${badge_images[assertion.badge_id]}"
% else:
					src="/pngs/${badge_images[assertion.badge_id]}"
% endif
					alt="${assertion.badge_id} icon" /></a></td>
			<td>${assertion.recipient[:6]} was awarded
				<a href="/badge/${assertion.badge_id}">
					${assertion.badge_id}</a>
				<span class="date">${assertion.issued_on.strftime("%Y-%m-%d")}</span></td>
			% endfor
			</tr>
			</table>
		</div> <!-- End padded content. -->
	</div>
	<!-- COLUMN 2 (Middle)-->
	<div class="grid-33">
		<h2 class="section-header">New Contributors</h2>
		<div class="padded-content">
			<table>
			% for person in newest_persons:
				<tr><td>${person}</td></tr>
			% endfor
			</table>
		</div> <!-- End padded content. -->

	</div>
	<!-- COLUMN 3 (Right)-->
	<div class="grid-33">
		<h2 class="section-header">Top Contributors</h2>
		<div class="padded-content">
			<table>
			% for person in sorted(top_persons, key=top_persons.get, reverse=True):
				<tr><td>${person} with <strong>${top_persons[person]}
				</strong>
				% if top_persons[person] == 1:
					badge
				% else:
					badges
				% endif
				</td></tr>
			% endfor
			</table>
		</div> <!-- End padded content. -->
	</div>
    
	<div class="clear spacer"></div>
</div>
