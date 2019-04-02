docker tag catamo/srtv-addressbook_api-gateway registry.heroku.com/srtv-addressbook-msusers/worker

heroku container:push worker --app srtv-addressbook-msusers

heroku container:release worker --app srtv-addressbook-msusers