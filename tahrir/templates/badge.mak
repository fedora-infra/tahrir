<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-50">
		<table>
		<tr><td><strong>${badge.name}</strong></td><td>
		<a href="${request.route_url('badge', id=badge.id)}"><img class="badge"
		% if badge.image.startswith("http"):
			src="${badge.image}"
		% else:
			src="${base_url}/pngs/${badge.image}"
		% endif
			alt="${badge.id} icon" /></a></td></tr>
		<tr><td>Description</td><td>${badge.description}</td></tr>
			<tr><td>Criteria</td><td>${badge.criteria}</td></tr>
			<tr><td>Created</td><td>${badge.created_on.strftime("%Y-%m-%d")}
				</td></tr>
			<tr><td>Issuer</td><td>${badge.issuer_id}</td></tr>
			<tr><td>Tags</td><td>${badge.tags}</td></tr>
		</table>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-50">
		<h3>Statistics</h3>
		<ul class="pretty-list">
		<li>${badge.name} has been awarded <strong>${times_awarded}</strong> times.</li>
		<li><a href="${request.route_url('user', id=first_awarded_person.id)}">
				<strong>${first_awarded_person.nickname}</a></strong>
				was the first to earn this badge,
				on <strong>${first_awarded.issued_on.strftime("%Y-%m-%d")}
				</strong>.</li>
		<li>This badge was last awarded to <strong>
			<a href="${request.route_url('user', id=last_awarded_person.id)}">
				${last_awarded_person.nickname}</a></strong>
				on <strong>${last_awarded.issued_on.strftime("%Y-%m-%d")}
				</strong>.</li>
		</ul>
	</div>
    
	<div class="clear spacer"></div>
</div>
