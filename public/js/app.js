// DataMineX - Single Page Application Core & Routing Logic

import { warehouseTheory } from './theory/warehouseTheory.js';
import { lakeTheory } from './theory/lakeTheory.js';
import { miningTheory } from './theory/miningTheory.js';
import { analyticsTheory } from './theory/analyticsTheory.js';
import { renderPracticeQuestion, renderModuleQuiz } from './practice.js';
import { renderChallenges } from './challenges.js';
import { renderAchievements, showUnlockToast } from './achievements.js';
import { initETLDemo, initKMeansDemo, initOLAPDemo } from './demos.js';
import { VirtualVideoPlayer } from './videos.js';
import { SqlPlayground, ErdSchemaBuilder, AprioriSimulator, BiDashboardBuilder } from './sandboxes.js';
import { SchemaGenerator } from './schemaGenerator.js';
import { ClassificationDemo, DataExplorationDemo } from './miningDemos.js';
import { NumericalSolver } from './numericalSolver.js';
import { UniversalQuestionSolver } from './universalSolver.js';
import { AIAssistant } from './aiAssistant.js';
import { PracticalLabHub } from './practicalLab.js';
import { DemoVideosPage } from './demoVideos.js';
import { NotesManager } from './notes.js';
import { ResourcesManager } from './resources.js';
import { ReportExporter } from './reportExporter.js';

// Application State
const state = {
  token: localStorage.getItem('token') || null,
  user: null,
  progress: [],
  achievements: [],
  challenges: [],
  guidedMode: localStorage.getItem('guidedMode') === 'true',
  activeVideoPlayer: null,
  theory: {
    warehouse: warehouseTheory,
    lake: lakeTheory,
    mining: miningTheory,
    analytics: analyticsTheory
  }
};

// API Fetch Helpers
const api = {
  headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': state.token ? `Bearer ${state.token}` : ''
    };
  },
  
  async get(url) {
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    if (state.user && data && data.xp !== undefined) {
      state.user.xp = data.xp;
      state.user.level = data.level;
    }
    return data;
  },
  
  async post(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    const responseData = await res.json();
    if (state.user && responseData && responseData.xp !== undefined) {
      state.user.xp = responseData.xp;
      state.user.level = responseData.level;
      if (responseData.levelUp) {
        showLevelUpNotification(responseData.level);
      }
    }
    return responseData;
  }
};

// Start application
window.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initGlobalEvents();
  
  if (state.token) {
    await bootstrapUser();
  } else {
    router();
  }
});

// Theme Switcher Initializer
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;
  
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
    themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    document.documentElement.classList.remove('light-theme');
    themeIcon.setAttribute('data-lucide', 'sun');
  }
  
  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
}

// Watch hash changes
window.addEventListener('hashchange', router);

async function bootstrapUser() {
  try {
    state.user = await api.get('/api/auth/me');
    state.progress = await api.get('/api/progress');
    state.achievements = await api.get('/api/achievements');
    state.challenges = await api.get('/api/challenges');
    
    // Toggle Layout views
    document.getElementById('root').classList.remove('auth-layout');
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('top-nav').classList.remove('hidden');
    document.getElementById('main-panel').classList.remove('full-width');
    
    updateGlobalHeaderStats();
    router();
  } catch (err) {
    console.error('Failed bootstrapping user, signing out.', err);
    signOut();
  }
}

function signOut() {
  localStorage.removeItem('token');
  state.token = null;
  state.user = null;
  state.progress = [];
  state.achievements = [];
  state.challenges = [];
  
  document.getElementById('root').classList.add('auth-layout');
  document.getElementById('sidebar').classList.add('hidden');
  document.getElementById('top-nav').classList.add('hidden');
  document.getElementById('main-panel').classList.add('full-width');
  
  window.location.hash = '#/login';
}

// Global Event Listeners
function initGlobalEvents() {
  // Logout Btn
  document.getElementById('logout-btn').addEventListener('click', signOut);
  
  // Guided Mode Toggle
  const guidedCheckbox = document.getElementById('guided-mode-checkbox');
  guidedCheckbox.checked = state.guidedMode;
  guidedCheckbox.addEventListener('change', (e) => {
    state.guidedMode = e.target.checked;
    localStorage.setItem('guidedMode', e.target.checked);
    // Reload current view to update overlays
    router();
  });
  
  // Mobile Nav Toggles
  const sidebar = document.getElementById('sidebar');
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    sidebar.classList.add('open');
  });
  document.getElementById('sidebar-close').addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
  
  // Search Box
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      searchResults.classList.add('hidden');
      return;
    }
    
    // Search across theory lessons
    const matches = [];
    Object.entries(state.theory).forEach(([modName, lessons]) => {
      lessons.forEach(les => {
        const titleMatch = les.title.toLowerCase().includes(q);
        const blockMatch = les.blocks.some(b => b.content.toLowerCase().includes(q));
        
        if (titleMatch || blockMatch) {
          matches.push({
            module: modName,
            lessonId: les.id,
            title: les.title
          });
        }
      });
    });
    
    if (matches.length > 0) {
      searchResults.classList.remove('hidden');
      searchResults.innerHTML = matches.map(m => `
        <div class="search-result-item" data-hash="#/module/${m.module}/learn/${m.lessonId}">
          <span class="search-result-title">${m.title}</span>
          <span class="search-result-meta">${m.module.toUpperCase()} Lesson</span>
        </div>
      `).join('');
      
      searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          window.location.hash = item.getAttribute('data-hash');
          searchResults.classList.add('hidden');
          searchInput.value = "";
        });
      });
    } else {
      searchResults.classList.remove('hidden');
      searchResults.innerHTML = `<div style="padding: 12px 16px; font-size: 13px; color: var(--text-muted);">No matching lessons found.</div>`;
    }
  });
  
  // Close search on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchResults.classList.add('hidden');
    }
  });
}

// Level Up Notification Popup
function showLevelUpNotification(newLevel) {
  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  overlay.innerHTML = `
    <div class="level-up-card">
      <div class="level-up-badge">🏆</div>
      <div class="level-up-title">LEVEL UP!</div>
      <div class="level-up-details">
        Congratulations! You have reached a new rank of knowledge in Data Warehousing & Analytics.
      </div>
      <div class="level-up-new-level">Rank Unlocked: Level ${newLevel}</div>
      <button class="btn btn-primary" id="btn-close-level-up" style="margin-top: 10px;">Claim Reward &rarr;</button>
    </div>
  `;
  document.body.appendChild(overlay);
  
  document.getElementById('btn-close-level-up').addEventListener('click', () => {
    overlay.remove();
  });
}

// Calculate Progress Metrics
function calculateProgress() {
  // Total components check:
  // Warehouse has 8 lessons, 8 practice questions, 1 live demo, 1 quiz = 18 elements
  // Mining has 5 lessons, 5 practice questions, 1 live demo, 1 quiz = 12 elements
  // Analytics has 4 lessons, 4 practice questions, 1 live demo, 1 quiz = 10 elements
  // Total elements = 40
  
  const counts = {
    warehouse: { total: 18, done: 0 },
    lake: { total: 6, done: 0 },
    mining: { total: 12, done: 0 },
    analytics: { total: 10, done: 0 }
  };
  
  state.progress.forEach(p => {
    if (counts[p.module_id]) {
      counts[p.module_id].done++;
    }
  });
  
  const overallDone = state.progress.length;
  const overallTotal = 46;
  
  const warehousePct = Math.round((counts.warehouse.done / counts.warehouse.total) * 100);
  const lakePct = Math.round((counts.lake.done / counts.lake.total) * 100);
  const miningPct = Math.round((counts.mining.done / counts.mining.total) * 100);
  const analyticsPct = Math.round((counts.analytics.done / counts.analytics.total) * 100);
  const overallPct = Math.round((overallDone / overallTotal) * 100);
  
  return {
    warehouse: warehousePct,
    lake: lakePct,
    mining: miningPct,
    analytics: analyticsPct,
    overall: overallPct,
    details: {
      lessons: state.progress.filter(p => p.type === 'lesson').length,
      practices: state.progress.filter(p => p.type === 'practice').length,
      demos: state.progress.filter(p => p.type === 'demo').length,
      quizzes: state.progress.filter(p => p.type === 'quiz').length,
      challenges: state.challenges.length
    }
  };
}

