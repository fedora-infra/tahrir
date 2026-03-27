# -*- mode: ruby -*-
# vi: set ft=ruby :
ENV['VAGRANT_NO_PARALLEL'] = 'yes'

Vagrant.configure(2) do |config|

  config.vm.define "badges" do |badges|
    badges.vm.box = "bento/fedora-39"
    badges.vm.hostname = "badges.tinystage.test"

    badges.vm.communicator = "ssh"
    badges.ssh.username = "vagrant"
    badges.ssh.insert_key = false

    badges.vm.synced_folder '.', '/vagrant'
    badges.vm.synced_folder ".", "/home/vagrant/tahrir"
    # badges.vm.synced_folder "../tahrir-api", "/home/vagrant/tahrir-api"

    badges.vm.provider "virtualbox" do |vb|
      vb.cpus = 2
      vb.memory = 2048
    end

    badges.vm.provider :libvirt do |libvirt|
      libvirt.cpus = 2
      libvirt.memory = 2048
    end

    badges.vm.provision "ansible" do |ansible|
      ansible.playbook = "devel/ansible/playbook.yml"
      ansible.config_file = "devel/ansible/ansible.cfg"
      ansible.verbose = true
    end
  end

end
