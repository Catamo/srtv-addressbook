docker login --username=_ --password=$HEROKU_API_KEY registry.heroku.com

heroku container:push worker --app srtv-addressbook-msusers

heroku container:release worker --app srtv-addressbook-msusers