docker tag catamo/srtv-addressbook_api-gateway registry.heroku.com/srtv-addressbook-catamo-victor/web

heroku container:push web --app srtv-addressbook-catamo-victor

heroku container:release web --app srtv-addressbook-catamo-victor