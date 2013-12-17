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
              Ranked ${rank} out of ${user_count} ranked users (top ${"{0:.1f}".format(percentile)}%).</p>
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
          <form method="GET" action="${request.route_url('user_edit', id=user.nickname or user.id)}">
            <input
               class="pretty-submit"
               style="height: 50px; width: 100%;"
               type="submit"
               value="Edit Profile" />
          </form>
          % if user.opt_out:
            <form method="POST">
              <input
                 class="pretty-submit"
                 style="height: 50px; width: 100%;"
                 name="reactivate-account"
                 type="submit"
                 value="Reactivate Account" />
            </form>
          % else:
            <form method="POST">
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


      </div> <!-- End shadow. -->
    </div> <!-- End padded content. -->
  </div> <!-- End column 1. -->

  <!-- COLUMN 2 (Right)-->
  <div class="grid-70">
    <div class="shadow">
      <h1 class="section-header">Badges Earned</h1>
      <div class="padded-content">
        <div class="grid-container">
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
          % for i, badge in enumerate(user_badges):
            % if i % 3 == 0 and i != 0:
              </div>
              <div class="grid-container">
            % endif
            ${self.functions.badge_thumbnail(badge, 128, 33)}
          % endfor
        </div>
      </div>
    </div> <!-- End padded content. -->
  </div> <!-- End shadow. -->
</div> <!-- End column 2. -->
<div class="clear spacer"></div>
</div>
