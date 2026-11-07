import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Session, PasswordResetToken } from './types';

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
}

export function getDatabaseEngine(): 'postgresql' | 'sqlite' {
  const rawDatabaseUrl = process.env.DATABASE_URL?.trim();
  if (
    rawDatabaseUrl &&
    (rawDatabaseUrl.startsWith('postgres://') || rawDatabaseUrl.startsWith('postgresql://'))
  ) {
    return 'postgresql';
  }
  return 'sqlite';
}

// Global cache across serverless invocations and Next.js Turbopack fast reloads
const globalForDb = globalThis as unknown as {
  pgPool?: import('pg').Pool;
  sqliteDb?: import('better-sqlite3').Database;
  isSchemaInitialized?: boolean;
};

function getSqliteDb(): import('better-sqlite3').Database {
  if (isProductionEnvironment() && getDatabaseEngine() !== 'postgresql') {
    throw new Error(
      '[SHERLOX CRITICAL DATABASE ERROR] Production environment detected, but DATABASE_URL is not set to a valid PostgreSQL connection string (postgresql://...). Local SQLite cannot be utilized in production serverless deployments.'
    );
  }

  if (!globalForDb.sqliteDb) {
    // Dynamic require to prevent bundling errors in environments that only use pg
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'sherlox.db');
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    globalForDb.sqliteDb = db;
  }
  return globalForDb.sqliteDb!;
}

