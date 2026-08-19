// DataMineX - Real-World Challenges Data & UI Logic

export const challengesData = [
  {
    id: "student-performance",
    title: "Scenario 1: College Student Performance Optimizer",
    description: "A large college has historical student academic records. They want to: 1. Store historical student data securely. 2. Analyze grade performance by semester. 3. Group students into performance clusters to identify struggling cohorts. 4. Visualize department-wide metrics on a central admin monitor.",
    concepts: [
      { id: "warehouse", label: "Data Warehouse", correct: true, reason: "Required to centralize and store historical student records securely over multiple semesters." },
      { id: "mining", label: "Data Mining", correct: true, reason: "Required to group students into performance clusters (unsupervised clustering like K-Means) to identify cohorts." },
      { id: "analytics", label: "Data Analytics", correct: true, reason: "Required to analyze semester performance and visualize department-wide metrics on a dashboard." }
    ],
    explanation: "This scenario leverages all three pillars! The Data Warehouse acts as the centralized repository, Data Mining groups students into clusters based on attributes, and Data Analytics creates the dashboards for visualization and reporting."
  },
  {
    id: "retail-recommendations",
    title: "Scenario 2: E-Commerce Smart Recommendation Engine",
    description: "An online store wants to analyze checkout baskets. They want to: 1. Track which items are frequently purchased together. 2. Push automatic suggestions to checkout carts (e.g., 'People who bought this also bought...'). 3. Keep a summary dashboard of cross-sales revenue.",
    concepts: [
      { id: "warehouse", label: "Data Warehouse", correct: false, reason: "While data is stored, this specific engine relies directly on algorithms and visual reports." },
      { id: "mining", label: "Data Mining", correct: true, reason: "Required for Association Rule Mining (Apriori Algorithm) to discover which items are frequently bought together." },
      { id: "analytics", label: "Data Analytics", correct: true, reason: "Required to build the summary dashboard of cross-sales revenue." }
    ],
    explanation: "Smart recommendation suggestions are generated via Data Mining (Apriori), while cross-selling reporting is built using Data Analytics dashboards."
  },
  {
    id: "hospital-efficiency",
    title: "Scenario 3: Hospital Patient Trend Analyzer",
    description: "A medical center wants to: 1. Structure raw diagnostic logs into multi-dimensional databases. 2. Allow administrators to view patient admissions by disease, age range, and month. 3. Verify why patient readmission spikes happen.",
    concepts: [
      { id: "warehouse", label: "Data Warehouse", correct: true, reason: "Required to build a multi-dimensional schema (like star schema or OLAP Cube) to structure raw diagnostic logs." },
      { id: "mining", label: "Data Mining", correct: false, reason: "Admissions drill-downs and diagnostic audits do not require complex statistical discovery algorithms here." },
      { id: "analytics", label: "Data Analytics", correct: true, reason: "Required to view reports by disease, age, and month, and execute diagnostic analysis on readmission spikes." }
    ],
    explanation: "Multi-dimensional structuring utilizes Data Warehousing schemas (OLAP Data Cube), and analyzing admissions across dimensions is a core application of Data Analytics."
  },
  {
    id: "telecom-churn",
    title: "Scenario 4: Telecom Churn Prevention",
    description: "A telecom provider wants to: 1. Predict which customers are planning to cancel their plans. 2. Query historical payment history and service calls. 3. Output weekly reports comparing churn rates of different regions.",
    concepts: [
      { id: "warehouse", label: "Data Warehouse", correct: true, reason: "Required to aggregate customer payment history and service call data for unified access." },
      { id: "mining", label: "Data Mining", correct: true, reason: "Required to train classification models to predict customers likely to cancel (churn prediction)." },
      { id: "analytics", label: "Data Analytics", correct: true, reason: "Required to visualize weekly regional churn reports for company managers." }
    ],
    explanation: "Predicting churn is a classification task (Data Mining), querying multi-source history requires a Data Warehouse, and reporting is handled by Data Analytics."
  },
  {
    id: "traffic-planning",
    title: "Scenario 5: Smart City Traffic Congestion Control",
    description: "A city council wants to: 1. Read real-world GPS sensor streams. 2. Identify traffic flow patterns (like bottleneck zones). 3. Display live traffic delays on public map screens.",
    concepts: [
      { id: "warehouse", label: "Data Warehouse", correct: false, reason: "GPS streams are handled by real-time messaging buses rather than a traditional data warehouse." },
      { id: "mining", label: "Data Mining", correct: true, reason: "Required to mine bottleneck and congestion patterns from GPS coordinate clusters." },
      { id: "analytics", label: "Data Analytics", correct: true, reason: "Required to display live maps and delay visualizations to the public." }
    ],
    explanation: "Finding pattern congestion zones is a spatial clustering task (Data Mining), and rendering live delay data on public screens is handled by Data Analytics."
  }
];

