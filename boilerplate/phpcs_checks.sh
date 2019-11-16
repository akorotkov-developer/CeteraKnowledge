#!/bin/bash
#
# Usage: phpcs_checks.sh [check_type] [cms] [path]
#

check=${1:-phpcs}
cms=${2:-default}
path=${3:-/var/www/_default}
. ../.env
export PROJECT_NAME

case "$check" in
    "phpcs"|"phpcbf")
	case "$cms" in
	"bitrix")
    	    docker-compose -f docker-compose.yml run --rm php $check --colors --encoding=utf-8 --extensions=php --ignore=vendor/,www/bitrix/  --standard=PSR1,PSR2 --exclude=PSR1.Methods.CamelCapsMethodName,PSR1.Files.SideEffects,PSR1.Classes.ClassDeclaration,Squiz.Classes.ValidClassName $path
	;;

	"ceteracms")
	    docker-compose -f docker-compose.yml run --rm php $check --colors --encoding=utf-8 --extensions=php --ignore=vendor/,www/cms/,www/library/  --standard=PSR1,PSR2 $path
	;;

	"laravel")
	    docker-compose -f docker-compose.yml run --rm php $check --colors --encoding=utf-8 --extensions=php --standard=PSR1,PSR2 /var/www/_default/app $path
	;;

	*)
	    docker-compose -f docker-compose.yml run --rm php $check --colors --encoding=utf-8 --extensions=php --standard=PSR1,PSR2 /var/www/_default
	;;
	esac
    ;;

    * )
    echo Unknown check type, exit && exit 0
    ;;
esac

exit 0
