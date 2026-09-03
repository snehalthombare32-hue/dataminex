// DataMineX - Interactive Data Mining Demos (Exploration, Preprocessing, Classification, Clustering)

// 1. CLASSIFICATION DEMO (Decision Tree & Naive Bayes)
export class ClassificationDemo {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.modelType = 'tree'; // 'tree' | 'bayes'
    this.outlook = 'Sunny';
    this.humidity = 'Normal';
    this.wind = 'Strong';
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  render() {
    // Prediction
    let treePrediction = "Yes";
    if (this.outlook === "Overcast") {
      treePrediction = "Yes (100% confidence)";
    } else if (this.outlook === "Sunny") {
      treePrediction = this.humidity === "High" ? "No (Confidence: 100%)" : "Yes (Confidence: 100%)";
    } else if (this.outlook === "Rain") {
      treePrediction = this.wind === "Strong" ? "No (Confidence: 100%)" : "Yes (Confidence: 100%)";
    }

    const pYes = 0.6;
    const pNo = 0.4;
    const scoreYes = (pYes * (this.outlook === 'Sunny' ? 0.166 : 0.4) * (this.humidity === 'Normal' ? 0.666 : 0.333) * (this.wind === 'Strong' ? 0.166 : 0.6)).toFixed(4);
    const scoreNo = (pNo * (this.outlook === 'Sunny' ? 0.75 : 0.25) * (this.humidity === 'Normal' ? 0.25 : 0.75) * (this.wind === 'Strong' ? 0.5 : 0.5)).toFixed(4);
    const bayesPrediction = parseFloat(scoreYes) > parseFloat(scoreNo) ? "Yes" : "No";

    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #a855f7; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="git-branch"></i>
              <span>Supervised Classification Engine</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Compare Decision Tree Logic vs Naive Bayes Posterior Probability Calculations
            </p>
          </div>

          <div style="display: flex; gap: 8px; background: var(--bg-tertiary); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color);">
            <button id="btn-clf-tree" class="btn-tab ${this.modelType === 'tree' ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              🌲 Decision Tree
            </button>
            <button id="btn-clf-bayes" class="btn-tab ${this.modelType === 'bayes' ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              🧮 Naive Bayes
            </button>
          </div>
        </div>

        <!-- Input Parameters Form -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: center; margin-bottom: 24px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 6px;">Outlook</label>
            <select id="clf-outlook" style="width: 100%; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
              <option value="Sunny" ${this.outlook === 'Sunny' ? 'selected' : ''}>Sunny</option>
              <option value="Overcast" ${this.outlook === 'Overcast' ? 'selected' : ''}>Overcast</option>
              <option value="Rain" ${this.outlook === 'Rain' ? 'selected' : ''}>Rain</option>
            </select>
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 6px;">Humidity</label>
            <select id="clf-humidity" style="width: 100%; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
              <option value="High" ${this.humidity === 'High' ? 'selected' : ''}>High</option>
              <option value="Normal" ${this.humidity === 'Normal' ? 'selected' : ''}>Normal</option>
            </select>
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 6px;">Wind Speed</label>
            <select id="clf-wind" style="width: 100%; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
              <option value="Weak" ${this.wind === 'Weak' ? 'selected' : ''}>Weak</option>
              <option value="Strong" ${this.wind === 'Strong' ? 'selected' : ''}>Strong</option>
            </select>
          </div>

          <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #c084fc; display: block;">Predicted Outcome</span>
            <span style="font-size: 18px; font-weight: 800; color: #34d399; font-family: monospace; display: block; margin-top: 4px;">
              Play: ${this.modelType === 'tree' ? treePrediction : bayesPrediction}
            </span>
          </div>
        </div>

        <!-- Visual Stage -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
          ${this.modelType === 'tree' ? `
            <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 12px;">
              Generated Decision Tree Diagram (Root ➔ Splits ➔ Leaves)
            </div>
            <div style="width: 100%; overflow-x: auto;">
              <svg viewBox="0 0 680 250" style="width: 100%; min-width: 580px; height: auto;">
                <!-- Root: Outlook -->
                <g transform="translate(280, 20)">
                  <rect width="120" height="38" rx="8" fill="#4c1d95" stroke="#8b5cf6" stroke-width="2" />
                  <text x="60" y="24" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="12">Root: Outlook?</text>
                </g>

                <!-- Branch 1: Sunny -->
                <line x1="300" y1="58" x2="130" y2="110" stroke="#8b5cf6" stroke-width="2" />
                <text x="190" y="80" fill="#a78bfa" font-size="11">Sunny</text>
                <g transform="translate(70, 110)">
                  <rect width="120" height="36" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
                  <text x="60" y="22" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">Humidity?</text>
                </g>
                <line x1="100" y1="146" x2="60" y2="185" stroke="#6366f1" stroke-width="1.5" />
                <text x="55" y="168" fill="#cbd5e1" font-size="9">High</text>
                <rect x="30" y="185" width="60" height="28" rx="4" fill="#881337" stroke="#f43f5e" stroke-width="1.5" />
                <text x="60" y="203" text-anchor="middle" fill="#ffe4e6" font-weight="bold" font-size="10">No</text>

                <line x1="160" y1="146" x2="200" y2="185" stroke="#6366f1" stroke-width="1.5" />
                <text x="195" y="168" fill="#cbd5e1" font-size="9">Normal</text>
                <rect x="170" y="185" width="60" height="28" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
                <text x="200" y="203" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="10">Yes</text>

                <!-- Branch 2: Overcast -->
                <line x1="340" y1="58" x2="340" y2="110" stroke="#8b5cf6" stroke-width="2" />
                <text x="350" y="80" fill="#a78bfa" font-size="11">Overcast</text>
                <g transform="translate(310, 110)">
                  <rect width="60" height="36" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2" />
                  <text x="30" y="23" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="12">Yes</text>
                </g>

                <!-- Branch 3: Rain -->
                <line x1="380" y1="58" x2="550" y2="110" stroke="#8b5cf6" stroke-width="2" />
                <text x="480" y="80" fill="#a78bfa" font-size="11">Rain</text>
                <g transform="translate(490, 110)">
                  <rect width="120" height="36" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
                  <text x="60" y="22" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">Wind?</text>
                </g>
                <line x1="520" y1="146" x2="480" y2="185" stroke="#6366f1" stroke-width="1.5" />
                <text x="475" y="168" fill="#cbd5e1" font-size="9">Strong</text>
                <rect x="450" y="185" width="60" height="28" rx="4" fill="#881337" stroke="#f43f5e" stroke-width="1.5" />
                <text x="480" y="203" text-anchor="middle" fill="#ffe4e6" font-weight="bold" font-size="10">No</text>

                <line x1="580" y1="146" x2="620" y2="185" stroke="#6366f1" stroke-width="1.5" />
                <text x="615" y="168" fill="#cbd5e1" font-size="9">Weak</text>
                <rect x="590" y="185" width="60" height="28" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
                <text x="620" y="203" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="10">Yes</text>
              </svg>
            </div>
          ` : `
            <div style="font-family: monospace; font-size: 12px; line-height: 1.8; color: var(--text-secondary);">
              <div style="font-size: 13px; font-weight: 700; color: #c084fc; margin-bottom: 8px;">Bayesian Likelihood Scores:</div>
              <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 12px;">
                <p><strong style="color: #34d399;">P(Yes | X):</strong> P(Yes) &times; P(${this.outlook}|Yes) &times; P(${this.humidity}|Yes) &times; P(${this.wind}|Yes) = <span style="color: #34d399; font-weight: bold;">${scoreYes}</span></p>
                <p><strong style="color: #f43f5e;">P(No | X):</strong> P(No) &times; P(${this.outlook}|No) &times; P(${this.humidity}|No) &times; P(${this.wind}|No) = <span style="color: #f43f5e; font-weight: bold;">${scoreNo}</span></p>
              </div>
              <div style="padding: 10px; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 6px; color: var(--text-primary);">
                <strong>Classification Rule:</strong> Select class with maximum a posteriori (MAP) score &rarr; 
                <span style="color: #34d399; font-weight: bold;">PLAY TENNIS = ${bayesPrediction.toUpperCase()}</span>
              </div>
            </div>
          `}
        </div>
      </div>
    `;

    // Bind events
    this.mount.querySelector('#btn-clf-tree').addEventListener('click', () => { this.modelType = 'tree'; this.render(); });
    this.mount.querySelector('#btn-clf-bayes').addEventListener('click', () => { this.modelType = 'bayes'; this.render(); });
    this.mount.querySelector('#clf-outlook').addEventListener('change', (e) => { this.outlook = e.target.value; this.render(); });
    this.mount.querySelector('#clf-humidity').addEventListener('change', (e) => { this.humidity = e.target.value; this.render(); });
    this.mount.querySelector('#clf-wind').addEventListener('change', (e) => { this.wind = e.target.value; this.render(); });

    if (window.lucide) window.lucide.createIcons();
  }
}

// 2. DATA EXPLORATION DEMO (Scatter, Bar, Boxplot)
export class DataExplorationDemo {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.plotType = 'scatter'; // 'scatter' | 'bar' | 'boxplot'
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  render() {
    const points = [
      { id: "S1", hours: 2.5, score: 62 },
      { id: "S2", hours: 5.1, score: 85 },
      { id: "S3", hours: 3.2, score: 70 },
      { id: "S4", hours: 8.5, score: 98 },
      { id: "S5", hours: 1.5, score: 45 },
      { id: "S6", hours: 6.0, score: 88 },
      { id: "S7", hours: 4.0, score: 76 }
    ];

    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #d946ef; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="bar-chart-2"></i>
              <span>Exploratory Data Analysis (EDA)</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Visualize distributions, outliers, and correlations using Scatter, Bar, and Box Plots
            </p>
          </div>

          <div style="display: flex; gap: 8px; background: var(--bg-tertiary); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color);">
            <button id="btn-eda-scatter" class="btn-tab ${this.plotType === 'scatter' ? 'active' : ''}" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              Scatter Plot
            </button>
            <button id="btn-eda-bar" class="btn-tab ${this.plotType === 'bar' ? 'active' : ''}" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              Bar Chart
            </button>
            <button id="btn-eda-box" class="btn-tab ${this.plotType === 'boxplot' ? 'active' : ''}" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              Box Plot
            </button>
          </div>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px;">
          ${this.plotType === 'scatter' ? `
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
              <strong>Bivariate Correlation:</strong> Study Hours (X) vs Exam Score (Y)
            </div>
            <div style="width: 100%; overflow-x: auto;">
              <svg viewBox="0 0 600 280" style="width: 100%; min-width: 500px; height: auto;">
                <line x1="50" y1="20" x2="50" y2="240" stroke="#334155" stroke-width="1.5" />
                <line x1="50" y1="240" x2="560" y2="240" stroke="#334155" stroke-width="1.5" />
                ${[0, 25, 50, 75, 100].map(t => `
                  <text x="40" y="${240 - t * 2.1}" fill="#94a3b8" font-size="10" text-anchor="end">${t}</text>
                  <line x1="45" y1="${240 - t * 2.1}" x2="560" y2="${240 - t * 2.1}" stroke="#1e293b" stroke-dasharray="3" />
                `).join('')}
                ${points.map(p => `
                  <circle cx="${50 + p.hours * 50}" cy="${240 - p.score * 2.1}" r="6" fill="#d946ef" stroke="#ffffff" stroke-width="1.5" />
                  <text x="${50 + p.hours * 50 + 8}" y="${240 - p.score * 2.1 - 4}" fill="#f5d0fe" font-size="9" font-family="monospace">${p.id} (${p.score}%)</text>
                `).join('')}
              </svg>
            </div>
          ` : this.plotType === 'bar' ? `
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 16px;">
              <strong>Category Frequencies:</strong> Student Distribution by Grade
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; height: 220px; align-items: end; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end;">
                <span style="font-size: 11px; font-weight: bold; color: #10b981;">3 Students</span>
                <div style="width: 100%; height: 75%; background: #10b981; border-radius: 6px 6px 0 0;"></div>
                <span style="font-size: 12px; font-weight: 700;">Grade A</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end;">
                <span style="font-size: 11px; font-weight: bold; color: #38bdf8;">2 Students</span>
                <div style="width: 100%; height: 50%; background: #38bdf8; border-radius: 6px 6px 0 0;"></div>
                <span style="font-size: 12px; font-weight: 700;">Grade B</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end;">
                <span style="font-size: 11px; font-weight: bold; color: #f59e0b;">1 Student</span>
                <div style="width: 100%; height: 25%; background: #f59e0b; border-radius: 6px 6px 0 0;"></div>
                <span style="font-size: 12px; font-weight: 700;">Grade C</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end;">
                <span style="font-size: 11px; font-weight: bold; color: #f43f5e;">1 Student</span>
                <div style="width: 100%; height: 25%; background: #f43f5e; border-radius: 6px 6px 0 0;"></div>
                <span style="font-size: 12px; font-weight: 700;">Grade F</span>
              </div>
            </div>
          ` : `
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
              <strong>Five-Number Summary (Exam Scores):</strong> Min, Q1, Median, Q3, Max
            </div>
            <div style="width: 100%; overflow-x: auto;">
              <svg viewBox="0 0 600 160" style="width: 100%; min-width: 500px; height: auto;">
                <line x1="140" y1="80" x2="480" y2="80" stroke="#94a3b8" stroke-width="2" />
                <line x1="140" y1="60" x2="140" y2="100" stroke="#f43f5e" stroke-width="3" />
                <text x="140" y="120" text-anchor="middle" fill="#f43f5e" font-size="10">Min: 45</text>
                <rect x="220" y="45" width="180" height="70" rx="4" fill="#3b0764" stroke="#c026d3" stroke-width="2" />
                <text x="220" y="35" text-anchor="middle" fill="#e879f9" font-size="10">Q1: 62</text>
                <text x="400" y="35" text-anchor="middle" fill="#e879f9" font-size="10">Q3: 88</text>
                <line x1="310" y1="45" x2="310" y2="115" stroke="#facc15" stroke-width="3" />
                <text x="310" y="135" text-anchor="middle" fill="#facc15" font-size="10" font-weight="bold">Median: 76</text>
                <line x1="480" y1="60" x2="480" y2="100" stroke="#10b981" stroke-width="3" />
                <text x="480" y="120" text-anchor="middle" fill="#10b981" font-size="10">Max: 98</text>
              </svg>
            </div>
          `}
        </div>
      </div>
    `;

    this.mount.querySelector('#btn-eda-scatter').addEventListener('click', () => { this.plotType = 'scatter'; this.render(); });
    this.mount.querySelector('#btn-eda-bar').addEventListener('click', () => { this.plotType = 'bar'; this.render(); });
    this.mount.querySelector('#btn-eda-box').addEventListener('click', () => { this.plotType = 'boxplot'; this.render(); });

    if (window.lucide) window.lucide.createIcons();
  }
}
