<%namespace name="functions" file="functions.mak" inheritable="True" />
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
	<!-- VIEWPORT STUFF -->
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,
								   maximum-scale=1" />
	<!-- end viewport stuff -->
	<link rel="stylesheet" href="${request.static_url('tahrir:static/css/tahrir.css')}" />
	<link rel="stylesheet" href="${request.static_url('tahrir:static/css/monokai.css')}" />
	<link rel="stylesheet" media="mobile" href="${request.static_url('tahrir:static/css/unsemantic-grid-mobile.css')}" />
	<link rel="stylesheet" media="screen" href="${request.static_url('tahrir:static/css/unsemantic-grid-responsive.css')}" />
	<link rel="shortcut icon" href="${request.static_url('tahrir:static/img/favicon.ico')}" />
    <script
      type="text/javascript"
      src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js">
    </script>
    % if logged_in and awarded_assertions:
      <script
        type="text/javascript"
        src="http://beta.openbadges.org/issuer.js">
      </script>
      <script type="text/javascript">
         function htmlDecode(value) {return $("<div>").html(value).text();}
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
  </head>
  <body>
  <div class="page clearfix">
  	<div class="page-content grid-container">
    <div class="header clearfix grid-100">
		<h1><a href="${request.route_url('home')}"><img
			src="${request.static_url('tahrir:static/img/fedora_badges_small.png')}"
			alt="Fedora Badges logo"
			class="logo-image"/></a></h1>
    </div>

	<ul class="grid-100 navbar">
		<li><a href="${request.route_url('explore')}">Explore</a></li>
		<li><a href="${request.route_url('leaderboard')}">Leaderboard</a></li>
      % if logged_in:
	  <li><a href="${request.route_url('user', id=logged_in_id)}">Profile</a></li>
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
	<div class="grid-100">
    </div>
    ${self.body()}
	</div> <!-- End grid-container -->

</div> <!-- End page -->

  <footer>
    <p>You can use the
    <a href="${request.route_url('builder')}">Badge Builder</a> to help
    you create YAML files for new badges.</p>
    <p>You can report bugs and file issues with التحرير (Tahrir) on
    <a href="https://github.com/fedora-infra/tahrir/issues">
    the GitHub issues tracker</a>.</p>
    <p>This project is free software; you can find the
    <a href="http://github.com/fedora-infra/tahrir">source</a>
    on GitHub.</p>
  </footer>


  </body>
</html>
