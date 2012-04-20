<html>
  <head>
    <title>TODO</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="stylesheet"
    href="/static/pylons.css"
    type="text/css" media="screen" charset="utf-8" />
    <!--[if lte IE 6]>
    <link rel="stylesheet"
    href="/static/ie6.css"
    type="text/css" media="screen" charset="utf-8" />
    <![endif]-->
  </head>
  <body>
    <div id="wrap">
      <div id="top-small">
        <div class="top-small align-center">
          <div>
            <img width="220" height="50" alt="pyramid"
            src="/static/pyramid-small.png" />
          </div>
        </div>
      </div>
      <div id="middle">
        <div class="middle align-right">
          <div id="left" class="app-welcome align-left">
            <b>Admin</b><br/>
            <span tal:replace="message"/>
            </div>
            <div id="right" class="app-welcome align-right"></div>
          </div>
        </div>
        <div id="bottom"><div class="bottom">
            ${person_form.display() | n}
        </div></div>
        <div id="bottom"><div class="bottom">
            ${issuer_form.display() | n}
        </div></div>
        <div id="bottom"><div class="bottom">
            ${badge_form.display() | n}
        </div></div>
        <div id="bottom"><div class="bottom">
            ${assertion_form.display() | n}
        </div></div>
      </div>
    </div>
  </body>
</html>
