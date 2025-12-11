# Docker Deployment Guide

This guide explains how to run Chancel using Docker for development and production.

## Quick Start

### Option 1: Full Stack (Production-like)

Run the entire application stack with Docker:

```bash
# 1. Copy environment file
cp .env.docker.example .env

# 2. Edit .env and set your secrets
nano .env  # or your preferred editor

# 3. Start all services
docker compose up -d

# 4. Run database migrations
docker compose exec api npx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma

# 5. (Optional) Seed Bible data
docker compose exec api npx tsx packages/db/prisma/seed-bible-api.ts --test
```

Access the application at:
- Web: http://localhost:3000
- API: http://localhost:4000/graphql
- Database: localhost:5431

### Option 2: Database Only (Development)

Run just the database in Docker, run app locally:

```bash
# Start database
docker compose -f docker-compose.dev.yml up -d

# In another terminal, run the app locally
npm run dev
```

## Services

The full docker compose stack includes:

1. **postgres** - PostgreSQL 16 database
2. **api** - GraphQL API server (Node.js)
3. **web** - Next.js frontend

## Environment Variables

Required environment variables (set in `.env`):

```bash
# Database
DB_USER=chancel
DB_PASSWORD=<strong-password-here>
DB_NAME=chancel

# NextAuth
NEXTAUTH_SECRET=<generate-random-32+-char-string>
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

# Email Notifications (optional - for production)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM="Chancel <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

**Email Notifications:**
- Sign up at https://resend.com (free tier: 100 emails/day)
- Get your API key from the dashboard
- Without an API key, emails are logged to console (works for testing)
- See [Email Notifications Setup](./README.md#email-notifications-setup) for full details

## Common Commands

### Start Services
```bash
# Start in background
docker compose up -d

# Start with logs
docker compose up

# Start specific service
docker compose up -d postgres
```

### Stop Services
```bash
# Stop all
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f web
docker compose logs -f api
docker compose logs -f postgres
```

### Run Commands Inside Containers
```bash
# Database migrations
docker compose exec api npx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma

# Seed database
docker compose exec api npm run db:seed

# Import Bible data
docker compose exec api npx tsx packages/db/prisma/seed-bible-api.ts --resume --yes

# Open Prisma Studio
docker compose exec api npx prisma studio --schema=./packages/db/prisma/schema.prisma

# Access PostgreSQL
docker compose exec postgres psql -U chancel -d chancel

# Shell into container
docker compose exec web sh
docker compose exec api sh
```

### Rebuild Containers
```bash
# Rebuild all
docker compose build

# Rebuild specific service
docker compose build web
docker compose build api

# Rebuild and start
docker compose up -d --build
```

## Development Workflow

### Local Development with Database in Docker

```bash
# 1. Start database
docker compose -f docker-compose.dev.yml up -d

# 2. Run migrations
npm -w @bibleproject/db run db:push

# 3. Seed data
npm -w @bibleproject/db run db:seed

# 4. Start dev servers
npm run dev
```

### Testing Production Build

```bash
# 1. Build images
docker compose build

# 2. Start services
docker compose up -d

# 3. Check logs
docker compose logs -f
```

## Production Deployment

### Recommended Setup

1. **Use environment-specific compose files**
   ```bash
   # Production
   docker compose -f docker compose.yml -f docker compose.prod.yml up -d
   ```

2. **Use secrets management**
   - Don't commit `.env` files
   - Use Docker secrets or cloud provider secret managers
   - Set `NEXTAUTH_SECRET` to a strong random value

3. **Add reverse proxy**
   - Use Nginx or Traefik in front of the web service
   - Enable HTTPS with Let's Encrypt
   - Configure proper CORS and security headers

4. **Database backups**
   ```bash
   # Backup
   docker compose exec postgres pg_dump -U chancel chancel > backup.sql

   # Restore
   docker compose exec -T postgres psql -U chancel chancel < backup.sql
   ```

5. **Monitoring**
   - Add health checks
   - Monitor container logs
   - Set up alerts for service failures

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :4000
lsof -i :5432

# Change ports in .env
WEB_PORT=3001
API_PORT=4001
DB_PORT=5433
```

### Database Connection Issues
```bash
# Check if database is healthy
docker compose ps

# View database logs
docker compose logs postgres

# Test connection
docker compose exec postgres pg_isready -U chancel
```

### Build Failures
```bash
# Clean everything and rebuild
docker compose down -v
docker system prune -a
docker compose build --no-cache
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## Performance Tips

1. **Use BuildKit** for faster builds:
   ```bash
   DOCKER_BUILDKIT=1 docker compose build
   ```

2. **Multi-stage builds** are already configured in Dockerfiles

3. **Volume mounts** for development:
   ```yaml
   # In docker compose.override.yml
   services:
     web:
       volumes:
         - ./apps/web:/app/apps/web
   ```

## Security Checklist

- [ ] Change default passwords
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Don't expose database port in production
- [ ] Use HTTPS in production
- [ ] Keep images updated
- [ ] Scan images for vulnerabilities
- [ ] Use non-root users (already configured)
- [ ] Limit container resources

## Next Steps

After Docker setup:
1. Configure your domain and SSL
2. Set up CI/CD pipeline
3. Configure monitoring and logging
4. Set up automated backups
5. Review security settings
