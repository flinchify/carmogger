import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default sql;

export async function ensureTables() {
  // Users
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    instagram_handle VARCHAR(100),
    bio TEXT,
    lifetime_xp INTEGER DEFAULT 0,
    seasonal_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    league VARCHAR(30) DEFAULT 'junkyard',
    division INTEGER DEFAULT 3,
    plan VARCHAR(20) DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    google_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  // Cars
  await sql`CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    images TEXT[] NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    color VARCHAR(50),
    mods_description TEXT,
    carmog_score NUMERIC(5,2) DEFAULT 0,
    aura INTEGER DEFAULT 0,
    larp INTEGER DEFAULT 0,
    money INTEGER DEFAULT 0,
    demand INTEGER DEFAULT 0,
    hype INTEGER DEFAULT 0,
    ai_analysis JSONB,
    ai_roast TEXT,
    image_hash VARCHAR(64),
    total_views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  // Daily views (unique per viewer per car per day)
  await sql`CREATE TABLE IF NOT EXISTS daily_views (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    profile_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    viewer_hash VARCHAR(64) NOT NULL,
    view_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(car_id, viewer_hash, view_date)
  )`;

  // XP events log
  await sql`CREATE TABLE IF NOT EXISTS xp_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    source VARCHAR(30) NOT NULL,
    amount INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  // Seasons
  await sql`CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN DEFAULT FALSE
  )`;

  // User seasons (track per-season progress)
  await sql`CREATE TABLE IF NOT EXISTS user_seasons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    seasonal_xp INTEGER DEFAULT 0,
    league VARCHAR(30) DEFAULT 'junkyard',
    division INTEGER DEFAULT 3,
    highest_league VARCHAR(30) DEFAULT 'junkyard',
    UNIQUE(user_id, season_id)
  )`;

  // Leagues reference
  await sql`CREATE TABLE IF NOT EXISTS leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    min_xp INTEGER NOT NULL,
    max_xp INTEGER,
    icon_url TEXT,
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0
  )`;

  // Auth sessions
  await sql`CREATE TABLE IF NOT EXISTS auth_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  // Seed leagues if empty
  const existing = await sql`SELECT COUNT(*) as count FROM leagues`;
  if (Number(existing[0].count) === 0) {
    await sql`INSERT INTO leagues (name, display_name, min_xp, max_xp, color, sort_order) VALUES
      ('junkyard', 'Junkyard', 0, 999, '#6B7280', 1),
      ('garage', 'Garage', 1000, 4999, '#10B981', 2),
      ('street', 'Street', 5000, 14999, '#3B82F6', 3),
      ('track', 'Track', 15000, 49999, '#8B5CF6', 4),
      ('elite', 'Elite', 50000, 149999, '#F59E0B', 5),
      ('apex', 'Apex', 150000, NULL, '#EF4444', 6)
    `;
  }

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_cars_carmog_score ON cars(carmog_score DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_daily_views_date ON daily_views(view_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_daily_views_profile ON daily_views(profile_user_id, view_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_xp_events_user ON xp_events(user_id, created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_lifetime_xp ON users(lifetime_xp DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_league ON users(league, division)`;
}
