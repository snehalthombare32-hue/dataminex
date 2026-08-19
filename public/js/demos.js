// DataMineX - Guided Interactive Educational Live Demos

import { renderGuidance } from './guidedMode.js';

// ETL DEMO STATE
const etlState = {
  step: 1,
  datasetSelected: 'sales-log',
  rules: {
    dedup: false,
    removeNull: false
  },
  data: [
    { txId: 101, customer: "Alice", city: "New York", product: "Laptop", amount: 1200, date: "2026-08-01" },
    { txId: 102, customer: "Bob", city: "Los Angeles", product: "Phone", amount: 800, date: "2026-08-02" },
    { txId: 101, customer: "Alice", city: "New York", product: "Laptop", amount: 1200, date: "2026-08-01" }, // Duplicate
    { txId: 103, customer: "", city: "Chicago", product: "Tablet", amount: null, date: "2026-08-03" },      // Missing Customer/Amount
    { txId: 104, customer: "Charlie", city: "Chicago", product: "Phone", amount: 800, date: "2026-08-04" },
    { txId: 105, customer: "Dave", city: "New York", product: "Laptop", amount: null, date: "2026-08-05" }   // Missing Amount
  ]
};

// K-MEANS STATE
const kmeansState = {
  step: 1,
  points: [],
  centroids: [],
  maxCentroids: 3,
  colors: ['#ef4444', '#10b981', '#3b82f6'], // Red, Emerald, Indigo
  iterations: 0,
  converged: false
};

// OLAP STATE
const olapState = {
  step: 1,
  currentOperation: 'none',
  data: [
    { Quarter: "Q1", City: "New York", Product: "Laptops", Sales: 120 },
    { Quarter: "Q1", City: "New York", Product: "Phones", Sales: 90 },
    { Quarter: "Q1", City: "Chicago", Product: "Laptops", Sales: 80 },
    { Quarter: "Q1", City: "Chicago", Product: "Phones", Sales: 110 },
    { Quarter: "Q2", City: "New York", Product: "Laptops", Sales: 140 },
    { Quarter: "Q2", City: "New York", Product: "Phones", Sales: 95 },
    { Quarter: "Q2", City: "Chicago", Product: "Laptops", Sales: 85 },
    { Quarter: "Q2", City: "Chicago", Product: "Phones", Sales: 115 }
  ]
};

