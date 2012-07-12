<%inherit file="master.mak"/>
<div class="page">
  <div class="center pane">
    <div class="content">
      <table style="table-layout: fixed; width: 100%">
		<!-- This row tells the browser how wide each table column
			 should be. I tried things like setting different
			 visibility, display, and height on it so that the blank
			 row does not render in-page, but none of them worked. -->
		<tr>
			<td style="width: 30%"></td>
			<td style="width: 70%"></td>
		</tr>
        <tr><th>Issuer</th><th></th></tr>
        % for issuer in issuers:
          <tr>
			<td class="issuer-cell">${issuer.name}</td>
            <td>
              <table class="issuer-table">
				<!-- See previous comment regarding the following row. -->
				<tr>
					<td class="badge-name collapsed-row"></td>
					<td class="badge-image collapsed-row"></td>
					<td class="badge-assertions collapsed-row"></td>
				</tr>
				<tr>
					<th colspan="2">Badge</th>
					<th>Awarded</th>
				</tr>
                % for badge in issuer.badges:
                  <tr>
                    <td class="badge-name">${badge.name}</td>
                    <td class="badge-image"><img class="badge"
                      % if badge.image.startswith("http"):
                        src="${badge.image}"/></td>
                      % else:
                        src="/pngs/${badge.image}"/></td>
                      % endif
                    <td class="badge-assertions">
                      <ul>
                        % for a in badge.assertions:
                          <li class="popup">
                          <div class="gravatar">
                            <img class="gravatar"
                            src="${a.person.gravatar_link}"/>
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