function getPgPool(): import('pg').Pool {
  if (!globalForDb.pgPool) {
    const rawDatabaseUrl = process.env.DATABASE_URL?.trim();
    if (!rawDatabaseUrl) {
      throw new Error(
        '[SHERLOX DATABASE ERROR] DATABASE_URL must be provided when connecting to PostgreSQL.'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg');
    globalForDb.pgPool = new Pool({
      connectionString: rawDatabaseUrl,
      ssl: { rejectUnauthorized: false },
      max: isProductionEnvironment() ? 5 : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return globalForDb.pgPool!;
}

export async function initDb(): Promise<void> {
  if (globalForDb.isSchemaInitialized) return;

  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
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
  } else {
    const db = getSqliteDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT,
        google_id TEXT UNIQUE,
        avatar_url TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT
      );

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at INTEGER NOT NULL,
        used_at INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_reset_token_hash ON password_reset_tokens(token_hash);
      CREATE INDEX IF NOT EXISTS idx_reset_user_id ON password_reset_tokens(user_id);
    `);
  }

  globalForDb.isSchemaInitialized = true;
}

export async function verifyDatabaseHealth(): Promise<{
  healthy: boolean;
  engine: 'postgresql' | 'sqlite';
  error?: string;
}> {
  const engine = getDatabaseEngine();
  try {
    await initDb();
    if (engine === 'postgresql') {
      const pool = getPgPool();
      await pool.query('SELECT 1');
    } else {
      const db = getSqliteDb();
      db.prepare('SELECT 1').get();
    }
    return { healthy: true, engine };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { healthy: false, engine, error: message };
  }
}

// ----------------------------------------------------
// USER REPOSITORY
// ----------------------------------------------------

export async function findUserByEmail(email: string): Promise<User | null> {
  await initDb();
  const normalizedEmail = email.trim().toLowerCase();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    const res = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [normalizedEmail]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      email: r.email,
      name: r.name,
      password_hash: r.password_hash,
      google_id: r.google_id,
      avatar_url: r.avatar_url,
      created_at: Number(r.created_at),
      updated_at: Number(r.updated_at),
    };
  } else {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1').get(normalizedEmail) as User | undefined;
    return row || null;
  }
}

export async function findUserById(id: string): Promise<User | null> {
  await initDb();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    const res = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      email: r.email,
      name: r.name,
      password_hash: r.password_hash,
      google_id: r.google_id,
      avatar_url: r.avatar_url,
      created_at: Number(r.created_at),
      updated_at: Number(r.updated_at),
    };
  } else {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').get(id) as User | undefined;
    return row || null;
  }
}

export async function findUserByGoogleId(googleId: string): Promise<User | null> {
  await initDb();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    const res = await pool.query('SELECT * FROM users WHERE google_id = $1 LIMIT 1', [googleId]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      email: r.email,
      name: r.name,
      password_hash: r.password_hash,
      google_id: r.google_id,
      avatar_url: r.avatar_url,
      created_at: Number(r.created_at),
      updated_at: Number(r.updated_at),
    };
  } else {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM users WHERE google_id = ? LIMIT 1').get(googleId) as User | undefined;
    return row || null;
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
}): Promise<User> {
  await initDb();
  const id = `usr_${crypto.randomUUID().replace(/-/g, '')}`;
  const now = Date.now();
  const normalizedEmail = data.email.trim().toLowerCase();
  const engine = getDatabaseEngine();

  const user: User = {
    id,
    name: data.name.trim(),
    email: normalizedEmail,
    password_hash: data.passwordHash || null,
    google_id: data.googleId || null,
    avatar_url: data.avatarUrl || null,
    created_at: now,
    updated_at: now,
  };

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, google_id, avatar_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user.id, user.name, user.email, user.password_hash, user.google_id, user.avatar_url, user.created_at, user.updated_at]
    );
  } else {
    const db = getSqliteDb();
    db.prepare(
      `INSERT INTO users (id, name, email, password_hash, google_id, avatar_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(user.id, user.name, user.email, user.password_hash, user.google_id, user.avatar_url, user.created_at, user.updated_at);
  }

  return user;
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  await initDb();
  const now = Date.now();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query('UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3', [
      passwordHash,
      now,
      userId,
    ]);
  } else {
    const db = getSqliteDb();
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      passwordHash,
      now,
      userId
    );
  }
}

export async function linkUserGoogleId(
  userId: string,
  googleId: string,
  avatarUrl?: string | null
): Promise<void> {
  await initDb();
  const now = Date.now();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query(
      'UPDATE users SET google_id = $1, avatar_url = COALESCE($2, avatar_url), updated_at = $3 WHERE id = $4',
      [googleId, avatarUrl || null, now, userId]
    );
  } else {
    const db = getSqliteDb();
    db.prepare(
      'UPDATE users SET google_id = ?, avatar_url = COALESCE(?, avatar_url), updated_at = ? WHERE id = ?'
    ).run(googleId, avatarUrl || null, now, userId);
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; avatarUrl?: string | null }
): Promise<User | null> {
  await initDb();
  const now = Date.now();
  const engine = getDatabaseEngine();

  const currentUser = await findUserById(userId);
  if (!currentUser) return null;

  const nextName = data.name !== undefined ? data.name.trim() : currentUser.name;
  const nextAvatarUrl = data.avatarUrl !== undefined ? data.avatarUrl : currentUser.avatar_url;

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query(
      'UPDATE users SET name = $1, avatar_url = $2, updated_at = $3 WHERE id = $4',
      [nextName, nextAvatarUrl, now, userId]
    );
  } else {
    const db = getSqliteDb();
    db.prepare(
      'UPDATE users SET name = ?, avatar_url = ?, updated_at = ? WHERE id = ?'
    ).run(nextName, nextAvatarUrl, now, userId);
  }

  return findUserById(userId);
}

// ----------------------------------------------------
// SESSION REPOSITORY
// ----------------------------------------------------

