# -*- mode: ruby -*-
# vi: set ft=ruby :
ENV['VAGRANT_NO_PARALLEL'] = 'yes'

Vagrant.configure(2) do |config|
  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.manage_guest = true

  config.vm.define "badges" do |badges|
    badges.vm.box_url = "https://download.fedoraproject.org/pub/fedora/linux/releases/38/Cloud/x86_64/images/Fedora-Cloud-Base-Vagrant-38-1.6.x86_64.vagrant-libvirt.box"
    badges.vm.box = "f38-cloud-libvirt"
    badges.vm.hostname = "badges.tinystage.test"

    badges.vm.synced_folder '.', '/vagrant', type: "sshfs"
    badges.vm.synced_folder ".", "/home/vagrant/tahrir", type: "sshfs"
    # badges.vm.synced_folder "../tahrir-api", "/home/vagrant/tahrir-api", type: "sshfs"

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
