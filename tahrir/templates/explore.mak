<%inherit file="master.mak"/>
<div class="page">

	% if len(search_results) > 0:
		<div class="grid-100">
		<h1 class="section-header">Search Results</h1>
		<div class="padded-content">
		<ul class="pretty-list">
		% for r in search_results:
			<li><a href="${search_results[r]}">${r}</a></li>
		% endfor
		</ul>
		</div> <!-- End padded-content. -->
		</div> <!-- End grid-100. -->
	% endif

	<div class="clear spacer"></div>

	<!-- COLUMN 1 (Left)-->
	<div class="grid-50">
		<div class="shadow">
		<h1 class="section-header">Explore Badges</h2>
		<div class="padded-content">
		<h2>Random Badges</h2>
		% for badge in random_badges:
			${self.functions.badge_thumbnail(badge, 64, 15)}
		% endfor
		<div class="clear"></div>
		<h2>View Badge</h2>
		<form method="POST">
			<table>
			<tr><td><label for="badge-id">Badge ID
				<span class="sublabel">Substitute hyphens for spaces.
					For now, badge name must be exact.</span></label></td>
			<td><input name="badge-id" required="required" /></td></tr>
			<tr><td>
				<input name="badge-search" type="submit" value="Search" />
				</td></tr>
			</table>
		</form>
		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div>

	<div class="grid-50">
		<div class="shadow">
		<h1 class="section-header">Explore People</h2>
		<div class="padded-content">
		<h2>Random People</h2>
		% for person in random_persons:
			${self.functions.avatar_thumbnail(person, 64, 15)}
		% endfor
		<div class="clear"></div>
		<h2>View Person</h2>
		<form method="POST">
			<table>
			<tr><td><label for="person-nickname">Nickname
				<span class="sublabel">For now, person name must
					be exact.</span></label></td>
			<td><input name="person-nickname" required="required" /></td>
			</tr><tr><td>
			<input name="person-search" type="submit" value="Search" /></td>
			</tr>
			</table>
		</form>
		</div> <!-- End padded content -->
		</div> <!-- End shadow. -->
	</div> <!-- End grid-50 -->

	<div class="clear spacer"></div>
</div>
