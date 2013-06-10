<%inherit file="master.mak"/>
<div class="page">
	<!-- COLUMN 1 (Left)-->
	<div class="grid-33">
		<h2 class="section-header">Latest Awards</h2>
		<p class="padded-content">This column lists the most recent awards to users.</p>
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
		<h2 class="section-header">Fresh Contributors</h2>
		<p class="padded-content">This column shows the newest badge-earners on the network.</p>
	</div>
	<!-- COLUMN 3 (Right)-->
	<div class="grid-33">
		<h2 class="section-header">Top Contributors</h2>
		<p class="padded-content">This column lists the users with the most awards.</p>
	</div>
    
	<div class="clear spacer"></div>
</div>
