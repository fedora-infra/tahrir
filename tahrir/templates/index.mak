<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-33">
		<h2>Your Badges</h2>
		<p>This column lists the badges earned by the user.</p>
		% for issuer in issuers:
		<h3>Issued by ${issuer.name}</h3>
		<ul class="badge-list">
			% for badge in issuer.badges:
				<li><span class="badge-image"><img class="badge"
					% if badge.image.startswith("http"):
					  src="${badge.image}" alt="${badge.name} icon" />
					% else:
					  src="/pngs/${badge.image}" alt="${badge.name} icon" />
					% endif
					<span class="badge-name">${badge.name}</span>
			% endfor
			% for a in badge.assertions:
                          <li class="popup">
                          <div class="gravatar">
                            <img class="gravatar"
                            src="${a.person.gravatar_link}" alt="Face Icon"/>
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
		% endfor
	</div>
	<!-- COLUMN 2 (Middle)-->
	<div class="grid-33">
		<h2>Badge Ticker</h2>
		<p>This column shows the latest awards.</p>
	</div>
	<!-- COLUMN 3 (Right)-->
	<div class="grid-33">
		<h2>Top Contributors</h2>
		<p>This column lists the users with the most awards.</p>
	</div>
    
	<div class="clear spacer"></div>
</div>
