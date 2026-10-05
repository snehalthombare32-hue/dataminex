// DataMineX - Interactive Numerical Solver Component
// 100% Free & Local-First In-Browser Numerical Problem Solver

import { NumericalEngine } from './numericalEngine.js';

export class NumericalSolver {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.currentAlgo = 'kmeans';
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  setAlgo(algo) {
    this.currentAlgo = algo;
    this.render();
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800; color: #f59e0b; display: flex; align-items: center; gap: 10px;">
              <i data-lucide="calculator" style="width: 26px; height: 26px;"></i>
              <span>Local Numerical Solver (100% Free &amp; Offline)</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Deterministic mathematical problem solver running entirely in your browser with zero external APIs
            </p>
          </div>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 6px 14px; font-size: 12px; color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="shield-check" style="width: 16px; height: 16px;"></i>
            <span>Pure Deterministic Local Engine</span>
          </div>
        </div>

        <!-- Algorithm Navigation Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; margin-bottom: 24px;">
          ${[
            { id: 'kmeans', label: '1. K-Means', icon: 'circle-dot' },
            { id: 'kmedoids', label: '2. K-Medoids', icon: 'disc' },
            { id: 'hierarchical', label: '3. Hierarchical', icon: 'git-merge' },
            { id: 'dbscan', label: '4. DBSCAN', icon: 'sparkles' },
            { id: 'id3', label: '5. ID3 (Entropy)', icon: 'git-branch' },
            { id: 'naivebayes', label: '6. Naive Bayes', icon: 'binary' },
            { id: 'knn', label: '7. KNN Distance', icon: 'crosshair' },
            { id: 'apriori', label: '8. Apriori Rules', icon: 'shopping-cart' },
            { id: 'regression', label: '9. Linear Reg.', icon: 'trending-up' },
            { id: 'normalization', label: '10. Normalization', icon: 'sliders' },
            { id: 'iqr', label: '11. IQR Outliers', icon: 'box' },
            { id: 'metrics', label: '12. Eval Metrics', icon: 'check-square' }
          ].map(item => `
            <button class="algo-tab-btn ${this.currentAlgo === item.id ? 'active' : ''}" data-algo="${item.id}" style="padding: 10px 12px; font-size: 12px; font-weight: 700; border-radius: 8px; border: 1px solid var(--border-color); background: ${this.currentAlgo === item.id ? 'var(--primary-color)' : 'var(--bg-secondary)'}; color: ${this.currentAlgo === item.id ? '#ffffff' : 'var(--text-secondary)'}; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="${item.icon}" style="width: 14px; height: 14px;"></i>
              <span>${item.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- Active Solver Body Container -->
        <div id="solver-content-container" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 14px; padding: 24px;">
          <!-- Dynamically filled below -->
        </div>
      </div>
    `;

    // Bind navigation buttons
    this.mount.querySelectorAll('.algo-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const algo = e.currentTarget.getAttribute('data-algo');
        this.setAlgo(algo);
      });
    });

    this.renderActiveSolver();

