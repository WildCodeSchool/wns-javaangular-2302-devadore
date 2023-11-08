#!/bin/bash
export DOCKER_IMAGE_TAG="$1"
export DOCKER_USER="$2"
echo "docker image tag: $DOCKER_IMAGE_TAG pushed by $DOCKER_USER"
if [ "$DOCKER_IMAGE_TAG" == "main"  ]; then 
  export APP_ENV='prod' 
  export GATEWAY_PORT=8143 
else
  export APP_ENV='preprod' 
  export GATEWAY_PORT=8142 
fi	
COMPOSE_FILE=docker-compose.yml
docker compose pull
docker compose -f "$COMPOSE_FILE" -p "app_$APP_ENV" up --build --force-recreate -d 