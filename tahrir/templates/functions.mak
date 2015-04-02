<%def name="avatar_thumbnail(person, size, cell_width, tooltip=True)">
	<div class="grid-${cell_width} thumbnail-container">
		<div class="thumbnail thumbnail-${size}">
      % if tooltip:
			<span class="tooltip tooltip-${size}" data-tooltip="${person.nickname}">
      % endif
				<a href="${request.route_url('user', id=person.nickname or person.id)}">
					<img property="foaf:img schema:image" src="${person.avatar_url(size)}" />
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
			<span class="tooltip tooltip-${size} tooltip-${position}" data-tooltip="${badge.name} -- ${badge.description}">
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

<%def name="badge_thumbnail_flex(badge, size, cell_width, position='top')">
	<div class="thumbnail-container">
		<div class="thumbnail thumbnail-${size}">
			<span class="tooltip tooltip-${size} tooltip-${position}" data-tooltip="${badge.name} -- ${badge.description}">
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

<%def name="badge_holders(soft_limit, hard_limit)">
  % if times_awarded > soft_limit:
    % for i in range(0, soft_limit):
      ${link_person_nickname(badge_assertions[i].person)}
    % endfor
    % if times_awarded <= hard_limit:
      % for j in range(soft_limit, times_awarded):
        ${link_person_nickname(badge_assertions[j].person)}
      % endfor
    % else:
      ... and <a href="${request.route_url('badge_full', id=badge.id)}">${times_awarded - soft_limit} other people</a>.
    % endif
  % else:
    % for a in badge_assertions:
      ${link_person_nickname(a.person)}
    % endfor
  % endif
</%def>