export function renderChallenges(containerSelector, completedIds, onSubmit) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  let html = `
    <div class="welcome-section">
      <h1 class="welcome-title">Apply Your Knowledge</h1>
      <p class="welcome-subtitle">Solve these real-world scenarios by selecting the correct concepts that should be applied.</p>
    </div>
    <div class="challenge-grid">
  `;
  
  challengesData.forEach((scenario, index) => {
    const isCompleted = completedIds.includes(scenario.id);
    
    html += `
      <div class="challenge-card" id="challenge-${scenario.id}">
        <div class="path-header">
          <h3 class="syllabus-title">${scenario.title}</h3>
          ${isCompleted ? '<span class="challenge-badge">✓ Solved</span>' : '<span class="challenge-badge" style="background: rgba(245,158,11,0.1); color: var(--color-amber);">Pending</span>'}
        </div>
        <p class="path-desc" style="margin-top: 12px; line-height: 1.6;">${scenario.description}</p>
        
        <div class="challenge-choices" id="choices-${scenario.id}">
          ${scenario.concepts.map(c => `
            <label class="choice-checkbox-label" data-concept="${c.id}">
              <input type="checkbox" ${isCompleted ? 'disabled' : ''}>
              <span>${c.label}</span>
            </label>
          `).join('')}
        </div>
        
        <div class="challenge-actions">
          ${isCompleted ? `
            <div class="feedback-section" style="display: block;">
              <div class="feedback-status correct">✓ Correct Reasoning</div>
              <p class="feedback-explanation">${scenario.explanation}</p>
              <div style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">
                ${scenario.concepts.map(c => `<strong>${c.label}:</strong> ${c.reason}`).join('<br>')}
              </div>
            </div>
          ` : `
            <button class="btn btn-primary submit-challenge-btn" data-id="${scenario.id}">Submit Answer</button>
            <div class="feedback-section hidden" id="feedback-${scenario.id}"></div>
          `}
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
  
  // Bind events for non-completed challenges
  challengesData.forEach(scenario => {
    if (completedIds.includes(scenario.id)) return;
    
    const card = container.querySelector(`#challenge-${scenario.id}`);
    const labels = card.querySelectorAll(`.choice-checkbox-label`);
    
    labels.forEach(label => {
      label.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') {
          label.classList.toggle('selected', e.target.checked);
        }
      });
    });
    
    const submitBtn = card.querySelector(`.submit-challenge-btn`);
    submitBtn.addEventListener('click', () => {
      // Collect selected concepts
      const selected = [];
      labels.forEach(l => {
        const input = l.querySelector('input');
        if (input.checked) {
          selected.push(l.getAttribute('data-concept'));
        }
      });
      
      // Determine correctness
      const correctConcepts = scenario.concepts.filter(c => c.correct).map(c => c.id);
      const isCorrect = selected.length === correctConcepts.length && selected.every(c => correctConcepts.includes(c));
      
      const feedbackDiv = card.querySelector(`#feedback-${scenario.id}`);
      feedbackDiv.classList.remove('hidden');
      
      if (isCorrect) {
        feedbackDiv.innerHTML = `
          <div class="feedback-status correct">✓ Correct! Excellent selection.</div>
          <p class="feedback-explanation">${scenario.explanation}</p>
          <div style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">
            ${scenario.concepts.map(c => `<strong>${c.label}:</strong> ${c.reason}`).join('<br>')}
          </div>
        `;
        submitBtn.remove();
        // Disabling inputs
        labels.forEach(l => l.querySelector('input').disabled = true);
        
        // Notify parent application to record completion
        onSubmit(scenario.id);
      } else {
        feedbackDiv.innerHTML = `
          <div class="feedback-status incorrect">✗ Incorrect selection.</div>
          <p class="feedback-explanation">Remember: Read the objectives carefully. Double-check if the process requires predictive mining, multi-dimensional structures, or simple analytical reports.</p>
        `;
      }
    });
  });
}
