<%inherit file="master.mak"/>
<div class="page">

  <div class="clear spacer"></div>

  <!-- COLUMN 1 (Left)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">All Badges</h1>
      <div class="flex-container padded-content">
        % for badge in all_badges:
          ${self.functions.badge_thumbnail_flex(badge, 64, 15)}
        % endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Newest Badges</h1>
      <div class="flex-container padded-content">
        % for badge in newest_badges:
          ${self.functions.badge_thumbnail_flex(badge, 64, 15)}
        % endfor
      </div> <!-- End padded content -->
    </div> <!-- End shadow. -->
  </div> <!-- End grid-50 -->

  <div class="clear spacer"></div>
</div>
