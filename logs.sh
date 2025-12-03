#!/bin/bash

###########################################
# View BibleProject/Chancel Logs
# Run with: sudo ./logs.sh [service]
# Example: sudo ./logs.sh web
###########################################

# Color codes
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }

if [[ $EUID -ne 0 ]]; then
   echo "Warning: This script should be run as root (use sudo)"
fi

# Load common configuration
source .scripts-config.sh

SERVICE="${1:-}"

if [ -z "$SERVICE" ]; then
    info "Showing logs for all services (${DB_MODE} database mode, press Ctrl+C to exit)..."
    $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f
else
    info "Showing logs for service: $SERVICE (press Ctrl+C to exit)..."
    $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f "$SERVICE"
fi
