SITES_PATH = /sites
APP_NAME = anonchat.pw
PROJECT_PATH = $(SITES_PATH)/$(APP_NAME)
LOG_PATH = $(PROJECT_PATH)/log
NGINX_ROOT = /etc/nginx
APP_SCRIPT = app.js
APP_USER = node

paths:
	mkdir -p $(SITES_PATH)/.config/sites-available/
	mkdir -p $(SITES_PATH)/.config/sites-enabled/
	mkdir -p $(SITES_PATH)/.forever
	mkdir -p $(LOG_PATH)/nginx
	mkdir -p $(PROJECT_PATH)/upload/img/
	bash ./scripts/makeImgPaths.sh $(PROJECT_PATH)/upload/img/
	chown -R node:www-data $(PROJECT_PATH)
	chown -R node:node $(SITES_PATH)/.forever

stop:
	su -l $(APP_USER) -c 'NODE_ENV=production forever stop -p $(PROJECT_PATH)/.forever/ --sourceDir $(PROJECT_PATH) app.js'

start:
	su -l $(APP_USER) -c 'NODE_ENV=production forever start -p $(PROJECT_PATH)/.forever/ --sourceDir $(PROJECT_PATH) -l $(LOG_PATH)/forever.log -o $(LOG_PATH)/app.log -e $(LOG_PATH)/error.log -a --minUptime 1000  --spinSleepTime 1000 app.js'

restart:
	make stop
	make start

deploy_nginx:
	cp ./nginx.conf $(NGINX_ROOT)/sites-enabled/$(APP_NAME)
	service nginx restart

deploy_app_static:
	rm -rf $(PROJECT_PATH)/public
	cp -R ./app/public $(PROJECT_PATH)
	chown -R node:www-data $(PROJECT_PATH)
	chmod og+r $(PROJECT_PATH)

deploy_app:
	-make stop
	rm -rf $(PROJECT_PATH)/node_modules $(PROJECT_PATH)/lib $(PROJECT_PATH)/model $(PROJECT_PATH)/app.js $(PROJECT_PATH)/config.js $(PROJECT_PATH)/routes $(PROJECT_PATH)/views
	cp -R ./app/node_modules $(PROJECT_PATH)
	cp -R ./app/lib $(PROJECT_PATH)
	cp -R ./app/model $(PROJECT_PATH)
	cp -R ./app/routes $(PROJECT_PATH)
	cp -R ./app/views $(PROJECT_PATH)
	cp ./app/app.js $(PROJECT_PATH)
	cp ./app/config.js $(PROJECT_PATH)
	make deploy_app_static
	make start

deploy:
	make deploy_app
	make deploy_nginx

enable:
	ln -s $(SITES_PATH)/.config/sites-available/$(APP_NAME) $(SITES_PATH)/.config/sites-enabled/$(APP_NAME)

disable:
	rm $(SITES_PATH)/.config/sites-enabled/$(APP_NAME)
