<%inherit file="master.mak"/>
<div class="page">
  <div class="center pane">
    <div class="content">
      <table>
        % for issuer in issuers:
          <tr>
            <td>${issuer.name}</td>
            <td>
              <table>
                <tr><th>Badge</th><th># Awarded</th></tr>
                % for badge in issuer.badges:
                  <tr>
                    <td>${badge.name}</td>
                    <td>${str(len(badge.assertions))}</td>
                  </tr>
                % endfor
              </table>
            </td>
          </tr>
        % endfor
      </table>
    </div>
    <div class="clear spacer"></div>
  </div>
</div>
