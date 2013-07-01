<%def name="avatar(person, size, cell_width)">
	<div class="grid-${cell_width} avatar-container">
		<div class="avatar avatar-${size}">
			<a href="${request.route_url('user', id=person.nickname or person.id)}">
				<img src="${person.avatar_url(size)}"/>
			</a>
		</div>
	</div>
</%def>
