Tahrir
======

Tahrir is `Arabic for Liberation
<http://en.wikipedia.org/wiki/Tahrir_Square>`_.

Tahrir is also a `Pyramid <http://www.pylonsproject.org/>`_ app for issuing
your own `Open Badges <https://wiki.mozilla.org/Badges>`_.

The name is total overkill.

You can see Tahrir deployed in production `here
<https://badges.fedoraproject.org/>`_. The staging instance lives `here
<https://badges.stg.fedoraproject.org/>`_.

(On the side, if you have ideas for new *Fedora* badges, you can file them on
`this trac instance <https://fedorahosted.org/fedora-badges/>`_.)

The development team hangs out in ``#fedora-apps`` on freenode.  Join and ask
if you have any questions!

Installing... just to try it out
--------------------------------

You can always::

    $ pip install tahrir

Deploying for reals
-------------------

It's `packaged for Fedora and epel6
<https://apps.fedoraproject.org/packages/python-tahrir>`_.  The authors use an
`Ansible <http://ansibleworks.com>`_ playbook to deploy Tahrir in production.

You can find our repo `here
<http://infrastructure.fedoraproject.org/infra/ansible/>`_, our playbook `here
<http://infrastructure.fedoraproject.org/infra/ansible/playbooks/groups/badges-web.yml>`_,
and our tahrir role `here
<http://infrastructure.fedoraproject.org/infra/ansible/roles/badges-frontend/>`_.

Building a configuration file
-----------------------------

Get a sample configuration file::

    $ wget https://raw.github.com/fedora-infra/tahrir/master/production.ini -O
    tahrir.ini

Edit it to your liking.  In particular you will need to change the
following values under the ``[server:main]`` section:

 - ``host`` = yoursite.com
 - ``port`` = 80

And the following values under the ``[app:pyramid]`` section:

  - ``tahrir.admin`` = "comma-delimited list of admin email addresses"
  - ``tahrir.title`` = "just badgin' around"
  - ``tahrir.pngs.uri`` = /home/user/badges/pngs
  - ``tahrir.base_url`` = "yoursite.com"

Setting up the DB
-----------------

Run the following command before starting the server::

    $ initialize_tahrir_db tahrir.ini

Running
-------

Start the server like so (subsitute ``tahrir.ini`` with the ``.ini`` file
you want to use::

    $ pserve tahrir.ini

You can pass the ``--reload`` flag to this command to automatically restart
the server in the event that the code is altered.

Reporting Bugs
--------------

If you find bugs in Tahrir or have ideas for enhancements, please report them
at https://github.com/fedora-infra/tahrir/issues.

Hacking
-------

If you'd like to contribute to Tahrir or just poke at the code, you can use the
following instructions to set up a development environment.

Create an account on Fedora Account Systems (FAS) at
https://admin.fedoraproject.org/accounts. Make sure you have Python 2.7 or
above installed on your system. Then, install the Python version of
virtualenvwrapper (in Fedora)::

	$ sudo dnf -y install python-virtualenvwrapper

In Ubuntu, you can do the same with::

	$ sudo apt-get install python-setuptools
	$ sudo apt-get install python-virtualenv
	$ sudo easy-install pip
	$ sudo pip install python-virtualenvwrapper

After installing virtualenvwrapper, you'll need to set it up for the
first time::

    $ export WORKON_HOME=~/.virtualenvs/
    $ mkdir -p $WORKON_HOME
    $ source /usr/bin/virtualenvwrapper.sh

You'll want to add ``source /usr/bin/virtualenvwrapper.sh`` to
your ``.bashrc``.

Then, to set up Tahrir, follow these steps::

	$ git clone git://github.com/fedora-infra/tahrir.git
	$ cd tahrir
	$ mkvirtualenv tahrir
	(tahrir)$ python setup.py develop
	(tahrir)$ cp development.ini.example development.ini
	(tahrir)$ cp secret.ini.example secret.ini
	(tahrir)$ initialize_tahrir_db development.ini
	(tahrir)$ pserve --reload development.ini

The pserve command should output "starting HTTP server on
https://localhost:8000". Login to https://localhost:8000 in your web browser
using your FAS account username and password.  In order to make
yourself an admin of the local copy of tahrir, edit the ``development.ini`` file
and append ``YOUR_FAS_USERNAME@fedoraproject.org`` to the ``tahrir.admin`` option.
When you login, you should now be able to see the admin view of tahrir in your
local copy at http://localhost:8000/admin.

Hacking
=======

Hacking with Vagrant
--------------------
Quickly start hacking on tahrir using the vagrant setup that is included in the
tahrir repo is super simple.

First, install Ansible, Vagrant, the vagrant-sshfs plugin, and the vagrant-libvirt
plugin from the official Fedora repos::

    $ sudo dnf install ansible vagrant vagrant-libvirt vagrant-sshfs


Now, from within main directory (the one with the Vagrantfile in it) of your git
checkout of tahrir, copy the Vagrantfile.example file to Vagrantfile:

   $ cp Vagrantfile.example Vagrantfile

Run the ``vagrant up`` command to provision your dev environment::

    $ vagrant up

When this command is completed (it may take a while) start tahrir with the
following command:

    $ vagrant ssh -c"cd /vagrant/; pserve --reload development.ini"

Once that is running, simply go to http://localhost:8000/ in your browser on
your host to see your running tahrir test instance.

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
    Extract the contents of this folder to ``c:\mingw``.

2.  Download and install setuptools if not already present. This can be done by
    running ez_setup.py from c:\Python2x.

3.  Create a configuration file for distutils i.e. create a file distutils.cfg
    at the following location::

        C:\Python2x\Lib\distutils\distutils.cfg

    Add the following line to it::

        [build] compiler=mingw32

4.  Now open command prompt and use easy_install to install simplejson::

        C:\env\tahrir>c:\env\Scripts\easy_install simplejson

This will install simplejson in Python2x\Lib\site-packages\. A few other
packages -- namely httplib2 -- may have to be installed the same way before the
``initialize_tahrir_db`` command can be executed.
