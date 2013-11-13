<%namespace name="functions" file="functions.mak" inheritable="True" />
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
          var callback = function(errors, successes) {
          // Do nothing.
          //console.log(errors);
          //console.log(successes);
          };
          var urls = badge_urls();
          OpenBadges.issue(urls, callback);
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
  </head>
  <body>
    <div class="page clearfix">
      <div class="page-content grid-container">
        <div class="header clearfix grid-100">
          <h1>
            <a href="${request.route_url('home')}">
            <div id="site-logo">
            </div>
            </a>
          </h1>
        </div>

        <ul class="grid-100 navbar">
          <li><a href="${request.route_url('about')}">About</a></li>
          <li><a href="${request.route_url('explore')}">Explore</a></li>
          <li><a href="${request.route_url('leaderboard')}">Leaderboard</a></li>
          % if logged_in:
            <li><a href="${request.route_url('user', id=logged_in_person.nickname or logged_in_person.id)}">Profile</a></li>
          % endif
          % if logged_in:
            % if 'group:admins' in auth_principals:
              <li><a href="${request.route_url('admin')}">Admin</a></li>
            % endif
            <li><a href="${request.route_url('logout')}">Logout</a></li>
          % else:
            <li><a href="${request.route_url('login')}">Login</a></li>
          % endif
        </ul>
        ${self.body()}
      </div> <!-- End grid-container -->

    </div> <!-- End page -->

    <footer>
	  Running ﺎﻠﺘﺣﺮﻳﺭ (Tahrir) version ${tahrir_version}
	  and Tahrir-API version ${tahrir_api_version}.
      ${footer | n}
    </footer>

  </body>
</html>
