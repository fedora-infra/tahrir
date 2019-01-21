Installing Tahrir
=================

You can install Tahrir to test it out with ``pip``::

    pip install tahrir

Deploying a Tahrir Instance
---------------------------

If you want to deploy your own Tahrir instance for reals, these are the
instructions you want.

Tahrir is `packaged for Fedora and epel6
<https://apps.fedoraproject.org/packages/python-tahrir>`_. The authors use an
`Ansible <http://ansibleworks.com>`_ playbook to deploy Tahrir in production.

You can look at Fedora's `Ansible repository
<http://infrastructure.fedoraproject.org/infra/ansible/>`_, `Tahrir playbook
<http://infrastructure.fedoraproject.org/infra/ansible/playbooks/groups/badges-web.yml>`_,
and `Tahrir Ansible role
<http://infrastructure.fedoraproject.org/infra/ansible/roles/badges-frontend/>`_ to learn how
Fedora has deployed the application.

Configuration
-------------

You can get a sample configuration file suitable for production instances
like so::

    $ wget https://raw.github.com/fedora-infra/tahrir/master/production.ini -O
    tahrir.ini
