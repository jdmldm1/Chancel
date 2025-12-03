#!/bin/bash

###########################################
# Database Management Script
# Run with: sudo ./db-manage.sh [command]
###########################################

set -e

# Color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Show usage
usage() {
    echo "Usage: sudo ./db-manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  shell       - Open PostgreSQL shell"
    echo "  backup      - Create database backup"
    echo "  restore     - Restore database from backup"
    echo "  migrate     - Run database migrations"
    echo "  seed        - Seed Bible data"
    echo "  studio      - Open Prisma Studio"
    echo "  reset       - Reset database (⚠️  DANGER: deletes all data)"
    echo ""
    echo "Current mode: ${DB_MODE} database"
}

COMMAND="${1:-}"

case "$COMMAND" in
    shell)
        info "Opening PostgreSQL shell (${DB_MODE} database)..."
        if [ "$DB_MODE" = "external" ]; then
            docker exec -it bibleproject-db psql -U postgres -d bibleproject
        else
            $DOCKER_COMPOSE -f $COMPOSE_FILE exec postgres psql -U chancel -d chancel
        fi
        ;;

    backup)
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        info "Creating backup: $BACKUP_FILE (${DB_MODE} database)"
        if [ "$DB_MODE" = "external" ]; then
            docker exec -T bibleproject-db pg_dump -U postgres bibleproject > "$BACKUP_FILE"
        else
            $DOCKER_COMPOSE -f $COMPOSE_FILE exec -T postgres pg_dump -U chancel chancel > "$BACKUP_FILE"
        fi
        success "Backup created: $BACKUP_FILE"
        ;;

    restore)
        if [ -z "$2" ]; then
            error "Please specify backup file: sudo ./db-manage.sh restore <backup.sql>"
        fi
        BACKUP_FILE="$2"
        if [ ! -f "$BACKUP_FILE" ]; then
            error "Backup file not found: $BACKUP_FILE"
        fi
        warning "This will overwrite the current database!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            info "Restoring from: $BACKUP_FILE (${DB_MODE} database)"
            if [ "$DB_MODE" = "external" ]; then
                docker exec -i bibleproject-db psql -U postgres bibleproject < "$BACKUP_FILE"
            else
                $DOCKER_COMPOSE -f $COMPOSE_FILE exec -T postgres psql -U chancel chancel < "$BACKUP_FILE"
            fi
            success "Database restored"
        else
            info "Restore cancelled"
        fi
        ;;

    migrate)
        info "Running database migrations (${DB_MODE} database)..."
        $DOCKER_COMPOSE -f $COMPOSE_FILE exec api npx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma
        success "Migrations completed"
        ;;

    seed)
        info "Seeding Bible data (this may take a while, ${DB_MODE} database)..."
        $DOCKER_COMPOSE -f $COMPOSE_FILE exec api npx tsx packages/db/prisma/seed-bible-api.ts --yes
        success "Seeding completed"
        ;;

    studio)
        info "Opening Prisma Studio (${DB_MODE} database)..."
        info "Access at: http://localhost:5555"
        $DOCKER_COMPOSE -f $COMPOSE_FILE exec api npx prisma studio --schema=./packages/db/prisma/schema.prisma
        ;;

    reset)
        warning "⚠️  WARNING: This will DELETE ALL DATA in the ${DB_MODE} database!"
        read -p "Are you absolutely sure? Type 'yes' to continue: " -r
        echo
        if [ "$REPLY" = "yes" ]; then
            info "Resetting database..."
            $DOCKER_COMPOSE -f $COMPOSE_FILE exec api npx prisma migrate reset --schema=./packages/db/prisma/schema.prisma --force
            success "Database reset"
        else
            info "Reset cancelled"
        fi
        ;;

    *)
        usage
        ;;
esac
