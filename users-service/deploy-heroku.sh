docker tag catamo/srtv-addressbook_users-service registry.heroku.com/srtv-addressbook-msusers/worker;

# heroku container:push worker --app srtv-addressbook-msusers

docker push registry.heroku.com/srtv-addressbook-msusers/worker;

heroku container:release worker --app srtv-addressbook-msusers;
heroku ps:scale worker=1 --app srtv-addressbook-msusers;;