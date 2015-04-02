<%inherit file="master.mak"/>
<div class="page">

  <div class="clear spacer"></div>

  <!-- COLUMN 1 (Left)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">All Badges</h1>
      <div class="padded-content">
        % for tag in request.registry.settings.get('tahrir.display_tags', '').split(","):
        % if tag in sum([badge.tags.strip(",").split(",") for badge in all_badges], []):
        <h3 class="section-header">${tag.title()} Badges</h3>
        <div class="flex-container">
          % for badge in [b for b in all_badges if tag in b.tags.strip(",").split(",")]:
            ${self.functions.badge_thumbnail_flex(badge, 128, 33)}
          % endfor
        </div>
        % endif
        % endfor
        % if any([badge for badge in all_badges if not any([tag in request.registry.settings.get('tahrir.display_tags', '').split(",") for tag in badge.tags.strip(",").split(",")])]):
        <h3 class="section-header">Uncategorized Badges</h3>
        <div class="flex-container">
          % for badge in [b for b in all_badges if not any([tag in request.registry.settings.get('tahrir.display_tags', '').split(",") for tag in b.tags.strip(",").split(",")])]:
            ${self.functions.badge_thumbnail_flex(badge, 128, 33)}
          % endfor
        </div>
        % endif
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Newest Badges</h1>
      <div class="padded-content">
        % for tag in request.registry.settings.get('tahrir.display_tags', '').split(","):
        % if tag in sum([badge.tags.strip(",").split(",") for badge in newest_badges], []):
        <h3 class="section-header">${tag.title()} Badges</h3>
        <div class="flex-container">
          % for badge in [b for b in newest_badges if tag in b.tags.strip(",").split(",")]:
            ${self.functions.badge_thumbnail_flex(badge, 128, 33)}
          % endfor
        </div>
        % endif
        % endfor
        % if any([badge for badge in newest_badges if not any([tag in request.registry.settings.get('tahrir.display_tags', '').split(",") for tag in badge.tags.strip(",").split(",")])]):
        <h3 class="section-header">Uncategorized Badges</h3>
        <div class="flex-container">
          % for badge in [b for b in newest_badges if not any([tag in request.registry.settings.get('tahrir.display_tags', '').split(",") for tag in b.tags.strip(",").split(",")])]:
            ${self.functions.badge_thumbnail_flex(badge, 128, 33)}
          % endfor
        </div>
        % endif
      </div> <!-- End padded content -->
    </div> <!-- End shadow. -->
  </div> <!-- End grid-50 -->

  <div class="clear spacer"></div>
</div>
