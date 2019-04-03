docker tag catamo/srtv-addressbook_contacts-service registry.heroku.com/srtv-addressbook-mscontacts/worker

docker push registry.heroku.com/srtv-addressbook-mscontacts/worker

heroku container:release worker --app srtv-addressbook-mscontacts
heroku ps:scale worker=1 --app srtv-addressbook-mscontacts