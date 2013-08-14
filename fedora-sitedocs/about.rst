What Is This?
=============

This is `Fedora Badges <https://badges.fedoraproject.org>`_, a fun website
built to highlight contributors to the Fedora Project and to expose and hint at
different ways new people can get involved.

.. image:: http://oddshocks.com/presentations/fedora_badges/badges_fan.png
   :alt: Fedora Badges

*Fun Fact* - Your achievements aren't jailed in a silo. -- Fedora Badges was
built to interface with Mozilla's `Open Badges Infrastructure
<https://openbadges.org>`_.  Check out the "Export Badges" button on your
Profile page.

How does it work?
-----------------

It's pretty cool.  Fedora Badges takes advantage of `fedmsg
<http://fedmsg.com>`_ (Fedora Infrastructure's Message Bus)
and `datanommer <https://apps.fedoraproject.org/datagrepper>`_
to be determine what kinds of contributions a person is making.

The badge awarding backend daemon, `fedbadges
<https://github.com/fedora-infra/fedbadges>`_, wakes up when it receives a
fedmsg event.  It compares that message and the history in datanommer against a
series of rules.  If a contributor matches the criteria described in one of
those rules, then they are **awarded a badge** in real time.

The frontend that you're looking at now is a web application called `tahrir
<https://github.com/fedora-infra/tahrir>`_.  We tried as much as we could to
keep Tahrir "brand agnostic", so you can install it, run it on your own
platform, and issue badges to your friends!  Some assembly required.

Frequently Asked Questions (FAQ)
================================

I'm new and I don't have any badges.  How do I get some?
--------------------------------------------------------

Check out the `exploration <https://badges.fedoraproject.org/explore>`_ page to
see the full list.  Badges describe briefly what you have to do to get them but
we intentionally didn't spell it all out exactly.  Part of the fun is figuring
it out!

Is there a community that made this thing?
------------------------------------------

Lots of people have contributed to the `frontend
<https://github.com/fedora-infra/tahrir/graphs/contributors>`_ and the `backend
<https://github.com/fedora-infra/fedbadges/graphs/contributors>`_.  We hang out
in ``#fedora-apps`` on freenode, we have a `mailing list
<https://lists.fedoraproject.org/mailman/listinfo/badges>`_, and a `wiki SIG
page <https://fedoraproject.org/wiki/Open_Badges>`_.


Can I submit new badge ideas?
-----------------------------

Yes!  And you can do so at the `fedora-badges fedorahosted.org page
<https://fedorahosted.org/fedora-badges>`_.  Give the pages there a read,
`@adamw <https://twitter.com/AdamW_Fedora>`_ worked really hard to create
a process both easy for you to submit ideas and for us to review and implement
them.

How long has the badge awarder been running?
--------------------------------------------

Since August 7th, 2013.

How long has datanommer been storing the fedmsg history?
--------------------------------------------------------

Since October 16th, 2012 `[1]
<http://threebean.org/blog/datanommer-and-fedmsg-activity/>`_.

I'm in the Proven Packager group and I don't have the Proven Packager badge.  What's up with that?
--------------------------------------------------------------------------------------------------

First, remember that the badge awarding daemon wakes up in response to new
`fedmsg <http://fedmsg.com>`_ events and that it checks the `history of fedmsg
<https://apps.fedoraproject.org/datagrepper>`_ in order to make determinations
about who gets what badge at that moment.

To award that Proven Packager badge, the awarder waits for `a message
<http://www.fedmsg.com/en/latest/topics/#fas-group-member-sponsor>`_ from the
`Fedora Account System (FAS) <https://admin.fedoraproject.org/accounts>`_
indicating that a user has been added to that group.  When we receive it, we
wake up, verify it, and award the badge.

Since you've been a member of that group for longer than the badge awarder has
been running it has never had the occasion to check if you should be awarded
the badge.  At the time of the launch of Fedora Badges, we've been working
around this by manually running a script every few days that doles out these
group-based badges to newly-logged-in users.  We really should put it in a
cronjob to make our lives easier.

I've been submitting Koji builds since you were in diapers and I don't have any badges.  How is this possible!?
---------------------------------------------------------------------------------------------------------------

Again, remember that the badge awarding daemon wakes up in response to new
`fedmsg <http://fedmsg.com>`_ events and that it checks the `history of fedmsg
<https://apps.fedoraproject.org/datagrepper>`_ in order to make determinations
about who gets what badge.

The fedmsg project only started in 2012 and the history only `started being
tracked in October of that year
<http://threebean.org/blog/datanommer-and-fedmsg-activity/>`_.  Koji events
didn't come until much later, until January 2013.  So Fedora Badges only knows
about your builds since then.  Don't be disheartened!  There's so much more
to hack and do.
