#!/usr/bin/env bash

docker-compose push;

docker push registry.heroku.com/srtv-addressbook-catamo-victor/web;
heroku container:release web --app srtv-addressbook-catamo-victor

# docker-compose -f docker-compose.heroku.yml push

# heroku container:release api users_worker contacts_worker