.DEFAULT_GOAL := boilerplate

.ONESHELL:

.env.project :
	read -p 'enter cms type (bitrix|ceteracms|joomla|umi|wordpress): ' cetera_cms_type
	read -p 'enter php container tag [7.1-fpm]: ' cetera_php_version
	read -p 'enter prod site (cetera.ru): ' cetera_prod_vhost
	read -p 'enter prod db name (cetera_ru): ' cetera_prod_db_name
	read -p 'enter prod server (vps10.cetera.ru): ' cetera_prod_server
	read -p 'enter beta site: ' cetera_beta_vhost
	read -p 'enter beta db name: ' cetera_beta_db_name
	read -p 'enter beta server (vps9.cetera.ru): ' cetera_beta_server

	cat << EOF > .env.project
	    PROJECT_NAME=$$(basename `git rev-parse --show-toplevel`)
	    PROJECT_CMS_TYPE=$${cetera_cms_type}
	    PROJECT_PHP_VERSION=$${cetera_php_version:-7.1-fpm}
	    MASTER_PROJECT_SERVER=$${cetera_prod_server}
	    MASTER_PROJECT_DB=$${cetera_prod_db_name}
	    MASTER_PROJECT_SITE=$${cetera_prod_vhost}
	    BETA_PROJECT_SERVER=$${cetera_beta_server:-vps9.cetera.ru}
	    BETA_PROJECT_DB=$${cetera_beta_db_name}
	    BETA_PROJECT_SITE=$${cetera_beta_vhost}
	EOF

boilerplate: .env.project
	git submodule add --force ssh://git@gitlab.cetera.ru:6022/boilerplate/docker boilerplate
	git submodule update --remote
	cp boilerplate/base.mk ./Makefile
	git reset
	git add Makefile .env.project
	git commit -m "initialize Makefile from submodule"
