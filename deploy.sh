#!/bin/bash

###########################################
# BibleProject/Chancel Deployment Script
# Supports both internal and external DB
# Run with: sudo ./deploy.sh
###########################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root (use sudo)"
fi

info "Starting BibleProject deployment on shiloh..."

# Load common configuration
source .scripts-config.sh

info "Deployment mode: ${DB_MODE} database"
info "Using compose file: ${COMPOSE_FILE}"

# Check dependencies
info "Checking dependencies..."
command -v docker >/dev/null 2>&1 || error "Docker is not installed"

success "Dependencies check passed"

# Setup environment file
if [ ! -f .env ]; then
    warning ".env file not found. Creating from template..."
    cp .env.docker.example .env

    # Generate a secure NEXTAUTH_SECRET
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    sed -i "s|generate_a_random_secret_here_min_32_chars|$NEXTAUTH_SECRET|g" .env

    # Generate a secure database password
    DB_PASSWORD=$(openssl rand -base64 24)
    sed -i "s|chancel_secure_password_change_me|$DB_PASSWORD|g" .env

    success "Created .env file with generated secrets"
    warning "Please review .env file and update settings if needed"

    # Reload configuration after creating .env
    source .scripts-config.sh
else
    info "Using existing .env file"
fi

# Source .env to get database credentials
set -a
source .env
set +a

# External DB specific checks
if [ "$DB_MODE" = "external" ]; then
    info "Checking connection to external database at localhost:${DB_PORT}..."
    if ! docker run --rm --network host postgres:15-alpine pg_isready -h localhost -p ${DB_PORT} -U ${DB_USER} > /dev/null 2>&1; then
        error "Cannot connect to external database at localhost:${DB_PORT}. Make sure your database container (bibleproject-db) is running."
    fi
    success "External database connection verified (localhost:${DB_PORT}, database: ${DB_NAME})"
fi

# Stop and remove existing application containers (but not database)
info "Cleaning up existing application containers..."
if docker ps -a | grep -q "chancel-web"; then
    info "Removing chancel-web container..."
    docker stop chancel-web 2>/dev/null || true
    docker rm chancel-web 2>/dev/null || true
fi

if docker ps -a | grep -q "chancel-api"; then
    info "Removing chancel-api container..."
    docker stop chancel-api 2>/dev/null || true
    docker rm chancel-api 2>/dev/null || true
fi

# Also try compose down (won't affect external DB)
$DOCKER_COMPOSE -f $COMPOSE_FILE down 2>/dev/null || true

success "Application containers cleaned up"

# Clean up old images and unused resources
info "Cleaning up old Docker resources..."
docker system prune -f

# Build images
info "Building Docker images (this may take a few minutes)..."
DOCKER_BUILDKIT=1 $DOCKER_COMPOSE -f $COMPOSE_FILE build --no-cache

success "Docker images built successfully"

# Start services
info "Starting services..."
$DOCKER_COMPOSE -f $COMPOSE_FILE up -d

# Wait for database to be ready (internal DB only)
if [ "$DB_MODE" = "internal" ]; then
    info "Waiting for database to be ready..."
    MAX_RETRIES=30
    RETRY_COUNT=0
    until $DOCKER_COMPOSE -f $COMPOSE_FILE exec -T postgres pg_isready -U ${DB_USER} > /dev/null 2>&1; do
        RETRY_COUNT=$((RETRY_COUNT+1))
        if [ $RETRY_COUNT -gt $MAX_RETRIES ]; then
            error "Database failed to start after ${MAX_RETRIES} attempts"
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    success "Database is ready"
fi

# Wait a bit for API to start
sleep 5

# Run migrations
info "Running database migrations..."
$DOCKER_COMPOSE -f $COMPOSE_FILE exec -T api npx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma || {
    warning "Migrations may have failed. Check logs with: sudo ./logs.sh api"
}

success "Migrations completed"

# Ask about seeding
read -p "Do you want to seed the database with Bible data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Seeding database with Bible data (this may take a while)..."
    $DOCKER_COMPOSE -f $COMPOSE_FILE exec -T api npx tsx packages/db/prisma/seed-bible-api.ts --yes || {
        warning "Bible data seeding failed or was cancelled"
    }
fi

# Show service status
echo ""
info "Checking service status..."
$DOCKER_COMPOSE -f $COMPOSE_FILE ps

# Show logs from last startup
echo ""
info "Recent logs:"
$DOCKER_COMPOSE -f $COMPOSE_FILE logs --tail=20

# Display access information
echo ""
success "===================================="
success "Deployment completed successfully!"
success "===================================="
echo ""
info "Access your application at:"
echo "  - Web Interface: http://localhost:${WEB_PORT:-3000}"
echo "  - GraphQL API:   http://localhost:${API_PORT:-4000}/graphql"
echo ""

if [ "$DB_MODE" = "external" ]; then
    info "Database Info:"
    echo "  - External DB:   localhost:${DB_PORT}"
    echo "  - Database Name: ${DB_NAME}"
    echo "  - Database User: ${DB_USER}"
else
    info "Database Info:"
    echo "  - Internal DB:   localhost:${DB_PORT:-5431}"
    echo "  - Database Name: ${DB_NAME}"
    echo "  - Database User: ${DB_USER}"
    echo "  - Container:     chancel-db"
fi

echo ""
info "Useful commands:"
echo "  - View logs:          sudo ./logs.sh"
echo "  - Stop services:      sudo ./stop.sh"
echo "  - Restart services:   sudo ./restart.sh"
echo "  - View status:        sudo ./status.sh"
echo "  - Database ops:       sudo ./db-manage.sh"
echo ""
warning "Note: Check the logs above for any startup errors"
