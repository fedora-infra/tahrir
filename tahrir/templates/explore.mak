<%inherit file="master.mak"/>
<div class="page">

	% if len(search_results) > 0:
		<div class="grid-100">
		<div class="shadow">
		<h1 class="section-header">Search Results</h1>
		<div class="padded-content">
		<ul class="pretty-list">
		% for r in search_results:
			<li><a href="${search_results[r]}">${r}</a></li>
		% endfor
		</ul>
		</div> <!-- End padded-content. -->
		</div> <!-- End shadow. -->
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
		<h2>Badge Search</h2>
		<form method="POST">
			<table>
			<tr><td><label for="badge-query">Keyword
				<span class="sublabel">Search through badge names,
					descriptions, and tags.</span></label></td>
			<td><input name="badge-query" required="required" /></td></tr>
			<tr><td colspan="2">
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
		<h2>Person Search</h2>
		<form method="POST">
			<table>
			<tr><td><label for="person-query">Keyword
				<span class="sublabel">Search through person names
					and bios.</span></label></td>
			<td><input name="person-query" required="required" /></td>
			</tr><tr><td colspan="2">
			<input name="person-search" type="submit" value="Search" /></td>
			</tr>
			</table>
		</form>
		</div> <!-- End padded content -->
		</div> <!-- End shadow. -->
	</div> <!-- End grid-50 -->

	<div class="clear spacer"></div>
	
	<div class="grid-50">
		<div class="shadow">
		<h1 class="section-header">Explore Tags</h2>
		<div class="padded-content">
		<h2>View Tags</h2>
		<form method="POST">
			<table>
			<tr><td><label for="tag-query">Tags
				<span class="sublabel">Separate tags with commas.
					</span></label></td>
			<td><input name="tag-query" required="required" /></td>
			</tr>
			<tr><td><label for="tag-match-all">Match all tags?
				<span class="sublabel">Otherwise, match any tags.
					</span></label></td>
			<td><input name="tag-match-all" type="checkbox" /></td>
			</tr><tr><td colspan="2">
			<input name="tag-search" type="submit" value="Search" /></td>
			</tr>
			</table>
		</form>
		</div> <!-- End padded content. -->
		</div> <!-- End shadow. -->
	</div> <!-- End grid-50. -->
</div>
