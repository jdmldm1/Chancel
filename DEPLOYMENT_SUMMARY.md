# BibleProject Deployment - Configuration Summary

## Quick Start

### For New Users (Default Setup)
```bash
# 1. Clone repository
git clone <repo-url>
cd BibleProject

# 2. Deploy (will auto-create .env with internal database)
sudo ./deploy.sh

# Done! Application running with its own database
```

### For Users with Existing Database (Your Setup)
```bash
# 1. Ensure your existing database is running
docker ps | grep bibleproject-db

# 2. Create/edit .env and set:
USE_EXTERNAL_DB=true
DB_USER=chancel
DB_PASSWORD=<your-password>
DB_NAME=chancel
DB_PORT=5431

# 3. Deploy
sudo ./deploy.sh

# Done! Application using your existing database
```

## How It Works

### Configuration Detection
All scripts automatically detect the deployment mode by reading `USE_EXTERNAL_DB` from `.env`:

```bash
# .scripts-config.sh (loaded by all scripts)
if USE_EXTERNAL_DB=true:
    → Use docker-compose.external-db.yml
    → Connect to existing database at localhost:5431
    → Skip deploying postgres container
else:
    → Use docker-compose.yml
    → Deploy postgres container as part of stack
    → Use internal container networking
```

### Docker Compose Files

**docker-compose.yml** (Default - Internal DB)
- Deploys: postgres, api, web
- Database: chancel-db container
- Network: Internal Docker network
- Best for: New users, isolated deployments

**docker-compose.external-db.yml** (External DB)
- Deploys: api, web only
- Database: Connects to existing external DB via `host.docker.internal`
- Network: Requires host network access to database
- Best for: Advanced users, shared database scenarios

### Environment Variables

```bash
# .env
USE_EXTERNAL_DB=true|false    # Mode selector
DB_USER=chancel               # Database username
DB_PASSWORD=<password>        # Database password
DB_NAME=chancel               # Database name
DB_PORT=5431                  # Database port

# Internal mode: postgres container on chancel-network
# External mode: existing container on host network
```

## Your Current Setup

```
┌─────────────────────────────────────┐
│ Your Configuration (.env)           │
├─────────────────────────────────────┤
│ USE_EXTERNAL_DB=true                │
│ DB_USER=chancel                     │
│ DB_PASSWORD=3Dr8GOibeUydFD66...     │
│ DB_NAME=chancel                     │
│ DB_PORT=5431                        │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ .scripts-config.sh detects mode     │
│ → DB_MODE="external"                │
│ → COMPOSE_FILE="docker-compose.     │
│    external-db.yml"                 │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ All scripts use external config     │
├─────────────────────────────────────┤
│ ✓ deploy.sh                         │
│ ✓ stop.sh                           │
│ ✓ restart.sh                        │
│ ✓ status.sh                         │
│ ✓ logs.sh                           │
│ ✓ db-manage.sh                      │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ Deployment connects to:             │
│ bibleproject-db (your existing DB)  │
│ localhost:5431                      │
└─────────────────────────────────────┘
```

## Open Source Ready

When you share this codebase:

1. **`.env.docker.example`** has `USE_EXTERNAL_DB=false` by default
2. New users run `sudo ./deploy.sh`
3. Script creates `.env` from template → Internal DB mode
4. Everything works out of the box with no configuration needed

Your personal `.env` with `USE_EXTERNAL_DB=true` stays local (gitignored).

## Benefits

✅ **Zero configuration for new users** - Works immediately after clone  
✅ **Flexible for advanced users** - Simple flag to use external DB  
✅ **Consistent scripts** - Same commands work in both modes  
✅ **Self-documenting** - Mode shown in all script output  
✅ **Open source friendly** - Sane defaults, easy customization

## Examples

### Check Current Mode
```bash
sudo ./status.sh
# Output: BibleProject Service Status (external database mode):
```

### Switch Modes
```bash
# In .env, change:
USE_EXTERNAL_DB=false  # Switch to internal DB

# Redeploy:
sudo ./stop.sh
sudo ./deploy.sh
# Now using internal database
```

### Database Operations (Mode-Aware)
```bash
sudo ./db-manage.sh backup
# Output: Creating backup: backup_20241203_120000.sql (external database)

sudo ./db-manage.sh shell
# External mode: Opens bibleproject-db shell
# Internal mode: Opens chancel-db shell
```

## Summary

- **Your setup**: External database mode, using `bibleproject-db` at localhost:5431
- **Default for others**: Internal database mode, auto-deployed postgres container
- **All scripts**: Mode-aware, automatically detect and adapt
- **Configuration**: Single `USE_EXTERNAL_DB` flag in `.env`
- **Ready to share**: Default configuration works out of the box for new users
