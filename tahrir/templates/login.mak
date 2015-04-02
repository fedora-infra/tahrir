<%inherit file="master.mak"/>
<div class="page">
  <div class="center pane">
    <div class="content">
      <form method="POST" action="${url}">
        <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
        <input type="text" value="${openid_url}" name="openid" size="40" />
        <input type="submit" value="Login" />
      </form>
    </div>
  </div>
</div>
