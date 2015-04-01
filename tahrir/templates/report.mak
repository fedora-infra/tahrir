<%inherit file="master.mak"/>
<div class="page">
  <div class="grid-100">
    <div class="shadow">
      <h1 class="section-header">Rising stars: ${frame} of ${start_date} to ${stop_date}</h1>
      <div class="padded-content">
        <p>Looking for the <a href="${request.route_url('leaderboard')}">all-time leaderboard?</a></p>
        <table>
          % for person, stats in user_to_rank.items()[:25]:
            <tr>
              <td style="width: 20px;">
                  <span class="big-text">#${stats['rank']}</span>
              </td>
              <td style="width: 100px;">
                  <small>(#${person.rank} all time)</small>
              </td>
              <td style="width: 64px;">${self.functions.avatar_thumbnail(person, 64, 33)}</td>
              <td>
                <a href="${request.route_url('user', id=person.nickname or person.id)}">${person.nickname}</a>
                earned <strong>${user_to_rank[person]['badges']}</strong>
                ${'badge' if user_to_rank[person]['badges'] == 1 else 'badges'}
                during this period.
              </td>
            </tr>
          % endfor
        </table>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>
  <div class="clear spacer"></div>
</div>
