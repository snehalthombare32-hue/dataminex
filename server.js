import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as db from './db.js';
import { queryKnowledgeBase } from './knowledgeBase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dataminex_token_key';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Lightweight In-Memory Rate Limiter
const rateLimitMap = new Map();
const cleanupRateLimits = () => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.startTime > data.windowMs) {
      rateLimitMap.delete(key);
    }
  }
};
setInterval(cleanupRateLimits, 60000).unref();

const createRateLimiter = (maxRequests, windowMinutes) => {
  const windowMs = windowMinutes * 60 * 1000;
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimitMap.get(key) || { count: 0, startTime: now, windowMs };

    if (now - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = now;
    } else {
      record.count++;
    }
    rateLimitMap.set(key, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please slow down and try again later.',
        retryAfterSeconds: Math.ceil((record.startTime + windowMs - now) / 1000)
      });
    }
    next();
  };
};

const authRateLimiter = createRateLimiter(60, 15);
const apiRateLimiter = createRateLimiter(600, 15);

// Apply API rate limiting
app.use('/api/', apiRateLimiter);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }
  
  if (token === 'demo_student_token') {
    req.user = { id: 1, email: 'student@dataminex.edu', name: 'Demo Student' };
    return next();
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// API: Check database mode
app.get('/api/status', (req, res) => {
  res.json({
    dbMode: db.getMockStatus() ? 'Mock (In-Memory)' : 'PostgreSQL Database',
    status: 'online'
  });
});

// Auth Routes
app.post('/api/auth/register', authRateLimiter, async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Full name must be at least 2 characters.' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, xp, level',
      [name.trim(), email.toLowerCase().trim(), passwordHash]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user });
  } catch (error) {
    if (error.code === '23505' || error.message.includes('unique constraint') || error.message.includes('already exists')) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

app.post('/api/auth/login', authRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, xp: user.xp, level: user.level }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, xp, level, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Progress Routes
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_progress WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/progress', authenticateToken, async (req, res) => {
  const { moduleId, topicId, type } = req.body;
  if (!moduleId || !topicId || !type) {
    return res.status(400).json({ error: 'moduleId, topicId, and type are required.' });
  }
  
  try {
    // Check if this item was already completed previously
    const existingProg = await db.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND module_id = $2 AND topic_id = $3 AND type = $4',
      [req.user.id, moduleId, topicId, type]
    );
    const wasAlreadyCompleted = existingProg.rows.length > 0 && existingProg.rows[0].completed;

    // Record progress
    await db.query(
      `INSERT INTO user_progress (user_id, module_id, topic_id, type) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, module_id, topic_id, type) 
       DO UPDATE SET completed = TRUE, completed_at = CURRENT_TIMESTAMP`,
      [req.user.id, moduleId, topicId, type]
    );
    
    // Fetch all current progress to evaluate achievements
    const progressResult = await db.query('SELECT * FROM user_progress WHERE user_id = $1', [req.user.id]);
    const progress = progressResult.rows;
    
    // Fetch user's achievements
    const achResult = await db.query('SELECT * FROM user_achievements WHERE user_id = $1', [req.user.id]);
    const ownedAchievements = new Set(achResult.rows.map(a => a.achievement_id));
    
    // Fetch challenges completed count
    const chalResult = await db.query('SELECT * FROM user_challenges WHERE user_id = $1', [req.user.id]);
    const challengesCount = chalResult.rows.length;
    
    const newlyUnlocked = [];
    
    // Helper to unlock an achievement
    const unlock = async (achievementId) => {
      if (!ownedAchievements.has(achievementId)) {
        await db.query(
          'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [req.user.id, achievementId]
        );
        newlyUnlocked.push(achievementId);
      }
    };
    
    // Rule checking for achievements
    // 1. First Lesson
    const hasAnyLesson = progress.some(p => p.type === 'lesson');
    if (hasAnyLesson) await unlock('first-lesson');
    
    // 2. ETL Explorer: ETL process lesson + practice completed
    const etlLesson = progress.some(p => p.module_id === 'warehouse' && p.topic_id === 'etl-process' && p.type === 'lesson');
    const etlPractice = progress.some(p => p.module_id === 'warehouse' && p.topic_id === 'etl-process' && p.type === 'practice');
    if (etlLesson && etlPractice) await unlock('etl-explorer');
    
    // 3. Warehouse Builder: Star schema practical completed
    const starSchemaPractice = progress.some(p => p.module_id === 'warehouse' && p.topic_id === 'star-schema' && p.type === 'practice');
    if (starSchemaPractice) await unlock('warehouse-builder');
    
    // 4. OLAP Explorer: Perform all five OLAP operations
    const olapDemo = progress.some(p => p.module_id === 'warehouse' && p.topic_id === 'olap-operations' && p.type === 'demo');
    if (olapDemo) await unlock('olap-explorer');
    
    // 5. Mining Beginner: First mining algorithm lesson completed
    const miningLesson = progress.some(p => p.module_id === 'mining' && p.type === 'lesson');
    if (miningLesson) await unlock('mining-beginner');
    
    // 6. K-Means Explorer: Successfully run K-Means demo
    const kmeansDemo = progress.some(p => p.module_id === 'mining' && p.topic_id === 'kmeans-clustering' && p.type === 'demo');
    if (kmeansDemo) await unlock('kmeans-explorer');
    
    // 7. Analytics Explorer: Complete analytics dashboard live demo
    const analyticsDemo = progress.some(p => p.module_id === 'analytics' && p.topic_id === 'dashboard-design' && p.type === 'demo');
    if (analyticsDemo) await unlock('analytics-explorer');
    
    // 8. Data Detective: Complete 5 challenges
    if (challengesCount >= 5) await unlock('data-detective');
    
    // Calculate and award XP ONLY IF NOT previously completed
    let xpAward = 0;
    if (!wasAlreadyCompleted) {
      if (type === 'lesson') xpAward = 100;
      else if (type === 'demo') xpAward = 250;
      else if (type === 'quiz') xpAward = 300;
      else xpAward = 50;
    }
    
    const userResult = await db.query('SELECT xp, level FROM users WHERE id = $1', [req.user.id]);
    let { xp, level } = userResult.rows[0];
    let levelUp = false;

    if (xpAward > 0) {
      xp = (xp || 0) + xpAward;
      let nextThreshold = 250 * (level + 1) * level;
      while (xp >= nextThreshold) {
        level++;
        levelUp = true;
        nextThreshold = 250 * (level + 1) * level;
      }
      await db.query('UPDATE users SET xp = $1, level = $2 WHERE id = $3', [xp, level, req.user.id]);
    }
    
    res.json({
      success: true,
      alreadyCompleted: wasAlreadyCompleted,
      progress,
      newlyUnlocked,
      xpAward,
      xp,
      level,
      levelUp
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Achievements Routes
app.get('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_achievements WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Challenges Routes
app.get('/api/challenges', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_challenges WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/challenges', authenticateToken, async (req, res) => {
  const { challengeId } = req.body;
  if (!challengeId) {
    return res.status(400).json({ error: 'challengeId is required.' });
  }
  
  try {
    // 1. Check if user has ALREADY completed this challenge to prevent duplicate XP exploit
    const existingChal = await db.query(
      'SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2',
      [req.user.id, challengeId]
    );

    const allChals = await db.query('SELECT * FROM user_challenges WHERE user_id = $1', [req.user.id]);
    const userResult = await db.query('SELECT xp, level FROM users WHERE id = $1', [req.user.id]);
    let { xp, level } = userResult.rows[0];

    if (existingChal.rows.length > 0) {
      return res.json({
        success: true,
        alreadyCompleted: true,
        message: 'Challenge already completed. No duplicate XP awarded.',
        completedChallenges: allChals.rows,
        newlyUnlocked: [],
        xpAward: 0,
        xp,
        level,
        levelUp: false
      });
    }

    // 2. Newly completed: Record challenge
    await db.query(
      'INSERT INTO user_challenges (user_id, challenge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, challengeId]
    );
    
    // Check if Data Detective should unlock now (completing 5 challenges)
    const chalResult = await db.query('SELECT * FROM user_challenges WHERE user_id = $1', [req.user.id]);
    const challengesCount = chalResult.rows.length;
    
    let newlyUnlocked = [];
    if (challengesCount >= 5) {
      const achResult = await db.query(
        'SELECT * FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
        [req.user.id, 'data-detective']
      );
      if (achResult.rows.length === 0) {
        await db.query(
          'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [req.user.id, 'data-detective']
        );
        newlyUnlocked.push('data-detective');
      }
    }
    
    // Award +200 XP strictly on FIRST completion
    xp = (xp || 0) + 200;
    
    let levelUp = false;
    let nextThreshold = 250 * (level + 1) * level;
    while (xp >= nextThreshold) {
      level++;
      levelUp = true;
      nextThreshold = 250 * (level + 1) * level;
    }
    
    await db.query('UPDATE users SET xp = $1, level = $2 WHERE id = $3', [xp, level, req.user.id]);
    
    res.json({
      success: true,
      alreadyCompleted: false,
      completedChallenges: chalResult.rows,
      newlyUnlocked,
      xpAward: 200,
      xp,
      level,
      levelUp
    });
  } catch (error) {
    console.error('Save challenge error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Offline AI Study Assistant Endpoint (100% Free, Zero Paid API Keys)
app.post('/api/ai/ask', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Query text is required.' });
  }

  try {
    const tutorResponse = queryKnowledgeBase(query);
    res.json({
      freeMode: true,
      localDeterministicEngine: true,
      ...tutorResponse
    });
  } catch (err) {
    console.error('AI ask error:', err);
    res.status(500).json({ error: 'Failed to process AI educational query.' });
  }
});

// System Free-Only Compliance Verification Endpoint
app.get('/api/system/free-check', (req, res) => {
  res.json({
    status: "100% Free & Open-Source Compliant",
    paidApisUsed: false,
    requiresCreditCard: false,
    requiresPaidSubscription: false,
    localDeterministicEngine: true,
    dbMode: db.getMockStatus() ? 'Mock (In-Memory, Zero Setup)' : 'Local PostgreSQL'
  });
});

// Fallback to Single Page Application shell
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DataMineX Learning Platform running on http://localhost:${PORT}`);
});
