#!/usr/bin/env bash

docker-compose push

heroku container:release web --app registry.heroku.com/srtv-addressbook-catamo-victor/web

# docker-compose -f docker-compose.heroku.yml push

# heroku container:release api users_worker contacts_worker