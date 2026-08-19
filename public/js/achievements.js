// DataMineX - Achievements Badges Config & Notification UI

export const achievementsList = [
  {
    id: "first-lesson",
    name: "🏆 First Lesson",
    desc: "Complete your first lesson on DataMineX.",
    icon: "🎓"
  },
  {
    id: "etl-explorer",
    name: "🏆 ETL Explorer",
    desc: "Complete the ETL lesson and practice session.",
    icon: "⚡"
  },
  {
    id: "warehouse-builder",
    name: "🏆 Warehouse Builder",
    desc: "Complete the Star Schema lesson and practical.",
    icon: "🏢"
  },
  {
    id: "olap-explorer",
    name: "🏆 OLAP Explorer",
    desc: "Perform all operations in the OLAP Live Demo.",
    icon: "🧊"
  },
  {
    id: "mining-beginner",
    name: "🏆 Mining Beginner",
    desc: "Complete your first data mining algorithm lesson.",
    icon: "⛏"
  },
  {
    id: "kmeans-explorer",
    name: "🏆 K-Means Explorer",
    desc: "Successfully execute K-Means clustering algorithm.",
    icon: "🎯"
  },
  {
    id: "analytics-explorer",
    name: "🏆 Analytics Explorer",
    desc: "Design your first business dashboard in Analytics Live Demo.",
    icon: "📈"
  },
  {
    id: "data-detective",
    name: "🏆 Data Detective",
    desc: "Solve all 5 real-world analytical scenarios.",
    icon: "🔍"
  }
];

export function renderAchievements(containerSelector, unlockedIds) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  let html = `
    <div class="welcome-section">
      <h1 class="welcome-title">My Achievements</h1>
      <p class="welcome-subtitle">Track your badges and accomplishments as you master concepts and demos.</p>
    </div>
    <div class="achievements-grid">
  `;
  
  achievementsList.forEach(badge => {
    const isUnlocked = unlockedIds.includes(badge.id);
    
    html += `
      <div class="achievement-item ${isUnlocked ? '' : 'locked'}">
        <div class="achievement-badge-icon">${badge.icon}</div>
        <div class="achievement-info">
          <h3 class="achievement-name">${badge.name}</h3>
          <p class="achievement-desc">${badge.desc}</p>
          <span style="font-size: 10px; font-weight: 700; color: ${isUnlocked ? 'var(--color-amber)' : 'var(--text-muted)'};">
            ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
}

export function showUnlockToast(achievementId) {
  const badge = achievementsList.find(a => a.id === achievementId);
  if (!badge) return;
  
  const container = document.getElementById('achievement-toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast-achievement';
  toast.innerHTML = `
    <div class="achievement-badge-icon" style="background: rgba(245, 158, 11, 0.15); border-color: var(--color-amber); font-size: 24px; width: 44px; height: 44px;">
      ${badge.icon}
    </div>
    <div>
      <div style="font-size: 11px; font-weight: 800; color: var(--color-amber); text-transform: uppercase;">Badge Unlocked!</div>
      <div style="font-size: 14px; font-weight: 700; color: white;">${badge.name}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Play subtle sound if desired, or simple visual flash
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(200);
  }
  
  // Remove toast after animation completes
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
