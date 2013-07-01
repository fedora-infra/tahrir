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

		<h2>Badges</h2>
		<form method="POST">
			<label for="badge-id">Badge ID</label>
			<input name="badge-id" required="required" />
			<input name="badge-search" type="submit" value="Search" />
		</form>

		<h2>People</h2>
		<form method="POST">
			<label for="person-nickname">Person Nickname</label>
			<input name="person-nickname" required="required" />
			<input name="person-search" type="submit" value="Search" />
		</form>
		</div> <!-- End padded content -->
	</div> <!-- End grid-100 -->

	<div class="clear spacer"></div>
</div>
