#!/bin/bash

# DBNAME=admin
# DBUSER=admin
# DBPASS=airshr

# Add swap space.
sh /vagrant/vagrant/swap.sh

# Add Ruby 2.x repos.
apt-add-repository ppa:brightbox/ruby-ng

# Install prep.
apt-get update
#apt-get -y upgrade

# Install basic necessities.
apt-get -y install ntp git htop tree unzip
service ntp restart

# Install Ruby.
apt-get -y install ruby2.3

# Install Apache
apt-get -y install apache2

cat > /etc/apache2/sites-available/000-default.conf <<EOL
<VirtualHost *:80>
  #ServerName www.example.com

  ServerAdmin webmaster@localhost
  DocumentRoot /vagrant

  <Directory /vagrant>
    Options Indexes FollowSymLinks MultiViews
    AllowOverride All
    Order allow,deny
    Allow from all
    Require all granted
  </Directory>

  Alias /node_modules "/vagrant/node_modules"

  <Directory "/vagrant/node_modules">
    Options Indexes FollowSymlinks MultiViews
    AllowOverride All
    Order allow,deny
    Allow from all
    Require all granted
  </Directory>

  Alias /src/client "/vagrant/src/client"

  <Directory "/vagrant/src/client">
    Options Indexes FollowSymlinks MultiViews
    AllowOverride All
    Order allow,deny
    Allow from all
    Require all granted
  </Directory>

  ErrorLog \${APACHE_LOG_DIR}/error.log
  CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOL

sed -i "s/User \${APACHE_RUN_USER}/User vagrant/" /etc/apache2/apache2.conf
sed -i "s/Group \${APACHE_RUN_GROUP}/Group vagrant/" /etc/apache2/apache2.conf

# Enable required Apache modules and restart server.
a2enmod rewrite
a2enmod status
a2dismod mpm_event
a2enmod mpm_prefork
service apache2 restart

# install NodeJS
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
apt-get install -y nodejs

npm install grunt -g

# install webpack globally
npm install webpack -g

# Install depedencies.
sudo -H -u vagrant bash -c 'npm --prefix /vagrant install'

# gem install sass

# mkdir -p {/vagrant/var/cache,/vagrant/var/logs,/vagrant/var/sessions}
