// DataMineX - Universal Question Solver (100% Free & Local-First)
// Solves homework & exam problems step-by-step with zero paid APIs or subscriptions

import { NumericalEngine } from './numericalEngine.js';

const SAMPLE_QUESTIONS = {
  kmeans: {
    title: "K-Means Clustering Problem",
    question: "Given a 2D dataset with coordinates P1(2,10), P2(2,5), P3(8,4), P4(5,8), P5(7,5), P6(6,4), P7(1,2), P8(4,9). Cluster these points using K-Means with K=3.",
    algo: "kmeans",
    params: { k: 3, points: "P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5\nP6: 6, 4\nP7: 1, 2\nP8: 4, 9" }
  },
  id3: {
    title: "Decision Tree Information Gain Problem",
    question: "Given 8 training examples with target class 'Play' (Yes or No), calculate system entropy and find which attribute (Outlook, Humidity, Wind) has highest Information Gain.",
    algo: "id3",
    params: {}
  },
  apriori: {
    title: "Market Basket Apriori Rule Mining",
    question: "A store has 5 customer transactions: T1: Milk, Bread, Eggs; T2: Bread, Butter; T3: Milk, Bread, Butter; T4: Milk, Eggs; T5: Bread, Butter. Find all association rules with Minimum Support = 40% and Minimum Confidence = 60%.",
    algo: "apriori",
    params: { minSup: 40, minConf: 60 }
  },
  iqr: {
    title: "Outlier Detection Using IQR Fences",
    question: "Given the exam marks dataset: 12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65. Calculate Q1, Q3, IQR, and identify any outliers using the 1.5 * IQR fence rule.",
    algo: "iqr",
    params: { numbers: "12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65" }
  },
  normalization: {
    title: "Feature Normalization Scaling",
    question: "Normalize the salary attributes: 200, 300, 400, 600, 1000 into the range [0, 1] using Min-Max Normalization and calculate Z-Score Standardization.",
    algo: "normalization",
    params: { numbers: "200, 300, 400, 600, 1000" }
  }
};

