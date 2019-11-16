#!/bin/bash
echo 'install common software'
sudo apt-get -y update && sudo apt-get -y install make openssh-client curl rsync dirmngr git bash-completion

echo 'setup wsl.conf'
sudo tee  /etc/wsl.conf >/dev/null <<EOF
[automount]
root = /
options = "metadata,umask=22,fmask=11"
EOF

echo 'setup .ssh'
mkdir -p ~/.ssh
chmod 0700 ~/.ssh
touch ~/.ssh/id_rsa ~/.ssh/id_rsa.pub
chmod 0600  ~/.ssh/*

echo 'setup done'
