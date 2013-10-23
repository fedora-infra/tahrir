<%inherit file="master.mak"/>
<div class="page">
  <!-- COLUMN 1 (Left)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Your Rank</h1>
      <div class="padded-content">
        % if logged_in:
          % if rank == 0:
            <p>
              You are not ranked yet. There are ${user_count} ranked users.
            </p>
          % else:
            <p>
              You are ranked <strong>#${rank}</strong> out of ${user_count} ranked users.
            </p>
            <p>You are in the <strong>top ${"{0:.1f}".format(percentile)}%</strong>.</p>
          % endif
            <h3>Competitors</h3>
            <table>
              % for person in competitors:
                % if person.email == logged_in:
                  <tr>
                    <td>
                    % if person.rank:
                      <span class="big-text"><strong>#${person.rank}</strong></span>
                    % else:
                      <span class="big-text"><strong>-</strong></span>
                    % endif
                    </td>
                    <td>${self.functions.avatar_thumbnail(person, 64, 33)}</td>
                    <td>
                      <a href="${request.route_url('user', id=person.nickname or person.id)}">
                        <strong>${person.nickname}</strong>
                      </a>
                    </td>
                  % else:
                    <td>
                    % if person.rank:
                      <span class="big-text">#${person.rank}</span>
                    % else:
                      <span class="big-text">-</span>
                    % endif
                    </td>
                    <td>${self.functions.avatar_thumbnail(person, 64, 33)}</td>
                    <td><a href="${request.route_url('user', id=person.nickname or person.id)}">${person.nickname}</a></td>
                  % endif
                </tr>
              % endfor
            </table>
        % else:
          <p>Log in to see your rank. There are ${user_count} ranked users.</p>
        % endif
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>
  <!-- COLUMN 2 (Right)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Leaderboard</h1>
      <div class="padded-content">
        <table>
          % for person in top_persons_sorted[:25]:
			% if person in user_to_rank:
			<tr>
			  <td style="width: 20px;">
				<span class="big-text">#${person.rank}</span>
			  </td>
			  <td style="width: 64px;">${self.functions.avatar_thumbnail(person, 64, 33)}</td>
			  <td>
				<a href="${request.route_url('user', id=person.nickname or person.id)}">${person.nickname}</a>
				with <strong>${user_to_rank[person]['badges']}</strong>
				${'badge' if user_to_rank[person]['badges'] == 1 else 'badges'}.
			  </td>
			</tr>
            % endif
          % endfor
        </table>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>
  <div class="clear spacer"></div>
</div>
