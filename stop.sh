#!/bin/bash

###########################################
# Stop BibleProject/Chancel Services
# Run with: sudo ./stop.sh
###########################################

set -e

# Color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root (use sudo)"
fi

# Load common configuration
source .scripts-config.sh

info "Stopping BibleProject services (${DB_MODE} database mode)..."
$DOCKER_COMPOSE -f $COMPOSE_FILE down

success "Services stopped successfully"

if [ "$DB_MODE" = "external" ]; then
    info "Note: External database was not touched"
else
    info "Note: Database container and volumes are preserved. Use 'docker-compose down -v' to remove data."
fi
