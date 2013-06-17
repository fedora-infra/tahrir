<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-25">
		<h3>${badge.name}</h3>
		<img src="${badge.image}" alt="${badge.name} image" />
		<p>${badge.description}</p>
		<em>Issued by issuer ${badge.issuer_id}</em>
	</div>
	<!-- COLUMN 2 (Right)-->
	<div class="grid-75">
		<h3>Statistics</h3>
	</div>
    
	<div class="clear spacer"></div>
</div>
