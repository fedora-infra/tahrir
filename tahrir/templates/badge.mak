<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-25">
		<h3>${badge.name}</h3>
		<a href="${request.route_url('badge', id=badge.id)}"><img class="badge"
		% if badge.image.startswith("http"):
			src="${badge.image}"
		% else:
			src="${base_url}/pngs/${badge.image}"
		% endif
			alt="${badge.id} icon" /></a>
		<table>
		<tr><td>Description</td><td>${badge.description}</td></tr>
			<tr><td>Criteria</td><td>${badge.criteria}</td></tr>
			<tr><td>Created</td><td>${badge.created_on.strftime("%Y-%m-%d")}
				</td></tr>
			<tr><td>Issuer</td><td>${badge.issuer_id}</td></tr>
			<tr><td>Tags</td><td>${badge.tags}</td></tr>
		</table>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-75">
		<h3>Statistics</h3>
	</div>
    
	<div class="clear spacer"></div>
</div>
