<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-33">
		<h2 class="section-header">Latest Awards</h2>
		<div class="padded-content">
			<table>
			% for assertion in latest_awards:
			<tr>
			<td>img</td>
			<td>${assertion.recipient[:6]} was awarded the
				${assertion.badge_id}
				badge by ${assertion.person_id}
				on ${assertion.issued_on.strftime("%Y-%m-%d")}</td>
			% endfor
			</tr>
			</table>
		</div> <!-- End padded content. -->
	</div>
	<!-- COLUMN 2 (Middle)-->
	<div class="grid-33">
		<h2 class="section-header">Fresh Contributors</h2>
		<div class="padded-content">
			<ul>
			% for person in newest_persons:
				<li>${person}</li>
			% endfor
			</ul>
		</div> <!-- End padded content. -->

	</div>
	<!-- COLUMN 3 (Right)-->
	<div class="grid-33">
		<h2 class="section-header">Top Contributors</h2>
		<div class="padded-content">
			<p>This column lists the users with the most awards.</p>
		</div> <!-- End padded content. -->
	</div>
    
	<div class="clear spacer"></div>
</div>
