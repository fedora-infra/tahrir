tahrir
======

tahrir is `Arabic for Liberation
<http://en.wikipedia.org/wiki/Tahrir_Square>`_.

tahrir is also a `Pyramid <http://www.pylonsproject.org/>`_ app for issuing
your own `Open Badges <https://wiki.mozilla.org/Badges>`_.

The name is total overkill.

You can see a deployed staging instance of it `here <https://apps.stg.fedoraproject.org/badges>`_.

Deploying for reals
-------------------

It's `packaged for Fedora and epel6
<https://apps.fedoraproject.org/packages/python-tahrir>`_.  The authors use an
`ansible <http://ansibleworks.com>`_ playbook to deploy tahrir in production.
You can find our repo `here
<http://infrastructure.fedoraproject.org/infra/ansible/>`_, our playbook `here
<http://infrastructure.fedoraproject.org/infra/ansible/playbooks/groups/badges-web.yml>`_,
and our tahrir role `here
<http://infrastructure.fedoraproject.org/infra/ansible/roles/badges-frontend/>`_.

Installing... just to try it out
--------------------------------

You can always::

    $ pip install tahrir

Building a configuration file
-----------------------------

Get a sample configuration file::

    $ wget https://raw.github.com/ralphbean/tahrir/master/production.ini -O
    tahrir.ini

And edit it to your liking.  In particular you will need to change the
following values under the ``[server:main]`` section:

 - ``host`` = yoursite.com
 - ``port`` = 80

And the following values under the ``[app:pyramid]`` section:

  - ``tahrir.admin`` = "some super secret string used to login as admin"
  - ``tahrir.title`` = "just badgin' around"
  - ``tahrir.pngs.uri`` = /home/user/badges/pngs
  - ``tahrir.base_url`` = "yoursite.com"

Setting up the DB
-----------------

::

    $ initialize_tahrir_db tahrir.ini

Running
-------

::

    $ pserve tahrir.ini

Reporting Bugs
--------------

If you find bugs in Tahrir or have ideas for enhancements, please report them
at http://github.com/fedora-infra/tahrir/issues.

Hacking
-------

If you'd like to contribute to tahrir or just poke at the code, you can use the
following instructions to set up a development environment.

Create an account on Fedora Account Systems (FAS) here:
https://admin.fedoraproject.org/accounts Make sure you have Python 2.7 or above
installed in your system Then, install the Python version of virtualenvwrapper
(in Ubuntu):

::
    
	$ sudo apt-get install python-setuptools
	$ sudo apt-get install python-virtualenv
	$ sudo easy-install pip
	$ sudo pip install python-virtualenvwrapper

In Fedora, you can do the same by:

::

	$ sudo yum -y install python-virtualenvwrapper

After installing virtualenvwrapper, you'll need to set it up for the
first time::

    $ export WORKON_HOME=~/.virtualenvs/
    $ mkdir -p $WORKON_HOME
    $ source /usr/local/bin/virtualenvwrapper.sh

You'll want to add the ``source /usr/local/bin/virtualenvwrapper.sh`` to
your bashrc.

Then, to set up Tahrir, follow these steps:

::

	$ git clone git://github.com/fedora-infra/tahrir.git
	$ cd tahrir
	$ mkvirtualenv tahrir
	(tahrir)$ python setup.py develop
	(tahrir)$ initialize_tahrir_db development.ini
	(tahrir)% pserve --reload development.ini

The pserve command should output "starting HTTP server on
https://localhost:6543" Login to https://localhost:6543 in your web browser
(Firefox) using your FAS account username and password.  In order to make
yourself an admin of the local copy of tahrir, edit the "development.ini" file
by changing the value to "YOUR_FAS_USERNAME@fedoraproject.org" and login. You
should now be able to see the admin view of tahrir in your local copy at
http://localhost:6543/admin.

Windows (32 and 64 bit versions):
---------------------------------

For problems like::

    c:\env\tahrir>c:\env\Scripts\initialize_tahrir_db development.ini
    Error: pkg_resources.DistributionNotFound: simplejson

and::

    c:\env\tahrir>c:\env\Scripts\easy_install simplejson
    Error: raise ValueError(str(list(result.keys())))
    ValueError: [u'path']

Follow these instructions:

1.  Download and install mingw from
    http://code.google.com/p/mingw-builds/downloads/detail?name=i686-mingw32-gcc-4.7.0-release-c,c%2b%2b,fortran-sjlj.zip&can=2&q=
    Extract the contents of this folder to ``c:\mingw``

2.  Download and install setuptools if not already present. This can be done by running ez_setup.py from c:\Python2x

3.  Create a configuration file for distutils i.e. create a file distutils.cfg at the following location::

        C:\Python2x\Lib\distutils\distutils.cfg

    Add the following lines to it::

        [build]
        compiler=mingw32

4.  Now open command prompt and use easy_install to install simplejson::

        C:\env\tahrir>c:\env\Scripts\easy_install simplejson

This will install simplejson in Python2x\Lib\site-packages\ A few other
packages namely httplib2, may have to be installed the same way before the
``initialize_tahrir_db`` command can be executed.
