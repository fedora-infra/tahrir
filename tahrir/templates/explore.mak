<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-100">
		<h1 class="section-header">Explore</h1>
		<div class="padded-content">
		<p><strong>This is the latest addition to Tahrir!</strong>
			From here,
			you will be able to search for and discover
			both people and badges.</p>
		</div>
	</div>

	<div class="clear"></div>

	<div class="grid-50">
		<div class="padded-content">
		<h2>Random Badges</h2>
		% for badge in random_badges:
			${self.functions.badge_thumbnail(badge, 64, 15)}
		% endfor
		<div class="clear"></div>
		<h2>Badge Search</h2>
		<form method="POST">
			<table style="width: 400px">
			<tr><td><label for="badge-id">Badge ID
				<span class="sublabel">Substitute hyphens for spaces.
					</label></td>
			<td><input name="badge-id" required="required" /></td></tr>
			<tr><td>
				<input name="badge-search" type="submit" value="Search" />
				</td></tr>
			</table>
		</form>
		</div>
	</div>

	<div class="grid-50">
		<div class="padded-content">
		<h2>Random People</h2>
		% for person in random_persons:
			${self.functions.avatar_thumbnail(person, 64, 15)}
		% endfor
		<div class="clear"></div>
		<h2>People Search</h2>
		<form method="POST">
			<table style="width: 400px">
			<tr><td><label for="person-nickname">Nickname</label></td>
			<td><input name="person-nickname" required="required" /></td>
			</tr><tr><td>
			<input name="person-search" type="submit" value="Search" /></td>
			</tr>
			</table>
		</form>
		</div> <!-- End padded content -->
	</div> <!-- End grid-50 -->

	<div class="clear spacer"></div>
</div>
