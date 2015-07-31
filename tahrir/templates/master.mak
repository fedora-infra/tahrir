<%namespace name="functions" file="functions.mak" inheritable="True" />
<%
import json
%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- VIEWPORT STUFF -->
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,
                                   maximum-scale=1" />
    <!-- end viewport stuff -->
    <link rel="stylesheet" href="${request.static_url('%s:static/css/tahrir.css' % theme_name)}" />
    <link rel="stylesheet" href="${request.static_url('%s:static/css/monokai.css' % theme_name)}" />
    <link rel="stylesheet" media="mobile" href="${request.static_url('%s:static/css/unsemantic-grid-mobile.css' % theme_name)}" />
    <link rel="stylesheet" media="screen" href="${request.static_url('%s:static/css/unsemantic-grid-responsive.css' % theme_name)}" />
    <link rel="shortcut icon" href="${request.static_url('%s:static/img/favicon.ico' % theme_name)}" />
    <script src="${request.static_url('%s:static/js/social.js' % theme_name)}"></script>
    <script src="${request.static_url('%s:static/js/favico-0.3.4.min.js' % theme_name)}"></script>
    <script>
        // This is animated by the websocket
        var notifs_count = 0;
        var favicon = new Favico({animation : 'popFade'});
        $(window).bind("focus", function() {
            // Reset favicon if user switches to this tab.
            notifs_count = 0;
            favicon.badge(notifs_count);
        });
    </script>
    % if logged_in and awarded_assertions:
      <script src="//beta.openbadges.org/issuer.js"></script>
      <script>
        function htmlDecode(value) { return $("<div>").html(value).text(); }
        function badge_urls() {
          var urls = [
            % for a in awarded_assertions:
              htmlDecode("${base_url}/assertions/${a.badge_id}/${a.recipient}"),
            % endfor
          ];
          return urls;
        }
        function claim_badges() {
          var urls = badge_urls();
          % if request.registry.settings.get('tahrir.openbadges_modal', 'true').lower() == 'true':
          var lolback = function(errors, successes) {};
          OpenBadges.issue(urls, lolback);
          % else:
          OpenBadges.issue_no_modal(urls);
          % endif
        }
      </script>
    % endif
    <title>${title}</title>

    % if user or badge:
    <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="${request.url}/rss" />
    <link rel="alternate" type="application/json" title="JSON" href="${request.url}/json" />
    % endif

    %if newest_badges:
    <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="${request.url}/rss" />
    % endif

    % if user:
    <link rel="alternate" type="application/rdf" title="RDF+FOAF" href="${request.url}/foaf" />
    % endif

	<script type="text/javascript" src="//apps.fedoraproject.org/global/js/jsautologin.js">
	</script>

	<script type="text/javascript">
		function loginSuccess(userdata)
		{
			var child = document.getElementById('login-button');
			child.parentNode.removeChild(child);
			var list = document.getElementById('login-list');

			var profile_url = document.createElement('li');
			var profile_url_template = "${request.route_url('user', id='TEMP')}";
			if("nickname" in userdata)
			{
				profile_url_template = profile_url_template.replace('TEMP', userdata['nickname']);
			}
			else
			{
				profile_url_template = profile_url_template.replace('TEMP', userdata['id']);
			}
			profile_url.innerHTML = '<a href="' + profile_url_template + '">Profile</a>';
			list.appendChild(profile_url);

			var logout_url = document.createElement('li');
			logout_url.innerHTML = '<a href="${request.route_url('logout')}">Logout</a>';
			list.appendChild(logout_url);
		}

		% if logged_in:
		var userdata = ${ json.dumps(logged_in_person.__json__())|n };
		% else:
		var userdata = null;
		% endif
		var myurl = "${request.scheme}://${request.server_name}:${request.server_port}";
		function handleLogin()
		{
			if(userdata != null)
			{
				// The user is currently logged in
				//  If this was a recursive auth attempt, report back
				respondToLogin(myurl, true, userdata);
			}
			else
			{
				tryBackgroundLogin('/login', loginSuccess, null);
			}
		}	
	</script>
  </head>
  <body onload="handleLogin()">
    <div class="page clearfix">
      <div class="page-content grid-container">
        <div class="header clearfix grid-100">
          <h1>
            <a href="${request.route_url('home')}">
            <div id="site-logo">
            </div>
            </a>
          </h1>

          <form method="POST" action="/explore" id="header-search" class="mobile-hidden">
            <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
            <input name="badge-query" required="required" />
            <input name="badge-search" type="submit" value="Search" />
          </form>
        </div>

        <ul class="grid-100 navbar" id="login-list">
          <li><a href="${request.route_url('about')}">About</a></li>
          <li><a href="${request.route_url('explore')}">Explore</a></li>
          <li><a href="${request.route_url('report_this_month')}">Leaderboard</a></li>
          % if logged_in:
            <li><a href="${request.route_url('user', id=logged_in_person.nickname or logged_in_person.id)}">Profile</a></li>
          % endif
          % if logged_in:
            % if 'group:admins' in auth_principals:
              <li><a href="${request.route_url('admin')}">Admin</a></li>
            % endif
            <li><a href="${request.route_url('logout')}">Logout</a></li>
          % else:
            <li id="login-button"><a href="${request.route_url('login')}">Login</a></li>
          % endif
        </ul>

        % if request.session.peek_flash():
        <div class="grid-50 push-25">
          <div class="shadow">
            <div class="padded-content">
              <ul class="pretty-list">
              % for message in request.session.pop_flash():
                <li>${message}</li>
              % endfor
              </ul>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        % endif

        ${next.body()}


        <!-- End of flash message template -->
      
      </div> <!-- End grid-container -->

    </div> <!-- End page -->

    <footer>
	  Running ﺎﻠﺘﺣﺮﻳﺭ (Tahrir) version ${tahrir_version}
	  and Tahrir-API version ${tahrir_api_version}.
      ${footer | n}
    </footer>

    % if request.registry.settings.get('fedmenu.url'):
    <script src="${request.registry.settings.get('fedmenu.url')}/js/fedora-libravatar.js"></script>
    <script src="${request.registry.settings.get('fedmenu.url')}/js/fedmenu.js"></script>
    <script>
      fedmenu({
          'url': '${request.registry.settings.get("fedmenu.data_url")}',
          'mimeType': 'application/javascript',
          'position': 'bottom-right',
          % if user:
          'user': '${user.nickname}',
          % endif
      });
    </script>
    % endif

  </body>
</html>
