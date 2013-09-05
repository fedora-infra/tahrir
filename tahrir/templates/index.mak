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
      <h1 class="section-header">Newcomers</h1>
      <div class="padded-content">
        % for person in sorted(newest_persons, key=lambda x: x.id, reverse=True):
          <div class="grid-container">
            ${self.functions.avatar_thumbnail(person, 64, 33)}
            <div class="grid-33 text-64">
              <a href="${request.route_url('user', id=person.nickname or person.id)}">
                ${person.nickname or person.email}
              </a>
              <span class="date">${person.created_on_rel}</span>
            </div>
          </div> <!-- end grid-container -->
        % endfor
      </div> <!-- End padded content. -->
    </div> <!-- End shadow -->

  </div>
  <!-- COLUMN 3 (Right)-->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">Awesome People</h1>
      <div class="padded-content">
        % for person in top_persons_sample:
          <div class="grid-container">
            ${self.functions.avatar_thumbnail(person, 64, 33)}
            <div class="grid-66 text-64">
              <a href="${request.route_url('user', id=person.nickname or person.id)}">
                ${person.nickname or person.email}
              </a>
              with <strong>${len(person.assertions)}</strong>
              ${'badge' if len(person.assertions) == 1 else 'badges'}.
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

