#!/bin/bash
COMPOSE_VERSION='1.23.2'

echo 'install common software'
sudo apt-get -y update && sudo apt-get -y install sudo make openssh-client curl rsync dirmngr git bash-completion openssh-client

echo 'install docker'
sudo apt-get -y install apt-transport-https ca-certificates gnupg2 software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt-get -y update && sudo apt-get -y install docker-ce
sudo usermod -aG docker `id -nu`

echo 'setup .ssh'
mkdir -p ~/.ssh
chmod 0700 ~/.ssh
touch ~/.ssh/id_rsa ~/.ssh/id_rsa.pub
chmod 0600  ~/.ssh/*

echo 'install compose'
sudo curl -L https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo 'setup done'
