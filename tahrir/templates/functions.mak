<%def name="avatar_thumbnail(person, size, cell_width, tooltip=True)">
	<div class="grid-${cell_width} thumbnail-container">
		<div class="thumbnail thumbnail-${size}">
      % if tooltip:
			<span class="tooltip tooltip-${size}" data-tooltip="${person.nickname}">
      % endif
				<a href="${request.route_url('user', id=person.nickname or person.id)}">
					<img src="${person.avatar_url(size)}" />
				</a>
      % if tooltip:
			</span>
      % endif
		</div>
	</div>
</%def>

<%def name="badge_thumbnail(badge, size, cell_width, position='top')">
	<div class="grid-${cell_width} thumbnail-container">
		<div class="thumbnail thumbnail-${size}">
			<span class="tooltip tooltip-${size} tooltip-${position}" data-tooltip="${badge.name}">
				<a href="${request.route_url('badge', id=badge.id)}">
					<img class="badge-${size}"
		% if badge.image.startswith("http"):
						src="${badge.image}"
		% else:
						src="${base_url}/pngs/${badge.image}"
		% endif
						alt="${badge.id} icon" />
				</a>
			</span>
		</div>
	</div>
</%def>

<%def name="link_person_nickname(person)">
  <a href="${request.route_url('user', id=person.nickname or person.id)}">
    ${person.nickname}
  </a>
</%def>
