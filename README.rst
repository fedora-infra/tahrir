tahrir
======

tahrir is `Arabic for Liberation <http://en.wikipedia.org/wiki/Tahrir_Square>`_.

tahrir is also a `Pyramid <http://www.pylonsproject.org/>`_ app for issuing
your own `Open Badges <https://wiki.mozilla.org/Badges>`_.

It is in pre-alpha.

The name is total overkill.

Getting Started With Development
--------------------------------

::

    $ sudo yum -y install python-virtualenvwrapper
    $ git clone git://github.com/ralphbean/tahrir.git
    $ cd tahrir
    $ mkvirtualenv tahrir
    (tahrir)$ python setup.py develop
    (tahrir)$ initialize_tahrir_db development.ini
    (tahrir)% pserve --reload development.ini
