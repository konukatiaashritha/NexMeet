#!/bin/bash
# NexMeet Backend Startup Script
# Starts PostgreSQL (embedded) and the Node.js backend server

set -e

PG_BIN=/tmp/pgnode/node_modules/@embedded-postgres/linux-x64/native/bin
PGDATA=/tmp/pgdata
PGPORT=5432
BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "======================================"
echo "  NexMeet Backend Startup"
echo "======================================"

# ── Step 1: Ensure embedded-postgres is installed ──────────────────────────
if [ ! -f "$PG_BIN/postgres" ]; then
  echo "📦 Installing embedded-postgres..."
  mkdir -p /tmp/pgnode
  cd /tmp/pgnode
  npm init -y > /dev/null 2>&1
  npm install embedded-postgres > /dev/null 2>&1
  PG_BIN=/tmp/pgnode/node_modules/@embedded-postgres/linux-x64/native/bin
  echo "✓ Embedded postgres installed"
fi

# ── Step 2: Initialize PostgreSQL data directory if needed ─────────────────
if [ ! -d "$PGDATA/global" ]; then
  echo "🗄️  Initializing PostgreSQL data directory..."
  $PG_BIN/initdb -D $PGDATA -U postgres --auth=trust --no-instructions > /dev/null 2>&1
  echo "listen_addresses = 'localhost'" >> $PGDATA/postgresql.conf
  echo "port = $PGPORT" >> $PGDATA/postgresql.conf
  echo "✓ PostgreSQL initialized"
fi

# ── Step 3: Start PostgreSQL if not running ────────────────────────────────
if ! $PG_BIN/pg_ctl -D $PGDATA status > /dev/null 2>&1; then
  echo "🚀 Starting PostgreSQL..."
  $PG_BIN/pg_ctl -D $PGDATA -l /tmp/pglog.log start > /dev/null 2>&1
  sleep 3

  # Create database and user if not exists
  cd /tmp/pgnode
  node -e "
  const { Client } = require('pg');
  async function setup() {
    let c = new Client({ host: 'localhost', port: 5432, user: 'postgres', database: 'postgres' });
    await c.connect();
    try { await c.query('CREATE DATABASE nexmeet'); } catch(e) {}
    try { await c.query(\"CREATE USER nexmeet_user WITH PASSWORD 'nexmeet_pass_2024'\"); } catch(e) {}
    try { await c.query('ALTER USER nexmeet_user CREATEDB'); } catch(e) {}
    try { await c.query('GRANT ALL PRIVILEGES ON DATABASE nexmeet TO nexmeet_user'); } catch(e) {}
    try { await c.query('ALTER DATABASE nexmeet OWNER TO nexmeet_user'); } catch(e) {}
    await c.end();
    let c2 = new Client({ host: 'localhost', port: 5432, user: 'postgres', database: 'nexmeet' });
    await c2.connect();
    try { await c2.query('GRANT ALL ON SCHEMA public TO nexmeet_user'); } catch(e) {}
    await c2.end();
  }
  setup().then(() => console.log('DB setup done')).catch(() => {});
  " 2>/dev/null || true
  echo "✓ PostgreSQL started"
else
  echo "✓ PostgreSQL already running"
fi

# ── Step 4: Run Prisma migrations ──────────────────────────────────────────
echo "📋 Running database migrations..."
cd $BACKEND_DIR
npx prisma migrate deploy 2>&1 | grep -E "migrations|sync|error" || true
echo "✓ Migrations done"

# ── Step 5: Seed database (only if empty) ─────────────────────────────────
USER_COUNT=$(cd /tmp/pgnode && node -e "
const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, user: 'nexmeet_user', password: 'nexmeet_pass_2024', database: 'nexmeet' });
c.connect().then(() => c.query('SELECT COUNT(*) FROM users')).then(r => { console.log(r.rows[0].count); c.end(); }).catch(() => { console.log('0'); });
" 2>/dev/null)

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo "🌱 Seeding database..."
  node $BACKEND_DIR/prisma/seed.js 2>&1 | grep -E "✓|Seeded|seeded|Test accounts:" || true
fi

# ── Step 6: Start the backend server ──────────────────────────────────────
echo "🚀 Starting NexMeet backend on port 5000..."
cd $BACKEND_DIR
node src/server.js &
SERVER_PID=$!
echo $SERVER_PID > /tmp/nexmeet-server.pid

# Wait for server to be ready
sleep 3
HEALTH=$(curl -s http://localhost:5000/api/health 2>/dev/null || echo "failed")
if echo $HEALTH | grep -q '"healthy"'; then
  echo ""
  echo "======================================"
  echo "  ✅ NexMeet Backend is Running!"
  echo "======================================"
  echo "  API:      http://localhost:5000/api"
  echo "  Health:   http://localhost:5000/api/health"
  echo "  Frontend: http://localhost:3000"
  echo ""
  echo "  Test Accounts:"
  echo "    Admin:     admin@nexmeet.com / password123"
  echo "    User:      arjun.reddy@techcorp.com / password123"
  echo "    Organizer: organizer@techevents.com / password123"
  echo "======================================"
  wait $SERVER_PID
else
  echo "⚠️  Server health check failed. Check /tmp/nexmeet-server.log"
  wait $SERVER_PID
fi
