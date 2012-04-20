<html>
  <head>
    % if logged_in and awarded_assertions:
      <script
        type="text/javascript"
        src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js">
      </script>
      <script
        type="text/javascript"
        src="http://beta.openbadges.org/issuer.js">
      </script>
      <script type="text/javascript">
        function claim_badges() {
          var callback = function(errors, successes) {
            console.log(errors);
            console.log(successes);
          };
          var urls = [
          % for a in awarded_assertions:
            "/assertions/${a.badge.id}/${a.recipient}",
          % endfor
          ];
          OpenBadges.issue(urls, callback);
        }
      </script>
    % endif
    <title>${title}</title>
  </head>
  <body>
    <div id="header">
      <div><H1><span id="logo">${title}</span></H1></div>
    </div>
    <div class="right pane">
      % if logged_in:
        Logged in as ${logged_in} - <a href="/logout">Logout</a><br/>
        You have ${str(len(awarded_assertions))} badges from this site.<br/>
        % if awarded_assertions:
          <a href="javascript:claim_badges();">Claim them.</a>
        % endif
      % else:
        <a href="/login">Login</a> to claim your badges.
      % endif
    </div>
    <div class="clear"></div>
    ${self.body()}
    <div class="clear"></div>
  </body>
</html>

