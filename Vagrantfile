# Defines our Vagrant environment
#
# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX      = 'ubuntu/trusty64'
HOSTNAME = 'codereddit'
RAM      = 512
IP       = '192.168.1.200'
CPUS     = 1
CPUCAP   = 95

Vagrant.configure("2") do |config|

  config.vm.box = BOX
  config.vm.hostname = HOSTNAME

  #config.vm.network :private_network, ip: IP
  config.vm.network "private_network", type: "dhcp"

  config.vm.network :forwarded_port, host: 8010, guest: 80, auto_correct: true

  config.vm.synced_folder ".", "/vagrant"

  config.vm.provider "virtualbox" do |vm|
    vm.customize ["modifyvm", :id, "--memory", RAM]
    vm.customize ["modifyvm", :id, "--cpus", CPUS]
    vm.customize ["modifyvm", :id, "--cpuexecutioncap", CPUCAP]
  end

  config.vm.provision :shell, path: "vagrant/provision.sh"

end