function updateGlobalHeaderStats() {
  const p = calculateProgress();
  
  // Top nav elements
  document.getElementById('top-progress-text').innerText = `${p.overall}%`;
  document.getElementById('top-progress-fill').style.width = `${p.overall}%`;
  document.getElementById('top-achievements-count').innerText = state.achievements.length;
  
  // Avatar initials & user stats updates
  if (state.user) {
    const letters = state.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    document.getElementById('avatar-letters').innerText = letters;
    
    // Update XP and Level card in sidebar
    const xp = state.user.xp || 0;
    const lvl = state.user.level || 1;
    
    // Determine Rank Title
    let rank = 'Data Novice';
    if (lvl >= 10) rank = 'Data Mine Master';
    else if (lvl >= 7) rank = 'Data Miner';
    else if (lvl >= 5) rank = 'ETL Architect';
    else if (lvl >= 3) rank = 'SQL Wrangler';
    
    const currentThreshold = 250 * lvl * (lvl - 1);
    const nextThreshold = 250 * (lvl + 1) * lvl;
    const xpInLevel = xp - currentThreshold;
    const xpRequiredForNext = nextThreshold - currentThreshold;
    const xpPct = Math.min(100, Math.max(0, Math.round((xpInLevel / xpRequiredForNext) * 100)));
    
    document.getElementById('sidebar-rank-text').innerText = rank;
    document.getElementById('sidebar-level-text').innerText = `Lvl ${lvl}`;
    document.getElementById('sidebar-xp-fill').style.width = `${xpPct}%`;
    document.getElementById('sidebar-xp-ratio').innerText = `${xpInLevel} / ${xpRequiredForNext} XP`;
    
    document.getElementById('sidebar-level-card').style.display = 'block';
  } else {
    document.getElementById('sidebar-level-card').style.display = 'none';
  }
}

