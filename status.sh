#!/bin/bash

###########################################
# Check BibleProject/Chancel Status
# Run with: sudo ./status.sh
###########################################

# Color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

if [[ $EUID -ne 0 ]]; then
   echo "Warning: This script should be run as root (use sudo)"
fi

# Load common configuration
source .scripts-config.sh

info "BibleProject Service Status (${DB_MODE} database mode):"
echo ""
$DOCKER_COMPOSE -f $COMPOSE_FILE ps

echo ""
info "Service Details:"
echo "  - Web Interface: http://localhost:3000"
echo "  - GraphQL API:   http://localhost:4000/graphql"
if [ "$DB_MODE" = "external" ]; then
    echo "  - Database:      localhost:5431 (external)"
else
    echo "  - Database:      localhost:5431 (container: chancel-db)"
fi

echo ""
info "Quick Health Check:"

# Check if services are responding
if docker ps | grep -q "chancel-web"; then
    success "✓ Web container is running"
else
    echo "✗ Web container is not running"
fi

if docker ps | grep -q "chancel-api"; then
    success "✓ API container is running"
else
    echo "✗ API container is not running"
fi

if [ "$DB_MODE" = "external" ]; then
    if docker ps | grep -q "bibleproject-db"; then
        success "✓ External database container is running (bibleproject-db)"

        # Check database connectivity
        if docker exec bibleproject-db pg_isready -U postgres > /dev/null 2>&1; then
            success "✓ Database is accepting connections"
        else
            echo "✗ Database is not accepting connections"
        fi
    else
        echo "✗ External database container is not running (bibleproject-db)"
    fi
else
    if docker ps | grep -q "chancel-db"; then
        success "✓ Database container is running (chancel-db)"

        # Check database connectivity
        if $DOCKER_COMPOSE -f $COMPOSE_FILE exec -T postgres pg_isready -U chancel > /dev/null 2>&1; then
            success "✓ Database is accepting connections"
        else
            echo "✗ Database is not accepting connections"
        fi
    else
        echo "✗ Database container is not running (chancel-db)"
    fi
fi
