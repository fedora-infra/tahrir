<%inherit file="master.mak"/>
<div class="page">
	<!-- Header row -->
	<div class="grid-100">
		<h1>${badge.name}</h1>
	</div>

	<div class="clear"></div>

	<!-- COLUMN 1 (Left)-->
	<div class="grid-66">
		<img src="${badge.image}" alt="${badge.name} image" />
		<p>${badge.description}</p>
		<em>Issued by issuer ${badge.issuer_id}</em>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-34">
		<p>12 users have this badge!</p>
		<p>This badge was added on Feb 15, 1985!</p>
	</div>
    
	<div class="clear spacer"></div>
</div>
