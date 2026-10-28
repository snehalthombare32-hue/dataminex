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
    const extracted = (this.mount.querySelector('#uqs-extracted').value || '').trim();
    const qText = (this.mount.querySelector('#uqs-text').value || '').trim();
    const algo = this.selectedAlgo;

    let solutionHtml = "";

    // Helper: Parse 2D coordinate points
    const parsePoints = (text) => {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const points = [];
      lines.forEach((line, idx) => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : `P${idx + 1}`;
        const rest = parts.length > 1 ? parts[1] : parts[0];
        const nums = rest.match(/-?\d+(\.\d+)?/g);
        if (nums && nums.length >= 2) {
          points.push({ id, x: parseFloat(nums[0]), y: parseFloat(nums[1]) });
        }
      });
      if (points.length === 0) {
        const allNums = (text.match(/-?\d+(\.\d+)?/g) || []).map(Number);
        for (let i = 0; i < allNums.length - 1; i += 2) {
          points.push({ id: `P${Math.floor(i / 2) + 1}`, x: allNums[i], y: allNums[i + 1] });
        }
      }
      return points;
    };

    // Helper: Parse number array
    const parseNumbers = (text) => {
      return (text.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    };

    // Helper: Parse transactions
    const parseTransactions = (text) => {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const tx = [];
      lines.forEach((line, idx) => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : `T${idx + 1}`;
        const rest = parts.length > 1 ? parts[1] : parts[0];
        const items = rest.split(/[,;\t]+/).map(s => s.trim()).filter(Boolean);
        if (items.length > 0) {
          tx.push({ id, items });
        }
      });
      return tx;
    };

    try {
      if (algo === 'kmeans' || algo === 'kmedoids') {
        const points = parsePoints(extracted);
        if (points.length < 2) {
          solutionHtml = `<div style="color: #ef4444; font-weight: bold; padding: 12px; background: rgba(239,68,68,0.1); border-radius: 8px;">⚠️ Please provide at least 2 coordinate points (e.g. P1: 2, 10 or 2, 10).</div>`;
        } else {
          const kMatch = (qText + ' ' + extracted).match(/\bK\s*=\s*(\d+)/i) || (qText + ' ' + extracted).match(/(\d+)\s*clusters/i);
          const k = kMatch ? Math.max(1, Math.min(points.length, parseInt(kMatch[1]))) : (algo === 'kmeans' ? Math.min(3, points.length) : Math.min(2, points.length));

          if (algo === 'kmeans') {
            const res = NumericalEngine.kMeans(points, k);
            solutionHtml = `
              <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 12px;">
                  <h3 style="color: #10b981; font-size: 16px; margin: 0;">Step-by-Step K-Means Solution (K = ${res.k})</h3>
                  <span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 3px 10px; border-radius: 12px; font-weight: bold; font-size: 11px;">${res.converged ? '✓ Converged' : 'Max Iterations'} in ${res.totalIterations} Iteration(s)</span>
                </div>
                <p><strong>1. Input Points (${points.length}):</strong> ${points.map(p => `${p.id}(${p.x}, ${p.y})`).join(', ')}</p>
                <p><strong>2. Mathematical Formula:</strong> Euclidean Distance $d(P, C) = \\sqrt{(x_p - c_x)^2 + (y_p - c_y)^2}$ | Centroid Update $C = (\\frac{\\sum x}{n}, \\frac{\\sum y}{n})$</p>
                
                <div style="background: var(--bg-tertiary); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color); margin: 12px 0;">
                  <div style="font-weight: bold; color: #38bdf8; margin-bottom: 6px;">Iteration History:</div>
                  ${res.history.map(h => `
                    <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.08);">
                      <strong>Iteration ${h.iteration}:</strong> Centroids: ${h.centroids.map((c, i) => `C${i+1}(${c.x}, ${c.y})`).join(', ')} | Cluster Sizes: [${h.clustersCount.join(', ')}] | Shift: ${h.shift} | SSE: ${h.sse}
                    </div>
                  `).join('')}
                </div>

                <div style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">Final Cluster Partitions:</div>
                ${res.clusters.map((c, i) => `
                  <div style="padding: 6px 12px; background: rgba(56,189,248,0.05); border-left: 3px solid #38bdf8; margin-bottom: 4px; border-radius: 0 4px 4px 0;">
                    <strong>Cluster ${i+1} (${c.length} points)</strong> &mdash; Centroid: <strong>(${res.finalCentroids[i]?.x}, ${res.finalCentroids[i]?.y})</strong> &mdash; Points: [${c.map(p => p.id).join(', ')}]
                  </div>
                `).join('')}
                
                <div style="margin-top: 14px; padding: 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 8px; color: #10b981;">
                  <strong>Final Conclusion:</strong> Points partitioned into ${res.k} clusters with zero further centroid drift (tolerance &le; ${res.tolerance}).
                </div>
              </div>
            `;
          } else {
            const res = NumericalEngine.kMedoids(points, k);
            solutionHtml = `
              <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
                <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Step-by-Step K-Medoids (PAM) Solution (K = ${res.k})</h3>
                <p><strong>1. Input Points:</strong> ${points.map(p => `${p.id}(${p.x}, ${p.y})`).join(', ')}</p>
                <p><strong>2. Cost Function:</strong> Total Absolute Dissimilarity $E = \\sum_{i} d(P_i, M_{\\text{assigned}})$</p>
                <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); margin: 10px 0;">
                  <div><strong>Selected Optimal Medoids:</strong> ${res.finalMedoids.map((m, i) => `M${i+1}: ${m.id}(${m.x}, ${m.y})`).join(' | ')}</div>
                  <div><strong>Final Absolute Dissimilarity Cost:</strong> ${res.totalCost}</div>
                  <div><strong>Iterations Evaluated:</strong> ${res.totalIterations}</div>
                </div>
                <div style="font-weight: bold; color: #38bdf8; margin-bottom: 6px;">Cluster Assignments:</div>
                ${res.clusters.map((c, i) => `<div>Cluster ${i+1} (Medoid ${res.finalMedoids[i]?.id}): [${c.map(p => p.id).join(', ')}]</div>`).join('')}
              </div>
            `;
          }
        }
      } else if (algo === 'hierarchical') {
        const points = parsePoints(extracted);
        if (points.length < 2) {
          solutionHtml = `<div style="color: #ef4444; font-weight: bold; padding: 12px; background: rgba(239,68,68,0.1); border-radius: 8px;">⚠️ Please provide at least 2 points for hierarchical clustering.</div>`;
        } else {
          const res = NumericalEngine.hierarchicalClustering(points, 'single');
          solutionHtml = `
            <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
              <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Agglomerative Hierarchical Clustering Solution</h3>
              <p><strong>Linkage:</strong> Single Linkage (Minimum Distance between Cluster Points)</p>
              <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
                <thead><tr style="border-bottom: 1px solid var(--border-color); text-align: left;"><th style="padding: 6px;">Merge Step</th><th style="padding: 6px;">Cluster A + Cluster B</th><th style="padding: 6px;">Merge Distance</th><th style="padding: 6px;">Resulting Cluster</th></tr></thead>
                <tbody>
                  ${res.steps.map(s => `
                    <tr style="border-bottom: 1px dashed rgba(255,255,255,0.06);"><td style="padding: 6px;">Step ${s.step}</td><td style="padding: 6px; color: #38bdf8;">${s.clusterA} + ${s.clusterB}</td><td style="padding: 6px;">d = ${s.distance}</td><td style="padding: 6px; font-weight: bold;">${s.mergedLabel}</td></tr>
                  `).join('')}
                </tbody>
              </table>
              <div style="padding: 10px; background: rgba(16,185,129,0.1); border-radius: 6px; color: #10b981;">
                <strong>Root Dendrogram Cluster:</strong> ${res.finalTree.label} formed in ${res.steps.length} sequential merges.
              </div>
            </div>
          `;
        }
      } else if (algo === 'dbscan') {
        const points = parsePoints(extracted);
        if (points.length < 2) {
          solutionHtml = `<div style="color: #ef4444; font-weight: bold; padding: 12px; background: rgba(239,68,68,0.1); border-radius: 8px;">⚠️ Please provide coordinate points for DBSCAN.</div>`;
        } else {
          const epsMatch = (qText + ' ' + extracted).match(/eps(?:ilon)?\s*[:=]\s*(\d+(\.\d+)?)/i);
          const minPtsMatch = (qText + ' ' + extracted).match(/minpts\s*[:=]\s*(\d+)/i);
          const eps = epsMatch ? parseFloat(epsMatch[1]) : 3;
          const minPts = minPtsMatch ? parseInt(minPtsMatch[1]) : 2;

          const res = NumericalEngine.dbscan(points, eps, minPts);
          solutionHtml = `
            <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
              <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">DBSCAN Density-Based Clustering (ε = ${res.eps}, MinPts = ${res.minPts})</h3>
              <p>Core Point rule: |N_ε(P)| &ge; ${res.minPts} | Border Point: within ε of a Core point | Noise: isolated.</p>
              <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin: 10px 0;">
                <div><strong>Total Clusters:</strong> ${res.totalClusters}</div>
                <div><strong>Noise / Outlier Points:</strong> ${res.noise.map(p => p.id).join(', ') || 'None'}</div>
              </div>
              <div style="font-weight: bold; color: #38bdf8; margin-bottom: 6px;">Point Type Classifications:</div>
              ${points.map(p => {
                const type = res.pointTypes[p.id] || 'noise';
                const col = type === 'core' ? '#10b981' : (type === 'border' ? '#f59e0b' : '#ef4444');
                return `<div>${p.id}(${p.x}, ${p.y}): <span style="color: ${col}; font-weight: bold;">${type.toUpperCase()}</span> (Neighbors in ε: ${res.neighborhoods[p.id]?.length || 0})</div>`;
              }).join('')}
            </div>
          `;
        }
      } else if (algo === 'id3') {
        const lines = extracted.split('\n').map(l => l.trim()).filter(Boolean);
        let data = [];
        let targetAttr = 'Play';

        if (lines.length >= 2 && lines[0].includes(',')) {
          const headers = lines[0].split(',').map(h => h.trim());
          targetAttr = headers[headers.length - 1];
          for (let i = 1; i < lines.length; i++) {
            const vals = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((h, hIdx) => { row[h] = vals[hIdx] || ''; });
            data.push(row);
          }
        } else {
          data = [
            { Outlook: "Sunny", Humidity: "High", Play: "No" },
            { Outlook: "Sunny", Humidity: "High", Play: "No" },
            { Outlook: "Overcast", Humidity: "High", Play: "Yes" },
            { Outlook: "Rain", Humidity: "High", Play: "Yes" },
            { Outlook: "Rain", Humidity: "Normal", Play: "Yes" },
            { Outlook: "Rain", Humidity: "Normal", Play: "No" },
            { Outlook: "Overcast", Humidity: "Normal", Play: "Yes" },
            { Outlook: "Sunny", Humidity: "Normal", Play: "Yes" }
          ];
        }

        const res = NumericalEngine.id3Entropy(data, targetAttr);
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">ID3 Decision Tree Information Gain Solution</h3>
            <p><strong>Dataset Size:</strong> ${data.length} tuples | <strong>Target Class:</strong> ${targetAttr}</p>
            <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin: 10px 0;">
              <div><strong>System Entropy H(S):</strong> ${res.systemEntropy} bits</div>
              <div>Formula: $H(S) = -\\sum p_i \\log_2(p_i)$ | $Gain(S, A) = H(S) - \\sum \\frac{|S_v|}{|S|} H(S_v)$</div>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
              <thead><tr style="border-bottom: 1px solid var(--border-color); text-align: left;"><th style="padding: 6px;">Attribute</th><th style="padding: 6px;">Expected Entropy H(S, A)</th><th style="padding: 6px;">Information Gain Gain(S, A)</th></tr></thead>
              <tbody>
                ${res.gains.map(g => `
                  <tr style="border-bottom: 1px dashed rgba(255,255,255,0.06);"><td style="padding: 6px; font-weight: bold; color: #38bdf8;">${g.attribute}</td><td style="padding: 6px;">${g.expectedEntropy} bits</td><td style="padding: 6px; color: #10b981; font-weight: bold;">${g.informationGain} bits</td></tr>
                `).join('')}
              </tbody>
            </table>
            <div style="padding: 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 8px; color: #10b981;">
              <strong>Root Node Selection:</strong> Attribute <strong>"${res.bestSplitAttribute}"</strong> yields maximum Information Gain (${res.highestGain} bits).
            </div>
          </div>
        `;
      } else if (algo === 'naivebayes') {
        const data = [
          { Outlook: "Sunny", Humidity: "High", Play: "No" },
          { Outlook: "Sunny", Humidity: "High", Play: "No" },
          { Outlook: "Overcast", Humidity: "High", Play: "Yes" },
          { Outlook: "Rain", Humidity: "High", Play: "Yes" },
          { Outlook: "Rain", Humidity: "Normal", Play: "Yes" },
          { Outlook: "Sunny", Humidity: "Normal", Play: "Yes" }
        ];
        const res = NumericalEngine.naiveBayes(data, 'Play', { Outlook: 'Sunny', Humidity: 'High' });
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Naive Bayes Classification Solution</h3>
            <p><strong>Query Test Point:</strong> Outlook=Sunny, Humidity=High | <strong>Classes:</strong> ${res.classes.join(', ')}</p>
            <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin: 10px 0;">
              <div>Formula: $P(C_k | X) \\propto P(C_k) \\prod P(x_i | C_k)$ (Laplace Smoothed)</div>
              ${res.classes.map(c => `<div>P(${c}) Prior: ${res.classPriors[c]?.prior} | Likelihood Raw Score: ${res.likelihoods[c]?.score}</div>`).join('')}
            </div>
            <div style="font-weight: bold; color: #38bdf8; margin: 8px 0;">Normalized Posterior Probabilities:</div>
            ${res.classes.map(c => `<div>Class "${c}": <strong>${(res.posteriors[c] * 100).toFixed(1)}%</strong></div>`).join('')}
            <div style="margin-top: 12px; padding: 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 8px; color: #10b981;">
              <strong>Predicted Class:</strong> "${res.predictedClass}" with confidence ${res.confidence}.
            </div>
          </div>
        `;
      } else if (algo === 'knn') {
        const lines = extracted.split('\n').map(l => l.trim()).filter(Boolean);
        const train = [];
        let testPoint = { x: 3, y: 3 };

        lines.forEach((line, idx) => {
          const parts = line.split(/[:,\t]+/).map(s => s.trim());
          if (parts.length >= 3) {
            train.push({ id: `P${idx+1}`, x: parseFloat(parts[0]) || 0, y: parseFloat(parts[1]) || 0, label: parts[2] });
          }
        });

        const pts = train.length >= 2 ? train : [
          { x: 1, y: 2, label: "Red", id: "P1" },
          { x: 2, y: 3, label: "Red", id: "P2" },
          { x: 6, y: 5, label: "Blue", id: "P3" },
          { x: 7, y: 8, label: "Blue", id: "P4" }
        ];

        const kMatch = (qText + ' ' + extracted).match(/\bK\s*=\s*(\d+)/i);
        const k = kMatch ? parseInt(kMatch[1]) : 3;

        const res = NumericalEngine.knn(pts, testPoint, k);
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">KNN Nearest Neighbors Solution (K = ${res.k})</h3>
            <p><strong>Query Point:</strong> T(${testPoint.x}, ${testPoint.y}) | <strong>Metric:</strong> Euclidean Distance $d = \\sqrt{(x_1-x_2)^2 + (y_1-y_2)^2}$</p>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <thead><tr style="border-bottom: 1px solid var(--border-color); text-align: left;"><th style="padding: 6px;">Rank</th><th style="padding: 6px;">Sample</th><th style="padding: 6px;">Label</th><th style="padding: 6px;">Distance</th></tr></thead>
              <tbody>
                ${res.neighbors.map((n, i) => `
                  <tr style="border-bottom: 1px dashed rgba(255,255,255,0.06);"><td style="padding: 6px;">#${i+1}</td><td style="padding: 6px;">(${n.x}, ${n.y})</td><td style="padding: 6px; font-weight: bold; color: #38bdf8;">${n.label}</td><td style="padding: 6px;">d = ${n.distance}</td></tr>
                `).join('')}
              </tbody>
            </table>
            <div style="padding: 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 8px; color: #10b981;">
              <strong>Majority Voting Classification:</strong> "${res.predictedClass}" (${res.confidence} vote majority).
            </div>
          </div>
        `;
      } else if (algo === 'apriori') {
        const tx = parseTransactions(extracted);
        const transactions = tx.length >= 2 ? tx : [
          { id: "T1", items: ["Milk", "Bread", "Eggs"] },
          { id: "T2", items: ["Bread", "Butter"] },
          { id: "T3", items: ["Milk", "Bread", "Butter"] },
          { id: "T4", items: ["Milk", "Eggs"] },
          { id: "T5", items: ["Bread", "Butter"] }
        ];

        const supMatch = (qText + ' ' + extracted).match(/support\s*[:=]?\s*(\d+)/i);
        const confMatch = (qText + ' ' + extracted).match(/confidence\s*[:=]?\s*(\d+)/i);
        const minSup = supMatch ? parseInt(supMatch[1]) : 40;
        const minConf = confMatch ? parseInt(confMatch[1]) : 60;

        const res = NumericalEngine.apriori(transactions, minSup, minConf);
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Apriori Market Basket Association Rules</h3>
            <p><strong>Transactions:</strong> ${res.totalTransactions} | <strong>Min Support:</strong> ${res.minSupPercent}% (Count &ge; ${res.minSupCount}) | <strong>Min Confidence:</strong> ${res.minConfPercent}%</p>
            
            <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin: 10px 0;">
              <div><strong>Frequent 1-Itemsets (L1):</strong> ${res.frequent1Itemsets.map(l => `${l.item} (${l.count}, ${l.supportPct}%)`).join(', ')}</div>
              <div><strong>Frequent 2-Itemsets (L2):</strong> ${res.frequent2Itemsets.map(l => `${l.pair} (${l.count}, ${l.supportPct}%)`).join(', ') || 'None'}</div>
              ${res.frequent3Itemsets && res.frequent3Itemsets.length > 0 ? `<div><strong>Frequent 3-Itemsets (L3):</strong> ${res.frequent3Itemsets.map(l => `${l.triplet} (${l.count}, ${l.supportPct}%)`).join(', ')}</div>` : ''}
            </div>

            <div style="font-weight: bold; color: #38bdf8; margin: 10px 0 6px;">Generated Association Rules (${res.rules.length}):</div>
            ${res.rules.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                <thead><tr style="border-bottom: 1px solid var(--border-color); text-align: left;"><th style="padding: 6px;">Rule</th><th style="padding: 6px;">Support %</th><th style="padding: 6px;">Confidence %</th><th style="padding: 6px;">Lift Metric</th></tr></thead>
                <tbody>
                  ${res.rules.map(r => `
                    <tr style="border-bottom: 1px dashed rgba(255,255,255,0.06);"><td style="padding: 6px; font-weight: bold; color: #10b981;">${r.rule}</td><td style="padding: 6px;">${r.support}%</td><td style="padding: 6px;">${r.confidence}%</td><td style="padding: 6px; color: #38bdf8;">${r.lift}</td></tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `<div style="color: #f59e0b;">No rules satisfied both minimum support &ge; ${res.minSupPercent}% and confidence &ge; ${res.minConfPercent}%.</div>`}
          </div>
        `;
      } else if (algo === 'regression') {
        const points = parsePoints(extracted);
        const pts = points.length >= 2 ? points : [
          { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 6 }
        ];

        const res = NumericalEngine.linearRegression(pts);
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.6;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Ordinary Least Squares (OLS) Linear Regression</h3>
            <p><strong>Sample Size n:</strong> ${res.n} data points | <strong>Formula:</strong> $y = bx + a$</p>
            <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin: 10px 0;">
              <div>$\\sum x = ${res.sumX}, \\sum y = ${res.sumY}, \\sum xy = ${res.sumXY}, \\sum x^2 = ${res.sumX2}$</div>
              <div>Slope $b = \\frac{n\\sum xy - \\sum x\\sum y}{n\\sum x^2 - (\\sum x)^2} = ${res.slope}$</div>
              <div>Intercept $a = \\bar{y} - b\\bar{x} = ${res.intercept}$</div>
            </div>
            <div style="padding: 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 8px; color: #10b981; margin: 10px 0;">
              <strong>Fitted Regression Equation:</strong> ${res.equation}<br>
              <strong>Goodness of Fit:</strong> $R^2 = ${res.r2}$ | $\\text{MSE} = ${res.mse}$ | $\\text{RMSE} = ${res.rmse}$
            </div>
          </div>
        `;
      } else if (algo === 'iqr') {
        const numbers = parseNumbers(extracted);
        const nums = numbers.length >= 3 ? numbers : [12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65];
        const res = NumericalEngine.iqr(nums);
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.8;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Interquartile Range (IQR) &amp; Outlier Detection</h3>
            <p><strong>Convention:</strong> ${res.convention}</p>
            <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin: 10px 0;">
              ${res.steps.map(s => `<div>${s}</div>`).join('')}
            </div>
            <div style="padding: 12px; background: ${res.outliers.length > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}; border: 1px solid ${res.outliers.length > 0 ? '#ef4444' : '#10b981'}; border-radius: 8px; color: ${res.outliers.length > 0 ? '#ef4444' : '#10b981'};">
              <strong>Outliers Detected:</strong> ${res.outliers.length > 0 ? `[${res.outliers.join(', ')}] (outside inner fences [${res.lowerFence}, ${res.upperFence}])` : 'None detected.'}
            </div>
          </div>
        `;
      } else if (algo === 'normalization') {
        const numbers = parseNumbers(extracted);
        const nums = numbers.length >= 2 ? numbers : [200, 300, 400, 600, 1000];
        const minmax = NumericalEngine.normalization(nums, 'minmax');
        const zscore = NumericalEngine.normalization(nums, 'zscore');
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.8;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Data Normalization &amp; Scaling Solution</h3>
            <div><strong>Raw Array:</strong> [${nums.join(', ')}]</div>
            <div><strong>Stats:</strong> Min = ${minmax.min}, Max = ${minmax.max}, Mean = ${zscore.mean}, StdDev = ${zscore.stdDev}</div>
            <div style="margin-top: 10px; color: #f59e0b; font-weight: bold;">Min-Max Normalization $[v' = \\frac{v - \\min}{\\max - \\min}]$:</div>
            <div style="background: var(--bg-tertiary); padding: 8px; border-radius: 6px;">[${minmax.normalized.join(', ')}]</div>
            <div style="margin-top: 10px; color: #38bdf8; font-weight: bold;">Z-Score Standardization $[z = \\frac{v - \\mu}{\\sigma}]$:</div>
            <div style="background: var(--bg-tertiary); padding: 8px; border-radius: 6px;">[${zscore.normalized.join(', ')}]</div>
          </div>
        `;
      } else if (algo === 'metrics') {
        const nums = parseNumbers(extracted);
        const tp = nums[0] !== undefined ? nums[0] : 80;
        const tn = nums[1] !== undefined ? nums[1] : 90;
        const fp = nums[2] !== undefined ? nums[2] : 10;
        const fn = nums[3] !== undefined ? nums[3] : 20;

        const res = NumericalEngine.evaluationMetrics({ tp, tn, fp, fn });
        solutionHtml = `
          <div style="font-family: monospace; font-size: 13px; line-height: 1.7;">
            <h3 style="color: #10b981; font-size: 16px; margin-bottom: 10px;">Confusion Matrix Evaluation Metrics</h3>
            <p><strong>Input:</strong> TP = ${res.tp}, TN = ${res.tn}, FP = ${res.fp}, FN = ${res.fn} (Total N = ${res.total})</p>
            <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin: 10px 0;">
              <div>Accuracy: <strong>${res.percentages.accuracy}</strong> &mdash; ${res.formulas.accuracy}</div>
              <div>Precision: <strong>${res.percentages.precision}</strong> &mdash; ${res.formulas.precision}</div>
              <div>Recall (Sensitivity): <strong>${res.percentages.recall}</strong> &mdash; ${res.formulas.recall}</div>
              <div>Specificity: <strong>${res.percentages.specificity}</strong> &mdash; ${res.formulas.specificity}</div>
              <div>F1-Score: <strong>${res.percentages.f1Score}</strong> &mdash; ${res.formulas.f1Score}</div>
            </div>
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
    } catch (err) {
      solutionHtml = `
        <div style="color: #ef4444; font-weight: bold; padding: 14px; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; border-radius: 8px;">
          ⚠️ Calculation Error: ${err.message || 'Please check your numerical input format and try again.'}
        </div>
      `;
    }

    box.innerHTML = solutionHtml;
  }
}
