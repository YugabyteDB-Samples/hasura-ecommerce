#!/bin/bash

# Stop the containers
docker-compose -f docker-compose-cloud.yaml down
docker-compose -f docker-compose-yugabyte.yaml down
docker-compose -f docker-compose-postgres.yaml down

# Delete all containers
docker rm -f $(docker ps -a -q)

# Delete all volumes
docker volume rm $(docker volume ls -q)