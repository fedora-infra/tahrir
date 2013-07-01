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
		<h2>Badges</h2>
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
		<h2>People</h2>
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
