<%def name="avatar_thumbnail(person, size, cell_width)">
	<div class="grid-${cell_width} avatar-container">
		<div class="avatar avatar-${size}">
			<a href="${request.route_url('user', id=person.nickname or person.id)}">
				<img src="${person.avatar_url(size)}"/>
			</a>
		</div>
	</div>
</%def>

<%def name="badge_thumbnail(badge, size, cell_width)">
	<div class="grid-33">
		<a href="${request.route_url('badge', id=badge.id)}">
			<img class="badge"
% if badge.image.startswith("http"):
				src="${badge.image}"
% else:
				src="${base_url}/pngs/${badge.image}"
% endif
				alt="${badge.id} icon" />
		</a>
	</div>
</%def>
