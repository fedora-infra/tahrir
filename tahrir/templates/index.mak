<%inherit file="master.mak"/>
<div class="page">
  <div class="center pane">
    <div class="content">
      <table>
        <tr><th>Issuer</th><th></th></tr>
        % for issuer in issuers:
          <tr>
            <td>${issuer.name}</td>
            <td>
              <table>
                <tr><th colspan="2">Badge</th><th>Awarded</th></tr>
                % for badge in issuer.badges:
                  <tr>
                    <td>${badge.name}</td>
                    <td><img class="badge"
                      src="/pngs/${badge.image}"></img></td>
                    <td>
                      <ul>
                        % for a in badge.assertions:
                          <li class="popup">
                          <div class="gravatar">
                            <img class="gravatar"
                            src="${a.person.gravatar_link}"></img>
                          </div>
                          <a
                            href="/assertions/${badge.id}/${a.recipient}/pygments">
                            ${a.recipient[:6]}
                          </a>
                          % if is_admin:
                            -
                            <a
                              href="/assertions/${badge.id}/${a.recipient}/delete">
                              (Delete)
                            </a>
                          % endif
                          </li>
                        % endfor
                      </ul>
                    </td>
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
