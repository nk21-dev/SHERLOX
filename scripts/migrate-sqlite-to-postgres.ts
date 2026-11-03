import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import Database from 'better-sqlite3';

async function migrateSqliteToPostgres() {
  console.log('\n============================================================');
  console.log('🕵️ SHERLOX DATABASE MIGRATION UTILITY (SQLite -> PostgreSQL)');
  console.log('============================================================\n');

  const rawDatabaseUrl = process.env.DATABASE_URL?.trim();
  if (
    !rawDatabaseUrl ||
    (!rawDatabaseUrl.startsWith('postgres://') && !rawDatabaseUrl.startsWith('postgresql://'))
  ) {
    console.error('❌ Error: DATABASE_URL environment variable is missing or invalid.');
    console.error('Please specify a PostgreSQL connection string, for example:');
    console.error('  DATABASE_URL="postgresql://user:pass@ep-sample.us-east-2.aws.neon.tech/sherlox?sslmode=require" npx tsx scripts/migrate-sqlite-to-postgres.ts\n');
    process.exit(1);
  }

  const sqlitePath = path.join(process.cwd(), 'data', 'sherlox.db');
  if (!fs.existsSync(sqlitePath)) {
    console.warn('⚠️ No local SQLite database found at data/sherlox.db. Initializing PostgreSQL schema directly...');
  }

  console.log('🔌 Connecting to PostgreSQL destination database...');
  const pool = new Pool({
    connectionString: rawDatabaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. Initialize PostgreSQL Tables
    console.log('🔨 Ensuring tables and indexes exist in PostgreSQL...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash TEXT,
        google_id VARCHAR(255) UNIQUE,
        avatar_url TEXT,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(64) UNIQUE NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at BIGINT NOT NULL,
        ip_address VARCHAR(128),
        user_agent TEXT
      );

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(64) UNIQUE NOT NULL,
        expires_at BIGINT NOT NULL,
        used_at BIGINT,
        created_at BIGINT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_reset_token_hash ON password_reset_tokens(token_hash);
      CREATE INDEX IF NOT EXISTS idx_reset_user_id ON password_reset_tokens(user_id);
    `);
    console.log('✓ PostgreSQL schema verified.');

    if (!fs.existsSync(sqlitePath)) {
      console.log('✓ Target database ready. No local records to migrate.');
      await pool.end();
      return;
    }

    // 2. Read SQLite records
    console.log('📂 Reading records from local SQLite (data/sherlox.db)...');
    const sqlite = new Database(sqlitePath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users = sqlite.prepare('SELECT * FROM users').all() as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessions = sqlite.prepare('SELECT * FROM sessions').all() as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetTokens = sqlite.prepare('SELECT * FROM password_reset_tokens').all() as any[];

    console.log(`Found: ${users.length} users, ${sessions.length} sessions, ${resetTokens.length} reset tokens.`);

    // 3. Migrate Users
    let usersMigrated = 0;
    for (const u of users) {
      await pool.query(
        `INSERT INTO users (id, email, name, password_hash, google_id, avatar_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           email = EXCLUDED.email,
           name = EXCLUDED.name,
           password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
           google_id = COALESCE(EXCLUDED.google_id, users.google_id),
           avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
           updated_at = EXCLUDED.updated_at`,
        [u.id, u.email, u.name, u.password_hash, u.google_id, u.avatar_url, Number(u.created_at), Number(u.updated_at)]
      );
      usersMigrated++;
    }

    // 4. Migrate Sessions
    let sessionsMigrated = 0;
    for (const s of sessions) {
      await pool.query(
        `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.user_id, s.token_hash, Number(s.expires_at), Number(s.created_at), s.ip_address, s.user_agent]
      );
      sessionsMigrated++;
    }

    // 5. Migrate Password Reset Tokens
    let tokensMigrated = 0;
    for (const t of resetTokens) {
      await pool.query(
        `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, used_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.user_id, t.token_hash, Number(t.expires_at), t.used_at ? Number(t.used_at) : null, Number(t.created_at)]
      );
      tokensMigrated++;
    }

    console.log('\n============================================================');
    console.log(`🎉 MIGRATION COMPLETE!`);
    console.log(`  Users Migrated:          ${usersMigrated}`);
    console.log(`  Sessions Migrated:       ${sessionsMigrated}`);
    console.log(`  Reset Tokens Migrated:   ${tokensMigrated}`);
    console.log('============================================================\n');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateSqliteToPostgres().catch(console.error);

