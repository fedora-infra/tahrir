
0.9.1
-----

Pull Requests

- (@sayanchowdhury) #350, Convert Decimal to string only when returning json
  https://github.com/fedora-infra/tahrir/pull/350
- (@dhgutteridge)   #356, Fix calculation of percentage of top users in the leaderboard
  https://github.com/fedora-infra/tahrir/pull/356
- (@puiterwijk)     #353, Fix breaking bugs
  https://github.com/fedora-infra/tahrir/pull/353
- (@ryanlerch)      #362, Added Vagrant setup for hacking on Tahrir
  https://github.com/fedora-infra/tahrir/pull/362
- (@sayanchowdhury) #365, Fix the json output for series
  https://github.com/fedora-infra/tahrir/pull/365

Commits

- 480dc9081 Convert Decimal to string when returning json
  https://github.com/fedora-infra/tahrir/commit/480dc9081
- 67543ff59 Fix breaking bugs
  https://github.com/fedora-infra/tahrir/commit/67543ff59
- cadb1067a Fix calculation of percentage of top users in the leaderboard
  https://github.com/fedora-infra/tahrir/commit/cadb1067a
- 5b414c4d7 Added Vagrant setup for hacking on Tahrir
  https://github.com/fedora-infra/tahrir/commit/5b414c4d7
- 61ed24651 Fix the json out for series
  https://github.com/fedora-infra/tahrir/commit/61ed24651

0.9.0
-----

Pull Requests

- (@decause)        #310, Free as in Freedom
  https://github.com/fedora-infra/tahrir/pull/310
- (@ralphbean)      #312, Add a search form to the header..
  https://github.com/fedora-infra/tahrir/pull/312
- (@trishnaguha)    #322, Changes for RPM-based distributions
  https://github.com/fedora-infra/tahrir/pull/322
- (@trishnaguha)    #324, Changes to fix traceback from dependencies
  https://github.com/fedora-infra/tahrir/pull/324
- (@trishnaguha)    #325, Fixes Internal server error #321
  https://github.com/fedora-infra/tahrir/pull/325
- (@puiterwijk)     #326, The current code crashes in December as 12+1 > 12
  https://github.com/fedora-infra/tahrir/pull/326
- (@puiterwijk)     #327, Fix the monthly report, same breakage
  https://github.com/fedora-infra/tahrir/pull/327
- (@sayanchowdhury) #328, fix the percentile for the top users in the leaderboard
  https://github.com/fedora-infra/tahrir/pull/328
- (@trishnaguha)    #333, Linking GoBack of datagrepper page to user page
  https://github.com/fedora-infra/tahrir/pull/333
- (@cydrobolt)      #335, Change "add assertion" to "award individual badge"
  https://github.com/fedora-infra/tahrir/pull/335
- (@sayanchowdhury) #344, Create a function to return a dict of user badge informations
  https://github.com/fedora-infra/tahrir/pull/344
- (@sayanchowdhury) #347, Forms to create Teams, Series, Perks and json endpoint for the Paths
  https://github.com/fedora-infra/tahrir/pull/347

Commits

- 565a65dda Be more careful with this comprehension.
  https://github.com/fedora-infra/tahrir/commit/565a65dda
- 59fdefa85 Free as in Freedom
  https://github.com/fedora-infra/tahrir/commit/59fdefa85
- 54018f713 Add a search form to the header..
  https://github.com/fedora-infra/tahrir/commit/54018f713
- c513c3211 Changes for RPM-based distributions
  https://github.com/fedora-infra/tahrir/commit/c513c3211
- 45d0c3b61 Changes to fix traceback from dependencies
  https://github.com/fedora-infra/tahrir/commit/45d0c3b61
- 7fb633f3e Fixes Internal server error #321
  https://github.com/fedora-infra/tahrir/commit/7fb633f3e
- 11c8da3a7 Add a note about fedora-apps.
  https://github.com/fedora-infra/tahrir/commit/11c8da3a7
- bc055fda1 Merge branch 'develop' of github.com:fedora-infra/tahrir into develop
  https://github.com/fedora-infra/tahrir/commit/bc055fda1
- 90b28c8e3 The current code crashes in December as 12+1 > 12
  https://github.com/fedora-infra/tahrir/commit/90b28c8e3
- 9414d86ae Fix the monthly report, same breakage
  https://github.com/fedora-infra/tahrir/commit/9414d86ae
- fba45ed4d Also expose tags over the JSON api.
  https://github.com/fedora-infra/tahrir/commit/fba45ed4d
- 70593ccfe Merge branch 'develop' of github.com:fedora-infra/tahrir into develop
  https://github.com/fedora-infra/tahrir/commit/70593ccfe
- 5a198ed36 fix the percentile for the top users in the leaderboard
  https://github.com/fedora-infra/tahrir/commit/5a198ed36
- 902fe55d3 Linking GoBack of datagrepper page to user page
  https://github.com/fedora-infra/tahrir/commit/902fe55d3
- 512ac2ccd Change "add assertion" to "award individual badge"
  https://github.com/fedora-infra/tahrir/commit/512ac2ccd
- f29b6431b Create a function to return a dict of user badge informations
  https://github.com/fedora-infra/tahrir/commit/f29b6431b
- 594a8b922 Add the form to add team
  https://github.com/fedora-infra/tahrir/commit/594a8b922
- a3b5c8965 Add forms for adding perk and series
  https://github.com/fedora-infra/tahrir/commit/a3b5c8965
- 0e033ce8e Add a new endpoint to pull out the json for team user data
  https://github.com/fedora-infra/tahrir/commit/0e033ce8e
- 3fd168505 Minor fixes to template and remove redundant code
  https://github.com/fedora-infra/tahrir/commit/3fd168505
- 70aeaacb7 Explicitly mentions the route name in the template
  https://github.com/fedora-infra/tahrir/commit/70aeaacb7
- 03040ced0 Change Perk to Milestone
  https://github.com/fedora-infra/tahrir/commit/03040ced0
Changelog
=========

0.8.2
-----

- Add fedmenu. `2e3f01f0e <https://github.com/fedora-infra/tahrir/commit/2e3f01f0eb1d3aca699e9b71a25755da904aac3b>`_
- Merge pull request #304 from fedora-infra/feature/fedmenu `f6daed3cb <https://github.com/fedora-infra/tahrir/commit/f6daed3cb8de8d2c5d7929bf346e826291b42cc3>`_
- Remove version pin for pyramid. `9c8d6e130 <https://github.com/fedora-infra/tahrir/commit/9c8d6e130ecc21345e8a1f06420ab29426dbb135>`_
- In modern pyramid, mako support is provided by a third-party module. `c490ada77 <https://github.com/fedora-infra/tahrir/commit/c490ada77470d7239c87420d51c2aeb3b0b278a5>`_
- Merge pull request #305 from fedora-infra/feature/modern-pyramid `b173380da <https://github.com/fedora-infra/tahrir/commit/b173380dace8a3dff002796ab55f77a8e4061cd9>`_
- (cosmetic) Use "name" for this variable to be more clear. `cf70a55bd <https://github.com/fedora-infra/tahrir/commit/cf70a55bdd737a8d1fcb848bbb4190f1d0cc41f6>`_
- Don't mangle the name for new badges passed in by the admin form. `bcd5b910e <https://github.com/fedora-infra/tahrir/commit/bcd5b910e86c297b3c285be09f75948ba6164d16>`_
- Merge pull request #306 from fedora-infra/feature/mangled-name `bd9f674e2 <https://github.com/fedora-infra/tahrir/commit/bd9f674e2aff26c1361b01bd1fd8eb24f49b19cc>`_
- Allow users to specify a limit to the json leaderboard. `6be0c98fb <https://github.com/fedora-infra/tahrir/commit/6be0c98fba72a5fc09dd45f59a0b063a7297cc18>`_
- Merge pull request #307 from fedora-infra/feature/json-limit `40fa902e3 <https://github.com/fedora-infra/tahrir/commit/40fa902e3b015a807c7c80a4feec95b9ab3521c1>`_

0.8.1
-----

- Fix <div> closure in the history pane. `2c1571f8a <https://github.com/fedora-infra/tahrir/commit/2c1571f8a50b181dcef28f348cf9d20142ad72a9>`_

0.8.0
-----

- Promote the monthly leaderboard. `5ccb1ac88 <https://github.com/fedora-infra/tahrir/commit/5ccb1ac88c1c6622e273207915606d437f3dd32c>`_
- Change frontpage panes. `5dcb38042 <https://github.com/fedora-infra/tahrir/commit/5dcb38042a2a87dd81682dc2904f7d3dba6c477c>`_
- Merge pull request #296 from fedora-infra/feature/promote-monthly-leaderboard `6c9d41d5e <https://github.com/fedora-infra/tahrir/commit/6c9d41d5e33050112dc2cc5c41f1324d3dffd04e>`_
- Provide a link from your profile to FMN. `9c4c48113 <https://github.com/fedora-infra/tahrir/commit/9c4c48113c1d5b7ff1a0aad35fc7447a1f25c516>`_
- Merge pull request #297 from fedora-infra/feature/frontpage-switchup `3ebff58af <https://github.com/fedora-infra/tahrir/commit/3ebff58aff971fb57902bee12d823d721f56879f>`_
- Shorten the number of entries in the user-history pane. `acb60ba5d <https://github.com/fedora-infra/tahrir/commit/acb60ba5d647c43407d743d339a87e0ddc541547>`_
- Completely hide the history pane in the mobile view. `3a341802c <https://github.com/fedora-infra/tahrir/commit/3a341802c4a78a679b775e675951534bd495b462>`_
- Merge pull request #298 from fedora-infra/feature/fmn-link `059becde5 <https://github.com/fedora-infra/tahrir/commit/059becde55b17f6a603920f7bc03886aa6a8201d>`_
- Merge pull request #299 from fedora-infra/feature/shorten-history `7afa96139 <https://github.com/fedora-infra/tahrir/commit/7afa96139360c9047b908fd050b8f459c4546470>`_
- Wait a little longer after receiving a websocket message before going back to query the assertions API. `c6d9ea2db <https://github.com/fedora-infra/tahrir/commit/c6d9ea2dbe5576630828088ba445be01cf10c10e>`_
- Use css flexbox to render badge collections much more nicely. `8f790fea8 <https://github.com/fedora-infra/tahrir/commit/8f790fea89dd5fc1ffb7aaaa06085b74ed9ad5cf>`_
- Merge pull request #300 from fedora-infra/feature/flexbox `5061c5632 <https://github.com/fedora-infra/tahrir/commit/5061c56325c3512210928c3ebce55f5bf52c42d4>`_
- Lay out badges according to their tags. `4b25f1a31 <https://github.com/fedora-infra/tahrir/commit/4b25f1a3116ec21b8ce150260f7ac41150aa5cd0>`_
- Add an admin interface for adding new tags to existing badges. `a0458301f <https://github.com/fedora-infra/tahrir/commit/a0458301ff40dd595bb99af769a749748bae4002>`_
- Merge pull request #302 from fedora-infra/feature/admin-tagging `5f977e7f2 <https://github.com/fedora-infra/tahrir/commit/5f977e7f26711ec5e02c66ba3059a642a4b12205>`_
- Typofix. `d46cfe58b <https://github.com/fedora-infra/tahrir/commit/d46cfe58bce7c51579511ffafb9d8b8cf154cfb1>`_
- CSRF protection. `55263bce4 <https://github.com/fedora-infra/tahrir/commit/55263bce48d0d200697aa3830e7cdfb3f7ea41f7>`_
- Merge pull request #303 from fedora-infra/feature/csrf `5ff84e887 <https://github.com/fedora-infra/tahrir/commit/5ff84e887e21a427a3acff348839be0e97cda8fb>`_
- Merge pull request #301 from fedora-infra/feature/tag-layout `8a69d0826 <https://github.com/fedora-infra/tahrir/commit/8a69d08268f83eeb12b13be9957cc4fdbe704051>`_

0.7.4
-----

- Remove old "pip freeze" requirements.txt. `3c0928826 <https://github.com/fedora-infra/tahrir/commit/3c0928826c2459e50095b61d0bcbdfd2e1cb018e>`_
- Un-pin tahrir-api. `c55cc31a3 <https://github.com/fedora-infra/tahrir/commit/c55cc31a35beba4eb371ace29dc161b11df1a491>`_

0.7.3
-----

