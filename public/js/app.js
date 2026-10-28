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
import { PracticalLabHub } from './practicalLab.js';
import { UniversalQuestionSolver } from './universalSolver.js';
import { AIAssistant } from './aiAssistant.js';
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
  
  if (!state.token) {
    state.token = 'demo_student_token';
    localStorage.setItem('token', state.token);
  }
  
  await bootstrapUser();
});

// Theme Switcher Initializer (Academic Light SaaS default with Dark Mode toggle)
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;
  
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
      if (themeBtn) themeBtn.setAttribute('title', 'Switch to Light Mode');
    } else {
      document.documentElement.classList.remove('dark-theme');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
      if (themeBtn) themeBtn.setAttribute('title', 'Switch to Dark Mode');
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  applyTheme(savedTheme === 'dark');
  
  themeBtn.addEventListener('click', () => {
    const willBeDark = !document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
    applyTheme(willBeDark);
  });
}

// Watch hash changes
window.addEventListener('hashchange', router);

async function bootstrapUser() {
  try {
    state.user = await api.get('/api/auth/me');
  } catch (err) {
    state.user = {
      name: 'Snehal Thombare',
      email: 'snehal@dataminex.edu',
      xp: 1250,
      level: 3
    };
  }

  try {
    state.progress = await api.get('/api/progress');
  } catch (e) {
    state.progress = [
      { module_id: 'warehouse', type: 'lesson' },
      { module_id: 'warehouse', type: 'practice' },
      { module_id: 'mining', type: 'lesson' }
    ];
  }

  try {
    state.achievements = await api.get('/api/achievements');
  } catch (e) {
    state.achievements = [];
  }

  try {
    state.challenges = await api.get('/api/challenges');
  } catch (e) {
    state.challenges = [];
  }

  // Toggle Layout views
  const rootEl = document.getElementById('root');
  const sidebarEl = document.getElementById('sidebar');
  const topNavEl = document.getElementById('top-nav');
  const mainPanelEl = document.getElementById('main-panel');

  if (rootEl) rootEl.classList.remove('auth-layout');
  if (sidebarEl) sidebarEl.classList.remove('hidden');
  if (topNavEl) topNavEl.classList.remove('hidden');
  if (mainPanelEl) mainPanelEl.classList.remove('full-width');
  
  updateGlobalHeaderStats();
  router();
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

  // Desktop Sidebar Collapse Toggle
  const desktopCollapseBtn = document.getElementById('desktop-collapse-btn');
  if (desktopCollapseBtn) {
    desktopCollapseBtn.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.toggle('collapsed');
      const mainPanel = document.getElementById('main-panel');
      if (mainPanel) mainPanel.classList.toggle('sidebar-collapsed', isCollapsed);
      const icon = document.getElementById('collapse-icon');
      if (icon) {
        icon.setAttribute('data-lucide', isCollapsed ? 'chevron-right' : 'chevron-left');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // Accordion Chevron Toggle Handling (Separate click target for expanding/collapsing)
  const accordionToggles = [
    { btnId: 'toggle-warehouse', accordionId: 'accordion-warehouse' },
    { btnId: 'toggle-mining', accordionId: 'accordion-mining' },
    { btnId: 'toggle-numerical', accordionId: 'accordion-numerical' }
  ];

  accordionToggles.forEach(item => {
    const btn = document.getElementById(item.btnId);
    const accordion = document.getElementById(item.accordionId);
    if (btn && accordion) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        accordion.classList.toggle('open');
      });
    }
  });

  // Mobile Drawer Auto-Close on Link Click
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
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
  else if (hash.startsWith('#/numerical-solver')) {
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

  // 17. Practical Lab (Redirect to Numerical Solver)
  else if (hash === '#/practical-lab' || hash.startsWith('#/practical-lab')) {
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
  // Clear active states on all nav items, subitems, and accordion headers
  document.querySelectorAll('.sidebar-nav .nav-item, .sidebar-nav .nav-subitem, .sidebar-nav .nav-accordion-header').forEach(el => el.classList.remove('active'));
  
  const accordionWh = document.getElementById('accordion-warehouse');
  const accordionDm = document.getElementById('accordion-mining');

  if (hash.startsWith('#/module/warehouse')) {
    if (accordionWh) accordionWh.classList.add('open');
    const whHeader = document.getElementById('nav-warehouse-header');
    if (whHeader) whHeader.classList.add('active');

    // Highlight active subitem
    const parts = hash.split('/');
    if (parts.length >= 5 && parts[3] === 'learn') {
      const topicId = parts[4];
      const subItem = document.querySelector(`#content-warehouse a[href*="${topicId}"]`);
      if (subItem) subItem.classList.add('active');
    } else {
      const overviewItem = document.getElementById('nav-wh-overview');
      if (overviewItem) overviewItem.classList.add('active');
    }
  } else if (hash.startsWith('#/module/mining')) {
    if (accordionDm) accordionDm.classList.add('open');
    const dmHeader = document.getElementById('nav-mining-header');
    if (dmHeader) dmHeader.classList.add('active');

    const parts = hash.split('/');
    if (parts.length >= 5 && parts[3] === 'learn') {
      const topicId = parts[4];
      const subItem = document.querySelector(`#content-mining a[href*="${topicId}"]`);
      if (subItem) subItem.classList.add('active');
    } else {
      const overviewItem = document.getElementById('nav-dm-overview');
      if (overviewItem) overviewItem.classList.add('active');
    }
  } else if (hash.startsWith('#/numerical-solver')) {
    const accordionNum = document.getElementById('accordion-numerical');
    if (accordionNum) accordionNum.classList.add('open');
    const numHeader = document.getElementById('nav-numerical-header');
    if (numHeader) numHeader.classList.add('active');

    if (hash.includes('stage=dataset')) {
      document.getElementById('nav-num-dataset')?.classList.add('active');
    } else if (hash.includes('stage=preprocessing')) {
      document.getElementById('nav-num-prep')?.classList.add('active');
    } else if (hash.includes('stage=classification')) {
      document.getElementById('nav-num-clf')?.classList.add('active');
    } else if (hash.includes('stage=clustering')) {
      document.getElementById('nav-num-clu')?.classList.add('active');
    } else if (hash.includes('stage=arm')) {
      document.getElementById('nav-num-arm')?.classList.add('active');
    } else {
      document.getElementById('nav-numerical-solver')?.classList.add('active');
    }
  } else {
    // Non-module route highlights
    let matchId = 'nav-dashboard';
    if (hash === '#/dashboard') matchId = 'nav-dashboard';
    else if (hash === '#/demo-videos') matchId = 'nav-demo-videos';
    else if (hash === '#/ai-assistant') matchId = 'nav-ai-assistant';
    else if (hash === '#/progress') matchId = 'nav-progress';
    else if (hash === '#/notes') matchId = 'nav-notes';
    else if (hash === '#/resources') matchId = 'nav-resources';
    else if (hash === '#/universal-solver') matchId = 'nav-numerical-solver';

    const el = document.getElementById(matchId);
    if (el) el.classList.add('active');
  }
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
            <div style="opacity: 0.8; font-size: 0.75rem;">Numericals</div>
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
              Upload any numerical question and get a step-by-step solution.
            </p>
          </div>
          <a href="#/numerical-solver" class="btn btn-primary" style="width: 100%; text-align: center; display: block; background: #2563eb; color: white; font-size: 0.88rem; font-weight: 700; text-decoration: none; padding: 10px; border-radius: 8px;">
            📤 Upload Question
          </a>
        </div>

                <!-- 2. Practical Lab -->
        <div class="card quick-access-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin-bottom: 14px;">
              <i data-lucide="flask-conical"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Practical Lab</h4>
            <p style="color: #64748b; font-size: 0.85rem; line-height: 1.4; margin-bottom: 16px;">
              Perform experiments, upload custom CSV, inspect iterations &amp; download reports.
            </p>
          </div>
          <a href="#/practical-lab" class="btn btn-primary" style="width: 100%; text-align: center; display: block; background: #4f46e5; color: white; font-size: 0.88rem; font-weight: 700; text-decoration: none; padding: 10px; border-radius: 8px;">
            🧪 Start Practical
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
          
          ${(() => {
            // Calculate active Data Warehousing lesson
            const dwhLessons = state.theory.warehouse || [];
            const dwhDoneIds = state.progress.filter(x => x.module_id === 'warehouse' && x.type === 'lesson').map(x => x.topic_id);
            const dwhCurrentIdx = dwhLessons.findIndex(l => !dwhDoneIds.includes(l.id));
            const activeDwhIdx = dwhCurrentIdx !== -1 ? dwhCurrentIdx : dwhLessons.length - 1;
            const activeDwhLesson = dwhLessons[activeDwhIdx] || { title: 'Intro to Data Warehouse', id: 'intro-warehouse' };
            const dwhPct = Math.round((dwhDoneIds.length / (dwhLessons.length || 1)) * 100);

            // Calculate active Data Mining lesson
            const miningLessons = state.theory.mining || [];
            const miningDoneIds = state.progress.filter(x => x.module_id === 'mining' && x.type === 'lesson').map(x => x.topic_id);
            const miningCurrentIdx = miningLessons.findIndex(l => !miningDoneIds.includes(l.id));
            const activeMiningIdx = miningCurrentIdx !== -1 ? miningCurrentIdx : miningLessons.length - 1;
            const activeMiningLesson = miningLessons[activeMiningIdx] || { title: 'Intro to Data Mining', id: 'intro-mining' };
            const miningPct = Math.round((miningDoneIds.length / (miningLessons.length || 1)) * 100);

            return `
              <!-- Topic Card 1: Data Warehousing -->
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div style="flex: 1;">
                  <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #2563eb; letter-spacing: 0.5px;">DATA WAREHOUSING</span>
                  <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 4px 0 2px;">${activeDwhLesson.title}</h4>
                  <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">Lesson ${activeDwhIdx + 1} of ${dwhLessons.length}</div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="flex: 1; max-width: 160px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div style="width: ${dwhPct}%; height: 100%; background: #2563eb;"></div>
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">${dwhPct}%</span>
                  </div>
                </div>
                <a href="#/module/warehouse/learn/${activeDwhLesson.id}" class="btn btn-primary btn-sm" style="background: #2563eb; color: white; padding: 8px 18px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 700;">Continue Learning &rarr;</a>
              </div>

              <!-- Topic Card 2: Data Mining -->
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div style="flex: 1;">
                  <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #9333ea; letter-spacing: 0.5px;">DATA MINING</span>
                  <h4 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 4px 0 2px;">${activeMiningLesson.title}</h4>
                  <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">Lesson ${activeMiningIdx + 1} of ${miningLessons.length}</div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="flex: 1; max-width: 160px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div style="width: ${miningPct}%; height: 100%; background: #9333ea;"></div>
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">${miningPct}%</span>
                  </div>
                </div>
                <a href="#/module/mining/learn/${activeMiningLesson.id}" class="btn btn-primary btn-sm" style="background: #9333ea; color: white; padding: 8px 18px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 700;">Continue Learning &rarr;</a>
              </div>
            `;
          })()}

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
  const titleMap = {
    warehouse: "Data Warehousing",
    lake: "Data Lake Architecture",
    mining: "Data Mining",
    analytics: "Data Analytics"
  };
  const title = titleMap[moduleId] || "Module";
  const lessons = state.theory[moduleId] || [];
  const modulePercent = p[moduleId] || 0;
  
  const completedLessons = state.progress.filter(x => x.module_id === moduleId && x.type === 'lesson').map(x => x.topic_id);
  const completedPractices = state.progress.filter(x => x.module_id === moduleId && x.type === 'practice').map(x => x.topic_id);
  const completedQuizzes = state.progress.filter(x => x.module_id === moduleId && x.type === 'quiz');
  
  // Hero subtitle & visual flow pipeline
  let pipelineSteps = [];
  let moduleBadge = "";
  let heroDesc = "";

  if (moduleId === 'warehouse') {
    moduleBadge = "DATA WAREHOUSING";
    heroDesc = "Learn how data is collected, organized, transformed and analyzed for decision-making.";
    pipelineSteps = [
      { step: "01", name: "Operational DBs", icon: "database" },
      { step: "02", name: "Staging ETL", icon: "refresh-cw" },
      { step: "03", name: "Data Warehouse", icon: "server" },
      { step: "04", name: "Data Cube (OLAP)", icon: "box" },
      { step: "05", name: "BI Analytics", icon: "bar-chart-2" }
    ];
  } else if (moduleId === 'mining') {
    moduleBadge = "DATA MINING";
    heroDesc = "Discover hidden patterns, build predictive models, and perform data pre-processing and exploratory analysis.";
    pipelineSteps = [
      { step: "01", name: "Raw Dataset", icon: "file-text" },
      { step: "02", name: "Preprocessing", icon: "filter" },
      { step: "03", name: "Mining Engine", icon: "cpu" },
      { step: "04", name: "Patterns & Rules", icon: "git-branch" },
      { step: "05", name: "Actionable Insight", icon: "sparkles" }
    ];
  } else {
    moduleBadge = `${title.toUpperCase()} MODULE`;
    heroDesc = "Interactive virtual learning laboratory for data science and enterprise data processing.";
    pipelineSteps = [
      { step: "01", name: "Theory", icon: "book-open" },
      { step: "02", name: "Simulation", icon: "play" },
      { step: "03", name: "Practice", icon: "pen-tool" },
      { step: "04", name: "Assessment", icon: "award" }
    ];
  }

  // Find active lesson to study from existing progress
  const activeLessonIdx = lessons.findIndex(l => !completedLessons.includes(l.id));
  const currentIdx = activeLessonIdx !== -1 ? activeLessonIdx : lessons.length - 1;
  const currentLesson = lessons[currentIdx] || lessons[0];
  const continueLessonHash = `#/module/${moduleId}/learn/${currentLesson.id}`;
  const currentLessonNum = currentIdx + 1;

  // Practical count & Numerical solver count
  const practicalCount = moduleId === 'warehouse' ? 4 : (moduleId === 'mining' ? 3 : 2);
  const numericalCount = moduleId === 'warehouse' ? 2 : (moduleId === 'mining' ? 4 : 2);

  // Categories definition for Data Mining tabs
  const categories = moduleId === 'mining' ? [
    { id: 'all', label: 'All Topics' },
    { id: 'preprocessing', label: 'Data Preprocessing' },
    { id: 'classification', label: 'Classification' },
    { id: 'clustering', label: 'Clustering' },
    { id: 'association', label: 'Association Rules' }
  ] : [
    { id: 'all', label: 'All Topics' },
    { id: 'architecture', label: 'Architecture & ETL' },
    { id: 'modeling', label: 'Dimensional Modeling' },
    { id: 'olap', label: 'OLAP Operations' }
  ];

  // Helper to map category tag to lesson
  const getLessonCategory = (lesId) => {
    if (lesId.includes('intro') || lesId.includes('architecture') || lesId.includes('etl') || lesId.includes('mining-architecture') || lesId.includes('preprocessing') || lesId.includes('exploration')) return 'preprocessing';
    if (lesId.includes('classification')) return 'classification';
    if (lesId.includes('kmeans') || lesId.includes('clustering')) return 'clustering';
    if (lesId.includes('apriori')) return 'association';
    if (lesId.includes('star') || lesId.includes('snowflake') || lesId.includes('fact')) return 'modeling';
    if (lesId.includes('olap')) return 'olap';
    return 'all';
  };

  container.innerHTML = `
    <!-- SECTION 1: MODULE HERO & PIPELINE FLOW -->
    <div class="card animate-slide-up" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; border-radius: 16px; padding: 28px; margin-bottom: 28px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; margin-bottom: 24px;">
        <div style="max-width: 680px;">
          <span style="display: inline-block; background: rgba(99, 102, 241, 0.2); color: #818cf8; font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(129, 140, 248, 0.3); margin-bottom: 12px;">${moduleBadge}</span>
          <h1 style="font-size: 2rem; font-weight: 800; color: white; margin: 0 0 10px 0; letter-spacing: -0.5px;">${title}</h1>
          <p style="font-size: 1.05rem; color: #cbd5e1; margin: 0; line-height: 1.6;">${heroDesc}</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="${continueLessonHash}" class="btn btn-primary" style="padding: 10px 22px; border-radius: 8px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
            <i data-lucide="play-circle"></i> Continue Learning →
          </a>
          <a href="#/numerical-solver" class="btn btn-outline" style="border-color: #475569; color: #e2e8f0; padding: 10px 18px; border-radius: 8px; font-weight: 600; text-decoration: none;">
            <i data-lucide="calculator"></i> Numerical Solver
          </a>
        </div>
      </div>

      <!-- VISUAL PROCESS PIPELINE -->
      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; margin-top: 10px;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="git-commit" style="width: 14px; height: 14px; color: #818cf8;"></i> Learning Journey Execution Pipeline
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; align-items: center;">
          ${pipelineSteps.map((s) => `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); padding: 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(99, 102, 241, 0.2); color: #a5b4fc; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;">
                <i data-lucide="${s.icon}"></i>
              </div>
              <div style="overflow: hidden;">
                <div style="font-size: 0.68rem; color: #64748b; font-weight: 700;">STEP ${s.step}</div>
                <div style="font-size: 0.82rem; font-weight: 700; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- SECTION 2: PROGRESS & METRICS GRID -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px;">
      <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
          <i data-lucide="book-open"></i>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #64748b;">Total Lessons</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">${lessons.length}</div>
        </div>
      </div>

      <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 10px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
          <i data-lucide="check-circle-2"></i>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #64748b;">Completed Lessons</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">${completedLessons.length} / ${lessons.length}</div>
        </div>
      </div>

      <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 10px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
          <i data-lucide="compass"></i>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #64748b;">Current Lesson</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">Lesson ${currentLessonNum} of ${lessons.length}</div>
        </div>
      </div>

      <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 10px; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
          <i data-lucide="flask-conical"></i>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #64748b;">Practical Count</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">${practicalCount}</div>
        </div>
      </div>

      <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 10px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
          <i data-lucide="calculator"></i>
        </div>
        <div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #64748b;">Numerical Solvers</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">${numericalCount}</div>
        </div>
      </div>
    </div>

    <!-- SECTION 3: CONTINUE LEARNING CARD -->
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 32px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
      <div style="flex: 1; min-width: 280px;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.78rem; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          <i data-lucide="play-circle" style="width: 16px; height: 16px;"></i> CONTINUE LEARNING
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">${currentLesson.title}</h3>
        <div style="font-size: 0.88rem; font-weight: 600; color: #64748b; margin-bottom: 12px;">Lesson ${currentLessonNum} of ${lessons.length}</div>
        
        <div style="display: flex; align-items: center; gap: 12px; max-width: 320px;">
          <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
            <div style="width: ${modulePercent}%; height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed);"></div>
          </div>
          <span style="font-size: 0.82rem; font-weight: 700; color: #2563eb;">${modulePercent}% Completed</span>
        </div>
      </div>

      <div>
        <a href="${continueLessonHash}" class="btn btn-primary" style="padding: 12px 26px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; background: #2563eb;">
          Continue Learning &rarr;
        </a>
      </div>
    </div>

    <!-- SECTION 4: LEARNING PATH (SEQUENTIAL SYLLABUS LIST WITH VISUAL STATUSES) -->
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="git-branch" style="color: #2563eb;"></i> Learning Path & Lesson Sequence
      </h2>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${lessons.map((les, index) => {
          const isDone = completedLessons.includes(les.id);
          const isCurrent = (index === currentIdx);
          let statusBadge = "";
          let statusBg = "white";
          let statusBorder = "#e2e8f0";

          if (isDone) {
            statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4; color: #16a34a; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid #bbf7d0;">✓ Completed</span>`;
          } else if (isCurrent) {
            statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; background: #eff6ff; color: #2563eb; font-size: 0.78rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid #bfdbfe;">🔵 In Progress (CURRENT)</span>`;
            statusBg = "#f8fafc";
            statusBorder = "#bfdbfe";
          } else if (index <= currentIdx + 1) {
            statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; background: #f8fafc; color: #64748b; font-size: 0.78rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid #e2e8f0;">○ Available</span>`;
          } else {
            statusBadge = `<span style="display: inline-flex; align-items: center; gap: 4px; background: #f1f5f9; color: #94a3b8; font-size: 0.78rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid #e2e8f0;">🔒 Locked</span>`;
          }

          return `
            <div style="background: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: ${isDone ? '#16a34a' : (isCurrent ? '#2563eb' : '#cbd5e1')}; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800;">
                  ${isDone ? '✓' : index + 1}
                </div>
                <div>
                  <h4 style="font-size: 0.98rem; font-weight: 700; color: #0f172a; margin: 0 0 2px 0;">${les.title}</h4>
                  <span style="font-size: 0.78rem; color: #64748b;">Lesson ${index + 1} of ${lessons.length}</span>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; gap: 12px;">
                ${statusBadge}
                <a href="#/module/${moduleId}/learn/${les.id}" class="btn btn-sm" style="background: ${isCurrent ? '#2563eb' : (isDone ? '#f1f5f9' : 'white')}; color: ${isCurrent ? 'white' : '#334155'}; border: 1px solid #cbd5e1; font-weight: 600; font-size: 0.82rem; border-radius: 6px; text-decoration: none; padding: 6px 14px;">
                  ${isCurrent ? 'Study Now →' : 'View Lesson'}
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- SECTION 5: CATEGORIZED TOPICS GRID -->
    <div style="margin-bottom: 36px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 20px;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="layers" style="color: #2563eb;"></i> Categorized Topics & Practice Grid
        </h2>
        
        <!-- Search Filter Input -->
        <div style="position: relative; min-width: 240px;">
          <input type="text" id="module-topic-search" placeholder="Filter topics or algorithms..." style="width: 100%; padding: 8px 12px 8px 36px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none;">
          <i data-lucide="search" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8;"></i>
        </div>
      </div>

      <!-- Filter Category Tabs -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;" id="module-filter-tabs">
        ${categories.map((c, idx) => `
          <button class="filter-pill-btn ${idx === 0 ? 'active' : ''}" data-cat="${c.id}" style="padding: 6px 16px; border-radius: 20px; border: 1px solid #cbd5e1; background: ${idx === 0 ? '#2563eb' : 'white'}; color: ${idx === 0 ? 'white' : '#475569'}; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">
            ${c.label}
          </button>
        `).join('')}
      </div>

      <!-- Topic Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;" id="module-topic-grid">
        ${lessons.map((les, index) => {
          const isLesDone = completedLessons.includes(les.id);
          const cat = getLessonCategory(les.id);
          const lesNum = (index + 1).toString().padStart(2, '0');

          return `
            <div class="card topic-card-item" data-category="${cat}" data-title="${les.title.toLowerCase()}" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 0.75rem; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 3px 8px; border-radius: 4px;">TOPIC ${lesNum}</span>
                  <span style="font-size: 0.75rem; font-weight: 700; color: ${isLesDone ? '#16a34a' : '#94a3b8'}; display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="${isLesDone ? 'check-circle' : 'circle'}"></i> ${isLesDone ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; line-height: 1.4;">${les.title}</h3>
                <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${les.blocks && les.blocks[0] ? les.blocks[0].content : 'Comprehensive theoretical and practical exploration with numerical algorithm calculations.'}
                </p>
              </div>

              <div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px;">
                  <a href="#/module/${moduleId}/learn/${les.id}" class="btn btn-outline btn-sm" style="text-align: center; border-color: #cbd5e1; color: #334155; font-size: 0.82rem; font-weight: 600; text-decoration: none;">
                    📖 Theory
                  </a>
                  <a href="#/module/${moduleId}/practice/${les.id}" class="btn btn-outline btn-sm" style="text-align: center; border-color: #cbd5e1; color: #334155; font-size: 0.82rem; font-weight: 600; text-decoration: none;">
                    ✏️ Quiz Practice
                  </a>
                </div>
                <div style="margin-top: 8px;">
                  <a href="#/numerical-solver" class="btn btn-sm" style="background: #f1f5f9; color: #1e293b; text-align: center; font-size: 0.8rem; font-weight: 600; text-decoration: none; border-radius: 6px; padding: 6px; display: block; width: 100%;">
                    ⚡ Solve Math
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>



    <!-- SECTION 6: NUMERICAL PRACTICE CARDS -->
    <div style="margin-bottom: 36px;">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="calculator" style="color: #16a34a;"></i> Algorithm-Based Numerical Solver Cards
      </h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 0.98rem; font-weight: 700; color: #166534; margin: 0 0 6px 0;">Entropy & Info Gain Solver</h4>
          <p style="font-size: 0.82rem; color: #15803d; line-height: 1.4; margin: 0 0 12px 0;">Compute target entropy H(S), attribute expected entropy H(S, A), and Information Gain I(S, A).</p>
          <a href="#/numerical-solver" class="btn btn-sm" style="background: #16a34a; color: white; font-weight: 700; text-decoration: none; display: inline-block;">Solve Problem &rarr;</a>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 0.98rem; font-weight: 700; color: #166534; margin: 0 0 6px 0;">K-Means Iteration Solver</h4>
          <p style="font-size: 0.82rem; color: #15803d; line-height: 1.4; margin: 0 0 12px 0;">Compute Euclidean distances d = sqrt((x2-x1)^2 + (y2-y1)^2) and update cluster centroid coordinates.</p>
          <a href="#/numerical-solver" class="btn btn-sm" style="background: #16a34a; color: white; font-weight: 700; text-decoration: none; display: inline-block;">Solve Problem &rarr;</a>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 0.98rem; font-weight: 700; color: #166534; margin: 0 0 6px 0;">Apriori Support & Confidence</h4>
          <p style="font-size: 0.82rem; color: #15803d; line-height: 1.4; margin: 0 0 12px 0;">Compute itemset Support count, Rule Confidence % and Lift metrics with minimum threshold pruning.</p>
          <a href="#/numerical-solver" class="btn btn-sm" style="background: #16a34a; color: white; font-weight: 700; text-decoration: none; display: inline-block;">Solve Problem &rarr;</a>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 0.98rem; font-weight: 700; color: #166534; margin: 0 0 6px 0;">Data Normalization (Min-Max / Z-Score)</h4>
          <p style="font-size: 0.82rem; color: #15803d; line-height: 1.4; margin: 0 0 12px 0;">Transform raw attribute values v using Min-Max [new_min, new_max] or Z-Score (v - mean) / std_dev.</p>
          <a href="#/numerical-solver" class="btn btn-sm" style="background: #16a34a; color: white; font-weight: 700; text-decoration: none; display: inline-block;">Solve Problem &rarr;</a>
        </div>
      </div>
    </div>

    <!-- SECTION 7: DEMO / VISUAL LEARNING -->
    <div style="margin-bottom: 36px;">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="monitor" style="color: #6366f1;"></i> Visual Simulators & Interactive Tools
      </h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 1.2rem;">
              <i data-lucide="box"></i>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">OLAP 3D Cube Visualizer</h3>
            <p style="font-size: 0.85rem; color: #64748b; line-height: 1.4; margin-bottom: 16px;">Visualize multidimensional cubes across Time, Location, and Product dimensions.</p>
          </div>
          <a href="#/olap-visualizer" class="btn btn-outline" style="text-align: center; font-weight: 600; text-decoration: none; display: block; border-color: #cbd5e1; color: #334155;">Launch Visualizer &rarr;</a>
        </div>

        <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #fce7f3; color: #be185d; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 1.2rem;">
              <i data-lucide="bar-chart"></i>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Exploratory Data Analysis (EDA)</h3>
            <p style="font-size: 0.85rem; color: #64748b; line-height: 1.4; margin-bottom: 16px;">Inspect boxplots, scatter matrices, correlation maps, and summary statistics.</p>
          </div>
          <a href="#/data-exploration" class="btn btn-outline" style="text-align: center; font-weight: 600; text-decoration: none; display: block; border-color: #cbd5e1; color: #334155;">Launch EDA Demo &rarr;</a>
        </div>

        <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #ccfbf1; color: #0f766e; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 1.2rem;">
              <i data-lucide="terminal"></i>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">SQL Staging Playground</h3>
            <p style="font-size: 0.85rem; color: #64748b; line-height: 1.4; margin-bottom: 16px;">Write and execute SQL queries against relational staging tables.</p>
          </div>
          <a href="#/sql-sandbox" class="btn btn-outline" style="text-align: center; font-weight: 600; text-decoration: none; display: block; border-color: #cbd5e1; color: #334155;">Launch SQL Playground &rarr;</a>
        </div>
      </div>
    </div>

    <!-- SECTION 8: QUIZ / ASSESSMENT -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); border-radius: 16px; padding: 24px; color: white; margin-bottom: 36px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
      <div>
        <span style="background: rgba(255,255,255,0.2); font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">Module Knowledge Assessment</span>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin: 8px 0 4px 0; color: white;">Comprehensive ${title} Quiz</h3>
        <p style="font-size: 0.9rem; opacity: 0.9; margin: 0;">Test your understanding of algorithms, formulas, and concepts to earn your achievement badge.</p>
      </div>
      <div>
        <a href="#/module/${moduleId}/quiz" class="btn" style="background: white; color: #4f46e5; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Start Assessment Quiz &rarr;
        </a>
      </div>
    </div>

    <!-- SECTION 9: MODULE RESOURCES -->
    <div style="margin-bottom: 36px;">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="file-text" style="color: #64748b;"></i> Reference Materials & Formula Sheets
      </h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
        <a href="#/resources" style="text-decoration: none; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; color: #1e293b;">
          <i data-lucide="bookmark" style="color: #2563eb;"></i>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">Cheat Sheet</div>
            <div style="font-size: 0.78rem; color: #64748b;">Algorithms & Formulas</div>
          </div>
        </a>

        <a href="#/notes" style="text-decoration: none; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; color: #1e293b;">
          <i data-lucide="file-spread-sheet" style="color: #16a34a;"></i>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">My Notes</div>
            <div style="font-size: 0.78rem; color: #64748b;">Saved study notes</div>
          </div>
        </a>

        <a href="#/demo-videos" style="text-decoration: none; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; color: #1e293b;">
          <i data-lucide="play-circle" style="color: #dc2626;"></i>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">Video Tutorials</div>
            <div style="font-size: 0.78rem; color: #64748b;">Recorded walkthroughs</div>
          </div>
        </a>
      </div>
    </div>
  `;

  // Attach real-time filter tab handlers and search handlers
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();

    // Category Filter Pills Handler
    const filterTabs = container.querySelectorAll('.filter-pill-btn');
    const topicCards = container.querySelectorAll('.topic-card-item');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'white';
          t.style.color = '#475569';
        });
        tab.classList.add('active');
        tab.style.background = '#2563eb';
        tab.style.color = 'white';

        const cat = tab.getAttribute('data-cat');
        topicCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Topic Search Filter Handler
    const searchInput = container.querySelector('#module-topic-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        topicCards.forEach(card => {
          const titleText = card.getAttribute('data-title') || '';
          if (!query || titleText.includes(query)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  }, 50);
}

function renderLessonReaderView(container, moduleId, lessonId) {
  const lessons = state.theory[moduleId] || [];
  const lessonIndex = lessons.findIndex(l => l.id === lessonId);
  const lesson = lessons[lessonIndex];
  
  if (!lesson) {
    container.innerHTML = `<h3>Lesson not found.</h3>`;
    return;
  }
  
  // Progress calculations
  const completedLessons = state.progress.filter(x => x.module_id === moduleId && x.type === 'lesson').map(x => x.topic_id);
  const isCurrentComplete = completedLessons.includes(lessonId);
  const lessonPct = Math.round(((lessonIndex + 1) / lessons.length) * 100);
  const moduleTitle = moduleId === 'warehouse' ? 'Data Warehousing' : (moduleId === 'mining' ? 'Data Mining' : 'Module');

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

  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  container.innerHTML = `
    <!-- BREADCRUMB NAVIGATION -->
    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; margin-bottom: 16px;">
      <a href="#/dashboard" style="color: #2563eb; font-weight: 600; text-decoration: none;">Home</a>
      <span>&rsaquo;</span>
      <a href="#/module/${moduleId}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${moduleTitle}</a>
      <span>&rsaquo;</span>
      <span style="color: #0f172a; font-weight: 700;">${lesson.title}</span>
    </div>

    <!-- DYNAMIC LESSON HEADER & PROGRESS DISPLAY -->
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
        <span style="background: #eff6ff; color: #2563eb; font-size: 0.8rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; border: 1px solid #bfdbfe;">
          Lesson ${lessonIndex + 1} of ${lessons.length}
        </span>
        ${isCurrentComplete ? `
          <span style="background: #f0fdf4; color: #16a34a; font-size: 0.8rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; border: 1px solid #bbf7d0; display: inline-flex; align-items: center; gap: 4px;">
            <i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i> Completed
          </span>
        ` : `
          <span style="background: #f8fafc; color: #64748b; font-size: 0.8rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid #e2e8f0;">
            In Progress
          </span>
        `}
      </div>

      <h1 style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">${lesson.title}</h1>

      <!-- Progress Bar Display -->
      <div style="display: flex; align-items: center; gap: 14px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 18px; border-radius: 10px;">
        <span style="font-size: 0.85rem; font-weight: 700; color: #334155;">Lesson Progress:</span>
        <div style="flex: 1; height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden;">
          <div style="width: ${lessonPct}%; height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed); transition: width 0.4s ease;"></div>
        </div>
        <span style="font-size: 0.9rem; font-weight: 800; color: #2563eb;">${lessonPct}%</span>
      </div>
    </div>

    <div class="lesson-layout animate-slide-up">
      <!-- Lesson Navigation Sidebar Outline -->
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
        
        <!-- Panel 1: Written Theory Content with Educational Cards -->
        <div id="panel-theory" class="lesson-body">
          ${lesson.blocks.map(b => {
            if (b.type === 'table') {
              return `
                <div class="block-table" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <div class="block-table-title" style="font-weight: 700; font-size: 1rem; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    📋 TABLE: ${b.title}
                  </div>
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
            
            // Format educational concept headers & card styling
            let blockClass = "";
            let blockBadge = "📖 CONCEPT";
            let badgeBg = "#eff6ff";
            let badgeColor = "#2563eb";
            
            const lowerContent = (b.content || '').toLowerCase();
            const lowerTitle = (b.title || '').toLowerCase();
            const isFormula = b.type === 'formula' || lowerTitle.includes('formula') || lowerContent.includes('formula') || lowerContent.includes('h(s)') || lowerContent.includes('sqrt') || lowerContent.includes('p(c|x)');

            if (isFormula) {
              blockClass = "block-formula";
              blockBadge = "📐 FORMULA";
              badgeBg = "#f0fdf4";
              badgeColor = "#16a34a";
            } else if (b.type === 'key-concept') {
              blockClass = "block-key-concept";
              blockBadge = "💡 KEY CONCEPT";
              badgeBg = "#fef3c7";
              badgeColor = "#d97706";
            } else if (b.type === 'definition') {
              blockClass = "block-definition";
              blockBadge = "📖 CONCEPT";
              badgeBg = "#eff6ff";
              badgeColor = "#2563eb";
            } else if (b.type === 'example') {
              blockClass = "block-example";
              blockBadge = "📊 EXAMPLE";
              badgeBg = "#fce7f3";
              badgeColor = "#be185d";
            } else if (b.type === 'remember') {
              blockClass = "block-remember";
              blockBadge = "🧠 REMEMBER";
              badgeBg = "#faf5ff";
              badgeColor = "#9333ea";
            }
            
            return `
              <div class="learning-block ${blockClass}" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                  <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: 4px; letter-spacing: 0.5px;">${blockBadge}</span>
                  <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0;">${b.title || ''}</h3>
                </div>
                <p class="learning-block-content" style="color: #334155; font-size: 0.95rem; line-height: 1.6; margin: 0; white-space: pre-line;">${b.content}</p>
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- Panel 2: Simulated Video Lecture -->
        <div id="panel-video" class="lesson-body hidden">
          <div id="video-player-mount"></div>
        </div>
        
        <!-- Panel 3: Interactive Sandbox -->
        ${thirdPanelHtml}
        
        <!-- LESSON COMPLETION & BOTTOM NAVIGATION BUTTONS -->
        <div class="lesson-nav" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          ${prevLesson ? `
            <a href="#/module/${moduleId}/learn/${prevLesson.id}" class="btn btn-outline" style="border-color: #cbd5e1; color: #334155; font-weight: 600; text-decoration: none;">
              &larr; Previous Lesson
            </a>
          ` : `<span></span>`}

          <button class="btn btn-primary" id="btn-mark-complete-lesson" style="background: ${isCurrentComplete ? '#16a34a' : '#2563eb'}; color: white; font-weight: 700; padding: 12px 24px; border-radius: 8px;">
            ${isCurrentComplete ? '✓ Completed (Read Again & Practice &rarr;)' : '✓ Mark as Complete & Practice &rarr;'}
          </button>

          ${nextLesson ? `
            <a href="#/module/${moduleId}/learn/${nextLesson.id}" class="btn btn-primary" style="background: #4f46e5; color: white; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 8px;">
              Next Lesson &rarr;
            </a>
          ` : `
            <a href="#/module/${moduleId}" class="btn btn-outline" style="border-color: #cbd5e1; color: #334155; font-weight: 600; text-decoration: none;">
              Finish Module &rarr;
            </a>
          `}
        </div>

        <!-- LEARNING FLOW: CONNECTED ACTION PIPELINE CARDS -->
        <div style="margin-top: 40px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px;">
          <div style="font-size: 0.8rem; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">
            LEARNING FLOW PIPELINE
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 0 0 18px 0;">What to do after completing this lesson?</h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            <!-- 1. PRACTICE QUIZ -->
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-weight: 800;">
                  ✏️
                </div>
                <div style="font-size: 0.75rem; font-weight: 800; color: #2563eb; text-transform: uppercase; margin-bottom: 2px;">READY TO PRACTICE?</div>
                <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">TEST YOUR UNDERSTANDING</h4>
                <p style="font-size: 0.82rem; color: #64748b; line-height: 1.4; margin-bottom: 16px;">Check what you learned from this lesson with interactive practice questions.</p>
              </div>
              <a href="#/module/${moduleId}/practice/${lessonId}" class="btn btn-primary btn-sm" style="background: #2563eb; color: white; text-align: center; font-weight: 700; text-decoration: none; display: block; border-radius: 6px; padding: 8px;">
                Start Practice &rarr;
              </a>
            </div>

            <!-- 3. NUMERICAL SOLVER -->
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-weight: 800;">
                  📐
                </div>
                <div style="font-size: 0.75rem; font-weight: 800; color: #16a34a; text-transform: uppercase; margin-bottom: 2px;">EXAM NUMERICALS</div>
                <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">TRY A NUMERICAL</h4>
                <p style="font-size: 0.82rem; color: #64748b; line-height: 1.4; margin-bottom: 16px;">Solve step-by-step mathematical examination questions with formulas & tables.</p>
              </div>
              <a href="#/numerical-solver" class="btn btn-sm" style="background: #16a34a; color: white; text-align: center; font-weight: 700; text-decoration: none; display: block; border-radius: 6px; padding: 8px;">
                Open Numerical Solver &rarr;
              </a>
            </div>
          </div>
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
      if (res && res.progress) {
        state.progress = res.progress;
        updateGlobalHeaderStats();
      }
      
      if (res && res.newlyUnlocked && res.newlyUnlocked.length > 0) {
        res.newlyUnlocked.forEach(badgeId => {
          state.achievements.push({ achievement_id: badgeId });
          showUnlockToast(badgeId);
        });
      }
    } catch (err) {
      console.warn('Progress sync note:', err);
    } finally {
      // Guaranteed navigation back to module landing
      window.location.hash = `#/module/${moduleId}`;
    }
  }, moduleId);
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
