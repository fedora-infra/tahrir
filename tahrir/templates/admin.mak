<%inherit file="master.mak"/>
<div class="page">
  <div class="grid-100">
    <h1 class="section-header">Admin Panel</h1>
  </div>

  <div class="clear"></div>

  <!-- PEOPLE PANEL -->

  <div class="grid-33">
    <h2>People</h2>
    <p>Add a new user, who can then be awarded badges.</p>
  </div>

  <div class="grid-66">
    <form class="admin-form" method="POST">
      <table>
        <tr>
        <td><label for="person-email">Email</label></td>
          <td><input name="person-email" type="email" required="required"
                placeholder="someone@domain.tld"/></td>
        </tr>
        <tr>
          <td><label for="person-nickname">Nickname <span class="sublabel">Optional.</span></label></td>
          <td><input name="person-nickname" placeholder="Badger"/></td>
        </tr>
        <tr>
          <td><label for="person-website">Website <span class="sublabel">Optional.</span></label></td>
          <td><input name="person-website" placeholder="asite.tld"/></td>
        </tr>
        <tr>
          <td><label for="person-bio">Bio <span class="sublabel">Optional.</span></label></td>
          <td><input name="person-bio" placeholder="Just badgin' around"/></td>
        </tr>
        <tr>
          <td></td><td>
            <input name="add-person" type="submit" value="Add Person" />
          </td>
        </tr>
      </table>
    </form>
  </div>

  <div class="clear"></div>

  <!-- ISSUER PANEL -->

  <div class="grid-33">
    <h2>Issuers</h2>
    <p>Add a new issuer. Each badge must have an issuer.</p>
  </div>

  <div class="grid-66">
    <form class="admin-form" method="POST">
      <table>
        <tr>
          <td><label for="issuer-origin">Origin</label></td>
          <td><input name="issuer-origin" required="required" placeholder="someplace.tld" /></td>
        </tr>
        <tr>
          <td><label for="issuer-name">Name</label></td>
          <td><input name="issuer-name" required="required" placeholder="Joe McBadgegiver"/></td>
        </tr>
        <tr>
          <td><label for="issuer-org">Organization</label></td>
          <td><input name="issuer-org" required="required" placeholder="League of Extraordinary Badgers"/></td>
        </tr>
        <tr>
          <td><label for="issuer-contact">Contact</label></td>
          <td><input name="issuer-contact" required="required" placeholder="jmcbadgegiver@somesite.tld"/></td>
        </tr>
        <tr>
          <td></td><td>
            <input name="add-issuer" type="submit" value="Add Issuer" />
          </td>
        </tr>
      </table>
    </form>
  </div>

  <div class="clear"></div>

  <!-- BADGE PANEL -->

  <div class="grid-33">
    <h2>Badges</h2>
    <p>Add a new badge so that it can be awarded to people.</p>
  </div>

  <div class="grid-66">
    <form class="admin-form" method="POST">
      <table>
        <tr>
          <td><label for="badge-name">Name</label></td>
          <td><input name="badge-name" required="required" placeholder="Awesome Badge"/></td>
        </tr>
        <tr>
          <td><label for="badge-image">Image</label></td>
          <td><input name="badge-image" required="required" placeholder="imagehost.tld/awesome_badge.png"/></td>
        </tr>
        <tr>
          <td><label for="badge-description">Description</label></td>
          <td><input name="badge-description" required="required" placeholder="This is an awesome badge."/></td>
        </tr>
        <tr>
          <td><label for="badge-criteria">Criteria <span class="sublabel">Link to discussion about accepting the badge.</span></label></td>
          <td><input name="badge-criteria" required="required" placeholder="oursite.tld/mailinglist/awesome_badge_discussion"/></td>
        </tr>
        <tr>
          <td><label for="badge-issuer">Issuer</label></td>
		  <td><select name="badge-issuer">
		  % for issuer in issuers:
			<option value="${issuer.id}">${issuer.name} (${issuer.id})</option>
		  % endfor
		  </select></td>
        </tr>
        <tr>
          <td><label for="badge-tags">Tags <span class="sublabel">Comma-delimited list of tags.</span></label></td>
          <td><input name="badge-tags" placeholder="awesome, badgers"/></td>
        </tr>
        <tr>
          <td></td><td>
            <input name="add-badge" type="submit" value="Add Badge" />
          </td>
        </tr>
      </table>
    </form>
  </div>

  <div class="clear"></div>

  <div class="grid-33">
    <h2>Invitations</h2>
    <p>Invite a person via link and QR code to accept a new badge.</p>
  </div>

  <div class="grid-66">
    <form class="admin-form" method="POST">
      <table>
        <tr>
          <td>
            <label for="invitation-created">
              Creation Date
              <span class="sublabel">
                Defaults to the current time.
              </span>
            </label>
          </td>
          <td><input name="invitation-created" type="datetime" placeholder="YYYY-MM-DD HH:MM"/></td>
        </tr>
        <tr>
          <td>
            <label for="invitation-expires">
              Expiration Date
              <span class="sublabel">
                Defaults to 2 hours from now.
              </span>
            </label>
          </td>
          <td><input name="invitation-expires" type="datetime" placeholder="YYYY-MM-DD HH:MM"/></td>
        </tr>
        <tr>
          <td><label for="invitation-badge-id">Badge ID</label></td>
          <td><input name="invitation-badge-id" required="required" placeholder="awesome-badge"/></td>
        </tr>
        <tr>
          <td><label for="invitation-issuer-id">Person email</label></td>
          <td><input name="invitation-issuer-email" required="required" placeholder="abadger@badgin.com"/></td>
        </tr>
        <tr>
          <td></td><td>
            <input name="add-invitation" type="submit" value="Add Invitation" />
          </td>
        </tr>
      </table>
    </form>
  </div>

  <div class="clear"></div>

  <div class="grid-33">
    <h2>Award Badges</h2>
    <p>Assertions award badges to people.</p>
  </div>

  <div class="grid-66">
    <form class="admin-form" method="POST">
      <table>
        <tr>
          <td><label for="assertion-badge-id">Badge ID</label></td>
          <td><input name="assertion-badge-id" required="required" placeholder="awesome-badge"/></td>
        </tr>
        <tr>
          <td><label for="assertion-person-email">Person Email</label></td>
          <td><input name="assertion-person-email" type="email" required="required"
                placeholder="abadger@badgin.com"/></td>
        </tr>
        <tr>
          <td>
            <label for="assertion-issued-on">
              Issued On
              <span class="sublabel">
                Defaults to current time.
              </span>
            </label>
          </td>
          <td><input name="assertion-issued-on" type="datetime" placeholder="YYYY-MM-DD HH:MM"/></td>
        </tr>
        <tr>
          <td></td><td>
            <input name="add-assertion" type="submit" value="Add Assertion" />
          </td>
        </tr>
      </table>
    </form>
  </div>

  <div class="clear"></div>

  <div class="grid-33">
    <h2>Create Authorizations</h2>
    <p>Allow other people to award certain badges.</p>
  </div>

  <div class="grid-66">
    <form class="admin-form" method="POST">
      <table>
        <tr>
          <td><label for="authorization-badge-id">Badge ID</label></td>
          <td><input name="authorization-badge-id" required="required" placeholder="awesome-badge"/></td>
        </tr>
        <tr>
          <td><label for="authorization-person-email">Person Email</label></td>
          <td><input name="authorization-person-email" type="email" required="required"
                placeholder="abadger@badgin.com"/></td>
        </tr>
        <tr>
          <td></td><td>
            <input name="add-authorization" type="submit" value="Add Authorization" />
          </td>
        </tr>
      </table>
    </form>
  </div>