export async function createSession(data: {
  userId: string;
  tokenHash: string;
  expiresAt: number;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<Session> {
  await initDb();
  const id = `ses_${crypto.randomUUID().replace(/-/g, '')}`;
  const now = Date.now();
  const engine = getDatabaseEngine();

  const session: Session = {
    id,
    user_id: data.userId,
    token_hash: data.tokenHash,
    expires_at: data.expiresAt,
    created_at: now,
    ip_address: data.ipAddress || null,
    user_agent: data.userAgent || null,
  };

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query(
      `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        session.id,
        session.user_id,
        session.token_hash,
        session.expires_at,
        session.created_at,
        session.ip_address,
        session.user_agent,
      ]
    );
  } else {
    const db = getSqliteDb();
    db.prepare(
      `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      session.id,
      session.user_id,
      session.token_hash,
      session.expires_at,
      session.created_at,
      session.ip_address,
      session.user_agent
    );
  }

  return session;
}

export async function findSessionByTokenHash(
  tokenHash: string
): Promise<(Session & { user: User }) | null> {
  await initDb();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    const query = `
      SELECT 
        s.id AS s_id, s.user_id, s.token_hash, s.expires_at, s.created_at AS s_created_at, s.ip_address, s.user_agent,
        u.id AS u_id, u.email, u.name, u.password_hash, u.google_id, u.avatar_url, u.created_at AS u_created_at, u.updated_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token_hash = $1
      LIMIT 1
    `;
    const res = await pool.query(query, [tokenHash]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.s_id,
      user_id: r.user_id,
      token_hash: r.token_hash,
      expires_at: Number(r.expires_at),
      created_at: Number(r.s_created_at),
      ip_address: r.ip_address,
      user_agent: r.user_agent,
      user: {
        id: r.u_id,
        email: r.email,
        name: r.name,
        password_hash: r.password_hash,
        google_id: r.google_id,
        avatar_url: r.avatar_url,
        created_at: Number(r.u_created_at),
        updated_at: Number(r.updated_at),
      },
    };
  } else {
    const db = getSqliteDb();
    const query = `
      SELECT 
        s.id AS s_id, s.user_id, s.token_hash, s.expires_at, s.created_at AS s_created_at, s.ip_address, s.user_agent,
        u.id AS u_id, u.email, u.name, u.password_hash, u.google_id, u.avatar_url, u.created_at AS u_created_at, u.updated_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token_hash = ?
      LIMIT 1
    `;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = db.prepare(query).get(tokenHash) as any;
    if (!r) return null;

    return {
      id: r.s_id,
      user_id: r.user_id,
      token_hash: r.token_hash,
      expires_at: r.expires_at,
      created_at: r.s_created_at,
      ip_address: r.ip_address,
      user_agent: r.user_agent,
      user: {
        id: r.u_id,
        email: r.email,
        name: r.name,
        password_hash: r.password_hash,
        google_id: r.google_id,
        avatar_url: r.avatar_url,
        created_at: r.u_created_at,
        updated_at: r.updated_at,
      },
    };
  }
}

export async function deleteSessionByTokenHash(tokenHash: string): Promise<void> {
  await initDb();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
  } else {
    const db = getSqliteDb();
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
  }
}

export async function deleteSessionsByUserId(userId: string): Promise<void> {
  await initDb();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
  } else {
    const db = getSqliteDb();
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
  }
}

// ----------------------------------------------------
// PASSWORD RESET TOKEN REPOSITORY
// ----------------------------------------------------

export async function createPasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: number;
}): Promise<PasswordResetToken> {
  await initDb();
  const id = `rst_${crypto.randomUUID().replace(/-/g, '')}`;
  const now = Date.now();
  const engine = getDatabaseEngine();

  const record: PasswordResetToken = {
    id,
    user_id: data.userId,
    token_hash: data.tokenHash,
    expires_at: data.expiresAt,
    used_at: null,
    created_at: now,
  };

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, used_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [record.id, record.user_id, record.token_hash, record.expires_at, record.used_at, record.created_at]
    );
  } else {
    const db = getSqliteDb();
    db.prepare(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, used_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(record.id, record.user_id, record.token_hash, record.expires_at, record.used_at, record.created_at);
  }

  return record;
}

export async function findPasswordResetToken(tokenHash: string): Promise<PasswordResetToken | null> {
  await initDb();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    const res = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token_hash = $1 LIMIT 1',
      [tokenHash]
    );
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      user_id: r.user_id,
      token_hash: r.token_hash,
      expires_at: Number(r.expires_at),
      used_at: r.used_at ? Number(r.used_at) : null,
      created_at: Number(r.created_at),
    };
  } else {
    const db = getSqliteDb();
    const row = db
      .prepare('SELECT * FROM password_reset_tokens WHERE token_hash = ? LIMIT 1')
      .get(tokenHash) as PasswordResetToken | undefined;
    return row || null;
  }
}

export async function markPasswordResetTokenUsed(id: string): Promise<void> {
  await initDb();
  const now = Date.now();
  const engine = getDatabaseEngine();

  if (engine === 'postgresql') {
    const pool = getPgPool();
    await pool.query('UPDATE password_reset_tokens SET used_at = $1 WHERE id = $2', [now, id]);
  } else {
    const db = getSqliteDb();
    db.prepare('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?').run(now, id);
  }
}
