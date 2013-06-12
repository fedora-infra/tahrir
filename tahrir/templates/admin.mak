<%inherit file="master.mak"/>
<div class="page">
	<div class="grid-33">
	${person_form.display() | n}
	</div>

	<div class="grid-33">
	${issuer_form.display() | n}
	</div>
	
	<div class="grid-33">
	${badge_form.display() | n}
	</div>

	<div class="clear"></div>

	<div class="grid-33">
	${invitation_form.display() | n}
	</div>

	<div class="grid-33">
	${assertion_form.display() | n}
	</div>
</div>
