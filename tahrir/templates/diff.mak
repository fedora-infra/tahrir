<%inherit file="master.mak" />
<div class="page">
  <div class="grid-100">
    <div class="shadow">
      <h1 class="section-header">Diff Stats</h1>
      <div class="padded-content">
	  <ul class="pretty-list">
	  	<li>${user_a.nickname} has ${len(user_a_unique_badges)}
			% if len(user_a_unique_badges) == 1:
				badge
			% else:
				badges
			% endif
			that ${user_b.nickname} does not have.</li>
	  	<li>${user_b.nickname} has ${len(user_b_unique_badges)}
			% if len(user_b_unique_badges) == 1:
				badge
			% else:
				badges
			% endif
			that ${user_a.nickname} does not have.</li>
	  	<li>${user_a.nickname} and ${user_b.nickname} share
			${len(shared_badges)}
			% if len(shared_badges) == 1:
				award.
			% else:
				awards.
			% endif
			</li>
		<li>
		% if len(user_a_badges) > len(user_b_badges):
			${user_a.nickname}'s badge count is ${len(user_a_badges) - len(user_b_badges)}
			higher than ${user_b.nickname}'s.
		% elif len(user_a_badges) < len(user_b_badges):
			${user_b.nickname}'s badge count is ${len(user_b_badges) - len(user_a_badges)}
			higher than ${user_a.nickname}'s.
		% else:
			${user_b.nickname} and ${user_a.nickname} have the same
			number of badges.
		% endif
			</li>
		<li>
		% if user_a_rank < user_b_rank:
			${user_a.nickname} (rank ${user_a_rank}, top ${"{0:.1f}".format(user_a_percentile)}%)
			is ranked ${user_b_rank - user_a_rank} higher than ${user_b.nickname}
			(rank ${user_b_rank}, top ${"{0:.1f}".format(user_b_percentile)}%).
		% else:
			${user_b.nickname} (rank ${user_b_rank}, top ${"{0:.1f}".format(user_b_percentile)}%)
			is ranked ${user_a_rank - user_b_rank} higher than ${user_a.nickname}
			(rank ${user_a_rank}, top ${"{0:.1f}".format(user_a_percentile)}%).
		% endif
			</li>
	  </ul>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="clear spacer"></div>

<%def name="badge_table(badges, N=3)">
	<table>
	<tr>
	% for badge in badges:
		% if badges.index(badge) % N == 0 and badges.index(badge) != 0:
			</tr><tr>
		% endif
		<td>${self.functions.badge_thumbnail(badge, 64, 33)}</td>
	% endfor
	</tr>
	</table>
</%def>

  <!-- COLUMN 1 (Left) -->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">${user_a.nickname} only</h1>
      <div class="padded-content">
		${badge_table(user_a_unique_badges)}
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <!-- COLUMN 2 (Center) -->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">Both</h1>
      <div class="padded-content">
		${badge_table(shared_badges)}
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <!-- COLUMN 3 (Right) -->
  <div class="grid-33">
    <div class="shadow">
      <h1 class="section-header">${user_b.nickname} only</h1>
      <div class="padded-content">
		${badge_table(user_b_unique_badges)}
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="clear spacer"></div>

  <div class="clear spacer"></div>
</div>
