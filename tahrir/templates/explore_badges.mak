<%inherit file="master.mak"/>
<div class="page">

  <div class="clear spacer"></div>

  <!-- COLUMN 1 (Left)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">All Badges</h1>
      <div class="padded-content">
        <table>
          <tr>
            % for badge in all_badges:
              % if all_badges.index(badge) % 5 == 0 and all_badges.index(badge) != 0:
                </tr>
                <tr>
              % endif
              <td>${self.functions.badge_thumbnail(badge, 64, 15)}</td>
            % endfor
          </tr>
        </table>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Newest Badges</h1>
      <div class="padded-content">
        <table>
          <tr>
            % for badge in newest_badges:
              % if newest_badges.index(badge) % 5 == 0 and newest_badges.index(badge) != 0:
                </tr>
                <tr>
              % endif
              <td>${self.functions.badge_thumbnail(badge, 64, 15)}</td>
            % endfor
          </tr>
        </table>
      </div> <!-- End padded content -->
    </div> <!-- End shadow. -->
  </div> <!-- End grid-50 -->

  <div class="clear spacer"></div>
</div>
