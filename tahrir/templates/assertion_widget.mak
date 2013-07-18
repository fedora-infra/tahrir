<%namespace name="functions" file="functions.mak" inheritable="True" />
<div class="grid-container">
	${functions.avatar_thumbnail(assertion.person, 64, 33)}
	<div class="grid-33 text-64">
		was awarded
		<span class="date">${assertion.issued_on_rel}</span>
	</div>
	${functions.badge_thumbnail(assertion.badge, 64, 33)}
</div>