// Router Orchestrator
async function router() {
  if (state.activeVideoPlayer) {
    state.activeVideoPlayer.destroy();
    state.activeVideoPlayer = null;
  }
  
  const hash = window.location.hash || '#/dashboard';
  
  // Check auth lock
  if (!state.token && hash !== '#/login' && hash !== '#/register') {
    window.location.hash = '#/login';
    return;
  }
  
  // Highlight active menu in sidebar
  highlightSidebar(hash);
  
  // Parse routes
  const appContainer = document.querySelector('#app');
  appContainer.innerHTML = ""; // Reset views
  
  // Close mobile sidebar on routing
  document.getElementById('sidebar').classList.remove('open');
  
  // 1. Auth Routing
  if (hash === '#/login') {
    renderLoginView(appContainer);
  } else if (hash === '#/register') {
    renderRegisterView(appContainer);
  }
  
  // 2. Dashboard Home Routing
  else if (hash === '#/dashboard') {
    renderDashboardView(appContainer);
  }
  
  // 3. Learning Path View
  else if (hash === '#/learning-path') {
    renderLearningPathView(appContainer);
  }
  
  // 4. Module Landing View
  else if (hash.startsWith('#/module/')) {
    const parts = hash.split('/');
    const modId = parts[2];
    
    if (parts.length === 3) {
      renderModuleLandingView(appContainer, modId);
    } else if (parts[3] === 'learn') {
      const topicId = parts[4];
      renderLessonReaderView(appContainer, modId, topicId);
    } else if (parts[3] === 'practice') {
      const topicId = parts[4];
      renderPracticeView(appContainer, modId, topicId);
    } else if (parts[3] === 'demo') {
      renderLiveDemoView(appContainer, modId);
    } else if (parts[3] === 'quiz') {
      renderQuizView(appContainer, modId);
    }
  }
  
  // 5. Challenges Tab Routing
  else if (hash === '#/challenges') {
    const completedChallengeIds = state.challenges.map(c => c.challenge_id);
    renderChallenges('#app', completedChallengeIds, async (challengeId) => {
      try {
        const res = await api.post('/api/challenges', { challengeId });
        state.challenges = res.completedChallenges;
        updateGlobalHeaderStats();
        
        // Toast newly unlocked badges
        if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
          res.newlyUnlocked.forEach(badgeId => {
            state.achievements.push({ achievement_id: badgeId });
            showUnlockToast(badgeId);
          });
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
  
  // 6. Achievements Gallery Routing
  else if (hash === '#/achievements') {
    const unlockedIds = state.achievements.map(a => a.achievement_id);
    renderAchievements('#app', unlockedIds);
  }
  
  // 7. Progress Charts View Routing
  else if (hash === '#/progress') {
    renderProgressReportView(appContainer);
  }
  
  // 8. Profile View Routing
  else if (hash === '#/profile') {
    renderProfileView(appContainer);
  }
  
  // 9. SQL Query Console Sandbox Routing
  else if (hash === '#/sql-sandbox') {
    new SqlPlayground('#app');
  }

  // 10. Automated Dimensional Schema Generator Routing
  else if (hash === '#/schema-generator') {
    new SchemaGenerator('#app');
  }

  // 11. OLAP Operations Visualizer Routing
  else if (hash === '#/olap-visualizer') {
    initOLAPDemo('#app', false, () => {});
  }

  // 12. Exploratory Data Analysis (EDA) Routing
  else if (hash === '#/data-exploration') {
    new DataExplorationDemo('#app');
  }

  // 13. Supervised Classification Visualizer Routing
  else if (hash === '#/classification') {
    new ClassificationDemo('#app');
  }

  // 14. Local Deterministic Numerical Solver
  else if (hash === '#/numerical-solver') {
    new NumericalSolver('#app');
  }

  // 15. Universal Question Solver (Free Fallback)
  else if (hash === '#/universal-solver') {
    new UniversalQuestionSolver('#app');
  }

  // 16. Free AI Study Assistant
  else if (hash === '#/ai-assistant') {
    new AIAssistant('#app');
  }

  // 17. Practical Lab Hub
  else if (hash === '#/practical-lab') {
    new PracticalLabHub('#app');
  }

  // 18. Demo Videos Page
  else if (hash === '#/demo-videos') {
    new DemoVideosPage('#app');
  }

  // 19. My Notes Page
  else if (hash === '#/notes') {
    new NotesManager('#app');
  }

  // 20. Resources Page
  else if (hash === '#/resources') {
    new ResourcesManager('#app');
  }
  
  // Refresh Lucide Icons after template draw
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function highlightSidebar(hash) {
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  
  let matchId = 'nav-dashboard';
  if (hash === '#/dashboard') matchId = 'nav-dashboard';
  else if (hash.includes('/warehouse')) matchId = 'nav-warehouse';
  else if (hash.includes('/mining')) matchId = 'nav-mining';
  else if (hash === '#/numerical-solver') matchId = 'nav-numerical-solver';
  else if (hash === '#/practical-lab') matchId = 'nav-practical-lab';
  else if (hash === '#/demo-videos') matchId = 'nav-demo-videos';
  else if (hash === '#/ai-assistant') matchId = 'nav-ai-assistant';
  else if (hash === '#/progress') matchId = 'nav-progress';
  else if (hash === '#/notes') matchId = 'nav-notes';
  else if (hash === '#/resources') matchId = 'nav-resources';
  else if (hash === '#/universal-solver') matchId = 'nav-numerical-solver';
  
  const el = document.getElementById(matchId);
  if (el) el.classList.add('active');
}

// ==========================================
// VIEW RENDER TEMPLATES
// ==========================================

function renderLoginView(container) {
  container.innerHTML = `
    <div class="auth-split-screen animate-slide-up">
      <!-- Left Column: Form -->
      <div class="auth-left-col">
        <!-- Close mark button -->
        <div class="auth-close-btn">&times;</div>
        
        <div class="auth-form-wrapper">
          <div class="auth-header">
            <h1 class="auth-title">DataMineX</h1>
            <p class="auth-subtitle">Sign in to access your interactive learning courses, practice terminals, and achievements dashboard.</p>
          </div>
          
          <div id="auth-error" class="error-message hidden"></div>
          
          <form id="login-form">
            <div class="form-group-custom">
              <div class="input-icon-wrapper">
                <i data-lucide="user" class="input-icon"></i>
                <input type="email" id="login-email" class="form-input-custom" placeholder="Username or email" required>
              </div>
            </div>
            
            <div class="form-group-custom">
              <div class="input-icon-wrapper">
                <i data-lucide="key-round" class="input-icon"></i>
                <input type="password" id="login-password" class="form-input-custom" placeholder="Password" required>
                <i data-lucide="eye" class="eye-icon" id="toggle-password-visibility"></i>
              </div>
            </div>
            
            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" id="remember-me-checkbox">
                <span>Remember me</span>
              </label>
              <a href="#/forgot-password" class="forgot-link">Forgot password?</a>
            </div>
            
            <button type="submit" class="btn-login-submit">LOGIN</button>
          </form>
          
          <div class="auth-switch-custom">
            Don't have an account? <a href="#/register" class="switch-link">Register now</a>
          </div>
          
          <div class="auth-divider">
            <span>or</span>
          </div>
          
          <!-- Social Logins -->
          <div class="social-logins">
            <button class="btn-social btn-fb">
              <i data-lucide="facebook" class="social-icon"></i>
              <span>LOGIN WITH FACEBOOK</span>
            </button>
            <button class="btn-social btn-tw">
              <i data-lucide="twitter" class="social-icon"></i>
              <span>LOGIN WITH TWITTER</span>
            </button>
            <button class="btn-social btn-go">
              <i data-lucide="chrome" class="social-icon"></i>
              <span>LOGIN WITH GOOGLE</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Visual Artwork/Illustration -->
      <div class="auth-right-col">
        <div class="auth-artwork-overlay">
          <div class="artwork-quote">
            <h2>"The goal is to turn data into information, and information into insight."</h2>
            <p>— Carly Fiorina</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Wire up password visibility toggle
  const togglePass = document.getElementById('toggle-password-visibility');
  const passInput = document.getElementById('login-password');
  togglePass.addEventListener('click', () => {
    const isPass = passInput.getAttribute('type') === 'password';
    passInput.setAttribute('type', isPass ? 'text' : 'password');
    togglePass.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
    if (window.lucide) window.lucide.createIcons();
  });
  
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
      const res = await api.post('/api/auth/register'.replace('register', 'login'), { email, password });
      localStorage.setItem('token', res.token);
      state.token = res.token;
      await bootstrapUser();
    } catch (err) {
      const errDiv = document.getElementById('auth-error');
      errDiv.innerText = err.message || "Login failed.";
      errDiv.classList.remove('hidden');
    }
  });
}

function renderRegisterView(container) {
  container.innerHTML = `
    <div class="auth-split-screen animate-slide-up">
      <!-- Left Column: Form -->
      <div class="auth-left-col">
        <!-- Close mark button -->
        <div class="auth-close-btn">&times;</div>
        
        <div class="auth-form-wrapper">
          <div class="auth-header">
            <h1 class="auth-title">DataMineX</h1>
            <p class="auth-subtitle">Create an account to start your interactive learning journey in warehousing and analytics.</p>
          </div>
          
          <div id="auth-error" class="error-message hidden"></div>
          
          <form id="register-form">
            <div class="form-group-custom">
              <div class="input-icon-wrapper">
                <i data-lucide="text-cursor-input" class="input-icon"></i>
                <input type="text" id="reg-name" class="form-input-custom" placeholder="Your Full Name" required>
              </div>
            </div>
            
            <div class="form-group-custom">
              <div class="input-icon-wrapper">
                <i data-lucide="mail" class="input-icon"></i>
                <input type="email" id="reg-email" class="form-input-custom" placeholder="Email Address" required>
              </div>
            </div>
            
            <div class="form-group-custom" style="margin-bottom: 24px;">
              <div class="input-icon-wrapper">
                <i data-lucide="key-round" class="input-icon"></i>
                <input type="password" id="reg-password" class="form-input-custom" placeholder="Password (Min 6 chars)" minlength="6" required>
                <i data-lucide="eye" class="eye-icon" id="toggle-password-visibility-reg"></i>
              </div>
            </div>
            
            <button type="submit" class="btn-login-submit" style="width: 140px;">REGISTER</button>
          </form>
          
          <div class="auth-switch-custom">
            Already have an account? <a href="#/login" class="switch-link">Sign In</a>
          </div>
          
          <div class="auth-divider">
            <span>or</span>
          </div>
          
          <!-- Social Logins -->
          <div class="social-logins">
            <button class="btn-social btn-fb">
              <i data-lucide="facebook" class="social-icon"></i>
              <span>REGISTER WITH FACEBOOK</span>
            </button>
            <button class="btn-social btn-tw">
              <i data-lucide="twitter" class="social-icon"></i>
              <span>REGISTER WITH TWITTER</span>
            </button>
            <button class="btn-social btn-go">
              <i data-lucide="chrome" class="social-icon"></i>
              <span>REGISTER WITH GOOGLE</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Visual Artwork/Illustration -->
      <div class="auth-right-col">
        <div class="auth-artwork-overlay">
          <div class="artwork-quote">
            <h2>"Without data, you're just another person with an opinion."</h2>
            <p>— W. Edwards Deming</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Wire up password visibility toggle
  const togglePass = document.getElementById('toggle-password-visibility-reg');
  const passInput = document.getElementById('reg-password');
  togglePass.addEventListener('click', () => {
    const isPass = passInput.getAttribute('type') === 'password';
    passInput.setAttribute('type', isPass ? 'text' : 'password');
    togglePass.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
    if (window.lucide) window.lucide.createIcons();
  });
  
  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.token);
      state.token = res.token;
      await bootstrapUser();
    } catch (err) {
      const errDiv = document.getElementById('auth-error');
      errDiv.innerText = err.message || "Registration failed.";
      errDiv.classList.remove('hidden');
    }
  });
}

function renderDashboardView(container) {
  const p = calculateProgress();
  const userName = state.user ? state.user.name : 'Snehal';
  
  const lessonsDone = p.details.lessons;
  const dwhDone = state.progress.filter(x => x.module_id === 'warehouse').length;
  const miningDone = state.progress.filter(x => x.module_id === 'mining').length;
  const labDone = p.details.practices;
  const quizDone = p.details.quizzes;

  container.innerHTML = `
    <!-- Top Welcome & Dynamic Progress Banner -->
    <div class="dashboard-top-banner animate-slide-up" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 28px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);">
      
      <!-- Welcome Section -->
      <div class="welcome-section" style="display: flex; flex-direction: column; justify-content: center;">
        <h1 class="welcome-title" style="font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: white;">Welcome back, ${userName}! 👋</h1>
        <p class="welcome-subtitle" style="font-size: 1rem; opacity: 0.95; margin-bottom: 20px;">Continue your learning journey in Data Warehousing & Data Mining.</p>
        <div>
          <a href="#/module/warehouse" class="btn" style="background: white; color: #4f46e5; font-weight: 600; padding: 10px 22px; border-radius: 8px; border: none; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            Explore Now &rarr;
          </a>
        </div>
      </div>

      <!-- Your Learning Progress Card -->
      <div class="learning-progress-card" style="background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(10px); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 1.05rem; font-weight: 600; margin: 0; color: white;">Your Learning Progress</h3>
          <span style="font-size: 1.5rem; font-weight: 800; color: #a5f3fc;">${p.overall}%</span>
        </div>
        
        <div style="font-size: 0.88rem; font-weight: 600; color: #e0e7ff; margin-bottom: 12px;">
          ${lessonsDone} / 20 Topics Completed
        </div>

        <!-- Progress Metrics Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem;">
          <div style="background: rgba(0, 0, 0, 0.15); padding: 8px 12px; border-radius: 6px;">
            <div style="opacity: 0.8; font-size: 0.75rem;">Data Warehousing</div>
            <div style="font-weight: 700; font-size: 0.95rem;">${Math.min(10, dwhDone)}/10</div>
          </div>
          <div style="background: rgba(0, 0, 0, 0.15); padding: 8px 12px; border-radius: 6px;">
            <div style="opacity: 0.8; font-size: 0.75rem;">Data Mining</div>
            <div style="font-weight: 700; font-size: 0.95rem;">${Math.min(10, miningDone)}/10</div>
          </div>
          <div style="background: rgba(0, 0, 0, 0.15); padding: 8px 12px; border-radius: 6px;">
            <div style="opacity: 0.8; font-size: 0.75rem;">Practical Labs</div>
            <div style="font-weight: 700; font-size: 0.95rem;">${Math.min(5, labDone)}/5</div>
          </div>
          <div style="background: rgba(0, 0, 0, 0.15); padding: 8px 12px; border-radius: 6px;">
            <div style="opacity: 0.8; font-size: 0.75rem;">Quizzes</div>
            <div style="font-weight: 700; font-size: 0.95rem;">${Math.min(5, quizDone)}/5</div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN SUBJECT SECTION: ONLY 2 LARGE CARDS -->
    <div style="margin-bottom: 36px;">
      <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; color: var(--text-heading, #1e293b);">Core Subjects</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
        
        <!-- DATA WAREHOUSING CARD -->
        <div class="card subject-card" style="background: white; border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s;">
          <div>
            <div style="width: 54px; height: 54px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.5rem;">
              <i data-lucide="database"></i>
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 700; color: #0f172a; margin-bottom: 10px;">DATA WAREHOUSING</h3>
            <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;">
              Learn concepts, explore structured data and perform analytical operations.
            </p>
          </div>
          <a href="#/module/warehouse" class="btn btn-primary" style="background: #2563eb; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center; display: block;">
            Explore Data Warehousing &rarr;
          </a>
        </div>

        <!-- DATA MINING CARD -->
        <div class="card subject-card" style="background: white; border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s;">
          <div>
            <div style="width: 54px; height: 54px; border-radius: 12px; background: #faf5ff; color: #9333ea; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.5rem;">
              <i data-lucide="sparkles"></i>
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 700; color: #0f172a; margin-bottom: 10px;">DATA MINING</h3>
            <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;">
              Discover patterns, build models and gain knowledge from data.
            </p>
          </div>
          <a href="#/module/mining" class="btn btn-primary" style="background: #9333ea; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center; display: block;">
            Explore Data Mining &rarr;
          </a>
        </div>
      </div>
    </div>

    <!-- QUICK ACCESS SECTION -->
    <div style="margin-bottom: 36px;">
      <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; color: var(--text-heading, #1e293b);">Quick Access</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
        
        <!-- 1. Numerical Solver -->
        <div class="card quick-access-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; margin-bottom: 14px;">
              <i data-lucide="calculator"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Numerical Solver</h4>
            <p style="color: #64748b; font-size: 0.85rem; line-height: 1.4; margin-bottom: 16px;">
              Upload a question and get a step-by-step solution.
            </p>
          </div>
          <a href="#/numerical-solver" class="btn btn-outline" style="width: 100%; text-align: center; display: block; border-color: #cbd5e1; color: #334155; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
            Solve Now &rarr;
          </a>
        </div>

        <!-- 2. Practical Lab -->
        <div class="card quick-access-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; margin-bottom: 14px;">
              <i data-lucide="flask-conical"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Practical Lab</h4>
            <p style="color: #64748b; font-size: 0.85rem; line-height: 1.4; margin-bottom: 16px;">
              Perform hands-on experiments with datasets.
            </p>
          </div>
          <a href="#/practical-lab" class="btn btn-outline" style="width: 100%; text-align: center; display: block; border-color: #cbd5e1; color: #334155; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
            Start Practicing &rarr;
          </a>
        </div>

        <!-- 3. Demo Videos -->
        <div class="card quick-access-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #fef2f2; color: #dc2626; display: flex; align-items: center; justify-content: center; margin-bottom: 14px;">
              <i data-lucide="play-circle"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Demo Videos</h4>
            <p style="color: #64748b; font-size: 0.85rem; line-height: 1.4; margin-bottom: 16px;">
              Watch step-by-step demonstrations.
            </p>
          </div>
          <a href="#/demo-videos" class="btn btn-outline" style="width: 100%; text-align: center; display: block; border-color: #cbd5e1; color: #334155; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
            Watch Videos &rarr;
          </a>
        </div>

        <!-- 4. AI Assistant -->
        <div class="card quick-access-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #f0f9ff; color: #0284c7; display: flex; align-items: center; justify-content: center; margin-bottom: 14px;">
              <i data-lucide="bot"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">AI Assistant</h4>
            <p style="color: #64748b; font-size: 0.85rem; line-height: 1.4; margin-bottom: 16px;">
              Ask doubts and get instant explanations.
            </p>
          </div>
          <a href="#/ai-assistant" class="btn btn-outline" style="width: 100%; text-align: center; display: block; border-color: #cbd5e1; color: #334155; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
            Ask Now &rarr;
          </a>
        </div>
      </div>
    </div>

    <!-- CONTINUE LEARNING & RECENT ACTIVITY GRID -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 36px;">
      
      <!-- CONTINUE LEARNING -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-heading, #1e293b); margin: 0;">Continue Learning</h2>
          <a href="#/learning-path" style="font-size: 0.88rem; font-weight: 600; color: #2563eb; text-decoration: none;">View All &rarr;</a>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          
          <!-- Topic Card 1 -->
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="flex: 1;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #2563eb; letter-spacing: 0.5px;">Data Warehousing</span>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 4px 0 8px;">OLAP Operations</h4>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="flex: 1; max-width: 160px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="width: 75%; height: 100%; background: #2563eb;"></div>
                </div>
                <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">75%</span>
              </div>
            </div>
            <a href="#/olap-visualizer" class="btn btn-primary btn-sm" style="background: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 0.85rem;">Continue</a>
          </div>

          <!-- Topic Card 2 -->
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="flex: 1;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #9333ea; letter-spacing: 0.5px;">Data Mining</span>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 4px 0 8px;">K-Means Clustering</h4>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="flex: 1; max-width: 160px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="width: 50%; height: 100%; background: #9333ea;"></div>
                </div>
                <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">50%</span>
              </div>
            </div>
            <a href="#/numerical-solver" class="btn btn-primary btn-sm" style="background: #9333ea; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 0.85rem;">Continue</a>
          </div>

          <!-- Topic Card 3 -->
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="flex: 1;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #9333ea; letter-spacing: 0.5px;">Data Mining</span>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 4px 0 8px;">Apriori Association Mining</h4>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="flex: 1; max-width: 160px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="width: 40%; height: 100%; background: #9333ea;"></div>
                </div>
                <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">40%</span>
              </div>
            </div>
            <a href="#/module/mining/learn/apriori-algorithm" class="btn btn-primary btn-sm" style="background: #9333ea; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 0.85rem;">Continue</a>
          </div>

        </div>
      </div>

      <!-- RECENT ACTIVITY -->
      <div>
        <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-heading, #1e293b); margin-bottom: 16px;">Recent Activity</h2>
        
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 16px;">
          
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;">
              <i data-lucide="check-circle-2"></i>
            </div>
            <div>
              <div style="font-size: 0.88rem; font-weight: 600; color: #0f172a;">Completed Star Schema Lab</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">2 hours ago</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #fef2f2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;">
              <i data-lucide="play"></i>
            </div>
            <div>
              <div style="font-size: 0.88rem; font-weight: 600; color: #0f172a;">Watched K-Means Demo Video</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Yesterday</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;">
              <i data-lucide="calculator"></i>
            </div>
            <div>
              <div style="font-size: 0.88rem; font-weight: 600; color: #0f172a;">Solved Regression Problem</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">2 days ago</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #faf5ff; color: #9333ea; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;">
              <i data-lucide="award"></i>
            </div>
            <div>
              <div style="font-size: 0.88rem; font-weight: 600; color: #0f172a;">Attempted Data Mining Quiz</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">3 days ago</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderLearningPathView(container) {
  const p = calculateProgress();
  
  container.innerHTML = `
    <div class="welcome-section">
      <h1 class="welcome-title">Visual Learning Pathway</h1>
      <p class="welcome-subtitle">Master these modules sequentially to build complete data science competency.</p>
    </div>
    
    <div class="learning-path-connector">
      
      <!-- Module 1 -->
      <div class="path-card ${p.warehouse >= 100 ? 'completed' : 'current'} animate-slide-up">
        <div class="path-header">
          <div class="path-title-group">
            <span class="path-icon">🏢</span>
            <h3 class="syllabus-title">1. Data Warehouse</h3>
          </div>
          <span class="path-badge ${p.warehouse >= 100 ? 'badge-completed' : 'badge-current'}">${p.warehouse >= 100 ? 'COMPLETED' : 'ACTIVE'}</span>
        </div>
        <p class="path-desc">Learn database warehousing schemas, OLAP operations and staging ETL processes.</p>
        <div class="path-stats">
          <span>📚 8 Lessons</span>
          <span>🛠 4 Practicals</span>
          <span>⚡ 2 Demos</span>
        </div>
        <div class="path-progress-container">
          <div class="path-progress-bar"><div class="path-progress-fill" style="width: ${p.warehouse}%"></div></div>
          <span class="path-progress-percent">${p.warehouse}%</span>
        </div>
        <a href="#/module/warehouse" class="btn btn-primary btn-block" style="margin-top: 10px;">Continue &rarr;</a>
      </div>
      
      <div class="path-arrow-down"></div>

      <!-- Module: Data Lake -->
      <div class="path-card ${p.lake >= 100 ? 'completed' : 'current'}">
        <div class="path-header">
          <div class="path-title-group">
            <span class="path-icon">🌊</span>
            <h3 class="syllabus-title">2. Data Lake Architecture</h3>
          </div>
          <span class="path-badge ${p.lake >= 100 ? 'badge-completed' : 'badge-current'}">${p.lake >= 100 ? 'COMPLETED' : 'ACTIVE'}</span>
        </div>
        <p class="path-desc">Understand Schema-on-Read, Medallion Architecture (Bronze-Silver-Gold), and Data Lake vs DWH comparisons.</p>
        <div class="path-stats">
          <span>📚 3 Lessons</span>
          <span>🛠 3 Architecture Tiers</span>
          <span>⚡ Interactive</span>
        </div>
        <div class="path-progress-container">
          <div class="path-progress-bar"><div class="path-progress-fill" style="width: ${p.lake}%"></div></div>
          <span class="path-progress-percent">${p.lake}%</span>
        </div>
        <a href="#/module/lake" class="btn btn-primary btn-block" style="margin-top: 10px;">Explore &rarr;</a>
      </div>
      
      <div class="path-arrow-down"></div>
      
      <!-- Module 2 -->
      <div class="path-card ${p.warehouse < 100 ? 'locked' : (p.mining >= 100 ? 'completed' : 'current')}">
        <div class="path-header">
          <div class="path-title-group">
            <span class="path-icon">⛏</span>
            <h3 class="syllabus-title">3. Data Mining</h3>
          </div>
          <span class="path-badge ${p.warehouse < 100 ? 'badge-locked' : (p.mining >= 100 ? 'badge-completed' : 'badge-current')}">
            ${p.warehouse < 100 ? 'LOCKED' : (p.mining >= 100 ? 'COMPLETED' : 'ACTIVE')}
          </span>
        </div>
        <p class="path-desc">Study statistical preprocessing rules, Apriori rule mining, and K-Means coordinates clustering.</p>
        <div class="path-stats">
          <span>📚 5 Lessons</span>
          <span>🛠 3 Practicals</span>
          <span>⚡ 1 Demo</span>
        </div>
        <div class="path-progress-container">
          <div class="path-progress-bar"><div class="path-progress-fill" style="width: ${p.mining}%"></div></div>
          <span class="path-progress-percent">${p.mining}%</span>
        </div>
        ${p.warehouse >= 100 ? `
          <a href="#/module/mining" class="btn btn-primary btn-block" style="margin-top: 10px;">Start &rarr;</a>
        ` : `
          <button class="btn btn-outline btn-block" style="margin-top: 10px; cursor: not-allowed;" disabled>Locked (Complete Warehouse first)</button>
        `}
      </div>
      
      <div class="path-arrow-down"></div>
      
      <!-- Module 3 -->
      <div class="path-card ${p.mining < 100 ? 'locked' : (p.analytics >= 100 ? 'completed' : 'current')}">
        <div class="path-header">
          <div class="path-title-group">
            <span class="path-icon">📊</span>
            <h3 class="syllabus-title">3. Data Analytics</h3>
          </div>
          <span class="path-badge ${p.mining < 100 ? 'badge-locked' : (p.analytics >= 100 ? 'badge-completed' : 'badge-current')}">
            ${p.mining < 100 ? 'LOCKED' : (p.analytics >= 100 ? 'COMPLETED' : 'ACTIVE')}
          </span>
        </div>
        <p class="path-desc">Examine descriptive classifications, BI aggregation suites and build visual dashboard cards.</p>
        <div class="path-stats">
          <span>📚 4 Lessons</span>
          <span>🛠 2 Practicals</span>
          <span>⚡ 1 Demo</span>
        </div>
        <div class="path-progress-container">
          <div class="path-progress-bar"><div class="path-progress-fill" style="width: ${p.analytics}%"></div></div>
          <span class="path-progress-percent">${p.analytics}%</span>
        </div>
        ${p.mining >= 100 ? `
          <a href="#/module/analytics" class="btn btn-primary btn-block" style="margin-top: 10px;">Start &rarr;</a>
        ` : `
          <button class="btn btn-outline btn-block" style="margin-top: 10px; cursor: not-allowed;" disabled>Locked (Complete Mining first)</button>
        `}
      </div>
      
    </div>
  `;
}

function renderModuleLandingView(container, moduleId) {
  const p = calculateProgress();
  const titleMap = { warehouse: "Data Warehouse", lake: "Data Lake Architecture", mining: "Data Mining", analytics: "Data Analytics" };
  const title = titleMap[moduleId] || "Module";
  const lessons = state.theory[moduleId] || [];
  const modulePercent = p[moduleId] || 0;
  
  // Compute how many elements are completed in this module
  const completedLessons = state.progress.filter(x => x.module_id === moduleId && x.type === 'lesson').map(x => x.topic_id);
  const completedPractices = state.progress.filter(x => x.module_id === moduleId && x.type === 'practice').map(x => x.topic_id);
  const completedDemos = state.progress.filter(x => x.module_id === moduleId && x.type === 'demo');
  const completedQuizzes = state.progress.filter(x => x.module_id === moduleId && x.type === 'quiz');
  
  // Find next unfinished lesson/prac/demo/quiz to recommend
  let nextActionHash = "";
  let nextActionLabel = "";
  
  // Find first uncompleted lesson
  const firstUnfinishedLesson = lessons.find(l => !completedLessons.includes(l.id));
  if (firstUnfinishedLesson) {
    nextActionHash = `#/module/${moduleId}/learn/${firstUnfinishedLesson.id}`;
    nextActionLabel = `Start Lesson: ${firstUnfinishedLesson.title.split('. ')[1] || firstUnfinishedLesson.title}`;
  } else {
    // Check practice completions corresponding to lessons
    const firstUnfinishedPrac = lessons.find(l => !completedPractices.includes(l.id));
    if (firstUnfinishedPrac) {
      nextActionHash = `#/module/${moduleId}/practice/${firstUnfinishedPrac.id}`;
      nextActionLabel = `Start Practice for: ${firstUnfinishedPrac.title.split('. ')[1] || firstUnfinishedPrac.title}`;
    } else if (completedDemos.length === 0) {
      nextActionHash = `#/module/${moduleId}/demo`;
      nextActionLabel = "Start Guided Live Demo";
    } else if (completedQuizzes.length === 0) {
      nextActionHash = `#/module/${moduleId}/quiz`;
      nextActionLabel = "Take Comprehensive Module Quiz";
    } else {
      nextActionHash = `#/dashboard`;
      nextActionLabel = "Module Mastered! Go to Dashboard";
    }
  }

  container.innerHTML = `
    <div class="module-header">
      <h1 class="welcome-title">${title}</h1>
      <p class="welcome-subtitle">Module completion status: <strong>${modulePercent}%</strong></p>
      
      <div class="continue-progress" style="max-width: 480px; margin: 12px 0 20px;">
        <div class="continue-progress-bar">
          <div class="continue-progress-fill" style="width: ${modulePercent}%; background-color: var(--color-indigo);"></div>
        </div>
      </div>
      
      <div class="module-meta-stats">
        <span>📚 ${lessons.length} Lessons</span>
        <span>🛠 ${lessons.length} Practicals</span>
        <span>⚡ 1 Guided Live Demo</span>
      </div>
      
      <div style="margin-top: 16px;">
        <a href="${nextActionHash}" class="btn btn-primary">${nextActionLabel} &rarr;</a>
      </div>
    </div>
    
    <h2 class="path-section-title">Syllabus Outline</h2>
    <div class="syllabus-list">
      
      <!-- Lessons -->
      ${lessons.map((les, index) => {
        const isLesDone = completedLessons.includes(les.id);
        const isPracDone = completedPractices.includes(les.id);
        
        let statusClass = "syllabus-locked";
        let iconName = "lock";
        
        // Logical unlock: first item is unlocked, or previous item is done
        const isUnlocked = index === 0 || completedLessons.includes(lessons[index-1].id);
        
        if (isUnlocked) {
          statusClass = isLesDone && isPracDone ? "syllabus-completed" : "syllabus-current";
          iconName = isLesDone && isPracDone ? "check-circle" : "play-circle";
        }
        
        return `
          <div class="syllabus-item ${statusClass}">
            <div class="syllabus-left">
              <span class="status-icon ${isLesDone && isPracDone ? 'completed' : (isUnlocked ? 'current' : 'locked')}">
                <i data-lucide="${iconName}"></i>
              </span>
              <div>
                <span class="syllabus-title">${les.title}</span>
                <div style="font-size: 12px; color: var(--text-muted); display: flex; gap: 12px; margin-top: 4px;">
                  <span style="color: ${isLesDone ? 'var(--color-emerald)' : 'var(--text-muted)'};">Lesson: ${isLesDone ? 'Complete' : 'Pending'}</span>
                  <span style="color: ${isPracDone ? 'var(--color-emerald)' : 'var(--text-muted)'};">Practice: ${isPracDone ? 'Complete' : 'Pending'}</span>
                </div>
              </div>
            </div>
            
            <div class="syllabus-right">
              ${isUnlocked ? `
                <a href="#/module/${moduleId}/learn/${les.id}" class="btn btn-outline btn-sm">Study</a>
                ${isLesDone ? `
                  <a href="#/module/${moduleId}/practice/${les.id}" class="btn ${isPracDone ? 'btn-outline' : 'btn-primary'} btn-sm">Practice</a>
                ` : ``}
              ` : `
                <span style="font-size: 12px; color: var(--text-muted);">Study previous lesson to unlock</span>
              `}
            </div>
          </div>
        `;
      }).join('')}
      
      <!-- Live Demo node -->
      <div class="syllabus-item ${completedLessons.length === lessons.length ? (completedDemos.length > 0 ? 'syllabus-completed' : 'syllabus-current') : 'syllabus-locked'}">
        <div class="syllabus-left">
          <span class="status-icon ${completedDemos.length > 0 ? 'completed' : (completedLessons.length === lessons.length ? 'current' : 'locked')}">
            <i data-lucide="${completedDemos.length > 0 ? 'check-circle' : 'play-circle'}"></i>
          </span>
          <div>
            <span class="syllabus-title">Guided Live Demo Simulator</span>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Interactive guided tool practice simulating realistic scenarios.</p>
          </div>
        </div>
        <div class="syllabus-right">
          ${completedLessons.length === lessons.length ? `
            <a href="#/module/${moduleId}/demo" class="btn btn-primary btn-sm">Launch Demo</a>
          ` : `
            <span style="font-size: 12px; color: var(--text-muted);">Complete all lessons to unlock</span>
          `}
        </div>
      </div>
      
      <!-- Comprehensive Quiz node -->
      <div class="syllabus-item ${completedDemos.length > 0 ? (completedQuizzes.length > 0 ? 'syllabus-completed' : 'syllabus-current') : 'syllabus-locked'}">
        <div class="syllabus-left">
          <span class="status-icon ${completedQuizzes.length > 0 ? 'completed' : (completedDemos.length > 0 ? 'current' : 'locked')}">
            <i data-lucide="award"></i>
          </span>
          <div>
            <span class="syllabus-title">Comprehensive Module Quiz</span>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Test your knowledge of all topics in this module to earn your badge.</p>
          </div>
        </div>
        <div class="syllabus-right">
          ${completedDemos.length > 0 ? `
            <a href="#/module/${moduleId}/quiz" class="btn btn-primary btn-sm">Take Quiz</a>
          ` : `
            <span style="font-size: 12px; color: var(--text-muted);">Complete Live Demo to unlock</span>
          `}
        </div>
      </div>
      
    </div>
  `;
}

