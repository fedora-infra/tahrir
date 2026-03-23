# -*- mode: ruby -*-
# vi: set ft=ruby :
ENV['VAGRANT_NO_PARALLEL'] = 'yes'

# Fedora 38 is EOL and the old Fedora 38 Vagrant box URL returned 404.
# Use Fedora 42 Cloud Base Vagrant boxes (provider-specific).
f42_libvirt_box_url = 'https://download.fedoraproject.org/pub/fedora/linux/releases/42/Cloud/x86_64/images/Fedora-Cloud-Base-Vagrant-libvirt-42-1.1.x86_64.vagrant.libvirt.box'
f42_virtualbox_box_url = 'https://download.fedoraproject.org/pub/fedora/linux/releases/42/Cloud/x86_64/images/Fedora-Cloud-Base-Vagrant-VirtualBox-42-1.1.x86_64.vagrant.virtualbox.box'

Vagrant.configure(2) do |config|
  if config.respond_to?(:hostmanager)
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.manage_guest = true
  end

  config.vm.define "badges" do |badges|
    badges.vm.hostname = "badges.tinystage.test"

    badges.vm.provider :libvirt do |libvirt, override|
      libvirt.cpus = 2
      libvirt.memory = 2048

      # Provider-specific base box + synced folder mechanism.
      override.vm.box = 'f42-cloud-libvirt'
      override.vm.box_url = f42_libvirt_box_url
      override.vm.synced_folder '.', '/vagrant', type: 'sshfs'
      override.vm.synced_folder '.', '/home/vagrant/tahrir', type: 'sshfs'
    end

    badges.vm.provider :virtualbox do |vb, override|
      vb.cpus = 2
      vb.memory = 2048

      # Default VirtualBox shared-folder support works on macOS/Windows without
      # requiring sshfs.
      override.vm.box = 'f42-cloud-virtualbox'
      override.vm.box_url = f42_virtualbox_box_url
      override.vm.synced_folder '.', '/vagrant', type: 'virtualbox'
      override.vm.synced_folder '.', '/home/vagrant/tahrir', type: 'virtualbox'
    end

    badges.vm.provision "ansible" do |ansible|
      ansible.playbook = "devel/ansible/playbook.yml"
      ansible.config_file = "devel/ansible/ansible.cfg"
      ansible.verbose = true
    end
  end
end