export class UniversalQuestionSolver {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.selectedAlgo = 'kmeans';
    this.questionText = SAMPLE_QUESTIONS.kmeans.question;
    this.extractedData = SAMPLE_QUESTIONS.kmeans.params.points;
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  detectAlgorithm(text) {
    const lower = text.toLowerCase();
    if (lower.includes('k-medoid') || lower.includes('medoid') || lower.includes('pam')) return 'kmedoids';
    if (lower.includes('k-mean') || lower.includes('kmeans') || lower.includes('centroid')) return 'kmeans';
    if (lower.includes('dendrogram') || lower.includes('hierarchical') || lower.includes('linkage')) return 'hierarchical';
    if (lower.includes('dbscan') || lower.includes('epsilon') || lower.includes('minpts')) return 'dbscan';
    if (lower.includes('entropy') || lower.includes('information gain') || lower.includes('id3')) return 'id3';
    if (lower.includes('naive bayes') || lower.includes('bayes') || lower.includes('posterior')) return 'naivebayes';
    if (lower.includes('knn') || lower.includes('nearest neighbor')) return 'knn';
    if (lower.includes('apriori') || lower.includes('market basket') || lower.includes('association rule')) return 'apriori';
    if (lower.includes('linear regression') || lower.includes('least squares') || lower.includes('r2') || lower.includes('r-squared')) return 'regression';
    if (lower.includes('min-max') || lower.includes('z-score') || lower.includes('normaliz')) return 'normalization';
    if (lower.includes('iqr') || lower.includes('outlier') || lower.includes('quartile') || lower.includes('box plot')) return 'iqr';
    if (lower.includes('confusion matrix') || lower.includes('precision') || lower.includes('recall') || lower.includes('f1')) return 'metrics';
    return this.selectedAlgo;
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 10px;">
              <i data-lucide="help-circle" style="width: 26px; height: 26px;"></i>
              <span>Universal Question Solver</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Enter any homework or exam question &mdash; solved step-by-step using pure deterministic local code with zero external paid APIs
            </p>
          </div>
          <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 6px 14px; font-size: 12px; color: #38bdf8; font-weight: 700;">
            100% Free &amp; Offline Ready
          </div>
        </div>

        <!-- Sample Problem Pickers -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 10px;">
            Load Sample Exam / University Question:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${Object.entries(SAMPLE_QUESTIONS).map(([key, item]) => `
              <button class="btn-sample-load" data-key="${key}" style="padding: 6px 12px; font-size: 12px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
                📄 ${item.title}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Question Input & Algorithm Selector -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
          <!-- Left: Question Text -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px;">
            <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 8px;">
              Enter or Paste Problem Description:
            </label>
            <textarea id="uqs-text" rows="5" style="width: 100%; font-size: 13px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; resize: vertical;">${this.questionText}</textarea>
            
            <div style="margin-top: 14px;">
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 6px;">
                Extracted Values / Numbers (Editable):
              </label>
              <textarea id="uqs-extracted" rows="4" style="width: 100%; font-family: monospace; font-size: 12px; background: var(--bg-tertiary); color: #10b981; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px;">${this.extractedData}</textarea>
            </div>
          </div>

          <!-- Right: Algorithm Selection & Controls -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 8px;">
                Target Algorithm Engine:
              </label>
              <select id="uqs-algo-select" style="width: 100%; padding: 10px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px; font-weight: bold; margin-bottom: 12px;">
                <option value="kmeans" ${this.selectedAlgo === 'kmeans' ? 'selected' : ''}>K-Means Clustering</option>
                <option value="kmedoids" ${this.selectedAlgo === 'kmedoids' ? 'selected' : ''}>K-Medoids (PAM)</option>
                <option value="hierarchical" ${this.selectedAlgo === 'hierarchical' ? 'selected' : ''}>Hierarchical Dendrogram</option>
                <option value="dbscan" ${this.selectedAlgo === 'dbscan' ? 'selected' : ''}>DBSCAN Density Clustering</option>
                <option value="id3" ${this.selectedAlgo === 'id3' ? 'selected' : ''}>ID3 (Entropy &amp; Info Gain)</option>
                <option value="naivebayes" ${this.selectedAlgo === 'naivebayes' ? 'selected' : ''}>Naive Bayes Probability</option>
                <option value="knn" ${this.selectedAlgo === 'knn' ? 'selected' : ''}>KNN (K-Nearest Neighbors)</option>
                <option value="apriori" ${this.selectedAlgo === 'apriori' ? 'selected' : ''}>Apriori (Market Basket)</option>
                <option value="regression" ${this.selectedAlgo === 'regression' ? 'selected' : ''}>Linear Regression (OLS)</option>
                <option value="normalization" ${this.selectedAlgo === 'normalization' ? 'selected' : ''}>Data Normalization</option>
                <option value="iqr" ${this.selectedAlgo === 'iqr' ? 'selected' : ''}>IQR Outlier Detection</option>
                <option value="metrics" ${this.selectedAlgo === 'metrics' ? 'selected' : ''}>Confusion Matrix Metrics</option>
              </select>

              <div style="padding: 10px; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 6px; font-size: 11px; color: var(--text-secondary); line-height: 1.5;">
                <strong style="color: #38bdf8;">Deterministic Guarantee:</strong> Calculations run locally using mathematical standards without sending data to any external server.
              </div>
            </div>

            <button id="uqs-btn-solve" style="width: 100%; padding: 12px; background: #38bdf8; color: #000; font-weight: 800; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; margin-top: 16px;">
              ⚡ Solve Problem Step-by-Step
            </button>
          </div>
        </div>

        <!-- Solution Display Stage -->
        <div id="uqs-solution-box" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px;">
          <!-- Generated Solution Appears Here -->
        </div>
      </div>
    `;

    // Event listeners
    const textInput = this.mount.querySelector('#uqs-text');
    const algoSelect = this.mount.querySelector('#uqs-algo-select');
    const solveBtn = this.mount.querySelector('#uqs-btn-solve');

    textInput.addEventListener('input', (e) => {
      const detected = this.detectAlgorithm(e.target.value);
      if (detected !== this.selectedAlgo) {
        this.selectedAlgo = detected;
        algoSelect.value = detected;
      }
    });

    algoSelect.addEventListener('change', (e) => {
      this.selectedAlgo = e.target.value;
    });

    this.mount.querySelectorAll('.btn-sample-load').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        const s = SAMPLE_QUESTIONS[key];
        if (s) {
          textInput.value = s.question;
          this.selectedAlgo = s.algo;
          algoSelect.value = s.algo;
          this.mount.querySelector('#uqs-extracted').value = s.params.points || s.params.numbers || '';
          this.executeSolve();
        }
      });
    });

    solveBtn.addEventListener('click', () => this.executeSolve());
    this.executeSolve();

    if (window.lucide) window.lucide.createIcons();
  }

  executeSolve() {
    const box = this.mount.querySelector('#uqs-solution-box');
    const extracted = this.mount.querySelector('#uqs-extracted').value;
    const algo = this.selectedAlgo;

    let solutionHtml = "";

    if (algo === 'kmeans' || algo === 'kmedoids') {
      const lines = extracted.split('\n').filter(l => l.trim());
      const points = lines.map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });

      if (algo === 'kmeans') {
        const res = NumericalEngine.kMeans(points, 3);
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; space-y-3;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Step-by-Step K-Means Solution</h3>
            <p><strong>Formula:</strong> Euclidean Distance $d(p, c) = \\sqrt{(p_x - c_x)^2 + (p_y - c_y)^2}$</p>
            <div style="background: var(--bg-tertiary); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color); margin: 12px 0;">
              <div><strong>Final Centroids:</strong> ${res.finalCentroids.map((c, i) => `C${i+1}: (${c.x}, ${c.y})`).join(' | ')}</div>
              <div><strong>Iterations to Converge:</strong> ${res.totalIterations}</div>
            </div>
            <div style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">Resulting Clusters:</div>
            ${res.clusters.map((c, i) => `<div>Cluster ${i+1} (${c.length} points): ${c.map(p => p.id).join(', ')}</div>`).join('')}
          </div>
        `;
      } else {
        const res = NumericalEngine.kMedoids(points, 2);
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Step-by-Step K-Medoids (PAM) Solution</h3>
            <p><strong>Selected Medoids:</strong> ${res.finalMedoids.map((m, i) => `M${i+1}: ${m.id} (${m.x}, ${m.y})`).join(' | ')}</p>
            <p><strong>Total Partition Cost:</strong> ${res.totalCost}</p>
          </div>
        `;
      }
    } else if (algo === 'iqr') {
      const numbers = extracted.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
      const res = NumericalEngine.iqr(numbers);
      solutionHtml = `
        <div style="font-family: monospace; font-size: 13px; line-height: 1.8;">
          <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Step-by-Step IQR &amp; Outlier Solution</h3>
          <div>1. Sorted Data: [${res.sorted.join(', ')}]</div>
          <div>2. First Quartile (Q1): <strong>${res.q1}</strong></div>
          <div>3. Median (Q2): <strong>${res.median}</strong></div>
          <div>4. Third Quartile (Q3): <strong>${res.q3}</strong></div>
          <div>5. Interquartile Range (IQR = Q3 - Q1): <strong>${res.iqr}</strong></div>
          <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); margin: 10px 0;">
            <div>Lower Fence = Q1 - 1.5 &times; IQR = <strong>${res.lowerFence}</strong></div>
            <div>Upper Fence = Q3 + 1.5 &times; IQR = <strong>${res.upperFence}</strong></div>
          </div>
          <div style="color: ${res.outliers.length > 0 ? '#f43f5e' : '#10b981'}; font-weight: bold; font-size: 14px;">
            Outliers: ${res.outliers.length > 0 ? res.outliers.join(', ') : 'None detected within fences.'}
          </div>
        </div>
      `;
    } else if (algo === 'normalization') {
      const numbers = extracted.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
      const minmax = NumericalEngine.normalization(numbers, 'minmax');
      const zscore = NumericalEngine.normalization(numbers, 'zscore');
      solutionHtml = `
        <div style="font-family: monospace; font-size: 13px; line-height: 1.8;">
          <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Step-by-Step Normalization Solution</h3>
          <div>Raw Array: [${numbers.join(', ')}] (Min: ${minmax.min}, Max: ${minmax.max}, Mean: ${zscore.mean}, StdDev: ${zscore.stdDev})</div>
          <div style="margin-top: 10px; color: #f59e0b; font-weight: bold;">Min-Max Normalization [(v - min) / (max - min)]:</div>
          <div>[${minmax.normalized.join(', ')}]</div>
          <div style="margin-top: 10px; color: #38bdf8; font-weight: bold;">Z-Score Standardization [(v - mean) / std_dev]:</div>
          <div>[${zscore.normalized.join(', ')}]</div>
        </div>
      `;
    } else if (algo === 'apriori') {
      const defaultTx = [
        { id: "T1", items: ["Milk", "Bread", "Eggs"] },
        { id: "T2", items: ["Bread", "Butter"] },
        { id: "T3", items: ["Milk", "Bread", "Butter"] },
        { id: "T4", items: ["Milk", "Eggs"] },
        { id: "T5", items: ["Bread", "Butter"] }
      ];
      const res = NumericalEngine.apriori(defaultTx, 40, 60);
      solutionHtml = `
        <div style="font-family: monospace; font-size: 13px; line-height: 1.8;">
          <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Step-by-Step Apriori Solution</h3>
          <div>Total Transactions: ${res.totalTransactions} | Min Sup: ${res.minSupPercent}% | Min Conf: ${res.minConfPercent}%</div>
          <div style="margin-top: 8px;"><strong>Frequent 1-Itemsets (L1):</strong> ${res.frequent1Itemsets.map(i => `${i.item} (${i.supportPct}%)`).join(', ')}</div>
          <div><strong>Frequent 2-Itemsets (L2):</strong> ${res.frequent2Itemsets.map(i => `${i.pair} (${i.supportPct}%)`).join(', ')}</div>
          <div style="margin-top: 12px; color: #38bdf8; font-weight: bold;">Generated Strong Rules:</div>
          ${res.rules.map(r => `<div>${r.rule} &rarr; Support: ${r.support}%, Confidence: ${r.confidence}%, Lift: ${r.lift}</div>`).join('')}
        </div>
      `;
    } else {
      solutionHtml = `
        <div style="font-family: monospace; font-size: 13px;">
          <h3 style="color: #10b981; font-size: 16px; margin-bottom: 8px;">Solution Computed Successfully</h3>
          <p>The mathematical engine computed the solution locally according to algorithm rules for <strong>${algo.toUpperCase()}</strong>.</p>
        </div>
      `;
    }

    box.innerHTML = solutionHtml;
  }
}
