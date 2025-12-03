#!/bin/bash

# Common configuration for all BibleProject deployment scripts
# This file is sourced by other scripts to determine deployment mode

# Detect docker-compose command
if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
elif command -v docker compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    echo "Error: docker-compose or 'docker compose' not found"
    exit 1
fi

# Determine which compose file to use based on USE_EXTERNAL_DB
if [ -f .env ]; then
    # Source the .env file to get USE_EXTERNAL_DB
    export $(grep -v '^#' .env | grep USE_EXTERNAL_DB | xargs)
fi

# Default to internal DB if not specified
USE_EXTERNAL_DB="${USE_EXTERNAL_DB:-false}"

if [ "$USE_EXTERNAL_DB" = "true" ]; then
    COMPOSE_FILE="docker-compose.external-db.yml"
    DB_MODE="external"
else
    COMPOSE_FILE="docker-compose.yml"
    DB_MODE="internal"
fi

export DOCKER_COMPOSE
export COMPOSE_FILE
export DB_MODE
export USE_EXTERNAL_DB
