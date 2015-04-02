<%inherit file="master.mak" />
<div class="page">
  <!-- COLUMN 1 (Left)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Badge Info</h1>
      <div class="padded-content">
        ${self.functions.badge_thumbnail(badge, 256, 100)}
        <p class="name">${badge.name}</p>
        <div class="description">${badge_description_html | n}</div>
        <div class="metadata">
          % if badge.tags:
            <p>Tagged with:
              <% tag_list = badge.tags[:-1].split(',') %>
              % for tag in tag_list:
                % if tag_list.index(tag) == len(tag_list) - 1:
                  <a href="${request.route_url('tags', tags=tag.strip(), match='any')}">${tag}</a>
                % else:
                  <a href="${request.route_url('tags', tags=tag.strip(), match='any')}">${tag}</a>,
                % endif
              % endfor
            </p>
          % else:
            <p>This badge has not been tagged.</p>
          % endif
          <p>Issued by: ${badge.issuer.name}</p>
          <p>Criteria: <a href="${badge.criteria}">${badge.criteria}</a></p>
          <p>
            View badge as:
            % if badge.stl:
            <a href="${request.route_url('badge_stl', id=badge.id)}">STL</a>,
            % endif
            <a href="${request.route_url('badge_json', id=badge.id)}">JSON</a>,
            <a href="${request.route_url('badge_rss', id=badge.id)}">RSS</a>
          </p>

          % if badge.stl:
            % for assertion in awarded_assertions:
                % if assertion.badge == badge:
                  <button class="pretty-button" onClick="window.location.href='${request.route_url('badge_stl', id=badge.id)}'">
                    Export to Reality
                  </button>
                % endif
            % endfor
          %endif

          % if 'group:admins' in auth_principals:
          <h3 class="section-header">Add tags to this badge</h3>
          <form method="POST" action="${request.route_url('add_tag')}">
            <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
            <input name="badge_id" value=${badge.id} type="hidden"/>
            <div class="grid-50">
              <input name="tags"
                placeholder="tag1,tag2,tag3"
                required
                style="width: 100%;" />
            </div>
            <div class="grid-50">
              <input class="pretty-submit"
                style="height: 30px; width:100%"
                name="add"
                type="submit"
                value="Add" />
            </div>
          </form>

          <div class="clear spacer"></div>
          % endif

          % if badge.authorized(logged_in_person):
          <h3 class="section-header">Award this badge</h3>
          <form method="POST" action="${request.route_url('award')}">
            <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
            <input name="badge_id" value=${badge.id} type="hidden"/>
            <div class="grid-35">
              <input class="pretty-submit"
                style="height: 30px; width:100%"
                name="award"
                type="submit"
                value="Award directly" />
            </div>
            <div class="grid-25">to</div>
            <div class="grid-40">
              <input name="nickname"
                placeholder="username"
                required
                style="width: 100%;" />
            </div>
          </form>

          <div class="clear spacer"></div>

          <form method="POST" action="${request.route_url('invite')}">
            <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
            <input name="badge_id" value=${badge.id} type="hidden"/>
            <div class="grid-35">
              <input class="pretty-submit"
                style="height: 30px; width:100%"
                name="invite"
                type="submit"
                value="Create invitation" />
            </div>
            <div class="grid-25">that expires on</div>
            <div class="grid-40">
              <input name="expires-on"
                type="datetime"
                placeholder="YYYY-MM-DD HH:MM"
                style="width: 100%;" />
            </div>
          </form>
          <div class="clear spacer"></div>
          %endif

        </div>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>
  <!-- COLUMN 2 (Right)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Badge Statistics</h1>
      <div class="padded-content">
        <ul class="pretty-list">
          % for assertion in awarded_assertions:
              % if assertion.badge == badge:
                <li>You were awarded this badge on
                % if assertion.issued_for:
                <strong>${assertion.issued_on.strftime("%Y-%m-%d")}</strong>
                due to <a href="${assertion.issued_for}">this event</a>.
                %else:
                <strong>${assertion.issued_on.strftime("%Y-%m-%d")}</strong>.
                % endif
                </li>
                <% break %>
              % endif
          % endfor
          <li>
            Created on <strong>${badge.created_on.strftime("%Y-%m-%d")}</strong>.
          </li>
          % if times_awarded == 0:
            <li>This badge has <strong>never been awarded!</strong></li>
          % else:
            <li>
              Awarded <strong>${times_awarded}</strong> ${'time' if times_awarded == 1 else 'times'}.
          % endif
          <li>
            <strong>${"{0:.1f}".format(percent_earned * 100)}%</strong> of people have earned this badge.
          </li>
          % if first_awarded and last_awarded:
            <li>
              First earned by
              <a href="${request.route_url('user', id=first_awarded_person.nickname or first_awarded_person.id)}">
                <strong>${first_awarded_person.nickname}</strong>
              </a>
              on <strong>${first_awarded.issued_on.strftime("%Y-%m-%d")}</strong>.
            </li>
            <li>
              Last awarded to
              <a href="${request.route_url('user', id=last_awarded_person.nickname or last_awarded_person.id)}">
                <strong>${last_awarded_person.nickname}</strong>
              </a>
              on <strong>${last_awarded.issued_on.strftime("%Y-%m-%d")}</strong>.
            </li>
          % endif
        </ul>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="clear spacer"></div>

  <!-- Display linked names of the people who have earned the badge. -->
  <div class="grid-100">
    <div class="shadow">
      <h1 class="section-header">Badge Holders</h1>
      <div class="padded-content">
        % if badge_assertions:
          ${self.body()}
        % else:
          <p>No one has earned this badge yet!</p>
        % endif
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>
  <div class="clear spacer"></div>
</div>
