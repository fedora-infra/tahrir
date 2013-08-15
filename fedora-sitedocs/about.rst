Fedora Badges
=============

`Fedora Badges <https://badges.fedoraproject.org>`_ is a fun website built to recognize contributors to the `Fedora Project <https://fedoraproject.org>`_, help new and existing Fedora contributors find different ways to get involved, and encourage the improvement of Fedora's infrastructure.

.. image:: http://oddshocks.com/presentations/fedora_badges/badges_fan.png
   :alt: Fedora Badges

How does Badges work?
---------------------

It's really easy! Just `sign in to Badges <https://badges.fedoraproject.org/login>`_ with your `Fedora account <https://admin.fedoraproject.org/accounts/>`_, and you'll see you have at least one badge right away. Congratulations - you're a Badger! If you participate in Fedora in any way, you'll probably notice Badges popping up on your profile as you go about your business, though sadly we don't cover every area of Fedora yet - we're doing our best to make sure we reward as many forms of participation as we can!

Want to see how your badge collection compares with others? Check the `Leaderboard <https://badges.fedoraproject.org/leaderboard>`_. Jonesing for more badges? You can check the `Badge index <https://badges.fedoraproject.org/explore/badges>`_ to see all the badges and get to work on your collection! Click on a badge to see how to get it - but
we intentionally didn't spell it all out exactly. Part of the fun is figuring it out!

Another cool thing: the Badges site is mobile-optimized, so you can easily keep track of your badges on the go!

Why don't I have all the Badges I should?
-----------------------------------------

There are a few reasons why unfortunately you might not get some badges you would expect to receive. First of all, the infrastructure that underlies Badges has only been running since late 2012 (and some pieces since early 2013), and so for many Badges, we can't take contributions from before those dates into account. We're really sorry. We wish we could. We've filed a ticket requesting someone build us a time machine; logically speaking, though, if it was going to be closed, `it would've been closed immediately <http://boardgamegeek.com/boardgame/2297/us-patent-number-1>`_...

Secondly, in the case of some badges, you need to perform one action after signing up for Badges, to sort of 'prime the pump' (this is not really how it works. No pumps are involved. We've checked.) The `Curious Penguin (Ask Fedora II) <https://badges.fedoraproject.org/badge/curious-penguin-ask-fedora-ii>`_ Badge, for instance, requires you to ask or answer ten questions at `Ask Fedora <https://ask.fedoraproject.org>`_. When you first join Badges, even if you've already done this, you won't see the badge - but as soon as you ask or answer just one more question, you'll get it.

A special case of this problem affects Badges awarded for things you did before joining Badges, which you can't really do again - for instance, the `Proven Packager badge <https://badges.fedoraproject.org/badge/proven-packager>`_, which is awarded when you join that group. We run a script to check for and award most of these badges regularly, so just sit back and be a patient Badger and you'll see them soon!

Who made it?
------------

Lots of people have contributed to the `frontend <https://github.com/fedora-infra/tahrir/graphs/contributors>`_ and the `backend <https://github.com/fedora-infra/fedbadges/graphs/contributors>`_. Various people have also `contributed Badge ideas, art and definitions <https://fedorahosted.org/fedora-badges/report/18>`_. We hang out in ``#fedora-apps`` on freenode, we have a `mailing list <https://lists.fedoraproject.org/mailman/listinfo/badges>`_, and a `wiki SIG page <https://fedoraproject.org/wiki/Open_Badges>`_.

Can I submit new badge ideas and help build badges?
---------------------------------------------------

Yes! We'd love you to! Just head over to the `new badge tracker <https://fedorahosted.org/fedora-badges>`_. If you want to submit a new badge idea, take a look at the `new badge guide <https://fedorahosted.org/fedora-badges/wiki/NewBadgeGuide>`_. If you're looking to contribute art or code to a badge, you'll find some useful links on the front page of the site.

Can I help work on the technologies that underlie Badges?
---------------------------------------------------------

Absolutely! Please join us! Starting at the bottom of the stack:

- `fedmsg`_ is the Fedora message bus that most badges ultimately rely on
- `datanommer`_ pulls every fedmsg message into a database
- `fedbadges`_ is the actual badge awarder
- `tahrir`_ is the frontend you're looking at right now
- `tahrir-api`_ is the API for tahrir

Technical Questions and Details
===============================

Once more, with feeling: How does Badges work?
----------------------------------------------

If you mean how does it WORK work, it's pretty cool! Fedora Badges takes advantage of `fedmsg`_ (Fedora Infrastructure's Message Bus) and `datanommer`_ to determine what kinds of contributions a person is making.

The badge awarding backend daemon, `fedbadges`_, wakes up when it receives a fedmsg event. It compares that message and the history in datanommer against a series of `rules <https://git.fedorahosted.org/cgit/badges.git>`_. If a contributor matches the criteria described in one of those rules, then they are **awarded a badge** in real time.

The frontend that you're looking at now is a web application called `tahrir`_. We tried as much as we could to keep Tahrir "brand agnostic", so you can install it, run it on your own platform, and issue badges to your friends! Some assembly required.

How long has the badge awarder been running?
--------------------------------------------

Since August 7th, 2013.

How long has datanommer been storing the fedmsg history?
--------------------------------------------------------

Since October 16th, 2012 `[1]
<http://threebean.org/blog/datanommer-and-fedmsg-activity/>`_.

Why exactly can't badges for events be automatically awarded retrospectively?
-----------------------------------------------------------------------------

First, remember that the badge awarding daemon wakes up in response to new `fedmsg`_ events and that it checks the `history of fedmsg <https://apps.fedoraproject.org/datagrepper>`_ in order to make determinations
about who gets what badge at that moment.

To award that Proven Packager badge, the awarder waits for `a message <http://www.fedmsg.com/en/latest/topics/#fas-group-member-sponsor>`_ from the `Fedora Account System (FAS) <https://admin.fedoraproject.org/accounts>`_ indicating that a user has been added to that group. When we receive it, we wake up, verify it, and award the badge.

Since you've been a member of that group for longer than the badge awarder has been running it has never had the occasion to check if you should be awarded the badge. At the time of the launch of Fedora Badges, we've been working
around this by manually running a script every few days that doles out these group-based badges to newly-logged-in users. We really should put it in a cronjob to make our lives easier.

Of course, we can't use a simple script to retroactively award badges based on large and complex pre-fedmsg activity like package builds, so many Badgers won't have as many badges for package builds and similar activity as they really ought to. The fedmsg project only started in 2012 and the history only `started being tracked in October of that year
<http://threebean.org/blog/datanommer-and-fedmsg-activity/>`_. Koji events didn't come until much later, until January 2013. So Fedora Badges only knows about your builds since then. Don't be disheartened! There's so much more to hack and do.

There's a tentative plan to write a bigger script that will go back over old Koji logs and so on, generate appropriate fedmsg messages but (of course!) not actually broadcast them, and instead feed them straight into datanommer. That should let us catch up on a lot of old activity.

.. _fedmsg: http://fedmsg.com/
.. _datanommer: https://apps.fedoraproject.org/datagrepper
.. _fedbadges: https://github.com/fedora-infra/fedbadges
.. _tahrir: https://github.com/fedora-infra/tahrir
.. _tahrir-api: https://github.com/fedora-infra/tahrir-api
