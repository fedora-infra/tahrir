<%inherit file="master.mak"/>
<div class="page">
	<div class="grid-100">
		<div class="shadow">
		<h1 class="section-header">Tag Info</h1>
		<div class="padded-content">
			<p>You searched for 
			% for t in tags:
				<strong>
				% if tags.index(t) == len(tags) - 1:
					${t}</strong>
				% else:
					${t}</strong>,
				% endif
			% endfor
			</p>
			<ul class="pretty-list">
			% for badge in badges:
				<li><a href="${request.route_url('badge', id=badge.id)}">${badge.name}</li>
			% endfor
			</ul>
		</div> <!-- End shadow. -->
		</div> <!-- End padded content. -->

	</div> <!-- End grid-100. -->
    
	<div class="clear spacer"></div>
</div>