- Add JSOpenID Single Signon `466f41f19 <https://github.com/fedora-infra/tahrir/commit/466f41f19c6f9ddd7a0d787f91ea7bc3e7ae983a>`_
- Do not report failures (we won't see them anyway) `50503a73b <https://github.com/fedora-infra/tahrir/commit/50503a73b2526aa905d240b091ab960b84282a78>`_
- Update URL to the new decided URL `6e84b0bac <https://github.com/fedora-infra/tahrir/commit/6e84b0bacf118e2b5246b92b688fc6bd469282f7>`_
- Merge pull request #287 from fedora-infra/singleLogin `4d7dedf6c <https://github.com/fedora-infra/tahrir/commit/4d7dedf6cdd531797ca15dd47f3c8f6916c73733>`_
- JSOpenID is renamed to JSAutoLogin `93b09f695 <https://github.com/fedora-infra/tahrir/commit/93b09f6959d53b2a485d099033cad80004639f24>`_
- Merge pull request #289 from fedora-infra/jsopenid-rename `6fbda8eb6 <https://github.com/fedora-infra/tahrir/commit/6fbda8eb63de2cc13408ae725f4aed9680beb1ad>`_
- Add a history pane that shows what badges were awarded for. `0eb3115f9 <https://github.com/fedora-infra/tahrir/commit/0eb3115f9084224952cf0a78d486aa9308a40914>`_
- Merge pull request #290 from fedora-infra/feature/add-history-pane `e3d403c30 <https://github.com/fedora-infra/tahrir/commit/e3d403c30f2eef3a3cbfe53da8aaa2269aad59d7>`_
- Use UTC when coming up with the relative time text. `7b4ee5075 <https://github.com/fedora-infra/tahrir/commit/7b4ee5075539041b91a25bf9506eaa210ca05d00>`_
- Merge pull request #291 from fedora-infra/feature/timelord `2ee0b9edb <https://github.com/fedora-infra/tahrir/commit/2ee0b9edb4c0adc2649658ecf33249dd7487a526>`_
- Allow the http_only flag to be set on authtkt cookies. `8e5f79eef <https://github.com/fedora-infra/tahrir/commit/8e5f79eef9fc3b184912b00048952629c74d0157>`_
- Remove unused lines. `b829a01c4 <https://github.com/fedora-infra/tahrir/commit/b829a01c43d64ba4c2df65bc647238e9072ff09e>`_
- Apply secure and http_only settings to both the auth_tkt and session cookies. `44c218d56 <https://github.com/fedora-infra/tahrir/commit/44c218d56769be557c632c20a7787b24182a7396>`_
- Merge pull request #292 from fedora-infra/feature/httponly-cookies `5411f321a <https://github.com/fedora-infra/tahrir/commit/5411f321ac5cb6130a8c5f4bcc6081e8211ff8a7>`_

0.7.2
-----

- Offset our badges by 25 units. `824da05f3 <https://github.com/fedora-infra/tahrir/commit/824da05f3f6d14ba8491e721019f483666dcab43>`_
- Add source for favico.js. `a776ad2e2 <https://github.com/fedora-infra/tahrir/commit/a776ad2e2b5d51e79842bc2f7909d77beb679125>`_
- Animate the favicon when badges are awarded. `f1d2b3430 <https://github.com/fedora-infra/tahrir/commit/f1d2b343068f9435ec90c0647e6f14266375219a>`_
- Merge pull request #282 from fedora-infra/feature/favico.js `f6675a48a <https://github.com/fedora-infra/tahrir/commit/f6675a48abfb32370d2255dff402e990a7c5e7b9>`_
- Use https for github URLs `fc68e04d5 <https://github.com/fedora-infra/tahrir/commit/fc68e04d5c561d9d51047663b1eba0b9baddbd66>`_
- Merge pull request #285 from tyll/https `1bc9d788f <https://github.com/fedora-infra/tahrir/commit/1bc9d788fc84783275a61092ebf8a0e2cb395164>`_
- Add checks to check for attempted duplicate additions of person, badge, assertion, or issuer to the db `7af9846d5 <https://github.com/fedora-infra/tahrir/commit/7af9846d508381b17dc1e915cbe752e1719662f6>`_
- pep 8 that comment `60219b7d4 <https://github.com/fedora-infra/tahrir/commit/60219b7d41c684ac8cb169610279fe3f3382ce8c>`_
- Add check in admin view to ensure a duplicate authorization will not be attempted `9ffa6493f <https://github.com/fedora-infra/tahrir/commit/9ffa6493f5001aba8daaa3baaf314cd1680f4b2b>`_
- use new badge_name_to_id util function from tahrir-api `5d5ba030d <https://github.com/fedora-infra/tahrir/commit/5d5ba030dc87279e9d4c7d6e5fc3f9cfc80f6ba0>`_
- Merge pull request #286 from fedora-infra/feature/admin-check-dups `6d06d14e1 <https://github.com/fedora-infra/tahrir/commit/6d06d14e19cdac349705c9f93077998f46a8ff57>`_
- Fix mistaken import. `25dffbed2 <https://github.com/fedora-infra/tahrir/commit/25dffbed2672b4b8c382e6efb10c689030a881e3>`_
- 0.7.2 `e118d5e0b <https://github.com/fedora-infra/tahrir/commit/e118d5e0bbfccd5e38a27a45746d380fd3966823>`_

0.7.0
-----

- Add a place to upload CSV files to the admin panel. `357f6902e <https://github.com/fedora-infra/tahrir/commit/357f6902efd0c33d791066202974d2f807181638>`_
- Lots of progress on awarding from a CSV file. Currently dealing with a Tahrir API issue, so the code is broken at the moment. `545ea4129 <https://github.com/fedora-infra/tahrir/commit/545ea41299c7fe5aabeebc68f5499d83d58f2908>`_
- Deal with доверие. `06dfc320e <https://github.com/fedora-infra/tahrir/commit/06dfc320ed0a150bc5bcad8869e24289b3c51411>`_
- Merge pull request #261 from fedora-infra/feature/UnicodeExplosionError `af7ab74a8 <https://github.com/fedora-infra/tahrir/commit/af7ab74a86847a4785017e2a222279d2e5c10735>`_
- Allow admin to set default avatar explicitly. `5aa1927ce <https://github.com/fedora-infra/tahrir/commit/5aa1927ce317c118815bd2617e1870ee99396877>`_
- Merge pull request #263 from fedora-infra/feature/default-avatar `640ee213f <https://github.com/fedora-infra/tahrir/commit/640ee213f60efdbd285f5463e20e5aaf8a85611f>`_
- Merge branch 'develop' into feature/csv-award `9270d7ffb <https://github.com/fedora-infra/tahrir/commit/9270d7ffb0edf52429ea4ddcbc16689e1faba6aa>`_
- CSV badge awarding works. `2f95881e2 <https://github.com/fedora-infra/tahrir/commit/2f95881e2c234dba4e385c74a99fb7b3983a95b4>`_
- Improve CSV award info on admin template. `5f4316048 <https://github.com/fedora-infra/tahrir/commit/5f431604852dbabb8ba0daf5cbb331246337305d>`_
- Ignore strange ropeproject files I suppose. `5caf7d2ed <https://github.com/fedora-infra/tahrir/commit/5caf7d2ed09653f2d415a752b7bb12f9e77e7843>`_
- Flash message to say how many badges were successfully awarded from the CSV awarder. `7fd97c1f2 <https://github.com/fedora-infra/tahrir/commit/7fd97c1f2cc007872f101b610145e5875d419f74>`_
- Merge pull request #265 from fedora-infra/feature/csv-award `21bf4a778 <https://github.com/fedora-infra/tahrir/commit/21bf4a7789a30df2d1c884220941bdb7830eb7aa>`_
- Link to the reason you were awarded a badge. `e2c8fe36d <https://github.com/fedora-infra/tahrir/commit/e2c8fe36da2e21ae9701ace339e6e43f8f4d8c77>`_
- Merge pull request #269 from fedora-infra/feature/link-to-reason `7519d16d8 <https://github.com/fedora-infra/tahrir/commit/7519d16d8938e76a0b84133d3484021e8c990acc>`_
- Be careful when generating badge json. `ba77c3d99 <https://github.com/fedora-infra/tahrir/commit/ba77c3d990d23d660d24103b7bd66f819fe26281>`_
- Merge pull request #271 from fedora-infra/feature/careful-in-json-generation `8eee6047d <https://github.com/fedora-infra/tahrir/commit/8eee6047d679233101a2406d30d41f93bc1614d4>`_
- Allow a no-modal mode for export. `f2bab797f <https://github.com/fedora-infra/tahrir/commit/f2bab797fdb797324b33fdfbd7d310061670648c>`_
- Merge pull request #273 from fedora-infra/feature/no-modal-for-sugar-browse `c4b26bcea <https://github.com/fedora-infra/tahrir/commit/c4b26bcea18961fadbaf651aa99ff1235a102a10>`_
- Fix unclosed URL link `fc2f524f5 <https://github.com/fedora-infra/tahrir/commit/fc2f524f51c6c2d681d674a619a8f369bf596c03>`_
- Fix typos in instructions for setting up Tahrir `563f2ff48 <https://github.com/fedora-infra/tahrir/commit/563f2ff48e2c37982d447cfeb38fff8435242077>`_
- Default port is 8000 `e60d469a0 <https://github.com/fedora-infra/tahrir/commit/e60d469a05b4cfaef8f7bdb75192c097a2ba5dc9>`_
- Clarify steps for adding user to tahrir.admin `8c7b1855c <https://github.com/fedora-infra/tahrir/commit/8c7b1855c3b89fbc4ea8fc647ee6125c7ecc470d>`_
- Merge pull request #274 from jamielinux/readme-fixes `c5245f467 <https://github.com/fedora-infra/tahrir/commit/c5245f46787e8fcd018a2d4790bab8c82d5ac91f>`_
- Fix link to badges_fan.png `875397c5d <https://github.com/fedora-infra/tahrir/commit/875397c5dd631fea4b9cb5e0ef14065db447a25f>`_
- Merge pull request #278 from jamielinux/fix-badges-fan `712a3ef06 <https://github.com/fedora-infra/tahrir/commit/712a3ef06863995a53bfa6807c2b88a4ab0ad01f>`_
- Rename badge.mak to badge-base.mak `0f1862435 <https://github.com/fedora-infra/tahrir/commit/0f18624358af3baeadd2d1a0f3685272bc10911f>`_
- Do not show all holders when there are too many `90a391057 <https://github.com/fedora-infra/tahrir/commit/90a3910572ad4b3759ba7cb34ecc9205d65d622d>`_
- Merge pull request #279 from jamielinux/holders-limit `9a2a491b7 <https://github.com/fedora-infra/tahrir/commit/9a2a491b7ac4241c6da5ca0d969ada0a3dcd58d7>`_
- Stubbing out stl page. `3194b38bf <https://github.com/fedora-infra/tahrir/commit/3194b38bf0f3ebc74a811be75f8a5c0fb3da8bb0>`_
- Success! `099ffb856 <https://github.com/fedora-infra/tahrir/commit/099ffb856937f2008fb334cdfe6e0909b64fecb9>`_
- Styling. `22433a1fe <https://github.com/fedora-infra/tahrir/commit/22433a1fed51b884077ea50f6eb651fa893e8d97>`_
- Only show this button if the badge has an stl file. `e2565d656 <https://github.com/fedora-infra/tahrir/commit/e2565d6566d1750c693d9e1c3dd9f36908570f65>`_
- Merge pull request #281 from fedora-infra/feature/stls `447604624 <https://github.com/fedora-infra/tahrir/commit/447604624c1273fa3295313f95b7c2d2bb20114a>`_

0.5.2
-----

- Create a custom openid extension for velruse. `5539ea299 <https://github.com/fedora-infra/tahrir/commit/5539ea2996d039b67e108ec1c9ed4ea1bf6cd138>`_

0.5.1
-----

- Delay executing websocket callback for 250ms to dodge race condition. `507a9cdcf <https://github.com/fedora-infra/tahrir/commit/507a9cdcfcff1a44c4a884b4df4a26c13158c199>`_
- Merge pull request #249 from fedora-infra/feature/websocket-delay `eee737973 <https://github.com/fedora-infra/tahrir/commit/eee737973a3854e1fcfef35a5c253306e6e230ce>`_
- Added template to render flash messages `ebc407fbe <https://github.com/fedora-infra/tahrir/commit/ebc407fbe0144b1e56221023b66d6e6dfdaa4a10>`_
- Added session variable to store flash messages `0a5a6ee80 <https://github.com/fedora-infra/tahrir/commit/0a5a6ee8031df3dacc7e84842a0538ef044fc165>`_
- Added request.session configuration to store flash messages `34822bfc5 <https://github.com/fedora-infra/tahrir/commit/34822bfc5eabe5dcd26e62293a7efe0ada64f9a3>`_
- Added css attributes to render message flash cards `a2e17b0d3 <https://github.com/fedora-infra/tahrir/commit/a2e17b0d3d3384fd5727b9bffb431a17d5276301>`_
- Merge pull request #251 from rahulrrixe/develop `45f75c483 <https://github.com/fedora-infra/tahrir/commit/45f75c4837a025ce16064988f50ee610dd73b795>`_
- Remove TODO notes. `bdf66a0f4 <https://github.com/fedora-infra/tahrir/commit/bdf66a0f41f84cd6c4f2f1b3dc68d2dfa3e18862>`_
- Try doing flash messages without js, with html only. `641a7befb <https://github.com/fedora-infra/tahrir/commit/641a7befb2a5be1ae323da38289fcbfc9159db35>`_
- Remove js-popup css. `2f6651c8d <https://github.com/fedora-infra/tahrir/commit/2f6651c8d36e702443a9ad88a08489e3939b5df9>`_
- Make add invitation accept the creator as email address instead of person ID. `89d6ffc86 <https://github.com/fedora-infra/tahrir/commit/89d6ffc86650d421ff39733b00c950c7b9b8e770>`_
- Make the admin panel a bit more user-friendly by making a dropdown of issuer selection `8082ffee8 <https://github.com/fedora-infra/tahrir/commit/8082ffee8beafe1e7b447a04277a0d791a284107>`_
- Show flash messages after performing admin commands `f3c1e4fcc <https://github.com/fedora-infra/tahrir/commit/f3c1e4fccb55c84c40d09bfe824018fd176001d7>`_
- Fix forgotten change to email `9c8a9bf3b <https://github.com/fedora-infra/tahrir/commit/9c8a9bf3b58e6290f1f9e483b1bd1840d81856b7>`_
- Merge pull request #253 from fedora-infra/feature/html-flash-messages `fa3b03fff <https://github.com/fedora-infra/tahrir/commit/fa3b03fff7dbc41c61f26dc02ea4f30739f30993>`_
- Merge pull request #255 from fedora-infra/feature/admin-revamp `18104b063 <https://github.com/fedora-infra/tahrir/commit/18104b063cdde452754cb45363399adc2d4b628a>`_
- Check the openid provider more explicitly. `12d4a0ff5 <https://github.com/fedora-infra/tahrir/commit/12d4a0ff5687f0135b94bd22f1f02967945f8188>`_

0.5.0
-----

- Let site admins create new authorizations. `0f4e89cba <https://github.com/fedora-infra/tahrir/commit/0f4e89cbab8dc103f6bfdab175a84dcb497a08f1>`_
- Create a way for authorized users to award single badges. `528e991f1 <https://github.com/fedora-infra/tahrir/commit/528e991f1e1d48bba13c6f7204434dae9b2a6398>`_
- Integrate FOAF and Schema:Person meta-tags into the user page. `b5231cefa <https://github.com/fedora-infra/tahrir/commit/b5231cefac256f5ab6b257d4640d98cf86124d90>`_
- Authorized delegates can also created invitations. `20afc1ff4 <https://github.com/fedora-infra/tahrir/commit/20afc1ff431b835e493a6400e22be3ceb40f36fa>`_
- Use .utcnow everywhere. `0ce17826a <https://github.com/fedora-infra/tahrir/commit/0ce17826abf8a70cbb8f8a1d447b4803af88f5ba>`_
- A nicer view for active invitations now that we have an easier way to create them. `2f3223569 <https://github.com/fedora-infra/tahrir/commit/2f32235693dfb0a4a02cf153f106552f108630be>`_
- Remove extra space `c1c0ce6f5 <https://github.com/fedora-infra/tahrir/commit/c1c0ce6f5c976d3bbc36da7b0f8dfd78521f72c9>`_
- Merge pull request #247 from fedora-infra/feature/foaf `0cbffc6f0 <https://github.com/fedora-infra/tahrir/commit/0cbffc6f04176b34689c609e78a228600e6cc0a0>`_
- Merge pull request #246 from fedora-infra/feature/authz `209845442 <https://github.com/fedora-infra/tahrir/commit/2098454429273c5cac20fa02b0aae65295791bf9>`_

0.4.5
-----

- Add a heartbeat for haproxy to ping. `d803d0574 <https://github.com/fedora-infra/tahrir/commit/d803d057487ebd2565fbb0624b58eb49fc3a84fd>`_
- Merge pull request #243 from fedora-infra/feature/heartbeat `823779caf <https://github.com/fedora-infra/tahrir/commit/823779caf79838f90fca2cb834c51db849442e5f>`_

0.4.4
-----

- Typofix. `0c7c2bdfc <https://github.com/fedora-infra/tahrir/commit/0c7c2bdfce8aa665b2cd3ed05cc6a0829b972b49>`_
- Only do 3 badges wide instead of 4.  4 is crowded. `00d0569bb <https://github.com/fedora-infra/tahrir/commit/00d0569bb82f873609878b9388fb329fc34c9bdc>`_
- Merge pull request #236 from fedora-infra/feature/fix-diff-bugs `21c2d12b1 <https://github.com/fedora-infra/tahrir/commit/21c2d12b1d79933dbe239cdaae748b32121958d5>`_
- Make the theme really configurable. `088ac1d3a <https://github.com/fedora-infra/tahrir/commit/088ac1d3a1c1f088d09950cabf2e5e6c675c5e67>`_
- Merge pull request #238 from fedora-infra/feature/more-configurable-asset-specification `711e33a4d <https://github.com/fedora-infra/tahrir/commit/711e33a4da4613ef47a908eacc7d5e12ccaf07e9>`_
- Make site logo set via stylesheet. For #64, probably closing it. `55a89d2f2 <https://github.com/fedora-infra/tahrir/commit/55a89d2f29c4ac1290b8ce098a2243d7e277b17f>`_
- Merge pull request #237 from fedora-infra/feature/custom-logo `994af6ac7 <https://github.com/fedora-infra/tahrir/commit/994af6ac7e9bdf58c2813fc0bd085ee5322e6e34>`_
- Re-add description to badge tooltip. (for #164) `94ee8bc6b <https://github.com/fedora-infra/tahrir/commit/94ee8bc6bdfc67f76436d17ee97a88c0b1b147a3>`_
- Create a rss feed for the latest badges `9f2e024e3 <https://github.com/fedora-infra/tahrir/commit/9f2e024e339ecf95365eda0b29e503326abf0969>`_
- Enhance the title of the post in the rss feed `7974acc0e <https://github.com/fedora-infra/tahrir/commit/7974acc0e39b945763e54ea6cd138aaeb83a76cc>`_
- Proper image div size for #site-logo. `109f6f3d7 <https://github.com/fedora-infra/tahrir/commit/109f6f3d794c1813ab4bd45d6accb8526f7180cc>`_
- Adjusted padding - entire footer visible on page `8682b58cc <https://github.com/fedora-infra/tahrir/commit/8682b58ccad6c8304988c61665850b286018658e>`_
- Merge pull request #239 from cayci/develop `5e0aa6792 <https://github.com/fedora-infra/tahrir/commit/5e0aa679265f157fbf5e517a7875a8205f235348>`_
- Fix TypeError that occured when viewing a user page when badges have not been awarded. `56f0b03f6 <https://github.com/fedora-infra/tahrir/commit/56f0b03f6ec7af116165e10f769caec87d39a23f>`_
- Merge pull request #240 from fedora-infra/feature/fix-profile-typeerror `9b54a43e9 <https://github.com/fedora-infra/tahrir/commit/9b54a43e95c8ad12be43eb323ff3a980a160e62f>`_
- Merge pull request #224 from fedora-infra/feature/rss_latest_badges `147bd2fb6 <https://github.com/fedora-infra/tahrir/commit/147bd2fb629bf9f8af050622e207d5238f6aefde>`_
- Add a link to the rss feed from the explore badges page `26cdf48ec <https://github.com/fedora-infra/tahrir/commit/26cdf48ecd03d1466e12f2d9d30a2e8b5d9fe487>`_
- Merge pull request #241 from fedora-infra/feature/rss_latest_badges `6e3dbef71 <https://github.com/fedora-infra/tahrir/commit/6e3dbef718e0acabf2ec18a70ab360bb63bcdea8>`_
- Start tweakin' admin panel. Forgot to pull in updates so gonna do that now. `1186455bf <https://github.com/fedora-infra/tahrir/commit/1186455bfa93cf66669e64593569b7376c27fc8b>`_
- Merge branch 'develop' into feature/admin-upgrade `47168774c <https://github.com/fedora-infra/tahrir/commit/47168774c524ce6a4a9b78484d64a88279e76b24>`_
- Design tweaks and clarifications for the still-not-great admin panel. `7a9bf590b <https://github.com/fedora-infra/tahrir/commit/7a9bf590b9ca24a2ed74628c2be67d89eedf04f5>`_
- Merge branch 'feature/admin-upgrade' into develop `8241fd61c <https://github.com/fedora-infra/tahrir/commit/8241fd61c5683852b868dd2fdd669ab3ea1d65d9>`_
- Make json leaderboard behave like the html leaderboard. `9c54d1379 <https://github.com/fedora-infra/tahrir/commit/9c54d1379480f54828c09746c45fe5a124d09a35>`_
- Merge pull request #242 from fedora-infra/feature/standardize-leaderboard `790d52ff9 <https://github.com/fedora-infra/tahrir/commit/790d52ff963618a1edaeabe63b9f4db24cfb379a>`_

0.4.3
-----

- PEP 8 for glory. `b0954a7f8 <https://github.com/fedora-infra/tahrir/commit/b0954a7f8ba2c56d4b83a7e167c7edb045a91213>`_
- A good deal of the user_edit view. Will finish after sleeps. `35d8f1ef5 <https://github.com/fedora-infra/tahrir/commit/35d8f1ef5b2ba7a48b01ad423ba824b0fdd30115>`_
- Use cached rank in the template. `f3220caef <https://github.com/fedora-infra/tahrir/commit/f3220caefb3c2a3f8524784f52080e730b806a04>`_
- Furthermore. `673e19af1 <https://github.com/fedora-infra/tahrir/commit/673e19af1835d4818cf2b004d547445eaeda8b52>`_
- Link to trac from the README. `3469cbba4 <https://github.com/fedora-infra/tahrir/commit/3469cbba438662bd149449443143ab58c44b9d67>`_
- The last shall be first and the first shall be last. `d9aff539e <https://github.com/fedora-infra/tahrir/commit/d9aff539ebbc4d2dc886fd5f1a7a0e2dba60fd7c>`_
- Merge pull request #218 from fedora-infra/feature/switcharoo `b61f11cfb <https://github.com/fedora-infra/tahrir/commit/b61f11cfbf91fba3640edbd154f643d3f7e8d669>`_
- Update production.ini `ba9031d7e <https://github.com/fedora-infra/tahrir/commit/ba9031d7e03885cbbfbed921ee69a34a63892240>`_
- Merge pull request #220 from ArcticSphinx/develop `cf8720fa7 <https://github.com/fedora-infra/tahrir/commit/cf8720fa70c8cdfa02499ab156e851642b6b8d2c>`_
- Display the date that you were awarded a given badge `ab7066fb2 <https://github.com/fedora-infra/tahrir/commit/ab7066fb2aa952513f48f2cb0750d9ff116d4d6e>`_
- Add a couple of missing commands to the quick set up howto `30ca2caf1 <https://github.com/fedora-infra/tahrir/commit/30ca2caf1b4aaef4014babbd7a6ed538cbdc6f3c>`_
- Merge pull request #223 from fedora-infra/feature/update_readme `683ae0783 <https://github.com/fedora-infra/tahrir/commit/683ae07839ab7f6fc8bb796f08d0bd764f22f03a>`_
- Require an older pyramid for now. `0f1cc15a3 <https://github.com/fedora-infra/tahrir/commit/0f1cc15a34cea72de6b3344e135a948752b4d0b7>`_
- Merge branch 'develop' of github.com:fedora-infra/tahrir into develop `27bd719b6 <https://github.com/fedora-infra/tahrir/commit/27bd719b68a8866d98fc0824da3260dde017295e>`_
- fix merge conflicts `176610e3f <https://github.com/fedora-infra/tahrir/commit/176610e3ff95d4f2a728be99a3ae1c9efadabe80>`_
- Badges are properly diffed on diff view! `e61cbc38e <https://github.com/fedora-infra/tahrir/commit/e61cbc38ee550a226ecdf68d7c3eb9452785d423>`_
- Display a bunch of diff stats before the visual badge comparison. `c70132797 <https://github.com/fedora-infra/tahrir/commit/c7013279772ea5a71ada5be6558e972a99a42f42>`_
- Fix out-of-the-box development openid login. `ab4a419be <https://github.com/fedora-infra/tahrir/commit/ab4a419be0445669bdd1fb11518b5cd83044928c>`_
- Merge pull request #226 from fedora-infra/feature/development-login `83cfebd8e <https://github.com/fedora-infra/tahrir/commit/83cfebd8e2883229663c12a3ede65ca2a0e7e14a>`_
- Limit the precision of the percentage in the diff template. `5cefed2b0 <https://github.com/fedora-infra/tahrir/commit/5cefed2b06dd16ec1fa32c5a2dbea696dfea34aa>`_
- Use a table to make the diff view tighter. `01882ca7f <https://github.com/fedora-infra/tahrir/commit/01882ca7f91250889e4682d606d20de1f2c33f13>`_
- Always sort diffed badges the same way. `064f9f04b <https://github.com/fedora-infra/tahrir/commit/064f9f04baea3372fc40cb75436f4b91c581acea>`_
- Add a button to diff the logged in user against a user they are viewing. `3008166c7 <https://github.com/fedora-infra/tahrir/commit/3008166c780367fdbd420f48105a47747f80ea23>`_
- Merge pull request #221 from fedora-infra/feature/date-awarded `3ddbb309d <https://github.com/fedora-infra/tahrir/commit/3ddbb309defc74df20732f9e1b08c4966382dae4>`_
- PEP8/style. `9e99aa76b <https://github.com/fedora-infra/tahrir/commit/9e99aa76b18259920deb1a94cf8f2fdc3661681e>`_
- Merge pull request #217 from fedora-infra/feature/user-diff `d87bc79c3 <https://github.com/fedora-infra/tahrir/commit/d87bc79c3208feeab8f87d6c2268925f8174bc99>`_
- Closes #190 by adding the Tahrir version to the footer. Also order tweak for aesthetic reasons. `5976d8077 <https://github.com/fedora-infra/tahrir/commit/5976d80777affa1ac15db1afb54a354ec6c506f2>`_
- PEP 8 and get rid of q logging (whoops). `9bcef0eee <https://github.com/fedora-infra/tahrir/commit/9bcef0eeec86e94105a7a8497aeb2ab93389f1fc>`_
- Get version from setuptools. `e544ba48b <https://github.com/fedora-infra/tahrir/commit/e544ba48b87792b174fedf892fc28d3cc554a581>`_
- Throw the tahrir-api version in there too. `e6eb3022d <https://github.com/fedora-infra/tahrir/commit/e6eb3022d64742d6cb17aacf8483a6d5bbd763d3>`_
- Fix pep8 block. `340661af0 <https://github.com/fedora-infra/tahrir/commit/340661af081f25d3b5e892bfacca18f05faa1336>`_
- Merge pull request #216 from fedora-infra/feature/version-in-footer `3c3963257 <https://github.com/fedora-infra/tahrir/commit/3c396325789c4439538680c57d94801f0c97955c>`_
- Generate foaf with rdf lib. `67ef469c9 <https://github.com/fedora-infra/tahrir/commit/67ef469c92b6c541eaf26d737875588fa6a759c5>`_
- I forgot a file. `0bb5c83b3 <https://github.com/fedora-infra/tahrir/commit/0bb5c83b3944ddd1be2fe5506bfa89f9fba5917c>`_
- Merge pull request #227 from fedora-infra/feature/rdf-external `4fc35c5de <https://github.com/fedora-infra/tahrir/commit/4fc35c5de96981fb35f4cc4888ea6586b41b90aa>`_
- Fix the display of the leaderboard for user having no badges `4a11845a0 <https://github.com/fedora-infra/tahrir/commit/4a11845a0573ce4d6f9d9f27461fe212845b4edc>`_
- Call the new note_login api function to track logins. `1387dd407 <https://github.com/fedora-infra/tahrir/commit/1387dd407c3e000e719e251e9ed80cdc4196ac8d>`_
- Note user logins. `b987501c1 <https://github.com/fedora-infra/tahrir/commit/b987501c1e3efeff4cd54b31e1d46c53373e04c2>`_
- Merge pull request #231 from fedora-infra/feature/leaderboard_ranking `ccf364159 <https://github.com/fedora-infra/tahrir/commit/ccf364159cd9fcbea9a66f405a4151fea439f393>`_
- Merge pull request #232 from fedora-infra/feature/login-tracking `09f605d6a <https://github.com/fedora-infra/tahrir/commit/09f605d6a3159b6dee7e335a28feabe2f6e40c68>`_
- hides leaderboard when there's no users on database `fba7440f0 <https://github.com/fedora-infra/tahrir/commit/fba7440f054f8e3ba1f4caa5d4139c03adbcf5e2>`_
- Merge pull request #230 from cpallares/develop `cc0f5f654 <https://github.com/fedora-infra/tahrir/commit/cc0f5f65483310865cf68b513886fd0c44800185>`_
- Add different report pages `8a967d8fc <https://github.com/fedora-infra/tahrir/commit/8a967d8fcbcc714787ff9e44ab9af43cee45fe69>`_
- Merge branch 'develop' into edit-profile `6b3a5d528 <https://github.com/fedora-infra/tahrir/commit/6b3a5d528ec3a91681a950a8d22ce9b80bb2535c>`_
- Fix the "day" report. `d78ed0c3f <https://github.com/fedora-infra/tahrir/commit/d78ed0c3fd9e0411fba35328c6629cea5cad05aa>`_
- Change up presentation for the reports. `c6d61e8ac <https://github.com/fedora-infra/tahrir/commit/c6d61e8ac10b36101dfb9608efb0a57ada3ff1d5>`_
- Remove unnecessary leaderboard queries. `686cf6ea7 <https://github.com/fedora-infra/tahrir/commit/686cf6ea72fdfc2721de6b028054fe78e489e886>`_
- Update a comment. `17d73bb93 <https://github.com/fedora-infra/tahrir/commit/17d73bb93e70053c77e0c1583fa5300ea0a924e5>`_
- Edit profile view works. `335c7bfa4 <https://github.com/fedora-infra/tahrir/commit/335c7bfa45382e58e30d3dc152bc68fd89bdc255>`_
- Replace "change nickname" on user view with "edit profile" button. `5a4f4153e <https://github.com/fedora-infra/tahrir/commit/5a4f4153ea6c7b0011bac5fa4921f9bc5ce88188>`_
- Re-work from scratch the way we get the date from a year and a week number `6ab12dbc5 <https://github.com/fedora-infra/tahrir/commit/6ab12dbc554a6c096386cf729d74f1598dc5d56d>`_
- Merge branch 'feature/reports' of github.com:fedora-infra/tahrir into feature/reports `0fcf118aa <https://github.com/fedora-infra/tahrir/commit/0fcf118aae13815639d0c65fbdf1bebe16275579>`_
- Small CSS fix that should make form/input and button look the same `f19bbcb38 <https://github.com/fedora-infra/tahrir/commit/f19bbcb385782aaad0b308a99f6e8ddf06fff21d>`_
- Enhance report description. `5e3d0b5b0 <https://github.com/fedora-infra/tahrir/commit/5e3d0b5b0309ceb05f2ebf0d41d9542839faad30>`_
- Link to reports from the explore page. `a56c3fc98 <https://github.com/fedora-infra/tahrir/commit/a56c3fc981ab08cb612fa9c6a0180adef54f8eea>`_
- Remove changenick stuff from the old user view. `18a9c672d <https://github.com/fedora-infra/tahrir/commit/18a9c672db31db22207188f1e4b1d35985acc44a>`_
- Remove unused activation stuff from the new user_edit view. `a0af95a27 <https://github.com/fedora-infra/tahrir/commit/a0af95a271ca57c1ae71989ae1998c9b4621aaba>`_
- Whoops.. remove a forgotten reference. `8b8dfdf56 <https://github.com/fedora-infra/tahrir/commit/8b8dfdf564d0c8c3ec8e35565f2b1523e71174e4>`_
- Simplify redirect code at the end of editing. `07bf77a14 <https://github.com/fedora-infra/tahrir/commit/07bf77a14e1363e6d198ecdc73fb5028ad7215f7>`_
- Don't display changenick field if it is disallowed. `74c9fe8d3 <https://github.com/fedora-infra/tahrir/commit/74c9fe8d3bed7a60d28a23c5dfec02d73a8dc9dc>`_
- Some HTML5 validators for make benefit of glorious tubes. `91fd83fc2 <https://github.com/fedora-infra/tahrir/commit/91fd83fc25da1c8ba32c844b4c484cee6cc16b84>`_
- additional plus for most honourable tubes `d842dabf7 <https://github.com/fedora-infra/tahrir/commit/d842dabf7fc3f3d3b1dcb587b46e9752bf9854f8>`_
- Typofix. `09f96c3eb <https://github.com/fedora-infra/tahrir/commit/09f96c3eb56317b6f57647781addb969bcc6044b>`_
- Merge pull request #234 from fedora-infra/edit-profile `f97eff66b <https://github.com/fedora-infra/tahrir/commit/f97eff66b4778acdececf482b5d6db365d59e5ba>`_
- Merge pull request #235 from fedora-infra/feature/css_fix `e1c971eec <https://github.com/fedora-infra/tahrir/commit/e1c971eecafd9d748621cf9f5cb6118f557eabfd>`_
- Add a space there to match the other code `e6d114825 <https://github.com/fedora-infra/tahrir/commit/e6d114825d8d7c992123c30454d4713c56a2a282>`_
- More rank information in the report(s). `383ce3f23 <https://github.com/fedora-infra/tahrir/commit/383ce3f2300235d059657c411d8ccbbf63b52905>`_
- Merge pull request #233 from fedora-infra/feature/reports `27b027a04 <https://github.com/fedora-infra/tahrir/commit/27b027a04d7151812378f348d840fddfd4ea5bda>`_
- 0.4.2 `e5aaeb963 <https://github.com/fedora-infra/tahrir/commit/e5aaeb963a0a24e11f24492f85316e0b30ad818f>`_

0.4.1
-----

- see a every badge => see every badge `2f41ec420 <https://github.com/fedora-infra/tahrir/commit/2f41ec420f793461e994a260ad7c2fce03d4405d>`_
- Use cached db rank for leaderboard views. `c423b93d8 <https://github.com/fedora-infra/tahrir/commit/c423b93d87f81efe8b01fd2096ebf508ad28204d>`_
- Optimize the frontpage to not query the entire db.  Fixes #187. `d7461d042 <https://github.com/fedora-infra/tahrir/commit/d7461d042f49bbac4915e43a34f6a5cac33ed400>`_
- Add link tags for badge and user to json and rss. `6a2e56525 <https://github.com/fedora-infra/tahrir/commit/6a2e565250c18f827c9bbb6a87f73064dd164572>`_
- Space after the %. `c60d2a921 <https://github.com/fedora-infra/tahrir/commit/c60d2a921383e78b90f1502df5c1d31aece3d49f>`_
- Merge pull request #213 from fedora-infra/feature/link-tags `b1fcc2bbd <https://github.com/fedora-infra/tahrir/commit/b1fcc2bbd9245b7822a59fe1b9549456026e9fad>`_
- Merge pull request #212 from fedora-infra/feature/optimized-frontpage `5286a0fab <https://github.com/fedora-infra/tahrir/commit/5286a0fababe7106cf91980f2d8f6e24b100f9b6>`_
- Avoid n+1 queries. `cf00d857b <https://github.com/fedora-infra/tahrir/commit/cf00d857b13044fe0f893839559ff7c0bd1b79c4>`_
- User page sped up from 6.5 seconds to 0.09 seconds. `8f7b3ccc8 <https://github.com/fedora-infra/tahrir/commit/8f7b3ccc870f9439632727750fcb0ed64d6529a0>`_
- Some small optimizations to user/json. `fe22453db <https://github.com/fedora-infra/tahrir/commit/fe22453db45215cd29d90da1d2a08c1e755475d9>`_
- Optimize badge json. `e7715af7b <https://github.com/fedora-infra/tahrir/commit/e7715af7b45ef526945ea232445bde09722f847b>`_
- Merge pull request #211 from fedora-infra/feature/use-cached-db-rank `09fe61b42 <https://github.com/fedora-infra/tahrir/commit/09fe61b4232da82e97b989c2c9d9b647f693d781>`_

0.4.0
-----

- Small CSS changes on /about. `f752df4dc <https://github.com/fedora-infra/tahrir/commit/f752df4dcaa57901bb86ae839c7a3a4db6d2715c>`_
- Merge pull request #188 from fedora-infra/css-hax `008e84f7c <https://github.com/fedora-infra/tahrir/commit/008e84f7ce7b8274173ccba398c94129fd05db42>`_
- Consistent user links.  Fixes #177. `5b85b51b3 <https://github.com/fedora-infra/tahrir/commit/5b85b51b34fbcece9cdeb436d1f72b6c192712d8>`_
- Merge pull request #189 from fedora-infra/feature/consistent-user-links `0090a9c59 <https://github.com/fedora-infra/tahrir/commit/0090a9c59114cc51da2966e662d9026285a505ad>`_
- Add a section to the docs on embedding badge widgets. `4f478e1d7 <https://github.com/fedora-infra/tahrir/commit/4f478e1d73ce1e920e3ea3d0babf30868879181a>`_
- losslessly compressed the error message PNGs `320c1edb3 <https://github.com/fedora-infra/tahrir/commit/320c1edb3ae7297a0625420c8e4e3fe62daef7e6>`_
- Merge pull request #195 from ryanlerch/develop `e5cce3bae <https://github.com/fedora-infra/tahrir/commit/e5cce3baef274532a55ed000872b07717a5279e7>`_
- No need for min height anymore now that @CodeBlock clearfixed everything with css-hax. `2b0c47907 <https://github.com/fedora-infra/tahrir/commit/2b0c47907c20bc59f2141cd04aff105e1a75d618>`_
- Merge branch 'develop' of github.com:fedora-infra/tahrir into develop `e13bae6e0 <https://github.com/fedora-infra/tahrir/commit/e13bae6e0160f928085282f229baca1057bb93d9>`_
- Nuke redundant tooltip `599b6b0db <https://github.com/fedora-infra/tahrir/commit/599b6b0dbde72d13d28a4a116e47a257bf049290>`_
- Fix tooltip unrounded corner position on user page `086760c3d <https://github.com/fedora-infra/tahrir/commit/086760c3d88d197d6ccbb4330da3a2ae14c75fb3>`_
- truncate at 2 decimal places instead of a lot. `7037878e4 <https://github.com/fedora-infra/tahrir/commit/7037878e45da795126b0a8ddfb6258f78c95645d>`_
- Merge pull request #196 from fedora-infra/more-css-hax `81209bc78 <https://github.com/fedora-infra/tahrir/commit/81209bc78cb27d594e055154e5e0dee0465b6317>`_
- make it easy to see if you have a badge from the badge page `9478de805 <https://github.com/fedora-infra/tahrir/commit/9478de8050b16f3a944bd37b48ec837141fd193f>`_
- Merge pull request #197 from fedora-infra/add-user-status-to-badge-page `fb4359ec0 <https://github.com/fedora-infra/tahrir/commit/fb4359ec0912cd33fd3bb4a95a488849a80440b6>`_
- Lots of template reformatting/untabifying. No visual changes. `16909fd0b <https://github.com/fedora-infra/tahrir/commit/16909fd0bc6d1cf9f7fb84b0607c8388e0e5661d>`_
- Merge branch 'develop' into tabs-and-spaces `b5c08548c <https://github.com/fedora-infra/tahrir/commit/b5c08548cea3b25628b356d582c6570befdf006d>`_
- undo my accidental development.ini commit. `ff105120c <https://github.com/fedora-infra/tahrir/commit/ff105120c22db1ca7bf7923171e50642f83215cc>`_
- merge conflicts are horrible things `59cfa24a8 <https://github.com/fedora-infra/tahrir/commit/59cfa24a8952f222144f899b1f560390ab024f0a>`_
- Merge pull request #198 from fedora-infra/tabs-and-spaces `2290875f2 <https://github.com/fedora-infra/tahrir/commit/2290875f20876e6216c064ed4cc6c5411272590a>`_
- Remove spurious import. `b5e6b47d8 <https://github.com/fedora-infra/tahrir/commit/b5e6b47d8b5d82f1440863a71eadeedf1148a8fb>`_
- (fedmsg) Let tahrir-api do all the talking. `cf2d4270b <https://github.com/fedora-infra/tahrir/commit/cf2d4270becff6b3fa9668543a8cfa9672660b8f>`_
- Add a per-user RSS feed. `daba207d4 <https://github.com/fedora-infra/tahrir/commit/daba207d4eb5d6590e079fe30e1fca5733ddfbc1>`_
- Add a link to the user RSS from their profile. `fa92d208f <https://github.com/fedora-infra/tahrir/commit/fa92d208fe11787d3a2cd1e5f2efff7d9e24b0af>`_
- Per-badge rss feed. `7cc5de48d <https://github.com/fedora-infra/tahrir/commit/7cc5de48d997208a09d3a4602563309b8ad87773>`_
- Add some other nice info to the RSS feeds. `6a4b8290c <https://github.com/fedora-infra/tahrir/commit/6a4b8290c67d0a9949b023edd32e366aa659e6f2>`_
- User links, yet more consistent. `8e334a986 <https://github.com/fedora-infra/tahrir/commit/8e334a9868aedd970dbf1b520abd913a03ec47ed>`_
- Merge pull request #194 from fedora-infra/feature/embedding-instructions `c3229cf4f <https://github.com/fedora-infra/tahrir/commit/c3229cf4f5c97bb77770a17d4a535b6538e746b8>`_
- Merge pull request #201 from fedora-infra/feature/still-more-consistent-user-links `5f301a543 <https://github.com/fedora-infra/tahrir/commit/5f301a543854f1b4e4690c29b81a2582e6e7a685>`_
- Still more consistent, at @CodeBlock's suggestion. `fba8670f7 <https://github.com/fedora-infra/tahrir/commit/fba8670f77d1172aaf32186a6715ecb86ccdea8e>`_
- Break after the <p>. `9a9ef1db8 <https://github.com/fedora-infra/tahrir/commit/9a9ef1db888b34ff8b89e720bee0c321927fd91b>`_
- Merge pull request #200 from fedora-infra/feature/rss-feeds `3aa790a0c <https://github.com/fedora-infra/tahrir/commit/3aa790a0c3b93bfd061409c39f13a4c87d8b4acf>`_
- Move development.ini to development.ini, and gitignore development.ini. `2e5ebe6fc <https://github.com/fedora-infra/tahrir/commit/2e5ebe6fc47a352c457e3b6b1c4c222aa885c1a5>`_
- Merge pull request #205 from fedora-infra/development-ini-example `3006753a6 <https://github.com/fedora-infra/tahrir/commit/3006753a63338b04ed6380deee70209babe5eb9d>`_
- Revive the tahrir.use_fedmsg configuration option. `967d16248 <https://github.com/fedora-infra/tahrir/commit/967d16248d46e3eddf3b1d40d2f6b1348dd6a03e>`_
- Merge pull request #199 from fedora-infra/feature/publish-message-on-rank-change `cda5c5777 <https://github.com/fedora-infra/tahrir/commit/cda5c5777cd3f667d2d97f17291e8b6019af50e5>`_

0.3.5
-----

- Ship those .rst docs. `884dd2327 <https://github.com/fedora-infra/tahrir/commit/884dd232790b99a64419d7d886cd542fad414ee2>`_
- Clearfix ALL THE THINGS `013480bee <https://github.com/fedora-infra/tahrir/commit/013480bee69d8bb1f3f94e3a39849d580d6b095e>`_
- Fix duplicate links in about.rst. `dc9919f0a <https://github.com/fedora-infra/tahrir/commit/dc9919f0a1ea0760dbf4654a84b83f74cebc73e2>`_
- Merge branch 'develop' of github.com:fedora-infra/tahrir into develop `9a3f2f895 <https://github.com/fedora-infra/tahrir/commit/9a3f2f895e6d4177580552c04ca026677058b68a>`_
- Pass auth_principals to template from about() `271dc681c <https://github.com/fedora-infra/tahrir/commit/271dc681c243e8bdff9caf9b819e16c757a05056>`_
- CSS tweaks for the /about page. `751e5d6b5 <https://github.com/fedora-infra/tahrir/commit/751e5d6b59827b33cf5c78d5e17d31340097e3ff>`_

0.3.4
-----

- adjusted .pretty-button class `a0fa1cf57 <https://github.com/fedora-infra/tahrir/commit/a0fa1cf57b8ca93923d2fa4b685dc77d2597bbfb>`_
- protocol agnostic cdn for jquery and openbadges `ae3362c7a <https://github.com/fedora-infra/tahrir/commit/ae3362c7a038815ac80f90f904d2b5884b24c21a>`_
- adjusted markup from anchor tag to button tag `027f3e710 <https://github.com/fedora-infra/tahrir/commit/027f3e71041f37b947557740db06b68d4bbc9875>`_
- Render "about" page from .rst. `bbb72d055 <https://github.com/fedora-infra/tahrir/commit/bbb72d0553dcd851a50680ee87733639926f8934>`_
- Group by all fields, not just one, to make pgsql happy. `0575c0ec2 <https://github.com/fedora-infra/tahrir/commit/0575c0ec2fabb65cce3dec3be7296c8138d75902>`_
- Fix fatal on /leaderboard/json with no username `64b68c8df <https://github.com/fedora-infra/tahrir/commit/64b68c8dfad55b01f29218febde5dc08303ed00b>`_
- Allow the htmldocs dir to be configurable. `181abbb6e <https://github.com/fedora-infra/tahrir/commit/181abbb6e1a6f24b860935748579aafb9052a612>`_
- Put a shadow around that. `16442bc99 <https://github.com/fedora-infra/tahrir/commit/16442bc9908a93b4e49738bbaeb16654f4c2d7c9>`_
- Throw in a fedora-specific about page. `8c46ad4da <https://github.com/fedora-infra/tahrir/commit/8c46ad4da833e9cbf6f924b06dc7315005985c7a>`_
- Merge pull request #180 from calweb/ui-fixes `7c2e4053d <https://github.com/fedora-infra/tahrir/commit/7c2e4053d1125de0c3fc11bb4002cea3171bb9e5>`_
- Some css for that about page. `0feb7b635 <https://github.com/fedora-infra/tahrir/commit/0feb7b6355aae6f3550db3e947c92b4bb38f1d48>`_
- Drop that period. `c46f79f5f <https://github.com/fedora-infra/tahrir/commit/c46f79f5fcf54c7e4cee2dee093018d395f460b7>`_
- Added new image for the default avatar. `c82c4c700 <https://github.com/fedora-infra/tahrir/commit/c82c4c700ea72aa7a6269dbd4c158490edee4b1b>`_
- Merge pull request #182 from ryanlerch/develop `ea03be6b5 <https://github.com/fedora-infra/tahrir/commit/ea03be6b59006fd7e7f520c6d0eaf4853b48a65c>`_
- Inject tw2's jquery to avoid cdn. `79c2bab28 <https://github.com/fedora-infra/tahrir/commit/79c2bab28ca84fa2eab6f9ba05cefbf1d2a51cec>`_
- Remove those secret defaults from development.ini.  I forgot they were supposed to be in secret.ini. `116c9c688 <https://github.com/fedora-infra/tahrir/commit/116c9c688dcb1b4ca995d0ac77013e22ed4c8209>`_
- Updated the images for the 404 and 500 errors. and attempted to make them kinda funny. `e3c3eeb62 <https://github.com/fedora-infra/tahrir/commit/e3c3eeb62473d478faa2b884e87b038428690d0e>`_
- Merge pull request #183 from ryanlerch/develop `9a57e71ad <https://github.com/fedora-infra/tahrir/commit/9a57e71ad9a4b90ce7e0a001f008a6346039fd40>`_
- major rewrite of about.rst `71b54738d <https://github.com/fedora-infra/tahrir/commit/71b54738d17147c1eb1904e35fac23ebe0b4bb0f>`_
- drop a redundant sentence `1a4afdaf2 <https://github.com/fedora-infra/tahrir/commit/1a4afdaf218ebffc99d5de9f0936ada23d8c1e0c>`_
- LINK ALL THE THINGS `9aaefa83c <https://github.com/fedora-infra/tahrir/commit/9aaefa83c121207afc7549cc226f9a1f447f2ba1>`_
- LINKIFY ALL THE THINGS MORE `459d6ec45 <https://github.com/fedora-infra/tahrir/commit/459d6ec45cc34b62f8c393616280a426bcea781a>`_
- okay, okay, these are the last two links, I promise `bac35d5b8 <https://github.com/fedora-infra/tahrir/commit/bac35d5b877485f20cddfd0896142309cb439747>`_
- Merge pull request #184 from AdamWill/feature/faq `bfca76386 <https://github.com/fedora-infra/tahrir/commit/bfca7638628e2ed8882b414270f687a92d269239>`_
- Merge branch 'feature/faq' into develop `73b949504 <https://github.com/fedora-infra/tahrir/commit/73b94950463a076dceb458a5d118c136dc883c57>`_
- Use ssl to get avatars. `dc31442bc <https://github.com/fedora-infra/tahrir/commit/dc31442bc959cb763150be87d4692bf64f5f1810>`_
- Show the issuer name, not the DB id. `45189d78f <https://github.com/fedora-infra/tahrir/commit/45189d78fa4efd8abc1c60b7439f5a87596e93e6>`_
- Use the new badger avatar.  Thanks @ryanlerch! `52694a553 <https://github.com/fedora-infra/tahrir/commit/52694a553bca1cf044d904482041be18f35681a3>`_
- Ship the fedora sitedocs with the next tarball. `5e5175728 <https://github.com/fedora-infra/tahrir/commit/5e51757284e7cba7c92476087b65b1583d70cebd>`_
- Make the footer configurable and link to the badges trac instance.  Fixes #172. `a1a6c6e45 <https://github.com/fedora-infra/tahrir/commit/a1a6c6e45c3651c5e115cf05d9ed64a1ec2b622b>`_
- Just to simplify. `e2abb21c7 <https://github.com/fedora-infra/tahrir/commit/e2abb21c7f607eda1aaac5074bfff089bb9d3409>`_
- First pass at social media links. `572e710bd <https://github.com/fedora-infra/tahrir/commit/572e710bdd0513a0f57ebf90cae54d4754a03255>`_
- Only load third-party javascript if the user decides to. `656721651 <https://github.com/fedora-infra/tahrir/commit/6567216510743cdfd6d87cf5a01d45663333fa87>`_
- Only display social media links on your own profile. `2f4a8977d <https://github.com/fedora-infra/tahrir/commit/2f4a8977da3663d79c93be448b0af227314994b0>`_
- Unicode, right? `1121de612 <https://github.com/fedora-infra/tahrir/commit/1121de6128d4d0bc66242b7d35580c957239d864>`_
- And emoji, for completeness. `75bd5e0d1 <https://github.com/fedora-infra/tahrir/commit/75bd5e0d1a1b0fc2fd9c06de4097c3d8b2dd3852>`_
- Initial try at FOAF stuff. `0ef33a906 <https://github.com/fedora-infra/tahrir/commit/0ef33a9067a8974b5eb3f4ae6bc90538e38a4806>`_
- Add openid linkage to foaf stuff. `14a0a944c <https://github.com/fedora-infra/tahrir/commit/14a0a944c211bbbaa105328f81e86822d5b1a101>`_
- We don't need these anymore because its the future. `9f1f4d3c7 <https://github.com/fedora-infra/tahrir/commit/9f1f4d3c79751b626200201366f616b4898af345>`_
- Unicode safety is best. `fe1f83010 <https://github.com/fedora-infra/tahrir/commit/fe1f83010c5a5dfbaac850169c9a9049a502077a>`_
- Merge pull request #186 from fedora-infra/feature/foaf `43553a90b <https://github.com/fedora-infra/tahrir/commit/43553a90b1179df5bf89e6797cb62fd4bc09f6c2>`_
- Merge pull request #185 from fedora-infra/feature/social-media `2e6379a44 <https://github.com/fedora-infra/tahrir/commit/2e6379a4450cbbf482611d16fd63838d441b89d6>`_
- Template tweaks. `76a238629 <https://github.com/fedora-infra/tahrir/commit/76a238629de0d9c07bba8dece6b47f41c511bd31>`_
- Force columns to be a certain min height to accomodate the metadata on the user page. `dffa09ced <https://github.com/fedora-infra/tahrir/commit/dffa09ced01299d8030341b5888c8867b662232e>`_
- Hide nick inside as an rdf attribute. `888dee018 <https://github.com/fedora-infra/tahrir/commit/888dee01886924cf0362f475f092f877a3df2fc5>`_
- Hide social div inside the conditional. `08912eb6d <https://github.com/fedora-infra/tahrir/commit/08912eb6d98cb28cd2c5e8f9f7136138505fa761>`_
- Modernity in alchemy. `1d242d195 <https://github.com/fedora-infra/tahrir/commit/1d242d195622e5d5c9869f243d42df86ffd86696>`_

0.3.3
-----

- Badge Holder list on badge view closes #127. `3c3f3b03f <https://github.com/fedora-infra/tahrir/commit/3c3f3b03fdc5a78e2ec09a9a792884e14e3a35cb>`_
- Displaying user rank on user profile view closes #157. `40f575ffc <https://github.com/fedora-infra/tahrir/commit/40f575ffc0bfaea26297a2b689362c8b489bcb7a>`_
- Lazily load "person" for leaderboard for a speed boost. `cf968a0a8 <https://github.com/fedora-infra/tahrir/commit/cf968a0a879a8ce8703ee1ab35c6fa124d24cfba>`_
- Merge pull request #158 from fedora-infra/leaderboard_slowness `f5da0b84c <https://github.com/fedora-infra/tahrir/commit/f5da0b84ca971d959d071fb46e8fc1ac27e9a9e3>`_
- Fix logic for showing rank in JSON lb endpoint. `cc7a10430 <https://github.com/fedora-infra/tahrir/commit/cc7a104304e7b1551487cf9f243463d3213e14a0>`_
- Fix leaderboard/username/json... Sigh. `524e1335a <https://github.com/fedora-infra/tahrir/commit/524e1335a1009369e12944c0e36bd6aff0e17b9b>`_
- Merge branch 'develop' into leaderboard_slowness `f37f96287 <https://github.com/fedora-infra/tahrir/commit/f37f962879940016d503681df0ba7bf886b456e9>`_
- Merge pull request #159 from fedora-infra/leaderboard_slowness `2beabf0d2 <https://github.com/fedora-infra/tahrir/commit/2beabf0d2430d8334ad1d902e6ceb9eda436d2be>`_
- Undo it all for now, this is broken. Sigh. `43136cd95 <https://github.com/fedora-infra/tahrir/commit/43136cd951d2268920f959df2bd3622dc26f125c>`_
- Fix JSON lb endpoint yet again. `011b786ef <https://github.com/fedora-infra/tahrir/commit/011b786ef2f7a26fc2d39c875abb61a764cc8a5b>`_
- Allow a default issuer for the badge builder. `b46d1eb13 <https://github.com/fedora-infra/tahrir/commit/b46d1eb133b276c33eafb6a57cd339b38f3f15cd>`_
- Give a 404 for missing users instead of a 500.  Fixes #162. `f353c47e6 <https://github.com/fedora-infra/tahrir/commit/f353c47e6141968bd81920f2fa6e2474d4434002>`_
- Redo how /leaderboard works to make it faster. `83e02cfb0 <https://github.com/fedora-infra/tahrir/commit/83e02cfb0da58566791dfcc6d697d2898e370ca2>`_
- Wrap lb json endpoint in a "leaderboard" field. `11c0beb17 <https://github.com/fedora-infra/tahrir/commit/11c0beb17bc8f2f509a6675dae3670ea85a8e1a0>`_
- slightly comment how this works. `09bf94f23 <https://github.com/fedora-infra/tahrir/commit/09bf94f23cb87bd01f819140046490f1100adaa0>`_
- Merge pull request #173 from fedora-infra/lb_json `4c21e3702 <https://github.com/fedora-infra/tahrir/commit/4c21e37026ac8a5414b820b05de95f55c91367b1>`_
- Merge pull request #169 from fedora-infra/feature/default-issuer `4b298f492 <https://github.com/fedora-infra/tahrir/commit/4b298f4928444acf2e17e9ed6f77e6965faf0247>`_
- Merge pull request #170 from fedora-infra/feature/404-for-users `b8dde6af9 <https://github.com/fedora-infra/tahrir/commit/b8dde6af97e120d13db1783e9683d433285eaa5a>`_

0.3.2
-----

- Add a explore_badges view that returns all badges. `992cc9846 <https://github.com/fedora-infra/tahrir/commit/992cc984674a7bdbd3dcf6855f9ac52103cbbacc>`_
- Woah, serious mismatched header tags, there. `da36c5a40 <https://github.com/fedora-infra/tahrir/commit/da36c5a40111f26e927fb762ce292dd744297deb>`_
- Add an explore_badges template. `8b7a8df66 <https://github.com/fedora-infra/tahrir/commit/8b7a8df66efbc7c68e4f1a04c6ad26fb2d3c309e>`_
- Display all badges and 10 newest badges at /explore/badges. `0e8129747 <https://github.com/fedora-infra/tahrir/commit/0e81297476a6bed30222050e5309539e7b401cc0>`_
- explore_badges view displays all badges and 20 newest badges. `9b5a48f33 <https://github.com/fedora-infra/tahrir/commit/9b5a48f335752ff01096b8ed107b0636e1fc43ac>`_
- A link to the explore_badges view on the explore view closes #150. `3ebaad567 <https://github.com/fedora-infra/tahrir/commit/3ebaad567abe880f15466a39708ca27a50c08e23>`_
- Better search results, plus @lmacken's suggestion for feedback when no results are found. `1cdf47042 <https://github.com/fedora-infra/tahrir/commit/1cdf47042ad7760b8e9ec7f4df53ea2f0b28d588>`_

0.3.1
-----

- Never again. `8edf587ac <https://github.com/fedora-infra/tahrir/commit/8edf587acc2dddc933ae98ba3986e5ff075d8338>`_
- Fix 500 with postgres in badge search. `78eb0b10a <https://github.com/fedora-infra/tahrir/commit/78eb0b10ade6aa778395ba50b7c79c653d9f522e>`_
- Alter "was awarded" snippet in assertion app to match recent index page change. `0a366e97e <https://github.com/fedora-infra/tahrir/commit/0a366e97e3a4d02e6c2253f1032dc8a5c359d457>`_
- Consistent user links `e8df90e9c <https://github.com/fedora-infra/tahrir/commit/e8df90e9cae59fc5de0e4935b49fe3bb60b3ec52>`_
- Fix badge links in the search results. `15f08c9fa <https://github.com/fedora-infra/tahrir/commit/15f08c9fa0c61d456a794bd64eeb82d48336e560>`_
- add leaderboard json endpoint and make user json generator re-usable. `3c8e614d3 <https://github.com/fedora-infra/tahrir/commit/3c8e614d30b57268db544df12831e8a7c537653e>`_
- make leaderboard respect (hide) opted-out people. `9e2e156d3 <https://github.com/fedora-infra/tahrir/commit/9e2e156d3b32c844f7528aee87a89a987c180492>`_
- Merge pull request #146 from fedora-infra/leaderboard_optout `9b02c344c <https://github.com/fedora-infra/tahrir/commit/9b02c344c8c692b22f75ffef1da8f7baea7e25ae>`_
- Merge branch 'leaderboard_optout' into leaderboard_json `7b0dc2c54 <https://github.com/fedora-infra/tahrir/commit/7b0dc2c5497f9877b0b7c32bacbda873e0bb5e58>`_
- respect opt-out in the json endpoint too `b951bf3ef <https://github.com/fedora-infra/tahrir/commit/b951bf3efdf5585c67a31d172464eadd2a7f64d6>`_
- limit the JSON leaderboard endpoint to 25 users, like the main endpoint `752b4d7a6 <https://github.com/fedora-infra/tahrir/commit/752b4d7a66b81b70808a4144fdedfd8e86c40a5d>`_
- Just some starting docs stuff from yesterday, copied from readme. Moar improvements later. `870c3fdfa <https://github.com/fedora-infra/tahrir/commit/870c3fdfa034d84752f16db6eaea392474dae2be>`_
- Merge pull request #144 from fedora-infra/feature/consistent-user-links `501dada08 <https://github.com/fedora-infra/tahrir/commit/501dada0805b5c3f0cd96a1c388e906275698751>`_
- Merge pull request #145 from fedora-infra/feature/safe-search-result-badge-links `ce43ccc99 <https://github.com/fedora-infra/tahrir/commit/ce43ccc995b182c005c89d17e29161080a4526de>`_
- Merge pull request #147 from fedora-infra/leaderboard_json `31e9d6148 <https://github.com/fedora-infra/tahrir/commit/31e9d61489b3d8a43c8001ffa55ba460c54287d3>`_
- Add link to user JSON from user profile view. `67f3cb624 <https://github.com/fedora-infra/tahrir/commit/67f3cb6242317e7d34728348869a30f1ef02963b>`_
- Introduce user-specific rank JSON endpoint. `801c3f40a <https://github.com/fedora-infra/tahrir/commit/801c3f40a09f41837cbe373f7e7f830725111e56>`_
- Merge pull request #149 from fedora-infra/leaderboard_json `692c8542f <https://github.com/fedora-infra/tahrir/commit/692c8542f87f69731549bde1b4aa7d6216d41090>`_
- More docs work. `b8c2b9bf6 <https://github.com/fedora-infra/tahrir/commit/b8c2b9bf637ff814523b738c422128373c9c4d56>`_
- Few capitalization tweaks in readme. `c66a7bbfc <https://github.com/fedora-infra/tahrir/commit/c66a7bbfc40ee377a8d21c8ff38760cab67be81d>`_
- Don't restate badge name in badge statistics. `09c83da1f <https://github.com/fedora-infra/tahrir/commit/09c83da1f15855a2a2b739902943561bc418739e>`_
- Even less verbose badge statistics. `2425e09da <https://github.com/fedora-infra/tahrir/commit/2425e09dacf64d6c2b8c593a021458950939c695>`_
- Whoops, getting too excited. Messed up some HTML tag positioning. `7f5e73e23 <https://github.com/fedora-infra/tahrir/commit/7f5e73e23300c68de136d7c77c75ca272756e4c1>`_

0.3.0
-----

- Typofix. `eea88b598 <https://github.com/fedora-infra/tahrir/commit/eea88b598f0356d030b89a92a17054ec8ccdc2f2>`_
- Well, I'll be... this block got put in twice somehow. `58089b73f <https://github.com/fedora-infra/tahrir/commit/58089b73f5423cf37f2a318c47f39fb775612324>`_
- This is the start of a JSON API for /badges. `9d4acdf0b <https://github.com/fedora-infra/tahrir/commit/9d4acdf0b67beb14cf89a981a3c4ea19a1688a58>`_
- fix 404 handling `a5c05ad95 <https://github.com/fedora-infra/tahrir/commit/a5c05ad956d59d977f08d7b5dc16129925cf9426>`_
- Make the badge json stuff reusable and use it for user_json `c5391d720 <https://github.com/fedora-infra/tahrir/commit/c5391d72061fdccb2b64994f2df8728b3a6dc393>`_
- Add avatar url for @ralphbean :) `6c414160e <https://github.com/fedora-infra/tahrir/commit/6c414160e76eff05cf8c0120b8df4b19bbc0ef25>`_
- Clean up readme. For #124. `4576357f0 <https://github.com/fedora-infra/tahrir/commit/4576357f03ccfe255db97f589d2aae1fc0ea0607>`_
- Moar bolded stats on badges view. `dae824c9f <https://github.com/fedora-infra/tahrir/commit/dae824c9f853356e840ecc4c3ec7befc69f2d4c1>`_
- Add a link to production in the readme. `add537ebb <https://github.com/fedora-infra/tahrir/commit/add537ebbcf8a269319ffd2c7f13c21a96f3bda1>`_
- Merge pull request #139 from fedora-infra/badge_json `0214a69b2 <https://github.com/fedora-infra/tahrir/commit/0214a69b2bb681da635e702b931e1ccaf6ce948c>`_
- Some spacing and indentation for clarity. `039f9e9ef <https://github.com/fedora-infra/tahrir/commit/039f9e9efea188d8fd3013a0707252f6678023b3>`_
- Bolding and clarification on badge view for badges earned. `f969f53d5 <https://github.com/fedora-infra/tahrir/commit/f969f53d5925f3f86ed27404c367d332106bf52b>`_
- Fedora badge bullet. Closes #133. `27ef6de49 <https://github.com/fedora-infra/tahrir/commit/27ef6de495dbc7cea6f26c6621173667d95fed05>`_
- This may solve #140. `f6b261811 <https://github.com/fedora-infra/tahrir/commit/f6b261811a4ca28732899c8bd8fe612da15efcd8>`_
- Make it clearer who earned the badge on Latest Awards, especially for mobile users. `5e0361fc3 <https://github.com/fedora-infra/tahrir/commit/5e0361fc399d42883919ec68801ab1f01bdd459d>`_
- Admin panel clarifications. `f3f32a87e <https://github.com/fedora-infra/tahrir/commit/f3f32a87e883a0bfab430d03c35a262fcb39625d>`_
- Add a link to badge view to view badge as JSON. `9d29514d1 <https://github.com/fedora-infra/tahrir/commit/9d29514d1148fa2aaac8bd96e5304f1234441ed8>`_
- Move active invitations list above buttons on user profile view. `a1fcc324e <https://github.com/fedora-infra/tahrir/commit/a1fcc324ed8343ec8eca2f338cb9ad65d86db3fe>`_

0.2.9
-----

- Reduce ldrbd. competetors from +/- 5 to +/- 2. `91e6e5bed <https://github.com/fedora-infra/tahrir/commit/91e6e5bedc5e09767ad8585f83fd12ae5a85aa2f>`_
- Publish fedmsg messages for awarded frontend badges.  For #136. `b49b164f5 <https://github.com/fedora-infra/tahrir/commit/b49b164f531a75d3e1d837a3dd56a216cf90c4c1>`_

0.2.8
-----

- Remove trailing slashes from the domain if they exist. `8ed58c319 <https://github.com/fedora-infra/tahrir/commit/8ed58c3196f91c9cee5d97d4d0ab9850eceff0ba>`_
- Make nickname changing configurable. `32449bcb3 <https://github.com/fedora-infra/tahrir/commit/32449bcb3b68e17fe15f441ef6deecb22d983b3c>`_
- Whoops.. but "on" by default. `9703b5b40 <https://github.com/fedora-infra/tahrir/commit/9703b5b40427450471a8f080b75cc05101f8f33d>`_
- Don't display the trailing comma on the tag list on the badge view. `54e0c3643 <https://github.com/fedora-infra/tahrir/commit/54e0c3643d2584906643a81b0bf0e03976d8c1fd>`_

0.2.7
-----

- Modernize apache config. `044e5d605 <https://github.com/fedora-infra/tahrir/commit/044e5d605bc01fdc8ac1cc0219f092b49cd3ccf4>`_
- 0.1.9 `8b5288ec5 <https://github.com/fedora-infra/tahrir/commit/8b5288ec5d563c49fde54265b879cf97a37aa5cb>`_
- Basic websocket injection. `da92f7e26 <https://github.com/fedora-infra/tahrir/commit/da92f7e26405763769a3bddb6ddbda1a178d4c9a>`_
- Inject a widget to handle websocket callbacks. `9eee6fb5d <https://github.com/fedora-infra/tahrir/commit/9eee6fb5dad5b08a104e0c4c6accd77de8469117>`_
- Listen to staging. `cbb8bc848 <https://github.com/fedora-infra/tahrir/commit/cbb8bc84870b81891c6aa8e5205a1c441845c440>`_
- Restrict the topic we listen on. `076885cc6 <https://github.com/fedora-infra/tahrir/commit/076885cc67210f8f3e07c9a454790d8cc61ae2a0>`_
- Give the latest awards' wrapper an id for manipulation. `467a2b29d <https://github.com/fedora-infra/tahrir/commit/467a2b29d7338816b9850dc36eb275d3a11be977>`_
- Use that secure socket layer, friends. `f0c67abe0 <https://github.com/fedora-infra/tahrir/commit/f0c67abe0263e22d188ec71080edf44541c24a2b>`_
- Requires a particular version of moksha.wsgi. `c3630c9bd <https://github.com/fedora-infra/tahrir/commit/c3630c9bd13d9f1ec360b0ebdecc0497d98eefea>`_
- Make the websocket topic configurable. `60c084815 <https://github.com/fedora-infra/tahrir/commit/60c084815886f78b07651702abe5ea27743cae2c>`_
- Make a queriable assertion widget. `1734706a8 <https://github.com/fedora-infra/tahrir/commit/1734706a87b685c0ae9807f64983b6469e0bc756>`_
- Get websocket DOM manipulation on lock. `b9129f844 <https://github.com/fedora-infra/tahrir/commit/b9129f84436cf5511d3255603cfc119a32dca5fb>`_
- Merge branch 'feature/websockets' into develop `3b7881ec4 <https://github.com/fedora-infra/tahrir/commit/3b7881ec4acd8e34789c0ff7cd0092e76ed5071a>`_
- Make websocket injection configurable. `fcc03184b <https://github.com/fedora-infra/tahrir/commit/fcc03184b2e582c99c12dfb4262c80ab0edc2116>`_
- 0.2.4 `24dbfedcf <https://github.com/fedora-infra/tahrir/commit/24dbfedcfb30f74d2caf3a15eeae4dbbaba32108>`_
- Add a requirements.txt file for use with RTFD. `b580082f2 <https://github.com/fedora-infra/tahrir/commit/b580082f21a64106b154c45738bfe4e64aa43bc0>`_
- Start of tags view. Need to finish badges-from-tags branch in API. `8415fa29b <https://github.com/fedora-infra/tahrir/commit/8415fa29b51a3479b1705863b0d7957ccefb1dff>`_
- Set websockets to true by default. `93d14b7ce <https://github.com/fedora-infra/tahrir/commit/93d14b7ceae8f0cdbbc55b2698ebe54afe7d0652>`_
- Singular, not plural. `8d0288a5e <https://github.com/fedora-infra/tahrir/commit/8d0288a5e6211b159c0b8658dae59d97f1906bc0>`_
- With websockets, we can actually hit this codepath now. `d63276c82 <https://github.com/fedora-infra/tahrir/commit/d63276c82601499b09fb686430634c7402dec90c>`_
- Shorten some stuff in the Latest Awards column to avoid uneven col lens. `106890d22 <https://github.com/fedora-infra/tahrir/commit/106890d22811f0a1df508427a5729335ae06751b>`_
- Remove dateutil from setup.py for now. `814ef12d1 <https://github.com/fedora-infra/tahrir/commit/814ef12d19c6d0d07ad7d768feacce6784f7d399>`_
- Apparently, it's dateutils on the cheeseshop, but imported as dateutil... `b70321dc0 <https://github.com/fedora-infra/tahrir/commit/b70321dc0db3c2ca1a23b9ea6c754c07d90a64a6>`_
- Hell yeah, tags are working. Will finish proper implementation of view soon. `b5e3f9c2a <https://github.com/fedora-infra/tahrir/commit/b5e3f9c2aa033077777556720ff68388fa000a1d>`_
- Better listing and feedback. `44f575300 <https://github.com/fedora-infra/tahrir/commit/44f575300f62ef2994546e9d9d27d7c3b15d77e6>`_
- Start implementing tag view on Explore page. `dd33ae43f <https://github.com/fedora-infra/tahrir/commit/dd33ae43f906a01843b1b71a41c2583a16e8f329>`_
- Colspan 2 for search rows on Explore view. `7fcd989c2 <https://github.com/fedora-infra/tahrir/commit/7fcd989c268be2b4dbe5a7609216c027a5a965a4>`_
- Tag view /{match}/any is working, but not /{match}/all. `a449ec232 <https://github.com/fedora-infra/tahrir/commit/a449ec2327326275e2db2e636ac6ce623ebf3c6b>`_
- Display Deactivate/Reactivate account button based on Person.opt_in. `e27a03872 <https://github.com/fedora-infra/tahrir/commit/e27a03872e0c5f3c8089ca4bc2a8115d5db6a922>`_
- Improve buttons on user view. `f580466a0 <https://github.com/fedora-infra/tahrir/commit/f580466a093f7309dd53e7348434a14c4383d301>`_
- Profile button allows user to toggle opt-in mechanism. `2774b7ba4 <https://github.com/fedora-infra/tahrir/commit/2774b7ba4b5d3245ac62a77077f08336e3b2924a>`_
- Deactivated peeps don't show up in Person search. `eefe06bf7 <https://github.com/fedora-infra/tahrir/commit/eefe06bf71699d5a404afd61eb8f74d87d57813b>`_
- Deactivated users don't show up in Random People. `3db58a057 <https://github.com/fedora-infra/tahrir/commit/3db58a0571846a2ddfa189505e92f824cc615563>`_
- Use persons_assertions join to construct Latest Awards. `f69a98e9a <https://github.com/fedora-infra/tahrir/commit/f69a98e9a2dfe9f15d4ba22087e0cff05169031d>`_
- This is the way to go. Exclude all deactivated users from front page. `73737fc19 <https://github.com/fedora-infra/tahrir/commit/73737fc199c808e41c5dce8f4251dbad9e1c6642>`_
- Profile of a deactivated user cannot be viewed by others if opted-out. `34bd595e0 <https://github.com/fedora-infra/tahrir/commit/34bd595e056c7c7cdd3efbd330679a8e265873c3>`_
- Gotta make time denominations singular when there is only "1" `d3fd28aa6 <https://github.com/fedora-infra/tahrir/commit/d3fd28aa673293c8ec8121e6eb28efaa793e1a70>`_
- Move logo media files from doc/ to logo/ to avoid confusion with Sphinx docs/ folder. `0621c5d92 <https://github.com/fedora-infra/tahrir/commit/0621c5d92d86f22de83c8428b5a453b377a14915>`_
- Start Sphinx documentation (quickstart-generated). `00db19d6f <https://github.com/fedora-infra/tahrir/commit/00db19d6fa738f0c4a40e9b2b0c029e1724c3e16>`_
- Add a clarifying comment. `87e224f47 <https://github.com/fedora-infra/tahrir/commit/87e224f4700fffff8965e8516189a25383445d9c>`_
- Sort user view badges by id. Fixes #120. `1fb49b124 <https://github.com/fedora-infra/tahrir/commit/1fb49b12483f0c1197452dd9851bddfe5d8e4e01>`_
- Doh. Fix #121. (500 on leaderboard view) `b15c0cade <https://github.com/fedora-infra/tahrir/commit/b15c0cade7e75692547437c35648df695e879569>`_
- Defaultliness is godliness. `d53df93bf <https://github.com/fedora-infra/tahrir/commit/d53df93bfd73e4dd37a1a9963a35365ec8a371cb>`_
- Remove some header stuff from the docs index. Will do more docs stuff after working on Flock preso. `d08202a61 <https://github.com/fedora-infra/tahrir/commit/d08202a6136169c80d194accc3ce9b004e2884ac>`_
- Make tags on badge view link to tag view. `43d10bb1a <https://github.com/fedora-infra/tahrir/commit/43d10bb1a889f6d81b487a1596ade9b1e8f1df9e>`_
- Tag view results should link via badge.id, not badge.name. `b91c6d1c8 <https://github.com/fedora-infra/tahrir/commit/b91c6d1c8f8006409b9a8db8070b0497daaa5d64>`_
- Complete proper rendering of tags list on badge view. `8b48698e0 <https://github.com/fedora-infra/tahrir/commit/8b48698e041e100161d3e8bb8cd9e645dcbb9150>`_
- 0.2.6 `ef7087fc9 <https://github.com/fedora-infra/tahrir/commit/ef7087fc998618d32c6106d45d0879b64be1a74b>`_
- Merge branch 'master' into develop `06a9d6328 <https://github.com/fedora-infra/tahrir/commit/06a9d63282220e0d5eecb4b831b485318a272e17>`_
- OK.  For reals.  Its python-dateutil. `d89eca53d <https://github.com/fedora-infra/tahrir/commit/d89eca53deda540ab652dde590b80ea3311d2040>`_
- Hack: if login fails, just try again. `d515c512e <https://github.com/fedora-infra/tahrir/commit/d515c512eba51aa96944633b56fdb68ee8a67426>`_
- Use the avatar associated with an openid, not the email. `28bfec826 <https://github.com/fedora-infra/tahrir/commit/28bfec8260c4f3b3bcd3d10f53a5bddd719aadd7>`_
- Make logging in to change your avatar super simple. `93bc04985 <https://github.com/fedora-infra/tahrir/commit/93bc04985282f3c54396762153980c1e3af2de4c>`_
- Correctly generate avatar urls for openid identifiers. `2aa33d5c7 <https://github.com/fedora-infra/tahrir/commit/2aa33d5c76a8aa2e8a90e1ffbf03fe0df21323ff>`_

0.2.6
-----

- Start of tags view. Need to finish badges-from-tags branch in API. `be0f32165 <https://github.com/fedora-infra/tahrir/commit/be0f321659ec10b24739a2ba3939bb63688a610d>`_
- Set websockets to true by default. `5e64dbc45 <https://github.com/fedora-infra/tahrir/commit/5e64dbc453c112ce273ec73204034a7f097e9cc4>`_
- Singular, not plural. `aece70a9b <https://github.com/fedora-infra/tahrir/commit/aece70a9b016080558422b59feac8a1f52b2648d>`_
- With websockets, we can actually hit this codepath now. `215b82c5f <https://github.com/fedora-infra/tahrir/commit/215b82c5fd451f57a13c1ef636c9d833ea7662e0>`_
- Shorten some stuff in the Latest Awards column to avoid uneven col lens. `dbc60189f <https://github.com/fedora-infra/tahrir/commit/dbc60189fab37240495cf820cf6a30bcb44c6388>`_
- Remove dateutil from setup.py for now. `740b055ca <https://github.com/fedora-infra/tahrir/commit/740b055ca2c6dbd7162861a0caa327f7420fd3ad>`_
- Apparently, it's dateutils on the cheeseshop, but imported as dateutil... `835c1614f <https://github.com/fedora-infra/tahrir/commit/835c1614f8322d0d7024d6364265f500ce51e58a>`_
- Merge branch 'develop' into feature/tags `3262cf7ce <https://github.com/fedora-infra/tahrir/commit/3262cf7ceb93af68805ff4bb59c73368e908d7ee>`_
- Hell yeah, tags are working. Will finish proper implementation of view soon. `e7ab6c91a <https://github.com/fedora-infra/tahrir/commit/e7ab6c91a5df80e7c46a33005e3d6304c4db6c9a>`_
- Better listing and feedback. `ddd939d6f <https://github.com/fedora-infra/tahrir/commit/ddd939d6ffec85bca57bd076dd78cbf1b282e0db>`_
- Start implementing tag view on Explore page. `5cd848157 <https://github.com/fedora-infra/tahrir/commit/5cd848157a4723c00cd20f84e51ce7e36ceaa6e9>`_
- Colspan 2 for search rows on Explore view. `74232630e <https://github.com/fedora-infra/tahrir/commit/74232630eb3db2c441e29aa972eae7d1df9d36f0>`_
- Tag view /{match}/any is working, but not /{match}/all. `4fbb74a85 <https://github.com/fedora-infra/tahrir/commit/4fbb74a85288d4607a71088f104b20610c653613>`_
- Merge branch 'feature/tags' into develop `96be39bc0 <https://github.com/fedora-infra/tahrir/commit/96be39bc0ddb84ad99df4074299b82d969230026>`_
- Display Deactivate/Reactivate account button based on Person.opt_in. `a5588f5bc <https://github.com/fedora-infra/tahrir/commit/a5588f5bcb716fe67c40f9665a41e2f3acd58de2>`_
- Improve buttons on user view. `69fa6bf42 <https://github.com/fedora-infra/tahrir/commit/69fa6bf42909633d4ae950f949df420228d90e97>`_
- Profile button allows user to toggle opt-in mechanism. `1cb2a7c97 <https://github.com/fedora-infra/tahrir/commit/1cb2a7c97c7064fdeb2b9f8bf573157028f68420>`_
- Deactivated peeps don't show up in Person search. `4686a967c <https://github.com/fedora-infra/tahrir/commit/4686a967cfcc859965b9907d54e61c2a74f000ff>`_
- Deactivated users don't show up in Random People. `c7694fcee <https://github.com/fedora-infra/tahrir/commit/c7694fcee63c3171069695d800bd6373a4094ebb>`_
- Use persons_assertions join to construct Latest Awards. `8a76e849a <https://github.com/fedora-infra/tahrir/commit/8a76e849ab4d81c6d8a19dfbf6b4f4ba2e6205d8>`_
- This is the way to go. Exclude all deactivated users from front page. `fbd49a0cf <https://github.com/fedora-infra/tahrir/commit/fbd49a0cf6e62e6a637952598e74825db19f3b9a>`_
- Profile of a deactivated user cannot be viewed by others if opted-out. `9d9f0a3e4 <https://github.com/fedora-infra/tahrir/commit/9d9f0a3e4dfdd8867e61efef53f3a9519385fff4>`_
- Gotta make time denominations singular when there is only "1" `fbeff0563 <https://github.com/fedora-infra/tahrir/commit/fbeff056311418e4d38debd72a47c3554910fda3>`_
- Move logo media files from doc/ to logo/ to avoid confusion with Sphinx docs/ folder. `228dc6140 <https://github.com/fedora-infra/tahrir/commit/228dc6140bf1c55ae87ff32bcaac9c171cea0357>`_
- Start Sphinx documentation (quickstart-generated). `14dcac124 <https://github.com/fedora-infra/tahrir/commit/14dcac124a914e1a1d903af0eb33a37f13358afa>`_
- Add a clarifying comment. `31285bf3a <https://github.com/fedora-infra/tahrir/commit/31285bf3a4452c7115f4d409b25e62da181bf15a>`_
- Sort user view badges by id. Fixes #120. `fff3200c6 <https://github.com/fedora-infra/tahrir/commit/fff3200c6744d35f6b3b906e4cf62dd534eb13c4>`_
- Doh. Fix #121. (500 on leaderboard view) `b08160ce0 <https://github.com/fedora-infra/tahrir/commit/b08160ce0e7c2c0a433ca91d9ebd84a9f497bf73>`_
- Defaultliness is godliness. `ee572b593 <https://github.com/fedora-infra/tahrir/commit/ee572b593037b55ba5c27ba98b9e6d11a058cb2a>`_
- Remove some header stuff from the docs index. Will do more docs stuff after working on Flock preso. `a5190d203 <https://github.com/fedora-infra/tahrir/commit/a5190d203c85b9cb5341402a06dc9a8a868b9620>`_
- Make tags on badge view link to tag view. `64decf75f <https://github.com/fedora-infra/tahrir/commit/64decf75f89d41fd3011e61fa748309e565b9dbc>`_
- Tag view results should link via badge.id, not badge.name. `fdfcb12af <https://github.com/fedora-infra/tahrir/commit/fdfcb12af42f30002fc9fb934b52dddba1195282>`_
- Complete proper rendering of tags list on badge view. `062b7bc87 <https://github.com/fedora-infra/tahrir/commit/062b7bc87b31690deaf2a2eacf1c455d53358614>`_

0.2.5
-----

- Fix an error that was occuring with Postgres. `aeb4bca32 <https://github.com/fedora-infra/tahrir/commit/aeb4bca32511ff44286e8b1612843a357605c7f5>`_
- Make all index columns display 5 items. `26154e7f4 <https://github.com/fedora-infra/tahrir/commit/26154e7f428a7129ebf46f580e547712cfa41c0c>`_
- PEP 8. `bd41939a1 <https://github.com/fedora-infra/tahrir/commit/bd41939a13703a1cf4375246fdbe9d28ba48088f>`_
- Basic websocket injection. `da92f7e26 <https://github.com/fedora-infra/tahrir/commit/da92f7e26405763769a3bddb6ddbda1a178d4c9a>`_
- Limit top persons on leaderboard to 25 people. `053aad053 <https://github.com/fedora-infra/tahrir/commit/053aad0532a93cea33c0df1248dc797123ae72de>`_
- Inject a widget to handle websocket callbacks. `9eee6fb5d <https://github.com/fedora-infra/tahrir/commit/9eee6fb5dad5b08a104e0c4c6accd77de8469117>`_
- Listen to staging. `cbb8bc848 <https://github.com/fedora-infra/tahrir/commit/cbb8bc84870b81891c6aa8e5205a1c441845c440>`_
- Restrict the topic we listen on. `076885cc6 <https://github.com/fedora-infra/tahrir/commit/076885cc67210f8f3e07c9a454790d8cc61ae2a0>`_
- Give the latest awards' wrapper an id for manipulation. `467a2b29d <https://github.com/fedora-infra/tahrir/commit/467a2b29d7338816b9850dc36eb275d3a11be977>`_
- Make top contributors on index page a random sample of the top 10%. `a1bf47303 <https://github.com/fedora-infra/tahrir/commit/a1bf4730367848c4afc5889a14a7a223963f887f>`_
- Use that secure socket layer, friends. `f0c67abe0 <https://github.com/fedora-infra/tahrir/commit/f0c67abe0263e22d188ec71080edf44541c24a2b>`_
- Requires a particular version of moksha.wsgi. `c3630c9bd <https://github.com/fedora-infra/tahrir/commit/c3630c9bd13d9f1ec360b0ebdecc0497d98eefea>`_
- Make the websocket topic configurable. `60c084815 <https://github.com/fedora-infra/tahrir/commit/60c084815886f78b07651702abe5ea27743cae2c>`_
- Make a queriable assertion widget. `1734706a8 <https://github.com/fedora-infra/tahrir/commit/1734706a87b685c0ae9807f64983b6469e0bc756>`_
- Get websocket DOM manipulation on lock. `b9129f844 <https://github.com/fedora-infra/tahrir/commit/b9129f84436cf5511d3255603cfc119a32dca5fb>`_
- Merge branch 'feature/websockets' into develop `3b7881ec4 <https://github.com/fedora-infra/tahrir/commit/3b7881ec4acd8e34789c0ff7cd0092e76ed5071a>`_
- Make websocket injection configurable. `fcc03184b <https://github.com/fedora-infra/tahrir/commit/fcc03184b2e582c99c12dfb4262c80ab0edc2116>`_
- 0.2.4 `24dbfedcf <https://github.com/fedora-infra/tahrir/commit/24dbfedcfb30f74d2caf3a15eeae4dbbaba32108>`_
- Basic websocket injection. `b4a53f553 <https://github.com/fedora-infra/tahrir/commit/b4a53f553c731cbe68d39d3dbe1f349941f369a1>`_
- Inject a widget to handle websocket callbacks. `1f617d6a7 <https://github.com/fedora-infra/tahrir/commit/1f617d6a7514e73ac2d7361ee84b450096ee9559>`_
- Listen to staging. `1f49c77cd <https://github.com/fedora-infra/tahrir/commit/1f49c77cd3a4a88c5b5f71ec11307f685977b0fa>`_
- Restrict the topic we listen on. `aeb3ebc03 <https://github.com/fedora-infra/tahrir/commit/aeb3ebc03bc5c8046cb75c0504b69ef5fd78de91>`_
- Give the latest awards' wrapper an id for manipulation. `e4700c921 <https://github.com/fedora-infra/tahrir/commit/e4700c921c8ac77ae6a2aab123637ddd158262f2>`_
- Use that secure socket layer, friends. `9a294f6d9 <https://github.com/fedora-infra/tahrir/commit/9a294f6d97a2f3a9fa8271ddace12da7360a3b88>`_
- Requires a particular version of moksha.wsgi. `074efad25 <https://github.com/fedora-infra/tahrir/commit/074efad25daf752fecd3ca7308a9dab549af05c8>`_
- Make the websocket topic configurable. `3eb28cdd8 <https://github.com/fedora-infra/tahrir/commit/3eb28cdd8f185ccbabc20dc8fccdd336f5a5a56e>`_
- Make a queriable assertion widget. `9e3723683 <https://github.com/fedora-infra/tahrir/commit/9e37236832be148d8adbd7c9a02862eb8998153c>`_
- Get websocket DOM manipulation on lock. `3a60dd598 <https://github.com/fedora-infra/tahrir/commit/3a60dd598c5e48ba40a845147ea361b3de4379fc>`_
- Make websocket injection configurable. `e3fd57755 <https://github.com/fedora-infra/tahrir/commit/e3fd577557221a0486ed48028014a82d89d4d823>`_
- 0.2.4 `37fb65bfb <https://github.com/fedora-infra/tahrir/commit/37fb65bfb2d8813a57fd9806981c59cea02a8b74>`_

0.2.4
-----

- Un-working code from my attempt to display invites. `2b31dfbdc <https://github.com/fedora-infra/tahrir/commit/2b31dfbdcfa3fc7a764e2563183b42a2eeec8b28>`_
- Need to mangle keys for memcached to not flip out. `fb91f7267 <https://github.com/fedora-infra/tahrir/commit/fb91f7267fe418f8a69053f9d8ae1ea90f9f264a>`_
- htmlDecode to get around weird escaping issues with the assertion urls. `b61c7000c <https://github.com/fedora-infra/tahrir/commit/b61c7000cf29c80a787e41bca94d28e253415847>`_
- Merge branch 'develop' into feature/display-invites `5c52c778d <https://github.com/fedora-infra/tahrir/commit/5c52c778d7bdc2db2c28bff3b0fd06400aff71b1>`_
- Should be self.request. `a46a36bd3 <https://github.com/fedora-infra/tahrir/commit/a46a36bd3f90b4fe448a4c0035ed6ed718cea2a4>`_
- Temporarily avoid using pylibravatar to workaround python-pydns issues on epel6. `c5a4045c6 <https://github.com/fedora-infra/tahrir/commit/c5a4045c68dca1cb36a8bd189066515b1a0b134c>`_
- Space those invitations. `94cca46cd <https://github.com/fedora-infra/tahrir/commit/94cca46cdd7207c4863e74cfcc4abc738f6ebaa1>`_
- Cleanup. `23745bb35 <https://github.com/fedora-infra/tahrir/commit/23745bb35938ebbdfb06c8d2ee65833de6a0ca64>`_
- Fix libravatar idiosyncracy. `95fe974c0 <https://github.com/fedora-infra/tahrir/commit/95fe974c084c572e8b8545ff29f82f82c4884804>`_
- Only display invitations which have not yet expired. `248f84820 <https://github.com/fedora-infra/tahrir/commit/248f84820dad4e34d9a7081fe88edaaf1f18f727>`_
- Turns out it doesn't really need to be that big. `0867af34b <https://github.com/fedora-infra/tahrir/commit/0867af34b2277f6ac89b28063c909f6195255d66>`_
- Merge branch 'develop' into feature/display-invites `cda229a76 <https://github.com/fedora-infra/tahrir/commit/cda229a76c89c6a836a15eb5e88245ebbb3042a4>`_
- Use parsed dates when creating new invitations. `ca9f10676 <https://github.com/fedora-infra/tahrir/commit/ca9f10676d00fa55935aa0ef4da49471feb8c9a1>`_
- Use correct resource_url when doing login redirection for invitations. `cd8740f16 <https://github.com/fedora-infra/tahrir/commit/cd8740f16cc412d0dfed423e4cc1cbbcbba2255e>`_
- Update invitation code to use the latest tahrir-api. `9d7c72613 <https://github.com/fedora-infra/tahrir/commit/9d7c72613a24cfae593fa49326f8388c53c88704>`_
- Remove hardcoded redirect after invitation is claimed. `677a223b2 <https://github.com/fedora-infra/tahrir/commit/677a223b2553ad00bb86c34fb398a126358e2141>`_
- Add some TODO notes. `4c531165d <https://github.com/fedora-infra/tahrir/commit/4c531165db2bdfa0f9007fd1a65a866c4056c2dc>`_
- Merge branch 'feature/display-invites' into develop `dabb76dad <https://github.com/fedora-infra/tahrir/commit/dabb76dadd48daea56027e3f82351902a1526547>`_
- Relative dates ftw. `4ac88c97c <https://github.com/fedora-infra/tahrir/commit/4ac88c97ca1612592c50a38f38f7336e5e6560e7>`_
- Bugfix - pass person.email instead of person.id. `84a606d16 <https://github.com/fedora-infra/tahrir/commit/84a606d16b3db30fb47de9eab2543d7acacd8226>`_
- Basic websocket injection. `da92f7e26 <https://github.com/fedora-infra/tahrir/commit/da92f7e26405763769a3bddb6ddbda1a178d4c9a>`_
- Inject a widget to handle websocket callbacks. `9eee6fb5d <https://github.com/fedora-infra/tahrir/commit/9eee6fb5dad5b08a104e0c4c6accd77de8469117>`_
- Listen to staging. `cbb8bc848 <https://github.com/fedora-infra/tahrir/commit/cbb8bc84870b81891c6aa8e5205a1c441845c440>`_
- Restrict the topic we listen on. `076885cc6 <https://github.com/fedora-infra/tahrir/commit/076885cc67210f8f3e07c9a454790d8cc61ae2a0>`_
- Give the latest awards' wrapper an id for manipulation. `467a2b29d <https://github.com/fedora-infra/tahrir/commit/467a2b29d7338816b9850dc36eb275d3a11be977>`_
- Use that secure socket layer, friends. `f0c67abe0 <https://github.com/fedora-infra/tahrir/commit/f0c67abe0263e22d188ec71080edf44541c24a2b>`_
- Requires a particular version of moksha.wsgi. `c3630c9bd <https://github.com/fedora-infra/tahrir/commit/c3630c9bd13d9f1ec360b0ebdecc0497d98eefea>`_
- Make the websocket topic configurable. `60c084815 <https://github.com/fedora-infra/tahrir/commit/60c084815886f78b07651702abe5ea27743cae2c>`_
- Make a queriable assertion widget. `1734706a8 <https://github.com/fedora-infra/tahrir/commit/1734706a87b685c0ae9807f64983b6469e0bc756>`_
- Get websocket DOM manipulation on lock. `b9129f844 <https://github.com/fedora-infra/tahrir/commit/b9129f84436cf5511d3255603cfc119a32dca5fb>`_
- Merge branch 'feature/websockets' into develop `3b7881ec4 <https://github.com/fedora-infra/tahrir/commit/3b7881ec4acd8e34789c0ff7cd0092e76ed5071a>`_
- Make websocket injection configurable. `fcc03184b <https://github.com/fedora-infra/tahrir/commit/fcc03184b2e582c99c12dfb4262c80ab0edc2116>`_

0.2.3
-----

- Patched table width into css from html. `d79e6ef03 <https://github.com/fedora-infra/tahrir/commit/d79e6ef030a7663aee15323742c2c26c6e7d373d>`_
- Patched width as % to form tables. `ca44b1b13 <https://github.com/fedora-infra/tahrir/commit/ca44b1b134e1be8e6173cc108da0c28d68988280>`_
- Set max form table width to pixel value. `6d795a933 <https://github.com/fedora-infra/tahrir/commit/6d795a9333d282ceee0845352122699ca3859c8e>`_
- Merge branch 'develop' of https://github.com/fedora-infra/tahrir into develop `0380d3b15 <https://github.com/fedora-infra/tahrir/commit/0380d3b1537e81a62180197fccbbe383958e1d7c>`_
- Link to the staging instance. `09ae0a9a6 <https://github.com/fedora-infra/tahrir/commit/09ae0a9a64038a6a5e8ba3ecbf0924f930580f2f>`_
- Merge pull request #106 from CDeLorme/develop `ac2046676 <https://github.com/fedora-infra/tahrir/commit/ac2046676738715d26a0f6a8b313a6402c63d1b1>`_
- Don't italicize description, since we want to convert from RST for frmting. `0b3cf6153 <https://github.com/fedora-infra/tahrir/commit/0b3cf615352542e81198d12aba0838dd006ef76f>`_
- Add docutils to setup.py for #69. `da99ed91e <https://github.com/fedora-infra/tahrir/commit/da99ed91e683ae1af4ca8a12dbb3fefb3bde01f3>`_
- Badge descriptions are converted from RST to HTML. Close #69. `774c57332 <https://github.com/fedora-infra/tahrir/commit/774c573323bcc6670cbd88c481d89460d93a7369>`_
- Properly apply description CSS class to converted description. `fa4fc85b9 <https://github.com/fedora-infra/tahrir/commit/fa4fc85b92ffcbe9620b1a08d9347ff3ccbe53dd>`_
- Display a message if the user doesn't have any badges. `ad97c35f5 <https://github.com/fedora-infra/tahrir/commit/ad97c35f5ce125e1294670cbcfd084af4cb372df>`_
- Give a count and percentage of how many badges the user has earned. `349df2935 <https://github.com/fedora-infra/tahrir/commit/349df2935b9fcf24d04aa0adb833106ecfad720a>`_
- Don't leave that db obj laying around after each request. `9e13de0c1 <https://github.com/fedora-infra/tahrir/commit/9e13de0c1edeb15cc9a76f51cd7c7f1f3eae2b3a>`_
- Don't send our 'responsive' string to gravatar.com. `4412befb5 <https://github.com/fedora-infra/tahrir/commit/4412befb5e538adb5003f92504dd894b32be9c57>`_
- Pass our own managed session object in for TahrirDatabase to use. `194d043bd <https://github.com/fedora-infra/tahrir/commit/194d043bd909b85da6b816807ec390064421b8cc>`_
- Set autocommit=False so the zope transaction manager can handle all that for us. `14ddaf7f0 <https://github.com/fedora-infra/tahrir/commit/14ddaf7f0b02dd0f69d0b33cffe6c3020b92e17c>`_
- Implement actual badge and user search (basic). Close #89. `ed6a1758d <https://github.com/fedora-infra/tahrir/commit/ed6a1758d6045c43ecdab6067f41c2a76884fdf5>`_
- Merge pull request #110 from fedora-infra/feature/issue-89 `491e23c7e <https://github.com/fedora-infra/tahrir/commit/491e23c7e05ea335f33ef80cfa12a25a8a073323>`_
- Make badge last_awarded and first_awarded queries case-insensitive. `ee69577b4 <https://github.com/fedora-infra/tahrir/commit/ee69577b458756b5e2bf66114a257e8f47b8b7e2>`_
- PEP 8. `37f6d6120 <https://github.com/fedora-infra/tahrir/commit/37f6d6120fc92d0ebb055e9888bafb217b51b073>`_
- Make badge search also search badge description. `66ddd5c95 <https://github.com/fedora-infra/tahrir/commit/66ddd5c957ec80f1a33d6a988edaebe90f425b54>`_
- Make explore search field names more general. `aeb4f84e5 <https://github.com/fedora-infra/tahrir/commit/aeb4f84e5fb37b00fe5306f0b66eaa82e91697eb>`_
- Badge search also searches through badge tags. `3c1a52913 <https://github.com/fedora-infra/tahrir/commit/3c1a52913a30fa64849c4b55006bd529a338dd08>`_
- Cleanup. `7a701ef7e <https://github.com/fedora-infra/tahrir/commit/7a701ef7ebfb8c26e8f2d38360a4994c2c2fc2a1>`_
- Explore person search now searches through user bios, as well. `4278996ee <https://github.com/fedora-infra/tahrir/commit/4278996ee980cc13c08a69bdc9c465da20a1a975>`_
- Add shadow to search results for uniformity. `9673ee165 <https://github.com/fedora-infra/tahrir/commit/9673ee165a7c69266e81fd6ff2ba5e6c279bfe12>`_
- Make explore badge search result links exchange spaces for hyphens. `c4219aedd <https://github.com/fedora-infra/tahrir/commit/c4219aedd0428bec49d8f468673c157f3876430a>`_
- Update info on explore template. `18a213116 <https://github.com/fedora-infra/tahrir/commit/18a21311600bf781dd5ba0232c3a5b1106c3b15c>`_
- Whoops. `67ec0efb1 <https://github.com/fedora-infra/tahrir/commit/67ec0efb15ce8394c436d8802fb689d6e28bf0ce>`_
- CSS fix for pretty-list. Close #107. `24c023abc <https://github.com/fedora-infra/tahrir/commit/24c023abc27681524c1313f9afb5378e3e0dd461>`_
- Don't assume non-https base_url. `eb55b21e8 <https://github.com/fedora-infra/tahrir/commit/eb55b21e8ed7016ddd9963f28341170b2d644664>`_
- Rework the traversal app to use tahrir-api. `f889c91bf <https://github.com/fedora-infra/tahrir/commit/f889c91bf8fb65a0716ebfbf5f79cb61ea797716>`_
- Remove spurious import. `7cfabfac2 <https://github.com/fedora-infra/tahrir/commit/7cfabfac2e5873ff0bcddce522b44972b9bbfea7>`_
- Explicitly check for authorization when changing nicknames.  For #98. `2cb792e3a <https://github.com/fedora-infra/tahrir/commit/2cb792e3a909ab93e45d4ae4f1cb206b563fbfdc>`_

0.2.2
-----

- Remove 404 and 505 pngs using PressStart2P font. `a3f061572 <https://github.com/fedora-infra/tahrir/commit/a3f0615728be3b1b8c97ac3fe67d5a5085c46675>`_
- Rebuild 404 and 505 logos with black Liberation Mono font for now. `4e9e3ed09 <https://github.com/fedora-infra/tahrir/commit/4e9e3ed0906f836ecb2a30fe7795a6ac40d1ddb8>`_
- Raise a 404 from the badge view if the badge isn't found. `09c732d2c <https://github.com/fedora-infra/tahrir/commit/09c732d2cec6d4c12f965b9a90235945105bdff7>`_
- Fix errors if badge is being viewed that has never been awarded. `cc5c8c6d3 <https://github.com/fedora-infra/tahrir/commit/cc5c8c6d386aeb292acb8015c51cf45d1923c437>`_
- Change pretty-list stuff to one per line, even though vertical-align won't work. `ded2aef81 <https://github.com/fedora-infra/tahrir/commit/ded2aef81ce21f9e79e5ac0dda1d88427c2bcc44>`_
- Proper vertical alignment! Yay! `894b3bf91 <https://github.com/fedora-infra/tahrir/commit/894b3bf9159586ed54b1ac4bcd997f6f3c349f94>`_
- Proper route_url link for Fedora Badges logo. `1123601af <https://github.com/fedora-infra/tahrir/commit/1123601afa7725cd14f0114f765c53fac52f87e3>`_
- Proper badge sizing, plus actually implement 256px size CSS for badge and thumbnail. `c0fc83118 <https://github.com/fedora-infra/tahrir/commit/c0fc831180ed572935eed9a26f6c13982455df4a>`_
- Proper pluralization for times_awarded badge statistic. `6fb3cd62b <https://github.com/fedora-infra/tahrir/commit/6fb3cd62bebedde1d8204264effe3c9eb79afe48>`_
- Crazy-huge PEP8 commit. `9bbed1b96 <https://github.com/fedora-infra/tahrir/commit/9bbed1b96045a24fcddee86dcbb74ac08c13abb2>`_
- Typo was causing minor styling issue. `79c410391 <https://github.com/fedora-infra/tahrir/commit/79c410391f8c44915fc09d0f4177ec6e9a8d3643>`_
- Limit that top_persons list. `e2b4189ad <https://github.com/fedora-infra/tahrir/commit/e2b4189ad3778757f60e13bc9c63545eda83f328>`_
- Get openid realm from the config. `e886edc77 <https://github.com/fedora-infra/tahrir/commit/e886edc774abd9d698377b2f0e66c2b2fa1d3b61>`_
- Add note, and put stuff in padded-content div. `cbc1047f3 <https://github.com/fedora-infra/tahrir/commit/cbc1047f3d9ae58c5f6ff91028b00cae8a6d2a5c>`_
- Use secure cookies. `025781809 <https://github.com/fedora-infra/tahrir/commit/025781809365f5f542d4ee224a87e01b7b0e0071>`_
- groupfinder should at least return an empty list or else the user is considered invalid. `eef00c338 <https://github.com/fedora-infra/tahrir/commit/eef00c33806af1d27a8893ccdd8b7dc1deb4913d>`_
- Make secure cookies configurable. `d4a748026 <https://github.com/fedora-infra/tahrir/commit/d4a74802624b7f607171a2ef504d3cdceef00160>`_
- Convert the secure cookies config value to a bool. `c0e164aeb <https://github.com/fedora-infra/tahrir/commit/c0e164aebd0a1d79f079b640b2a6495182252e9a>`_
- Use pyramid.settings.asbool instead of rolling our own `b4b6581b1 <https://github.com/fedora-infra/tahrir/commit/b4b6581b1b83a447c0a941d213e1d2ce70a6302a>`_
- Allow FI to avoid using the openid-provided email. `c19740232 <https://github.com/fedora-infra/tahrir/commit/c197402328922c6942e850aad4604df2a67394f3>`_
- Fix an old typo.  We want the *last two* tokens here. `5aad87742 <https://github.com/fedora-infra/tahrir/commit/5aad87742c75433bf1dcd4ad76350ace52c9db2e>`_
- Add nice shadow boxes to the frontpage. `d02586fae <https://github.com/fedora-infra/tahrir/commit/d02586faeb99598bbd42c313fd3a91090fee5e80>`_
- Padding tweaks for the frontpage. `5d1fc5d0c <https://github.com/fedora-infra/tahrir/commit/5d1fc5d0c2a7ab2d01ee2bad0770b49f4da8ce28>`_
- Some text centering for consistency. `201873fb2 <https://github.com/fedora-infra/tahrir/commit/201873fb22bcc103a8a57012c58e5481b68d5ab8>`_
- Cache libravatar URLs.  Fixes #94. `3c1fb4d6a <https://github.com/fedora-infra/tahrir/commit/3c1fb4d6aa052c1a8b9475bd0fd0c124e6206829>`_
- Sticky footer.  Fixes #88. `803dd7a3f <https://github.com/fedora-infra/tahrir/commit/803dd7a3f75397cc57f20a7c117345c90b8b17fb>`_
- Tweak date padding. `8317d4a1e <https://github.com/fedora-infra/tahrir/commit/8317d4a1e4fd89a1af6bbbf16506e3c5dc9fff18>`_
- Remove badge description from the tooltip.  Its too much! `b4b2b722c <https://github.com/fedora-infra/tahrir/commit/b4b2b722c664922f5f6c6c8f8b921eca8235f698>`_
- Remove unnecessary div. `063425477 <https://github.com/fedora-infra/tahrir/commit/063425477f684b09425271f921627ad8527aa740>`_
- Show when person first showed up on user view. `f029a642b <https://github.com/fedora-infra/tahrir/commit/f029a642b90d1c6973ab4ef71fff90cf7e298dd3>`_
- Cooler message when badge has never been awarded. `0d4c81ca6 <https://github.com/fedora-infra/tahrir/commit/0d4c81ca675d87a875b6e689ab5e1dde542c9e3b>`_
- Add percentage of people who have earned a badge on badge view. `7efec7be9 <https://github.com/fedora-infra/tahrir/commit/7efec7be93b574f99445027afde37002b4f58160>`_
- Clarify explore view. `29587222a <https://github.com/fedora-infra/tahrir/commit/29587222affc90c2d90054b4eb16be80ea81c563>`_
- Add my other email to the default development file. Why not. `806f8ec99 <https://github.com/fedora-infra/tahrir/commit/806f8ec997c3a7ac0b65685d99bf2ae1dc90867e>`_
- Add underscores when needed on new user add, plus keyword targetting. `dc3187c7f <https://github.com/fedora-infra/tahrir/commit/dc3187c7f889bdc0508490de102d6febd0162ab9>`_
- Working code for allowing the user to change their nickname. `4d88cb7b5 <https://github.com/fedora-infra/tahrir/commit/4d88cb7b5540f243199242c547b9eb7a4523721e>`_
- Unsemantic CSS grid structure. `68377de92 <https://github.com/fedora-infra/tahrir/commit/68377de92545f5cbbba59896a070648bf08898fc>`_
- Apply large numbering to leaderboard ranking numbers. `25d819eae <https://github.com/fedora-infra/tahrir/commit/25d819eae74f7af987cb5352e53cbed929db25e9>`_
- Add shadow div to leaderboard. `f2ea22058 <https://github.com/fedora-infra/tahrir/commit/f2ea22058f5e93aa07b93b1318b85ee156b0b89d>`_
- Ignore apple DS_STORE giblets. `b1acf23e0 <https://github.com/fedora-infra/tahrir/commit/b1acf23e0770f0f759c4a632df901004b1ba4572>`_
- Add some nice spacing under section headers. `1e411e3ad <https://github.com/fedora-infra/tahrir/commit/1e411e3ad5a0207edde360946fb8677c8a04e951>`_
- Add shadows to explore view. `8e59eacf6 <https://github.com/fedora-infra/tahrir/commit/8e59eacf6142ea3fcdd96e26200bb9233791dd2a>`_
- Add shadow and some uniform formatting to the badge view. `c153778de <https://github.com/fedora-infra/tahrir/commit/c153778de2833a55af6806b42d0383294e15d903>`_
- Badge view restructuring and design changes. `eaccbdfcb <https://github.com/fedora-infra/tahrir/commit/eaccbdfcbc1e744612ce7633a94b308b649bcc92>`_
- Uniformity/restyling for user view, plus other tweaks. `b99bce250 <https://github.com/fedora-infra/tahrir/commit/b99bce250926056288b62f10de87b3398231a000>`_
- More user view structure/design changes. `0854a283e <https://github.com/fedora-infra/tahrir/commit/0854a283e9a41c625a396ea7a2f76b1359554fc0>`_
- Remove that old popup stuff. `2103236f4 <https://github.com/fedora-infra/tahrir/commit/2103236f4ad5ab3c92e1fdff34527dc08abef2ef>`_
- Move "arrived on" detail on user view. `c2e253e75 <https://github.com/fedora-infra/tahrir/commit/c2e253e750c899d8c3ed983d7792bd0604eeb971>`_
- Add missing period. `b4c3473b9 <https://github.com/fedora-infra/tahrir/commit/b4c3473b92b6cd111cd8dd9f81058eb06f36899e>`_
- Merge branch 'develop' of https://github.com/fedora-infra/tahrir into develop `98f62b1a1 <https://github.com/fedora-infra/tahrir/commit/98f62b1a12eca2e21661d01c173fe599407ee4bb>`_
- This footer is getting out of control. `859cbab99 <https://github.com/fedora-infra/tahrir/commit/859cbab99f4f0b3587be43a2c8ff9977925c94de>`_
- Cache a larger fallback image for user avatar. `24a77cc8f <https://github.com/fedora-infra/tahrir/commit/24a77cc8f4a1fe51269a4b349d55807ac9fc37be>`_
- Testing patches to header logo. `8bb420b22 <https://github.com/fedora-infra/tahrir/commit/8bb420b22d6dbae3bfbe424e998cfd7b595ce0d2>`_
- Fixing header section, reducing code complexity & layers. `6ff5826e1 <https://github.com/fedora-infra/tahrir/commit/6ff5826e15869c95c9baf1aa4918bf7a9e4c52dd>`_
- Removed unnecessary id. `adb23a34c <https://github.com/fedora-infra/tahrir/commit/adb23a34ce14a05de3127265d93b746d55c392cb>`_
- Finished cleaning, prepared for merge-request. `0e2fe18dc <https://github.com/fedora-infra/tahrir/commit/0e2fe18dc10a9e1409356d8ff70f907ccfab193e>`_
- Merge branch 'develop' of https://github.com/fedora-infra/tahrir into develop `3a40a60a0 <https://github.com/fedora-infra/tahrir/commit/3a40a60a0217320b8270409e3ca96f2a953da8c8>`_
- A stab at a more flexible gravatar on the user page. `6bb6aaa6f <https://github.com/fedora-infra/tahrir/commit/6bb6aaa6f5ee4a7eeedbd34275a0ae0ee9f8c0c1>`_
- Limit badge awarded percentage to 1 decimal place. `e84dbd0bb <https://github.com/fedora-infra/tahrir/commit/e84dbd0bb93e01f49462f3085df5660865de4c6d>`_
- Merge branch 'develop' of https://github.com/fedora-infra/tahrir into develop `16f80d30d <https://github.com/fedora-infra/tahrir/commit/16f80d30d95fdfde879309ab23ad0d34fa26cc5b>`_
- Merge pull request #104 from CDeLorme/develop `be1b2d63c <https://github.com/fedora-infra/tahrir/commit/be1b2d63c250bf612646e1937326e0e65df3869d>`_
- Fixed improper footer closing and disabled some css for test. `5075069c1 <https://github.com/fedora-infra/tahrir/commit/5075069c1411533786ca050d5bbe831ba5da218d>`_
- Get those badges back in that shadow box. `f41425ddc <https://github.com/fedora-infra/tahrir/commit/f41425ddc4b546ba7ff3faae843a6fd7a37b3b2f>`_
- Testing patch height of footer. `114412318 <https://github.com/fedora-infra/tahrir/commit/11441231889ee19de106a9a5ba29187636952f3c>`_
- Testing push tag again with some minor relocation. `20a755505 <https://github.com/fedora-infra/tahrir/commit/20a75550554a981a1a7f5ca21f973581261b0411>`_
- Get images to be centered on the user view. `f3c956476 <https://github.com/fedora-infra/tahrir/commit/f3c956476ebf53509f8ab6b1c3173d694fa82d9f>`_
- Added clearfix to page. `ff8b618ff <https://github.com/fedora-infra/tahrir/commit/ff8b618ff2fbb5915887f5e917846fa9ba430e6f>`_
- Merge branch 'develop' of https://github.com/fedora-infra/tahrir into develop `2818dec9c <https://github.com/fedora-infra/tahrir/commit/2818dec9c2075d2edf3d13a0f98aa9da8503cbfe>`_
- Not sure why this change needs to be made, but the pretty list got messed up somewhere along the way. `109a813eb <https://github.com/fedora-infra/tahrir/commit/109a813ebeb05a0dddca36d13fa92d1d49e86761>`_
- Moved clearfix to top element. `4646ac7bc <https://github.com/fedora-infra/tahrir/commit/4646ac7bc56564d5c509bb99a83cb457ad5cd9ce>`_
- Criteria should be links. `1e21f292e <https://github.com/fedora-infra/tahrir/commit/1e21f292e064b2bfb29c5a7edb2b497a981c6461>`_
- Adjustment test. `8ef33f276 <https://github.com/fedora-infra/tahrir/commit/8ef33f276043327599cf37f273d1a246f4544b01>`_
- Removed terrible scroll test. `5367ec7e1 <https://github.com/fedora-infra/tahrir/commit/5367ec7e183baf911fd00eafea6e541b92e70a4b>`_
- Trying another method. `1fd020a2d <https://github.com/fedora-infra/tahrir/commit/1fd020a2d7df77133662fe1ecc8b9b24aeb3076b>`_
- More alternative test css. `6be03c124 <https://github.com/fedora-infra/tahrir/commit/6be03c124a76f7923900949dcaea25a5ad0462e8>`_
- More puzzle peices. `feda111d4 <https://github.com/fedora-infra/tahrir/commit/feda111d4f71319bcd7c927567b63ab8525c812f>`_
- Final puzzle peice needed. `55d32b6f6 <https://github.com/fedora-infra/tahrir/commit/55d32b6f6b3edccc83ff3505d72dbf8e15089b02>`_
- Add me to the default admin thing again. `a501d14af <https://github.com/fedora-infra/tahrir/commit/a501d14af8656070f915ed8d55c8cbf70d4f342a>`_
- Further testing with relocated html. `74a704a5c <https://github.com/fedora-infra/tahrir/commit/74a704a5c8c835acdc5dd57d89c8764f5d9c6e65>`_
- Another quick addition. `abbc97fbd <https://github.com/fedora-infra/tahrir/commit/abbc97fbde1465c0ccd38b7df3040d178f43e1c8>`_
- Try to fix wonky image sizes. `14870c6c2 <https://github.com/fedora-infra/tahrir/commit/14870c6c2f760595d17ce534d3209929660f7f00>`_
- Reverted back to previous approach for more tests. `e22408de7 <https://github.com/fedora-infra/tahrir/commit/e22408de744b30469f26bfbb8b1cbc374ddaa085>`_
- Another test of changed tools. `1e8812e5d <https://github.com/fedora-infra/tahrir/commit/1e8812e5d0e5a885b11e2597bcd4b6e3db2907cf>`_
- Merge branch 'develop' of https://github.com/fedora-infra/tahrir into develop `9638f1eeb <https://github.com/fedora-infra/tahrir/commit/9638f1eebbc5933022d5900bce15e2f564d889bc>`_
- Patched table sticking outside container. `d308db130 <https://github.com/fedora-infra/tahrir/commit/d308db13039fc38a7b4de328cb52138cbb4c635a>`_
- Work on change nickname button. `285b90d22 <https://github.com/fedora-infra/tahrir/commit/285b90d22fc08c1a3250b847778c38036733a274>`_
- Merge pull request #105 from CDeLorme/develop `24c1e9913 <https://github.com/fedora-infra/tahrir/commit/24c1e9913f1db57fa0678b4edca5d9db27d94c02>`_
- Magic.  All day long. `54d0dfa47 <https://github.com/fedora-infra/tahrir/commit/54d0dfa47cd22d2840a5fcb2313932ef22aa889f>`_

0.2.1
-----

- Actually fall back. `10540279b <https://github.com/fedora-infra/tahrir/commit/10540279bb3bdc5cb37d89b901f7875c3209c46e>`_
- Some production.ini tweaks. `6fc7548c0 <https://github.com/fedora-infra/tahrir/commit/6fc7548c0cd236ef589265461d5f1d8de8b7cd23>`_
- Make more admin fields required. Make one an email field. `50f3b21d7 <https://github.com/fedora-infra/tahrir/commit/50f3b21d7be180b62514359b1d018132f34c22ca>`_
- Except division by zero error on Leaderboard when there are no users. `7429cabac <https://github.com/fedora-infra/tahrir/commit/7429cabaca73355f9ade9474918af427ae59a3a4>`_
- Remove Users placeholder from navbar. `d0ab0c0ed <https://github.com/fedora-infra/tahrir/commit/d0ab0c0edae2c415175228a00ed94c1c0f2cd92c>`_
- Reorder nav bar. `f2074918a <https://github.com/fedora-infra/tahrir/commit/f2074918a0511b75fd0d9996b12f679333793f34>`_
- Add missing page headers and make 'em all <h1>s. `4c3867793 <https://github.com/fedora-infra/tahrir/commit/4c3867793e74fdf9262efc4a9ca8a4c36562904e>`_
- Style improvements to user profile view. `d7be41d41 <https://github.com/fedora-infra/tahrir/commit/d7be41d4151a6cb9a4d866887b938dd0329f6a4a>`_
- Be able to specify where secret.ini is located. `590c5d1b3 <https://github.com/fedora-infra/tahrir/commit/590c5d1b3ab6a5a0625c62db6d0745bfff3ef46a>`_
- Implement Explore view. Allow visiting a badge or user page via "search". `271d6379a <https://github.com/fedora-infra/tahrir/commit/271d6379ad736948d628778e43d2b47dac8385a9>`_
- Explore view improvements. `1ddfc6146 <https://github.com/fedora-infra/tahrir/commit/1ddfc6146d950d6606ee52a54ea863c4d9bf6181>`_
- Update secret.ini.example for recent config change. `d62898fc5 <https://github.com/fedora-infra/tahrir/commit/d62898fc5e3eb5aae9794bcfe146b36dfcd9cba5>`_
- Swap email and nickname display on user view. `726c92c95 <https://github.com/fedora-infra/tahrir/commit/726c92c959093f590e8ccaf59e0faaa88eae51b2>`_
- Leaderboard competitor numbering was zero-indexed. `bd9ed2a3b <https://github.com/fedora-infra/tahrir/commit/bd9ed2a3b040004163a31a0c836b33bb86ac0bca>`_
- Move avatar def to a separate functions.mak file. `258e8103a <https://github.com/fedora-infra/tahrir/commit/258e8103a2a18f40482a04de847d4cdccc04de7b>`_
- Add avatars to leaderboard. `1aa1df2a0 <https://github.com/fedora-infra/tahrir/commit/1aa1df2a069ff2daffebb7c4c07ce5ef65761ab3>`_
- Add avatar to user view (profile). `e94dd2e4f <https://github.com/fedora-infra/tahrir/commit/e94dd2e4fdedb59898b01126208d4fccc1d63591>`_
- Fix bug where awarded_assertions were those of the viewed user on Profile. `765045f9c <https://github.com/fedora-infra/tahrir/commit/765045f9c829e6b5d461b7715b3cdea2041bcf52>`_
- Comment out the dep on Pillow. `b31d7cd74 <https://github.com/fedora-infra/tahrir/commit/b31d7cd7451fb894081b4a39d6028fcb115e75be>`_
- Simplify merging of secret.ini and make it optional. `724d58032 <https://github.com/fedora-infra/tahrir/commit/724d58032648430256772a1fa6b3680875b81f41>`_
- Correct sorting for newest persons list. `6da322ad4 <https://github.com/fedora-infra/tahrir/commit/6da322ad49374df2d232b66325c5e43c47f3335b>`_
- That part was a mistake. `df77f437f <https://github.com/fedora-infra/tahrir/commit/df77f437f3028877cfe6459716fe5a2433ebba41>`_
- Limit frontpage items to the top N. `9033fbc1f <https://github.com/fedora-infra/tahrir/commit/9033fbc1ff1c1e321f167f52e5c8fa8cfd3f5960>`_
- Sort latest awards correctly. `e15c66c42 <https://github.com/fedora-infra/tahrir/commit/e15c66c42ae7cb0a24f00904bb076f12ba3fcb7a>`_
- Make a thumbnail function for badges. `61b8f36ba <https://github.com/fedora-infra/tahrir/commit/61b8f36ba6623bc4df77d479ace413d9896ef6c9>`_
- Start of tooltips. `9b035316e <https://github.com/fedora-infra/tahrir/commit/9b035316ec109620680caeb7ad11bcb9ed0af15e>`_
- Remove unused css block. `091a1b93a <https://github.com/fedora-infra/tahrir/commit/091a1b93aab456293166ac8ccfe307686fd0cfc0>`_
- Tweaks to tooltip styling. `f5c0ab9ba <https://github.com/fedora-infra/tahrir/commit/f5c0ab9baf16ac4b3fa39c2583740bc23c1e5ecf>`_
- Turn user profile list of badges into a grid. `f329f4db3 <https://github.com/fedora-infra/tahrir/commit/f329f4db31750bdd1719f3f66797a88df629e9ad>`_
- Generate random_badges and random_persons in explore view. `321314667 <https://github.com/fedora-infra/tahrir/commit/32131466741df7adfdc67a30cdb0290db22528dc>`_
- Merge branch 'develop' of github.com:fedora-infra/tahrir into develop `88d560651 <https://github.com/fedora-infra/tahrir/commit/88d560651c9a06af2a8cbf0ff0dd2dafbe548761>`_
- Random badges display on Explore view, but are not formatted well. `144b47c98 <https://github.com/fedora-infra/tahrir/commit/144b47c98ebed0ec74e7e95c8ae35a5cd4fe9a1f>`_
- Make badge_thumbnail def actually make use of cell_width. `1f5d68001 <https://github.com/fedora-infra/tahrir/commit/1f5d680011b4d483df8a0a332d414edb097c3892>`_
- Complete implementation of random badges and random people. `c82918592 <https://github.com/fedora-infra/tahrir/commit/c829185923187e23f4239681aac4948d77518cc6>`_
- This badge spacing should work for now. `ebd6980c0 <https://github.com/fedora-infra/tahrir/commit/ebd6980c04dafd789d559b895e0a40f67b19ce14>`_
- Add a couple comments. `e57233b54 <https://github.com/fedora-infra/tahrir/commit/e57233b54ee57edccd101054965dea0cb6003bbe>`_
- Get total times badge has been awarded for statistics section. `f6a7e8778 <https://github.com/fedora-infra/tahrir/commit/f6a7e8778d8d938c14db5c257481d189ecee0ea0>`_
- Move link to Builder to footer. `9dd03931d <https://github.com/fedora-infra/tahrir/commit/9dd03931d5347eb414eb9829a52121e4a2cbd8ba>`_
- Improve and implement more badge statistics. `9ce6b953c <https://github.com/fedora-infra/tahrir/commit/9ce6b953cbfe40b110d2758525efc628b413b9ab>`_
- Some restructuring of badge view. `b18ccce78 <https://github.com/fedora-infra/tahrir/commit/b18ccce78391807158fc2fee5cf8927ae40d6963>`_
- Some restructuring of user view. `060308298 <https://github.com/fedora-infra/tahrir/commit/060308298af116b1cbff75731ae341e2d7dce92e>`_
- Some leaderboard restructuring. `2b2105029 <https://github.com/fedora-infra/tahrir/commit/2b2105029a5b4d850a2d53b7e0c6455623cdcb3f>`_
- Implement (quite ugly due to CSS issues) Change Avatar link. `7d66e86ff <https://github.com/fedora-infra/tahrir/commit/7d66e86ff476100e53c872687093b072634a4327>`_
- Janky (but working) align for Change Avatar button. `bb2ca7d40 <https://github.com/fedora-infra/tahrir/commit/bb2ca7d40b633003bb5733b39ad22a0cfd502ab1>`_
- Omit an extra uneeded html tag. `dd805540b <https://github.com/fedora-infra/tahrir/commit/dd805540bf8ec197c7498b1208988c81bd72e741>`_
- Tweak user view. `756b98f43 <https://github.com/fedora-infra/tahrir/commit/756b98f43beeea986fd8b53a21097a2e7ce01934>`_
- Tooltip styling. `7ed49560c <https://github.com/fedora-infra/tahrir/commit/7ed49560c78d0e0b24ecc7ca3f0dbcfeb51b77f4>`_
- Tweak left pane of user profile view. `776553a0c <https://github.com/fedora-infra/tahrir/commit/776553a0c6b822f8a7715dff192bd24246cd4827>`_
- Delete old GitHub ribbon image (no longer used). `4a8ad78da <https://github.com/fedora-infra/tahrir/commit/4a8ad78dabfc5aea4ec90e6046aaec568021d5d4>`_
- Moved the "claim" link to only the users profile page. `01c0ba3c3 <https://github.com/fedora-infra/tahrir/commit/01c0ba3c35617326db59ceef03782910d3e9abaf>`_
- Well, we have custom bullet images. I give up trying to get one item on each line though. I've already wasted a good 30 minutes. `383022878 <https://github.com/fedora-infra/tahrir/commit/38302287812cc0d7737c8cfcbd48a78725adcc88>`_
- Proper URL handling for user website on profile view. `1cde0e881 <https://github.com/fedora-infra/tahrir/commit/1cde0e881ece172feb0347d2715753945c87ecd7>`_
- Add viewport <meta> tag for (hopefully) proper mobile scaling. `3071dbb0f <https://github.com/fedora-infra/tahrir/commit/3071dbb0f951da63faefe92b6832e1e332a3afe9>`_
- Kill the ribbon. `65aa1ec16 <https://github.com/fedora-infra/tahrir/commit/65aa1ec16b915632174101916412773ab8e4f481>`_

0.2.0
-----

- Updated README.rst with steps to admin webapp `adc013459 <https://github.com/fedora-infra/tahrir/commit/adc01345973613b721b938e9202b1ed01f513fd2>`_
- Merge pull request #42 from atabas/patch-4 `a38d42bab <https://github.com/fedora-infra/tahrir/commit/a38d42babd2ab5e996ec22c9395d674e6e8f9f7f>`_
- Update README.rst `18e0728f2 <https://github.com/fedora-infra/tahrir/commit/18e0728f266969fa888cb24776bd87708da16641>`_
- Merge pull request #43 from yash256/patch-1 `4544a67a7 <https://github.com/fedora-infra/tahrir/commit/4544a67a7e1d1eacaced89af06135d59ff38f6f5>`_
- Modernize apache config. `044e5d605 <https://github.com/fedora-infra/tahrir/commit/044e5d605bc01fdc8ac1cc0219f092b49cd3ccf4>`_
- 0.1.9 `8b5288ec5 <https://github.com/fedora-infra/tahrir/commit/8b5288ec5d563c49fde54265b879cf97a37aa5cb>`_
- Fix a typo in the SavingFileField extension validator `9763391f4 <https://github.com/fedora-infra/tahrir/commit/9763391f4f4093658da18830430e34c2a52ca9ee>`_
- Modernize apache config. `170777835 <https://github.com/fedora-infra/tahrir/commit/170777835f1413d7a720e7033b6da648f6837c38>`_
- 0.1.9 `60cff95e0 <https://github.com/fedora-infra/tahrir/commit/60cff95e0715bfb2e9715950342b6c6586d2630e>`_
- Relicense to include additional permission.  Fixes #44. `52ccd18e2 <https://github.com/fedora-infra/tahrir/commit/52ccd18e204ca4b42b8b30590bcb8849c04f5f6b>`_
- Simplify FAS openid login so the user doesnt have to type in their username. `5370641fc <https://github.com/fedora-infra/tahrir/commit/5370641fc78157e2d7abea741901c532d2a1d823>`_
- Remove unnecessary lines. `7cbb56dc1 <https://github.com/fedora-infra/tahrir/commit/7cbb56dc153fcbab40c5ca6d9f8525a6051962ab>`_
- Merge pull request #47 from fedora-infra/feature/pyramid-openid-teams `a5bdf60c5 <https://github.com/fedora-infra/tahrir/commit/a5bdf60c562400174ab356aaf8fe7bd5c7c46b12>`_
- Dummy qrcode proof of concept. `f82e3a885 <https://github.com/fedora-infra/tahrir/commit/f82e3a88557eeaedbd5dd12201283bdc35825239>`_
- Add a note about setting up virtualenvwrapper for the first time.  Fixes #38. `1d919333c <https://github.com/fedora-infra/tahrir/commit/1d919333cc0169431cdbdf6ec3328a0f57e1bcfc>`_
- Fix namespace conflict. `d69348919 <https://github.com/fedora-infra/tahrir/commit/d69348919edd3b7d7938a7053e4041f0414c2d01>`_
- Bugfix to the new-badge form. `1fd47f2f4 <https://github.com/fedora-infra/tahrir/commit/1fd47f2f442220cd7ee5b50794f150330c1b042b>`_
- Don't fail if imagemagick isn't installed. `d476191c7 <https://github.com/fedora-infra/tahrir/commit/d476191c78e82112f9f03d87237577af8358ca08>`_
- Invitation qrcode, claiming, and form. `e0c5ee5df <https://github.com/fedora-infra/tahrir/commit/e0c5ee5dfeb05237d3c9ea27360b21572ddca36f>`_
- Remove debug statement. `609c17ca8 <https://github.com/fedora-infra/tahrir/commit/609c17ca8d8765e360ab4b78d8378de3071fb4ff>`_
- Merge pull request #48 from fedora-infra/feature/venv-docs `30b2029b6 <https://github.com/fedora-infra/tahrir/commit/30b2029b6109b8c4a918205ad890543041387b2a>`_
- Merge pull request #49 from fedora-infra/feature/qr-code `ddd20beb2 <https://github.com/fedora-infra/tahrir/commit/ddd20beb241faedff3b5c0a9c69b63109e57ac9f>`_
- add tahrir.ini to .gitignore (the actual config file I am using) `e253e745f <https://github.com/fedora-infra/tahrir/commit/e253e745fc09e7d970c1a487c8f2dad6a3c28ec1>`_
- move to unsemantic CSS and start new layout `106ca2027 <https://github.com/fedora-infra/tahrir/commit/106ca202722007fd731db051ea0f23b051767528>`_
- add a footer like the one I added to tagger `d2822159b <https://github.com/fedora-infra/tahrir/commit/d2822159b036fd07ab37514ac66159128ba4f60c>`_
- tweak columns and some positioning stuff `d8a3df1ac <https://github.com/fedora-infra/tahrir/commit/d8a3df1ac89c441e42be850c7349384cfc8eaa9a>`_
- more repositioning, plus responsifying the admin view `a29766c17 <https://github.com/fedora-infra/tahrir/commit/a29766c1767713101ea0300278a11e05974ad34a>`_
- add start of a badges view `b519a34a0 <https://github.com/fedora-infra/tahrir/commit/b519a34a04d6c1960c273faafaf5554936b5ea90>`_
- add start of user view `7cf15a4bd <https://github.com/fedora-infra/tahrir/commit/7cf15a4bd1a217d3dad8614add644bab0aebb09e>`_
- keep working on user view, need to decide how to handle awarded_assertions `6052fd29e <https://github.com/fedora-infra/tahrir/commit/6052fd29eea69c805cf6b0ae3ad87a8bf339a23c>`_
- fixes #34 -- smoothly redirect to and from login for admin view `db703304f <https://github.com/fedora-infra/tahrir/commit/db703304f2df3d82d5f121e744debb631c86f83b>`_
- set came_from in home view so login works from there, too `d775037e2 <https://github.com/fedora-infra/tahrir/commit/d775037e205d795a7b883cd6b2b8ee1528fe60a6>`_
- Post-auth redirection for the invitation claim view. `ef8356f4f <https://github.com/fedora-infra/tahrir/commit/ef8356f4fa72aaf9f93e20f768b8daedc4b18e40>`_
- Added source files for logo ideas for #51 `7dd99fc58 <https://github.com/fedora-infra/tahrir/commit/7dd99fc5880a0d70e23893b8c06f2dda26a685d0>`_
- Added a final candidate for a logo. Fixes #51. `c9202be14 <https://github.com/fedora-infra/tahrir/commit/c9202be14397adc13ad59d9c63acc94407c55bc9>`_
- Import HTTPGone so that an expired invitation actually works. `18d51c7cd <https://github.com/fedora-infra/tahrir/commit/18d51c7cd07996f5fa0719bd12dcb551eee78179>`_
- Flip comparison operators so that logic works as properly. `9404a1ce9 <https://github.com/fedora-infra/tahrir/commit/9404a1ce94266cb237dcfd8d05c01217cd47addc>`_
- Proper redirection for invitation handling. `35c071d80 <https://github.com/fedora-infra/tahrir/commit/35c071d8085f9398b31f1f51fd93ec1cc1d7f73b>`_
- Redirect to home view if user already has badge provided by an invite. `ca821a966 <https://github.com/fedora-infra/tahrir/commit/ca821a9665e618ff30709ea89da68eb05d4db88e>`_
- Remove all old references to tahrir.salt. `1c00f1089 <https://github.com/fedora-infra/tahrir/commit/1c00f1089dd18979fbecfaa9da3ceebeb4e22446>`_
- Merge pull request #55 from fedora-infra/feature/simple-salts `0c0016835 <https://github.com/fedora-infra/tahrir/commit/0c0016835c8b6bc000da969cbc5303f70e6f69f7>`_
- Add blue navbar and relocate links to it. `9df9c7ad3 <https://github.com/fedora-infra/tahrir/commit/9df9c7ad339cf450b9ddb58a56cc8503eb6dcd24>`_
- Move login functionality to navbar. `a6a88f454 <https://github.com/fedora-infra/tahrir/commit/a6a88f454daa65b65f06977d5c1a1e840bec2765>`_
- Make navbar take up full screen width. Color header blue. `b15212a74 <https://github.com/fedora-infra/tahrir/commit/b15212a74e6c995e7a9cc080988ec00da5f5ec28>`_
- Section headers + styling closer to Jenn's mockups. `307deba91 <https://github.com/fedora-infra/tahrir/commit/307deba91888553008a636520708d1f7041269a0>`_
- Add Fedora logo and make Tahrir header text gray. `d4b5b0b71 <https://github.com/fedora-infra/tahrir/commit/d4b5b0b71dffc6fca1a48e9ba08e846d14615abd>`_
- Styling. `deca27e1a <https://github.com/fedora-infra/tahrir/commit/deca27e1a32f5bcd3caba571b3d5a383fed84ed0>`_
- This gets rid of bootstrap... although it doesnt exactly work either. `8fbbe19af <https://github.com/fedora-infra/tahrir/commit/8fbbe19af645f555f3fb8575e9c3c06cf36a3d83>`_
- Don't use the broken datetimepicker.. just a text field for now. `09840f26b <https://github.com/fedora-infra/tahrir/commit/09840f26bc262703e7387941dbd38d35e7ed266b>`_
- Revert "Don't use the broken datetimepicker.. just a text field for now." `ed41e2ed8 <https://github.com/fedora-infra/tahrir/commit/ed41e2ed8563fda5f649b6c9393a23b4e381c92f>`_
- Merge pull request #59 from fedora-infra/feature/no-bootstrap-plz `7768d4c7a <https://github.com/fedora-infra/tahrir/commit/7768d4c7ae25f4b7062a8ed43461e3a21dbf1a09>`_
- Threebean's tw2 widget change. (Sorry, recovering from a git issue) `afa0fcea8 <https://github.com/fedora-infra/tahrir/commit/afa0fcea86e4c57328bcd75858c4a3e2c35aa17a>`_
- Add created_by radio button to invitation form. With tahrir-api 55d8803, fixes #58. `54e8f45d0 <https://github.com/fedora-infra/tahrir/commit/54e8f45d0660fd95788c43ad6518931021a6bf96>`_
- Merge branch 'feature/issue-58' into develop `56dc457a4 <https://github.com/fedora-infra/tahrir/commit/56dc457a4c5c8bd281b3bc84fcda7eb5c72905bc>`_
- Pass base_url to user and badge views. `cbf351ff2 <https://github.com/fedora-infra/tahrir/commit/cbf351ff2a51b10d75985e41b7682ea2e0eea5c3>`_
- Shorten/simplify displayed page titles. `d7e2b5070 <https://github.com/fedora-infra/tahrir/commit/d7e2b507011cb14f67998a6b284b20066cb125b0>`_
- Use BeforeRender and Pyramid events to make base_url and title global vars. `6b51ca6c8 <https://github.com/fedora-infra/tahrir/commit/6b51ca6c89de087f73e4e1770f28a494f1a27f54>`_
- Merge pull request #53 from decause/feature/logo `f55f2742a <https://github.com/fedora-infra/tahrir/commit/f55f2742ab3406e9fab5dad7ce34877aa7cb0199>`_
- Simplified logo (for use with favicon) `a96556613 <https://github.com/fedora-infra/tahrir/commit/a96556613e816b7f679a24dcbccc035326dea8a4>`_
- SVG sized to favicon dimensions `ba42e76eb <https://github.com/fedora-infra/tahrir/commit/ba42e76eb6bfb938483e8e2ac84fc81d89fb5b97>`_
- Rendered favicon `e2c007abe <https://github.com/fedora-infra/tahrir/commit/e2c007abe742c22e01d97abd503ae0bda72eea29>`_
- Pass base_url to user and badge views. `9949def50 <https://github.com/fedora-infra/tahrir/commit/9949def50d2164b13bfd66c43dc313a1e6e8d8c4>`_
- Shorten/simplify displayed page titles. `e052fcee9 <https://github.com/fedora-infra/tahrir/commit/e052fcee9221d417274dc935ec3002e93ff0ca75>`_
- Replace logo/text header with pure PNG of a Fedora Badges logo. `644d002d8 <https://github.com/fedora-infra/tahrir/commit/644d002d844f05d7809980dcdcc8fc1eee9a6fe3>`_
- Merge pull request #63 from decause/feature/logo `74b5378de <https://github.com/fedora-infra/tahrir/commit/74b5378deceec93d7313e91d1cf269ffc46982eb>`_
- Implement initial favicon. Thanks, @decause! `64a4d4698 <https://github.com/fedora-infra/tahrir/commit/64a4d46982424bec792c18eabcdd25d109a1f27c>`_
- Add a comment about the authentication secret. `ddb748625 <https://github.com/fedora-infra/tahrir/commit/ddb7486255c61fb39ac52867d24cb2302b670580>`_
- Consolidate a auth-policy-setting into the Configurator constructor. `ed0b247ae <https://github.com/fedora-infra/tahrir/commit/ed0b247ae077c61055a628d2942fb2a9e03eae8e>`_
- Merge branch 'feature/issue-61' into feature/issue-33 `05dd54a7f <https://github.com/fedora-infra/tahrir/commit/05dd54a7fc4a1906a15d1cf08f1e602d849ff327>`_
- I have groked Pyramid auth. Removal of is_admin closes #33. `1a2a0f8b5 <https://github.com/fedora-infra/tahrir/commit/1a2a0f8b54806149ed7d60473f2cb67ab37f3d7e>`_
- Merge branch 'feature/issue-33' into develop `969fc0b60 <https://github.com/fedora-infra/tahrir/commit/969fc0b60bbe1be6ce06500278670cc1f6376763>`_
- Start of actual index view column content. Testing the water. `c3213d2d9 <https://github.com/fedora-infra/tahrir/commit/c3213d2d9031328a81e3a00d9f9fc65c4c307dac>`_
- Start some database rewiring. (Commit breaks app) `ea28076a9 <https://github.com/fedora-infra/tahrir/commit/ea28076a98cedfce213c1d4e9184776390e3c7e6>`_
- Design updates. `b2588283f <https://github.com/fedora-infra/tahrir/commit/b2588283fd82b865b96abe8a896bbe67fa96389f>`_
- Moar design updates. `d8bc634c5 <https://github.com/fedora-infra/tahrir/commit/d8bc634c5327d8d2e78b85182493331196eadafe>`_
- More progress to database rewiring? (Still borked) `5f97f807a <https://github.com/fedora-infra/tahrir/commit/5f97f807adf8709d8284dc08011099ca172dab46>`_
- Move secrets to secrets.ini and add example file. Fix #65 `a0adb836a <https://github.com/fedora-infra/tahrir/commit/a0adb836a4c40142c7d0528fd87ce1a43590c6ec>`_
- Merge branch 'develop' into feature/database-rewiring `081ffccf3 <https://github.com/fedora-infra/tahrir/commit/081ffccf3f2d991324d55ae7306ef592326badf4>`_
- Success! Database connection is being rewired. `673e8150b <https://github.com/fedora-infra/tahrir/commit/673e8150b54e2d1c415a3a75a7935b6f3b395246>`_
- Forgot to remove some comments and a re-delcaration. `8e1a7bb62 <https://github.com/fedora-infra/tahrir/commit/8e1a7bb62769eb05055bea4264e1263e60bca5aa>`_
- Implement top_persons on the index view. `bc00c8636 <https://github.com/fedora-infra/tahrir/commit/bc00c86364219141b9db8ef63bc95f834942fb1d>`_
- More database rewiring. Just found a bug in API, fixing next. `361c2a9c5 <https://github.com/fedora-infra/tahrir/commit/361c2a9c569e480587c84d07cd14042e641828b1>`_
- Properly set awarded_assertions in index view. Remove unrelated cmnt. `16e1aad7f <https://github.com/fedora-infra/tahrir/commit/16e1aad7f7b0be215bc0a2feb946eba35e554168>`_
- Properly set awarded_assertions in other views that use it. `76ae27c5c <https://github.com/fedora-infra/tahrir/commit/76ae27c5cf01e9d50f831ac45a75183132436b38>`_
- Top contributors on index view is working. Thanks for help, @Qalthos! `f0bc2a2d3 <https://github.com/fedora-infra/tahrir/commit/f0bc2a2d3b1fb6a6df99ff33596fc86922ee7d4a>`_
- With API changes I just pushed, makes user and badge views work again. `cbc61ffcf <https://github.com/fedora-infra/tahrir/commit/cbc61ffcfee611b1d05e344e9c053fb1a9467fb0>`_
- Kill tw2 with fire. `e47dec624 <https://github.com/fedora-infra/tahrir/commit/e47dec62415cef4b9dd10a0b708a8645edd3598b>`_
- Update setup.py. `ff540a84a <https://github.com/fedora-infra/tahrir/commit/ff540a84adeb7ab710b4b32b7c0026fa477c9ac2>`_
- Purge more tw2. `f531f8717 <https://github.com/fedora-infra/tahrir/commit/f531f8717f11a05887cd9d4f447d8565f6c48649>`_
- Purge even more tw2/admin panel stuff. `fb1d1089a <https://github.com/fedora-infra/tahrir/commit/fb1d1089a4a34294a7fa4dba760c9303bb3b6479>`_
- Remove some comments and debugging statements. Thanks @ralphbean! `9e83a49ad <https://github.com/fedora-infra/tahrir/commit/9e83a49ad24f33549c41e55a9b7a5f392cccbc45>`_
- Remove formencode from setup.py. `49ed821bf <https://github.com/fedora-infra/tahrir/commit/49ed821bfd3c061505aca30b786dec2f385d5aa5>`_
- Merge pull request #71 from fedora-infra/feature/database-rewiring `6c2ae3a45 <https://github.com/fedora-infra/tahrir/commit/6c2ae3a4522c1e29a8d5ecd3fac4fed952c687d9>`_
- Implement badge images on index view. `cced6ef3e <https://github.com/fedora-infra/tahrir/commit/cced6ef3efed0dd7029ee19bda66d698750b9520>`_
- Formatting for dates. `313b76544 <https://github.com/fedora-infra/tahrir/commit/313b76544e37da14ad700f499c867c13e6e20eb8>`_
- Make badge image link to badge page. `fb37e29c4 <https://github.com/fedora-infra/tahrir/commit/fb37e29c4633b48c260ef23a1bfd5328272ed663>`_
- Add logic to displaying nick, site, and bio on user view. `38d39665b <https://github.com/fedora-infra/tahrir/commit/38d39665be0cc41b223cc7112ac4cccfb20d93c7>`_
- Display earned badges in user view. `a1ea8af65 <https://github.com/fedora-infra/tahrir/commit/a1ea8af65eb365dc1f1fb581a3d92c0c9fd62c16>`_
- Bump our version constraint for tahrir_api. `fdaaf1679 <https://github.com/fedora-infra/tahrir/commit/fdaaf1679ea21c095e811576312430bdc559850c>`_
- Wrong url for fork me ribbon. `93851c73b <https://github.com/fedora-infra/tahrir/commit/93851c73be92318eac5c51594d8ce50505761b48>`_
- Add logged_in to events.py global-variable-setting. `4924fa8dc <https://github.com/fedora-infra/tahrir/commit/4924fa8dcc722df4a9b5dfd17cb2f556799bc58f>`_
- Profile link takes you to the logged in user's user view! `e4a5eff7a <https://github.com/fedora-infra/tahrir/commit/e4a5eff7a34e0e1bdb548a448058199507e31903>`_
- Correct a comment. `d347eb858 <https://github.com/fedora-infra/tahrir/commit/d347eb858d6c2f1f00761f8dab381372d9c31f05>`_
- Make that ribbon out of css, please. `a1ffcf792 <https://github.com/fedora-infra/tahrir/commit/a1ffcf79201fbb9ef24c6b1ecc78d66ac788f903>`_
- Make emails link to the user view. `8f255cd71 <https://github.com/fedora-infra/tahrir/commit/8f255cd7162770ddf46702a900608d766fdf3552>`_
- Merge pull request #73 from fedora-infra/feature/fork-me-ribbon-facelift `157dcbf7b <https://github.com/fedora-infra/tahrir/commit/157dcbf7bce14999e99a6122e9b42341cb3df797>`_
- Handle logged_in_id when no one is logged in. `6382d8ce1 <https://github.com/fedora-infra/tahrir/commit/6382d8ce1339d3dfd6b01f97c3bf479581be77fd>`_
- More conservative overflow hiding. `dfdec0538 <https://github.com/fedora-infra/tahrir/commit/dfdec05384376def47099b56e05b4701d2593865>`_
- Make authentication policy use sha512 instead of md5. `6e1d40afd <https://github.com/fedora-infra/tahrir/commit/6e1d40afdde8958ffb3427ae68035fc08255a8c7>`_
- Allow user to configure what openid identifier to use.  For #36. `4cf9dcf9d <https://github.com/fedora-infra/tahrir/commit/4cf9dcf9d477a4aaef60b02b44004ac5b2650e4d>`_
- Pull their nickname from fas or make one up from their email when they first login.  Fixes #67. `6e49bd022 <https://github.com/fedora-infra/tahrir/commit/6e49bd0227d6d3193e1599aa1e23d3fbef114ee2>`_
- Formatting and display stuff for the index view. `f9cf2ec20 <https://github.com/fedora-infra/tahrir/commit/f9cf2ec2098ef34daeca20eebe55f715ebc3e547>`_
- Raise an appropriate error if the user DNE. `074c694e3 <https://github.com/fedora-infra/tahrir/commit/074c694e3557e659278237a6012d8b85f4913899>`_
- This could be simpler. `41149e076 <https://github.com/fedora-infra/tahrir/commit/41149e076cb52edf024b6374a5c2c85f1645c246>`_
- Merge pull request #74 from fedora-infra/feature/openid-enhancements `bfc0d65a0 <https://github.com/fedora-infra/tahrir/commit/bfc0d65a0867e991ea614b97a91c933d80249b77>`_
- Improvements to first column of badge view. `213ebe624 <https://github.com/fedora-infra/tahrir/commit/213ebe62489265a7966a59797e63e8393f95b0d7>`_
- Simplify the user view code.  Allow lookup by nickname.  Fixes #68. `ecb0dcec3 <https://github.com/fedora-infra/tahrir/commit/ecb0dcec373e7b80fd520aeb53250a44142519d4>`_
- Merge pull request #76 from fedora-infra/feature/user-view `bf8aa12df <https://github.com/fedora-infra/tahrir/commit/bf8aa12df3fff9befdcfba38252e04da09588cd9>`_
- Readme tweaks and updates. `823579585 <https://github.com/fedora-infra/tahrir/commit/8235795859e7534bca42e29794b9340bf77c65be>`_
- Properly sort newest persons list. `c1ab9cca5 <https://github.com/fedora-infra/tahrir/commit/c1ab9cca5fef17b594cfa7312a3758e48ac8a992>`_
- Apply a mobile stylesheet. Let's see how this looks on my Android phone. `639d087bd <https://github.com/fedora-infra/tahrir/commit/639d087bd584e600b8ed6949af7072218548c1bd>`_
- Eh, doesn't look like it did much. Let's try this one. `b855e59cd <https://github.com/fedora-infra/tahrir/commit/b855e59cd61cfcde71f817507fa9b7ef7a35bc70>`_
- Added a section to the README on deployment.  Fixes #17. `5144a3384 <https://github.com/fedora-infra/tahrir/commit/5144a3384241de010cf27c25b6f97be81b2a87e6>`_
- Add skeleton of Add Person form to admin view. `2a2435003 <https://github.com/fedora-infra/tahrir/commit/2a24350035a72a43ab1f2be57e1a0e4b60466e31>`_
- Simplify action view. `7fb4b23b9 <https://github.com/fedora-infra/tahrir/commit/7fb4b23b9f80a46c678b63a7a8d453395a216ab0>`_
- Pay no attention to the man behind the screen. `f214db06b <https://github.com/fedora-infra/tahrir/commit/f214db06b1aa94fd71b7e5f70f7a10d28df6ff09>`_
- More admin form skeleton stuff. Done for now. `f54a0e4ee <https://github.com/fedora-infra/tahrir/commit/f54a0e4ee67919b1486dc97f73e45e20a9a7f567>`_
- Generate URLs with request.{route,resource}_url. `2aba3a337 <https://github.com/fedora-infra/tahrir/commit/2aba3a3378c7b9d3052f52fcfc9e7a85f0fa2321>`_
- Make the Assertion resources location-aware. `83052e183 <https://github.com/fedora-infra/tahrir/commit/83052e183d413fe0e5f7378b9f3a5b116fd5ae47>`_
- Merge pull request #78 from fedora-infra/feature/generated_urls `73b18d7d6 <https://github.com/fedora-infra/tahrir/commit/73b18d7d6d8dc33449d8437714cd4c039e92efb3>`_
- Set development.ini to use the port I was using in my old .ini file. `bb5259339 <https://github.com/fedora-infra/tahrir/commit/bb52593399b22b256f961394ddd3e2e690e3b38a>`_
- Make the server not start if secret.ini fails to load. `e15141840 <https://github.com/fedora-infra/tahrir/commit/e15141840505448f54e1c0b7b850f6cd58780cb8>`_
- Remove some hardcoding of locations. For #77. `11acd8027 <https://github.com/fedora-infra/tahrir/commit/11acd802779a0af4c57a7df35f2eaf8a8185a050>`_
- Make admin panel use tables. More form HTML. `be1ed1d11 <https://github.com/fedora-infra/tahrir/commit/be1ed1d111802a3fc1d28808c16234205fe6052c>`_
- Remove some straggling tags. `8321ee74f <https://github.com/fedora-infra/tahrir/commit/8321ee74fec052ce0b092d269411892a45dcfa2b>`_
- Add HTML for more admin forms. All tables covered. `b16f720e1 <https://github.com/fedora-infra/tahrir/commit/b16f720e123b634cc1d783a47b105db8e9143d3f>`_
- Start of badge builder. `5bb1399a5 <https://github.com/fedora-infra/tahrir/commit/5bb1399a5f7d5a7d920ce074b72576ef08c87adf>`_
- Working on the JavaScript to update the YAML in real-time. `4063eda11 <https://github.com/fedora-infra/tahrir/commit/4063eda1135c8a32d26051a15e3900bb0cb3124b>`_
- Make some things on the start of the badge builder nicer. `1c7652d1f <https://github.com/fedora-infra/tahrir/commit/1c7652d1f7b4f8fbff6afd8092ccb754033cc483>`_
- Badge builder properly builds first section of YAML. Onto the rest! `ce2d15bd9 <https://github.com/fedora-infra/tahrir/commit/ce2d15bd94811f6256528fb0901d0a370b0acd1c>`_
- All sections in badge builder operating as expected. `7bff75e00 <https://github.com/fedora-infra/tahrir/commit/7bff75e00c95a528944adfdbe4ce8ead9ae2d9bf>`_
- Add ability to choose if builder preview is read-only. `76526c331 <https://github.com/fedora-infra/tahrir/commit/76526c331e3a0b8926fd319286fb48dff7110794>`_
- Eliminate trigger field from YAML builder. `09a18c6cc <https://github.com/fedora-infra/tahrir/commit/09a18c6cc23d55d57c5a0cbefb563dc8407b58d3>`_
- Set default builder creator to currently auth'd user (if one exists) `1bb99fddb <https://github.com/fedora-infra/tahrir/commit/1bb99fddbdeb571ac2cffec2ad42591952abcdb5>`_
- Python generation of badge YAML. Mako not honouring newlines. :/ `961f9e31c <https://github.com/fedora-infra/tahrir/commit/961f9e31c1b29108a578afa92e2e694bc0d85e6d>`_
- YAML builder now generates file via Python. JS preview cmnt'd out. `ee8bce40f <https://github.com/fedora-infra/tahrir/commit/ee8bce40f2cb6dc692f0b7c4b607ed7b63ad4766>`_
- Fix improperly-referenced input. `ec8e1fa69 <https://github.com/fedora-infra/tahrir/commit/ec8e1fa69293e280b9b6b0ca634ef39539195453>`_
- Merge pull request #80 from fedora-infra/feature/yaml-builder `5413b275d <https://github.com/fedora-infra/tahrir/commit/5413b275db427a708fbc5d57efb44d35330dc331>`_
- Optimized JS by eliminating repeated jQuery selector calls to div.popup, and chaining operations. `b680a6836 <https://github.com/fedora-infra/tahrir/commit/b680a68369e45e77a6e6a87f2cc67c3c4a549738>`_
- Remove all hardcoded view + statci links in templates. For #77. `d9d316031 <https://github.com/fedora-infra/tahrir/commit/d9d316031af77aaf366af247283cbb92a742a8f9>`_
- Merge pull request #81 from CDeLorme/develop `041a63991 <https://github.com/fedora-infra/tahrir/commit/041a6399125c57120eae9d86570103308882d4af>`_
- Not-yet-working admin panel stuff. Fell down a bit of a rabbit hole on another project. `75d912f2a <https://github.com/fedora-infra/tahrir/commit/75d912f2a5375e91fa41b354b6171ddc0724f139>`_
- Make admin forms actually POST. `9576d2ec0 <https://github.com/fedora-infra/tahrir/commit/9576d2ec0c9374b15ca13ba9125d4bfde4323ce8>`_
- Add Person admin form functioning properly. `d8614b42a <https://github.com/fedora-infra/tahrir/commit/d8614b42a2068832f4ff593f54ce52ed4d5ca330>`_
- Add functionality to add badge form on admin panel. `328803581 <https://github.com/fedora-infra/tahrir/commit/328803581ca9b231022fb8d6c3dbcda6efae9249>`_
- Expose badge tags on badge view. `302f3e531 <https://github.com/fedora-infra/tahrir/commit/302f3e531e8d0721c82e9dfeb0b013378069e7e6>`_
- All Add admin panel things are working as expected. `3dd65f3e0 <https://github.com/fedora-infra/tahrir/commit/3dd65f3e01f9586a4c289e1b3be77df861186dca>`_
- Frontpage avatar stuff. `55c504267 <https://github.com/fedora-infra/tahrir/commit/55c504267cf5703dfb0fc59cd2bec0ce47911294>`_
- Merge pull request #84 from fedora-infra/feature/avatars `2b441d896 <https://github.com/fedora-infra/tahrir/commit/2b441d896f31ea301f333cd4852536eebd5bc25f>`_
- Start of leaderboard. `72785e980 <https://github.com/fedora-infra/tahrir/commit/72785e98095c6597b74e8f5325534f1739f5e36d>`_
- Leaderboard additions, plus secondary sorting on top users everywhere! `eefbe9aed <https://github.com/fedora-infra/tahrir/commit/eefbe9aeddfee5fcb80194a572e53adda403db5a>`_
- Leaderboard improvements. `86a9e4249 <https://github.com/fedora-infra/tahrir/commit/86a9e42494837287f900805f75e843d1d77bd2d2>`_
- Add top_persons_sorted functionality to index view, too. `29f52079d <https://github.com/fedora-infra/tahrir/commit/29f52079d448fe8d77a813d7b4855bdc6455831a>`_
- Leaderboard data formatting. `4f322304e <https://github.com/fedora-infra/tahrir/commit/4f322304e57b6bc5de01cb47ae36b838096b708b>`_
- Move padded-content div to its proper place. `7fb787e80 <https://github.com/fedora-infra/tahrir/commit/7fb787e800ce47e0e46ffe9a03b2de385323ae2f>`_
- Add competitors list to leaderboard, plus fix sorting! `c6ac15125 <https://github.com/fedora-infra/tahrir/commit/c6ac15125b1e14311525d77c2b0edccc2966ee3e>`_