function renderLessonReaderView(container, moduleId, lessonId) {
  const lessons = state.theory[moduleId] || [];
  const lessonIndex = lessons.findIndex(l => l.id === lessonId);
  const lesson = lessons[lessonIndex];
  
  if (!lesson) {
    container.innerHTML = `<h3>Lesson not found.</h3>`;
    return;
  }
  
  // Left Sidebar outline links
  const completedLessons = state.progress.filter(x => x.module_id === moduleId && x.type === 'lesson').map(x => x.topic_id);
  
  let thirdTabHtml = "";
  let thirdPanelHtml = "";
  if (lessonId === 'star-schema') {
    thirdTabHtml = `
      <button class="tab-btn" id="tab-btn-third">
        <i data-lucide="puzzle"></i>
        <span>Schema Builder Puzzle</span>
      </button>
    `;
    thirdPanelHtml = `
      <div id="panel-third" class="lesson-body hidden">
        <div id="erd-puzzle-mount"></div>
      </div>
    `;
  } else if (lessonId === 'snowflake-schema' || lessonId === 'fact-constellation') {
    thirdTabHtml = `
      <button class="tab-btn" id="tab-btn-third">
        <i data-lucide="cpu"></i>
        <span>Auto Schema Generator</span>
      </button>
    `;
    thirdPanelHtml = `
      <div id="panel-third" class="lesson-body hidden">
        <div id="schema-generator-mount"></div>
      </div>
    `;
  } else if (lessonId === 'olap-operations') {
    thirdTabHtml = `
      <button class="tab-btn" id="tab-btn-third">
        <i data-lucide="refresh-cw"></i>
        <span>OLAP Visualizer</span>
      </button>
    `;
    thirdPanelHtml = `
      <div id="panel-third" class="lesson-body hidden">
        <div id="olap-visualizer-mount"></div>
      </div>
    `;
  } else if (lessonId === 'classification') {
    thirdTabHtml = `
      <button class="tab-btn" id="tab-btn-third">
        <i data-lucide="git-branch"></i>
        <span>Classification Visualizer</span>
      </button>
    `;
    thirdPanelHtml = `
      <div id="panel-third" class="lesson-body hidden">
        <div id="classification-mount"></div>
      </div>
    `;
  } else if (lessonId === 'data-exploration') {
    thirdTabHtml = `
      <button class="tab-btn" id="tab-btn-third">
        <i data-lucide="bar-chart-2"></i>
        <span>EDA Visualizer</span>
      </button>
    `;
    thirdPanelHtml = `
      <div id="panel-third" class="lesson-body hidden">
        <div id="data-exploration-mount"></div>
      </div>
    `;
  } else if (lessonId === 'apriori-algorithm') {
    thirdTabHtml = `
      <button class="tab-btn" id="tab-btn-third">
        <i data-lucide="shopping-cart"></i>
        <span>Apriori Simulator</span>
      </button>
    `;
    thirdPanelHtml = `
      <div id="panel-third" class="lesson-body hidden">
        <div id="apriori-simulator-mount"></div>
      </div>
    `;
  } else if (lessonId === 'dashboard-design') {
    thirdTabHtml = `
      <button class="tab-btn" id="tab-btn-third">
        <i data-lucide="bar-chart-2"></i>
        <span>Dashboard Builder</span>
      </button>
    `;
    thirdPanelHtml = `
      <div id="panel-third" class="lesson-body hidden">
        <div id="bi-dashboard-mount"></div>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="lesson-layout animate-slide-up">
      <!-- Lesson Navigation Outline -->
      <aside class="lesson-sidebar">
        <h3 class="lesson-sidebar-title">Lessons Outline</h3>
        <div class="lesson-sidebar-list">
          ${lessons.map((les, index) => `
            <a href="#/module/${moduleId}/learn/${les.id}" class="lesson-sidebar-item ${les.id === lessonId ? 'active current' : ''} ${completedLessons.includes(les.id) ? 'completed' : ''}">
              <span>${les.title.split('. ')[1] || les.title}</span>
            </a>
          `).join('')}
        </div>
      </aside>
      
      <!-- Lesson Main Content -->
      <article class="lesson-main">
        <div class="lesson-title-meta">${moduleId.toUpperCase()} — Lesson ${lessonIndex + 1} of ${lessons.length}</div>
        <h1 class="lesson-heading">${lesson.title}</h1>
        
        <!-- Tab Controls -->
        <div class="lesson-tabs">
          <button class="tab-btn active" id="tab-btn-theory">
            <i data-lucide="book-open"></i>
            <span>Lesson Theory</span>
          </button>
          <button class="tab-btn" id="tab-btn-video">
            <i data-lucide="video"></i>
            <span>Video Lecture</span>
          </button>
          ${thirdTabHtml}
        </div>
        
        <!-- Panel 1: Written Theory -->
        <div id="panel-theory" class="lesson-body">
          ${lesson.blocks.map(b => {
            if (b.type === 'table') {
              return `
                <div class="block-table">
                  <div class="block-table-title">${b.title}</div>
                  <div class="table-scroll-container">
                    <table class="theory-table">
                      <thead>
                        <tr>${b.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                      </thead>
                      <tbody>
                        ${b.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              `;
            }
            
            // Format block headers matching icons
            let blockClass = "";
            let blockIcon = "";
            if (b.type === 'key-concept') { blockClass = "block-key-concept"; blockIcon = "💡 Key Concept"; }
            else if (b.type === 'definition') { blockClass = "block-definition"; blockIcon = "📌 Definition"; }
            else if (b.type === 'example') { blockClass = "block-example"; blockIcon = "🔍 Example"; }
            else if (b.type === 'remember') { blockClass = "block-remember"; blockIcon = "⭐ Remember"; }
            
            return `
              <div class="learning-block ${blockClass}">
                <div class="learning-block-header">${blockIcon}: ${b.title || ''}</div>
                <p class="learning-block-content">${b.content}</p>
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- Panel 2: Simulated Animated Video Lecture -->
        <div id="panel-video" class="lesson-body hidden">
          <div id="video-player-mount"></div>
        </div>
        
        <!-- Panel 3: Interactive Sandbox (Dynamic) -->
        ${thirdPanelHtml}
        
        <!-- Lesson Transition & Nav buttons -->
        <div class="lesson-nav">
          ${lessonIndex > 0 ? `
            <a href="#/module/${moduleId}/learn/${lessons[lessonIndex-1].id}" class="btn btn-outline">&larr; Previous</a>
          ` : `<span></span>`}
          
          <button class="btn btn-primary" id="btn-mark-complete-lesson">
            ${completedLessons.includes(lessonId) ? 'Read Again & Practice &rarr;' : 'Mark Read & Practice &rarr;'}
          </button>
        </div>
      </article>
    </div>
  `;
  
  // Tab change event handlers
  const tabTheory = container.querySelector('#tab-btn-theory');
  const tabVideo = container.querySelector('#tab-btn-video');
  const tabThird = container.querySelector('#tab-btn-third');
  const panelTheory = container.querySelector('#panel-theory');
  const panelVideo = container.querySelector('#panel-video');
  const panelThird = container.querySelector('#panel-third');
  
  tabTheory.addEventListener('click', () => {
    tabTheory.classList.add('active');
    tabVideo.classList.remove('active');
    if (tabThird) tabThird.classList.remove('active');
    
    panelTheory.classList.remove('hidden');
    panelVideo.classList.add('hidden');
    if (panelThird) panelThird.classList.add('hidden');
    
    if (state.activeVideoPlayer) {
      state.activeVideoPlayer.destroy();
      state.activeVideoPlayer = null;
    }
  });
  
  tabVideo.addEventListener('click', () => {
    tabVideo.classList.add('active');
    tabTheory.classList.remove('active');
    if (tabThird) tabThird.classList.remove('active');
    
    panelVideo.classList.remove('hidden');
    panelTheory.classList.add('hidden');
    if (panelThird) panelThird.classList.add('hidden');
    
    // Select lecture type based on current lesson
    let videoType = 'dwh-intro';
    if (moduleId === 'warehouse') {
      if (lessonId === 'etl-process') {
        videoType = 'etl';
      } else if (lessonId === 'fact-dimension' || lessonId === 'star-schema' || lessonId === 'snowflake-schema') {
        videoType = 'schema';
      }
    } else if (moduleId === 'mining') {
      if (lessonId === 'apriori-algorithm') {
        videoType = 'apriori';
      } else {
        videoType = 'kmeans';
      }
    } else if (moduleId === 'analytics') {
      videoType = 'olap';
    }
    
    // Launch virtual video player on mounting root
    state.activeVideoPlayer = new VirtualVideoPlayer(videoType, '#video-player-mount');
  });
  
  if (tabThird && panelThird) {
    tabThird.addEventListener('click', () => {
      tabThird.classList.add('active');
      tabTheory.classList.remove('active');
      tabVideo.classList.remove('active');
      
      panelThird.classList.remove('hidden');
      panelTheory.classList.add('hidden');
      panelVideo.classList.add('hidden');
      
      if (state.activeVideoPlayer) {
        state.activeVideoPlayer.destroy();
        state.activeVideoPlayer = null;
      }
      
      // Load selected sandbox
      if (lessonId === 'star-schema') {
        new ErdSchemaBuilder('#erd-puzzle-mount', async () => {
          try {
            // Trigger progress with complete callback
            const res = await api.post('/api/progress', { moduleId, topicId: 'star-schema-completed', type: 'demo' });
            state.progress = res.progress;
            updateGlobalHeaderStats();
          } catch (e) {
            console.error(e);
          }
        });
      } else if (lessonId === 'snowflake-schema' || lessonId === 'fact-constellation') {
        new SchemaGenerator('#schema-generator-mount');
      } else if (lessonId === 'olap-operations') {
        initOLAPDemo('#olap-visualizer-mount', false, () => {});
      } else if (lessonId === 'classification') {
        new ClassificationDemo('#classification-mount');
      } else if (lessonId === 'data-exploration') {
        new DataExplorationDemo('#data-exploration-mount');
      } else if (lessonId === 'apriori-algorithm') {
        new AprioriSimulator('#apriori-simulator-mount');
      } else if (lessonId === 'dashboard-design') {
        new BiDashboardBuilder('#bi-dashboard-mount');
      }
    });
  }
  
  document.getElementById('btn-mark-complete-lesson').addEventListener('click', async () => {
    try {
      const res = await api.post('/api/progress', { moduleId, topicId: lessonId, type: 'lesson' });
      state.progress = res.progress;
      updateGlobalHeaderStats();
      
      // Unlock check toast
      if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
        res.newlyUnlocked.forEach(badgeId => {
          state.achievements.push({ achievement_id: badgeId });
          showUnlockToast(badgeId);
        });
      }
      
      // Navigate straight to practice exercise next
      window.location.hash = `#/module/${moduleId}/practice/${lessonId}`;
    } catch (err) {
      console.error(err);
    }
  });
}

