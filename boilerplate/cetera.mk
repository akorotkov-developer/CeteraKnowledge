# создает .env файл c UID и GID пользователя. ничего не делает, если файл уже есть

.PHONY: .docker docker sync_files sync_db service_files update_boilerplate docker_down sync_master sync_beta
.IGNORE: docker_down update_boilerplate
.ONESHELL:

BRANCH = $(shell git rev-parse --abbrev-ref HEAD|tr a-z A-Z)
ifeq ($(BRANCH),)
BRANCH = MASTER
endif
ifeq ($(MAKECMDGOALS),sync_master)
BRANCH = MASTER
endif
ifeq ($(MAKECMDGOALS),sync_beta)
BRANCH = BETA
endif

PROJECT_SERVER = $($(BRANCH)_PROJECT_SERVER)
PROJECT_SITE = $($(BRANCH)_PROJECT_SITE)
PROJECT_DB = $($(BRANCH)_PROJECT_DB)

ifeq ($(PROJECT_SERVER),)
PROJECT_SERVER = $(MASTER_PROJECT_SERVER)
endif
ifeq ($(PROJECT_SITE),)
PROJECT_SITE = $(MASTER_PROJECT_SITE)
endif
ifeq ($(PROJECT_DB),)
PROJECT_DB = $(MASTER_PROJECT_DB)
endif

DOCKER = docker
DOCKER_COMPOSE = docker-compose
ifneq (,$(wildcard docker-compose.override.yml))
    DOCKER_COMPOSE_FILE = -f boilerplate/docker-compose.yml -f docker-compose.override.yml
else
    DOCKER_COMPOSE_FILE = -f boilerplate/docker-compose.yml
endif
#ifeq (,$(grep -qE "(Microsoft|WSL)" /proc/version &> /dev/null ;))
ifneq (,$(wildcard /etc/wsl.conf))
    DOCKER = docker.exe
    DOCKER_COMPOSE = docker-compose.exe
endif

ifneq (,$(wildcard rsync.exclude))
    RSYNC_LOCAL_EXCLUDE = --exclude-from rsync.exclude
else
    RSYNC_LOCAL_EXCLUDE =
endif

