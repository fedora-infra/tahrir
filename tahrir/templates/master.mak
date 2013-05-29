<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/static/css/tahrir.css" />
    <link rel="stylesheet" href="/static/css/monokai.css" />
	<link rel="stylesheet" href="/static/css/unsemantic-grid-responsive.css" />
    <script
      type="text/javascript"
      src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js">
    </script>
    <script type="text/javascript" src="/static/js/popup.js"></script>
    % if logged_in and awarded_assertions:
      <script
        type="text/javascript"
        src="http://beta.openbadges.org/issuer.js">
      </script>
      <script type="text/javascript">
        function claim_badges() {
          var callback = function(errors, successes) {
            // Do nothing.
            //console.log(errors);
            //console.log(successes);
          };
          var _ = encodeURIComponent
          var urls = [
          % for a in awarded_assertions:
            "http://${base_url}/assertions/"+_("${a.badge.id}/${a.recipient}"),
          % endfor
          ];
          OpenBadges.issue(urls, callback);
        }
      </script>
    % endif
    <title>${title}</title>
  </head>
  <body>
  	<div class="grid-container">
    <div class="header grid-50 suffix-50">
      <div><H1><span id="logo">${title}<span id="sublogo">التحرير</span></span></H1></div>
    </div>

    <a href="http://github.com/ralphbean/tahrir">
      <img style="position: absolute; top: 0; right: 0; border: 0;"
      src="/static/img/github.png"
      alt="Fork me on GitHub" />
    </a>

	<div class="clear"></div>

	<div class="grid-100">
      % if logged_in:
        Logged in as <span class="strong">${logged_in}</span>.
        You have ${str(len(awarded_assertions))} badges from this site.
        % if awarded_assertions:
          <a href="javascript:claim_badges();">Claim them.</a>
        % endif
        [
		% if is_admin:
          <a href="/admin">Admin</a> |
        % endif
		<a href="/logout">Logout</a>

		]
      % else:
        <form action="login" method="post">
          <input type="submit" value="Login with FAS" />
        </form>
      % endif
    </div>
    <div class="clear"></div>
    ${self.body()}
    <div class="clear"></div>
	</div> <!-- End grid-container -->
	<div id="footer">
		You can report bugs and file issues with Tahrir on
		<a href="https://github.com/fedora-infra/tahrir/issues">
		the GitHub issues tracker</a>.
	</div>
  </body>
</html>

