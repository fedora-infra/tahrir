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
    <script src="${request.static_url('tahrir:static/js/social.js')}"></script>
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

    % if user:
      <rdf:RDF
         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:foaf="http://xmlns.com/foaf/0.1/">

        <foaf:PersonalProfileDocument rdf:about="">
          <admin:generatorAgent rdf:resource="https://badges.fedoraproject.org/" />
          <admin:errorReportsTo rdf:resource="mailto:admin@fedoraproject.org" />
        </foaf:PersonalProfileDocument>

        <foaf:OnlineAccount rdf:about="">
          <foaf:accountServiceHomepage rdf:resource="http://${user.nickname}.id.fedoraproject.org" />
          <foaf:accountName rdf:resource="${user.nickname}" />
        </foaf:OnlineAccount>

        <foaf:Person rdf:about="${request.url}">
          <foaf:nick rdf:resource="${user.nickname}" />
          <foaf:mbox rdf:resource="mailto:${user.email_md5}" />
          <foaf:img rdf:resource="${user.avatar_url(512)}" />
          % if user.website:
            <foaf:homepage rdf:resource="${user.website}" />
          % endif
          <foaf:account rdf:resource="http://${user.nickname}.id.fedoraproject.org" />
        </foaf:Person>
      </rdf:RDF>
    % endif
  </head>
  <body>
    <div class="page clearfix">
      <div class="page-content grid-container">
        <div class="header clearfix grid-100">
          <h1>
            <a href="${request.route_url('home')}">
              <img
                 src="${request.static_url('tahrir:static/img/fedora_badges_small.png')}"
                 alt="Fedora Badges logo"
                 class="logo-image"/>
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
	  Running ﺎﻠﺘﺣﺮﻳﺭ (Tahrir) version ${tahrir_version}.
      ${footer | n}
    </footer>

  </body>
</html>
