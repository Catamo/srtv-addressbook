#remove anonymous volumes of mongo, so to have a clean database for the test
docker-compose -f docker-compose.yml -f docker-compose.test.yml rm -v --force mongo

docker-compose -f docker-compose.yml -f docker-compose.test.yml up