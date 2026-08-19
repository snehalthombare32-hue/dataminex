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

// Function to auto-initialize DB schema if tables are missing
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
      console.log('⚙️ Database tables not found. Initializing schema from schema.sql...');
      const schemaSqlPath = path.join(process.cwd(), 'schema.sql');
      const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
      await dbPool.query(schemaSql);
      console.log('✅ Database schema initialized successfully!');
    }
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err.message);
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
  
  return { rows: [] };
};

export const getMockStatus = () => isMockMode;
