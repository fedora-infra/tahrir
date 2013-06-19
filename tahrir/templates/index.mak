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
			<td>${assertion.recipient[:6]} was awarded
				<a href="/badge/${assertion.badge_id}">
					${assertion.badge_id}</a>
				<span class="date">${assertion.issued_on.strftime("%Y-%m-%d")}</span></td>
			% endfor
			</tr>
			</table>
		</div> <!-- End padded content. -->
	</div>
	<!-- COLUMN 2 (Middle)-->
	<div class="grid-33">
		<h2 class="section-header">New Contributors</h2>
		<div class="padded-content">
			<table>
			% for person in newest_persons:
				<tr><td>${person}</td></tr>
			% endfor
			</table>
		</div> <!-- End padded content. -->

	</div>
	<!-- COLUMN 3 (Right)-->
	<div class="grid-33">
		<h2 class="section-header">Top Contributors</h2>
		<div class="padded-content">
			<table>
			% for person in top_persons:
				<tr><td>${person}</td></tr>
			% endfor
			</table>
		</div> <!-- End padded content. -->
	</div>
    
	<div class="clear spacer"></div>
</div>
