#!/usr/bin/env bash

docker-compose push
docker-compose -f docker-compose.heroku.yml push

# heroku container:release api users_worker contacts_worker