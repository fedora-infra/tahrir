<%inherit file="master.mak"/>
<div class="page">
	<div class="grid-100">
		<div class="shadow">
		<h1 class="section-header">Tag Info</h1>
		<div class="padded-content">
			<p>You searched for the following tags:</p>
			<ul style="margin-left: 25px;">
			% for t in tags:
			<li>${t}</li>
			% endfor
			</ul>
		</div> <!-- End shadow. -->
		</div> <!-- End padded content. -->

	</div> <!-- End grid-100. -->
    
	<div class="clear spacer"></div>
</div>
