<%inherit file="master.mak"/>
<div class="page">
  <div class="center pane">
    <div class="content">
      <form action="${url}" method="post">
        <table>
          <tr>
            <td>
              <input type="hidden" name="came_from" value="${came_from}"/>
              <strong>Email</strong>
            </td>
            <td>
              <input type="text" name="email" value="${email}"/><br/>
            </td>
          </tr>
          <tr>
            <td></td><td>
              <input type="submit" name="form.submitted" value="Log In"/>
            </td>
          </tr>
        </table>
      </form>
    </div>
  </div>
</div>
