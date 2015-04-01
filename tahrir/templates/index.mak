<%inherit file="master.mak"/>
<div class="page">
  <!-- COLUMN 1 (Left)-->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">Latest Awards</h1>
      <div id="latest-awards" class="padded-content">
        % for assertion in latest_awards:
          <div class="grid-container">
            ${self.functions.avatar_thumbnail(assertion.person, 64, 33)}
            <div class="grid-33 text-64">
              <a href="${request.route_url('user', id=assertion.person.nickname or assertion.person.id)}">
                ${assertion.person.nickname}
              </a>
              <span class="date">${assertion.issued_on_rel}</span>
            </div>
            ${self.functions.badge_thumbnail(assertion.badge, 64, 33)}
          </div>
        % endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow -->
  </div>
  <!-- COLUMN 2 (Middle)-->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">Weekly Leaders</h1>
      <div class="padded-content">
        % for person in weekly_leaders.keys()[:n]:
          <div class="grid-container">
            ${self.functions.avatar_thumbnail(person, 64, 33)}
            <div class="grid-66 text-64">
              <a href="${request.route_url('user', id=person.nickname or person.id)}">
                ${person.nickname or person.email}
              </a>
              with <strong>${weekly_leaders[person]['badges']}</strong>
              ${'badge' if weekly_leaders[person]['badges'] == 1 else 'badges'} this week.
            </div>
          </div> <!-- end grid-container -->
        % endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow -->

  </div>
  <!-- COLUMN 3 (Right)-->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">Monthly Leaders</h1>
      <div class="padded-content">
        % for person in monthly_leaders.keys()[:n]:
          <div class="grid-container">
            ${self.functions.avatar_thumbnail(person, 64, 33)}
            <div class="grid-66 text-64">
              <a href="${request.route_url('user', id=person.nickname or person.id)}">
                ${person.nickname or person.email}
              </a>
              with <strong>${monthly_leaders[person]['badges']}</strong>
              ${'badge' if monthly_leaders[person]['badges'] == 1 else 'badges'} this month.
            </div>
          </div> <!-- end grid-container -->
        % endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow -->
  </div>

  <!-- Set up the moksha live socket -->
  ${moksha_socket.display() | n}

  <div class="clear spacer"></div>
</div>

