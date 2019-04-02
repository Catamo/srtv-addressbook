#!/usr/bin/env bash
docker-compose push;

docker tag catamo/srtv-addressbook_api-gateway registry.heroku.com/srtv-addressbook-catamo-victor/api;
docker tag catamo/srtv-addressbook_users-service registry.heroku.com/srtv-addressbook-msusers/users_worker;
docker tag catamo/srtv-addressbook_contacts-service registry.heroku.com/srtv-addressbook-mscontacts/contacts_worker;

docker push registry.heroku.com/srtv-addressbook-catamo-victor/api;
docker push registry.heroku.com/srtv-addressbook-msusers/users_worker;
docker push registry.heroku.com/srtv-addressbook-mscontacts/contacts_worker;

cd ./api-gateway && heroku container:release api --app srtv-addressbook-catamo-victor && cd ..;
cd ./users-service && heroku container:release users_worker --app srtv-addressbook-msusers && cd ..;
cd ./contacts-service && heroku container:release contacts_worker --app srtv-addressbook-mscontacts && cd ..;