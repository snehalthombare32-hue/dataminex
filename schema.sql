-- DataMineX Database Schema

-- Drop tables if they exist (for easy resetting)
DROP TABLE IF EXISTS user_challenges CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table (tracks completion of lessons, practicals, demos, quizzes)
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(50) NOT NULL, -- 'warehouse', 'mining', 'analytics'
    topic_id VARCHAR(100) NOT NULL, -- e.g. 'etl-process', 'star-schema'
    type VARCHAR(20) NOT NULL,      -- 'lesson', 'practice', 'demo', 'quiz'
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_progress UNIQUE (user_id, module_id, topic_id, type)
);

-- User achievements table
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL, -- e.g. 'first-lesson', 'etl-explorer'
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- User challenges table (tracks completed real-world challenges)
CREATE TABLE user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(50) NOT NULL, -- e.g. 'student-performance'
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_challenge UNIQUE (user_id, challenge_id)
);

-- Indexing for fast lookups
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_challenges_user ON user_challenges(user_id);
