tahrir
======

tahrir is `Arabic for Liberation <http://en.wikipedia.org/wiki/Tahrir_Square>`_.

tahrir is also a `Pyramid <http://www.pylonsproject.org/>`_ app for issuing
your own `Open Badges <https://wiki.mozilla.org/Badges>`_.

The name is total overkill.

Installing
----------

::

    $ sudo pip install tahrir

Building a configuration file
-----------------------------

Get a sample configuration file::

    $ wget https://raw.github.com/ralphbean/tahrir/master/production.ini -O tahrir.ini

And edit it to your liking.  In particular you will need to change the following
values under the ``[server:main]`` section:

 - ``host``
 - ``port``

And the following values undre the ``[app:pyramid]`` section:

  - ``tahrir.salt``
  - ``tahrir.admin``
  - ``tahrir.title``
  - ``tahrir.pngs.uri``
  - ``tahrir.base_url``

Setting up the DB
-----------------

::

    $ initialize_tahrir_db tahrir.ini

Running
-------

::

    $ pserve tahrir.ini

Hacking
-------

If you'd like to contribute to tahrir or just poke at the code, you can use the
following instructions to set up a development environment.

::

    $ sudo yum -y install python-virtualenvwrapper
    $ git clone git://github.com/ralphbean/tahrir.git
    $ cd tahrir
    $ mkvirtualenv tahrir
    (tahrir)$ python setup.py develop
    (tahrir)$ initialize_tahrir_db development.ini
    (tahrir)% pserve --reload development.ini