// ==========================================
// 1. ETL PIPELINE DEMO
// ==========================================
export function initETLDemo(containerSelector, isGuidedMode, onComplete) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  etlState.step = 1;
  etlState.rules.dedup = false;
  etlState.rules.removeNull = false;
  
  function render() {
    let sidebarGuidance = "";
    if (isGuidedMode) {
      let stepKey = "";
      if (etlState.step === 1) stepKey = "etl-dataset";
      else if (etlState.step === 2) stepKey = "etl-extract";
      else if (etlState.step === 3) stepKey = "etl-transform";
      else if (etlState.step === 4) stepKey = "etl-load";
      else if (etlState.step === 5) stepKey = "etl-warehouse";
      
      sidebarGuidance = `<div id="etl-guidance-container" style="margin-bottom: 24px;"></div>`;
      setTimeout(() => renderGuidance("etl-guidance-container", stepKey), 50);
    }
    
    container.innerHTML = `
      <div class="welcome-section">
        <h1 class="welcome-title">Guided ETL Pipeline Demo</h1>
        <p class="welcome-subtitle">Extract, Transform, and Load transaction logs into a multidimensional warehouse schema.</p>
      </div>
      
      ${sidebarGuidance}
      
      <div class="demo-step-indicator">
        <div class="step-node ${etlState.step >= 1 ? 'completed' : ''} ${etlState.step === 1 ? 'current' : ''}">
          <div class="step-node-circle">1</div>
          <span>Dataset</span>
        </div>
        <div class="step-arrow"></div>
        <div class="step-node ${etlState.step >= 2 ? 'completed' : ''} ${etlState.step === 2 ? 'current' : ''}">
          <div class="step-node-circle">2</div>
          <span>Extract</span>
        </div>
        <div class="step-arrow"></div>
        <div class="step-node ${etlState.step >= 3 ? 'completed' : ''} ${etlState.step === 3 ? 'current' : ''}">
          <div class="step-node-circle">3</div>
          <span>Transform</span>
        </div>
        <div class="step-arrow"></div>
        <div class="step-node ${etlState.step >= 4 ? 'completed' : ''} ${etlState.step === 4 ? 'current' : ''}">
          <div class="step-node-circle">4</div>
          <span>Load</span>
        </div>
        <div class="step-arrow"></div>
        <div class="step-node ${etlState.step >= 5 ? 'completed' : ''} ${etlState.step === 5 ? 'current' : ''}">
          <div class="step-node-circle">5</div>
          <span>Warehouse</span>
        </div>
      </div>
      
      <div class="demo-workspace">
        <div id="etl-workspace-content"></div>
      </div>
    `;
    
    renderStepContent();
  }
  
  function renderStepContent() {
    const ws = container.querySelector('#etl-workspace-content');
    
    if (etlState.step === 1) {
      ws.innerHTML = `
        <h3 style="margin-bottom: 12px;">Step 1: Choose Dataset Source</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">We have located raw transaction logs in the OLTP database. Select the source dataset below to inspect its attributes.</p>
        
        <div class="form-group" style="max-width: 300px; margin-bottom: 24px;">
          <label>Source Database Table</label>
          <select class="form-input" id="etl-db-select">
            <option value="sales-log">Store_Daily_Sales_Log (Dirty)</option>
          </select>
        </div>
        
        <h4 style="margin-bottom: 8px; font-size: 14px; text-transform: uppercase; color: var(--text-muted);">Source File Preview: Store_Daily_Sales_Log</h4>
        <div class="table-scroll-container" style="border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-primary);">
          <table class="theory-table">
            <thead>
              <tr>
                <th>Tx_ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${etlState.data.map(d => `
                <tr class="${!d.customer || d.amount === null ? 'incorrect' : ''}">
                  <td>${d.txId}</td>
                  <td>${d.customer || '<em>[NULL]</em>'}</td>
                  <td>${d.city}</td>
                  <td>${d.product}</td>
                  <td>${d.amount !== null ? '$' + d.amount : '<em>[NULL]</em>'}</td>
                  <td>${d.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 24px; text-align: right;">
          <button class="btn btn-primary" id="etl-next-1">Select and Extract &rarr;</button>
        </div>
      `;
      
      document.getElementById('etl-next-1').addEventListener('click', () => {
        etlState.step = 2;
        render();
      });
    } 
    
    else if (etlState.step === 2) {
      ws.innerHTML = `
        <h3 style="margin-bottom: 12px;">Step 2: Extract Data into Staging Area</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Extracting raw rows from source database. The extraction parses data into a clean text file staging format inside the buffer memory.</p>
        
        <div style="background-color: var(--bg-primary); border-radius: var(--radius-md); padding: 24px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <div style="font-size: 14px; font-weight: 700; color: var(--color-indigo); text-transform: uppercase;">Staging Memory Loading...</div>
          <div class="progress-bar-track" style="max-width: 320px;">
            <div class="progress-bar-fill" style="width: 100%; transition: width 1s ease;"></div>
          </div>
          <p style="font-size: 13px; color: var(--text-muted);">${etlState.data.length} records successfully buffered in staging area memory.</p>
        </div>
        
        <div style="margin-top: 24px; text-align: right;">
          <button class="btn btn-primary" id="etl-next-2">Go to Transform &rarr;</button>
        </div>
      `;
      
      document.getElementById('etl-next-2').addEventListener('click', () => {
        etlState.step = 3;
        render();
      });
    } 
    
    else if (etlState.step === 3) {
      // Calculate data rows based on selected check rules
      let filteredData = [...etlState.data];
      if (etlState.rules.dedup) {
        const ids = new Set();
        filteredData = filteredData.filter(d => {
          if (ids.has(d.txId)) return false;
          ids.add(d.txId);
          return true;
        });
      }
      if (etlState.rules.removeNull) {
        filteredData = filteredData.filter(d => d.customer !== "" && d.amount !== null);
      }
      
      ws.innerHTML = `
        <h3 style="margin-bottom: 12px;">Step 3: Define Transformation Rules</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Apply transformations to sanitize and clean your operational dataset before committing it to database storage.</p>
        
        <div style="display: grid; grid-template-columns: 240px 1fr; gap: 24px;">
          <!-- Rules Selection Sidebar -->
          <div style="background: var(--bg-primary); padding: 18px; border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 16px;">
            <div style="font-weight: 700; font-size: 14px; text-transform: uppercase; color: var(--text-muted);">Rules Checklist</div>
            
            <label class="choice-checkbox-label ${etlState.rules.dedup ? 'selected' : ''}" style="margin: 0; padding: 10px;">
              <input type="checkbox" id="rule-dedup" ${etlState.rules.dedup ? 'checked' : ''}>
              <span>Remove Duplicates</span>
            </label>
            
            <label class="choice-checkbox-label ${etlState.rules.removeNull ? 'selected' : ''}" style="margin: 0; padding: 10px;">
              <input type="checkbox" id="rule-null" ${etlState.rules.removeNull ? 'checked' : ''}>
              <span>Filter Missing Values</span>
            </label>
          </div>
          
          <!-- Data preview window -->
          <div>
            <h4 style="margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: var(--text-muted);">Staging Area Preview (${filteredData.length} records remain)</h4>
            <div class="table-scroll-container" style="border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-primary); max-height: 220px; overflow-y: auto;">
              <table class="theory-table">
                <thead>
                  <tr>
                    <th>Tx_ID</th>
                    <th>Customer</th>
                    <th>City</th>
                    <th>Product</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredData.map(d => `
                    <tr>
                      <td>${d.txId}</td>
                      <td>${d.customer || '<em>[NULL]</em>'}</td>
                      <td>${d.city}</td>
                      <td>${d.product}</td>
                      <td>$${d.amount !== null ? d.amount : 'NULL'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 24px; text-align: right;">
          <button class="btn btn-primary" id="etl-next-3">Execute and Load &rarr;</button>
        </div>
      `;
      
      const checkDedup = document.getElementById('rule-dedup');
      const checkNull = document.getElementById('rule-null');
      
      checkDedup.addEventListener('change', (e) => {
        etlState.rules.dedup = e.target.checked;
        renderStepContent();
      });
      
      checkNull.addEventListener('change', (e) => {
        etlState.rules.removeNull = e.target.checked;
        renderStepContent();
      });
      
      document.getElementById('etl-next-3').addEventListener('click', () => {
        etlState.step = 4;
        render();
      });
    } 
    
    else if (etlState.step === 4) {
      ws.innerHTML = `
        <h3 style="margin-bottom: 12px;">Step 4: Load into Star Schema Tables</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">The staging pipeline partitions clean columns into a central Fact Sales table and linked Customer/Product Dimension tables.</p>
        
        <div class="etl-tables-grid">
          <!-- Fact Table -->
          <div class="etl-table-card">
            <h4 style="color: var(--color-indigo);">📊 Fact_Sales (Fact)</h4>
            <div class="table-scroll-container" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 11px;">
              <table class="theory-table">
                <thead>
                  <tr>
                    <th>Sale_ID (PK)</th>
                    <th>Customer_ID (FK)</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>501</td><td>$1200</td><td>2026-08-01</td></tr>
                  <tr><td>2</td><td>502</td><td>$800</td><td>2026-08-02</td></tr>
                  <tr><td>3</td><td>503</td><td>$800</td><td>2026-08-04</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Dimensions -->
          <div class="etl-table-card">
            <h4 style="color: var(--color-emerald);">🏢 Dim_Customers (Dimension)</h4>
            <div class="table-scroll-container" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 11px;">
              <table class="theory-table">
                <thead>
                  <tr>
                    <th>Customer_ID (PK)</th>
                    <th>Name</th>
                    <th>City</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>501</td><td>Alice</td><td>New York</td></tr>
                  <tr><td>502</td><td>Bob</td><td>Los Angeles</td></tr>
                  <tr><td>503</td><td>Charlie</td><td>Chicago</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 24px; text-align: right;">
          <button class="btn btn-primary" id="etl-next-4">Explore Data Warehouse &rarr;</button>
        </div>
      `;
      
      document.getElementById('etl-next-4').addEventListener('click', () => {
        etlState.step = 5;
        render();
      });
    } 
    
    else if (etlState.step === 5) {
      ws.innerHTML = `
        <h3 style="margin-bottom: 12px;">Step 5: View Warehouse Queries</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">ETL Loading is complete! Test performance by running a mock SQL command on the completed star schema.</p>
        
        <div style="background-color: var(--bg-primary); padding: 18px; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 20px;">
          <code style="font-family: monospace; font-size: 13px; color: var(--color-purple);">
            SELECT c.City, SUM(s.Amount) as TotalSales<br>
            FROM Fact_Sales s<br>
            JOIN Dim_Customers c ON s.Customer_ID = c.Customer_ID<br>
            GROUP BY c.City;
          </code>
        </div>
        
        <button class="btn btn-outline" id="etl-query-btn" style="margin-bottom: 20px;">Execute Analytical Query</button>
        
        <div id="etl-query-output" class="table-scroll-container hidden" style="border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-primary);">
          <table class="theory-table">
            <thead>
              <tr>
                <th>City</th>
                <th>TotalSales</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>New York</td><td>$1200</td></tr>
              <tr><td>Los Angeles</td><td>$800</td></tr>
              <tr><td>Chicago</td><td>$800</td></tr>
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 24px; text-align: right;">
          <button class="btn btn-success" id="etl-finish">Complete ETL Demo &rarr;</button>
        </div>
      `;
      
      const qBtn = document.getElementById('etl-query-btn');
      const qOutput = document.getElementById('etl-query-output');
      qBtn.addEventListener('click', () => {
        qOutput.classList.remove('hidden');
        qBtn.disabled = true;
      });
      
      document.getElementById('etl-finish').addEventListener('click', () => {
        onComplete();
      });
    }
  }
  
  render();
}

// ==========================================
// 2. K-MEANS CLUSTERING DEMO
// ==========================================
export function initKMeansDemo(containerSelector, isGuidedMode, onComplete) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  kmeansState.step = 1;
  kmeansState.points = [];
  kmeansState.centroids = [];
  kmeansState.iterations = 0;
  kmeansState.converged = false;
  
  function render() {
    let sidebarGuidance = "";
    if (isGuidedMode) {
      let stepKey = "";
      if (kmeansState.step === 1) stepKey = "kmeans-points";
      else if (kmeansState.step === 2) stepKey = "kmeans-centroids";
      else if (kmeansState.step === 3 && !kmeansState.converged) stepKey = "kmeans-run";
      else stepKey = "kmeans-converge";
      
      sidebarGuidance = `<div id="kmeans-guidance-container" style="margin-bottom: 24px;"></div>`;
      setTimeout(() => renderGuidance("kmeans-guidance-container", stepKey), 50);
    }
    
    container.innerHTML = `
      <div class="welcome-section">
        <h1 class="welcome-title">Guided K-Means Clustering</h1>
        <p class="welcome-subtitle">Create coordinates and watch centroids calculate clusters interactively.</p>
      </div>
      
      ${sidebarGuidance}
      
      <div class="demo-workspace">
        <div class="kmeans-canvas-container">
          <div class="kmeans-plot" id="kmeans-grid">
            <!-- Points and Centroids will be drawn here -->
          </div>
          
          <div id="kmeans-controls-panel" style="display: flex; gap: 16px; align-items: center;">
            <!-- Rendered buttons dynamically -->
          </div>
        </div>
      </div>
    `;
    
    initGridListeners();
    updateControls();
    redrawCanvas();
  }
  
  function initGridListeners() {
    const grid = container.querySelector('#kmeans-grid');
    grid.addEventListener('click', (e) => {
      if (kmeansState.step !== 1) return;
      
      const rect = grid.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      kmeansState.points.push({ x, y, cluster: -1 });
      redrawCanvas();
      updateControls();
    });
  }
  
  function redrawCanvas() {
    const grid = container.querySelector('#kmeans-grid');
    if (!grid) return;
    
    // Clear previous points/centroids
    grid.querySelectorAll('.kmeans-point, .kmeans-centroid').forEach(el => el.remove());
    
    // Draw points
    kmeansState.points.forEach(p => {
      const pDiv = document.createElement('div');
      pDiv.className = `kmeans-point ${p.cluster === -1 ? 'point-unassigned' : ''}`;
      pDiv.style.left = `${p.x}%`;
      pDiv.style.top = `${p.y}%`;
      
      if (p.cluster !== -1) {
        pDiv.style.backgroundColor = kmeansState.colors[p.cluster];
      }
      grid.appendChild(pDiv);
    });
    
    // Draw centroids
    kmeansState.centroids.forEach((c, idx) => {
      const cDiv = document.createElement('div');
      cDiv.className = 'kmeans-centroid';
      cDiv.style.left = `${c.x}%`;
      cDiv.style.top = `${c.y}%`;
      cDiv.style.backgroundColor = kmeansState.colors[idx];
      cDiv.innerHTML = `<span style="color: white; font-size: 9px; font-weight: 800;">C${idx+1}</span>`;
      grid.appendChild(cDiv);
    });
  }
  
  function updateControls() {
    const ctrlPanel = container.querySelector('#kmeans-controls-panel');
    if (!ctrlPanel) return;
    
    if (kmeansState.step === 1) {
      ctrlPanel.innerHTML = `
        <span style="font-size: 13px; color: var(--text-secondary);">Placed: <strong>${kmeansState.points.length}</strong> points (Min 8 recommended)</span>
        <button class="btn btn-primary" id="kmeans-btn-init" ${kmeansState.points.length < 5 ? 'disabled' : ''}>Initialize Centroids (K=3)</button>
      `;
      
      document.getElementById('kmeans-btn-init').addEventListener('click', () => {
        // Place initial centroids randomly on existing point regions
        kmeansState.centroids = [];
        for (let i = 0; i < kmeansState.maxCentroids; i++) {
          const randPoint = kmeansState.points[Math.floor(Math.random() * kmeansState.points.length)];
          // Slightly offset to show movement
          kmeansState.centroids.push({
            x: randPoint.x + (Math.random() - 0.5) * 10,
            y: randPoint.y + (Math.random() - 0.5) * 10
          });
        }
        
        kmeansState.step = 2;
        render();
      });
    } 
    
    else if (kmeansState.step === 2) {
      ctrlPanel.innerHTML = `
        <button class="btn btn-outline" id="kmeans-btn-reset">Reset</button>
        <button class="btn btn-primary" id="kmeans-btn-iterate">Run First Iteration &rarr;</button>
      `;
      
      document.getElementById('kmeans-btn-reset').addEventListener('click', () => {
        kmeansState.step = 1;
        kmeansState.points = [];
        kmeansState.centroids = [];
        render();
      });
      
      document.getElementById('kmeans-btn-iterate').addEventListener('click', () => {
        kmeansState.step = 3;
        runIteration();
      });
    } 
    
    else if (kmeansState.step === 3) {
      if (kmeansState.converged) {
        ctrlPanel.innerHTML = `
          <span style="font-size: 13px; color: var(--color-emerald); font-weight: 700;">Converged in ${kmeansState.iterations} steps!</span>
          <button class="btn btn-success" id="kmeans-btn-finish">Complete Demo &rarr;</button>
        `;
        
        document.getElementById('kmeans-btn-finish').addEventListener('click', onComplete);
      } else {
        ctrlPanel.innerHTML = `
          <button class="btn btn-outline" id="kmeans-btn-reset">Reset</button>
          <span style="font-size: 13px; color: var(--text-secondary);">Iteration: <strong>${kmeansState.iterations}</strong></span>
          <button class="btn btn-primary" id="kmeans-btn-run-iter">Run Next Iteration &rarr;</button>
        `;
        
        document.getElementById('kmeans-btn-reset').addEventListener('click', () => {
          kmeansState.step = 1;
          kmeansState.points = [];
          kmeansState.centroids = [];
          render();
        });
        
        document.getElementById('kmeans-btn-run-iter').addEventListener('click', () => {
          runIteration();
        });
      }
    }
  }
  
  function runIteration() {
    kmeansState.iterations++;
    
    // 1. Assign points to nearest centroid
    let changed = false;
    kmeansState.points.forEach(p => {
      let minDist = Infinity;
      let closestIdx = -1;
      
      kmeansState.centroids.forEach((c, idx) => {
        // Euclidean distance square
        const dist = Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });
      
      if (p.cluster !== closestIdx) {
        p.cluster = closestIdx;
        changed = true;
      }
    });
    
    // 2. Recompute centroids
    const newCentroids = [];
    for (let i = 0; i < kmeansState.maxCentroids; i++) {
      const assignedPoints = kmeansState.points.filter(p => p.cluster === i);
      if (assignedPoints.length > 0) {
        const sumX = assignedPoints.reduce((acc, curr) => acc + curr.x, 0);
        const sumY = assignedPoints.reduce((acc, curr) => acc + curr.y, 0);
        newCentroids.push({
          x: sumX / assignedPoints.length,
          y: sumY / assignedPoints.length
        });
      } else {
        // Keep old position if no points assigned
        newCentroids.push({ ...kmeansState.centroids[i] });
      }
    }
    
    // Check for convergence: centroids don't move
    let centroidsMoved = false;
    for (let i = 0; i < kmeansState.maxCentroids; i++) {
      const dist = Math.sqrt(Math.pow(newCentroids[i].x - kmeansState.centroids[i].x, 2) + Math.pow(newCentroids[i].y - kmeansState.centroids[i].y, 2));
      if (dist > 0.5) { // Small threshold
        centroidsMoved = true;
      }
    }
    
    kmeansState.centroids = newCentroids;
    
    if (!centroidsMoved || kmeansState.iterations > 10) {
      kmeansState.converged = true;
    }
    
    redrawCanvas();
    updateControls();
    // Render guidance again if converged to show step 4 description
    if (kmeansState.converged) {
      render();
    }
  }
  
  render();
}

