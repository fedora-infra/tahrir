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
		<li>The ${badge.name} badge was created on
			${badge.created_on.strftime("%Y-%m-%d")}.</li>
		% if times_awarded == 0:
		<li>${badge.name} has <strong>never been awarded!</strong>
		% else:
		<li>${badge.name} has been awarded <strong>${times_awarded}</strong>
			% if times_awarded != 1:
				times.
			% else:
				time.
			% endif
		% endif
		<li>${"{0:.1f}".format(percent_earned * 100)}% of people have earned this badge.</li>
		% if first_awarded and last_awarded:
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
		% endif
		</ul>
		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div>
    
	<div class="clear spacer"></div>
</div>
