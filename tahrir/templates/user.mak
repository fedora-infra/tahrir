<%inherit file="master.mak"/>
<div class="page">
	<!-- Header row -->
	<div class="grid-100">
		<h1>${user.email}</h1>
	</div>

	<div class="clear"></div>

	<!-- COLUMN 1 (Left)-->
	<div class="grid-66">
		<p><strong>ID:</strong> ${user.id}</p>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-34">
		<p>This user has X badges!</p>
		<p>This user joined on a date!</p>
	</div>
    
	<div class="clear spacer"></div>
</div>
