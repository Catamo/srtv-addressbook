docker tag catamo/srtv-addressbook_contacts-service registry.heroku.com/srtv-addressbook-mscontacts/worker

heroku container:push worker --app srtv-addressbook-mscontacts

heroku container:release worker --app srtv-addressbook-mscontacts