// ==========================================
// 3. OLAP OPERATIONS DEMO
// ==========================================
export function initOLAPDemo(containerSelector, isGuidedMode, onComplete) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  olapState.step = 1;
  olapState.currentOperation = 'none';
  
  function render() {
    let sidebarGuidance = "";
    if (isGuidedMode) {
      let stepKey = "olap-cube";
      if (olapState.currentOperation === 'slice') stepKey = "olap-slice";
      else if (olapState.currentOperation === 'dice') stepKey = "olap-dice";
      else if (olapState.currentOperation === 'rollup') stepKey = "olap-rollup";
      else if (olapState.currentOperation === 'drilldown') stepKey = "olap-drilldown";
      else if (olapState.currentOperation === 'pivot') stepKey = "olap-pivot";
      
      sidebarGuidance = `<div id="olap-guidance-container" style="margin-bottom: 24px;"></div>`;
      setTimeout(() => renderGuidance("olap-guidance-container", stepKey), 50);
    }
    
    container.innerHTML = `
      <div class="welcome-section">
        <h1 class="welcome-title">Guided OLAP Cube Operations</h1>
        <p class="welcome-subtitle">Interact with a sales cube to understand slicing, dicing, roll-up, drill-down, and pivot actions.</p>
      </div>
      
      ${sidebarGuidance}
      
      <div class="demo-workspace">
        <div class="olap-cube-workspace">
          <!-- Control Panel -->
          <div class="olap-controls">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; display: block;">OLAP Methods</span>
            
            <button class="btn btn-block ${olapState.currentOperation === 'none' ? 'btn-primary' : 'btn-outline'}" id="olap-btn-reset">1. Base Cube</button>
            <button class="btn btn-block ${olapState.currentOperation === 'slice' ? 'btn-primary' : 'btn-outline'}" id="olap-btn-slice">2. Slice (Q1)</button>
            <button class="btn btn-block ${olapState.currentOperation === 'dice' ? 'btn-primary' : 'btn-outline'}" id="olap-btn-dice">3. Dice</button>
            <button class="btn btn-block ${olapState.currentOperation === 'rollup' ? 'btn-primary' : 'btn-outline'}" id="olap-btn-rollup">4. Roll-Up</button>
            <button class="btn btn-block ${olapState.currentOperation === 'drilldown' ? 'btn-primary' : 'btn-outline'}" id="olap-btn-drilldown">5. Drill-Down</button>
            <button class="btn btn-block ${olapState.currentOperation === 'pivot' ? 'btn-primary' : 'btn-outline'}" id="olap-btn-pivot">6. Pivot</button>
            
            <div style="margin-top: 24px;">
              <button class="btn btn-success btn-block" id="olap-btn-finish">Complete Demo &rarr;</button>
            </div>
          </div>
          
          <!-- Visual Display -->
          <div class="olap-display">
            <h3 id="olap-view-title" style="color: var(--color-indigo);">Base Sales Cube</h3>
            <p id="olap-view-desc" style="font-size: 13.5px; color: var(--text-secondary);">Showing raw aggregated records across all dimensions (Time, Location, Product).</p>
            
            <div id="olap-table-renderer">
              <!-- Render dynamic table -->
            </div>
          </div>
        </div>
      </div>
    `;
    
    renderOlapTable();
    initOlapListeners();
  }
  
  function renderOlapTable() {
    const target = container.querySelector('#olap-table-renderer');
    const titleEl = container.querySelector('#olap-view-title');
    const descEl = container.querySelector('#olap-view-desc');
    
    let headers = [];
    let rows = [];
    
    if (olapState.currentOperation === 'none') {
      titleEl.innerText = "Base Multi-dimensional View";
      descEl.innerText = "Aggregate records. Dimensions: Quarter, City, Product.";
      headers = ["Quarter", "City", "Product", "Sales ($1000s)"];
      rows = olapState.data.map(d => [d.Quarter, d.City, d.Product, `$${d.Sales}k`]);
    } 
    
    else if (olapState.currentOperation === 'slice') {
      titleEl.innerText = "Slice Operation (Locked to: Q1)";
      descEl.innerText = "Slicing slices the cube at a single dimension key (Quarter = Q1). Restricting data to a 2D matrix.";
      headers = ["City", "Product", "Sales ($1000s)"];
      // Filter only Q1
      rows = olapState.data
        .filter(d => d.Quarter === "Q1")
        .map(d => [d.City, d.Product, `$${d.Sales}k`]);
    } 
    
    else if (olapState.currentOperation === 'dice') {
      titleEl.innerText = "Dice Operation (Chicago/New York & Laptops)";
      descEl.innerText = "Dicing isolates a subset of the cube by selecting ranges/filters across multiple axes.";
      headers = ["Quarter", "City", "Product", "Sales ($1000s)"];
      // Filter City NY/Chicago and Product Laptops
      rows = olapState.data
        .filter(d => (d.City === "New York" || d.City === "Chicago") && d.Product === "Laptops")
        .map(d => [d.Quarter, d.City, d.Product, `$${d.Sales}k`]);
    } 
    
    else if (olapState.currentOperation === 'rollup') {
      titleEl.innerText = "Roll-Up Operation (Summarized by: Country)";
      descEl.innerText = "Roll-up aggregates detail rows up the dimension hierarchy. Here, individual cities are rolled up into national level aggregates (USA).";
      headers = ["Quarter", "Country", "Product", "Total Sales ($1000s)"];
      // Group by Quarter and Product, collapse City to 'USA'
      const rolled = {};
      olapState.data.forEach(d => {
        const key = `${d.Quarter}-${d.Product}`;
        if (!rolled[key]) {
          rolled[key] = { Quarter: d.Quarter, Country: "USA", Product: d.Product, Sales: 0 };
        }
        rolled[key].Sales += d.Sales;
      });
      rows = Object.values(rolled).map(d => [d.Quarter, d.Country, d.Product, `$${d.Sales}k`]);
    } 
    
    else if (olapState.currentOperation === 'drilldown') {
      titleEl.innerText = "Drill-Down Operation (Time Quarter -> Months)";
      descEl.innerText = "Drill-down breaks aggregated ranges into specific segments (expanding Quarter 1 into Jan/Feb/Mar values).";
      headers = ["Month", "City", "Product", "Sales ($1000s)"];
      // Mock month breakdown for Q1
      rows = [
        ["Jan", "New York", "Laptops", "$45k"],
        ["Feb", "New York", "Laptops", "$40k"],
        ["Mar", "New York", "Laptops", "$35k"],
        ["Jan", "Chicago", "Phones", "$30k"],
        ["Feb", "Chicago", "Phones", "$45k"],
        ["Mar", "Chicago", "Phones", "$35k"]
      ];
    } 
    
    else if (olapState.currentOperation === 'pivot') {
      titleEl.innerText = "Pivot Operation (Rotated Axes)";
      descEl.innerText = "Pivoting rotates axes (swapping rows/columns layout) to display the tabular values from a different perspective.";
      // Headers: Product as left, Cities as columns
      headers = ["Product / City", "New York Sales", "Chicago Sales"];
      // Aggregate sales by Product & City across all quarters
      const agg = {
        Laptops: { NY: 0, Chicago: 0 },
        Phones: { NY: 0, Chicago: 0 }
      };
      olapState.data.forEach(d => {
        if (d.City === "New York") agg[d.Product].NY += d.Sales;
        if (d.City === "Chicago") agg[d.Product].Chicago += d.Sales;
      });
      rows = [
        ["Laptops", `$${agg.Laptops.NY}k`, `$${agg.Laptops.Chicago}k`],
        ["Phones", `$${agg.Phones.NY}k`, `$${agg.Phones.Chicago}k`]
      ];
    }
    
    target.innerHTML = `
      <div class="table-scroll-container" style="border: 1px solid var(--border-color); border-radius: var(--radius-md);">
        <table class="theory-table">
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                ${r.map(val => `<td>${val}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  function initOlapListeners() {
    document.getElementById('olap-btn-reset').addEventListener('click', () => {
      olapState.currentOperation = 'none';
      render();
    });
    document.getElementById('olap-btn-slice').addEventListener('click', () => {
      olapState.currentOperation = 'slice';
      render();
    });
    document.getElementById('olap-btn-dice').addEventListener('click', () => {
      olapState.currentOperation = 'dice';
      render();
    });
    document.getElementById('olap-btn-rollup').addEventListener('click', () => {
      olapState.currentOperation = 'rollup';
      render();
    });
    document.getElementById('olap-btn-drilldown').addEventListener('click', () => {
      olapState.currentOperation = 'drilldown';
      render();
    });
    document.getElementById('olap-btn-pivot').addEventListener('click', () => {
      olapState.currentOperation = 'pivot';
      render();
    });
    document.getElementById('olap-btn-finish').addEventListener('click', () => {
      onComplete();
    });
  }
  
  render();
}
