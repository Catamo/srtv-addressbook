#!/usr/bin/env bash
declare -a arr=("api-gateway" "contacts-service" "users-service")

set -e;

for i in "${arr[@]}"
do
    cd "./${arr[i]}"

    image_tag="latest";
    image_full_name="catamo/srtv-addressbook_${arr[i]}:$image_tag";

    echo "Building image '$image_full_name'";
    docker build . -t "$image_full_name";

    echo "Authenticating";
    echo "$DOCKER_PASS" | docker login -u="$DOCKER_USERNAME" --password-stdin;

    echo "Pushing image '$image_full_name'";
    docker push "$image_full_name";
    echo "Push finished!";
done

exit 0;