## Setup a local development environment

To quickly start hacking on tahrir we provide a vagrant setup.

First, install Ansible, Vagrant, the vagrant-sshfs plugin, and the vagrant-libvirt plugin from the official Fedora repos

```
$ sudo dnf install ansible vagrant vagrant-libvirt vagrant-sshfs
```

Now, from within main directory (the one with the Vagrantfile in it) of your git checkout of tahrir, copy the Vagrantfile.example file to Vagrantfile

```
$ cp Vagrantfile.example Vagrantfile
```

Run the ``vagrant up`` command to provision your dev environment

```
$ vagrant up
```

When this command is completed (it may take a while) start tahrir with the following command:

```
$ vagrant ssh -c"cd /vagrant/; pserve --reload development.ini"
```

Once that is running, simply go to http://localhost:8000/ in your browser on your host to see your running tahrir test instance.

## Running the tests

From the vagrant box you can run the test using tox

```
$ tox
```
