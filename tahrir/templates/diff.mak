<%inherit file="master.mak" />
<div class="page">
  <!-- COLUMN 1 (Left) -->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">${user_a.nickname}</h1>
      <div class="padded-content">
	  	% for badge in user_a_unique_badges:
			${badge.id}
		% endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>
  <!-- COLUMN 2 (Center) -->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">Both</h1>
      <div class="padded-content">
		% for badge in shared_badges:
			${badge.id}
		% endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>
  <!-- COLUMN 3 (Right) -->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">${user_b.nickname}</h1>
      <div class="padded-content">
	  	% for badge in user_b_unique_badges:
			${badge.id}
		% endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="clear spacer"></div>

  <div class="clear spacer"></div>
</div>
