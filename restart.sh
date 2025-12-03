#!/bin/bash

###########################################
# Restart BibleProject/Chancel Services
# Run with: sudo ./restart.sh [service]
# Example: sudo ./restart.sh web
###########################################

set -e

# Color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root (use sudo)"
fi

# Load common configuration
source .scripts-config.sh

SERVICE="${1:-}"

if [ -z "$SERVICE" ]; then
    info "Restarting all services (${DB_MODE} database mode)..."
    $DOCKER_COMPOSE -f $COMPOSE_FILE restart
    success "All services restarted"
else
    info "Restarting service: $SERVICE..."
    $DOCKER_COMPOSE -f $COMPOSE_FILE restart "$SERVICE"
    success "Service $SERVICE restarted"
fi

info "Service status:"
$DOCKER_COMPOSE -f $COMPOSE_FILE ps
