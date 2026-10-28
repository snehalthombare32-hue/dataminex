import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

let pool = null;
let isMockMode = false;

// In-memory fallback store for seamless trial when Postgres is not configured/running
const mockDb = {
  users: [],
  progress: [],
  achievements: [],
  challenges: []
};

// Safe non-destructive schema initialization (preserves all existing tables and data)
const initDbSchema = async (dbPool) => {
  try {
    const res = await dbPool.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'users'
      );
    `);
    const exists = res.rows[0].exists;
    if (!exists) {
      console.log('⚙️ Initializing database tables non-destructively...');
      await dbPool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS user_progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            module_id VARCHAR(50) NOT NULL,
            topic_id VARCHAR(100) NOT NULL,
            type VARCHAR(20) NOT NULL,
            completed BOOLEAN DEFAULT TRUE,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT unique_user_progress UNIQUE (user_id, module_id, topic_id, type)
        );
        CREATE TABLE IF NOT EXISTS user_achievements (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            achievement_id VARCHAR(50) NOT NULL,
            unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
        );
        CREATE TABLE IF NOT EXISTS user_challenges (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            challenge_id VARCHAR(50) NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT unique_user_challenge UNIQUE (user_id, challenge_id)
        );
        CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
      `);
      console.log('✅ Database schema initialized successfully (no tables dropped).');
    }
  } catch (err) {
    console.error('❌ Failed to verify database schema:', err.message);
  }
};

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
    });
    
    // Test the database connection
    pool.query('SELECT NOW()', async (err, res) => {
      if (err) {
        console.warn('⚠️ WARNING: PostgreSQL connection failed. Falling back to IN-MEMORY MOCK database mode.');
        console.log('Ensure PostgreSQL is running and database configuration is correct to run database mode.');
        isMockMode = true;
      } else {
        console.log('✅ Connected to PostgreSQL database successfully.');
        await initDbSchema(pool);
      }
    });
  } catch (e) {
    console.warn('⚠️ WARNING: PostgreSQL connection configuration error. Falling back to IN-MEMORY MOCK mode.');
    isMockMode = true;
  }
} else {
  console.warn('⚠️ DATABASE_URL not specified. Falling back to IN-MEMORY MOCK database.');
  isMockMode = true;
}

export const query = async (text, params) => {
  if (isMockMode || !pool) {
    return handleMockQuery(text, params);
  }
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Database Query Error:', error.message);
    throw error;
  }
};

const handleMockQuery = async (text, params) => {
  const cleanSql = text.replace(/\s+/g, ' ').trim().toLowerCase();
  
  // 1. User Authentication SQL Handles
  if (cleanSql.includes('insert into users')) {
    const name = params[0];
    const email = params[1];
    const password_hash = params[2];
    
    if (mockDb.users.some(u => u.email === email)) {
      const error = new Error('duplicate key value violates unique constraint "users_email_key"');
      error.code = '23505';
      throw error;
    }
    
    const newUser = { id: mockDb.users.length + 1, name, email, password_hash, xp: 0, level: 1, created_at: new Date() };
    mockDb.users.push(newUser);
    return { rows: [newUser] };
  }
  
  if (cleanSql.includes('select * from users where email =')) {
    const email = params[0];
    const user = mockDb.users.find(u => u.email === email);
    return { rows: user ? [user] : [] };
  }
  
  if (cleanSql.includes('from users where id =')) {
    const id = parseInt(params[0]);
    const user = mockDb.users.find(u => u.id === id);
    return { rows: user ? [user] : [] };
  }
  
  if (cleanSql.includes('update users set xp =')) {
    const xp = parseInt(params[0]);
    const level = parseInt(params[1]);
    const id = parseInt(params[2]);
    const user = mockDb.users.find(u => u.id === id);
    if (user) {
      user.xp = xp;
      user.level = level;
    }
    return { rows: user ? [user] : [] };
  }
  
  // 2. User Progress SQL Handles
  if (cleanSql.includes('select * from user_progress where user_id =')) {
    const userId = parseInt(params[0]);
    if (cleanSql.includes('module_id =') && params.length >= 4) {
      const moduleId = params[1];
      const topicId = params[2];
      const type = params[3];
      const records = mockDb.progress.filter(
        p => p.user_id === userId && p.module_id === moduleId && p.topic_id === topicId && p.type === type
      );
      return { rows: records };
    }
    const records = mockDb.progress.filter(p => p.user_id === userId);
    return { rows: records };
  }
  
  if (cleanSql.includes('insert into user_progress') || cleanSql.includes('on conflict')) {
    const user_id = parseInt(params[0]);
    const module_id = params[1];
    const topic_id = params[2];
    const type = params[3];
    
    let record = mockDb.progress.find(
      p => p.user_id === user_id && p.module_id === module_id && p.topic_id === topic_id && p.type === type
    );
    
    if (!record) {
      record = { id: mockDb.progress.length + 1, user_id, module_id, topic_id, type, completed: true, completed_at: new Date() };
      mockDb.progress.push(record);
    } else {
      record.completed = true;
      record.completed_at = new Date();
    }
    return { rows: [record] };
  }
  
  // 3. User Achievements SQL Handles
  if (cleanSql.includes('select * from user_achievements where user_id =')) {
    const userId = parseInt(params[0]);
    if (cleanSql.includes('achievement_id =') && params.length >= 2) {
      const achId = params[1];
      const records = mockDb.achievements.filter(a => a.user_id === userId && a.achievement_id === achId);
      return { rows: records };
    }
    const records = mockDb.achievements.filter(a => a.user_id === userId);
    return { rows: records };
  }
  
  if (cleanSql.includes('insert into user_achievements')) {
    const user_id = parseInt(params[0]);
    const achievement_id = params[1];
    
    let record = mockDb.achievements.find(
      a => a.user_id === user_id && a.achievement_id === achievement_id
    );
    
    if (!record) {
      record = { id: mockDb.achievements.length + 1, user_id, achievement_id, unlocked_at: new Date() };
      mockDb.achievements.push(record);
    }
    return { rows: [record] };
  }
  
  // 4. User Challenges SQL Handles
  if (cleanSql.includes('select * from user_challenges where user_id =')) {
    const userId = parseInt(params[0]);
    if (cleanSql.includes('challenge_id =') && params.length >= 2) {
      const challengeId = params[1];
      const records = mockDb.challenges.filter(c => c.user_id === userId && c.challenge_id === challengeId);
      return { rows: records };
    }
    const records = mockDb.challenges.filter(c => c.user_id === userId);
    return { rows: records };
  }
  
  if (cleanSql.includes('insert into user_challenges')) {
    const user_id = parseInt(params[0]);
    const challenge_id = params[1];
    
    let record = mockDb.challenges.find(
      c => c.user_id === user_id && c.challenge_id === challenge_id
    );
    
    if (!record) {
      record = { id: mockDb.challenges.length + 1, user_id, challenge_id, completed_at: new Date() };
      mockDb.challenges.push(record);
    }
    return { rows: [record] };
  }

  // Generic transaction support for tests
  if (cleanSql === 'begin' || cleanSql === 'commit' || cleanSql === 'rollback') {
    return { rows: [] };
  }
  
  return { rows: [] };
};

export const getMockStatus = () => isMockMode;
export const resetMockDbForTesting = () => {
  mockDb.users = [];
  mockDb.progress = [];
  mockDb.achievements = [];
  mockDb.challenges = [];
};
