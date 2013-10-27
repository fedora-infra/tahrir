<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="${request.static_url('%s:static/css/tahrir.css' % theme_name)}">
    <link rel="stylesheet" href="${request.static_url('%s:static/css/monokai.css' % theme_name)}">
    <title>500 Error</title>
  </head>
  <body>
    <div class="page">
      <div class="center pane">
        <img
           src="${request.static_url('%s:static/img/500.png' % theme_name)}"
           alt="Achievment Unlocked, 'Failure'"
           style="display: block; margin-left: auto; margin-right: auto;" />
      </div>
    </div>
  </body>
</html>
