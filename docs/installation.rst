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

You can find our repo `here
<http://infrastructure.fedoraproject.org/infra/ansible/>`_, our playbook `here
<http://infrastructure.fedoraproject.org/infra/ansible/playbooks/groups/badges-web.yml>`_,
and our Tahrir Ansible role `here
<http://infrastructure.fedoraproject.org/infra/ansible/roles/badges-frontend/>`_.

Configuration
-------------

You can get a sample configuration file suitable for production instances
like so::

    $ wget https://raw.github.com/fedora-infra/tahrir/master/production.ini -O
    tahrir.ini
