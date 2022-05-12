#!/bin/bash

# Stop the containers
docker-compose -f docker-compose-cloud.yaml down -v
docker-compose -f docker-compose-yugabyte.yaml down -v
docker-compose -f docker-compose-postgres.yaml down -v

# Remove all volumes
docker volume rm $(docker volume ls -q)