function renderPracticeView(container, moduleId, lessonId) {
  renderPracticeQuestion('#app', lessonId, async () => {
    try {
      const res = await api.post('/api/progress', { moduleId, topicId: lessonId, type: 'practice' });
      state.progress = res.progress;
      updateGlobalHeaderStats();
      
      if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
        res.newlyUnlocked.forEach(badgeId => {
          state.achievements.push({ achievement_id: badgeId });
          showUnlockToast(badgeId);
        });
      }
      
      // Next step logic: Go back to module landing to see unlocked next syllabus line
      window.location.hash = `#/module/${moduleId}`;
    } catch (err) {
      console.error(err);
    }
  });
}

function renderLiveDemoView(container, moduleId) {
  if (state.activeVideoPlayer) {
    state.activeVideoPlayer.destroy();
    state.activeVideoPlayer = null;
  }

  container.innerHTML = `
    <!-- Top tabs to select walkthrough video vs interactive simulator -->
    <div class="lesson-tabs" style="margin-bottom: 24px;">
      <button class="tab-btn active" id="tab-btn-demo-sim">
        <i data-lucide="play-circle"></i>
        <span>Interactive Simulator</span>
      </button>
      <button class="tab-btn" id="tab-btn-demo-video">
        <i data-lucide="video"></i>
        <span>Demo Walkthrough Video</span>
      </button>
    </div>
    
    <div id="panel-demo-sim"></div>
    <div id="panel-demo-video" class="hidden">
      <div id="demo-video-mount"></div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  const completeCallback = async () => {
    try {
      const res = await api.post('/api/progress', { moduleId, topicId: `${moduleId}-live-demo`, type: 'demo' });
      state.progress = res.progress;
      updateGlobalHeaderStats();
      
      if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
        res.newlyUnlocked.forEach(badgeId => {
          state.achievements.push({ achievement_id: badgeId });
          showUnlockToast(badgeId);
        });
      }
      
      window.location.hash = `#/module/${moduleId}`;
    } catch (err) {
      console.error(err);
    }
  };
  
  // Load initial interactive simulator
  loadInteractiveDemo();
  
  function loadInteractiveDemo() {
    if (moduleId === 'warehouse') {
      initETLDemo('#panel-demo-sim', state.guidedMode, completeCallback);
    } else if (moduleId === 'mining') {
      initKMeansDemo('#panel-demo-sim', state.guidedMode, completeCallback);
    } else if (moduleId === 'analytics') {
      initOLAPDemo('#panel-demo-sim', state.guidedMode, completeCallback);
    }
  }
  
  // Tab Event Listeners
  const tabSim = container.querySelector('#tab-btn-demo-sim');
  const tabVideo = container.querySelector('#tab-btn-demo-video');
  const panelSim = container.querySelector('#panel-demo-sim');
  const panelVideo = container.querySelector('#panel-demo-video');
  
  tabSim.addEventListener('click', () => {
    tabSim.classList.add('active');
    tabVideo.classList.remove('active');
    panelSim.classList.remove('hidden');
    panelVideo.classList.add('hidden');
    
    if (state.activeVideoPlayer) {
      state.activeVideoPlayer.destroy();
      state.activeVideoPlayer = null;
    }
    loadInteractiveDemo();
  });
  
  tabVideo.addEventListener('click', () => {
    tabVideo.classList.add('active');
    tabSim.classList.remove('active');
    panelVideo.classList.remove('hidden');
    panelSim.classList.add('hidden');
    
    const videoType = `${moduleId}-demo`;
    state.activeVideoPlayer = new VirtualVideoPlayer(videoType, '#demo-video-mount');
  });
}