    if (window.lucide) window.lucide.createIcons();
  }

  renderActiveSolver() {
    const container = this.mount.querySelector('#solver-content-container');
    if (!container) return;

    switch (this.currentAlgo) {
      case 'kmeans': this.renderKMeans(container); break;
      case 'kmedoids': this.renderKMedoids(container); break;
      case 'hierarchical': this.renderHierarchical(container); break;
      case 'dbscan': this.renderDBSCAN(container); break;
      case 'id3': this.renderID3(container); break;
      case 'naivebayes': this.renderNaiveBayes(container); break;
      case 'knn': this.renderKNN(container); break;
      case 'apriori': this.renderApriori(container); break;
      case 'regression': this.renderRegression(container); break;
      case 'normalization': this.renderNormalization(container); break;
      case 'iqr': this.renderIQR(container); break;
      case 'metrics': this.renderMetrics(container); break;
      default: this.renderKMeans(container);
    }
  }

  // 1. K-MEANS SOLVER
  renderKMeans(container) {
    const defaultData = "P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5\nP6: 6, 4\nP7: 1, 2\nP8: 4, 9";
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">K-Means Coordinate Clustering Solver</h3>
        <p style="font-size: 12px; color: var(--text-secondary);">Input 2D coordinate points (label: x, y) and set K clusters to compute Euclidean assignments and centroid shifts.</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="font-size: 11px; font-weight: bold; color: var(--text-secondary); display: block; margin-bottom: 6px;">Points (Name: X, Y):</label>
            <textarea id="km-input" rows="7" style="width: 100%; font-family: monospace; font-size: 12px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px;">${defaultData}</textarea>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; justify-content: center;">
            <div>
              <label style="font-size: 11px; font-weight: bold; color: var(--text-secondary);">Number of Clusters (K):</label>
              <input type="number" id="km-k" value="3" min="2" max="6" style="width: 100%; padding: 8px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px; margin-top: 4px;">
            </div>
            <button id="km-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">
              ⚡ Solve Step-by-Step Locally
            </button>
          </div>
        </div>
        <div id="km-result" style="margin-top: 20px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#km-input').value;
      const k = parseInt(container.querySelector('#km-k').value) || 3;
      const points = text.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });

      const res = NumericalEngine.kMeans(points, k);
      const resContainer = container.querySelector('#km-result');
      resContainer.innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #10b981; margin-bottom: 12px;">✓ Convergence Reached in ${res.totalIterations} Iteration(s)</h4>
          <div style="margin-bottom: 14px;">
            <strong>Final Centroids:</strong>
            ${res.finalCentroids.map((c, i) => `<span style="display: inline-block; margin-right: 12px; color: #38bdf8;">C${i+1} = (${c.x}, ${c.y})</span>`).join('')}
          </div>
          <div>
            <strong>Cluster Memberships:</strong>
            ${res.clusters.map((pts, i) => `
              <div style="margin-top: 6px;">
                <span style="color: #f59e0b; font-weight: bold;">Cluster ${i+1} (${pts.length} points):</span>
                <span>${pts.map(p => `${p.id}(${p.x},${p.y})`).join(', ')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    };

    container.querySelector('#km-solve').addEventListener('click', solve);
    solve();
  }

  // 2. K-MEDOIDS SOLVER
  renderKMedoids(container) {
    const defaultData = "P1: 2, 6\nP2: 3, 4\nP3: 3, 8\nP4: 4, 7\nP5: 6, 2\nP6: 6, 4\nP7: 7, 3\nP8: 7, 4\nP9: 8, 5\nP10: 7, 6";
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">K-Medoids (PAM Algorithm) Solver</h3>
        <p style="font-size: 12px; color: var(--text-secondary);">PAM selects actual representative data points as medoids to resist outliers.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <textarea id="kmed-input" rows="7" style="width: 100%; font-family: monospace; font-size: 12px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px;">${defaultData}</textarea>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; justify-content: center;">
            <div>
              <label style="font-size: 11px; font-weight: bold; color: var(--text-secondary);">K Value:</label>
              <input type="number" id="kmed-k" value="2" min="2" max="5" style="width: 100%; padding: 8px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px; margin-top: 4px;">
            </div>
            <button id="kmed-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Compute Optimal Medoids</button>
          </div>
        </div>
        <div id="kmed-result" style="margin-top: 20px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#kmed-input').value;
      const k = parseInt(container.querySelector('#kmed-k').value) || 2;
      const points = text.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });

      const res = NumericalEngine.kMedoids(points, k);
      const resContainer = container.querySelector('#kmed-result');
      resContainer.innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #10b981; margin-bottom: 8px;">✓ Optimal Medoids Found (Cost: ${res.totalCost})</h4>
          <div><strong>Chosen Medoids:</strong> ${res.finalMedoids.map((m, i) => `<span style="color: #38bdf8; margin-right: 12px;">M${i+1}: ${m.id} (${m.x}, ${m.y})</span>`).join('')}</div>
          <div style="margin-top: 10px;">
            <strong>Cluster Groups:</strong>
            ${res.clusters.map((pts, i) => `<div style="margin-top: 4px;"><span style="color: #f59e0b;">Group ${i+1}:</span> ${pts.map(p => `${p.id}`).join(', ')}</div>`).join('')}
          </div>
        </div>
      `;
    };

    container.querySelector('#kmed-solve').addEventListener('click', solve);
    solve();
  }

  // 3. HIERARCHICAL SOLVER
  renderHierarchical(container) {
    const defaultData = "P1: 1, 1\nP2: 1.5, 1.5\nP3: 5, 5\nP4: 3, 4\nP5: 4, 4\nP6: 3, 3.5";
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">Hierarchical Agglomerative Clustering Solver</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <textarea id="h-input" rows="6" style="width: 100%; font-family: monospace; font-size: 12px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px;">${defaultData}</textarea>
          <div style="display: flex; flex-direction: column; gap: 10px; justify-content: center;">
            <select id="h-linkage" style="padding: 8px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px;">
              <option value="single">Single Linkage (Min Distance)</option>
              <option value="complete">Complete Linkage (Max Distance)</option>
              <option value="average">Average Linkage (Mean Distance)</option>
            </select>
            <button id="h-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Generate Dendrogram Merge Sequence</button>
          </div>
        </div>
        <div id="h-result" style="margin-top: 20px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#h-input').value;
      const linkage = container.querySelector('#h-linkage').value;
      const points = text.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });

      const res = NumericalEngine.hierarchicalClustering(points, linkage);
      container.querySelector('#h-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #10b981; margin-bottom: 8px;">Step-by-Step Merge History (${linkage.toUpperCase()} LINKAGE):</h4>
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead><tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary);"><th>Step</th><th>Cluster 1</th><th>Cluster 2</th><th>Merged Pair</th><th>Distance</th></tr></thead>
            <tbody>
              ${res.steps.map(s => `<tr><td style="padding: 6px 0;">${s.step}</td><td>${s.clusterA}</td><td>${s.clusterB}</td><td style="color: #f59e0b;">${s.mergedLabel}</td><td style="color: #38bdf8;">${s.distance}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    container.querySelector('#h-solve').addEventListener('click', solve);
    solve();
  }

  // 4. DBSCAN SOLVER
  renderDBSCAN(container) {
    const defaultData = "P1: 2, 10\nP2: 2, 9\nP3: 8, 4\nP4: 8, 5\nP5: 7, 5\nP6: 25, 30";
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">DBSCAN Density-Based Clustering Solver</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <textarea id="db-input" rows="6" style="width: 100%; font-family: monospace; font-size: 12px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px;">${defaultData}</textarea>
          <div style="display: flex; flex-direction: column; gap: 10px; justify-content: center;">
            <div style="display: flex; gap: 10px;">
              <input type="number" id="db-eps" value="3" placeholder="Epsilon (Eps)" style="flex: 1; padding: 8px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px;">
              <input type="number" id="db-minpts" value="2" placeholder="MinPts" style="flex: 1; padding: 8px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px;">
            </div>
            <button id="db-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Identify Core, Border &amp; Noise Points</button>
          </div>
        </div>
        <div id="db-result" style="margin-top: 20px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#db-input').value;
      const eps = parseFloat(container.querySelector('#db-eps').value) || 3;
      const minPts = parseInt(container.querySelector('#db-minpts').value) || 2;
      const points = text.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });

      const res = NumericalEngine.dbscan(points, eps, minPts);
      container.querySelector('#db-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #10b981; margin-bottom: 8px;">DBSCAN Output (Clusters: ${res.totalClusters}, Noise Count: ${res.noise.length})</h4>
          ${res.clusters.map((c, i) => `<div style="margin-top: 4px;"><span style="color: #38bdf8;">Cluster ${i+1}:</span> ${c.map(p => `${p.id}`).join(', ')}</div>`).join('')}
          <div style="margin-top: 8px; color: #f43f5e;"><strong>Outliers / Noise:</strong> ${res.noise.length > 0 ? res.noise.map(p => p.id).join(', ') : 'None'}</div>
        </div>
      `;
    };

    container.querySelector('#db-solve').addEventListener('click', solve);
    solve();
  }

  // 5. ID3 ENTROPY SOLVER
  renderID3(container) {
    const defaultData = [
      { Outlook: "Sunny", Humidity: "High", Wind: "Weak", Play: "No" },
      { Outlook: "Sunny", Humidity: "High", Wind: "Strong", Play: "No" },
      { Outlook: "Overcast", Humidity: "High", Wind: "Weak", Play: "Yes" },
      { Outlook: "Rain", Humidity: "High", Wind: "Weak", Play: "Yes" },
      { Outlook: "Rain", Humidity: "Normal", Wind: "Weak", Play: "Yes" },
      { Outlook: "Rain", Humidity: "Normal", Wind: "Strong", Play: "No" },
      { Outlook: "Overcast", Humidity: "Normal", Wind: "Strong", Play: "Yes" },
      { Outlook: "Sunny", Humidity: "Normal", Wind: "Weak", Play: "Yes" }
    ];

    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">ID3 Decision Tree: Entropy &amp; Information Gain Solver</h3>
        <p style="font-size: 12px; color: var(--text-secondary);">Computes Shannon Entropy $H(S) = -\\sum p_i \\log_2(p_i)$ and selects the optimal root split attribute.</p>
        <button id="id3-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Calculate Information Gain Table</button>
        <div id="id3-result" style="margin-top: 20px;"></div>
      </div>
    `;

    const solve = () => {
      const res = NumericalEngine.id3Entropy(defaultData, 'Play');
      container.querySelector('#id3-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div style="color: #38bdf8; margin-bottom: 10px;"><strong>System Entropy H(S):</strong> ${res.systemEntropy} bits</div>
          <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 12px;">
            <thead><tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary);"><th>Attribute</th><th>Expected Entropy</th><th>Information Gain</th></tr></thead>
            <tbody>
              ${res.gains.map(g => `<tr><td style="padding: 6px 0; font-weight: bold;">${g.attribute}</td><td>${g.expectedEntropy}</td><td style="color: #10b981; font-weight: bold;">${g.informationGain}</td></tr>`).join('')}
            </tbody>
          </table>
          <div style="padding: 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; color: #10b981;">
            <strong>Root Node Choice:</strong> Split on <span style="text-decoration: underline; font-weight: bold;">${res.bestSplitAttribute}</span> (Highest Information Gain = ${res.highestGain})
          </div>
        </div>
      `;
    };

    container.querySelector('#id3-solve').addEventListener('click', solve);
    solve();
  }

  // 6. NAIVE BAYES SOLVER
  renderNaiveBayes(container) {
    const defaultData = [
      { Outlook: "Sunny", Temp: "Hot", Play: "No" },
      { Outlook: "Sunny", Temp: "Mild", Play: "No" },
      { Outlook: "Overcast", Temp: "Hot", Play: "Yes" },
      { Outlook: "Rain", Temp: "Mild", Play: "Yes" },
      { Outlook: "Rain", Temp: "Cool", Play: "Yes" },
      { Outlook: "Sunny", Temp: "Cool", Play: "Yes" }
    ];

    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">Naive Bayes Probabilistic Classifier Solver</h3>
        <div style="display: flex; gap: 12px; align-items: center;">
          <span style="font-size: 12px; color: var(--text-secondary);">Test Instance: Outlook = Sunny, Temp = Cool</span>
          <button id="nb-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Compute Posterior Probabilities</button>
        </div>
        <div id="nb-result" style="margin-top: 14px;"></div>
      </div>
    `;

    const solve = () => {
      const res = NumericalEngine.naiveBayes(defaultData, 'Play', { Outlook: 'Sunny', Temp: 'Cool' });
      container.querySelector('#nb-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div style="color: #38bdf8; margin-bottom: 10px;"><strong>Posterior Probabilities:</strong></div>
          ${res.classes.map(c => `<div>P(${c} | Test) = <span style="color: #f59e0b; font-weight: bold;">${(res.posteriors[c] * 100).toFixed(1)}%</span></div>`).join('')}
          <div style="margin-top: 12px; color: #10b981; font-weight: bold;">
            Predicted Class: ${res.predictedClass} (Confidence: ${res.confidence})
          </div>
        </div>
      `;
    };

    container.querySelector('#nb-solve').addEventListener('click', solve);
    solve();
  }

  // 7. KNN SOLVER
  renderKNN(container) {
    const defaultData = [
      { x: 1, y: 2, label: "Red" },
      { x: 2, y: 3, label: "Red" },
      { x: 3, y: 1, label: "Red" },
      { x: 6, y: 5, label: "Blue" },
      { x: 7, y: 7, label: "Blue" },
      { x: 8, y: 6, label: "Blue" }
    ];

    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">K-Nearest Neighbors (KNN) Distance Solver</h3>
        <div style="display: flex; gap: 12px; align-items: center;">
          <span style="font-size: 12px; color: var(--text-secondary);">Query Point X=4, Y=4 (K=3)</span>
          <button id="knn-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Find Nearest Neighbors</button>
        </div>
        <div id="knn-result" style="margin-top: 14px;"></div>
      </div>
    `;

    const solve = () => {
      const res = NumericalEngine.knn(defaultData, { x: 4, y: 4 }, 3);
      container.querySelector('#knn-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div style="color: #38bdf8; margin-bottom: 8px;">Top 3 Nearest Neighbors:</div>
          ${res.neighbors.map((n, i) => `<div>${i+1}. Point (${n.x}, ${n.y}) - Class: ${n.label} (Distance: ${n.distance})</div>`).join('')}
          <div style="margin-top: 12px; color: #10b981; font-weight: bold;">
            Majority Voting Winner: ${res.predictedClass} (${res.confidence})
          </div>
        </div>
      `;
    };

    container.querySelector('#knn-solve').addEventListener('click', solve);
    solve();
  }

  // 8. APRIORI SOLVER
  renderApriori(container) {
    const transactions = [
      { id: "T1", items: ["Milk", "Bread", "Eggs"] },
      { id: "T2", items: ["Bread", "Butter"] },
      { id: "T3", items: ["Milk", "Bread", "Butter"] },
      { id: "T4", items: ["Milk", "Eggs"] },
      { id: "T5", items: ["Bread", "Butter"] }
    ];

    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">Apriori Association Rule Miner (Local Support &amp; Confidence)</h3>
        <button id="ap-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Mine Frequent Itemsets (Min Sup: 40%, Min Conf: 60%)</button>
        <div id="ap-result" style="margin-top: 14px;"></div>
      </div>
    `;

    const solve = () => {
      const res = NumericalEngine.apriori(transactions, 40, 60);
      container.querySelector('#ap-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div style="color: #38bdf8; margin-bottom: 8px;">Frequent 1-Itemsets (L1): ${res.frequent1Itemsets.map(i => `${i.item} (${i.supportPct}%)`).join(', ')}</div>
          <div style="color: #38bdf8; margin-bottom: 12px;">Frequent 2-Itemsets (L2): ${res.frequent2Itemsets.map(i => `${i.pair} (${i.supportPct}%)`).join(', ')}</div>
          <div style="font-weight: bold; color: #10b981; margin-bottom: 6px;">Generated Association Rules:</div>
          ${res.rules.map(r => `<div>${r.rule} &rarr; Support: ${r.support}%, Confidence: ${r.confidence}%, Lift: ${r.lift}</div>`).join('')}
        </div>
      `;
    };

    container.querySelector('#ap-solve').addEventListener('click', solve);
    solve();
  }

  // 9. REGRESSION SOLVER
  renderRegression(container) {
    const points = [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 7 }, { x: 5, y: 8 }];
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">Linear Regression (Ordinary Least Squares)</h3>
        <p style="font-size: 12px; color: var(--text-secondary);">Points: (1,2), (2,3), (3,5), (4,7), (5,8)</p>
        <button id="reg-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Compute Regression Line Equation &amp; R²</button>
        <div id="reg-result" style="margin-top: 14px;"></div>
      </div>
    `;

    const solve = () => {
      const res = NumericalEngine.linearRegression(points);
      container.querySelector('#reg-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div style="font-size: 14px; font-weight: bold; color: #10b981; margin-bottom: 8px;">Regression Line: ${res.equation}</div>
          <div>Slope (m): ${res.slope} | Intercept (b): ${res.intercept}</div>
          <div>R² (Goodness of Fit): ${res.r2} | Root Mean Squared Error (RMSE): ${res.rmse}</div>
        </div>
      `;
    };

    container.querySelector('#reg-solve').addEventListener('click', solve);
    solve();
  }

  // 10. NORMALIZATION SOLVER
  renderNormalization(container) {
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">Data Normalization Solver</h3>
        <p style="font-size: 12px; color: var(--text-secondary);">Raw Numbers: 200, 300, 400, 600, 1000</p>
        <div style="display: flex; gap: 10px;">
          <button id="norm-minmax" style="padding: 8px 16px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 6px; border: none; cursor: pointer; font-size: 12px;">Min-Max (0 to 1)</button>
          <button id="norm-zscore" style="padding: 8px 16px; background: #38bdf8; color: #000; font-weight: bold; border-radius: 6px; border: none; cursor: pointer; font-size: 12px;">Z-Score Standardization</button>
          <button id="norm-dec" style="padding: 8px 16px; background: #10b981; color: #000; font-weight: bold; border-radius: 6px; border: none; cursor: pointer; font-size: 12px;">Decimal Scaling</button>
        </div>
        <div id="norm-result" style="margin-top: 14px;"></div>
      </div>
    `;

    const runNorm = (method) => {
      const numbers = [200, 300, 400, 600, 1000];
      const res = NumericalEngine.normalization(numbers, method);
      container.querySelector('#norm-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div style="color: #38bdf8; margin-bottom: 6px;">Method: ${res.method.toUpperCase()}</div>
          <div>Mean: ${res.mean} | Std Dev: ${res.stdDev} | Range: [${res.min}, ${res.max}]</div>
          <div style="margin-top: 10px; color: #10b981; font-weight: bold;">Normalized Output:</div>
          <div>[${res.normalized.join(', ')}]</div>
        </div>
      `;
    };

    container.querySelector('#norm-minmax').addEventListener('click', () => runNorm('minmax'));
    container.querySelector('#norm-zscore').addEventListener('click', () => runNorm('zscore'));
    container.querySelector('#norm-dec').addEventListener('click', () => runNorm('decimal'));
    runNorm('minmax');
  }

  // 11. IQR SOLVER
  renderIQR(container) {
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">IQR &amp; Outlier Detection Engine</h3>
        <p style="font-size: 12px; color: var(--text-secondary);">Values: 12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65 (notice 65 outlier)</p>
        <button id="iqr-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Calculate Quartiles &amp; Fences</button>
        <div id="iqr-result" style="margin-top: 14px;"></div>
      </div>
    `;

    const solve = () => {
      const values = [12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65];
      const res = NumericalEngine.iqr(values);
      container.querySelector('#iqr-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div>Q1: ${res.q1} | Median (Q2): ${res.median} | Q3: ${res.q3}</div>
          <div style="color: #38bdf8; margin-top: 4px;">IQR (Q3 - Q1) = ${res.iqr}</div>
          <div style="margin-top: 6px;">Lower Fence [Q1 - 1.5*IQR]: ${res.lowerFence}</div>
          <div>Upper Fence [Q3 + 1.5*IQR]: ${res.upperFence}</div>
          <div style="margin-top: 10px; color: #f43f5e; font-weight: bold;">
            Identified Outliers: ${res.outliers.length > 0 ? res.outliers.join(', ') : 'None'}
          </div>
        </div>
      `;
    };

    container.querySelector('#iqr-solve').addEventListener('click', solve);
    solve();
  }

  // 12. EVALUATION METRICS SOLVER
  renderMetrics(container) {
    container.innerHTML = `
      <div class="space-y-4">
        <h3 style="font-size: 16px; font-weight: 800; color: #f59e0b;">Classifier Evaluation Metrics &amp; Confusion Matrix</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
          <div><label style="font-size: 11px;">True Positives (TP):</label><input type="number" id="m-tp" value="85" style="width: 100%; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px;"></div>
          <div><label style="font-size: 11px;">True Negatives (TN):</label><input type="number" id="m-tn" value="90" style="width: 100%; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px;"></div>
          <div><label style="font-size: 11px;">False Positives (FP):</label><input type="number" id="m-fp" value="10" style="width: 100%; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px;"></div>
          <div><label style="font-size: 11px;">False Negatives (FN):</label><input type="number" id="m-fn" value="15" style="width: 100%; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px;"></div>
        </div>
        <button id="m-solve" style="padding: 10px 20px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">⚡ Compute Accuracy, Precision, Recall, F1</button>
        <div id="m-result" style="margin-top: 14px;"></div>
      </div>
    `;

    const solve = () => {
      const tp = parseInt(container.querySelector('#m-tp').value) || 0;
      const tn = parseInt(container.querySelector('#m-tn').value) || 0;
      const fp = parseInt(container.querySelector('#m-fp').value) || 0;
      const fn = parseInt(container.querySelector('#m-fn').value) || 0;

      const res = NumericalEngine.evaluationMetrics({ tp, tn, fp, fn });
      container.querySelector('#m-result').innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; font-family: monospace; font-size: 12px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div><strong>Accuracy:</strong> <span style="color: #10b981;">${res.percentages.accuracy}</span></div>
            <div><strong>Precision:</strong> <span style="color: #38bdf8;">${res.percentages.precision}</span></div>
            <div><strong>Recall / Sensitivity:</strong> <span style="color: #f59e0b;">${res.percentages.recall}</span></div>
            <div><strong>F1-Score:</strong> <span style="color: #c084fc;">${res.percentages.f1Score}</span></div>
          </div>
        </div>
      `;
    };

    container.querySelector('#m-solve').addEventListener('click', solve);
    solve();
  }
}
