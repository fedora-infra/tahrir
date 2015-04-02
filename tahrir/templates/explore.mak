<%inherit file="master.mak"/>
<div class="page">

  % if search_query:
    <div class="grid-100">
      <div class="shadow">
        <h1 class="section-header">Search Results</h1>
        <div class="padded-content">
          % if len(search_results) > 0:
            <p>
              Your search for <strong>${search_query}</strong>
              returned the following results:
            </p>
            <ul class="pretty-list">
              % for r in search_results:
                <li><a href="${search_results[r]}">${r}</a></li>
              % endfor
            </ul>
            % else:
              <p>
                Your search for <strong>${search_query}</strong>
                returned no results.
              </p>
          % endif
        </div> <!-- End padded-content. -->
      </div> <!-- End shadow. -->
    </div> <!-- End grid-100. -->
  % endif

  <div class="clear spacer"></div>

  <!-- COLUMN 1 (Left)-->
  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Explore Badges</h1>
      <p style="margin-left: 20px;">
        Visit the <a href="${request.route_url('explore_badges')}">badge index</a>
        to see <strong>every badge</strong>,
        as well as the <strong>newest badges</strong>.
      </p>
      <div class="clear"></div>
      <div class="padded-content">
        <h2>Random Badges</h2>
        % for badge in random_badges:
          ${self.functions.badge_thumbnail(badge, 64, 15)}
        % endfor
        <div class="clear"></div>
        <h2>Badge Search</h2>
        <form method="POST">
          <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
          <table>
            <tr>
              <td>
                <label for="badge-query">
                  Keyword
                  <span class="sublabel">Search through badge names, descriptions, and tags.</span>
                </label>
              </td>
              <td><input name="badge-query" required="required" /></td>
            </tr>
            <tr>
              <td colspan="2">
                <input name="badge-search" type="submit" value="Search" />
              </td>
            </tr>
          </table>
        </form>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div>

  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Explore People</h1>
      <div class="padded-content">
        <h2>Random People</h2>
        % for person in random_persons:
          ${self.functions.avatar_thumbnail(person, 64, 15)}
        % endfor
        <div class="clear"></div>
        <h2>Person Search</h2>
        <form method="POST">
          <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
          <table>
            <tr>
              <td>
                <label for="person-query">
                  Keyword
                  <span class="sublabel">
                    Search through person names and bios.</span>
                </label>
              </td>
              <td><input name="person-query" required="required" /></td>
            </tr>
            <tr>
              <td colspan="2"><input name="person-search" type="submit" value="Search" /></td>
            </tr>
          </table>
        </form>
      </div> <!-- End padded content -->
    </div> <!-- End shadow. -->
  </div> <!-- End grid-50 -->

  <div class="clear spacer"></div>

  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Explore Tags</h1>
      <div class="padded-content">
        <h2>View Tags</h2>
        <form method="POST">
          <input type="hidden" name="csrf_token" value="${request.session.get_csrf_token()}"/>
          <table>
            <tr>
              <td>
                <label for="tag-query">
                  Tags
                  <span class="sublabel">Separate tags with commas.</span>
                </label>
              </td>
              <td><input name="tag-query" required="required" /></td>
            </tr>
            <tr>
              <td>
                <label for="tag-match-all">
                  Match all tags?
                  <span class="sublabel">Otherwise, match any tags.</span>
                </label>
              </td>
              <td><input name="tag-match-all" type="checkbox" /></td>
            </tr>
            <tr>
              <td colspan="2"><input name="tag-search" type="submit" value="Search" /></td>
            </tr>
          </table>
        </form>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div> <!-- End grid-50. -->


  <div class="grid-50">
    <div class="shadow">
      <h1 class="section-header">Reports</h1>
      <div class="padded-content">
        <p>You can construct URLs to generate reports on almost any time frame.
        Take a look at the following examples:</p>

        <ul class="pretty-list">
          <li>Top badge earners <a href="report/2013">for all of 2013</a></li>
          <li>Top badge earners <a href="report/2013/10">for only October of 2013</a></li>
          <li>Top badge earners <a href="report/2013/10/2">for just the second day of that October</a></li>
          <li>Top badge earners <a href="report/2013/week/37">for the 37th week of 2013</a></li>
          <li>Top badge earners <a href="report">for just this week</a></li>
        </ul>
      </div> <!-- End padded content. -->
    </div> <!-- End shadow. -->
  </div> <!-- End grid-50. -->
</div>
