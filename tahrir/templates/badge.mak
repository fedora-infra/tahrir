<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-50">
		<div class="shadow">
		<h1 class="section-header">Badge Info</h1>
		<div class="padded-content">
		${self.functions.badge_thumbnail(badge, 256, 100)}
		<p class="name">${badge.name}</p>
		<div class="description">${badge_description_html | n}</div>
		<div class="metadata">
		% if badge.tags:
			<p>Tagged with:
			<% tag_list = badge.tags[:-1].split(',') %>
			% for tag in tag_list:
				% if tag_list.index(tag) == len(tag_list) - 1:
					<a href="${request.route_url('tags', tags=tag.strip(), match='any')}">${tag}</a>
				% else:
					<a href="${request.route_url('tags', tags=tag.strip(), match='any')}">${tag}</a>,
				% endif
			% endfor
			</p>
		% else:
			<p>This badge has not been tagged.</p>
		% endif
			<p>Issued by: ${badge.issuer_id}</p>
			<p>Criteria: <a href="${badge.criteria}">${badge.criteria}</a></p>
			<p>View badge as: <a href="${request.route_url('badge_json', id=badge.id)}">
								JSON</a></p>
		</div>
		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-50">
		<div class="shadow">
		<h1 class="section-header">Badge Statistics</h1>
		<div class="padded-content">
		<ul class="pretty-list">
		<li>Created on
			<strong>${badge.created_on.strftime("%Y-%m-%d")}</strong>.</li>
		% if times_awarded == 0:
		<li>This badge has <strong>never been awarded!</strong>
		% else:
		<li>Awarded <strong>${times_awarded}</strong>
			% if times_awarded != 1:
				times.
			% else:
				time.
			% endif
		% endif
		<li><strong>${"{0:.1f}".format(percent_earned * 100)}%</strong>
			of people have earned this badge.</li>
		% if first_awarded and last_awarded:
			<li>First earned by
				<strong><a href="${request.route_url('user', id=first_awarded_person.id)}">
					${first_awarded_person.nickname}</a></strong>
					on <strong>${first_awarded.issued_on.strftime("%Y-%m-%d")}
					</strong>.</li>
		<li>Last awarded to <strong>
			<a href="${request.route_url('user', id=last_awarded_person.id)}">
				${last_awarded_person.nickname}</a></strong>
				on <strong>${last_awarded.issued_on.strftime("%Y-%m-%d")}
				</strong>.</li>
		% endif
		</ul>
		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div>
    
	<div class="clear spacer"></div>
	
	<!-- Display linked names of all the people who have earned the badge. -->
	<div class="grid-100">
		<div class="shadow">
		<h1 class="section-header">Badge Holders</h1>
		<div class="padded-content">
			% if badge_assertions:
				<p>
				% for assertion in badge_assertions:
					<%
						person = request.db.get_person(id=assertion.person_id)
					%>
					<a href=${request.route_url('user', id=person.nickname)}>
					${request.db.get_person(nickname=person.nickname).nickname}</a>
					% if badge_assertions.index(assertion) + 1 != len(badge_assertions):
					,
					% endif
				% endfor
				</p>
			% else:
				<p>No one has earned this badge yet!</p>
			% endif
		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div>
    
	<div class="clear spacer"></div>
</div>
