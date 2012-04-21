<%inherit file="master.mak"/>
<div class="page">
  <div class="center pane">
    <div class="content">
      <table>
        <tr>
          <td>
            ${person_form.display() | n}
          </td>
        </tr>
        <tr>
          <td>
            ${issuer_form.display() | n}
          </td>
        </tr>
        <tr>
          <td>
            ${badge_form.display() | n}
          </td>
        </tr>
        <tr>
          <td>
            ${assertion_form.display() | n}
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>