function renderQuizView(container, moduleId) {
  renderModuleQuiz('#app', moduleId, async (score) => {
    try {
      const res = await api.post('/api/progress', { moduleId, topicId: `${moduleId}-module-quiz`, type: 'quiz' });
      state.progress = res.progress;
      updateGlobalHeaderStats();
      
      if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
        res.newlyUnlocked.forEach(badgeId => {
          state.achievements.push({ achievement_id: badgeId });
          showUnlockToast(badgeId);
        });
      }
      
      window.location.hash = `#/module/${moduleId}`;
    } catch (err) {
      console.error(err);
    }
  });
}

function renderProgressReportView(container) {
  const p = calculateProgress();
  
  container.innerHTML = `
    <div class="welcome-section">
      <h1 class="welcome-title">My Progress Report</h1>
      <p class="welcome-subtitle">A detailed breakdown of your coursework accomplishments.</p>
    </div>
    
    <div class="progress-grid animate-slide-up">
      <!-- Graphical Chart -->
      <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 24px; border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h3 style="margin-bottom: 20px;">Module Coverage Map</h3>
        <div style="width: 100%; max-width: 320px; height: 320px; position: relative;">
          <canvas id="progress-radar-chart"></canvas>
        </div>
      </div>
      
      <!-- Summary metrics list -->
      <div class="progress-stats-column">
        <h3 style="border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Completed Activities</h3>
        
        <div class="stat-row">
          <span class="stat-label">Overall Completion</span>
          <span class="stat-value" style="color: var(--color-indigo);">${p.overall}%</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Theory Lessons Completed</span>
          <span class="stat-value">${p.details.lessons} / 17</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Practicals Solved</span>
          <span class="stat-value">${p.details.practices} / 17</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Live Guided Demos Completed</span>
          <span class="stat-value">${p.details.demos} / 3</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Quizzes Conquered</span>
          <span class="stat-value">${p.details.quizzes} / 3</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Real-World Case Challenges</span>
          <span class="stat-value">${p.details.challenges} / 5</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Achievements Unlocked</span>
          <span class="stat-value">${state.achievements.length} / 8</span>
        </div>
      </div>
    </div>
  `;
  
  // Render Chart.js
  setTimeout(() => {
    const ctx = document.getElementById('progress-radar-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['Data Warehouse', 'Data Mining', 'Data Analytics'],
        datasets: [{
          data: [p.warehouse, p.mining, p.analytics],
          backgroundColor: [
            'rgba(99, 102, 241, 0.4)',  // Indigo
            'rgba(16, 185, 129, 0.4)', // Emerald
            'rgba(244, 63, 94, 0.4)'    // Rose
          ],
          borderColor: [
            '#6366f1',
            '#10b981',
            '#f43f5e'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#f3f4f6', font: { family: 'Inter', size: 11 } }
          }
        },
        scales: {
          r: {
            grid: { color: '#374151' },
            ticks: { display: false },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }, 100);
}

function renderProfileView(container) {
  container.innerHTML = `
    <div class="welcome-section">
      <h1 class="welcome-title">My Profile</h1>
      <p class="welcome-subtitle">Manage account parameters and configurations.</p>
    </div>
    
    <div class="quiz-card animate-slide-up" style="max-width: 480px;">
      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 24px;">
        <div class="profile-avatar" style="width: 72px; height: 72px; font-size: 24px; font-weight: 800; border: 3px solid var(--border-focus);">
          ${document.getElementById('avatar-letters').innerText}
        </div>
        <div>
          <h3>${state.user ? state.user.name : 'Data Science Student'}</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">${state.user ? state.user.email : ''}</p>
        </div>
      </div>
      
      <h4 style="border-bottom: 1px solid var(--border-color); padding-bottom: 6px; margin-bottom: 16px;">Platform Settings</h4>
      
      <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="font-size: 14px;">Guided Mode instructions</strong>
          <p style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Shows instruction cards during active simulations.</p>
        </div>
        <label class="switch-container">
          <input type="checkbox" id="profile-guided-checkbox" ${state.guidedMode ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    </div>
  `;
  
  document.getElementById('profile-guided-checkbox').addEventListener('change', (e) => {
    state.guidedMode = e.target.checked;
    localStorage.setItem('guidedMode', e.target.checked);
    document.getElementById('guided-mode-checkbox').checked = e.target.checked;
  });
}
