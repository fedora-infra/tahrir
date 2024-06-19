Installing Tahrir
=================

You can install Tahrir to test it out with ``pip``::

    pip install tahrir


Deploying a Tahrir Instance
---------------------------

If you want to deploy your own Tahrir instance for reals, these are the
instructions you want.

Tahrir is `packaged for Fedora and epel6
<https://packages.fedoraproject.org/pkgs/python-tahrir/>`_.
The authors use `OpenShift <https://www.okd.io/>`_ to deploy Tahrir in production.

You can look at Fedora's `Ansible repository
<http://infrastructure.fedoraproject.org/infra/ansible/>`_, `Tahrir playbook
<http://infrastructure.fedoraproject.org/infra/ansible/playbooks/openshift-apps/badges.yml>`_,
and `Tahrir OpenShift Ansible role
<http://infrastructure.fedoraproject.org/infra/ansible/roles/openshift-apps/badges/>`_
to learn how Fedora has deployed the application.


Configuration
-------------

You can look at the `configuration file
<https://infrastructure.fedoraproject.org/infra/ansible/roles/openshift-apps/badges/templates/tahrir.cfg.py>`_
that Fedora uses for their production instance.

The default configuration values are in the `defaults.py
<https://github.com/fedora-infra/tahrir/blob/develop/tahrir/defaults.py>`_ file.
