<%inherit file="master.mak"/>
<div class="page">
  <div class="grid-100">
    <h1 class="section-header">Administration Panel</h1>
    <p>
      The admin panel is currently under reconstruction. During this time,
      there will be sub-par validation and little guidance. We apologize.
    </p>
  </div>

  <div class="clear"></div>

  <div class="grid-50">
    <form class="admin-form" method="POST">
      <legend>Add Person</legend>
      <p>Add a new user, who can then be awarded badges.</p>
      <table>
        <tr>
          <td><label for="person-email">Email</label></td>
          <td><input name="person-email" type="email" required="required" /></td>
        </tr>
        <tr>
          <td><label for="person-nickname">Nickname <span class="sublabel">Optional.</span></label></td>
          <td><input name="person-nickname" /></td>
        </tr>
        <tr>
          <td><label for="person-website">Website <span class="sublabel">Optional.</span></label></td>
          <td><input name="person-website" /></td>
        </tr>
        <tr>
          <td><label for="person-bio">Bio <span class="sublabel">Optional.</span></label></td>
          <td><input name="person-bio" /></td>
        </tr>
        <tr>
          <td colspan="2">
            <input name="add-person" type="submit" value="Add" />
          </td>
        </tr>
      </table>
    </form>
  </div>

  <div class="grid-50">
    <form class="admin-form" method="POST">
      <legend>Add Issuer</legend>
      <p>Add a new issuer. Each badge must have an issuer.</p>
      <table>
        <tr>
          <td><label for="issuer-origin">Origin</label></td>
          <td><input name="issuer-origin" required="required" /></td>
        </tr>
        <tr>
          <td><label for="issuer-name">Name</label></td>
          <td><input name="issuer-name" required="required" /></td>
        </tr>
        <tr>
          <td><label for="issuer-org">Organization</label></td>
          <td><input name="issuer-org" required="required" /></td>
        </tr>
        <tr>
          <td><label for="issuer-contact">Contact</label></td>
          <td><input name="issuer-contact" required="required" /></td>
        </tr>
        <tr>
          <td colspan="2"><input name="add-issuer" type="submit" value="Add" /></td>
        </tr>
      </table>
    </form>
  </div>

  <div class="clear"></div>

  <div class="grid-50">
    <form class="admin-form" method="POST">
      <legend>Add Badge</legend>
      <p>Add a new badge so that it can be awarded to people.</p>
      <table>
        <tr>
          <td><label for="badge-name">Name</label></td>
          <td><input name="badge-name" required="required" /></td>
        </tr>
        <tr>
          <td><label for="badge-image">Image</label></td>
          <td><input name="badge-image" required="required" /></td>
        </tr>
        <tr>
          <td><label for="badge-description">Description</label></td>
          <td><input name="badge-description" required="required" /></td>
        </tr>
        <tr>
          <td><label for="badge-criteria">Criteria <span class="sublabel">Link to discussion about accepting the badge.</span></label></td>
          <td><input name="badge-criteria" required="required" /></td>
        </tr>
        <tr>
          <td><label for="badge-issuer">Issuer ID</label></td>
          <td><input name="badge-issuer" required="required" /></td>
        </tr>
        <tr>
          <td><label for="badge-tags">Tags <span class="sublabel">Comma-delimited list of tags.</span></label></td>
          <td><input name="badge-tags" /></td>
        </tr>
        <tr>
          <td colspan="2"><input name="add-badge" type="submit" value="Add" /></td>
        </tr>
      </table>
    </form>
  </div>

  <div class="grid-50">
    <form class="admin-form" method="POST">
      <legend>Add Invitation</legend>
      <p>Invite a person via link and QR code to accept a new badge.</p>
      <table>
        <tr>
          <td>
            <label for="invitation-created">
              Creation Date
              <span class="sublabel">
                YYYY-MM-DD HH:MM <br />
                Defaults to the current time.
              </span>
            </label>
          </td>
          <td><input name="invitation-created" type="datetime" /></td>
        </tr>
        <tr>
          <td>
            <label for="invitation-expires">
              Expiration Date
              <span class="sublabel">
                YYYY-MM-DD HH:MM <br />
                Defaults to 2 hours from now.
              </span>
            </label>
          </td>
          <td><input name="invitation-expires" type="datetime" /></td>
        </tr>
        <tr>
          <td><label for="invitation-badge-id">Badge ID</label></td>
          <td><input name="invitation-badge-id" required="required" /></td>
        </tr>
        <tr>
          <td><label for="invitation-issuer-id">Person ID</label></td>
          <td><input name="invitation-issuer-id" required="required" /></td>
        </tr>
        <tr>
          <td colspan="2"><input name="add-invitation" type="submit" value="Add" /></td>
        </tr>
      </table>
    </form>
  </div>

  <div class="clear"></div>

  <div class="grid-50">
    <form class="admin-form" method="POST">
      <legend>Add Assertion</legend>
      <p>Award a badge to a person.</p>
      <table>
        <tr>
          <td><label for="assertion-badge-id">Badge ID</label></td>
          <td><input name="assertion-badge-id" required="required" /></td>
        </tr>
        <tr>
          <td><label for="assertion-person-email">Person Email</label></td>
          <td><input name="assertion-person-email" type="email" required="required" /></td>
        </tr>
        <tr>
          <td>
            <label for="assertion-issued-on">
              Issued On
              <span class="sublabel">
                YYYY-MM-DD HH-MM <br />
                Defaults to current time.
              </span>
            </label>
          </td>
          <td><input name="assertion-issued-on" type="datetime" /></td>
        </tr>
        <tr>
          <td colspan="2"><input name="add-assertion" type="submit" value="Add" /></td>
        </tr>
      </table>
    </form>
  </div>