SYNC_FILES = rsync -azP --exclude-from boilerplate/rsync.exclude $(RSYNC_LOCAL_EXCLUDE) -e ssh root@$(PROJECT_SERVER)::www/$(PROJECT_SITE)/www/ www/
SYNC_DB = rsync -azP -e ssh root@$(PROJECT_SERVER)::db/daily_$(PROJECT_DB)*.sql ./tmp/initdb.d/dump.sql
clean:
	rm -rf .env .env.project tmp/*

.env.project :
	read -p 'enter cms type (bitrix|ceteracms|joomla|umi|wordpress): ' cetera_cms_type
	read -p 'enter php container tag (7.1-fpm): ' cetera_php_version
	read -p 'enter prod site (cetera.ru): ' cetera_prod_vhost
	read -p 'enter prod db name (cetera_ru): ' cetera_prod_db_name
	read -p 'enter prod server (vps10.cetera.ru): ' cetera_prod_server
	read -p 'enter beta site: ' cetera_beta_vhost
	read -p 'enter beta db name: ' cetera_beta_db_name
	read -p 'enter beta server (vps9.cetera.ru): ' cetera_beta_server

	cat << EOF > .env.project
	    PROJECT_NAME=$$(basename `git rev-parse --show-toplevel`)
	    PROJECT_CMS_TYPE=$${cetera_cms_type}
	    PROJECT_PHP_VERSION=$${cetera_php_version}
	    MASTER_PROJECT_SERVER=$${cetera_prod_server}
	    MASTER_PROJECT_DB=$${cetera_prod_db_name}
	    MASTER_PROJECT_SITE=$${cetera_prod_vhost}
	    BETA_PROJECT_SERVER=$${cetera_beta_server:-vps9.cetera.ru}
	    BETA_PROJECT_DB=$${cetera_beta_db_name}
	    BETA_PROJECT_SITE=$${cetera_beta_vhost}
	EOF

.env : .env.project
	cp .env.project .env
	cat << EOF >> .env
	    UID=$$(id -u)
	    GID=$$(id -g)
	    PWD=$$(pwd)
	EOF
	grep '.env' .gitignore || ( \
	    echo "\n.env" >> .gitignore && \
	    git add .gitignore \
	)

tmp/.gitkeep:
	(ls -1 tmp/.gitkeep && grep '^tmp/*$$' .gitignore) || ( \
	    mkdir -p tmp && \
	    touch tmp/.gitkeep && \
	    echo "\ntmp/*" >> .gitignore \
	)

service_files: tmp/.gitkeep .env
	git reset
	git add -f .env.project tmp/.gitkeep .gitignore || echo 'errors are ignored'
	(git status -s | egrep 'tmp/\.gitkeep$$' && git commit -m 'add service files') \
	    || echo 'errors are ignored'

update_boilerplate:
	git submodule update --remote --force
	git reset
	git add boilerplate
	git commit -m "Update submodule"

docker_down:
	$(DOCKER_COMPOSE) $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) down --volumes

before_sync_db:
	mkdir -p ./tmp/initdb.d

# складывает ночной бекап DB с сервера в файл tmp/initdb.d/dump.sql в корне проекта
sync_db: before_sync_db
	$(SYNC_DB)

# актуализирует папку www в проекте из вчерашнего бекапа с сервера
sync_files:
	$(SYNC_FILES)

# загружает копию файлов с сервера для локальной разработки
init: update_boilerplate service_files docker_down sync_files sync_db
	git checkout .

sync_beta: docker_down
	$(SYNC_FILES)
	$(SYNC_DB)
	git checkout .

sync_master: docker_down
	$(SYNC_FILES)
	$(SYNC_DB)
	git checkout .

.docker: update_boilerplate .env
	mkdir -p ./tmp/initdb.d
	$(DOCKER) login registry.cetera.su
	$(DOCKER) stop $$($(DOCKER) ps -q) || echo 'no running containers'

docker: .docker
	$(DOCKER_COMPOSE) $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) up

php_bash:
	$(DOCKER) exec -itw"/var/www/_default" $(PROJECT_NAME)_php bash

mysql_bash:
	$(DOCKER) exec -it $(PROJECT_NAME)_db mysql --user=cetera --password=cetera --default-character-set=utf8 --database=cetera

pull_images:
	$(DOCKER_COMPOSE) $(DOCKER_COMPOSE_FILE) pull

composer_install:
	$(DOCKER) exec $(PROJECT_NAME)_php sh -c "cd ../_default && composer install"

composer_update:
	$(DOCKER) exec $(PROJECT_NAME)_php sh -c "cd ../_default && composer update"

phpcs:
	case $(PROJECT_CMS_TYPE) in
	bitrix)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcs --colors --encoding=utf-8 --extensions=php --ignore=vendor/,www/bitrix/  --standard=PSR1,PSR2 --exclude=PSR1.Methods.CamelCapsMethodName,PSR1.Files.SideEffects,PSR1.Classes.ClassDeclaration,Squiz.Classes.ValidClassName /var/www/_default
		exit 0
		;;
	ceteracms)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcs --colors --encoding=utf-8 --extensions=php --ignore=vendor/,www/cms/,www/library/  --standard=PSR1,PSR2 /var/www/_default
		;;
	laravel)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcs --colors --encoding=utf-8 --extensions=php --standard=PSR1,PSR2 /var/www/_default/app
		;;
	*)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcs --colors --encoding=utf-8 --extensions=php --standard=PSR1,PSR2 /var/www/_default
		;;
	esac

phpcbf:
	case $(PROJECT_CMS_TYPE) in
	bitrix)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcbf --colors --encoding=utf-8 --extensions=php --ignore=vendor/,www/bitrix/  --standard=PSR1,PSR2 --exclude=PSR1.Methods.CamelCapsMethodName,PSR1.Files.SideEffects,PSR1.Classes.ClassDeclaration,Squiz.Classes.ValidClassName /var/www/_default
		exit 0
		;;
	ceteracms)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcbf --colors --encoding=utf-8 --extensions=php --ignore=vendor/,www/cms/,www/library  --standard=PSR1,PSR2 /var/www/_default
		;;
	laravel)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcbf --colors --encoding=utf-8 --extensions=php --standard=PSR1,PSR2 /var/www/_default/app
		;;
	*)
		$(DOCKER) exec $(PROJECT_NAME)_php phpcbf --colors --encoding=utf-8 --extensions=php --standard=PSR1,PSR2 /var/www/_default
		;;
	esac
