<%inherit file="master.mak"/>
<div class="page"
     prefix="doap: http://usefulinc.com/ns/doap#"
     prefix="schema: http://schema.org/Person"
     resource=""
     typeof="foaf:Person schema:Person">
  <!-- COLUMN 1 (Left)-->
  <div class="grid-30">
    <div class="shadow">
      <h1 class="section-header">User Info</h1>
      <div class="padded-content clearfix">
        ${self.functions.avatar_thumbnail(user, 'responsive', 100, False)}
        <div class="grid-100">
          <p class="name" property="foaf:nick">${user.nickname}</p>
        </div>
        <span property="foaf:account" content="${user.openid_identifier}" />

        % if user.bio:
          <div class="grid-100">
            <p class="description">${user.bio}</p>
          </div>
        % endif

        <div class="metadata grid-60">
          <p>Arrived on ${user.created_on.strftime('%Y-%m-%d')}.</p>

          % if user.email == logged_in:
            <span property="foaf:mbox_sha1sum" content="${user.email_sha1}" />
            <p property="schema:email">${user.email}</p>
          % endif

          % if rank != 0:
            <p>
              Ranked ${rank} out of ${user_count} ranked users (top ${"{0:.2f}".format(float(percentile))}%).</p>
          % else:
            <p>Not ranked yet.</p>
          % endif

          % if user.website:
            <p>
              Website:
              % if user.website.startswith('http'):
                <a property="foaf:homepage" href="${user.website}">${user.website}</a>
              % else:
                <a property="foaf:homepage" href="http://${user.website}">${user.website}</a>
              % endif
            </p>
          % endif

          <p>
            View user as:
            <a href="${request.route_url('user_json', id=user.nickname or user.id)}">JSON</a>,
            <a href="${request.route_url('user_rss', id=user.nickname or user.id)}">RSS</a>,
            <a href="${request.route_url('user_foaf', id=user.nickname or user.id)}">RDF</a>
          </p>
        </div>
        % if logged_in == user.email:
          <div class="social grid-30 pull-5">
            <div id="social-activate">
              <button id="share" class="pretty-button" onClick="javascript:activate_social_links();">
                &laquo;Share&raquo;
              </button>
            </div>
            % if gplus:
              <div id="gplus-container">
                <div class="g-plusone" data-size="tall" data-annotation="none"></div>
              </div>
            % endif
            % if twitter:
              <div id="twitter-container">
                <a
                   href="https://twitter.com/share"
                   class="twitter-share-button"
                   data-text="${twitter_user_text}"
                   data-count="none"
                   data-hashtags="${twitter_user_hash}"
                   data-dnt="true">
                  Tweet
                </a>
              </div>
            % endif
          </div> <!-- End social grid -->
        % endif
        <div class="clear spacer"></div>
        % if logged_in == user.email:
          % if len(invitations) > 0:
            <h3>Active Invitations</h3>
            <ul class='pretty-list'>
            % for i in invitations:
            <li>
              ${i.badge.name}, expires ${i.expires_on_relative},
              <a href="${"/invitations/" + i.id + "/claim"}">[claim link]</a>,
              <a href="${"/invitations/" + i.id + "/qrcode"}">[QR code]</a>.
            </li>
            % endfor
            </ul>
          % endif
          % if awarded_assertions:
            <button class="pretty-button" onClick="javascript:claim_badges();">
              Export Badges
            </button>
          % endif
          <form method="POST" action="https://www.libravatar.org/openid/login/">
            <input type="hidden" name="openid_identifier" value="${user.openid_identifier}"/>
            <input
               class="pretty-submit"
               style="height: 50px; width: 100%;"
               name="change-avatar"
               type="submit"
               value="Change Avatar" />
          </form>
          <form method="GET" action="https://apps.fedoraproject.org/notifications/${user.nickname}.id.fedoraproject.org">
            <input
               class="pretty-submit"
               style="height: 50px; width: 100%;"
               type="submit"
               value="Manage Notifications" />
          </form>
          <form method="GET" action="${request.route_url('user_edit', id=user.nickname or user.id)}">
            <input
               class="pretty-submit"
               style="height: 50px; width: 100%;"
               type="submit"
               value="Edit Profile" />
          </form>
          % if user.opt_out:
            <form method="POST">
              <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
              <input
                 class="pretty-submit"
                 style="height: 50px; width: 100%;"
                 name="reactivate-account"
                 type="submit"
                 value="Reactivate Account" />
            </form>
          % else:
            <form method="POST">
              <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
              <input
                 class="pretty-submit"
                 style="height: 50px;"
                 name="deactivate-account"
                 type="submit"
                 value="Deactivate Account" />
            </form>
          % endif
        % elif logged_in:
            <form method="GET" action="${request.route_url('diff', id_a=logged_in_person.nickname or logged_in_person.id, id_b=user.nickname or user.id)}">
              <input
                 class="pretty-submit"
                 style="height: 50px; width: 100%;"
                 type="submit"
                 value="Show Diff" />
            </form>
        % endif
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->

    % if user.assertions:
    <div class="shadow mobile-hidden">
      <h1 class="section-header">History</h1>
      <div class="padded-content clearfix">
        % for assertion in sorted(user.assertions, key=lambda a: a.issued_on, reverse=True)[:history_limit]:
          <div class="grid-container">
            ${self.functions.badge_thumbnail(assertion.badge, 64, 33)}
            <div class="grid-66 text-64"><p>received on ${assertion.issued_on.strftime('%Y-%m-%d')}
              % if assertion.issued_for:
              for <a href="${assertion.issued_for}">this activity</a>
              % endif
              </p></div>
          </div>
        % endfor
        % if history_limit < len(user.assertions):
        <div class="grid-container">
          <div class="grid-100 text-64"><p>
            This is only the last ${history_limit} entries.
            <a href="${request.route_url('user', id=user.nickname or user.id, _query=dict(history_limit=len(user.assertions)))}">
              Click here to see all of them</a>.
          </p></div>
        </div>
        % endif
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
    % endif

  </div> <!-- End column 1. -->

  <!-- COLUMN 2 (Right)-->
  <div class="grid-70">
    <div class="shadow">
      <h1 class="section-header">Badges Earned</h1>
      <div class="padded-content">
        <div style="text-align: center; font-size: 1.2em; padding: 20px;">
          % if len(user_badges) < 1:
            % if user.email == logged_in:
              <p>You have not earned any badges yet!</p>
            % else:
              <p>${user.nickname} has not earned any badges yet!</p>
            % endif
          % else:
            % if user.email == logged_in:
              <p>You have earned
            % else:
              <p>${user.nickname} has earned
            % endif
            <strong>${len(user_badges)}</strong>
            ${'badge' if len(user_badges) == 1 else 'badges'}
            (<strong>${"{0:.1f}".format(percent_earned)}%</strong> of total).
          % endif
        </div>
        % for tag in request.registry.settings.get('tahrir.display_tags', '').split(","):
        % if tag in sum([badge.tags.strip(",").split(",") for badge in user_badges], []):
        <h3 class="section-header">${tag.title()} Badges</h3>
        <div class="flex-container">
          % for badge in [b for b in user_badges if tag in b.tags.strip(",").split(",")]:
            ${self.functions.badge_thumbnail_flex(badge, 128, 33)}
          % endfor
        </div>
        % endif
        % endfor
        % if any([badge for badge in user_badges if not any([tag in request.registry.settings.get('tahrir.display_tags', '').split(",") for tag in badge.tags.strip(",").split(",")])]):
        <h3 class="section-header">Uncategorized Badges</h3>
        <div class="flex-container">
          % for badge in [b for b in user_badges if not any([tag in request.registry.settings.get('tahrir.display_tags', '').split(",") for tag in b.tags.strip(",").split(",")])]:
            ${self.functions.badge_thumbnail_flex(badge, 128, 33)}
          % endfor
        </div>
        % endif
      </div>
    </div> <!-- End padded content. -->
  </div> <!-- End shadow. -->
</div> <!-- End column 2. -->
<div class="clear spacer"></div>
</div>
