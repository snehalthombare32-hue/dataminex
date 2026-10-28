// DataMineX - Complete Dedicated Board-Style Numerical Solution System
// 100% Free & Local-First In-Browser Numerical Engine Solver for ALL Data Warehousing & Data Mining Algorithms

import { NumericalEngine } from './numericalEngine.js';
import { ReportExporter } from './reportExporter.js';
import { generateSolutionSteps } from './solverSteps.js';
import { DatasetSession } from './datasetSession.js';

export class NumericalSolver {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.currentAlgo = 'kmeans';
    this.activeInputMode = 'upload'; // 'upload' | 'type' | 'paste'
    this.uploadedFile = null;
    this.extractedText = '';
    this.extractedValues = '';
    this.detectedSubject = 'Data Mining';
    this.detectedAlgoName = 'K-Means Clustering';
    this.activeSolutionTab = 'detailed'; // 'detailed' | 'exam' | 'practice'
    this.activeMainSection = 'exam'; // 'pipeline' | 'exam'
    this.savedSolutions = this.loadSavedSolutions();

    // Check if URL specifies a particular stage from sidebar
    const hash = window.location.hash || '';
    const match = hash.match(/stage=([a-z]+)/);
    if (match && ['dataset', 'preprocessing', 'classification', 'clustering', 'arm'].includes(match[1])) {
      this._vlState.activeTab = match[1];
      this.activeMainSection = 'pipeline';
    }

    // Hash change listener for sidebar stage clicks while already on page
    this._onHashChange = () => {
      const h = window.location.hash || '';
      const m = h.match(/stage=([a-z]+)/);
      if (m && ['dataset', 'preprocessing', 'classification', 'clustering', 'arm'].includes(m[1])) {
        this._vlState.activeTab = m[1];
        this.activeMainSection = 'pipeline';
        this.render();
      }
    };
    window.addEventListener('hashchange', this._onHashChange);

    this.init();
  }

  loadSavedSolutions() {
    try {
      const saved = localStorage.getItem('dataminex_solver_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveSolutionToHistory(algoName, inputData, solutionSummary) {
    try {
      const item = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        algo: this.currentAlgo,
        name: algoName,
        input: inputData,
        summary: solutionSummary
      };
      this.savedSolutions.unshift(item);
      if (this.savedSolutions.length > 20) this.savedSolutions.pop();
      localStorage.setItem('dataminex_solver_history', JSON.stringify(this.savedSolutions));
    } catch (e) {
      console.warn("Could not save to history:", e);
    }
  }

  deleteSavedSolution(id) {
    this.savedSolutions = this.savedSolutions.filter(s => s.id !== id);
    try {
      localStorage.setItem('dataminex_solver_history', JSON.stringify(this.savedSolutions));
    } catch (e) {}
    this.renderHistoryDrawer();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  setAlgo(algo) {
    this.currentAlgo = algo;
    this.render();
  }

  detectSubjectAndAlgorithm(text) {
    const lower = text.toLowerCase();
    
    // Data Warehousing Topics
    if (lower.includes('roll-up') || lower.includes('rollup') || lower.includes('drill-down') || lower.includes('slice') || lower.includes('dice') || lower.includes('pivot') || lower.includes('data cube') || lower.includes('cuboid') || lower.includes('olap')) {
      return { subject: 'Data Warehousing', algo: 'olap', name: 'OLAP Operations & Data Cube' };
    }
    
    // Data Mining Syllabus Topics
    if (lower.includes('k-medoid') || lower.includes('medoid') || lower.includes('pam')) {
      return { subject: 'Data Mining', algo: 'kmedoids', name: 'K-Medoids (PAM Clustering)' };
    }
    if (lower.includes('k-mean') || lower.includes('kmeans') || lower.includes('centroid') || lower.includes('cluster center') || lower.includes('clusters')) {
      return { subject: 'Data Mining', algo: 'kmeans', name: 'K-Means Clustering' };
    }
    if (lower.includes('dendrogram') || lower.includes('single linkage') || lower.includes('complete linkage') || lower.includes('average linkage') || lower.includes('hierarchical') || lower.includes('agglomerative')) {
      return { subject: 'Data Mining', algo: 'hierarchical', name: 'Hierarchical Clustering' };
    }
    if (lower.includes('dbscan') || lower.includes('epsilon') || lower.includes('minpts') || lower.includes('core point') || lower.includes('border point') || lower.includes('noise point')) {
      return { subject: 'Data Mining', algo: 'dbscan', name: 'DBSCAN Density Clustering' };
    }
    if (lower.includes('entropy') || lower.includes('information gain') || lower.includes('decision tree') || lower.includes('id3')) {
      return { subject: 'Data Mining', algo: 'id3', name: 'Decision Tree / ID3' };
    }
    if (lower.includes('prior probability') || lower.includes('likelihood') || lower.includes('posterior') || lower.includes('naive bayes') || lower.includes('bayes')) {
      return { subject: 'Data Mining', algo: 'naivebayes', name: 'Naive Bayes Classifier' };
    }
    if (lower.includes('nearest neighbor') || lower.includes('knn') || lower.includes('k nearest')) {
      return { subject: 'Data Mining', algo: 'knn', name: 'K-Nearest Neighbors (KNN)' };
    }
    if (lower.includes('support') || lower.includes('confidence') || lower.includes('lift') || lower.includes('frequent itemset') || lower.includes('apriori') || lower.includes('association rule')) {
      return { subject: 'Data Mining', algo: 'apriori', name: 'Apriori Association Rule Mining' };
    }
    if (lower.includes('slope') || lower.includes('intercept') || lower.includes('regression equation') || lower.includes('linear regression') || lower.includes('least squares') || lower.includes('ols')) {
      return { subject: 'Data Mining', algo: 'regression', name: 'Linear Regression' };
    }
    if (lower.includes('min-max') || lower.includes('z-score') || lower.includes('decimal scaling') || lower.includes('normalize') || lower.includes('normalization')) {
      return { subject: 'Data Mining', algo: 'normalization', name: 'Feature Normalization' };
    }
    if (lower.includes('binning') || lower.includes('equal-width') || lower.includes('equal-frequency') || lower.includes('bin means') || lower.includes('bin boundaries')) {
      return { subject: 'Data Mining', algo: 'binning', name: 'Data Binning & Smoothing' };
    }
    if (lower.includes('iqr') || lower.includes('q1') || lower.includes('q3') || lower.includes('outlier') || lower.includes('interquartile') || lower.includes('box plot')) {
      return { subject: 'Data Mining', algo: 'iqr', name: 'Outlier Detection (IQR Fences)' };
    }
    if (lower.includes('confusion matrix') || lower.includes('precision') || lower.includes('recall') || lower.includes('f1') || lower.includes('sensitivity') || lower.includes('specificity')) {
      return { subject: 'Data Mining', algo: 'metrics', name: 'Model Evaluation Metrics' };
    }
    
    return { subject: 'Data Mining', algo: 'kmeans', name: 'K-Means Clustering' };
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
        
        <!-- TOP VIEW MODE SWITCHER: Sequential Pipeline vs Exam Question Solver -->
        <div style="display: flex; justify-content: center; gap: 14px; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 18px;">
          <button id="toggle-section-pipeline" style="padding: 12px 24px; font-weight: 800; font-size: 0.95rem; border-radius: 12px; border: 2px solid ${this.activeMainSection === 'pipeline' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeMainSection === 'pipeline' ? '#2563eb' : '#ffffff'}; color: ${this.activeMainSection === 'pipeline' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: ${this.activeMainSection === 'pipeline' ? '0 4px 14px rgba(37,99,235,0.25)' : 'none'}; transition: all 0.2s;">
            <i data-lucide="git-pull-request" style="width: 18px; height: 18px;"></i>
            <span>Sequential Algorithm Pipeline (5 Stages)</span>
            <span style="background: ${this.activeMainSection === 'pipeline' ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; color: ${this.activeMainSection === 'pipeline' ? '#ffffff' : '#64748b'}; padding: 2px 8px; border-radius: 10px; font-size: 0.68rem; font-weight: 700;">Workflow</span>
          </button>
          <button id="toggle-section-exam" style="padding: 12px 24px; font-weight: 800; font-size: 0.95rem; border-radius: 12px; border: 2px solid ${this.activeMainSection === 'exam' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeMainSection === 'exam' ? '#2563eb' : '#ffffff'}; color: ${this.activeMainSection === 'exam' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: ${this.activeMainSection === 'exam' ? '0 4px 14px rgba(37,99,235,0.25)' : 'none'}; transition: all 0.2s;">
            <i data-lucide="calculator" style="width: 18px; height: 18px;"></i>
            <span>University Question Solver &amp; Manual Engines</span>
          </button>
        </div>

        <!-- SECTION 1: SEQUENTIAL DATA MINING ALGORITHM PIPELINE (PRIMARY / DEFAULT) -->
        <div id="vl-section-root" style="display: ${this.activeMainSection === 'pipeline' ? 'block' : 'none'};"></div>

        <!-- SECTION 2: EXAM QUESTION SOLVER & INDIVIDUAL ALGORITHMS (SWITCHABLE) -->
        <div id="exam-section-root" style="display: ${this.activeMainSection === 'exam' ? 'block' : 'none'};">
          <!-- DEDICATED NUMERICAL SOLVER CARD WITH 3 INPUT METHODS -->
          <div class="card upload-solver-card animate-slide-up" style="background: white; border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div></div>
              <button id="btn-toggle-history" class="btn btn-outline btn-sm" style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1;">
                <i data-lucide="history" style="width: 14px; height: 14px;"></i>
                <span>Saved Solutions History (<strong id="history-badge-count">${this.savedSolutions.length}</strong>)</span>
              </button>
            </div>

            <!-- COLLAPSIBLE HISTORY DRAWER -->
            <div id="history-drawer" style="display: none; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <!-- History rendered dynamically -->
            </div>

            <div style="text-align: center; max-width: 650px; margin: 0 auto 20px;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #eff6ff; color: #2563eb; border-radius: 14px; font-size: 1.8rem; margin-bottom: 12px;">
                <i data-lucide="graduation-cap" style="width: 32px; height: 32px;"></i>
              </div>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Universal Exam Question Solver</h2>
              <p style="color: #64748b; font-size: 0.95rem;">
                Upload, type, or paste any Data Warehousing or Data Mining university numerical question. Generates 100% authentic, board-style derivations with step-by-step state controls and dynamic visualizations.
              </p>
            </div>

            <!-- SHARED SESSION DATASET WORKFLOW BANNER -->
            ${(() => {
              const ds = typeof DatasetSession !== 'undefined' ? DatasetSession.getDataset() : null;
              if (!ds || !ds.rows || ds.rows.length === 0) return '';
              const compat = DatasetSession.checkCompatibility(this.currentAlgo, ds);
              return `
                <div id="solver-session-dataset-banner" style="background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 1.5px solid #93c5fd; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; box-shadow: 0 2px 8px rgba(37,99,235,0.06);">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                      <i data-lucide="file-spreadsheet" style="width: 22px; height: 22px;"></i>
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <strong style="font-size: 0.95rem; color: #1e3a8a;">Shared Session Dataset: ${ds.name}</strong>
                        <span style="background: ${compat.color}15; color: ${compat.color}; border: 1px solid ${compat.color}40; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 700;">
                          ${compat.badge} for ${this.detectedAlgoName || 'Selected Algorithm'}
                        </span>
                      </div>
                      <div style="font-size: 0.78rem; color: #475569; margin-top: 2px;">
                        ${ds.totalRows} records • ${ds.totalCols} attributes (${(ds.numericCols||[]).length} numeric, ${(ds.catCols||[]).length} categorical) • Uploaded in Practical Lab
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <button type="button" id="btn-load-session-ds" class="btn" style="background: #2563eb; color: white; font-size: 0.82rem; font-weight: 800; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(37,99,235,0.3);">
                      <i data-lucide="arrow-down-to-line" style="width: 14px; height: 14px;"></i> Load into ${this.detectedAlgoName || 'Solver'}
                    </button>
                    <button type="button" id="btn-check-compat-modal" class="btn" style="background: white; border: 1px solid #cbd5e1; color: #334155; font-size: 0.78rem; font-weight: 700; padding: 8px 12px; border-radius: 8px; cursor: pointer;">
                      Compatibility Info
                    </button>
                  </div>
                </div>
              `;
            })()}

            <!-- THREE INPUT METHOD NAVIGATION TABS -->
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 24px;">
              <button id="tab-mode-upload" class="mode-tab-btn ${this.activeInputMode === 'upload' ? 'active' : ''}" style="padding: 10px 24px; font-weight: 700; border-radius: 10px; border: 1px solid ${this.activeInputMode === 'upload' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeInputMode === 'upload' ? '#2563eb' : '#f8fafc'}; color: ${this.activeInputMode === 'upload' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="upload-cloud" style="width: 16px; height: 16px;"></i>
                <span>Upload Question</span>
              </button>
              <button id="tab-mode-type" class="mode-tab-btn ${this.activeInputMode === 'type' ? 'active' : ''}" style="padding: 10px 24px; font-weight: 700; border-radius: 10px; border: 1px solid ${this.activeInputMode === 'type' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeInputMode === 'type' ? '#2563eb' : '#f8fafc'}; color: ${this.activeInputMode === 'type' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="keyboard" style="width: 16px; height: 16px;"></i>
                <span>Type Question</span>
              </button>
              <button id="tab-mode-paste" class="mode-tab-btn ${this.activeInputMode === 'paste' ? 'active' : ''}" style="padding: 10px 24px; font-weight: 700; border-radius: 10px; border: 1px solid ${this.activeInputMode === 'paste' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeInputMode === 'paste' ? '#2563eb' : '#f8fafc'}; color: ${this.activeInputMode === 'paste' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="clipboard-copy" style="width: 16px; height: 16px;"></i>
                <span>Paste Question</span>
              </button>
            </div>

            <!-- METHOD 1: UPLOAD VIEW -->
            <div id="view-mode-upload" class="method-view" style="display: ${this.activeInputMode === 'upload' ? 'block' : 'none'};">
              <div id="dropzone-area" style="border: 2px dashed #cbd5e1; border-radius: 14px; padding: 36px 20px; text-align: center; background: #f8fafc; cursor: pointer; transition: border-color 0.2s, background-color 0.2s; margin-bottom: 20px;">
                <input type="file" id="num-file-input" accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf" style="display: none;">
                <div style="font-size: 2.2rem; color: #2563eb; margin-bottom: 10px;">
                  <i data-lucide="file-up" style="width: 44px; height: 44px; margin: 0 auto;"></i>
                </div>
                <h4 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 4px;">Drag &amp; Drop Question Image or PDF Here</h4>
                <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px;">Supports JPG, PNG, JPEG, PDF documents or assignment scans</p>
                <button id="btn-choose-file" type="button" class="btn btn-primary" style="background: #2563eb; color: white; padding: 10px 24px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer;">
                  Choose File from Device
                </button>
                <div id="file-name-display" style="font-size: 0.85rem; font-weight: 600; color: #10b981; margin-top: 10px;"></div>
              </div>
            </div>

            <!-- METHOD 2: TYPE VIEW -->
            <div id="view-mode-type" class="method-view" style="display: ${this.activeInputMode === 'type' ? 'block' : 'none'};">
              <div style="margin-bottom: 20px;">
                <label style="font-size: 0.9rem; font-weight: 700; color: #334155; display: block; margin-bottom: 8px;">
                  Type your university numerical question here:
                </label>
                <textarea id="num-question-type-text" rows="5" style="width: 100%; font-size: 0.9rem; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; resize: vertical;" placeholder="Example: Given 2D points P1(2,10), P2(2,5), P3(8,4), P4(5,8), P5(7,5). Cluster using K-Means with K=2..."></textarea>
              </div>
            </div>

            <!-- METHOD 3: PASTE VIEW -->
            <div id="view-mode-paste" class="method-view" style="display: ${this.activeInputMode === 'paste' ? 'block' : 'none'};">
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <label style="font-size: 0.9rem; font-weight: 700; color: #334155;">
                    Paste question text from PDF, Word, or Notes:
                  </label>
                  <button id="btn-paste-clipboard" type="button" class="btn btn-outline btn-sm" style="font-size: 0.8rem; display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="clipboard" style="width: 12px; height: 12px;"></i>
                    <span>Paste From Clipboard</span>
                  </button>
                </div>
                <textarea id="num-question-paste-text" rows="5" style="width: 100%; font-size: 0.9rem; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; resize: vertical;" placeholder="Paste copied question text here..."></textarea>
              </div>
            </div>

            <button id="btn-solve-question" class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 14px; border-radius: 10px; font-size: 1.05rem; font-weight: 700; text-align: center; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">
              <span>Solve Question Step-by-Step</span>
              <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
            </button>
          </div>

          <!-- EXTRACTED VALUE VERIFICATION & CLARIFICATION STAGE (Initially hidden) -->
          <div id="verification-stage" style="display: none; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <span>Algorithm Detected:</span>
                  <span id="detected-algo-label" style="color: #2563eb;">K-Means Clustering</span>
                  <span style="background: #ecfdf5; color: #059669; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; font-weight: 700;">Verified</span>
                </h3>
                <span style="font-size: 0.85rem; color: #64748b;">Subject: <strong id="detected-subject-label">Data Mining</strong></span>
              </div>
              
              <!-- Change Algorithm Dropdown -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 0.8rem; font-weight: bold; color: #64748b;">Switch Algorithm:</label>
                <select id="select-change-algo" style="padding: 6px 12px; font-size: 0.85rem; font-weight: bold; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; color: #0f172a;">
                  <option value="kmeans">K-Means Clustering</option>
                  <option value="kmedoids">K-Medoids (PAM)</option>
                  <option value="hierarchical">Hierarchical Dendrogram</option>
                  <option value="dbscan">DBSCAN Density Clustering</option>
                  <option value="id3">Decision Tree / ID3 (Entropy)</option>
                  <option value="naivebayes">Naive Bayes Classifier</option>
                  <option value="knn">KNN Nearest Neighbors</option>
                  <option value="apriori">Apriori Rule Mining</option>
                  <option value="regression">Linear Regression</option>
                  <option value="normalization">Data Normalization</option>
                  <option value="binning">Data Binning &amp; Smoothing</option>
                  <option value="iqr">Outlier Detection (IQR)</option>
                  <option value="metrics">Confusion Matrix Metrics</option>
                  <option value="olap">DWH Cubes &amp; OLAP</option>
                </select>
              </div>
            </div>

            <!-- DYNAMIC CLARIFICATION / VALIDATION BANNER -->
            <div id="clarification-banner" style="display: none; background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 14px; margin-bottom: 16px; font-size: 0.9rem; color: #92400e;">
              <!-- Populated dynamically if information is missing -->
            </div>

            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label style="font-size: 0.85rem; font-weight: 700; color: #334155; margin:0;">
                  Extracted Question Data &amp; Numerical Values (Confirm / Edit):
                </label>
                <span style="font-size:0.75rem; color:#64748b; background:#e2e8f0; padding:2px 8px; border-radius:4px;">
                  Your actual input is preserved below
                </span>
              </div>
              <textarea id="extracted-values-input" rows="5" style="width: 100%; font-family: monospace; font-size: 0.9rem; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; color: #0f172a;"></textarea>
              <div style="font-size: 0.78rem; color: #64748b; margin-top: 6px;">
                Please review or edit your extracted parameters above. Clicking confirm executes the solution strictly on your confirmed values without replacing them with sample data.
              </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button id="btn-confirm-data" class="btn btn-primary" style="background: #10b981; color: white; padding: 10px 24px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="check-circle" style="width: 16px; height: 16px;"></i>
                <span>Confirm Data &amp; Solve Question</span>
              </button>
            </div>
          </div>

          <!-- SOLUTION SCREEN DISPLAY -->
          <div id="solution-screen-container" style="display: none; margin-bottom: 32px;">
            <!-- Dynamically populated step-by-step solution player -->
          </div>

          <!-- DIRECT ALGORITHM SOLVER TABS -->
          <div style="border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 24px; margin-top: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-heading, #1e293b); margin-bottom: 14px;">
              Or Select Specific Algorithm Engine directly:
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; margin-bottom: 20px;">
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
                { id: 'binning', label: '11. Binning', icon: 'bar-chart-2' },
                { id: 'iqr', label: '12. IQR Outliers', icon: 'box' },
                { id: 'metrics', label: '13. Eval Metrics', icon: 'check-square' },
                { id: 'olap', label: '14. DWH Cubes/OLAP', icon: 'database' }
              ].map(item => `
                <button class="algo-tab-btn ${this.currentAlgo === item.id ? 'active' : ''}" data-algo="${item.id}" style="padding: 10px 12px; font-size: 12px; font-weight: 700; border-radius: 8px; border: 1px solid var(--border-color, #cbd5e1); background: ${this.currentAlgo === item.id ? '#2563eb' : 'white'}; color: ${this.currentAlgo === item.id ? '#ffffff' : '#334155'}; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
                  <i data-lucide="${item.icon}" style="width: 14px; height: 14px;"></i>
                  <span>${item.label}</span>
                </button>
              `).join('')}
            </div>

            <div id="tab-solver-container" style="background: white; border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              <!-- Active manual solver -->
            </div>
          </div>
        </div> <!-- End of #exam-section-root -->

      </div>
    `;

    this.bindEvents();
    this.renderHistoryDrawer();
    this.renderActiveTabSolver();
    this.renderVirtualLabSection();

    if (window.lucide) window.lucide.createIcons();
  }

  renderHistoryDrawer() {
    const drawer = this.mount.querySelector('#history-drawer');
    const badge = this.mount.querySelector('#history-badge-count');
    if (!drawer) return;
    if (badge) badge.innerText = this.savedSolutions.length;

    if (this.savedSolutions.length === 0) {
      drawer.innerHTML = `
        <div style="text-align: center; color: #64748b; font-size: 0.88rem; padding: 12px;">
          No saved solutions yet. Solve any problem and click "Save Solution to History" to bookmark it for exam revision!
        </div>
      `;
      return;
    }

    drawer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <strong style="font-size: 0.95rem; color: #1e293b;">Previously Solved Questions &amp; Solutions</strong>
        <span style="font-size: 0.8rem; color: #64748b;">Click to restore question</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto;">
        ${this.savedSolutions.map(s => `
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div style="cursor: pointer; flex: 1;" class="btn-load-history-item" data-id="${s.id}">
              <div style="font-weight: 700; color: #2563eb; font-size: 0.88rem;">${s.name}</div>
              <div style="font-size: 0.78rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 500px;">${s.input.replace(/\n/g, ' ')}</div>
              <div style="font-size: 0.72rem; color: #94a3b8;">Saved: ${s.date}</div>
            </div>
            <button class="btn-delete-history-item btn btn-outline btn-sm" data-id="${s.id}" style="padding: 4px 8px; font-size: 0.75rem; color: #dc2626; border-color: #fca5a5;">
              Delete
            </button>
          </div>
        `).join('')}
      </div>
    `;

    drawer.querySelectorAll('.btn-load-history-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.getAttribute('data-id'));
        const item = this.savedSolutions.find(s => s.id === id);
        if (item) {
          this.currentAlgo = item.algo;
          this.detectedAlgoName = item.name;
          const verificationStage = this.mount.querySelector('#verification-stage');
          verificationStage.style.display = 'block';
          this.mount.querySelector('#detected-algo-label').innerText = item.name;
          this.mount.querySelector('#extracted-values-input').value = item.input;
          drawer.style.display = 'none';
          this.runAcademicSolution(item.algo, item.input);
        }
      });
    });

    drawer.querySelectorAll('.btn-delete-history-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(el.getAttribute('data-id'));
        this.deleteSavedSolution(id);
      });
    });
  }

  bindEvents() {
    // Top Section Switching
    const btnPipeline = this.mount.querySelector('#toggle-section-pipeline');
    const btnExam = this.mount.querySelector('#toggle-section-exam');
    if (btnPipeline) {
      btnPipeline.addEventListener('click', () => {
        this.activeMainSection = 'pipeline';
        this.render();
      });
    }
    if (btnExam) {
      btnExam.addEventListener('click', () => {
        this.activeMainSection = 'exam';
        this.render();
      });
    }

    // Toggle history drawer
    const btnHistory = this.mount.querySelector('#btn-toggle-history');
    if (btnHistory) {
      btnHistory.addEventListener('click', () => {
        const drawer = this.mount.querySelector('#history-drawer');
        if (drawer) {
          drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
        }
      });
    }

    // Input mode navigation tabs
    const tabUpload = this.mount.querySelector('#tab-mode-upload');
    const tabType = this.mount.querySelector('#tab-mode-type');
    const tabPaste = this.mount.querySelector('#tab-mode-paste');

    const viewUpload = this.mount.querySelector('#view-mode-upload');
    const viewType = this.mount.querySelector('#view-mode-type');
    const viewPaste = this.mount.querySelector('#view-mode-paste');

    const setInputMode = (mode) => {
      this.activeInputMode = mode;
      [tabUpload, tabType, tabPaste].forEach(btn => {
        btn.style.background = '#f8fafc';
        btn.style.borderColor = '#cbd5e1';
        btn.style.color = '#334155';
      });
      [viewUpload, viewType, viewPaste].forEach(v => v.style.display = 'none');

      if (mode === 'upload') {
        tabUpload.style.background = '#2563eb';
        tabUpload.style.borderColor = '#2563eb';
        tabUpload.style.color = '#ffffff';
        viewUpload.style.display = 'block';
      } else if (mode === 'type') {
        tabType.style.background = '#2563eb';
        tabType.style.borderColor = '#2563eb';
        tabType.style.color = '#ffffff';
        viewType.style.display = 'block';
        this.mount.querySelector('#num-question-type-text').focus();
      } else if (mode === 'paste') {
        tabPaste.style.background = '#2563eb';
        tabPaste.style.borderColor = '#2563eb';
        tabPaste.style.color = '#ffffff';
        viewPaste.style.display = 'block';
        this.mount.querySelector('#num-question-paste-text').focus();
      }
    };

    tabUpload.addEventListener('click', () => setInputMode('upload'));
    tabType.addEventListener('click', () => setInputMode('type'));
    tabPaste.addEventListener('click', () => setInputMode('paste'));

    // Shared Session Dataset Loading Listeners
    const loadSessionBtn = this.mount.querySelector('#btn-load-session-ds');
    if (loadSessionBtn) {
      loadSessionBtn.addEventListener('click', () => {
        const ds = DatasetSession.getDataset();
        if (!ds) return;
        const compat = DatasetSession.checkCompatibility(this.currentAlgo, ds);
        if (!compat.compatible) {
          alert(`⚠️ Dataset Incompatible with ${this.detectedAlgoName || 'selected algorithm'}:\n\n${compat.reason}\n\nRequired Preprocessing:\n${compat.prepRequired}`);
          return;
        }

        const formatted = DatasetSession.formatForSolver(this.currentAlgo, ds);
        if (formatted) {
          this.extractedValues = formatted;
          const verificationStage = this.mount.querySelector('#verification-stage');
          if (verificationStage) {
            verificationStage.style.display = 'block';
            const valInput = this.mount.querySelector('#extracted-values-input');
            if (valInput) valInput.value = formatted;
            const detectedLabel = this.mount.querySelector('#detected-algo-label');
            if (detectedLabel) detectedLabel.innerText = this.detectedAlgoName || this.currentAlgo;
          }
          this.runAcademicSolution(this.currentAlgo, formatted);
          const solContainer = this.mount.querySelector('#solution-output-container');
          if (solContainer) solContainer.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const compatInfoBtn = this.mount.querySelector('#btn-check-compat-modal');
    if (compatInfoBtn) {
      compatInfoBtn.addEventListener('click', () => {
        const ds = DatasetSession.getDataset();
        if (!ds) return;
        const compat = DatasetSession.checkCompatibility(this.currentAlgo, ds);
        alert(`📊 Dataset Compatibility Report for ${this.detectedAlgoName}:\n\nDataset: ${ds.name}\nTotal Rows: ${ds.totalRows}\nNumeric Columns: ${(ds.numericCols||[]).join(', ') || 'None'}\nCategorical Columns: ${(ds.catCols||[]).join(', ') || 'None'}\nMissing Values: ${ds.missingCount}\n\nStatus: ${compat.badge}\nReason: ${compat.reason}\n\nPreprocessing Required:\n${compat.prepRequired}`);
      });
    }

    // Clipboard Paste Helper Button
    const btnPasteClip = this.mount.querySelector('#btn-paste-clipboard');
    if (btnPasteClip) {
      btnPasteClip.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text) {
              this.mount.querySelector('#num-question-paste-text').value = text;
            }
          }
        } catch (err) {
          console.log("Clipboard API read non-permitted, student can use Ctrl+V directly.");
        }
      });
    }

    // File Input & Drag and Drop handlers
    const fileInput = this.mount.querySelector('#num-file-input');
    const chooseBtn = this.mount.querySelector('#btn-choose-file');
    const dropzone = this.mount.querySelector('#dropzone-area');
    const fileNameDisplay = this.mount.querySelector('#file-name-display');

    chooseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        fileNameDisplay.innerText = `Selected File: ${file.name}`;
        this.processFile(file);
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#2563eb';
      dropzone.style.backgroundColor = '#eff6ff';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '#cbd5e1';
      dropzone.style.backgroundColor = '#f8fafc';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#cbd5e1';
      dropzone.style.backgroundColor = '#f8fafc';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        fileNameDisplay.innerText = `Uploaded File: ${file.name}`;
        this.processFile(file);
      }
    });

    // Solve Question Main Button
    const solveBtn = this.mount.querySelector('#btn-solve-question');
    solveBtn.addEventListener('click', () => {
      let submitText = "";
      if (this.activeInputMode === 'upload') {
        submitText = this.extractedText || "Uploaded file question";
      } else if (this.activeInputMode === 'type') {
        submitText = this.mount.querySelector('#num-question-type-text').value.trim();
      } else if (this.activeInputMode === 'paste') {
        submitText = this.mount.querySelector('#num-question-paste-text').value.trim();
      }

      if (!submitText) {
        alert("Please enter, paste, or upload a numerical question before clicking Solve.");
        return;
      }
      this.triggerDetection(submitText);
    });

    // Change Algorithm Dropdown handler
    const selectChangeAlgo = this.mount.querySelector('#select-change-algo');
    if (selectChangeAlgo) {
      selectChangeAlgo.addEventListener('change', (e) => {
        const selected = e.target.value;
        const nameMap = {
          kmeans: 'K-Means Clustering',
          kmedoids: 'K-Medoids (PAM)',
          hierarchical: 'Hierarchical Dendrogram',
          dbscan: 'DBSCAN Density Clustering',
          id3: 'Decision Tree / ID3',
          naivebayes: 'Naive Bayes Classifier',
          knn: 'KNN Nearest Neighbors',
          apriori: 'Apriori Rule Mining',
          regression: 'Linear Regression',
          normalization: 'Data Normalization',
          binning: 'Data Binning & Smoothing',
          iqr: 'Outlier Detection (IQR)',
          metrics: 'Confusion Matrix Metrics',
          olap: 'DWH Cubes & OLAP'
        };
        this.currentAlgo = selected;
        this.detectedAlgoName = nameMap[selected] || selected;
        this.mount.querySelector('#detected-algo-label').innerText = this.detectedAlgoName;
        this.validateAndClarifyInput(selected, this.mount.querySelector('#extracted-values-input').value);
      });
    }

    // Direct tabbed navigation
    this.mount.querySelectorAll('.algo-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const algo = e.currentTarget.getAttribute('data-algo');
        this.setAlgo(algo);
      });
    });
  }

  processFile(file) {
    this.uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const text = (typeof content === 'string') ? content : `Numerical question extracted from ${file.name}`;
      this.extractedText = text;
      this.triggerDetection(text || file.name);
    };
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }

  triggerDetection(text) {
    const detection = this.detectSubjectAndAlgorithm(text);
    this.detectedSubject = detection.subject;
    this.detectedAlgoName = detection.name;
    this.currentAlgo = detection.algo;

    const verificationStage = this.mount.querySelector('#verification-stage');
    verificationStage.style.display = 'block';
    this.mount.querySelector('#detected-algo-label').innerText = detection.name;
    this.mount.querySelector('#detected-subject-label').innerText = detection.subject;
    this.mount.querySelector('#select-change-algo').value = detection.algo;

    // Extract actual raw content from question or format it appropriately
    let extractedData = this.extractDataFromText(text, detection.algo);
    this.mount.querySelector('#extracted-values-input').value = extractedData;

    // Check for missing parameters and prompt for clarification if needed
    this.validateAndClarifyInput(detection.algo, extractedData);

    this.mount.querySelector('#btn-confirm-data').onclick = () => {
      const confirmedVal = this.mount.querySelector('#extracted-values-input').value;
      this.runAcademicSolution(this.currentAlgo, confirmedVal);
    };

    verificationStage.scrollIntoView({ behavior: 'smooth' });
  }

  extractDataFromText(text, algo) {
    // Attempt to extract coordinates or data lines from the user prompt
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const dataLines = lines.filter(l => 
      /[-?\d]/.test(l) && 
      !/^(given|find|compute|calculate|solve|problem|question|using|algorithm|cluster)/i.test(l)
    );

    if (dataLines.length > 0) {
      return dataLines.join('\n');
    }

    // Default student templates if text didn't contain explicit rows
    if (algo === 'kmeans' || algo === 'kmedoids' || algo === 'dbscan') {
      return "P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5";
    } else if (algo === 'hierarchical') {
      return "P1: 1, 1\nP2: 1.5, 1.5\nP3: 5, 5\nP4: 3, 4";
    } else if (algo === 'id3') {
      return "Outlook, Humidity, Wind, Play\nSunny, High, Weak, No\nSunny, High, Strong, No\nOvercast, High, Weak, Yes\nRain, Mild, Weak, Yes\nRain, Cool, Strong, No";
    } else if (algo === 'naivebayes') {
      return "Outlook, Humidity, Wind, Play\nSunny, High, Weak, No\nSunny, High, Strong, No\nOvercast, High, Weak, Yes\nRain, Mild, Weak, Yes\nRain, Cool, Strong, No";
    } else if (algo === 'regression') {
      return "P1: 1, 2\nP2: 2, 3\nP3: 3, 5\nP4: 4, 7\nP5: 5, 9";
    } else if (algo === 'apriori') {
      return "T1: Milk, Bread, Eggs\nT2: Bread, Butter\nT3: Milk, Bread, Butter\nT4: Milk, Eggs\nT5: Bread, Butter";
    } else if (algo === 'iqr') {
      return "12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65";
    } else if (algo === 'normalization') {
      return "200, 300, 400, 600, 1000";
    } else if (algo === 'binning') {
      return "4, 8, 9, 15, 21, 21, 24, 25, 26, 28, 29, 34";
    } else if (algo === 'metrics') {
      return "TP: 85, FP: 15, FN: 10, TN: 90";
    }
    return text;
  }

  validateAndClarifyInput(algo, text) {
    const banner = this.mount.querySelector('#clarification-banner');
    if (!banner) return;

    let warning = '';
    if (algo === 'kmeans' || algo === 'kmedoids' || algo === 'hierarchical' || algo === 'dbscan') {
      const pts = this.parseInputPoints(text);
      if (pts.length < 2) {
        warning = `<strong>Clarification Needed:</strong> Found only ${pts.length} 2D coordinate point(s). This clustering algorithm requires at least 2 points (e.g., P1: 2, 10\nP2: 5, 8). Please add or correct coordinate points below.`;
      }
    } else if (algo === 'id3' || algo === 'naivebayes') {
      const rows = this.parseInputTable(text);
      if (!rows || rows.length < 2) {
        warning = `<strong>Clarification Needed:</strong> Classification requires tabular data with header columns and at least 2 instances (e.g. Outlook, Humidity, Play). Please review or provide tabular data below.`;
      }
    } else if (algo === 'regression') {
      const pts = this.parseInputPoints(text);
      if (pts.length < 2) {
        warning = `<strong>Clarification Needed:</strong> Linear Regression requires at least 2 paired numeric points (x, y). Please provide coordinates below.`;
      }
    } else if (algo === 'apriori') {
      const tx = this.parseInputTransactions(text);
      if (tx.length < 2) {
        warning = `<strong>Clarification Needed:</strong> Apriori association rule mining requires multiple transactions (e.g. T1: Milk, Bread\nT2: Bread, Butter). Please ensure items are comma-separated.`;
      }
    }

    if (warning) {
      banner.style.display = 'block';
      banner.innerHTML = warning;
    } else {
      banner.style.display = 'none';
    }
  }

  parseInputPoints(inputVal) {
    if (!inputVal) return [];
    const lines = inputVal.split('\n').filter(l => l.trim());
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
      const allNums = (inputVal.match(/-?\d+(\.\d+)?/g) || []).map(Number);
      for (let i = 0; i < allNums.length - 1; i += 2) {
        points.push({ id: `P${Math.floor(i / 2) + 1}`, x: allNums[i], y: allNums[i + 1] });
      }
    }
    return points;
  }

  parseInputNumbers(inputVal) {
    if (!inputVal) return [];
    const nums = (inputVal.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    return nums;
  }

  parseInputXYSeries(inputVal) {
    const xMatch = inputVal.match(/X\s*[:=]\s*([^\n;]+)/i);
    const yMatch = inputVal.match(/Y\s*[:=]\s*([^\n;]+)/i);
    if (xMatch && yMatch) {
      const xs = (xMatch[1].match(/-?\d+(\.\d+)?/g) || []).map(Number);
      const ys = (yMatch[1].match(/-?\d+(\.\d+)?/g) || []).map(Number);
      const points = [];
      const len = Math.min(xs.length, ys.length);
      for (let i = 0; i < len; i++) {
        points.push({ id: `P${i + 1}`, x: xs[i], y: ys[i] });
      }
      if (points.length > 0) return { xs, ys, points };
    }
    const points = this.parseInputPoints(inputVal);
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    return { xs, ys, points };
  }

  parseInputTransactions(inputVal) {
    if (!inputVal) return [];
    const lines = inputVal.split('\n').filter(l => l.trim());
    const tx = [];
    lines.forEach((line, idx) => {
      const parts = line.split(':');
      const id = parts.length > 1 ? parts[0].trim() : `T${idx + 1}`;
      const itemStr = parts.length > 1 ? parts[1] : parts[0];
      const items = itemStr.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
      if (items.length > 0) {
        tx.push({ id, items });
      }
    });
    return tx;
  }

  parseInputTable(inputVal) {
    if (!inputVal) return null;
    const lines = inputVal.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return null;
    const headers = lines[0].split(/[,;\t|]/).map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(/[,;\t|]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cells.length === headers.length) {
        const row = {};
        headers.forEach((h, idx) => row[h] = cells[idx]);
        rows.push(row);
      }
    }
    return rows.length > 0 ? rows : null;
  }

  parseConfusionMatrix(inputVal) {
    const lower = inputVal.toLowerCase();
    const tpMatch = lower.match(/tp\s*[:=]?\s*(\d+)/);
    const fpMatch = lower.match(/fp\s*[:=]?\s*(\d+)/);
    const fnMatch = lower.match(/fn\s*[:=]?\s*(\d+)/);
    const tnMatch = lower.match(/tn\s*[:=]?\s*(\d+)/);
    if (tpMatch && fpMatch && fnMatch && tnMatch) {
      return {
        tp: parseInt(tpMatch[1]),
        fp: parseInt(fpMatch[1]),
        fn: parseInt(fnMatch[1]),
        tn: parseInt(tnMatch[1])
      };
    }
    const nums = (inputVal.match(/\d+/g) || []).map(Number);
    if (nums.length >= 4) {
      return { tp: nums[0], fp: nums[1], fn: nums[2], tn: nums[3] };
    }
    return null;
  }


  runAcademicSolution(algo, inputVal) {
    const solutionContainer = this.mount.querySelector('#solution-screen-container');
    if (!solutionContainer) return;
    solutionContainer.style.display = 'block';

    let solutionHeaderHtml = `
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 14px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #2563eb; letter-spacing: 0.5px;">Subject: ${this.detectedSubject}</span>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Algorithm: ${this.detectedAlgoName}</h2>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #ecfdf5; color: #059669; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
              <span>Active Mathematical Solution</span>
            </span>
          </div>
        </div>

        <!-- THREE LEARNING MODES TOGGLE BUTTONS -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
          <button id="btn-sol-mode-detailed" class="btn btn-primary btn-sm" style="background: #2563eb; color: white; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
            <span>Learn Mode (Step-by-Step Derivation)</span>
          </button>
          <button id="btn-sol-mode-exam" class="btn btn-outline btn-sm" style="border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="award" style="width: 14px; height: 14px;"></i>
            <span>Exam Mode (Marking Scheme Standard)</span>
          </button>
          <button id="btn-sol-mode-practice" class="btn btn-outline btn-sm" style="border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="help-circle" style="width: 14px; height: 14px;"></i>
            <span>Practice Mode (Interactive Quiz)</span>
          </button>
        </div>

        <!-- STEP PLAYER NAVIGATION CONTROLS (FUNCTIONAL STATE CONTROLLER) -->
        <div id="step-player-toolbar" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
            <div>
              <span id="step-counter-badge" style="background: #2563eb; color: white; font-weight: 800; font-size: 0.82rem; padding: 4px 10px; border-radius: 6px;">
                Step 1 of 1
              </span>
              <strong id="step-title-display" style="font-size: 1rem; color: #1e293b; margin-left: 10px;">
                Initial Problem Setup
              </strong>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button id="btn-ctrl-reset" class="btn btn-outline btn-sm" title="Reset to Step 1" style="display:flex; align-items:center; gap:4px; font-weight:700;">
                <i data-lucide="rotate-ccw" style="width:14px; height:14px;"></i>
                <span>Reset</span>
              </button>
              <button id="btn-ctrl-prev" class="btn btn-outline btn-sm" title="Previous Step" style="display:flex; align-items:center; gap:4px; font-weight:700;">
                <i data-lucide="chevron-left" style="width:14px; height:14px;"></i>
                <span>Previous Step</span>
              </button>
              <button id="btn-ctrl-next" class="btn btn-primary btn-sm" title="Next Step" style="background:#2563eb; color:white; display:flex; align-items:center; gap:4px; font-weight:700;">
                <span>Next Step</span>
                <i data-lucide="chevron-right" style="width:14px; height:14px;"></i>
              </button>
              <button id="btn-ctrl-run-all" class="btn btn-primary btn-sm" title="Run All Steps" style="background:#059669; color:white; border-color:#059669; display:flex; align-items:center; gap:4px; font-weight:700;">
                <i data-lucide="play" style="width:14px; height:14px;"></i>
                <span>Run All Steps</span>
              </button>
              <button id="btn-ctrl-full" class="btn btn-outline btn-sm" title="Show Complete Solution" style="display:flex; align-items:center; gap:4px; font-weight:700;">
                <i data-lucide="list" style="width:14px; height:14px;"></i>
                <span>Show Full Solution</span>
              </button>
            </div>
          </div>
          <!-- Visual Step Progress Bar -->
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
            <div id="step-progress-fill" style="height: 100%; width: 25%; background: linear-gradient(90deg, #2563eb, #10b981); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <div id="active-solution-body">
          <!-- Dynamic stepped solver output -->
        </div>

        <!-- DYNAMIC VISUALIZATION CONTAINER (CORRESPONDING TO CALCULATION STATE) -->
        <div id="active-solution-visualizer" style="margin-top: 20px;">
          <!-- Visualizer rendered dynamically per step -->
        </div>

        <!-- BOTTOM ACTIONS -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 20px; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="btn-save-sol-history" class="btn btn-primary" style="background: #059669; color: white; display: flex; align-items: center; gap: 6px; border: none;">
              <i data-lucide="bookmark" style="width: 16px; height: 16px;"></i>
              <span>Save Solution to History</span>
            </button>
            <button id="btn-download-sol" class="btn btn-outline" style="display: flex; align-items: center; gap: 6px;">
              <i data-lucide="download" style="width: 16px; height: 16px;"></i>
              <span>Download Text Report</span>
            </button>
            <button id="btn-print-sol" class="btn btn-outline" style="display: flex; align-items: center; gap: 6px;">
              <i data-lucide="printer" style="width: 16px; height: 16px;"></i>
              <span>Print / Export PDF</span>
            </button>
          </div>
          <div>
            <a href="#/ai-assistant" class="btn btn-outline" style="text-decoration: none; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
              <span>Ask AI About This Step</span>
            </a>
          </div>
        </div>
      </div>
    `;

    solutionContainer.innerHTML = solutionHeaderHtml;
    const bodyContainer = solutionContainer.querySelector('#active-solution-body');
    const visualizerContainer = solutionContainer.querySelector('#active-solution-visualizer');

    let steps = [];
    let examContent = "";
    let practiceContent = "";
    let practiceAnswerExpected = "";
    let practiceHintText = "";
    let practiceExplanation = "";

    // ==============================================================
    // 1. K-MEANS CLUSTERING STEP SEQUENCE
    // ==============================================================
    if (algo === 'kmeans') {
      const pts = this.parseInputPoints(inputVal);
      if (pts.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for K-Means</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Found ${pts.length} coordinate point(s). K-Means clustering requires at least 2 coordinate points (e.g., P1: 2, 10 or (2, 5)). Please enter your points above, or click below to load a practice exam sample.</p>
            <button id="btn-load-sample-km" class="btn btn-outline btn-sm" style="border-radius:6px; font-weight:700;">Load Practice Exam Sample</button>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        const sampleBtn = bodyContainer.querySelector('#btn-load-sample-km');
        if (sampleBtn) {
          sampleBtn.onclick = () => {
            const sampleText = "P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5\nP6: 6, 4";
            const inputField = this.mount.querySelector('#extracted-values-input');
            if (inputField) inputField.value = sampleText;
            this.runAcademicSolution('kmeans', sampleText);
          };
        }
        return;
      }
      const res = NumericalEngine.kMeans(pts, 2);

      steps.push({
        title: "Given Dataset & Extracted 2D Coordinates",
        html: `
          <div class="card p-4" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">1. Problem Input &amp; Coordinates</h4>
            <p style="font-size:0.9rem; color:#475569; margin-bottom:8px;">
              Given ${pts.length} coordinate points to group into <strong>K = 2</strong> clusters:
            </p>
            <div style="background:white; padding:10px 14px; border-radius:8px; border:1px solid #cbd5e1; font-family:monospace; font-size:0.85rem;">
              ${pts.map(p => `<strong>${p.id}</strong>=(${p.x}, ${p.y})`).join(' | ')}
            </div>
            <div style="background:#eff6ff; padding:10px 14px; border-radius:8px; margin-top:10px; font-size:0.85rem;">
              <strong>Initial Centroids Selected:</strong> ${res.initialCentroids.map((c, i) => `C${i+1}=(${c.x}, ${c.y})`).join(' , ')}
            </div>
          </div>
        `,
        renderViz: () => this.drawKMeansCanvas(visualizerContainer, pts, res.initialCentroids, [pts, []])
      });

      steps.push({
        title: "Distance Metric & Centroid Formulas",
        html: `
          <div class="card p-4" style="background:#eff6ff; border-left:4px solid #2563eb; border-radius:8px; padding:14px;">
            <h4 style="font-size:1rem; font-weight:700; color:#1e40af; margin-bottom:6px;">2. Governing Formulas</h4>
            <div style="font-family:monospace; font-size:0.88rem; line-height:1.6; color:#1e3a8a;">
              &bull; <strong>Euclidean Distance:</strong> d(P, C) = &radic;((x_p - c_x)&sup2; + (y_p - c_y)&sup2;)<br>
              &bull; <strong>Centroid Mean:</strong> C_x = (&sum; x_i) / n , C_y = (&sum; y_i) / n<br>
              &bull; <strong>Convergence Criterion:</strong> Terminate when centroid displacement &Delta;C &lt; 0.001 or assignments remain identical.
            </div>
          </div>
        `,
        renderViz: () => this.drawKMeansCanvas(visualizerContainer, pts, res.initialCentroids, [pts, []])
      });

      res.history.forEach((it) => {
        steps.push({
          title: `Iteration ${it.iteration}: Distance Calculations & Assignments`,
          html: `
            <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:10px;">
                <strong style="color:#2563eb; font-size:0.95rem;">Iteration ${it.iteration}: Centroids C1=(${it.centroids[0]?.x}, ${it.centroids[0]?.y}), C2=(${it.centroids[1]?.x}, ${it.centroids[1]?.y})</strong>
                <span style="font-size:0.8rem; background:#f1f5f9; padding:2px 8px; border-radius:6px; color:#475569;">SSE: ${it.sse}</span>
              </div>
              <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem; font-family:monospace;">
                  <thead>
                    <tr style="background:#f8fafc; border-bottom:1px solid #cbd5e1; text-align:left;">
                      <th style="padding:6px;">Point</th>
                      <th style="padding:6px;">(x, y)</th>
                      <th style="padding:6px;">d(P, C1)</th>
                      <th style="padding:6px;">d(P, C2)</th>
                      <th style="padding:6px;">Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(it.distanceTable || it.pointDistances || []).map(row => `
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:6px; font-weight:bold;">${row.pointId || row.id}</td>
                        <td style="padding:6px;">(${row.x}, ${row.y})</td>
                        <td style="padding:6px; color:${row.assignedCluster === 1 ? '#2563eb' : '#64748b'}; font-weight:${row.assignedCluster === 1 ? 'bold' : 'normal'};">${row.d1 !== undefined ? row.d1 : (row.distancesToCentroids ? row.distancesToCentroids[0] : '-')}</td>
                        <td style="padding:6px; color:${row.assignedCluster === 2 ? '#2563eb' : '#64748b'}; font-weight:${row.assignedCluster === 2 ? 'bold' : 'normal'};">${row.d2 !== undefined ? row.d2 : (row.distancesToCentroids ? row.distancesToCentroids[1] : '-')}</td>
                        <td style="padding:6px; font-weight:bold; color:${row.assignedCluster === 1 ? '#2563eb' : '#059669'};">Cluster ${row.assignedCluster}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `,
          renderViz: () => {
            const table = it.distanceTable || it.pointDistances || [];
            const c1Pts = table.filter(r => r.assignedCluster === 1).map(r => pts.find(p => p.id === (r.pointId || r.id))).filter(Boolean);
            const c2Pts = table.filter(r => r.assignedCluster === 2).map(r => pts.find(p => p.id === (r.pointId || r.id))).filter(Boolean);
            this.drawKMeansCanvas(visualizerContainer, pts, it.centroids, [c1Pts, c2Pts]);
          }
        });
      });

      steps.push({
        title: "Final Convergence & Final Cluster Partitioning",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:18px;">
            <h4 style="font-size:1.1rem; font-weight:800; color:#166534; margin:0 0 8px;">FINAL CONVERGED CLUSTER PARTITION</h4>
            <p style="font-size:0.95rem; color:#15803d; margin:0 0 8px;">
              &bull; <strong>Convergence Status:</strong> Stable after ${res.totalIterations} iteration(s) (&Delta;C displacement &lt; 0.001).<br>
              &bull; <strong>Cluster 1:</strong> [${res.clusters[0]?.map(p => p.id).join(', ') || 'None'}] &rarr; Final Centroid C1 = (${res.finalCentroids[0]?.x}, ${res.finalCentroids[0]?.y})<br>
              &bull; <strong>Cluster 2:</strong> [${res.clusters[1]?.map(p => p.id).join(', ') || 'None'}] &rarr; Final Centroid C2 = (${res.finalCentroids[1]?.x}, ${res.finalCentroids[1]?.y})<br>
              &bull; <strong>Total SSE:</strong> ${res.sse}
            </p>
          </div>
        `,
        renderViz: () => this.drawKMeansCanvas(visualizerContainer, pts, res.finalCentroids, res.clusters)
      });

      examContent = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px; font-size:0.92rem; line-height:1.7;">
          <strong style="color:#2563eb; font-size:1.05rem;">University Exam Format &bull; K-Means Clustering [10 Marks]</strong><br>
          1. <strong>Formula (2 Marks):</strong> Euclidean Distance d(P, C) = &radic;((x_p-c_x)&sup2;+(y_p-c_y)&sup2;), Centroid Update C = (1/n)&sum;p.<br>
          2. <strong>Iterations (5 Marks):</strong> Converged in ${res.totalIterations} iterations with initial centroids C1=(${res.history[0]?.centroids[0]?.x}, ${res.history[0]?.centroids[0]?.y}) and C2=(${res.history[0]?.centroids[1]?.x}, ${res.history[0]?.centroids[1]?.y}).<br>
          3. <strong>Final Partition (3 Marks):</strong> Cluster 1 = {${res.clusters[0]?.map(p => p.id).join(', ') || ''}}, Cluster 2 = {${res.clusters[1]?.map(p => p.id).join(', ') || ''}}.
        </div>
      `;

      const firstPoint = pts[0];
      const targetC = res.history[0]?.centroids[0] || pts[0];
      const dVal = Math.hypot(firstPoint.x - targetC.x, firstPoint.y - targetC.y).toFixed(2);
      practiceAnswerExpected = dVal;
      practiceHintText = `Use Euclidean distance: &radic;((${firstPoint.x}-${targetC.x})&sup2; + (${firstPoint.y}-${targetC.y})&sup2;).`;
      practiceExplanation = `Distance d(${firstPoint.id}, C1) = ${dVal}.`;

      practiceContent = `
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:20px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:#92400e; margin:0 0 8px;">PRACTICE CHALLENGE &bull; K-MEANS</h4>
          <p style="font-size:0.92rem; color:#78350f; margin-bottom:12px;">
            What is the Euclidean distance from point <strong>${firstPoint.id}(${firstPoint.x}, ${firstPoint.y})</strong> to initial centroid <strong>C1(${targetC.x}, ${targetC.y})</strong>? (Round to 2 decimal places):
          </p>
          <div style="display:flex; gap:10px; max-width:400px; margin-bottom:12px;">
            <input type="text" id="practice-ans-input" placeholder="e.g. 3.16" style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.95rem;">
            <button id="btn-practice-check" class="btn btn-primary" style="background:#2563eb; color:white;">Check Answer</button>
          </div>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <button id="btn-practice-hint" class="btn btn-outline btn-sm">Show Step Hint</button>
            <button id="btn-practice-solution" class="btn btn-outline btn-sm">Reveal Answer</button>
          </div>
          <div id="practice-feedback-box" style="display:none; padding:12px; border-radius:8px; font-size:0.9rem;"></div>
        </div>
      `;
    }

    // ==============================================================
    // 2. AGGLOMERATIVE HIERARCHICAL CLUSTERING STEP SEQUENCE
    // ==============================================================
    else if (algo === 'hierarchical') {
      const pts = this.parseInputPoints(inputVal);
      if (pts.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for Hierarchical Clustering</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Found ${pts.length} point(s). Agglomerative Hierarchical clustering requires at least 2 coordinate points (e.g., P1: 1, 1; P2: 2, 3). Please enter your points above, or click below to load a practice exam sample.</p>
            <button id="btn-load-sample-h" class="btn btn-outline btn-sm" style="border-radius:6px; font-weight:700;">Load Practice Exam Sample</button>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        const sampleBtn = bodyContainer.querySelector('#btn-load-sample-h');
        if (sampleBtn) {
          sampleBtn.onclick = () => {
            const sampleText = "P1: 1, 1\nP2: 1.5, 1.5\nP3: 5, 5\nP4: 3, 4\nP5: 4, 4";
            const inputField = this.mount.querySelector('#extracted-values-input');
            if (inputField) inputField.value = sampleText;
            this.runAcademicSolution('hierarchical', sampleText);
          };
        }
        return;
      }
      const res = NumericalEngine.hierarchicalClustering(pts, 'single');

      steps.push({
        title: "Input Coordinate Points & Pairwise Distance Matrix",
        html: `
          <div class="card p-4" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">1. Pairwise Distance Matrix (D_0)</h4>
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-family:monospace; font-size:0.85rem;">
                <thead><tr style="background:#e2e8f0;"><th style="padding:6px;"></th>${pts.map(p => `<th style="padding:6px;">${p.id}</th>`).join('')}</tr></thead>
                <tbody>
                  ${pts.map((p1, i) => `
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:6px; font-weight:bold; background:#f1f5f9;">${p1.id}</td>
                      ${pts.map((p2, j) => `<td style="padding:6px; text-align:center;${i === j ? 'color:#94a3b8;' : ''}">${res.initialMatrix[i][j]}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `,
        renderViz: () => this.drawDendrogram(visualizerContainer, res.finalTree, res.steps, 0)
      });

      steps.push({
        title: "Single Linkage Merge Rule Definition",
        html: `
          <div class="card p-4" style="background:#eff6ff; border-left:4px solid #2563eb; border-radius:8px; padding:14px;">
            <h4 style="font-size:1rem; font-weight:700; color:#1e40af; margin-bottom:6px;">2. Single Linkage (Minimum Distance Rule)</h4>
            <div style="font-family:monospace; font-size:0.88rem; line-height:1.6; color:#1e3a8a;">
              d(C_A, C_B) = min { d(p_a, p_b) | p_a &isin; C_A, p_b &isin; C_B }<br>
              In each iteration, the two clusters with the smallest pairwise distance are merged into a single parent cluster.
            </div>
          </div>
        `,
        renderViz: () => this.drawDendrogram(visualizerContainer, res.finalTree, res.steps, 0)
      });

      res.steps.forEach((s) => {
        steps.push({
          title: `Merge Step ${s.step}: Merge ${s.clusterA} and ${s.clusterB} at Distance d=${s.distance}`,
          html: `
            <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
              <strong style="color:#2563eb; font-size:0.95rem;">Step ${s.step} Agglomeration:</strong>
              <p style="font-size:0.9rem; margin:8px 0;">
                Selected minimum distance pair: <strong>${s.clusterA}</strong> and <strong>${s.clusterB}</strong> (d = ${s.distance})<br>
                Resulting cluster label: <strong>${s.mergedLabel}</strong><br>
                Remaining independent clusters: <strong>${s.remainingCount}</strong>
              </p>
            </div>
          `,
          renderViz: () => this.drawDendrogram(visualizerContainer, res.finalTree, res.steps, s.step)
        });
      });

      steps.push({
        title: "Complete Agglomerative Merge Sequence & Dendrogram Cut",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:18px;">
            <h4 style="font-size:1.1rem; font-weight:800; color:#166534; margin:0 0 8px;">DENDROGRAM HIERARCHY COMPLETE</h4>
            <p style="font-size:0.95rem; color:#15803d; margin:0 0 10px;">
              All points unified into root hierarchy <strong>${res.finalTree.label}</strong> in ${res.steps.length} merge steps.<br>
              Use the interactive cut slider below to test different cluster partitions!
            </p>
          </div>
        `,
        renderViz: () => this.drawDendrogram(visualizerContainer, res.finalTree, res.steps, res.steps.length, true)
      });

      examContent = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px; font-size:0.92rem; line-height:1.7;">
          <strong style="color:#2563eb; font-size:1.05rem;">University Exam Format &bull; Hierarchical Clustering [10 Marks]</strong><br>
          1. <strong>Linkage Formula (3 Marks):</strong> d(A, B) = min d(p_a, p_b).<br>
          2. <strong>Merge Steps (4 Marks):</strong><br>
          ${res.steps.map(s => `&bull; Step ${s.step}: Merged ${s.clusterA} + ${s.clusterB} (d=${s.distance}) &rarr; ${s.mergedLabel}`).join('<br>')}<br>
          3. <strong>Final Result (3 Marks):</strong> Root cluster = ${res.finalTree.label}.
        </div>
      `;

      practiceAnswerExpected = String(res.steps[0]?.distance || "1.0");
      practiceHintText = `Look at the initial pairwise distance matrix for the smallest non-zero value.`;
      practiceExplanation = `The minimum initial distance is d=${res.steps[0]?.distance}.`;

      practiceContent = `
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:20px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:#92400e; margin:0 0 8px;">PRACTICE CHALLENGE &bull; HIERARCHICAL CLUSTERING</h4>
          <p style="font-size:0.92rem; color:#78350f; margin-bottom:12px;">
            What is the minimum pairwise distance selected for the <strong>very first merge step</strong>?
          </p>
          <div style="display:flex; gap:10px; max-width:400px; margin-bottom:12px;">
            <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.95rem;">
            <button id="btn-practice-check" class="btn btn-primary" style="background:#2563eb; color:white;">Check Answer</button>
          </div>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <button id="btn-practice-hint" class="btn btn-outline btn-sm">Show Step Hint</button>
            <button id="btn-practice-solution" class="btn btn-outline btn-sm">Reveal Answer</button>
          </div>
          <div id="practice-feedback-box" style="display:none; padding:12px; border-radius:8px; font-size:0.9rem;"></div>
        </div>
      `;
    }

    // ==============================================================
    // 3. DECISION TREE ID3 RECURSIVE SPLITTING
    // ==============================================================
    else if (algo === 'id3') {
      const rows = this.parseInputTable(inputVal);
      if (!rows || rows.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for Decision Tree (ID3)</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Decision tree induction requires tabular CSV-style data with a header row and at least 2 records (last column is target attribute). Please enter your table above, or click below to load a sample dataset.</p>
            <button id="btn-load-sample-id3" class="btn btn-outline btn-sm" style="border-radius:6px; font-weight:700;">Load PlayTennis Exam Dataset</button>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        const sampleBtn = bodyContainer.querySelector('#btn-load-sample-id3');
        if (sampleBtn) {
          sampleBtn.onclick = () => {
            const sampleText = "Outlook, Temperature, Humidity, Wind, Play\nSunny, Hot, High, Weak, No\nSunny, Hot, High, Strong, No\nOvercast, Hot, High, Weak, Yes\nRain, Mild, High, Weak, Yes\nRain, Cool, Normal, Weak, Yes\nRain, Cool, Normal, Strong, No\nOvercast, Cool, Normal, Strong, Yes\nSunny, Mild, High, Weak, No\nSunny, Cool, Normal, Weak, Yes\nRain, Mild, Normal, Weak, Yes";
            const inputField = this.mount.querySelector('#extracted-values-input');
            if (inputField) inputField.value = sampleText;
            this.runAcademicSolution('id3', sampleText);
          };
        }
        return;
      }
      const targetCol = Object.keys(rows[0]).pop();
      const res = NumericalEngine.id3Entropy(rows, targetCol);
      const treeRes = NumericalEngine.buildDecisionTree(rows, targetCol);

      steps.push({
        title: "Training Dataset & Target Class Distribution",
        html: `
          <div class="card p-4" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">1. Dataset Summary (${rows.length} Instances)</h4>
            <div style="background:white; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-family:monospace; font-size:0.85rem; max-height:160px; overflow-y:auto;">
              ${rows.map((r, i) => `[${i+1}] ${Object.entries(r).map(([k, v]) => `${k}:${v}`).join(', ')}`).join('<br>')}
            </div>
            <p style="font-size:0.9rem; margin-top:8px;">Target Classification Attribute: <strong>${targetCol}</strong></p>
          </div>
        `,
        renderViz: () => this.drawDecisionTree(visualizerContainer, treeRes?.root)
      });

      steps.push({
        title: "System Shannon Entropy H(S) Calculation",
        html: `
          <div class="card p-4" style="background:#eff6ff; border-left:4px solid #2563eb; border-radius:8px; padding:14px;">
            <h4 style="font-size:1rem; font-weight:700; color:#1e40af; margin-bottom:6px;">2. System Entropy Formula</h4>
            <div style="font-family:monospace; font-size:0.88rem; line-height:1.6; color:#1e3a8a;">
              H(S) = - &sum; p_i log_2(p_i)<br>
              Computed System Entropy <strong>H(S) = ${res.systemEntropy} bits</strong>
            </div>
          </div>
        `,
        renderViz: () => this.drawDecisionTree(visualizerContainer, treeRes?.root)
      });

      steps.push({
        title: "Information Gain Evaluation for Each Attribute",
        html: `
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">3. Information Gain Table</h4>
            <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:1px solid #cbd5e1; text-align:left;">
                  <th style="padding:6px;">Attribute (A)</th>
                  <th style="padding:6px;">Conditional Entropy H(S|A)</th>
                  <th style="padding:6px;">Gain(S, A)</th>
                  <th style="padding:6px;">Rank</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(res.gains).map(([attr, gain], idx) => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:6px; font-weight:bold;">${attr}</td>
                    <td style="padding:6px;">${(res.systemEntropy - gain).toFixed(4)} bits</td>
                    <td style="padding:6px; font-weight:bold; color:${attr === res.bestSplitAttribute ? '#059669' : '#334155'};">${gain} bits</td>
                    <td style="padding:6px;">${attr === res.bestSplitAttribute ? '<span style="color:#059669; font-weight:bold;">Selected Root &check;</span>' : `Rank ${idx+2}`}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `,
        renderViz: () => this.drawDecisionTree(visualizerContainer, treeRes?.root)
      });

      steps.push({
        title: "Optimal Root Split & Full Generated Decision Tree",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:18px;">
            <h4 style="font-size:1.1rem; font-weight:800; color:#166534; margin:0 0 8px;">DECISION TREE GENERATED FROM DATA</h4>
            <p style="font-size:0.95rem; color:#15803d; margin:0 0 10px;">
              Root split: <strong>"${res.bestSplitAttribute}"</strong> with maximum Gain = <strong>${res.gains[res.bestSplitAttribute]} bits</strong>.<br>
              Review the dynamically constructed decision tree branches below.
            </p>
          </div>
        `,
        renderViz: () => this.drawDecisionTree(visualizerContainer, treeRes?.root)
      });

      examContent = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px; font-size:0.92rem; line-height:1.7;">
          <strong style="color:#2563eb; font-size:1.05rem;">University Exam Format &bull; Decision Tree ID3 [10 Marks]</strong><br>
          1. <strong>Entropy Formula (3 Marks):</strong> H(S) = -&sum; p_i log_2(p_i) = ${res.systemEntropy} bits.<br>
          2. <strong>Information Gain (4 Marks):</strong> Highest Gain = ${res.gains[res.bestSplitAttribute]} bits for ${res.bestSplitAttribute}.<br>
          3. <strong>Root Selection (3 Marks):</strong> Root attribute = <strong>${res.bestSplitAttribute}</strong>.
        </div>
      `;

      practiceAnswerExpected = String(res.bestSplitAttribute);
      practiceHintText = `The root attribute is the one that gives the largest information gain.`;
      practiceExplanation = `Optimal root attribute is ${res.bestSplitAttribute}.`;

      practiceContent = `
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:20px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:#92400e; margin:0 0 8px;">PRACTICE CHALLENGE &bull; ID3 ROOT</h4>
          <p style="font-size:0.92rem; color:#78350f; margin-bottom:12px;">
            Which attribute is selected as the <strong>Root Split</strong>?
          </p>
          <div style="display:flex; gap:10px; max-width:400px; margin-bottom:12px;">
            <input type="text" id="practice-ans-input" placeholder="e.g. ${res.bestSplitAttribute}" style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.95rem;">
            <button id="btn-practice-check" class="btn btn-primary" style="background:#2563eb; color:white;">Check Answer</button>
          </div>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <button id="btn-practice-hint" class="btn btn-outline btn-sm">Show Step Hint</button>
            <button id="btn-practice-solution" class="btn btn-outline btn-sm">Reveal Answer</button>
          </div>
          <div id="practice-feedback-box" style="display:none; padding:12px; border-radius:8px; font-size:0.9rem;"></div>
        </div>
      `;
    }

    // ==============================================================
    // 4. NAIVE BAYES PROBABILISTIC CLASSIFIER
    // ==============================================================
    else if (algo === 'naivebayes') {
      const rows = this.parseInputTable(inputVal);
      if (!rows || rows.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for Naive Bayes</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Naive Bayes requires tabular dataset records with headers and a target classification column. Please enter your dataset above, or click below to load a sample.</p>
            <button id="btn-load-sample-nb" class="btn btn-outline btn-sm" style="border-radius:6px; font-weight:700;">Load Naive Bayes Exam Dataset</button>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        const sampleBtn = bodyContainer.querySelector('#btn-load-sample-nb');
        if (sampleBtn) {
          sampleBtn.onclick = () => {
            const sampleText = "Outlook, Temperature, Humidity, Wind, Play\nSunny, Hot, High, Weak, No\nSunny, Hot, High, Strong, No\nOvercast, Hot, High, Weak, Yes\nRain, Mild, High, Weak, Yes\nRain, Cool, Normal, Weak, Yes\nRain, Cool, Normal, Strong, No\nOvercast, Cool, Normal, Strong, Yes";
            const inputField = this.mount.querySelector('#extracted-values-input');
            if (inputField) inputField.value = sampleText;
            this.runAcademicSolution('naivebayes', sampleText);
          };
        }
        return;
      }
      const targetCol = Object.keys(rows[0]).pop();
      const featureKeys = Object.keys(rows[0]).filter(k => k !== targetCol);
      const testInst = {};
      featureKeys.forEach(f => {
        testInst[f] = rows[0][f];
      });
      const res = NumericalEngine.naiveBayes(rows, targetCol, testInst);

      steps.push({
        title: "Training Dataset & Prior Class Probabilities P(C)",
        html: `
          <div class="card p-4" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">1. Dataset &amp; Prior Class Probabilities</h4>
            <p style="font-size:0.9rem; color:#475569; margin-bottom:8px;">Target Classification Attribute: <strong>"${targetCol}"</strong> (${rows.length} total instances)</p>
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:0.85rem; font-family:monospace;">
                <thead><tr style="background:#e2e8f0;"><th style="padding:6px;">Class</th><th style="padding:6px;">Count</th><th style="padding:6px;">Prior Probability P(C)</th><th style="padding:6px;">Prior %</th></tr></thead>
                <tbody>
                  ${res.classes.map(c => `
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:6px; font-weight:bold;">${c}</td>
                      <td style="padding:6px;">${res.classPriors[c].count}</td>
                      <td style="padding:6px; font-weight:bold; color:#2563eb;">${res.classPriors[c].prior.toFixed(4)}</td>
                      <td style="padding:6px;">${res.classPriors[c].priorPct}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div style="background:#eff6ff; padding:10px 14px; border-radius:8px; margin-top:10px; font-size:0.85rem;">
              <strong>Query Instance X to Classify:</strong> ${Object.entries(testInst).map(([k,v]) => `${k}=${v}`).join(', ')}
            </div>
          </div>
        `,
        renderViz: () => this.drawNaiveBayes(visualizerContainer, res, testInst)
      });

      steps.push({
        title: "Bayes' Theorem & Laplace-Smoothed Likelihood Formulas",
        html: `
          <div class="card p-4" style="background:#eff6ff; border-left:4px solid #2563eb; border-radius:8px; padding:14px;">
            <h4 style="font-size:1rem; font-weight:700; color:#1e40af; margin-bottom:6px;">2. Governing Probability Formulas</h4>
            <div style="font-family:monospace; font-size:0.88rem; line-height:1.7; color:#1e3a8a;">
              &bull; <strong>Bayes' Rule:</strong> P(C_j | X) &prop; P(C_j) &times; &prod; P(x_i | C_j)<br>
              &bull; <strong>Laplace Correction:</strong> P(x_i | C_j) = (count(x_i, C_j) + 1) / (|C_j| + |V_i|)<br>
              &bull; <strong>MAP Decision Rule:</strong> Choose Class C* = argmax P(C_j | X)
            </div>
          </div>
        `,
        renderViz: () => this.drawNaiveBayes(visualizerContainer, res, testInst)
      });

      steps.push({
        title: "Conditional Likelihood Computations for Each Class",
        html: `
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">3. Conditional Feature Likelihoods</h4>
            ${res.classes.map(cls => `
              <div style="margin-bottom:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
                <strong style="color:#2563eb; font-size:0.92rem;">Class "${cls}":</strong>
                <div style="font-size:0.85rem; font-family:monospace; margin-top:4px; line-height:1.6;">
                  ${Object.entries(res.likelihoods[cls].features).map(([feat, details]) => `
                    &bull; P(${feat}="${details.value}" | ${cls}) = (${details.count}+1)/(${details.total}+${details.vocabSize}) = <strong>${details.probability}</strong>
                  `).join('<br>')}
                  <div style="margin-top:6px; font-weight:bold; color:#0f172a;">
                    Raw Posterior Score = P(${cls}) &times; &prod; P(x_i | ${cls}) = <span style="color:#2563eb;">${res.likelihoods[cls].rawScore}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `,
        renderViz: () => this.drawNaiveBayes(visualizerContainer, res, testInst)
      });

      steps.push({
        title: "Posterior Probability Normalization & MAP Prediction",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:18px;">
            <h4 style="font-size:1.1rem; font-weight:800; color:#166534; margin:0 0 8px;">FINAL PREDICTED CLASS: "${res.predictedClass}" (${res.confidence})</h4>
            <p style="font-size:0.95rem; color:#15803d; margin:0 0 10px;">
              By the Maximum A Posteriori (MAP) decision rule, instance X is classified as <strong>"${res.predictedClass}"</strong> with <strong>${res.confidence}</strong> normalized posterior probability.
            </p>
            <table style="width:100%; border-collapse:collapse; font-size:0.88rem; background:white; border-radius:6px; overflow:hidden;">
              <thead><tr style="background:#dcfce7; text-align:left;"><th style="padding:6px;">Class</th><th style="padding:6px;">Raw Score</th><th style="padding:6px;">Normalized Posterior</th><th style="padding:6px;">Verdict</th></tr></thead>
              <tbody>
                ${res.classes.map(c => `
                  <tr style="border-top:1px solid #e2e8f0;">
                    <td style="padding:6px; font-weight:bold;">${c}</td>
                    <td style="padding:6px;">${res.likelihoods[c].rawScore}</td>
                    <td style="padding:6px; font-weight:bold; color:${c === res.predictedClass ? '#059669' : '#334155'};">${(res.posteriors[c]*100).toFixed(2)}%</td>
                    <td style="padding:6px; font-weight:bold;">${c === res.predictedClass ? '<span style="color:#059669;">Optimal Winner &check;</span>' : '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `,
        renderViz: () => this.drawNaiveBayes(visualizerContainer, res, testInst)
      });

      examContent = `
        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:20px; font-size:0.92rem; line-height:1.8;">
          <h4 style="color:#1e3a8a; font-size:1.05rem; font-weight:800; margin:0 0 8px;">University Exam Format &bull; Naive Bayes [10 Marks]</h4>
          1. <strong>Prior Probabilities (2 Marks):</strong> ${res.classes.map(c => `P(${c}) = ${res.classPriors[c].count}/${rows.length}`).join(' , ')}.<br>
          2. <strong>Conditional Likelihoods (5 Marks):</strong> Calculated Laplace-smoothed feature probabilities for each feature.<br>
          3. <strong>Posterior Product &amp; Normalization (2 Marks):</strong> Multiplied priors and likelihoods.<br>
          4. <strong>Final Classification (1 Mark):</strong> MAP Decision classifies query as <strong>"${res.predictedClass}"</strong>.
        </div>
      `;

      practiceAnswerExpected = String(res.predictedClass);
      practiceHintText = `Compare posterior scores: the class with the maximum posterior probability product wins.`;
      practiceExplanation = `Class "${res.predictedClass}" achieves the highest posterior probability (${res.confidence}).`;
      practiceContent = `
        <div style="background:#fffbeb; border:1.5px solid #fde68a; border-radius:10px; padding:20px;">
          <h4 style="color:#92400e; font-size:1.05rem; font-weight:800; margin:0 0 8px;">PRACTICE CHALLENGE &bull; NAIVE BAYES</h4>
          <p style="font-size:0.92rem; color:#78350f; margin-bottom:12px;">What is the predicted target class for the query instance?</p>
          <div style="display:flex; gap:10px; max-width:400px; margin-bottom:12px;">
            <input type="text" id="practice-ans-input" placeholder="e.g. ${res.predictedClass}" style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.95rem;">
            <button id="btn-practice-check" class="btn btn-primary" style="background:#2563eb; color:white;">Check Answer</button>
          </div>
          <div id="practice-feedback-box" style="display:none; padding:12px; border-radius:8px; font-size:0.9rem;"></div>
        </div>
      `;
    }

    // ==============================================================
    // 5. SIMPLE LINEAR REGRESSION (OLS)
    // ==============================================================
    else if (algo === 'regression') {
      const { points } = this.parseInputXYSeries(inputVal);
      const pts = points;
      if (!pts || pts.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for Linear Regression</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Linear regression requires at least 2 paired numeric coordinates (x, y) (e.g. P1: 1, 2; P2: 2, 3; or X: 1, 2, 3 and Y: 2, 3, 5). Please enter your coordinates above, or click below to load a sample.</p>
            <button id="btn-load-sample-reg" class="btn btn-outline btn-sm" style="border-radius:6px; font-weight:700;">Load Linear Regression Exam Sample</button>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        const sampleBtn = bodyContainer.querySelector('#btn-load-sample-reg');
        if (sampleBtn) {
          sampleBtn.onclick = () => {
            const sampleText = "P1: 1, 2\nP2: 2, 3\nP3: 3, 5\nP4: 4, 7\nP5: 5, 9";
            const inputField = this.mount.querySelector('#extracted-values-input');
            if (inputField) inputField.value = sampleText;
            this.runAcademicSolution('regression', sampleText);
          };
        }
        return;
      }
      const res = NumericalEngine.linearRegression(pts);

      steps.push({
        title: "Input Coordinates & Problem Setup",
        html: `
          <div class="card p-4" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">1. Input Data Series (${pts.length} Pairs)</h4>
            <div style="background:white; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-family:monospace; font-size:0.88rem;">
              ${pts.map((p, i) => `P${i+1}(${p.x}, ${p.y})`).join(' | ')}
            </div>
          </div>
        `,
        renderViz: () => this.drawRegressionCanvas(visualizerContainer, pts, null)
      });

      steps.push({
        title: "Intermediate Summation Table (&sum;x, &sum;y, &sum;x&sup2;, &sum;xy)",
        html: `
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">2. Intermediate Sums Table</h4>
            <table style="width:100%; border-collapse:collapse; font-size:0.88rem; font-family:monospace;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:1px solid #cbd5e1; text-align:left;">
                  <th style="padding:6px;">i</th><th style="padding:6px;">x</th><th style="padding:6px;">y</th>
                  <th style="padding:6px;">x&sup2;</th><th style="padding:6px;">y&sup2;</th><th style="padding:6px;">xy</th>
                </tr>
              </thead>
              <tbody>
                ${res.steps.table.map((r, i) => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:6px;">${i+1}</td><td style="padding:6px;">${r.x}</td><td style="padding:6px;">${r.y}</td>
                    <td style="padding:6px;">${r.x2}</td><td style="padding:6px;">${r.y2}</td><td style="padding:6px;">${r.xy}</td>
                  </tr>
                `).join('')}
                <tr style="background:#f1f5f9; font-weight:bold; border-top:2px solid #cbd5e1;">
                  <td style="padding:6px;">&sum;</td><td style="padding:6px;">${res.steps.sumX}</td><td style="padding:6px;">${res.steps.sumY}</td>
                  <td style="padding:6px;">${res.steps.sumX2}</td><td style="padding:6px;">${res.steps.sumY2}</td><td style="padding:6px;">${res.steps.sumXY}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
        renderViz: () => this.drawRegressionCanvas(visualizerContainer, pts, null)
      });

      steps.push({
        title: "Slope (m) and Intercept (b) Numerical Substitution",
        html: `
          <div class="card p-4" style="background:#eff6ff; border-left:4px solid #2563eb; border-radius:8px; padding:14px;">
            <h4 style="font-size:1rem; font-weight:700; color:#1e40af; margin-bottom:6px;">3. OLS Formula Substitutions</h4>
            <div style="font-family:monospace; font-size:0.88rem; line-height:1.6; color:#1e3a8a;">
              &bull; m = (${pts.length} &times; ${res.steps.sumXY} - ${res.steps.sumX} &times; ${res.steps.sumY}) / (${pts.length} &times; ${res.steps.sumX2} - (${res.steps.sumX})&sup2;) = <strong>${res.slope}</strong><br>
              &bull; b = (${res.steps.sumY} - ${res.slope} &times; ${res.steps.sumX}) / ${pts.length} = <strong>${res.intercept}</strong>
            </div>
          </div>
        `,
        renderViz: () => this.drawRegressionCanvas(visualizerContainer, pts, res)
      });

      steps.push({
        title: "Final Regression Equation & Fitted Scatter Trendline",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:18px;">
            <h4 style="font-size:1.1rem; font-weight:800; color:#166534; margin:0 0 8px;">FINAL REGRESSION EQUATION</h4>
            <p style="font-size:0.95rem; color:#15803d; margin:0;">
              Best-fit line equation: <strong>${res.equation}</strong><br>
              Slope m = <strong>${res.slope}</strong> | Intercept b = <strong>${res.intercept}</strong> | R&sup2; = <strong>${res.rSquared}</strong>
            </p>
          </div>
        `,
        renderViz: () => this.drawRegressionCanvas(visualizerContainer, pts, res)
      });

      examContent = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px; font-size:0.92rem; line-height:1.7;">
          <strong style="color:#2563eb; font-size:1.05rem;">University Exam Format &bull; Linear Regression [10 Marks]</strong><br>
          1. <strong>Formulas (3 Marks):</strong> m = (n&sum;xy - &sum;x&sum;y)/(n&sum;x&sup2;-(&sum;x)&sup2;) | b = &ymacr; - m&xmacr;.<br>
          2. <strong>Calculations (4 Marks):</strong> n=${pts.length}, &sum;x=${res.steps.sumX}, &sum;y=${res.steps.sumY}, &sum;xy=${res.steps.sumXY}.<br>
          3. <strong>Final Line (3 Marks):</strong> &ycirc; = ${res.slope}x + (${res.intercept}) with R&sup2; = ${res.rSquared}.
        </div>
      `;

      practiceAnswerExpected = String(res.slope);
      practiceHintText = `Slope m = (n&sum;xy - &sum;x&sum;y)/(n&sum;x&sup2;-(&sum;x)&sup2;).`;
      practiceExplanation = `Calculated slope m = ${res.slope}.`;

      practiceContent = `
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:20px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:#92400e; margin:0 0 8px;">PRACTICE CHALLENGE &bull; REGRESSION</h4>
          <p style="font-size:0.92rem; color:#78350f; margin-bottom:12px;">
            What is the computed <strong>slope (m)</strong> for the best-fit line? (Round to 2 decimal places):
          </p>
          <div style="display:flex; gap:10px; max-width:400px; margin-bottom:12px;">
            <input type="text" id="practice-ans-input" placeholder="e.g. ${res.slope}" style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.95rem;">
            <button id="btn-practice-check" class="btn btn-primary" style="background:#2563eb; color:white;">Check Answer</button>
          </div>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <button id="btn-practice-hint" class="btn btn-outline btn-sm">Show Step Hint</button>
            <button id="btn-practice-solution" class="btn btn-outline btn-sm">Reveal Answer</button>
          </div>
          <div id="practice-feedback-box" style="display:none; padding:12px; border-radius:8px; font-size:0.9rem;"></div>
        </div>
      `;
    }

    // ==============================================================
    // 6. APRIORI ASSOCIATION RULE MINING
    // ==============================================================
    else if (algo === 'apriori') {
      const tx = this.parseInputTransactions(inputVal);
      if (!tx || tx.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for Apriori &amp; Association Rules</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Apriori algorithm requires at least 2 transactions with comma-separated items (e.g., T1: Milk, Bread; T2: Bread, Butter). Please enter your transaction list above, or click below to load a sample transaction database.</p>
            <button id="btn-load-sample-apr" class="btn btn-outline btn-sm" style="border-radius:6px; font-weight:700;">Load Apriori Exam Sample Transactions</button>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        const sampleBtn = bodyContainer.querySelector('#btn-load-sample-apr');
        if (sampleBtn) {
          sampleBtn.onclick = () => {
            const sampleText = "T1: Milk, Bread, Eggs\nT2: Bread, Butter\nT3: Milk, Bread, Butter\nT4: Milk, Eggs\nT5: Bread, Butter";
            const inputField = this.mount.querySelector('#extracted-values-input');
            if (inputField) inputField.value = sampleText;
            this.runAcademicSolution('apriori', sampleText);
          };
        }
        return;
      }
      const res = NumericalEngine.apriori(tx, 40, 60);

      steps.push({
        title: "Input Transaction Database & Parameters",
        html: `
          <div class="card p-4" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">1. Transaction Database (|D| = ${tx.length})</h4>
            <div style="background:white; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-family:monospace; font-size:0.85rem;">
              ${tx.map(t => `<strong>${t.id}</strong>: {${t.items.join(', ')}}`).join('<br>')}
            </div>
            <p style="font-size:0.85rem; margin-top:8px;">Min Support = <strong>40%</strong> (&ge; ${Math.ceil(tx.length*0.4)} tx) | Min Confidence = <strong>60%</strong></p>
          </div>
        `,
        renderViz: () => this.drawApriori(visualizerContainer, res)
      });

      res.steps.forEach(st => {
        steps.push({
          title: `Iteration ${st.k}: Candidate Generation C_${st.k} & Frequent Set L_${st.k}`,
          html: `
            <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
              <strong style="color:#2563eb; font-size:0.95rem;">Iteration ${st.k} (${st.k}-Itemsets):</strong>
              <div style="margin-top:8px; font-size:0.88rem;">
                &bull; <strong>Candidate Set C_${st.k}:</strong> ${st.candidateItemsets.map(c => `{${c.itemset.join(',')}} (sup: ${c.supportCount})`).join(', ')}<br>
                &bull; <strong>Frequent Set L_${st.k} (Pruned):</strong> ${st.frequentItemsets.length > 0 ? st.frequentItemsets.map(f => `<strong>{${f.itemset.join(',')}}</strong> (sup: ${f.supportCount}, ${f.supportPercentage}%)`).join(', ') : 'None'}
              </div>
            </div>
          `,
          renderViz: () => this.drawApriori(visualizerContainer, res)
        });
      });

      steps.push({
        title: "Strong Association Rules Generation (Confidence &ge; 60%)",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:18px;">
            <h4 style="font-size:1.1rem; font-weight:800; color:#166534; margin:0 0 8px;">STRONG ASSOCIATION RULES</h4>
            ${res.rules.length > 0 ? `
              <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
                <thead><tr style="background:#dcfce7; text-align:left;"><th style="padding:6px;">Rule (X &rarr; Y)</th><th style="padding:6px;">Support %</th><th style="padding:6px;">Confidence %</th><th style="padding:6px;">Lift</th></tr></thead>
                <tbody>
                  ${res.rules.map(r => `
                    <tr style="border-top:1px solid #e2e8f0;">
                      <td style="padding:6px; font-weight:bold; color:#166534;">{${Array.isArray(r.antecedent) ? r.antecedent.join(',') : r.antecedent}} &rarr; {${Array.isArray(r.consequent) ? r.consequent.join(',') : r.consequent}}</td>
                      <td style="padding:6px;">${r.supportPercentage}%</td>
                      <td style="padding:6px; font-weight:bold;">${r.confidencePercentage}%</td>
                      <td style="padding:6px;">${r.lift}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p style="color:#15803d; margin:0;">No rules satisfied minimum confidence threshold.</p>'}
          </div>
        `,
        renderViz: () => this.drawApriori(visualizerContainer, res)
      });

      examContent = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px; font-size:0.92rem; line-height:1.7;">
          <strong style="color:#2563eb; font-size:1.05rem;">University Exam Format &bull; Apriori Rules [10 Marks]</strong><br>
          1. <strong>Formulas (3 Marks):</strong> Support = count(X &cup; Y)/|D| | Confidence = count(X &cup; Y)/count(X).<br>
          2. <strong>Frequent Itemsets (4 Marks):</strong> Generated frequent sets up to level ${res.steps.length}.<br>
          3. <strong>Rules (3 Marks):</strong> ${res.rules.map(r => `{${Array.isArray(r.antecedent) ? r.antecedent.join(',') : r.antecedent}} &rarr; {${Array.isArray(r.consequent) ? r.consequent.join(',') : r.consequent}} [Conf: ${r.confidencePercentage}%, Lift: ${r.lift}]`).join(' | ')}.
        </div>
      `;

      const firstRule = res.rules[0];
      practiceAnswerExpected = firstRule ? String(Math.round(firstRule.confidencePercentage)) : "60";
      practiceHintText = `Confidence(X &rarr; Y) = count(X &cup; Y) / count(X) &times; 100%.`;
      practiceExplanation = `Rule confidence is ${practiceAnswerExpected}%.`;

      practiceContent = `
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:20px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:#92400e; margin:0 0 8px;">PRACTICE CHALLENGE &bull; APRIORI</h4>
          <p style="font-size:0.92rem; color:#78350f; margin-bottom:12px;">
            What is the confidence percentage of the top mined rule?
          </p>
          <div style="display:flex; gap:10px; max-width:400px; margin-bottom:12px;">
            <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.95rem;">
            <button id="btn-practice-check" class="btn btn-primary" style="background:#2563eb; color:white;">Check Answer</button>
          </div>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <button id="btn-practice-hint" class="btn btn-outline btn-sm">Show Step Hint</button>
            <button id="btn-practice-solution" class="btn btn-outline btn-sm">Reveal Answer</button>
          </div>
          <div id="practice-feedback-box" style="display:none; padding:12px; border-radius:8px; font-size:0.9rem;"></div>
        </div>
      `;
    }

    // ==============================================================
    // 7. DATA NORMALIZATION (MIN-MAX & Z-SCORE)
    // ==============================================================
    else if (algo === 'normalization') {
      const nums = this.parseInputNumbers(inputVal);
      if (nums.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for Normalization</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Normalization requires at least 2 numeric values (e.g., 200, 300, 450, 600, 1000). Please enter values above, or click below to load a sample.</p>
            <button id="btn-load-sample-norm" class="btn btn-outline btn-sm" style="border-radius:6px; font-weight:700;">Load Normalization Sample</button>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        const sampleBtn = bodyContainer.querySelector('#btn-load-sample-norm');
        if (sampleBtn) {
          sampleBtn.onclick = () => {
            const sampleText = "200, 300, 400, 600, 1000";
            const inputField = this.mount.querySelector('#extracted-values-input');
            if (inputField) inputField.value = sampleText;
            this.runAcademicSolution('normalization', sampleText);
          };
        }
        return;
      }
      const minMaxRes = NumericalEngine.normalization(nums, 'minmax', 0, 1);
      const zscoreRes = NumericalEngine.normalization(nums, 'zscore');

      steps.push({
        title: "Input Values & Summary Statistics",
        html: `
          <div class="card p-4" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
            <h4 style="font-size:1rem; font-weight:700; color:#334155; margin-bottom:8px;">1. Raw Input Attribute Values</h4>
            <p style="font-size:0.88rem; font-family:monospace; background:white; padding:10px; border-radius:6px; border:1px solid #cbd5e1;">[${nums.join(', ')}]</p>
            <div style="font-size:0.88rem; line-height:1.6; margin-top:8px;">
              &bull; <strong>Min:</strong> ${minMaxRes.min} | <strong>Max:</strong> ${minMaxRes.max} | <strong>Range:</strong> ${minMaxRes.range}<br>
              &bull; <strong>Mean (&mu;):</strong> ${zscoreRes.mean} | <strong>Std Dev (&sigma;):</strong> ${zscoreRes.stdDev}
            </div>
          </div>
        `
      });

      steps.push({
        title: "Min-Max Normalization to [0, 1]",
        html: `
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <h4 style="color:#2563eb; margin:0 0 6px;">Min-Max Transformation: v' = (v - min) / (max - min)</h4>
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; font-family:monospace;">
              <thead><tr style="background:#f1f5f9;"><th style="padding:6px;">Original (v)</th><th style="padding:6px;">Substitution</th><th style="padding:6px;">Normalized (v')</th></tr></thead>
              <tbody>
                ${minMaxRes.steps.map(s => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:6px; font-weight:bold;">${s.raw}</td>
                    <td style="padding:6px; color:#475569;">${s.formula}</td>
                    <td style="padding:6px; font-weight:bold; color:#059669;">${s.result}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `
      });

      steps.push({
        title: "Z-Score Normalization (Zero-Mean Unit-Variance)",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px;">
            <h4 style="color:#166534; margin:0 0 6px;">Z-Score Transformation: v' = (v - &mu;) / &sigma;</h4>
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; font-family:monospace; background:white; border-radius:6px; overflow:hidden;">
              <thead><tr style="background:#dcfce7;"><th style="padding:6px;">Original (v)</th><th style="padding:6px;">Substitution</th><th style="padding:6px;">Z-Score (v')</th></tr></thead>
              <tbody>
                ${zscoreRes.steps.map(s => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:6px; font-weight:bold;">${s.raw}</td>
                    <td style="padding:6px; color:#475569;">${s.formula}</td>
                    <td style="padding:6px; font-weight:bold; color:#2563eb;">${s.result}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `
      });

      examContent = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:20px; font-size:0.92rem; line-height:1.7;">
          <strong style="color:#2563eb; font-size:1.05rem;">University Exam Format &bull; Data Normalization [10 Marks]</strong><br>
          1. <strong>Min-Max Formula (3 Marks):</strong> v' = (v - min)/(max - min) &times; (new_max - new_min) + new_min.<br>
          2. <strong>Z-Score Formula (3 Marks):</strong> v' = (v - &mu;)/&sigma;.<br>
          3. <strong>Computed Results (4 Marks):</strong> Min=${minMaxRes.min}, Max=${minMaxRes.max}, Mean=${zscoreRes.mean}, &sigma;=${zscoreRes.stdDev}.
        </div>
      `;
      practiceAnswerExpected = String(minMaxRes.steps[0]?.result || "0");
      practiceHintText = `Formula: (v - min) / (max - min).`;
      practiceExplanation = `Result for first value is ${practiceAnswerExpected}.`;
      practiceContent = `<div style="padding:16px;">Practice problem ready for normalization.</div>`;
    }

    // ==============================================================
    // 8. DATA BINNING & SMOOTHING
    // ==============================================================
    else if (algo === 'binning') {
      const nums = this.parseInputNumbers(inputVal);
      if (nums.length < 2) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for Binning</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">Binning requires a numeric sequence (e.g. 4, 8, 9, 15, 21, 21, 24, 25, 26, 28, 29, 34). Please provide numbers above.</p>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        return;
      }
      const res = NumericalEngine.binning(nums, 3, 'depth', 'means');
      steps.push({
        title: "Sorted Data & Binning Partitioning",
        html: `
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <h4 style="color:#2563eb; margin:0 0 8px;">Sorted Numbers (${nums.length} values)</h4>
            <p style="font-family:monospace; background:white; padding:10px; border-radius:6px; border:1px solid #cbd5e1;">[${res.sortedData.join(', ')}]</p>
          </div>
        `
      });
      steps.push({
        title: "Equi-Depth Bins & Smoothing by Bin Means",
        html: `
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; font-family:monospace;">
              <thead><tr style="background:#f1f5f9;"><th style="padding:6px;">Bin</th><th style="padding:6px;">Raw Partition</th><th style="padding:6px;">Bin Mean</th><th style="padding:6px;">Smoothed Values</th></tr></thead>
              <tbody>
                ${res.bins.map(b => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:6px; font-weight:bold;">Bin ${b.binNumber}</td>
                    <td style="padding:6px;">[${b.values.join(', ')}]</td>
                    <td style="padding:6px; font-weight:bold; color:#2563eb;">${b.mean}</td>
                    <td style="padding:6px; font-weight:bold; color:#059669;">[${b.smoothedValues.join(', ')}]</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `
      });
      examContent = steps[1].html;
      practiceAnswerExpected = String(res.bins[0]?.mean || "0");
      practiceHintText = `Compute average of values inside Bin 1.`;
      practiceExplanation = `Bin 1 mean = ${practiceAnswerExpected}.`;
      practiceContent = `<div style="padding:16px;">Practice question ready for Binning.</div>`;
    }

    // ==============================================================
    // 9. OUTLIER DETECTION (IQR)
    // ==============================================================
    else if (algo === 'iqr') {
      const nums = this.parseInputNumbers(inputVal);
      if (nums.length < 4) {
        bodyContainer.innerHTML = `
          <div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:20px; color:#991b1b;">
            <h4 style="margin:0 0 8px; font-weight:800; font-size:1.05rem;">Input Clarification Required for IQR</h4>
            <p style="margin:0 0 12px; font-size:0.92rem;">IQR outlier detection requires at least 4 numbers (e.g. 12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65). Please provide numbers above.</p>
          </div>
        `;
        visualizerContainer.style.display = 'none';
        return;
      }
      const res = NumericalEngine.iqr(nums);
      steps.push({
        title: "Sorted Dataset & Five-Number Summary",
        html: `
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <h4 style="color:#2563eb; margin:0 0 6px;">Quartiles &amp; Interquartile Range (IQR)</h4>
            <div style="font-size:0.88rem; line-height:1.7;">
              &bull; <strong>Q1 (25th Percentile):</strong> ${res.q1}<br>
              &bull; <strong>Median / Q2 (50th Percentile):</strong> ${res.median}<br>
              &bull; <strong>Q3 (75th Percentile):</strong> ${res.q3}<br>
              &bull; <strong>IQR = Q3 - Q1:</strong> ${res.iqr}
            </div>
          </div>
        `
      });
      steps.push({
        title: "Inner & Outer Fences & Identified Outliers",
        html: `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px;">
            <h4 style="color:#166534; margin:0 0 6px;">Tukey Fences &amp; Outlier Flags</h4>
            <div style="font-size:0.88rem; line-height:1.7;">
              &bull; <strong>Lower Fence = Q1 - 1.5 &times; IQR:</strong> ${res.lowerFence}<br>
              &bull; <strong>Upper Fence = Q3 + 1.5 &times; IQR:</strong> ${res.upperFence}<br>
              &bull; <strong>Detected Outliers:</strong> <span style="font-weight:bold; color:${res.outliers.length>0?'#dc2626':'#059669'};">${res.outliers.length>0 ? res.outliers.join(', ') : 'None (No values lie outside fences)'}</span>
            </div>
          </div>
        `
      });
      examContent = steps[1].html;
      practiceAnswerExpected = String(res.iqr);
      practiceHintText = `IQR = Q3 - Q1.`;
      practiceExplanation = `IQR is ${practiceAnswerExpected}.`;
      practiceContent = `<div style="padding:16px;">Practice question ready for IQR.</div>`;
    }

    // Fallback: Generate generic steps using generateSolutionSteps
    else {
      const generated = generateSolutionSteps(algo, inputVal);
      if (generated && generated.steps && generated.steps.length > 0) {
        steps.push(...generated.steps);
        examContent = generated.examContent || '';
        practiceContent = generated.practiceContent || '';
        practiceAnswerExpected = generated.practiceAnswerExpected || '';
        practiceHintText = generated.practiceHintText || '';
        practiceExplanation = generated.practiceExplanation || '';
      } else {
        steps.push({
          title: `Problem Formulation &bull; ${this.detectedAlgoName}`,
          html: `
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
              <h4 style="color:#2563eb; margin:0 0 8px;">Input Data Extracted</h4>
              <pre style="font-size:0.85rem; margin:0;">${inputVal}</pre>
            </div>
          `
        });
        steps.push({
          title: `Step-by-Step Derivation &bull; ${this.detectedAlgoName}`,
          html: `
            <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
              <p>Calculations executed successfully. Switch to the dedicated engine tab below for interactive parameter adjustments.</p>
            </div>
          `
        });
      }
    }

    // ==============================================================
    // STEP CONTROLLER IMPLEMENTATION (STATE MACHINE)
    // ==============================================================
    let currentStepIndex = 0;
    const totalSteps = steps.length;
    let showAllActive = false;

    const updateStepUI = (index) => {
      currentStepIndex = Math.max(0, Math.min(index, totalSteps - 1));
      showAllActive = false;

      // Update Header Badges
      solutionContainer.querySelector('#step-counter-badge').innerText = `Step ${currentStepIndex + 1} of ${totalSteps}`;
      solutionContainer.querySelector('#step-title-display').innerText = steps[currentStepIndex].title;
      solutionContainer.querySelector('#step-progress-fill').style.width = `${((currentStepIndex + 1) / totalSteps) * 100}%`;

      // Update Buttons State
      solutionContainer.querySelector('#btn-ctrl-prev').disabled = (currentStepIndex === 0);
      solutionContainer.querySelector('#btn-ctrl-next').disabled = (currentStepIndex === totalSteps - 1);

      // Render Step HTML
      bodyContainer.innerHTML = steps[currentStepIndex].html;

      // Render Dynamic Visualizer for this step
      if (typeof steps[currentStepIndex].renderViz === 'function') {
        visualizerContainer.style.display = 'block';
        steps[currentStepIndex].renderViz();
      } else {
        visualizerContainer.style.display = 'none';
      }

      if (window.lucide) window.lucide.createIcons();
    };

    const showAllStepsUI = () => {
      showAllActive = true;
      solutionContainer.querySelector('#step-counter-badge').innerText = `Full Solution (All ${totalSteps} Steps)`;
      solutionContainer.querySelector('#step-title-display').innerText = "Complete Step Derivation";
      solutionContainer.querySelector('#step-progress-fill').style.width = '100%';

      solutionContainer.querySelector('#btn-ctrl-prev').disabled = false;
      solutionContainer.querySelector('#btn-ctrl-next').disabled = true;

      bodyContainer.innerHTML = steps.map((s, i) => `
        <div style="margin-bottom:18px;">
          <div style="font-weight:700; color:#2563eb; margin-bottom:6px; font-size:0.95rem;">
            Step ${i+1}: ${s.title}
          </div>
          ${s.html}
        </div>
      `).join('');

      // Show final visualizer
      const lastStep = steps[steps.length - 1];
      if (typeof lastStep.renderViz === 'function') {
        visualizerContainer.style.display = 'block';
        lastStep.renderViz();
      }

      if (window.lucide) window.lucide.createIcons();
    };

    // Bind step controller buttons
    solutionContainer.querySelector('#btn-ctrl-reset').onclick = () => updateStepUI(0);
    solutionContainer.querySelector('#btn-ctrl-prev').onclick = () => updateStepUI(currentStepIndex - 1);
    solutionContainer.querySelector('#btn-ctrl-next').onclick = () => updateStepUI(currentStepIndex + 1);
    solutionContainer.querySelector('#btn-ctrl-run-all').onclick = () => {
      // Animate through steps
      let cur = currentStepIndex;
      const timer = setInterval(() => {
        cur++;
        if (cur >= totalSteps) {
          clearInterval(timer);
          updateStepUI(totalSteps - 1);
        } else {
          updateStepUI(cur);
        }
      }, 400);
    };
    solutionContainer.querySelector('#btn-ctrl-full').onclick = () => showAllStepsUI();

    // Mode Toggle Buttons (Detailed Learn vs Exam vs Practice)
    const btnDetailed = solutionContainer.querySelector('#btn-sol-mode-detailed');
    const btnExam = solutionContainer.querySelector('#btn-sol-mode-exam');
    const btnPractice = solutionContainer.querySelector('#btn-sol-mode-practice');
    const toolbar = solutionContainer.querySelector('#step-player-toolbar');

    const setSolMode = (mode) => {
      [btnDetailed, btnExam, btnPractice].forEach(b => {
        b.className = 'btn btn-outline btn-sm';
        b.style.background = 'white';
        b.style.color = '#334155';
      });

      if (mode === 'detailed') {
        btnDetailed.className = 'btn btn-primary btn-sm';
        btnDetailed.style.background = '#2563eb';
        btnDetailed.style.color = 'white';
        toolbar.style.display = 'block';
        visualizerContainer.style.display = 'block';
        updateStepUI(currentStepIndex);
      } else if (mode === 'exam') {
        btnExam.className = 'btn btn-primary btn-sm';
        btnExam.style.background = '#2563eb';
        btnExam.style.color = 'white';
        toolbar.style.display = 'none';
        visualizerContainer.style.display = 'none';
        bodyContainer.innerHTML = examContent;
      } else if (mode === 'practice') {
        btnPractice.className = 'btn btn-primary btn-sm';
        btnPractice.style.background = '#2563eb';
        btnPractice.style.color = 'white';
        toolbar.style.display = 'none';
        visualizerContainer.style.display = 'none';
        bodyContainer.innerHTML = practiceContent;
        this.bindPracticeHandlers(bodyContainer, practiceAnswerExpected, practiceHintText, practiceExplanation);
      }
      if (window.lucide) window.lucide.createIcons();
    };

    btnDetailed.onclick = () => setSolMode('detailed');
    btnExam.onclick = () => setSolMode('exam');
    btnPractice.onclick = () => setSolMode('practice');

    // Save, download & print buttons
    const btnSave = solutionContainer.querySelector('#btn-save-sol-history');
    if (btnSave) {
      btnSave.onclick = () => {
        this.saveSolutionToHistory(this.detectedAlgoName, inputVal, solutionContainer.innerText.substring(0, 120));
        alert('Solution saved to history! You can access it anytime from "Saved Solutions History".');
        this.renderHistoryDrawer();
      };
    }

    solutionContainer.querySelector('#btn-download-sol').onclick = () => {
      ReportExporter.exportNumericalSolution(this.detectedAlgoName, solutionContainer.innerText);
    };

    solutionContainer.querySelector('#btn-print-sol').onclick = () => {
      ReportExporter.printAcademicReport(this.detectedAlgoName, solutionContainer.innerHTML);
    };

    // Initialize to Step 1
    updateStepUI(0);
    solutionContainer.scrollIntoView({ behavior: 'smooth' });
  }

  // ==============================================================
  // DYNAMIC VISUALIZERS (CANVAS, DENDROGRAM, DECISION TREE)
  // ==============================================================

  drawKMeansCanvas(container, points, centroids, clusters) {
    container.innerHTML = `
      <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:14px; text-align:center;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <strong style="font-size:0.9rem; color:#334155;">Dynamic 2D Cluster Canvas &bull; Current Step State</strong>
          <span style="font-size:0.75rem; color:#64748b;">${points.length} Points | ${centroids.length} Centroids</span>
        </div>
        <canvas id="active-km-canvas" width="500" height="260" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; width:100%; max-width:500px; height:auto;"></canvas>
      </div>
    `;

    setTimeout(() => {
      const canvas = container.querySelector('#active-km-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const allX = points.map(p => p.x);
      const allY = points.map(p => p.y);
      const minX = Math.min(...allX) - 1, maxX = Math.max(...allX) + 1;
      const minY = Math.min(...allY) - 1, maxY = Math.max(...allY) + 1;

      const toScreenX = (x) => 35 + ((x - minX) / (maxX - minX || 1)) * (w - 70);
      const toScreenY = (y) => h - 30 - ((y - minY) / (maxY - minY || 1)) * (h - 60);

      // Grid & Axes
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(35, 10); ctx.lineTo(35, h - 30); ctx.lineTo(w - 15, h - 30);
      ctx.stroke();

      const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

      // Draw clusters
      if (clusters && clusters.length > 0) {
        clusters.forEach((clusterPts, cIdx) => {
          if (!clusterPts) return;
          const color = colors[cIdx % colors.length];
          const c = centroids[cIdx];
          const cx = c ? toScreenX(c.x) : 0;
          const cy = c ? toScreenY(c.y) : 0;

          clusterPts.forEach(p => {
            if (!p) return;
            const px = toScreenX(p.x), py = toScreenY(p.y);
            if (c) {
              ctx.setLineDash([3, 3]);
              ctx.strokeStyle = color;
              ctx.globalAlpha = 0.35;
              ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy); ctx.stroke();
              ctx.globalAlpha = 1.0;
              ctx.setLineDash([]);
            }
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.font = '10px sans-serif';
            ctx.fillText(p.id, px + 8, py - 4);
          });
        });
      }

      // Draw Centroids
      centroids.forEach((c, idx) => {
        if (!c) return;
        const cx = toScreenX(c.x), cy = toScreenY(c.y);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`C${idx+1}`, cx, cy);
      });
    }, 40);
  }

  drawDendrogram(container, root, steps, currentMergeStep, enableCutSlider = false) {
    if (!root) return;

    let sliderHtml = '';
    if (enableCutSlider) {
      const maxHeight = steps[steps.length - 1]?.distance || 5;
      sliderHtml = `
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <label style="font-size:0.85rem; font-weight:700; color:#1e40af;">Interactive Dendrogram Cut Line:</label>
            <input type="range" id="dendro-cut-slider" min="0" max="${(maxHeight * 1.2).toFixed(2)}" step="0.1" value="${(maxHeight * 0.6).toFixed(2)}" style="vertical-align:middle; width:180px; margin:0 8px;">
            <span id="dendro-cut-val" style="font-weight:bold; color:#2563eb; font-size:0.9rem;">${(maxHeight * 0.6).toFixed(2)}</span>
          </div>
          <div id="dendro-cut-clusters" style="font-size:0.85rem; color:#1e3a8a; font-weight:bold;">
            <!-- Evaluated clusters -->
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
        ${sliderHtml}
        <div style="text-align:center;">
          <strong style="font-size:0.9rem; color:#334155; display:block; margin-bottom:6px;">
            Agglomerative Dendrogram &bull; Merge Heights &amp; Tree Hierarchy
          </strong>
          <canvas id="active-dendro-canvas" width="500" height="220" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; width:100%; max-width:500px; height:auto;"></canvas>
        </div>
      </div>
    `;

    const redraw = (cutLineHeight = null) => {
      const canvas = container.querySelector('#active-dendro-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Collect leaf points in order
      const leaves = [];
      const getLeaves = (n) => {
        if (!n.children) { leaves.push(n); return; }
        n.children.forEach(c => getLeaves(c));
      };
      getLeaves(root);

      const leafSpacing = (w - 80) / (leaves.length || 1);
      const leafPositions = {};
      leaves.forEach((l, i) => {
        leafPositions[l.id || l.label] = 50 + i * leafSpacing + leafSpacing / 2;
      });

      const maxH = steps[steps.length - 1]?.distance || 5;
      const toScreenY = (height) => h - 40 - (height / (maxH * 1.2 || 1)) * (h - 70);

      // Draw leaves
      leaves.forEach(l => {
        const x = leafPositions[l.id || l.label];
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(l.label, x, h - 18);
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath(); ctx.moveTo(x, h - 35); ctx.lineTo(x, toScreenY(0)); ctx.stroke();
      });

      // Draw step merge lines
      steps.slice(0, currentMergeStep || steps.length).forEach((s, i) => {
        const sy = toScreenY(s.distance);
        ctx.strokeStyle = (i === currentMergeStep - 1) ? '#dc2626' : '#2563eb';
        ctx.lineWidth = (i === currentMergeStep - 1) ? 2.5 : 1.5;

        // Draw horizontal merge bar
        const xLeft = 50 + (i * 20) % (w - 120);
        const xRight = xLeft + 60;
        ctx.beginPath();
        ctx.moveTo(xLeft, sy); ctx.lineTo(xRight, sy);
        ctx.stroke();

        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = '9px monospace';
        ctx.fillText(`d=${s.distance}`, (xLeft + xRight) / 2, sy - 4);
      });

      // Draw Horizontal Cut Line if enabled
      if (cutLineHeight !== null) {
        const cutY = toScreenY(cutLineHeight);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(30, cutY); ctx.lineTo(w - 20, cutY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Cut: ${cutLineHeight}`, 35, cutY - 6);
      }
    };

    if (enableCutSlider) {
      const slider = container.querySelector('#dendro-cut-slider');
      const valDisplay = container.querySelector('#dendro-cut-val');
      const clustDisplay = container.querySelector('#dendro-cut-clusters');

      const onCutChange = () => {
        const cutH = parseFloat(slider.value);
        valDisplay.innerText = cutH;
        redraw(cutH);

        const clustersAtCut = NumericalEngine.getHierarchicalClustersAtCut(root, cutH);
        clustDisplay.innerHTML = `Formed ${clustersAtCut.length} Clusters: ${clustersAtCut.map((c, i) => `<strong>C${i+1}</strong>=${c.label}`).join(', ')}`;
      };

      slider.addEventListener('input', onCutChange);
      onCutChange();
    } else {
      setTimeout(() => redraw(null), 40);
    }
  }

  drawDecisionTree(container, rootNode) {
    if (!rootNode) return;

    const renderNodeHtml = (node) => {
      if (node.type === 'leaf') {
        return `
          <div style="background:#f0fdf4; border:1.5px solid #22c55e; border-radius:8px; padding:8px 12px; display:inline-block; margin:4px; text-align:center;">
            <div style="font-size:0.75rem; color:#15803d; font-weight:bold;">LEAF NODE</div>
            <div style="font-size:0.95rem; font-weight:800; color:#166534;">${node.prediction}</div>
            <div style="font-size:0.7rem; color:#64748b;">(samples: ${node.samples})</div>
          </div>
        `;
      }

      const branches = Object.entries(node.children || {});
      return `
        <div style="display:inline-block; text-align:center; margin:6px;">
          <div style="background:#eff6ff; border:1.5px solid #2563eb; border-radius:8px; padding:8px 14px; display:inline-block;">
            <div style="font-size:0.75rem; color:#2563eb; font-weight:bold;">SPLIT NODE</div>
            <div style="font-size:1rem; font-weight:800; color:#1e40af;">${node.attribute}</div>
            <div style="font-size:0.7rem; color:#64748b;">(Gain: ${node.gain || 0} bits)</div>
          </div>
          <div style="display:flex; justify-content:center; gap:16px; margin-top:8px;">
            ${branches.map(([branchVal, childNode]) => `
              <div style="display:flex; flex-direction:column; align-items:center;">
                <span style="font-size:0.75rem; font-weight:bold; background:#e2e8f0; color:#334155; padding:2px 6px; border-radius:4px; margin-bottom:4px;">
                  ${branchVal} &darr;
                </span>
                ${renderNodeHtml(childNode)}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    };

    container.innerHTML = `
      <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px; text-align:center; overflow-x:auto;">
        <strong style="font-size:0.9rem; color:#334155; display:block; margin-bottom:12px;">
          Dynamically Generated Decision Tree Structure
        </strong>
        <div style="display:inline-block; min-width:320px;">
          ${renderNodeHtml(rootNode)}
        </div>
      </div>
    `;
  }

  drawRegressionCanvas(container, points, res) {
    container.innerHTML = `
      <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:14px; text-align:center;">
        <strong style="font-size:0.9rem; color:#334155; display:block; margin-bottom:8px;">
          Linear Regression Scatter Plot &amp; Best-Fit Line
        </strong>
        <canvas id="active-reg-canvas" width="500" height="260" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; width:100%; max-width:500px; height:auto;"></canvas>
      </div>
    `;

    setTimeout(() => {
      const canvas = container.querySelector('#active-reg-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const allX = points.map(p => p.x);
      const allY = points.map(p => p.y);
      const minX = Math.min(0, Math.min(...allX) - 1);
      const maxX = Math.max(...allX) + 1;
      const minY = Math.min(0, Math.min(...allY) - 1);
      const maxY = Math.max(...allY) + 1;

      const toScreenX = (x) => 35 + ((x - minX) / (maxX - minX || 1)) * (w - 70);
      const toScreenY = (y) => h - 30 - ((y - minY) / (maxY - minY || 1)) * (h - 60);

      // Axes
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(35, 10); ctx.lineTo(35, h - 30); ctx.lineTo(w - 15, h - 30);
      ctx.stroke();

      // Data points
      points.forEach((p, idx) => {
        const px = toScreenX(p.x), py = toScreenY(p.y);
        ctx.fillStyle = '#2563eb';
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#334155';
        ctx.font = '10px sans-serif';
        ctx.fillText(`P${idx+1}(${p.x},${p.y})`, px + 8, py - 4);
      });

      // Fitted trendline if res is provided
      if (res && res.slope !== undefined) {
        const x1 = minX;
        const y1 = res.slope * x1 + res.intercept;
        const x2 = maxX;
        const y2 = res.slope * x2 + res.intercept;

        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(toScreenX(x1), toScreenY(y1));
        ctx.lineTo(toScreenX(x2), toScreenY(y2));
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(res.equation, 45, 30);
      }
    }, 40);
  }

  bindPracticeHandlers(container, expectedAns, hintText, explanation) {
    const checkBtn = container.querySelector('#btn-practice-check');
    const hintBtn = container.querySelector('#btn-practice-hint');
    const solBtn = container.querySelector('#btn-practice-solution');
    const input = container.querySelector('#practice-ans-input');
    const fb = container.querySelector('#practice-feedback-box');

    if (checkBtn && input && fb) {
      checkBtn.onclick = () => {
        const userVal = input.value.trim().toLowerCase();
        const expected = expectedAns.trim().toLowerCase();
        const isMatch = userVal === expected || Math.abs(parseFloat(userVal) - parseFloat(expected)) <= 0.05;

        fb.style.display = 'block';
        if (isMatch) {
          fb.style.background = '#f0fdf4';
          fb.style.border = '1px solid #bbf7d0';
          fb.style.color = '#166534';
          fb.innerHTML = `<strong>&check; Correct! Well done!</strong><br>${explanation}`;
        } else {
          fb.style.background = '#fef2f2';
          fb.style.border = '1px solid #fecaca';
          fb.style.color = '#991b1b';
          fb.innerHTML = `<strong>&cross; Not quite right.</strong> Try again or click "Show Step Hint".`;
        }
      };
    }

    if (hintBtn && fb) {
      hintBtn.onclick = () => {
        fb.style.display = 'block';
        fb.style.background = '#eff6ff';
        fb.style.border = '1px solid #bfdbfe';
        fb.style.color = '#1e40af';
        fb.innerHTML = `<strong>Step Hint:</strong> ${hintText}`;
      };
    }

    if (solBtn && fb) {
      solBtn.onclick = () => {
        fb.style.display = 'block';
        fb.style.background = '#f8fafc';
        fb.style.border = '1px solid #cbd5e1';
        fb.style.color = '#1e293b';
        fb.innerHTML = `<strong>Complete Answer:</strong> ${expectedAns}<br>${explanation}`;
      };
    }
  }

  drawNaiveBayes(container, res, testInst) {
    if (!res || !container) return;
    container.innerHTML = `
      <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <strong style="font-size:0.95rem; color:#1e293b;">Naive Bayes Probability Breakdown &amp; Decision</strong>
          <span style="background:#ecfdf5; color:#059669; font-weight:800; font-size:0.82rem; padding:4px 10px; border-radius:6px;">
            Predicted Class: "${res.predictedClass}" (${res.confidence})
          </span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <strong style="font-size:0.85rem; color:#334155; display:block; margin-bottom:8px;">Class Priors P(C)</strong>
            ${res.classes.map(c => `
              <div style="margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:2px;">
                  <span>Class "${c}"</span>
                  <strong>${res.classPriors[c].priorPct}%</strong>
                </div>
                <div style="width:100%; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                  <div style="height:100%; width:${res.classPriors[c].priorPct}%; background:#2563eb;"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <strong style="font-size:0.85rem; color:#334155; display:block; margin-bottom:8px;">Normalized Posterior P(C|X)</strong>
            ${res.classes.map(c => `
              <div style="margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:2px;">
                  <span>Class "${c}"</span>
                  <strong>${(res.posteriors[c] * 100).toFixed(1)}%</strong>
                </div>
                <div style="width:100%; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                  <div style="height:100%; width:${(res.posteriors[c] * 100).toFixed(1)}%; background:${c === res.predictedClass ? '#10b981' : '#64748b'};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  drawApriori(container, res) {
    if (!res || !container) return;
    container.innerHTML = `
      <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
          <strong style="font-size:0.95rem; color:#1e293b;">Mined Frequent Itemsets &amp; Association Rules</strong>
          <span style="font-size:0.8rem; color:#64748b;">${res.rules.length} Strong Rules Mined</span>
        </div>
        <div style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
          <span style="background:#eff6ff; color:#2563eb; font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:6px;">L1: ${res.frequent1Itemsets.length} items</span>
          <span style="background:#f0fdf4; color:#059669; font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:6px;">L2: ${res.frequent2Itemsets.length} pairs</span>
          <span style="background:#fef3c7; color:#d97706; font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:6px;">L3: ${res.frequent3Itemsets.length} triplets</span>
        </div>
        <div style="max-height:160px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:8px;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
            <thead><tr style="background:#f8fafc; text-align:left;"><th style="padding:6px 10px;">Rule (X &rarr; Y)</th><th style="padding:6px 10px;">Support %</th><th style="padding:6px 10px;">Confidence %</th><th style="padding:6px 10px;">Lift</th></tr></thead>
            <tbody>
              ${res.rules.map(r => `
                <tr style="border-top:1px solid #f1f5f9;">
                  <td style="padding:6px 10px; font-weight:bold; color:#166534;">{${Array.isArray(r.antecedent) ? r.antecedent.join(',') : r.antecedent}} &rarr; {${Array.isArray(r.consequent) ? r.consequent.join(',') : r.consequent}}</td>
                  <td style="padding:6px 10px;">${r.supportPercentage || r.support}%</td>
                  <td style="padding:6px 10px; font-weight:bold; color:#2563eb;">${r.confidencePercentage || r.confidence}%</td>
                  <td style="padding:6px 10px; font-weight:bold;">${r.lift}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderActiveTabSolver() {
    const container = this.mount.querySelector('#tab-solver-container');
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
      case 'binning': this.renderBinning(container); break;
      case 'iqr': this.renderIQR(container); break;
      case 'metrics': this.renderMetrics(container); break;
      case 'olap': this.renderOLAP(container); break;
      default: this.renderKMeans(container);
    }
  }


  // 1. K-MEANS INTERACTIVE SOLVER
  renderKMeans(container) {
    const defaultData = "P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5\nP6: 6, 4\nP7: 1, 2\nP8: 4, 9";
    container.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0;">1. K-Means Coordinate Clustering Engine</h3>
            <p style="font-size:0.85rem; color:#64748b; margin:2px 0 0;">Iterative partition clustering with convergence checking and Euclidean distance table.</p>
          </div>
          <span style="background:#eff6ff; color:#2563eb; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:12px;">Syllabus Algorithm</span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
          <div>
            <label style="font-size:0.82rem; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Input 2D Points (Label: x, y):</label>
            <textarea id="km-input" rows="6" style="width:100%; font-family:monospace; font-size:0.85rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultData}</textarea>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button id="km-btn-sample" class="btn btn-outline btn-sm" style="font-size:0.78rem;">Load Exam Sample</button>
              <button id="km-btn-reset" class="btn btn-outline btn-sm" style="font-size:0.78rem;">Reset</button>
            </div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <label style="font-size:0.82rem; font-weight:700; color:#334155;">Number of Clusters (K):</label>
              <input type="number" id="km-k" value="2" min="2" max="6" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.9rem; margin:4px 0 10px;">
              
              <label style="font-size:0.82rem; font-weight:700; color:#334155;">Initial Centroids (Optional, e.g. P1, P2):</label>
              <input type="text" id="km-initial-c" placeholder="Leave blank to use first K points" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem; margin-top:4px;">
            </div>
            <button id="km-solve" class="btn btn-primary" style="background:#2563eb; color:white; width:100%; padding:10px; margin-top:12px; font-weight:700;">
              Execute K-Means Step-by-Step
            </button>
          </div>
        </div>

        <div id="km-result"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#km-input').value;
      const k = parseInt(container.querySelector('#km-k').value) || 2;
      const initStr = container.querySelector('#km-initial-c').value.trim();
      const points = this.parseInputPoints(text);

      if (points.length < k) {
        container.querySelector('#km-result').innerHTML = `
          <div style="background:#fef2f2; color:#991b1b; padding:12px; border-radius:8px; border:1px solid #fecaca; font-size:0.88rem;">
            Error: Please provide at least ${k} points for K=${k} clustering.
          </div>
        `;
        return;
      }

      let customCentroids = null;
      if (initStr) {
        const ids = initStr.split(/[,\s]+/).map(s => s.trim());
        const matched = ids.map(id => points.find(p => p.id.toLowerCase() === id.toLowerCase())).filter(Boolean);
        if (matched.length === k) customCentroids = matched;
      }

      const res = NumericalEngine.kMeans(points, k, customCentroids);

      container.querySelector('#km-result').innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:12px; text-align:center;">
            <strong style="font-size:0.85rem; color:#334155; display:block; margin-bottom:8px;">2D Cluster Scatter Plot &amp; Final Centroids</strong>
            <canvas id="km-canvas" width="450" height="280" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; width:100%; max-width:450px; height:auto;"></canvas>
            <div style="font-size:0.75rem; color:#64748b; margin-top:6px;">Circles = Points (Colored by Cluster) &bull; Stars = Centroids</div>
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px; font-size:0.88rem;">
            <h4 style="color:#166534; font-weight:800; margin:0 0 8px;">Convergence Reached in ${res.totalIterations} Iteration(s)</h4>
            <div style="margin-bottom:8px;"><strong>Final Centroid Coordinates:</strong><br>
              ${res.finalCentroids.map((c, i) => `&bull; C${i+1} = (${c.x}, ${c.y})`).join('<br>')}
            </div>
            <div style="margin-bottom:8px;"><strong>Cluster Assignments:</strong><br>
              ${res.clusters.map((c, i) => `&bull; <strong>Cluster ${i+1}</strong> (${c.length} pts): [${c.map(p => p.id).join(', ')}]`).join('<br>')}
            </div>
            <div style="color:#15803d; font-weight:bold;">Final SSE: ${res.sse}</div>
          </div>
        </div>

        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-top:16px;">
          <h4 style="font-size:0.95rem; font-weight:700; color:#334155; margin-bottom:10px;">Iteration History &amp; Distance Calculations</h4>
          ${res.history.map(it => `
            <div style="margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">
              <strong style="color:#2563eb; font-size:0.88rem;">Iteration ${it.iteration}: Centroids ${it.centroids.map((c, i) => `C${i+1}=(${c.x}, ${c.y})`).join(' | ')}</strong>
              <div style="font-size:0.82rem; font-family:monospace; margin-top:4px;">
                ${it.distanceTable.map(d => `[${d.pointId}] d1=${d.d1}, d2=${d.d2} &rarr; <strong>Cluster ${d.assignedCluster}</strong>`).join(' | ')}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      setTimeout(() => {
        const canvas = container.querySelector('#km-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const allX = points.map(p => p.x);
        const allY = points.map(p => p.y);
        const minX = Math.min(...allX) - 1, maxX = Math.max(...allX) + 1;
        const minY = Math.min(...allY) - 1, maxY = Math.max(...allY) + 1;

        const toScreenX = (x) => 30 + ((x - minX) / (maxX - minX || 1)) * (w - 60);
        const toScreenY = (y) => h - 30 - ((y - minY) / (maxY - minY || 1)) * (h - 60);

        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 10); ctx.lineTo(30, h - 30); ctx.lineTo(w - 10, h - 30);
        ctx.stroke();

        const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

        res.clusters.forEach((clusterPts, cIdx) => {
          const color = colors[cIdx % colors.length];
          const c = res.finalCentroids[cIdx];
          const cx = toScreenX(c.x), cy = toScreenY(c.y);

          clusterPts.forEach(p => {
            const px = toScreenX(p.x), py = toScreenY(p.y);
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = color; ctx.globalAlpha = 0.35;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy); ctx.stroke();
            ctx.globalAlpha = 1.0;
            ctx.setLineDash([]);

            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.font = '10px sans-serif';
            ctx.fillText(p.id, px + 8, py - 4);
          });

          ctx.fillStyle = '#dc2626';
          ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(`C${cIdx+1}`, cx, cy);
        });
      }, 50);
    };

    container.querySelector('#km-solve').addEventListener('click', solve);
    container.querySelector('#km-btn-reset').addEventListener('click', () => {
      container.querySelector('#km-input').value = defaultData;
      container.querySelector('#km-k').value = 2;
      container.querySelector('#km-initial-c').value = '';
      solve();
    });
    container.querySelector('#km-btn-sample').addEventListener('click', () => {
      container.querySelector('#km-input').value = "A1: 2, 10\nA2: 2, 5\nA3: 8, 4\nA4: 5, 8\nA5: 7, 5\nA6: 6, 4\nA7: 1, 2\nA8: 4, 9";
      container.querySelector('#km-k').value = 3;
      container.querySelector('#km-initial-c').value = "A1, A4, A7";
      solve();
    });

    solve();
  }

  // 2. K-MEDOIDS (PAM) SOLVER
  renderKMedoids(container) {
    const defaultData = "P1: 2, 6\nP2: 3, 4\nP3: 3, 8\nP4: 4, 7\nP5: 6, 2\nP6: 6, 4\nP7: 7, 3\nP8: 7, 4";
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">2. K-Medoids (PAM) Clustering Engine</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Partitioning Around Medoids minimizing total absolute dissimilarity cost E.</p>
        <textarea id="kmed-input" rows="4" style="width:100%; font-family:monospace; font-size:0.85rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultData}</textarea>
        <div style="display:flex; gap:10px; margin-top:8px;">
          <button id="kmed-solve" class="btn btn-primary" style="background:#2563eb; color:white; font-weight:700;">Compute Optimal Medoids</button>
          <button id="kmed-reset" class="btn btn-outline">Reset</button>
        </div>
        <div id="kmed-result" style="margin-top:16px;"></div>
      </div>
    `;

    const solve = () => {
      const points = this.parseInputPoints(container.querySelector('#kmed-input').value);
      const res = NumericalEngine.kMedoids(points, 2);
      container.querySelector('#kmed-result').innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px;">
          <h4 style="color:#166534; font-weight:800; margin:0 0 6px;">PAM Optimal Medoids Selected</h4>
          <p style="color:#15803d; margin:0 0 8px;">
            Selected Medoids: <strong>${res.finalMedoids.map(m => `${m.id}(${m.x}, ${m.y})`).join(' and ')}</strong><br>
            Minimum Total Cost: <strong>E = ${res.totalCost}</strong>
          </p>
          <div style="font-size:0.85rem; color:#475569; background:white; padding:10px; border-radius:6px; border:1px solid #cbd5e1;">
            ${res.clusters.map((c, i) => `<strong>Cluster ${i+1}</strong> (Medoid: ${res.finalMedoids[i]?.id}): [${c.map(p => p.id).join(', ')}]`).join('<br>')}
          </div>
        </div>
      `;
    };
    container.querySelector('#kmed-solve').addEventListener('click', solve);
    container.querySelector('#kmed-reset').addEventListener('click', () => {
      container.querySelector('#kmed-input').value = defaultData;
      solve();
    });
    solve();
  }

  // 3. HIERARCHICAL CLUSTERING DENDROGRAM SOLVER
  renderHierarchical(container) {
    const defaultData = "P1: 1, 1\nP2: 1.5, 1.5\nP3: 5, 5\nP4: 3, 4\nP5: 4, 4";
    container.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0;">3. Agglomerative Hierarchical Dendrogram Engine</h3>
            <p style="font-size:0.85rem; color:#64748b; margin:2px 0 0;">Bottom-up cluster merging with linkage matrix, merge heights, and dynamic cut slider.</p>
          </div>
          <span style="background:#eff6ff; color:#2563eb; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:12px;">Syllabus Algorithm</span>
        </div>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
          <textarea id="h-input" rows="4" style="width:100%; font-family:monospace; font-size:0.85rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultData}</textarea>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">Linkage Method:</label>
            <select id="h-linkage" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; margin:4px 0 10px;">
              <option value="single">Single Linkage (Min Pair)</option>
              <option value="complete">Complete Linkage (Max Pair)</option>
              <option value="average">Average Linkage (Mean Pair)</option>
            </select>
            <button id="h-solve" class="btn btn-primary" style="background:#2563eb; color:white; width:100%; font-weight:700;">Compute Merge Hierarchy</button>
          </div>
        </div>
        <div id="h-result"></div>
      </div>
    `;

    const solve = () => {
      const points = this.parseInputPoints(container.querySelector('#h-input').value);
      const linkage = container.querySelector('#h-linkage').value;
      const res = NumericalEngine.hierarchicalClustering(points, linkage);

      container.querySelector('#h-result').innerHTML = `
        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:14px;">
          <h4 style="color:#059669; font-weight:800; margin:0 0 10px;">Sequential Agglomerative Merge Steps (${linkage.toUpperCase()} LINKAGE)</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
            <thead>
              <tr style="background:#f8fafc; border-bottom:1px solid #cbd5e1; text-align:left;">
                <th style="padding:6px;">Merge Step</th>
                <th style="padding:6px;">Cluster A</th>
                <th style="padding:6px;">Cluster B</th>
                <th style="padding:6px;">Distance d</th>
                <th style="padding:6px;">Resulting Merged Cluster</th>
              </tr>
            </thead>
            <tbody>
              ${res.steps.map(s => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:6px; font-weight:bold;">Step ${s.step}</td>
                  <td style="padding:6px; color:#2563eb;">${s.clusterA}</td>
                  <td style="padding:6px; color:#2563eb;">${s.clusterB}</td>
                  <td style="padding:6px; font-weight:bold;">${s.distance}</td>
                  <td style="padding:6px; font-weight:bold; color:#059669;">${s.mergedLabel}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div id="h-dendro-container"></div>
      `;

      const dContainer = container.querySelector('#h-dendro-container');
      this.drawDendrogram(dContainer, res.finalTree, res.steps, res.steps.length, true);
    };

    container.querySelector('#h-solve').addEventListener('click', solve);
    container.querySelector('#h-linkage').addEventListener('change', solve);
    solve();
  }

  // 4. DBSCAN DENSITY CLUSTERING SOLVER
  renderDBSCAN(container) {
    const defaultData = "P1: 2, 10\nP2: 2, 9\nP3: 8, 4\nP4: 8, 5\nP5: 25, 30";
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">4. DBSCAN Density-Based Clustering Engine</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Identifies Core, Border, and Noise points using Epsilon radius (&epsilon;) and MinPts.</p>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
          <textarea id="db-input" rows="4" style="width:100%; font-family:monospace; font-size:0.85rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultData}</textarea>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">Epsilon (&epsilon;):</label>
            <input type="number" id="db-eps" value="3.0" step="0.5" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; margin:2px 0 8px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">MinPts:</label>
            <input type="number" id="db-minpts" value="2" min="1" max="10" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; margin:2px 0 8px;">
            <button id="db-solve" class="btn btn-primary" style="background:#2563eb; color:white; width:100%; font-weight:700;">Classify Density Points</button>
          </div>
        </div>
        <div id="db-result"></div>
      </div>
    `;

    const solve = () => {
      const points = this.parseInputPoints(container.querySelector('#db-input').value);
      const eps = parseFloat(container.querySelector('#db-eps').value) || 3.0;
      const minpts = parseInt(container.querySelector('#db-minpts').value) || 2;
      const res = NumericalEngine.dbscan(points, eps, minpts);

      container.querySelector('#db-result').innerHTML = `
        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <strong>Clusters Formed: ${res.totalClusters}</strong>
            <span style="color:#dc2626; font-weight:bold;">Noise Points: ${res.noise.length}</span>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
            <thead>
              <tr style="background:#f8fafc; border-bottom:1px solid #cbd5e1; text-align:left;">
                <th style="padding:6px;">Point</th>
                <th style="padding:6px;">Coordinates</th>
                <th style="padding:6px;">&epsilon;-Neighbors Count</th>
                <th style="padding:6px;">Point Type</th>
                <th style="padding:6px;">Assigned Cluster</th>
              </tr>
            </thead>
            <tbody>
              ${res.pointClassifications.map(p => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:6px; font-weight:bold;">${p.id}</td>
                  <td style="padding:6px;">(${p.x}, ${p.y})</td>
                  <td style="padding:6px;">${p.neighborCount} pts</td>
                  <td style="padding:6px; font-weight:bold; color:${p.type === 'core' ? '#059669' : (p.type === 'border' ? '#d97706' : '#dc2626')};">${p.type.toUpperCase()}</td>
                  <td style="padding:6px;">${p.cluster !== null ? `Cluster ${p.cluster+1}` : '<span style="color:#dc2626;">Noise</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };
    container.querySelector('#db-solve').addEventListener('click', solve);
    solve();
  }

  // 5. DECISION TREE ID3 SOLVER
  renderID3(container) {
    const defaultCsv = "Outlook, Temperature, Humidity, Wind, Play\nSunny, Hot, High, Weak, No\nSunny, Hot, High, Strong, No\nOvercast, Hot, High, Weak, Yes\nRain, Mild, High, Weak, Yes\nRain, Cool, Normal, Weak, Yes\nRain, Cool, Normal, Strong, No\nOvercast, Cool, Normal, Strong, Yes\nSunny, Mild, High, Weak, No\nSunny, Cool, Normal, Weak, Yes\nRain, Mild, Normal, Weak, Yes\nSunny, Mild, Normal, Strong, Yes\nOvercast, Mild, High, Strong, Yes\nOvercast, Hot, Normal, Weak, Yes\nRain, Mild, High, Strong, No";
    container.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0;">5. ID3 Decision Tree Entropy &amp; Information Gain Engine</h3>
            <p style="font-size:0.85rem; color:#64748b; margin:2px 0 0;">Computes Shannon System Entropy H(S), optimal split attribute, and recursive tree splits.</p>
          </div>
          <span style="background:#eff6ff; color:#2563eb; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:12px;">Syllabus Algorithm</span>
        </div>
        <textarea id="id3-input" rows="6" style="width:100%; font-family:monospace; font-size:0.82rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultCsv}</textarea>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <div style="display:flex; gap:8px;">
            <button id="id3-btn-sample" class="btn btn-outline btn-sm">Load PlayTennis Sample</button>
            <button id="id3-btn-reset" class="btn btn-outline btn-sm">Reset</button>
          </div>
          <button id="id3-solve" class="btn btn-primary" style="background:#2563eb; color:white; font-weight:700;">Compute Entropy &amp; Build Tree</button>
        </div>
        <div id="id3-result" style="margin-top:16px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#id3-input').value;
      const rows = this.parseInputTable(text);
      if (!rows || rows.length < 2) return;
      const targetCol = Object.keys(rows[0]).pop();
      const res = NumericalEngine.id3Entropy(rows, targetCol);
      const treeRes = NumericalEngine.buildDecisionTree(rows, targetCol);

      container.querySelector('#id3-result').innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px; margin-bottom:14px;">
          <h4 style="color:#166534; font-weight:800; margin:0 0 6px;">Optimal Decision Tree Root Node: ${res.bestSplitAttribute}</h4>
          <p style="color:#15803d; margin:0;">
            System Entropy H(S) = <strong>${res.systemEntropy} bits</strong><br>
            Highest Information Gain = <strong>${res.gains[res.bestSplitAttribute]} bits</strong> for attribute <strong>"${res.bestSplitAttribute}"</strong>.
          </p>
        </div>
        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:14px;">
          <strong style="color:#334155; font-size:0.9rem; display:block; margin-bottom:8px;">Candidate Attributes Information Gain Ranking</strong>
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
            <thead>
              <tr style="background:#f8fafc; border-bottom:1px solid #cbd5e1; text-align:left;">
                <th style="padding:6px;">Attribute</th>
                <th style="padding:6px;">Gain(S, A)</th>
                <th style="padding:6px;">Remaining Entropy</th>
                <th style="padding:6px;">Decision</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(res.gains).map(([attr, gain]) => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:6px; font-weight:bold;">${attr}</td>
                  <td style="padding:6px; color:#2563eb; font-weight:bold;">${gain} bits</td>
                  <td style="padding:6px;">${(res.systemEntropy - gain).toFixed(4)} bits</td>
                  <td style="padding:6px;">${attr === res.bestSplitAttribute ? '<span style="color:#059669; font-weight:bold;">Selected Root &check;</span>' : 'Sub-branch'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div id="id3-tree-diagram"></div>
      `;

      const treeContainer = container.querySelector('#id3-tree-diagram');
      this.drawDecisionTree(treeContainer, treeRes?.root);
    };

    container.querySelector('#id3-solve').addEventListener('click', solve);
    container.querySelector('#id3-btn-reset').addEventListener('click', () => {
      container.querySelector('#id3-input').value = defaultCsv;
      solve();
    });
    container.querySelector('#id3-btn-sample').addEventListener('click', () => {
      container.querySelector('#id3-input').value = defaultCsv;
      solve();
    });
    solve();
  }

  // 6. NAIVE BAYES CLASSIFIER SOLVER
  renderNaiveBayes(container) {
    const defaultCsv = "Outlook, Temperature, Humidity, Wind, Play\nSunny, Hot, High, Weak, No\nSunny, Hot, High, Strong, No\nOvercast, Hot, High, Weak, Yes\nRain, Mild, High, Weak, Yes\nRain, Cool, Normal, Weak, Yes\nRain, Cool, Normal, Strong, No\nOvercast, Cool, Normal, Strong, Yes";
    container.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0;">6. Naive Bayes Probabilistic Classifier Engine</h3>
            <p style="font-size:0.85rem; color:#64748b; margin:2px 0 0;">Class priors, Laplace-smoothed conditional likelihoods, and posterior predictions.</p>
          </div>
          <span style="background:#eff6ff; color:#2563eb; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:12px;">Syllabus Algorithm</span>
        </div>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
          <textarea id="nb-input" rows="5" style="width:100%; font-family:monospace; font-size:0.82rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultCsv}</textarea>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">Test Query (Feature=Val):</label>
            <input type="text" id="nb-query" value="Outlook=Sunny, Humidity=High" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; margin:4px 0 10px; font-size:0.82rem;">
            <button id="nb-solve" class="btn btn-primary" style="background:#2563eb; color:white; width:100%; font-weight:700;">Classify Instance</button>
          </div>
        </div>
        <div id="nb-result"></div>
      </div>
    `;

    const solve = () => {
      const rows = this.parseInputTable(container.querySelector('#nb-input').value);
      if (!rows) return;
      const targetCol = Object.keys(rows[0]).pop();
      const qStr = container.querySelector('#nb-query').value;
      const testInst = {};
      qStr.split(',').forEach(part => {
        const [k, v] = part.split('=').map(s => s.trim());
        if (k && v) testInst[k] = v;
      });

      const res = NumericalEngine.naiveBayes(rows, targetCol, testInst);

      container.querySelector('#nb-result').innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px;">
          <h4 style="color:#166534; font-weight:800; margin:0 0 6px;">Classification Verdict: ${res.predictedClass}</h4>
          <p style="color:#15803d; margin:0 0 8px;">
            Target Query: <code>${JSON.stringify(testInst)}</code> &rarr; Classified as <strong>"${res.predictedClass}"</strong>
          </p>
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem; background:white; border-radius:6px; overflow:hidden;">
            <thead><tr style="background:#f8fafc; text-align:left;"><th style="padding:6px;">Class</th><th style="padding:6px;">Prior P(C)</th><th style="padding:6px;">Posterior Score</th><th style="padding:6px;">Normalized Prob</th></tr></thead>
            <tbody>
              ${Object.entries(res.posteriors).map(([cls, score]) => `
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:6px; font-weight:bold;">${cls}</td>
                  <td style="padding:6px;">${res.priorProbabilities[cls]}</td>
                  <td style="padding:6px;">${score}</td>
                  <td style="padding:6px; font-weight:bold; color:${cls === res.predictedClass ? '#059669' : '#334155'};">${res.normalizedProbabilities[cls]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };
    container.querySelector('#nb-solve').addEventListener('click', solve);
    solve();
  }

  // 7. KNN SOLVER
  renderKNN(container) {
    const defaultData = "P1: 1, 2, ClassA\nP2: 2, 3, ClassA\nP3: 3, 3, ClassA\nP4: 6, 5, ClassB\nP5: 7, 7, ClassB\nP6: 8, 6, ClassB";
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">7. K-Nearest Neighbors (KNN) Distance Solver</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Distance ranking and majority vote classification.</p>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
          <textarea id="knn-input" rows="5" style="width:100%; font-family:monospace; font-size:0.85rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultData}</textarea>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">Query Point (x, y):</label>
            <input type="text" id="knn-q" value="4, 4" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; margin:2px 0 8px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">Neighbors (K):</label>
            <input type="number" id="knn-k" value="3" min="1" max="9" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; margin:2px 0 8px;">
            <button id="knn-solve" class="btn btn-primary" style="background:#2563eb; color:white; width:100%; font-weight:700;">Find K Neighbors</button>
          </div>
        </div>
        <div id="knn-result"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#knn-input').value;
      const lines = text.split('\n').filter(l => l.trim());
      const train = lines.map((l, i) => {
        const parts = l.split(':');
        const rest = parts.length > 1 ? parts[1] : parts[0];
        const tokens = rest.split(',').map(s => s.trim());
        return {
          id: parts.length > 1 ? parts[0].trim() : `P${i+1}`,
          x: parseFloat(tokens[0]) || 0,
          y: parseFloat(tokens[1]) || 0,
          label: tokens[2] || (i % 2 === 0 ? 'ClassA' : 'ClassB')
        };
      });

      const qParts = container.querySelector('#knn-q').value.split(',').map(Number);
      const q = { x: qParts[0] || 4, y: qParts[1] || 4 };
      const k = parseInt(container.querySelector('#knn-k').value) || 3;
      const res = NumericalEngine.knn(train, q, k);

      container.querySelector('#knn-result').innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px;">
          <h4 style="color:#166534; font-weight:800; margin:0 0 6px;">Query Point (${q.x}, ${q.y}) Predicted Class: ${res.predictedClass}</h4>
          <p style="color:#15803d; margin:0 0 10px;">Majority vote among Top-${k} nearest neighbors.</p>
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; background:white; border-radius:6px; overflow:hidden;">
            <thead><tr style="background:#f8fafc; text-align:left;"><th style="padding:6px;">Rank</th><th style="padding:6px;">Point</th><th style="padding:6px;">Coordinates</th><th style="padding:6px;">Distance</th><th style="padding:6px;">Class</th><th style="padding:6px;">Vote Included?</th></tr></thead>
            <tbody>
              ${res.neighbors.map((n, i) => `
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:6px; font-weight:bold;">#${i+1}</td>
                  <td style="padding:6px;">${n.id}</td>
                  <td style="padding:6px;">(${n.x}, ${n.y})</td>
                  <td style="padding:6px; font-weight:bold;">${n.distance}</td>
                  <td style="padding:6px;">${n.label}</td>
                  <td style="padding:6px; color:${i < k ? '#059669' : '#64748b'}; font-weight:${i < k ? 'bold' : 'normal'};">${i < k ? 'Yes &check;' : 'No'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };
    container.querySelector('#knn-solve').addEventListener('click', solve);
    solve();
  }

  // 8. APRIORI SOLVER
  renderApriori(container) {
    const defaultTx = "T1: Milk, Bread, Eggs\nT2: Bread, Butter\nT3: Milk, Bread, Butter\nT4: Milk, Eggs\nT5: Bread, Butter";
    container.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0;">8. Apriori Association Rule Mining Engine</h3>
            <p style="font-size:0.85rem; color:#64748b; margin:2px 0 0;">Mines candidate and frequent itemsets (C_k &rarr; L_k) and derives strong rules.</p>
          </div>
          <span style="background:#eff6ff; color:#2563eb; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:12px;">Syllabus Algorithm</span>
        </div>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
          <textarea id="ap-input" rows="5" style="width:100%; font-family:monospace; font-size:0.85rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultTx}</textarea>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">Min Support %:</label>
            <input type="number" id="ap-sup" value="40" min="10" max="100" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; margin:2px 0 8px;">
            <label style="font-size:0.82rem; font-weight:700; color:#334155;">Min Confidence %:</label>
            <input type="number" id="ap-conf" value="60" min="10" max="100" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; margin:2px 0 8px;">
            <button id="ap-solve" class="btn btn-primary" style="background:#2563eb; color:white; width:100%; font-weight:700;">Mine Strong Rules</button>
          </div>
        </div>
        <div id="ap-result"></div>
      </div>
    `;

    const solve = () => {
      const tx = this.parseInputTransactions(container.querySelector('#ap-input').value);
      const minSup = parseFloat(container.querySelector('#ap-sup').value) || 40;
      const minConf = parseFloat(container.querySelector('#ap-conf').value) || 60;
      const res = NumericalEngine.apriori(tx, minSup, minConf);

      container.querySelector('#ap-result').innerHTML = `
        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px; margin-bottom:14px;">
          <h4 style="color:#2563eb; font-weight:800; margin:0 0 8px;">Frequent Itemsets Discovered (${res.frequentItemsets.length} itemsets)</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${res.frequentItemsets.map(f => `
              <span style="background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; padding:4px 10px; border-radius:14px; font-size:0.85rem; font-family:monospace;">
                {${f.itemset.join(',')}} (sup: ${f.supportPercentage}%)
              </span>
            `).join('')}
          </div>
        </div>
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px;">
          <h4 style="color:#166534; font-weight:800; margin:0 0 8px;">Strong Rules (Confidence &ge; ${minConf}%)</h4>
          ${res.rules.length > 0 ? `
            <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
              <thead><tr style="background:#dcfce7; text-align:left;"><th style="padding:6px;">Rule</th><th style="padding:6px;">Support %</th><th style="padding:6px;">Confidence %</th><th style="padding:6px;">Lift</th></tr></thead>
              <tbody>
                ${res.rules.map(r => `
                  <tr style="border-top:1px solid #e2e8f0;">
                    <td style="padding:6px; font-weight:bold; color:#166534;">{${r.antecedent.join(',')}} &rarr; {${r.consequent.join(',')}}</td>
                    <td style="padding:6px;">${r.supportPercentage}%</td>
                    <td style="padding:6px; font-weight:bold;">${r.confidencePercentage}%</td>
                    <td style="padding:6px;">${r.lift}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p style="color:#15803d; margin:0;">No rules satisfied minimum confidence threshold.</p>'}
        </div>
      `;
    };
    container.querySelector('#ap-solve').addEventListener('click', solve);
    solve();
  }

  // 9. LINEAR REGRESSION SOLVER
  renderRegression(container) {
    const defaultData = "P1: 1, 2\nP2: 2, 3\nP3: 3, 5\nP4: 4, 7\nP5: 5, 9";
    container.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0;">9. Simple Linear Regression (OLS) Engine</h3>
            <p style="font-size:0.85rem; color:#64748b; margin:2px 0 0;">Slope m, y-intercept b, R&sup2; goodness-of-fit, and scatter plot trendline.</p>
          </div>
          <span style="background:#eff6ff; color:#2563eb; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:12px;">Syllabus Algorithm</span>
        </div>
        <textarea id="reg-input" rows="4" style="width:100%; font-family:monospace; font-size:0.85rem; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">${defaultData}</textarea>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <button id="reg-solve" class="btn btn-primary" style="background:#2563eb; color:white; font-weight:700;">Calculate Regression Line</button>
        </div>
        <div id="reg-result" style="margin-top:16px;"></div>
      </div>
    `;

    const solve = () => {
      const { points } = this.parseInputXYSeries(container.querySelector('#reg-input').value);
      const res = NumericalEngine.linearRegression(points);

      container.querySelector('#reg-result').innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px; margin-bottom:14px;">
          <h4 style="color:#166534; font-weight:800; margin:0 0 6px;">Best-Fit Equation: ${res.equation}</h4>
          <p style="color:#15803d; margin:0;">
            Slope m = <strong>${res.slope}</strong> | Intercept b = <strong>${res.intercept}</strong> | Correlation R&sup2; = <strong>${res.rSquared}</strong>
          </p>
        </div>
        <div id="reg-canvas-container"></div>
      `;

      const cContainer = container.querySelector('#reg-canvas-container');
      this.drawRegressionCanvas(cContainer, points, res);
    };

    container.querySelector('#reg-solve').addEventListener('click', solve);
    solve();
  }

  // 10. FEATURE NORMALIZATION SOLVER
  renderNormalization(container) {
    const defaultData = "200, 300, 400, 600, 1000";
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">10. Feature Normalization Engine</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Min-Max Scaling, Z-Score Standardization, and Decimal Scaling.</p>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
          <input type="text" id="norm-input" value="${defaultData}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-family:monospace; font-size:0.9rem;">
          <select id="norm-method" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-weight:bold;">
            <option value="minmax">Min-Max [0, 1]</option>
            <option value="zscore">Z-Score Standardization</option>
            <option value="decimal">Decimal Scaling</option>
          </select>
        </div>
        <button id="norm-solve" class="btn btn-primary" style="background:#2563eb; color:white; font-weight:700;">Normalize Dataset</button>
        <div id="norm-result" style="margin-top:16px;"></div>
      </div>
    `;

    const solve = () => {
      const numbers = this.parseInputNumbers(container.querySelector('#norm-input').value);
      const method = container.querySelector('#norm-method').value;
      const res = NumericalEngine.normalization(numbers, method);

      container.querySelector('#norm-result').innerHTML = `
        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
          <h4 style="color:#2563eb; font-weight:800; margin:0 0 8px;">Transformation Results (${method.toUpperCase()})</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
            <thead><tr style="background:#f8fafc; text-align:left;"><th style="padding:6px;">Original x</th><th style="padding:6px;">Formula Application</th><th style="padding:6px;">Normalized Value</th></tr></thead>
            <tbody>
              ${res.steps.map(s => `
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:6px; font-weight:bold;">${s.original}</td>
                  <td style="padding:6px; font-family:monospace;">${s.formula}</td>
                  <td style="padding:6px; font-weight:bold; color:#059669;">${s.normalized}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };
    container.querySelector('#norm-solve').addEventListener('click', solve);
    container.querySelector('#norm-method').addEventListener('change', solve);
    solve();
  }

  // 11. DATA BINNING SOLVER
  renderBinning(container) {
    const defaultData = "4, 8, 9, 15, 21, 21, 24, 25, 26, 28, 29, 34";
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">11. Data Binning &amp; Smoothing Engine</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Equal-Width and Equal-Frequency partitioning with Bin Means/Boundaries smoothing.</p>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
          <input type="text" id="bin-input" value="${defaultData}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-family:monospace; font-size:0.9rem;">
          <div style="display:flex; gap:8px;">
            <select id="bin-method" style="flex:1; padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
              <option value="width">Equal-Width</option>
              <option value="frequency">Equal-Frequency</option>
            </select>
            <select id="bin-smooth" style="flex:1; padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
              <option value="means">Bin Means</option>
              <option value="boundaries">Bin Boundaries</option>
              <option value="medians">Bin Medians</option>
            </select>
          </div>
        </div>
        <button id="bin-solve" class="btn btn-primary" style="background:#2563eb; color:white; font-weight:700;">Perform Binning</button>
        <div id="bin-result" style="margin-top:16px;"></div>
      </div>
    `;

    const solve = () => {
      const numbers = this.parseInputNumbers(container.querySelector('#bin-input').value);
      const method = container.querySelector('#bin-method').value;
      const smooth = container.querySelector('#bin-smooth').value;
      const res = NumericalEngine.binning(numbers, 3, method, smooth);

      container.querySelector('#bin-result').innerHTML = `
        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
          <h4 style="color:#059669; font-weight:800; margin:0 0 10px;">Formed ${res.bins.length} Bins (${method.toUpperCase()} | Smoothed by ${smooth.toUpperCase()})</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
            <thead><tr style="background:#f8fafc; text-align:left;"><th style="padding:6px;">Bin #</th><th style="padding:6px;">Raw Values</th><th style="padding:6px;">Mean / Median</th><th style="padding:6px;">Smoothed Values</th></tr></thead>
            <tbody>
              ${res.bins.map(b => `
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:6px; font-weight:bold;">Bin ${b.binIndex}</td>
                  <td style="padding:6px; font-family:monospace;">[${b.values.join(', ')}]</td>
                  <td style="padding:6px;">Mean=${b.binMean}, Med=${b.binMedian}</td>
                  <td style="padding:6px; font-weight:bold; color:#059669; font-family:monospace;">[${b.smoothedValues.join(', ')}]</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };
    container.querySelector('#bin-solve').addEventListener('click', solve);
    container.querySelector('#bin-method').addEventListener('change', solve);
    container.querySelector('#bin-smooth').addEventListener('change', solve);
    solve();
  }

  // 12. IQR OUTLIER DETECTION & BOX PLOT SOLVER
  renderIQR(container) {
    const defaultData = "12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65";
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">12. IQR Outlier Detection &amp; Box Plot Engine</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Quartiles Q1, Median, Q3, Inner/Outer Fences, and Outlier flags.</p>
        <div style="display:grid; grid-template-columns:3fr 1fr; gap:12px; margin-bottom:12px;">
          <input type="text" id="iqr-input" value="${defaultData}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-family:monospace; font-size:0.9rem;">
          <button id="iqr-solve" class="btn btn-primary" style="background:#2563eb; color:white; font-weight:700;">Find Outliers</button>
        </div>
        <div id="iqr-result"></div>
      </div>
    `;

    const solve = () => {
      const numbers = this.parseInputNumbers(container.querySelector('#iqr-input').value);
      const res = NumericalEngine.iqr(numbers);

      container.querySelector('#iqr-result').innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <strong style="color:#334155; font-size:0.9rem; display:block; margin-bottom:8px;">Quartile &amp; Fence Summary</strong>
            <div style="font-size:0.88rem; line-height:1.6;">
              &bull; Q1 = <strong>${res.q1}</strong>, Median = <strong>${res.median}</strong>, Q3 = <strong>${res.q3}</strong><br>
              &bull; IQR = <strong>${res.iqr}</strong><br>
              &bull; Lower Fence = <strong>${res.lowerFence}</strong><br>
              &bull; Upper Fence = <strong>${res.upperFence}</strong><br>
              &bull; Outliers: <strong style="color:${res.outliers.length > 0 ? '#dc2626' : '#059669'};">${res.outliers.length > 0 ? res.outliers.join(', ') : 'None'}</strong>
            </div>
          </div>
          <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:12px; text-align:center;">
            <strong style="font-size:0.85rem; color:#334155; display:block; margin-bottom:4px;">Box-and-Whisker Plot</strong>
            <canvas id="iqr-canvas" width="400" height="150" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; width:100%; max-width:400px; height:auto;"></canvas>
          </div>
        </div>
      `;

      setTimeout(() => {
        const canvas = container.querySelector('#iqr-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const minVal = Math.min(...res.sortedData);
        const maxVal = Math.max(...res.sortedData);
        const range = maxVal - minVal || 1;
        const toX = (val) => 40 + ((val - minVal) / range) * (w - 80);

        const yMid = h / 2;
        const boxTop = yMid - 25;
        const boxHeight = 50;

        const xQ1 = toX(res.q1);
        const xMed = toX(res.median);
        const xQ3 = toX(res.q3);
        const xMin = toX(Math.max(minVal, res.lowerFence));
        const xMax = toX(Math.min(maxVal, res.upperFence));

        ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xMin, yMid); ctx.lineTo(xQ1, yMid);
        ctx.moveTo(xQ3, yMid); ctx.lineTo(xMax, yMid);
        ctx.moveTo(xMin, yMid - 10); ctx.lineTo(xMin, yMid + 10);
        ctx.moveTo(xMax, yMid - 10); ctx.lineTo(xMax, yMid + 10);
        ctx.stroke();

        ctx.fillStyle = '#eff6ff';
        ctx.fillRect(xQ1, boxTop, xQ3 - xQ1, boxHeight);
        ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2;
        ctx.strokeRect(xQ1, boxTop, xQ3 - xQ1, boxHeight);

        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(xMed, boxTop); ctx.lineTo(xMed, boxTop + boxHeight);
        ctx.stroke();

        res.outliers.forEach(outVal => {
          const ox = toX(outVal);
          ctx.fillStyle = '#dc2626';
          ctx.beginPath(); ctx.arc(ox, yMid, 6, 0, Math.PI * 2); ctx.fill();
        });

        ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
        ctx.fillText(`Q1:${res.q1}`, xQ1 - 15, boxTop - 6);
        ctx.fillText(`Med:${res.median}`, xMed - 15, boxTop + boxHeight + 16);
        ctx.fillText(`Q3:${res.q3}`, xQ3 - 15, boxTop - 6);
      }, 50);
    };
    container.querySelector('#iqr-solve').addEventListener('click', solve);
    solve();
  }

  // 13. EVALUATION METRICS SOLVER
  renderMetrics(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">13. Model Evaluation Metrics Solver</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Accuracy, Precision, Recall, Specificity, F1-Score, and Balanced Accuracy.</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; max-width:400px; margin-bottom:14px;">
          <div><label style="font-size:0.8rem; font-weight:bold;">TP:</label><input type="number" id="m-tp" value="85" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-size:0.8rem; font-weight:bold;">FP:</label><input type="number" id="m-fp" value="15" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-size:0.8rem; font-weight:bold;">FN:</label><input type="number" id="m-fn" value="10" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;"></div>
          <div><label style="font-size:0.8rem; font-weight:bold;">TN:</label><input type="number" id="m-tn" value="90" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;"></div>
        </div>
        <button id="m-solve" class="btn btn-primary" style="background:#2563eb; color:white; font-weight:700;">Compute All Metrics</button>
        <div id="m-result" style="margin-top:16px;"></div>
      </div>
    `;

    const solve = () => {
      const tp = parseInt(container.querySelector('#m-tp').value) || 0;
      const fp = parseInt(container.querySelector('#m-fp').value) || 0;
      const fn = parseInt(container.querySelector('#m-fn').value) || 0;
      const tn = parseInt(container.querySelector('#m-tn').value) || 0;
      const res = NumericalEngine.evaluationMetrics({ tp, fp, fn, tn });

      container.querySelector('#m-result').innerHTML = `
        <div style="background:white; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
            <div style="background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0; text-align:center;">
              <div style="font-size:0.75rem; color:#64748b;">Accuracy</div>
              <div style="font-size:1.15rem; font-weight:800; color:#2563eb;">${res.percentages.accuracy}</div>
            </div>
            <div style="background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0; text-align:center;">
              <div style="font-size:0.75rem; color:#64748b;">Precision</div>
              <div style="font-size:1.15rem; font-weight:800; color:#059669;">${res.percentages.precision}</div>
            </div>
            <div style="background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0; text-align:center;">
              <div style="font-size:0.75rem; color:#64748b;">Recall</div>
              <div style="font-size:1.15rem; font-weight:800; color:#d97706;">${res.percentages.recall}</div>
            </div>
            <div style="background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0; text-align:center;">
              <div style="font-size:0.75rem; color:#64748b;">F1-Score</div>
              <div style="font-size:1.15rem; font-weight:800; color:#7c3aed;">${res.percentages.f1Score}</div>
            </div>
          </div>
        </div>
      `;
    };
    container.querySelector('#m-solve').addEventListener('click', solve);
    solve();
  }

  // 14. DATA WAREHOUSING OLAP & DATA CUBE SOLVER
  renderOLAP(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#2563eb; margin:0 0 4px;">14. Data Warehousing OLAP &amp; Data Cube Engine</h3>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px;">Roll-up, Drill-down, Slice, Dice, and Pivot dimensional aggregations.</p>
        <div style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
          <button id="olap-rollup" class="btn btn-primary" style="background:#2563eb; color:white; font-size:0.85rem;">Roll-up (Quarter &rarr; Year)</button>
          <button id="olap-slice" class="btn btn-outline" style="font-size:0.85rem;">Slice (Location = Mumbai)</button>
          <button id="olap-dice" class="btn btn-outline" style="font-size:0.85rem;">Dice (2 Products &times; 2 Cities)</button>
          <button id="olap-pivot" class="btn btn-outline" style="font-size:0.85rem;">Pivot (Rotate Dimensions)</button>
        </div>
        <div id="olap-result" style="margin-top:14px;"></div>
      </div>
    `;

    const showOp = (op) => {
      const sampleCube = [
        { location: 'Mumbai', product: 'Laptop', quarter: 'Q1', sales: 120 },
        { location: 'Mumbai', product: 'Laptop', quarter: 'Q2', sales: 150 },
        { location: 'Delhi', product: 'Laptop', quarter: 'Q1', sales: 90 },
        { location: 'Delhi', product: 'Phone', quarter: 'Q1', sales: 200 }
      ];
      const res = NumericalEngine.dataCubeOLAP(sampleCube, op, { sliceKey: 'location', sliceVal: 'Mumbai' });

      container.querySelector('#olap-result').innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px;">
          <h4 style="color:#166534; font-weight:800; margin:0 0 6px;">OLAP Operation: ${res.operation.toUpperCase()}</h4>
          <p style="color:#15803d; margin:0 0 10px;">${res.description}</p>
          <div style="background:white; border:1px solid #cbd5e1; border-radius:6px; padding:10px; font-family:monospace; font-size:0.85rem;">
            ${JSON.stringify(res.result, null, 2)}
          </div>
        </div>
      `;
    };

    container.querySelector('#olap-rollup').addEventListener('click', () => showOp('rollup'));
    container.querySelector('#olap-slice').addEventListener('click', () => showOp('slice'));
    container.querySelector('#olap-dice').addEventListener('click', () => showOp('dice'));
    container.querySelector('#olap-pivot').addEventListener('click', () => showOp('pivot'));
    showOp('rollup');
  }

// ============================================================

  _vlState = {
    dataset: null,        // { name, headers, rows, numericCols, catCols }
    workingRows: null,    // preprocessed rows
    prepLog: [],
    activeTab: 'dataset', // dataset | preprocessing | classification | clustering | arm
    // stage completion flags
    stageComplete: { dataset: false, preprocessing: false, classification: false, clustering: false, arm: false },
    // classification
    clfAlgo: 'id3', clfTarget: '', clfFeatures: [], clfK: 3, clfSplit: 0.8,
    clfResult: null,
    clfIntermediate: null,  // step-by-step intermediate data
    // clustering
    cluAlgo: 'kmeans', cluX: '', cluY: '', cluK: 3, cluEps: 1.5, cluMinPts: 3, cluLinkage: 'single',
    cluResult: null,
    cluIntermediate: null,  // iterations, distances, etc.
    // ARM
    armCols: [], armSupport: 20, armConf: 50,
    armResult: null,
    armIntermediate: null,  // item counts, candidate sets
    error: '',
    loading: ''  // which stage is loading
  };

  _vlAnalyze(name, rows) {
    if (!rows || rows.length === 0) return null;
    const headers = Object.keys(rows[0]);
    const numericCols = [], catCols = [];
    let missingCount = 0;
    const colStats = {};
    headers.forEach(h => {
      let numCount = 0, nonNull = 0;
      const numVals = [];
      rows.forEach(r => {
        const v = r[h];
        if (v !== null && v !== undefined && v !== '') {
          nonNull++;
          const n = Number(v);
          if (!isNaN(n)) { numCount++; numVals.push(n); }
        }
      });
      if (nonNull > 0 && numCount / nonNull >= 0.8) {
        numericCols.push(h);
        if (numVals.length > 0) {
          const sorted = [...numVals].sort((a, b) => a - b);
          const sum = numVals.reduce((a, b) => a + b, 0);
          const mean = sum / numVals.length;
          const mid = Math.floor(sorted.length / 2);
          const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
          colStats[h] = { mean: mean.toFixed(3), median: median.toFixed(3), min: sorted[0].toFixed(3), max: sorted[sorted.length - 1].toFixed(3) };
        }
      } else {
        catCols.push(h);
      }
    });
    rows.forEach(r => headers.forEach(h => { if (r[h] === null || r[h] === undefined || r[h] === '') missingCount++; }));
    const rowStrings = rows.map(r => JSON.stringify(r));
    const dupCount = rows.length - new Set(rowStrings).size;
    return { name, rows, headers, numericCols, catCols, totalRows: rows.length, totalCols: headers.length, missingCount, dupCount, colStats };
  }

  _vlParseCsv(filename, text) {
    if (!text) return null;
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return null;
    const parseLine = (line) => {
      const res = []; let cur = ''; let inQ = false;
      for (const ch of line) {
        if (ch === '"' || ch === "'") { inQ = !inQ; }
        else if (ch === ',' && !inQ) { res.push(cur.trim().replace(/^["']|["']$/g, '')); cur = ''; }
        else { cur += ch; }
      }
      res.push(cur.trim().replace(/^["']|["']$/g, ''));
      return res;
    };
    const headers = parseLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = parseLine(lines[i]);
      if (vals.length === headers.length) {
        const row = {};
        headers.forEach((h, idx) => {
          const raw = vals[idx];
          const n = Number(raw);
          row[h] = raw !== '' && !isNaN(n) ? n : (raw === '' ? null : raw);
        });
        rows.push(row);
      }
    }
    return rows.length > 0 ? this._vlAnalyze(filename, rows) : null;
  }

  _vlLoadSample() {
    const rows = [
      { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2, species: 'Setosa' },
      { sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2, species: 'Setosa' },
      { sepal_length: 4.7, sepal_width: 3.2, petal_length: 1.3, petal_width: 0.2, species: 'Setosa' },
      { sepal_length: 5.0, sepal_width: 3.6, petal_length: 1.4, petal_width: 0.2, species: 'Setosa' },
      { sepal_length: 5.4, sepal_width: 3.9, petal_length: 1.7, petal_width: 0.4, species: 'Setosa' },
      { sepal_length: 7.0, sepal_width: 3.2, petal_length: 4.7, petal_width: 1.4, species: 'Versicolor' },
      { sepal_length: 6.4, sepal_width: 3.2, petal_length: 4.5, petal_width: 1.5, species: 'Versicolor' },
      { sepal_length: 6.9, sepal_width: 3.1, petal_length: 4.9, petal_width: 1.5, species: 'Versicolor' },
      { sepal_length: 5.5, sepal_width: 2.3, petal_length: 4.0, petal_width: 1.3, species: 'Versicolor' },
      { sepal_length: 6.3, sepal_width: 3.3, petal_length: 6.0, petal_width: 2.5, species: 'Virginica' },
      { sepal_length: 5.8, sepal_width: 2.7, petal_length: 5.1, petal_width: 1.9, species: 'Virginica' },
      { sepal_length: 7.1, sepal_width: 3.0, petal_length: 5.9, petal_width: 2.1, species: 'Virginica' },
      { sepal_length: 6.5, sepal_width: 3.0, petal_length: 5.8, petal_width: 2.2, species: 'Virginica' },
      { sepal_length: 7.6, sepal_width: 3.0, petal_length: 6.6, petal_width: 2.1, species: 'Virginica' },
    ];
    const ds = this._vlAnalyze('Iris_Sample.csv', rows);
    this._vlState.dataset = ds;
    this._vlState.workingRows = JSON.parse(JSON.stringify(rows));
    this._vlState.prepLog = [];
    this._vlState.stageComplete.dataset = true;
    this._vlState.clfTarget = 'species';
    this._vlState.clfFeatures = ds.numericCols.slice();
    this._vlState.cluX = ds.numericCols[0] || '';
    this._vlState.armCols = ds.catCols.length >= 2 ? ds.catCols.slice(0, 3) : ds.headers.slice(-3);
    this._vlState.error = '';
  }

  _vlPreprocess(action, col) {
    const s = this._vlState;
    if (!s.dataset) { s.error = 'Upload a dataset first.'; this._vlRenderPanel(); return; }
    s.error = '';
    let rows = JSON.parse(JSON.stringify(s.workingRows));
    const ds = s.dataset;
    const numCols = this._vlAnalyze('_', rows)?.numericCols || ds.numericCols;
    let label = '', affected = 0;

    try {
      if (action === 'drop_missing') {
        const before = rows.length;
        rows = rows.filter(r => ds.headers.every(h => r[h] !== null && r[h] !== undefined && r[h] !== ''));
        affected = before - rows.length;
        if (affected === 0) { s.error = 'No rows with missing values found.'; this._vlRenderPanel(); return; }
        label = `Dropped ${affected} missing-value rows`;
      } else if (action === 'impute_mean') {
        let count = 0;
        numCols.forEach(c => {
          const vals = rows.map(r => Number(r[c])).filter(v => !isNaN(v));
          const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
          rows.forEach(r => { if (r[c] === null || r[c] === undefined || r[c] === '' || isNaN(Number(r[c]))) { r[c] = Number(mean.toFixed(4)); count++; } });
        });
        if (count === 0) { s.error = 'No missing numeric values to impute.'; this._vlRenderPanel(); return; }
        label = `Mean imputation: filled ${count} values`; affected = count;
      } else if (action === 'impute_median') {
        let count = 0;
        numCols.forEach(c => {
          const vals = rows.map(r => Number(r[c])).filter(v => !isNaN(v));
          const sorted = [...vals].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
          rows.forEach(r => { if (r[c] === null || r[c] === undefined || r[c] === '' || isNaN(Number(r[c]))) { r[c] = Number(median.toFixed(4)); count++; } });
        });
        if (count === 0) { s.error = 'No missing numeric values to impute.'; this._vlRenderPanel(); return; }
        label = `Median imputation: filled ${count} values`; affected = count;
      } else if (action === 'remove_duplicates') {
        const seen = new Set(); const before = rows.length;
        rows = rows.filter(r => { const k = JSON.stringify(r); if (seen.has(k)) return false; seen.add(k); return true; });
        affected = before - rows.length;
        if (affected === 0) { s.error = 'No duplicates found.'; this._vlRenderPanel(); return; }
        label = `Removed ${affected} duplicate rows`;
      } else if (action === 'label_encode' && col) {
        const vals = [...new Set(rows.map(r => String(r[col] || '')).filter(Boolean))].sort();
        const map = {}; vals.forEach((v, i) => { map[v] = i; });
        rows.forEach(r => { if (map[String(r[col] || '')] !== undefined) r[col] = map[String(r[col] || '')]; });
        label = `Label encoded "${col}": ${Object.entries(map).map(([k, v]) => `${k}→${v}`).join(', ')}`;
        affected = rows.length;
      } else if (action === 'minmax_normalize') {
        numCols.forEach(c => {
          const vals = rows.map(r => Number(r[c])).filter(v => !isNaN(v));
          const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
          rows.forEach(r => { if (!isNaN(Number(r[c]))) r[c] = Number(((Number(r[c]) - min) / range).toFixed(4)); });
        });
        label = `Min-Max normalized ${numCols.length} columns to [0,1]`; affected = rows.length;
      } else if (action === 'zscore_normalize') {
        numCols.forEach(c => {
          const vals = rows.map(r => Number(r[c])).filter(v => !isNaN(v));
          const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
          const std = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (vals.length || 1)) || 1;
          rows.forEach(r => { if (!isNaN(Number(r[c]))) r[c] = Number(((Number(r[c]) - mean) / std).toFixed(4)); });
        });
        label = `Z-score standardized ${numCols.length} columns (μ=0,σ=1)`; affected = rows.length;
      } else if (action === 'remove_iqr_outliers' && col) {
        const vals = rows.map(r => Number(r[col]));
        const res = NumericalEngine.iqrOutliers(vals);
        if (!res.success) { s.error = 'IQR failed.'; this._vlRenderPanel(); return; }
        const before = rows.length;
        rows = rows.filter(r => Number(r[col]) >= res.lowerFence && Number(r[col]) <= res.upperFence);
        affected = before - rows.length;
        if (affected === 0) { s.error = `No outliers in "${col}".`; this._vlRenderPanel(); return; }
        label = `IQR removed ${affected} outliers from "${col}" [${res.lowerFence}–${res.upperFence}]`;
      } else if (action === 'drop_column' && col) {
        rows = rows.map(r => { const c = { ...r }; delete c[col]; return c; });
        label = `Dropped column "${col}"`; affected = rows.length;
      } else {
        s.error = 'Invalid operation or missing column.'; this._vlRenderPanel(); return;
      }
      s.workingRows = rows;
      s.prepLog.push({ step: s.prepLog.length + 1, label, affected, rowsBefore: s.dataset.totalRows, rowsAfter: rows.length, time: new Date().toLocaleTimeString() });
    } catch (e) { s.error = `Error: ${e.message}`; }
    this._vlRenderPanel();
  }

  _vlRunClassification() {
    const s = this._vlState;
    s.error = '';
    s.loading = 'classification';
    this._vlRenderPanel();

    setTimeout(() => {
      try {
        if (!s.workingRows || s.workingRows.length < 4) {
          s.error = 'Need at least 4 rows to run classification. Add more data or reduce the train/test split.';
          s.loading = ''; this._vlRenderPanel(); return;
        }
        if (!s.clfTarget) {
          s.error = 'Select a target (label) column before running.';
          s.loading = ''; this._vlRenderPanel(); return;
        }
        if (!s.clfFeatures.length) {
          s.error = 'Select at least one input feature column.';
          s.loading = ''; this._vlRenderPanel(); return;
        }
        if (s.clfFeatures.includes(s.clfTarget)) {
          s.error = 'The target column cannot be included as a feature (target leakage).';
          s.loading = ''; this._vlRenderPanel(); return;
        }

        const splitIdx = Math.floor(s.workingRows.length * s.clfSplit);
        const trainRows = s.workingRows.slice(0, splitIdx);
        const testRows  = s.workingRows.slice(splitIdx);

        if (trainRows.length === 0 || testRows.length === 0) {
          s.error = `Split produced empty sets. Try a different train ratio. (Total: ${s.workingRows.length} rows)`;
          s.loading = ''; this._vlRenderPanel(); return;
        }

        const classes = [...new Set(s.workingRows.map(r => String(r[s.clfTarget] || '')).filter(Boolean))];
        if (classes.length < 2) {
          s.error = 'Target column needs at least 2 distinct classes for classification.';
          s.loading = ''; this._vlRenderPanel(); return;
        }

        // Build intermediate data based on algorithm
        let intermediate = { algorithm: s.clfAlgo, trainSize: trainRows.length, testSize: testRows.length };

        if (s.clfAlgo === 'id3') {
          // Compute entropy + information gain for each feature
          const calcEntropy = (rows) => {
            const counts = {};
            rows.forEach(r => { const v = String(r[s.clfTarget]||''); counts[v]=(counts[v]||0)+1; });
            const total = rows.length;
            let ent = 0;
            for (const v in counts) { const p=counts[v]/total; if(p>0) ent -= p*Math.log2(p); }
            return Number(ent.toFixed(4));
          };
          const systemEntropy = calcEntropy(trainRows);
          const gains = s.clfFeatures.map(attr => {
            const vals = [...new Set(trainRows.map(r => r[attr]))];
            let wEnt = 0;
            const breakdown = vals.map(v => {
              const sub = trainRows.filter(r => r[attr] === v);
              const subEnt = calcEntropy(sub);
              wEnt += (sub.length / trainRows.length) * subEnt;
              return { value: v, count: sub.length, entropy: subEnt };
            });
            return { attr, systemEntropy, weightedEntropy: Number(wEnt.toFixed(4)), gain: Number((systemEntropy - wEnt).toFixed(4)), breakdown };
          }).sort((a, b) => b.gain - a.gain);
          intermediate.entropySteps = { systemEntropy, gains };

        } else if (s.clfAlgo === 'naivebayes') {
          // Show class priors and feature likelihoods for first test row
          const classCounts = {};
          classes.forEach(c => {
            classCounts[c] = trainRows.filter(r => String(r[s.clfTarget]||'') === c).length;
          });
          intermediate.priors = classes.map(c => ({
            cls: c, count: classCounts[c], prior: (classCounts[c] / trainRows.length).toFixed(4)
          }));

        } else if (s.clfAlgo === 'knn') {
          // Show distances from first test row to all training rows
          if (testRows.length > 0) {
            const testRow = testRows[0];
            const distances = trainRows.slice(0, 8).map((r, i) => {
              let d = 0;
              s.clfFeatures.forEach(col => { d += Math.pow((Number(r[col])||0)-(Number(testRow[col])||0),2); });
              return { i, label: String(r[s.clfTarget]||''), distance: Math.sqrt(d).toFixed(4) };
            }).sort((a,b) => a.distance - b.distance);
            intermediate.knnSample = { testRow, distances, k: s.clfK };
          }
        }

        // Execute actual classification
        const predictions = testRows.map(testRow => {
          const actual = String(testRow[s.clfTarget] || '');
          let predicted = '';
          if (s.clfAlgo === 'knn') {
            const distances = trainRows.map((r, i) => {
              let d = 0;
              s.clfFeatures.forEach(col => { d += Math.pow((Number(r[col])||0)-(Number(testRow[col])||0),2); });
              return { i, d: Math.sqrt(d), label: String(r[s.clfTarget]||'') };
            }).sort((a,b) => a.d - b.d).slice(0, s.clfK);
            const votes = {}; distances.forEach(n => { votes[n.label]=(votes[n.label]||0)+1; });
            predicted = Object.keys(votes).reduce((a,b)=>votes[a]>=votes[b]?a:b, classes[0]||'');
          } else if (s.clfAlgo === 'naivebayes') {
            const res = NumericalEngine.naiveBayes(trainRows, s.clfTarget, testRow);
            predicted = res.prediction || res.predictedClass || classes[0] || '';
          } else {
            // ID3: find best split attribute
            const calcEntropy = (rows) => {
              const cnt = {}; rows.forEach(r => { const v=String(r[s.clfTarget]||''); cnt[v]=(cnt[v]||0)+1; });
              const t = rows.length; let e = 0;
              for(const v in cnt){const p=cnt[v]/t; if(p>0) e-=p*Math.log2(p);}
              return e;
            };
            const sysEnt = calcEntropy(trainRows);
            let bestAttr = s.clfFeatures[0]; let bestGain = -1;
            s.clfFeatures.forEach(attr => {
              const vals = [...new Set(trainRows.map(r=>r[attr]))];
              let wEnt = 0;
              vals.forEach(v => { const sub=trainRows.filter(r=>r[attr]===v); wEnt+=(sub.length/trainRows.length)*calcEntropy(sub); });
              const g = sysEnt - wEnt;
              if (g > bestGain) { bestGain = g; bestAttr = attr; }
            });
            const testVal = String(testRow[bestAttr]||'');
            const matchRows = trainRows.filter(r=>String(r[bestAttr]||'')===testVal);
            const src = matchRows.length>0?matchRows:trainRows;
            const cc = {}; src.forEach(r=>{ const c=String(r[s.clfTarget]||''); cc[c]=(cc[c]||0)+1; });
            predicted = Object.keys(cc).reduce((a,b)=>cc[a]>=cc[b]?a:b, classes[0]||'');
          }
          return { actual, predicted, correct: actual === predicted };
        });

        const correct = predictions.filter(p => p.correct).length;
        const accuracy = testRows.length > 0 ? correct / testRows.length : 0;
        const matrix = {}; classes.forEach(c => { matrix[c]={}; classes.forEach(d=>{matrix[c][d]=0;}); });
        predictions.forEach(p => { if(matrix[p.actual]?.[p.predicted]!==undefined) matrix[p.actual][p.predicted]++; });

        // Per-class metrics
        const perClass = {};
        classes.forEach(cls => {
          const tp = predictions.filter(p=>p.actual===cls&&p.predicted===cls).length;
          const fp = predictions.filter(p=>p.actual!==cls&&p.predicted===cls).length;
          const fn = predictions.filter(p=>p.actual===cls&&p.predicted!==cls).length;
          const prec = (tp+fp)>0?tp/(tp+fp):0;
          const rec  = (tp+fn)>0?tp/(tp+fn):0;
          const f1   = (prec+rec)>0?2*prec*rec/(prec+rec):0;
          perClass[cls] = { tp, fp, fn, precision:(prec*100).toFixed(1), recall:(rec*100).toFixed(1), f1:(f1*100).toFixed(1) };
        });
        const macroF1 = classes.length>0 ? classes.reduce((s,c)=>s+parseFloat(perClass[c].f1),0)/classes.length : 0;

        s.clfResult = {
          accuracy: (accuracy*100).toFixed(1), trainSize: trainRows.length, testSize: testRows.length,
          predictions: predictions.slice(0,10), classes, matrix, perClass, macroF1: macroF1.toFixed(1)
        };
        s.clfIntermediate = intermediate;
        s.stageComplete.classification = true;
        s.loading = '';
        this._vlRenderPanel();
      } catch(e) {
        s.error = `Classification error: ${e.message}`;
        s.loading = ''; this._vlRenderPanel();
      }
    }, 80);
  }

  _vlRunClustering() {
    const s = this._vlState;
    s.error = '';
    if (!s.workingRows || s.workingRows.length < 2) { s.error = 'Not enough data rows (need at least 2).'; this._vlRenderPanel(); return; }
    if (!s.cluX) { s.error = 'Select Feature X column.'; this._vlRenderPanel(); return; }
    const numericCols = (this._vlAnalyze('_', s.workingRows) || {}).numericCols || [];
    if (!numericCols.includes(s.cluX)) { s.error = `Column "${s.cluX}" does not have numeric values. Select a numeric feature.`; this._vlRenderPanel(); return; }
    s.loading = 'clustering';
    this._vlRenderPanel();

    setTimeout(() => {
      try {
        const pts = s.workingRows.map((r, i) => ({
          id: `P${i + 1}`, x: Number(r[s.cluX]) || 0,
          y: Number(r[s.cluY || s.cluX]) || 0, label: `R${i + 1}`
        }));

        let res;
        if (s.cluAlgo === 'kmeans')       res = NumericalEngine.kMeans(pts, s.cluK, 10);
        else if (s.cluAlgo === 'kmedoids') res = NumericalEngine.kMedoids(pts, s.cluK, 10);
        else if (s.cluAlgo === 'hierarchical') res = NumericalEngine.hierarchicalClustering(pts.slice(0, 25), s.cluLinkage);
        else if (s.cluAlgo === 'dbscan')   res = NumericalEngine.dbscan(pts, s.cluEps, s.cluMinPts);

        if (res?.error) { s.error = res.error; s.cluResult = null; s.loading = ''; this._vlRenderPanel(); return; }

        s.cluResult = res;
        // Build intermediate: first 3 iteration snapshots for K-Means/K-Medoids
        let intermediate = { algorithm: s.cluAlgo, totalPoints: pts.length };
        if ((s.cluAlgo === 'kmeans' || s.cluAlgo === 'kmedoids') && res.history) {
          intermediate.iterations = res.history.slice(0, 4);
          intermediate.finalCentroids = res.finalCentroids || res.finalMedoids;
        } else if (s.cluAlgo === 'hierarchical' && res.steps) {
          intermediate.mergeSteps = res.steps.slice(0, 6);
        } else if (s.cluAlgo === 'dbscan') {
          const coreCnt = pts.filter(p => (res.pointTypes || {})[p.id] === 'core').length;
          const borderCnt = pts.filter(p => (res.pointTypes || {})[p.id] === 'border').length;
          intermediate.dbscanSummary = { core: coreCnt, border: borderCnt, noise: (res.noise||[]).length };
        }
        s.cluIntermediate = intermediate;
        s.stageComplete.clustering = true;
        s.loading = '';
        this._vlRenderPanel();
        setTimeout(() => this._vlDrawCanvas(), 80);
      } catch(e) {
        s.error = `Clustering error: ${e.message}`;
        s.loading = ''; this._vlRenderPanel();
      }
    }, 80);
  }

  _vlRunARM() {
    const s = this._vlState;
    s.error = '';
    if (!s.workingRows || s.workingRows.length < 2) { s.error = 'Not enough data rows (need at least 2).'; this._vlRenderPanel(); return; }
    if (!s.armCols.length) { s.error = 'Select at least one item column for transaction building.'; this._vlRenderPanel(); return; }
    s.loading = 'arm';
    this._vlRenderPanel();

    setTimeout(() => {
      try {
        // Build transactions — each row becomes one transaction of "col=val" items
        // The NumericalEngine.apriori expects [{items:[...]}] format
        const transactions = s.workingRows.map(r => {
          const items = [];
          s.armCols.forEach(col => {
            const v = r[col];
            if (v !== null && v !== undefined && v !== '') items.push(`${col}=${v}`);
          });
          return { items };
        }).filter(t => t.items.length > 0);

        if (transactions.length === 0) {
          s.error = 'No valid transactions from selected columns. Ensure selected columns have non-empty values.';
          s.loading = ''; this._vlRenderPanel(); return;
        }

        // Count unique items for intermediate display
        const itemCounts = {};
        transactions.forEach(t => t.items.forEach(item => { itemCounts[item] = (itemCounts[item]||0)+1; }));
        const N = transactions.length;
        const itemSupports = Object.entries(itemCounts)
          .map(([item, cnt]) => ({ item, count: cnt, support: (cnt/N)*100, supportPct: (cnt/N)*100 }))
          .sort((a,b) => b.count - a.count);

        const res = NumericalEngine.apriori(transactions, s.armSupport, s.armConf);
        if (res?.error) { s.error = res.error; s.armResult = null; s.loading = ''; this._vlRenderPanel(); return; }

        // Normalise result fields for display
        const frequentItemsets = [
          ...(res.frequent1Itemsets||[]).map(x => ({
            items: [x.item], support: x.supportPct || x.supportPct, supportPct: x.supportPct
          })),
          ...(res.frequent2Itemsets||[]).map(x => ({
            items: (x.pair||'').split(' + '), support: x.supportPct, supportPct: x.supportPct
          }))
        ];
        const rules = (res.rules||[]).map(r => ({
          antecedent: [r.antecedent], consequent: [r.consequent],
          support: r.support, confidence: r.confidence, lift: r.lift
        }));

        s.armResult  = { frequentItemsets, rules };
        s.armIntermediate = {
          totalTransactions: N,
          uniqueItems: itemSupports.length,
          itemSupports: itemSupports.slice(0, 10),
          minSupport: s.armSupport,
          minConfidence: s.armConf
        };
        s.stageComplete.arm = true;
        s.loading = '';
        this._vlRenderPanel();
      } catch(e) {
        s.error = `Association rule mining error: ${e.message}`;
        s.loading = ''; this._vlRenderPanel();
      }
    }, 80);
  }

  _vlDownloadCsv() {
    const s = this._vlState;
    const ds = s.dataset;
    const rows = s.workingRows || ds?.rows;
    if (!ds || !rows) return;
    const headers = Object.keys(rows[0] || {});
    const content = [headers.join(','), ...rows.map(r => headers.map(h => {
      const v = r[h]; if (v === null || v === undefined) return '';
      return typeof v === 'string' && v.includes(',') ? `"${v}"` : String(v);
    }).join(','))].join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'processed_dataset.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  renderVirtualLabSection() {
    this._vlRenderPanel();
  }

  _vlRenderPanel() {
    const root = this.mount.querySelector('#vl-section-root');
    if (!root) return;
    const s = this._vlState;
    const ds = s.dataset;
    const wRows = s.workingRows || ds?.rows || [];

    const tabs = [
      { id: 'dataset',        icon: '📂', label: 'Dataset',          col: '#2563eb' },
      { id: 'preprocessing',  icon: '⚙️',  label: 'Preprocessing',    col: '#7c3aed' },
      { id: 'classification', icon: '🌿', label: 'Classification',    col: '#d97706' },
      { id: 'clustering',     icon: '🔵', label: 'Clustering',        col: '#059669' },
      { id: 'arm',            icon: '🔗', label: 'Association Rules', col: '#0f766e' },
    ];

    root.innerHTML = `
      <div>

        <!-- SECTION HEADING -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:8px;background:#eff6ff;color:#2563eb;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:20px;border:1px solid #bfdbfe;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;">
              🧪 VIRTUAL LAB — INTERACTIVE EXPERIMENT WORKFLOW
            </div>
            <h2 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0;">Dataset-Driven Experiment Pipeline</h2>
            <p style="font-size:0.85rem;color:#64748b;margin:4px 0 0;">Upload your CSV once — then preprocess, classify, cluster, and mine association rules without re-uploading.</p>
          </div>
        </div>

        <!-- DATASET STATUS BANNER -->
        <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:14px;padding:14px 20px;margin-bottom:18px;display:flex;flex-wrap:wrap;align-items:center;gap:14px;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
            <div style="width:10px;height:10px;border-radius:50%;background:${ds ? '#22c55e' : '#ef4444'};box-shadow:0 0 8px ${ds ? '#22c55e' : '#ef4444'};flex-shrink:0;"></div>
            <span style="color:#94a3b8;font-size:0.75rem;font-weight:700;text-transform:uppercase;">Active Dataset:</span>
            <span style="color:#f8fafc;font-size:0.95rem;font-weight:800;">${ds ? ds.name : 'No dataset loaded'}</span>
            ${ds ? `
              <span style="background:#1e3a5f;color:#60a5fa;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:6px;">${ds.totalRows} rows</span>
              <span style="background:#1a2e1a;color:#4ade80;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:6px;">${ds.totalCols} cols</span>
              ${wRows.length !== ds.totalRows ? `<span style="background:#3a2000;color:#fb923c;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:6px;">Working: ${wRows.length} rows</span>` : ''}
              ${s.prepLog.length > 0 ? `<span style="background:#2d1a4e;color:#c084fc;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:6px;">${s.prepLog.length} prep step${s.prepLog.length > 1 ? 's' : ''}</span>` : ''}
            ` : ''}
          </div>
          ${ds ? `<span style="color:#22c55e;font-size:0.75rem;font-weight:700;">✓ Dataset Loaded — Available in all tabs</span>` : `<span style="color:#ef4444;font-size:0.75rem;font-weight:700;">Upload a CSV in Dataset tab to begin</span>`}
        </div>

        <!-- PROGRESS STEPPER -->
        <div style="display:flex;align-items:stretch;gap:0;background:white;border:1px solid #e2e8f0;border-radius:14px;padding:16px 20px;margin-bottom:18px;overflow-x:auto;">
          ${tabs.map((t, i) => {
            const done = s.stageComplete[t.id];
            const active = s.activeTab === t.id;
            const loading = s.loading === t.id;
            const statusIcon = loading ? '⏳' : done ? '✅' : active ? '▶' : '🔒';
            const bgCol = loading ? '#fef3c7' : done ? '#f0fdf4' : active ? t.col + '15' : '#f8fafc';
            const borderCol = loading ? '#fcd34d' : done ? '#86efac' : active ? t.col : '#e2e8f0';
            const textCol = active ? t.col : done ? '#166534' : '#94a3b8';
            return `
              <div style="display:flex;align-items:center;flex-shrink:0;">
                <div onclick="document.getElementById('vl-tab-${t.id}')?.click()"
                  style="display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;
                    background:${bgCol};border:2px solid ${borderCol};border-radius:10px;
                    padding:10px 14px;min-width:80px;transition:all 0.2s;">
                  <div style="font-size:1.1rem;">${statusIcon !== '▶' ? statusIcon : t.icon}</div>
                  <span style="font-size:0.65rem;font-weight:800;color:${textCol};text-align:center;">${t.label}</span>
                  ${done ? `<span style="font-size:0.58rem;color:#16a34a;font-weight:700;">Done ✓</span>` :
                    loading ? `<span style="font-size:0.58rem;color:#d97706;font-weight:700;">Running…</span>` :
                    active ? `<span style="font-size:0.58rem;color:${t.col};font-weight:700;">Active</span>` :
                    `<span style="font-size:0.58rem;color:#cbd5e1;font-weight:700;">Pending</span>`}
                </div>
                ${i < tabs.length - 1 ? `<div style="flex:1;min-width:20px;height:2px;background:linear-gradient(90deg,${done?'#22c55e':borderCol},${tabs[i+1].col}30);margin:0 4px;"></div>` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- TAB NAVIGATION -->
        <div style="display:flex;gap:6px;margin-bottom:18px;overflow-x:auto;padding-bottom:2px;">
          ${tabs.map(t => {
            const loading = s.loading === t.id;
            const done = s.stageComplete[t.id];
            return `
              <button id="vl-tab-${t.id}" class="vl-tab-btn" data-vl-tab="${t.id}" style="
                flex-shrink:0;padding:9px 16px;border-radius:9px;border:2px solid ${s.activeTab === t.id ? t.col : '#e2e8f0'};
                background:${s.activeTab === t.id ? t.col : 'white'};color:${s.activeTab === t.id ? 'white' : '#64748b'};
                font-size:0.8rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;
                box-shadow:${s.activeTab === t.id ? `0 4px 10px ${t.col}33` : 'none'};
              ">${loading ? '⏳' : done ? '✅' : t.icon} ${t.label}${loading ? ' …' : ''}</button>
            `;
          }).join('')}
        </div>

        <!-- ERROR MESSAGE -->
        ${s.error ? `<div style="background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;padding:10px 14px;border-radius:9px;margin-bottom:14px;font-size:0.83rem;font-weight:600;">⚠️ ${s.error}</div>` : ''}

        <!-- LOADING INDICATOR -->
        ${s.loading ? `<div style="background:#fffbeb;border:1px solid #fcd34d;color:#92400e;padding:12px 16px;border-radius:9px;margin-bottom:14px;font-size:0.85rem;font-weight:700;display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.2rem;">⏳</span> Running ${s.loading} algorithm on ${wRows.length} rows… please wait.
        </div>` : ''}

        <!-- TAB PANELS -->
        ${s.activeTab === 'dataset'        ? this._vlDatasetTab(ds, wRows, s) : ''}
        ${s.activeTab === 'preprocessing'  ? this._vlPrepTab(ds, wRows, s) : ''}
        ${s.activeTab === 'classification' ? this._vlClfTab(ds, wRows, s) : ''}
        ${s.activeTab === 'clustering'     ? this._vlCluTab(ds, wRows, s) : ''}
        ${s.activeTab === 'arm'            ? this._vlArmTab(ds, wRows, s) : ''}

      </div>
    `;

    // Bind tab buttons
    root.querySelectorAll('.vl-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        s.activeTab = btn.getAttribute('data-vl-tab');
        s.error = '';
        this._vlRenderPanel();
      });
    });

    // Dataset tab events
    const csvInput  = root.querySelector('#vl-csv-input');
    const browseBtn = root.querySelector('#vl-browse-btn');
    const dropZone  = root.querySelector('#vl-dropzone');
    const sampleBtn = root.querySelector('#vl-sample-btn');
    const dlBtn     = root.querySelector('#vl-download-btn');

    if (browseBtn && csvInput) { browseBtn.addEventListener('click', () => csvInput.click()); }
    if (csvInput) {
      csvInput.addEventListener('change', e => {
        const f = e.target.files[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const parsed = this._vlParseCsv(f.name, ev.target.result);
          if (!parsed) { s.error = 'Invalid CSV. Ensure it has headers and data.'; this._vlRenderPanel(); return; }
          s.dataset = parsed; s.workingRows = JSON.parse(JSON.stringify(parsed.rows));
          s.prepLog = []; s.clfTarget = parsed.catCols[0] || parsed.headers[parsed.headers.length - 1] || '';
          s.clfFeatures = parsed.numericCols.slice(); s.cluX = parsed.numericCols[0] || ''; s.cluY = parsed.numericCols[1] || parsed.numericCols[0] || '';
          s.armCols = parsed.catCols.length >= 2 ? parsed.catCols.slice(0, 3) : parsed.headers.slice(-3); s.error = ''; s.clfResult = null; s.cluResult = null; s.armResult = null;
          s.clfIntermediate = null; s.cluIntermediate = null; s.armIntermediate = null;
          s.stageComplete = { dataset: true, preprocessing: false, classification: false, clustering: false, arm: false };
          this._vlRenderPanel();
        };
        reader.readAsText(f);
      });
    }
    if (dropZone) {
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = '#2563eb'; dropZone.style.background = '#eff6ff'; });
      dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = '#cbd5e1'; dropZone.style.background = '#f8fafc'; });
      dropZone.addEventListener('drop', e => {
        e.preventDefault(); dropZone.style.borderColor = '#cbd5e1'; dropZone.style.background = '#f8fafc';
        const f = e.dataTransfer.files[0]; if (!f || !f.name.endsWith('.csv')) { s.error = 'Only .csv files are supported.'; this._vlRenderPanel(); return; }
        const reader = new FileReader();
        reader.onload = ev => {
          const parsed = this._vlParseCsv(f.name, ev.target.result);
          if (!parsed) { s.error = 'Invalid CSV.'; this._vlRenderPanel(); return; }
          s.dataset = parsed; s.workingRows = JSON.parse(JSON.stringify(parsed.rows));
          s.prepLog = []; s.clfTarget = parsed.catCols[0] || ''; s.clfFeatures = parsed.numericCols.slice();
          s.cluX = parsed.numericCols[0] || ''; s.cluY = parsed.numericCols[1] || parsed.numericCols[0] || '';
          s.armCols = parsed.catCols.length >= 2 ? parsed.catCols.slice(0, 3) : parsed.headers.slice(-3); s.error = ''; s.clfResult = null; s.cluResult = null; s.armResult = null;
          s.clfIntermediate = null; s.cluIntermediate = null; s.armIntermediate = null;
          s.stageComplete = { dataset: true, preprocessing: false, classification: false, clustering: false, arm: false };
          this._vlRenderPanel();
        };
        reader.readAsText(f);
      });
    }
    if (sampleBtn) sampleBtn.addEventListener('click', () => { this._vlLoadSample(); this._vlRenderPanel(); });
    if (dlBtn) dlBtn.addEventListener('click', () => this._vlDownloadCsv());
    const armDlBtn = root.querySelector('#vl-arm-dl-btn');
    if (armDlBtn) armDlBtn.addEventListener('click', () => this._vlDownloadCsv());

    // "Proceed to Preprocessing" button
    const gotoPrepBtn = root.querySelector('#vl-goto-prep');
    if (gotoPrepBtn) gotoPrepBtn.addEventListener('click', () => {
      s.activeTab = 'preprocessing'; s.error = ''; this._vlRenderPanel();
    });

    // "Next Stage" buttons within result panels
    const nextPrepBtn = root.querySelector('#vl-next-to-clf');
    if (nextPrepBtn) nextPrepBtn.addEventListener('click', () => {
      s.stageComplete.preprocessing = true; s.activeTab = 'classification'; s.error = ''; this._vlRenderPanel();
    });
    const nextClfBtn = root.querySelector('#vl-next-to-clu');
    if (nextClfBtn) nextClfBtn.addEventListener('click', () => {
      s.activeTab = 'clustering'; s.error = ''; this._vlRenderPanel();
    });
    const nextCluBtn = root.querySelector('#vl-next-to-arm');
    if (nextCluBtn) nextCluBtn.addEventListener('click', () => {
      s.activeTab = 'arm'; s.error = ''; this._vlRenderPanel();
    });

    // Preprocessing events
    root.querySelectorAll('.vl-prep-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-prep');
        const sel = root.querySelector(`.vl-prep-col[data-prep="${action}"]`);
        this._vlPreprocess(action, sel ? sel.value : '');
      });
    });
    const resetPrepBtn = root.querySelector('#vl-reset-prep');
    if (resetPrepBtn) resetPrepBtn.addEventListener('click', () => {
      s.workingRows = JSON.parse(JSON.stringify(s.dataset.rows));
      s.prepLog = []; s.error = ''; s.clfResult = null; s.cluResult = null; s.armResult = null;
      this._vlRenderPanel();
    });

    // Classification events
    root.querySelectorAll('input[name="vl-clf-algo"]').forEach(r => {
      r.addEventListener('change', e => { s.clfAlgo = e.target.value; s.clfResult = null; this._vlRenderPanel(); });
    });
    const clfTargetSel = root.querySelector('#vl-clf-target');
    if (clfTargetSel) clfTargetSel.addEventListener('change', e => {
      s.clfTarget = e.target.value;
      s.clfFeatures = (ds?.numericCols || []).filter(c => c !== e.target.value);
      s.clfResult = null; this._vlRenderPanel();
    });
    root.querySelectorAll('.vl-clf-feature').forEach(cb => {
      cb.addEventListener('change', () => { s.clfFeatures = [...root.querySelectorAll('.vl-clf-feature:checked')].map(c => c.value); });
    });
    const clfKInput = root.querySelector('#vl-clf-k');
    if (clfKInput) clfKInput.addEventListener('change', e => { s.clfK = parseInt(e.target.value) || 3; });
    const clfSplitSel = root.querySelector('#vl-clf-split');
    if (clfSplitSel) clfSplitSel.addEventListener('change', e => { s.clfSplit = parseFloat(e.target.value) || 0.8; });
    const runClfBtn = root.querySelector('#vl-run-clf');
    if (runClfBtn) runClfBtn.addEventListener('click', () => this._vlRunClassification());

    // Clustering events
    root.querySelectorAll('input[name="vl-clu-algo"]').forEach(r => {
      r.addEventListener('change', e => { s.cluAlgo = e.target.value; s.cluResult = null; this._vlRenderPanel(); });
    });
    const xSel = root.querySelector('#vl-clu-x');
    if (xSel) xSel.addEventListener('change', e => { s.cluX = e.target.value; });
    const ySel = root.querySelector('#vl-clu-y');
    if (ySel) ySel.addEventListener('change', e => { s.cluY = e.target.value; });
    const cluKInput = root.querySelector('#vl-clu-k');
    if (cluKInput) cluKInput.addEventListener('change', e => { s.cluK = parseInt(e.target.value) || 3; });
    const epsInput = root.querySelector('#vl-clu-eps');
    if (epsInput) epsInput.addEventListener('change', e => { s.cluEps = parseFloat(e.target.value) || 1.5; });
    const minPtsInput = root.querySelector('#vl-clu-minpts');
    if (minPtsInput) minPtsInput.addEventListener('change', e => { s.cluMinPts = parseInt(e.target.value) || 3; });
    const linkageSel = root.querySelector('#vl-clu-linkage');
    if (linkageSel) linkageSel.addEventListener('change', e => { s.cluLinkage = e.target.value; });
    const runCluBtn = root.querySelector('#vl-run-clu');
    if (runCluBtn) runCluBtn.addEventListener('click', () => { this._vlRunClustering(); setTimeout(() => this._vlDrawCanvas(), 100); });

    // ARM events
    root.querySelectorAll('.vl-arm-col').forEach(cb => {
      cb.addEventListener('change', () => { s.armCols = [...root.querySelectorAll('.vl-arm-col:checked')].map(c => c.value); });
    });
    const supInput = root.querySelector('#vl-arm-sup');
    if (supInput) supInput.addEventListener('change', e => { s.armSupport = parseFloat(e.target.value) || 20; });
    const confInput = root.querySelector('#vl-arm-conf');
    if (confInput) confInput.addEventListener('change', e => { s.armConf = parseFloat(e.target.value) || 50; });
    const runArmBtn = root.querySelector('#vl-run-arm');
    if (runArmBtn) runArmBtn.addEventListener('click', () => this._vlRunARM());

    if (window.lucide) window.lucide.createIcons();
  }

  // ---- VL Tab: DATASET ----
  _vlDatasetTab(ds, wRows, s) {
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
        <!-- Upload -->
        <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;">
          <h4 style="font-size:0.9rem;font-weight:800;color:#0f172a;margin:0 0 12px;display:flex;align-items:center;gap:7px;">
            📤 Step 1 — Upload Dataset
          </h4>
          <div id="vl-dropzone" style="border:2px dashed ${ds?'#86efac':'#cbd5e1'};border-radius:10px;padding:24px;text-align:center;background:${ds?'#f0fdf4':'#f8fafc'};cursor:pointer;transition:all 0.2s;">
            <div style="font-size:2rem;margin-bottom:8px;">${ds ? '✅' : '📄'}</div>
            <div style="font-weight:700;color:#0f172a;font-size:0.88rem;margin-bottom:4px;">${ds ? ds.name : 'Drag & Drop CSV Here'}</div>
            <div style="font-size:0.73rem;color:#64748b;margin-bottom:12px;">Upload once — shared across all experiment stages</div>
            <input type="file" id="vl-csv-input" accept=".csv" style="display:none;">
            <button id="vl-browse-btn" style="background:#2563eb;color:white;border:none;padding:8px 18px;border-radius:7px;font-size:0.82rem;font-weight:700;cursor:pointer;">${ds?'Replace CSV':'Browse CSV'}</button>
          </div>
          <div style="display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap;">
            <button id="vl-sample-btn" style="background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;font-size:0.75rem;font-weight:700;padding:5px 12px;border-radius:6px;cursor:pointer;">📊 Load Iris Sample</button>
            ${ds ? `<button id="vl-download-btn" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;font-size:0.75rem;font-weight:700;padding:5px 12px;border-radius:6px;cursor:pointer;">⬇ Download Working CSV</button>` : ''}
          </div>
          ${ds ? `
            <div style="margin-top:12px;padding:10px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;font-size:0.77rem;color:#166534;font-weight:600;">
              ✅ Dataset loaded. Navigate to any stage tab above to continue.
            </div>
            <button id="vl-goto-prep" style="margin-top:10px;width:100%;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;border:none;padding:11px;border-radius:9px;font-size:0.88rem;font-weight:800;cursor:pointer;">
              Proceed to Preprocessing ⚙️ →
            </button>
          ` : ''}
        </div>

        <!-- Stats -->
        <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;">
          <h4 style="font-size:0.9rem;font-weight:800;color:#0f172a;margin:0 0 12px;">📊 Dataset Overview</h4>
          ${ds ? `
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
              ${[['Rows', ds.totalRows, '#0f172a'], ['Columns', ds.totalCols, '#2563eb'], ['Numeric', ds.numericCols.length, '#059669'], ['Categorical', ds.catCols.length, '#9333ea'], ['Missing Values', ds.missingCount, ds.missingCount > 0 ? '#dc2626' : '#16a34a'], ['Duplicate Rows', ds.dupCount, ds.dupCount > 0 ? '#ea580c' : '#16a34a']].map(([l, v, c]) => `
                <div style="background:#f8fafc;padding:8px;border-radius:7px;text-align:center;border:1px solid ${c}22;">
                  <div style="font-size:0.6rem;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:2px;">${l}</div>
                  <div style="font-size:1.1rem;font-weight:800;color:${c};">${v}</div>
                </div>
              `).join('')}
            </div>
            ${ds.missingCount > 0 ? `<div style="background:#fef2f2;border:1px solid #fca5a5;padding:8px 12px;border-radius:7px;font-size:0.75rem;color:#991b1b;font-weight:600;margin-bottom:10px;">⚠️ ${ds.missingCount} missing values detected. Use Preprocessing → Mean/Median Imputation or Drop Missing Rows to fix.</div>` : ''}
            ${ds.dupCount > 0 ? `<div style="background:#fff7ed;border:1px solid #fed7aa;padding:8px 12px;border-radius:7px;font-size:0.75rem;color:#92400e;font-weight:600;margin-bottom:10px;">⚠️ ${ds.dupCount} duplicate rows detected. Use Preprocessing → Remove Duplicates.</div>` : ''}
            <div style="font-size:0.7rem;font-weight:700;color:#475569;text-transform:uppercase;margin-bottom:3px;">Numeric: <span style="color:#059669;font-weight:600;">${ds.numericCols.join(', ') || 'None'}</span></div>
            <div style="font-size:0.7rem;font-weight:700;color:#475569;text-transform:uppercase;">Categorical: <span style="color:#9333ea;font-weight:600;">${ds.catCols.join(', ') || 'None'}</span></div>
          ` : `<div style="text-align:center;padding:28px;color:#94a3b8;font-size:0.85rem;">Upload a CSV to see dataset overview</div>`}
        </div>

        <!-- Preview -->
        ${ds ? `
          <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;grid-column:1/-1;">
            <h4 style="font-size:0.88rem;font-weight:800;color:#0f172a;margin:0 0 10px;">🗂 Data Preview (first 8 rows)</h4>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.72rem;">
                <thead><tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  ${Object.keys(wRows[0] || {}).map(h => `<th style="padding:5px 8px;text-align:left;font-weight:700;color:#475569;white-space:nowrap;">${h}<br><span style="font-size:0.6rem;font-weight:500;color:${ds.numericCols.includes(h)?'#059669':'#9333ea'};">${ds.numericCols.includes(h)?'numeric':'categorical'}</span></th>`).join('')}
                </tr></thead>
                <tbody>
                  ${wRows.slice(0, 8).map(row => `
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      ${Object.keys(wRows[0]).map(h => `<td style="padding:4px 8px;white-space:nowrap;">${row[h] !== null && row[h] !== undefined ? row[h] : '<em style="color:#94a3b8">null</em>'}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Per-Column Quality Analysis -->
          <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;grid-column:1/-1;">
            <h4 style="font-size:0.88rem;font-weight:800;color:#0f172a;margin:0 0 10px;">🔬 Column Quality Analysis</h4>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.72rem;">
                <thead><tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0;">
                  <th style="padding:6px 10px;text-align:left;font-weight:700;color:#475569;">Column</th>
                  <th style="padding:6px 10px;font-weight:700;color:#475569;">Type</th>
                  <th style="padding:6px 10px;font-weight:700;color:#475569;">Missing</th>
                  <th style="padding:6px 10px;font-weight:700;color:#475569;">Unique Values</th>
                  <th style="padding:6px 10px;font-weight:700;color:#475569;">Min</th>
                  <th style="padding:6px 10px;font-weight:700;color:#475569;">Max</th>
                  <th style="padding:6px 10px;font-weight:700;color:#475569;">Mean</th>
                  <th style="padding:6px 10px;font-weight:700;color:#475569;">Sample Values</th>
                </tr></thead>
                <tbody>${ds.headers.map(h => {
                  const isNum = ds.numericCols.includes(h);
                  const colVals = ds.rows.map(r => r[h]);
                  const missing = colVals.filter(v => v === null || v === undefined || v === '').length;
                  const nonNull = colVals.filter(v => v !== null && v !== undefined && v !== '');
                  const unique = new Set(colVals.map(v => String(v))).size;
                  const stats = ds.colStats?.[h] || {};
                  const samples = [...new Set(nonNull.slice(0, 5).map(v => String(v)))].join(', ');
                  return `<tr style="border-bottom:1px solid #f1f5f9;${missing > 0 ? 'background:#fef9f0;' : ''}">
                    <td style="padding:5px 10px;font-weight:700;color:#0f172a;">${h}</td>
                    <td style="padding:5px 10px;text-align:center;"><span style="background:${isNum?'#dcfce7':'#f3e8ff'};color:${isNum?'#15803d':'#7c3aed'};padding:2px 7px;border-radius:10px;font-size:0.65rem;font-weight:700;">${isNum ? 'Numeric' : 'Categorical'}</span></td>
                    <td style="padding:5px 10px;text-align:center;font-weight:700;color:${missing>0?'#dc2626':'#16a34a'};">${missing}${missing>0?' ⚠️':' ✓'}</td>
                    <td style="padding:5px 10px;text-align:center;color:#475569;">${unique}</td>
                    <td style="padding:5px 10px;text-align:center;color:#0284c7;">${isNum ? (stats.min || '—') : '—'}</td>
                    <td style="padding:5px 10px;text-align:center;color:#0284c7;">${isNum ? (stats.max || '—') : '—'}</td>
                    <td style="padding:5px 10px;text-align:center;color:#059669;font-weight:600;">${isNum ? (stats.mean || '—') : '—'}</td>
                    <td style="padding:5px 10px;color:#64748b;font-size:0.68rem;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${samples}">${samples}</td>
                  </tr>`;
                }).join('')}</tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // ---- VL Tab: PREPROCESSING ----
  _vlPrepTab(ds, wRows, s) {
    if (!ds) return `<div style="background:white;border:2px dashed #e9d5ff;border-radius:12px;padding:36px;text-align:center;color:#a78bfa;font-weight:600;">Upload a dataset in the Dataset tab first.</div>`;
    // Use live wRows columns (handles dropped cols after preprocessing)
    const liveRows = wRows.length > 0 ? wRows : ds.rows;
    const liveHeaders = Object.keys(liveRows[0] || {});
    const liveAnalysis = this._vlAnalyze('_', liveRows) || {};
    const allCols = liveHeaders;
    const numCols = liveAnalysis.numericCols || ds.numericCols;
    const ops = [
      { action: 'drop_missing',      label: 'Drop Missing-Value Rows',         col: '#dc2626', needsCol: false, why: 'Remove rows with any null/empty value. Use when missing data is random and dataset is large enough.' },
      { action: 'impute_mean',       label: 'Mean Imputation (Numeric)',        col: '#2563eb', needsCol: false, why: 'Replace missing numeric values with column mean. Preserves row count; good for normally-distributed data.' },
      { action: 'impute_median',     label: 'Median Imputation',               col: '#0891b2', needsCol: false, why: 'Replace missing numeric values with column median. More robust than mean when outliers are present.' },
      { action: 'remove_duplicates', label: 'Remove Duplicate Rows',           col: '#ea580c', needsCol: false, why: 'Delete identical rows. Duplicates bias models by over-representing certain patterns.' },
      { action: 'label_encode',      label: 'Label Encode Column',             col: '#9333ea', needsCol: true,  cols: allCols, why: 'Convert categorical text → integers (e.g., Cat→0, Dog→1). Required for numeric algorithms like K-Means or KNN.' },
      { action: 'minmax_normalize',  label: 'Min-Max Normalization [0,1]',     col: '#059669', needsCol: false, why: 'Scale all numeric values to [0,1]. Prevents large-magnitude features from dominating distance-based algorithms.' },
      { action: 'zscore_normalize',  label: 'Z-Score Standardization (μ=0,σ=1)', col: '#0f766e', needsCol: false, why: 'Standardize numeric features (mean=0, std=1). Good for classification algorithms sensitive to feature scale.' },
      { action: 'remove_iqr_outliers', label: 'Remove IQR Outliers',          col: '#b45309', needsCol: true,  cols: numCols, why: 'Remove rows where a column value is outside Q1−1.5×IQR or Q3+1.5×IQR. Reduces noise from extreme values.' },
      { action: 'drop_column',       label: 'Drop Column (Feature Selection)', col: '#64748b', needsCol: true,  cols: allCols, why: 'Remove a column that is irrelevant, redundant, or leaks the target label.' },
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- Status -->
          <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <h4 style="font-size:0.88rem;font-weight:800;color:#0f172a;margin:0;">⚙️ Before vs. After Preprocessing Comparison</h4>
              <button id="vl-reset-prep" style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca;font-size:0.72rem;font-weight:700;padding:4px 10px;border-radius:6px;cursor:pointer;">↺ Reset to Original</button>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;">
                <div style="font-size:0.68rem;font-weight:800;color:#64748b;text-transform:uppercase;margin-bottom:4px;">Original (Before)</div>
                <div style="font-size:0.75rem;font-weight:700;color:#0f172a;">Rows: <strong>${ds.totalRows}</strong></div>
                <div style="font-size:0.75rem;font-weight:600;color:${ds.missingCount > 0 ? '#dc2626' : '#16a34a'};">Missing: <strong>${ds.missingCount}</strong></div>
                <div style="font-size:0.75rem;font-weight:600;color:${ds.dupCount > 0 ? '#ea580c' : '#16a34a'};">Duplicates: <strong>${ds.dupCount}</strong></div>
              </div>
              <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:9px 12px;">
                <div style="font-size:0.68rem;font-weight:800;color:#7c3aed;text-transform:uppercase;margin-bottom:4px;">Working (After)</div>
                <div style="font-size:0.75rem;font-weight:700;color:#0f172a;">Rows: <strong style="color:${wRows.length < ds.totalRows ? '#dc2626' : '#16a34a'};">${wRows.length}</strong> (${wRows.length - ds.totalRows >= 0 ? '±0' : wRows.length - ds.totalRows})</div>
                <div style="font-size:0.75rem;font-weight:600;color:${(liveAnalysis.missingCount || 0) > 0 ? '#dc2626' : '#16a34a'};">Missing: <strong>${liveAnalysis.missingCount || 0}</strong></div>
                <div style="font-size:0.75rem;font-weight:600;color:${(liveAnalysis.dupCount || 0) > 0 ? '#ea580c' : '#16a34a'};">Duplicates: <strong>${liveAnalysis.dupCount || 0}</strong></div>
              </div>
            </div>
            <div style="font-size:0.72rem;color:#64748b;font-weight:600;">Applied Operations: <strong style="color:#7c3aed;">${s.prepLog.length}</strong></div>
          </div>
          <!-- Operations -->
          <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
            <h4 style="font-size:0.85rem;font-weight:800;color:#0f172a;margin:0 0 12px;">Operations</h4>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${ops.map(op => `
                <div style="background:#f8fafc;padding:9px 12px;border-radius:8px;border:1px solid #e2e8f0;display:flex;flex-direction:column;gap:6px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                    <span style="font-size:0.77rem;font-weight:700;color:#0f172a;flex:1;">${op.label}</span>
                    <div style="display:flex;gap:6px;align-items:center;">
                      ${op.needsCol && op.cols && op.cols.length > 0 ? `
                        <select class="vl-prep-col" data-prep="${op.action}" style="padding:3px 6px;border:1px solid #cbd5e1;border-radius:5px;font-size:0.72rem;max-width:110px;">
                          <option value="">--col--</option>
                          ${op.cols.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                      ` : ''}
                      <button class="vl-prep-btn" data-prep="${op.action}" style="background:${op.col};color:white;border:none;padding:4px 10px;border-radius:5px;font-size:0.72rem;font-weight:700;cursor:pointer;">Apply</button>
                    </div>
                  </div>
                  <div style="font-size:0.67rem;color:#64748b;line-height:1.3;"><strong style="color:#475569;">Why:</strong> ${op.why}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <!-- Log + Preview -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
            <h4 style="font-size:0.85rem;font-weight:800;color:#0f172a;margin:0 0 10px;">📋 Preprocessing Log</h4>
            ${s.prepLog.length === 0 ? `<div style="text-align:center;padding:20px;color:#94a3b8;font-size:0.82rem;">No operations applied yet. Select an operation on the left to begin cleaning.</div>` : `
              <div style="display:flex;flex-direction:column;gap:6px;max-height:180px;overflow-y:auto;">
                ${s.prepLog.map(step => `
                  <div style="background:#f8fafc;border:1px solid #e9d5ff;border-radius:7px;padding:8px 10px;font-size:0.75rem;">
                    <span style="background:#7c3aed;color:white;padding:1px 6px;border-radius:10px;font-size:0.65rem;font-weight:800;margin-right:6px;">${step.step}</span>
                    <strong>${step.label}</strong>
                    <span style="color:#64748b;margin-left:8px;">${step.rowsBefore}→${step.rowsAfter} rows (affected: ${step.affected}) · ${step.time}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Working vs Original Dataset Previews -->
          <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
            <h4 style="font-size:0.82rem;font-weight:800;color:#0f172a;margin:0 0 8px;">Working Dataset Preview (${wRows.length} rows)</h4>
            <div style="overflow-x:auto;max-height:170px;">
              <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                <thead><tr style="background:#faf5ff;border-bottom:1px solid #e9d5ff;">
                  ${Object.keys(wRows[0] || {}).map(h => `<th style="padding:4px 7px;font-weight:700;color:#7c3aed;text-align:left;">${h}</th>`).join('')}
                </tr></thead>
                <tbody>${wRows.slice(0, 6).map(r => `
                  <tr style="border-bottom:1px solid #f5f3ff;">${Object.keys(wRows[0]).map(h => `<td style="padding:4px 7px;">${r[h] !== null && r[h] !== undefined ? r[h] : '<em style="color:#dc2626">null</em>'}</td>`).join('')}</tr>
                `).join('')}</tbody>
              </table>
            </div>
          </div>

          ${s.prepLog.length > 0 ? `
            <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
              <h4 style="font-size:0.82rem;font-weight:800;color:#64748b;margin:0 0 8px;">Original Dataset Reference (Before Transformations)</h4>
              <div style="overflow-x:auto;max-height:140px;">
                <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                  <thead><tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                    ${ds.headers.map(h => `<th style="padding:4px 7px;font-weight:700;color:#64748b;text-align:left;">${h}</th>`).join('')}
                  </tr></thead>
                  <tbody>${ds.rows.slice(0, 4).map(r => `
                    <tr style="border-bottom:1px solid #f1f5f9;">${ds.headers.map(h => `<td style="padding:4px 7px;color:#64748b;">${r[h] !== null && r[h] !== undefined ? r[h] : '<em style="color:#dc2626">null</em>'}</td>`).join('')}</tr>
                  `).join('')}</tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- Proceed to Classification button — always shown once dataset is loaded -->
          <button id="vl-next-to-clf" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;border:none;padding:11px 16px;border-radius:9px;font-size:0.88rem;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;">
            Proceed to Classification 🌿 →
          </button>
        </div>
      </div>
    `;
  }

  // ---- VL Tab: CLASSIFICATION ----
  _vlClfTab(ds, wRows, s) {
    if (!ds) return `<div style="background:white;border:2px dashed #fed7aa;border-radius:12px;padding:36px;text-align:center;color:#fb923c;font-weight:600;">Upload a dataset first.</div>`;
    // Use wRows-derived types — handles label-encoded columns becoming numeric after preprocessing
    const liveAnalysis = wRows.length > 0 ? this._vlAnalyze('_', wRows) : null;
    const allCols = liveAnalysis?.headers || ds.headers;
    const numCols = liveAnalysis?.numericCols || ds.numericCols;
    const result = s.clfResult;
    const algos = [{ id: 'id3', label: 'Decision Tree (ID3)' }, { id: 'naivebayes', label: 'Naive Bayes' }, { id: 'knn', label: 'K-Nearest Neighbors' }];

    const distinctClasses = s.clfTarget ? [...new Set(wRows.map(r => String(r[s.clfTarget] || '')).filter(Boolean))] : [];
    const isUnsuitable = wRows.length < 4 || numCols.length === 0 || (s.clfTarget && distinctClasses.length < 2);

    return `
      <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:18px;">
        <!-- Config -->
        <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:12px;">
          <h4 style="font-size:0.9rem;font-weight:800;color:#0f172a;margin:0;">🌿 Classification Config</h4>

          ${numCols.length === 0 ? `
            <div style="background:#fff7ed;border:1px solid #fed7aa;padding:10px 12px;border-radius:8px;font-size:0.75rem;color:#92400e;line-height:1.4;">
              ⚠️ <strong>Dataset Unsuitable for Feature Training:</strong> No numeric feature columns detected in working dataset. Go to <strong style="color:#7c3aed;">Preprocessing ⚙️</strong> and apply <em>Label Encode Column</em> or <em>Min-Max Normalization</em>.
            </div>
          ` : ''}

          ${s.clfTarget && distinctClasses.length < 2 ? `
            <div style="background:#fef2f2;border:1px solid #fecaca;padding:10px 12px;border-radius:8px;font-size:0.75rem;color:#991b1b;line-height:1.4;">
              ⚠️ <strong>Target Unsuitable:</strong> Column "<strong>${s.clfTarget}</strong>" has only ${distinctClasses.length} unique class value (${distinctClasses[0] || 'none'}). Classification requires at least 2 distinct classes.
            </div>
          ` : ''}

          <div>
            <div style="font-size:0.72rem;font-weight:700;color:#475569;text-transform:uppercase;margin-bottom:6px;">Algorithm</div>
            ${algos.map(a => `
              <label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border:1.5px solid ${s.clfAlgo === a.id ? '#d97706' : '#e2e8f0'};border-radius:7px;cursor:pointer;margin-bottom:5px;background:${s.clfAlgo === a.id ? '#fff7ed' : 'white'};">
                <input type="radio" name="vl-clf-algo" value="${a.id}" ${s.clfAlgo === a.id ? 'checked' : ''} style="accent-color:#d97706;">
                <span style="font-size:0.8rem;font-weight:700;color:${s.clfAlgo === a.id ? '#d97706' : '#334155'};">${a.label}</span>
              </label>
            `).join('')}
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:#475569;text-transform:uppercase;display:block;margin-bottom:4px;">Target Column (Class Label)</label>
            <select id="vl-clf-target" style="width:100%;padding:7px;border-radius:7px;border:1px solid #cbd5e1;font-size:0.82rem;font-weight:600;">
              <option value="">-- select target --</option>
              ${allCols.map(c => `<option value="${c}" ${s.clfTarget === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div>
            <div style="font-size:0.72rem;font-weight:700;color:#475569;text-transform:uppercase;margin-bottom:4px;">Input Features (${numCols.length} available)</div>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:8px;max-height:110px;overflow-y:auto;">
              ${numCols.length === 0 ? `<div style="font-size:0.72rem;color:#94a3b8;font-style:italic;">No numeric features available</div>` : numCols.map(c => `
                <label style="display:flex;align-items:center;gap:6px;padding:2px 0;cursor:pointer;font-size:0.78rem;">
                  <input type="checkbox" class="vl-clf-feature" value="${c}" ${s.clfFeatures.includes(c) ? 'checked' : ''} ${c === s.clfTarget ? 'disabled' : ''}>
                  ${c}${c === s.clfTarget ? ' (target)' : ''}
                </label>
              `).join('')}
            </div>
          </div>
          ${s.clfAlgo === 'knn' ? `
            <div><label style="font-size:0.72rem;font-weight:700;color:#475569;text-transform:uppercase;display:block;margin-bottom:4px;">K Neighbors</label>
            <input type="number" id="vl-clf-k" value="${s.clfK}" min="1" max="15" style="width:100%;padding:7px;border-radius:7px;border:1px solid #cbd5e1;font-size:0.82rem;"></div>
          ` : ''}
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:#475569;text-transform:uppercase;display:block;margin-bottom:4px;">Train/Test Split</label>
            <select id="vl-clf-split" style="width:100%;padding:7px;border-radius:7px;border:1px solid #cbd5e1;font-size:0.82rem;font-weight:600;">
              <option value="0.7" ${s.clfSplit === 0.7 ? 'selected' : ''}>70% / 30%</option>
              <option value="0.8" ${s.clfSplit === 0.8 ? 'selected' : ''}>80% / 20% (default)</option>
              <option value="0.9" ${s.clfSplit === 0.9 ? 'selected' : ''}>90% / 10%</option>
            </select>
          </div>
          <button id="vl-run-clf" style="background:linear-gradient(135deg,#d97706,#b45309);color:white;border:none;padding:11px;border-radius:9px;font-size:0.88rem;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;">${s.loading==='classification'?'⏳ Running…':'▶ Run Classification'}</button>
        </div>
        <!-- Results -->
        <div>
          ${result ? `
            <div style="display:flex;flex-direction:column;gap:12px;">
              <!-- Summary metrics -->
              <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                <h4 style="font-size:0.88rem;font-weight:800;color:#0f172a;margin:0 0 10px;">✅ Classification Results — ${result.classes.join(' / ')}</h4>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:8px 14px;border-radius:8px;text-align:center;"><div style="font-size:0.62rem;font-weight:700;color:#166534;text-transform:uppercase;">Accuracy</div><div style="font-size:1.2rem;font-weight:800;color:#15803d;">${result.accuracy}%</div></div>
                  <div style="background:#eff6ff;border:1px solid #bfdbfe;padding:8px 14px;border-radius:8px;text-align:center;"><div style="font-size:0.62rem;font-weight:700;color:#1e40af;text-transform:uppercase;">Train Rows</div><div style="font-size:1.2rem;font-weight:800;color:#1d4ed8;">${result.trainSize}</div></div>
                  <div style="background:#fff7ed;border:1px solid #fed7aa;padding:8px 14px;border-radius:8px;text-align:center;"><div style="font-size:0.62rem;font-weight:700;color:#92400e;text-transform:uppercase;">Test Rows</div><div style="font-size:1.2rem;font-weight:800;color:#c2410c;">${result.testSize}</div></div>
                  ${result.macroF1 !== undefined ? `<div style="background:#faf5ff;border:1px solid #e9d5ff;padding:8px 14px;border-radius:8px;text-align:center;"><div style="font-size:0.62rem;font-weight:700;color:#6d28d9;text-transform:uppercase;">Macro F1</div><div style="font-size:1.2rem;font-weight:800;color:#7c3aed;">${result.macroF1}%</div></div>` : ''}
                </div>

                <!-- Confusion Matrix -->
                <div style="font-size:0.73rem;font-weight:800;color:#475569;text-transform:uppercase;margin-bottom:6px;">Confusion Matrix</div>
                <div style="overflow-x:auto;">
                  <table style="border-collapse:collapse;font-size:0.72rem;">
                    <thead><tr>
                      <th style="padding:5px 8px;background:#f8fafc;border:1px solid #e2e8f0;color:#475569;">↓Actual / Pred→</th>
                      ${result.classes.map(c => `<th style="padding:5px 8px;background:#eff6ff;border:1px solid #e2e8f0;color:#2563eb;font-weight:700;">${c}</th>`).join('')}
                    </tr></thead>
                    <tbody>
                      ${result.classes.map(actual => `
                        <tr>
                          <th style="padding:5px 8px;background:#eff6ff;border:1px solid #e2e8f0;color:#2563eb;font-weight:700;text-align:left;">${actual}</th>
                          ${result.classes.map(pred => {
                            const v = (result.matrix[actual] || {})[pred] || 0;
                            const diag = actual === pred;
                            return `<td style="padding:5px 10px;border:1px solid #e2e8f0;text-align:center;background:${diag && v > 0 ? '#f0fdf4' : v > 0 ? '#fef2f2' : 'white'};font-weight:${diag ? '800' : '500'};color:${diag && v > 0 ? '#15803d' : v > 0 ? '#dc2626' : '#94a3b8'};">${v}</td>`;
                          }).join('')}
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>

                <!-- Per-class metrics -->
                ${result.perClass ? `
                  <div style="margin-top:12px;overflow-x:auto;">
                    <div style="font-size:0.73rem;font-weight:800;color:#475569;text-transform:uppercase;margin-bottom:6px;">Per-Class Metrics</div>
                    <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                      <thead><tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                        <th style="padding:4px 8px;text-align:left;font-weight:700;color:#475569;">Class</th>
                        <th style="padding:4px 8px;font-weight:700;color:#475569;">Precision</th>
                        <th style="padding:4px 8px;font-weight:700;color:#475569;">Recall</th>
                        <th style="padding:4px 8px;font-weight:700;color:#475569;">F1</th>
                        <th style="padding:4px 8px;font-weight:700;color:#475569;">TP</th>
                        <th style="padding:4px 8px;font-weight:700;color:#475569;">FP</th>
                        <th style="padding:4px 8px;font-weight:700;color:#475569;">FN</th>
                      </tr></thead>
                      <tbody>${result.classes.map(cls => {
                        const m = result.perClass[cls] || {};
                        return `<tr style="border-bottom:1px solid #f1f5f9;">
                          <td style="padding:4px 8px;font-weight:700;">${cls}</td>
                          <td style="padding:4px 8px;text-align:center;color:#2563eb;">${m.precision}%</td>
                          <td style="padding:4px 8px;text-align:center;color:#059669;">${m.recall}%</td>
                          <td style="padding:4px 8px;text-align:center;font-weight:700;color:#7c3aed;">${m.f1}%</td>
                          <td style="padding:4px 8px;text-align:center;color:#15803d;">${m.tp}</td>
                          <td style="padding:4px 8px;text-align:center;color:#dc2626;">${m.fp}</td>
                          <td style="padding:4px 8px;text-align:center;color:#ea580c;">${m.fn}</td>
                        </tr>`;
                      }).join('')}</tbody>
                    </table>
                  </div>
                ` : ''}
              </div>

              <!-- INTERMEDIATE CALCULATIONS -->
              ${s.clfIntermediate ? `
                <div style="background:white;border:1px solid #fed7aa;border-radius:12px;padding:14px;">
                  <div style="font-size:0.85rem;font-weight:800;color:#92400e;margin-bottom:10px;">🔍 Intermediate Calculations</div>
                  ${s.clfIntermediate.entropySteps ? `
                    <div style="font-size:0.75rem;font-weight:700;color:#0f172a;margin-bottom:6px;">
                      System Entropy (parent): <strong>${s.clfIntermediate.entropySteps.systemEntropy} bits</strong>
                    </div>
                    <div style="overflow-x:auto;max-height:160px;">
                      <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                        <thead><tr style="background:#fff7ed;border-bottom:1px solid #fed7aa;">
                          <th style="padding:4px 8px;text-align:left;">Feature</th>
                          <th style="padding:4px 8px;">Sys. Entropy</th>
                          <th style="padding:4px 8px;">Wtd. Entropy</th>
                          <th style="padding:4px 8px;color:#d97706;">Info Gain</th>
                        </tr></thead>
                        <tbody>${s.clfIntermediate.entropySteps.gains.map(g => `
                          <tr style="border-bottom:1px solid #fef3c7;">
                            <td style="padding:4px 8px;font-weight:700;">${g.attr}</td>
                            <td style="padding:4px 8px;text-align:center;">${g.systemEntropy}</td>
                            <td style="padding:4px 8px;text-align:center;">${g.weightedEntropy}</td>
                            <td style="padding:4px 8px;text-align:center;font-weight:800;color:#d97706;">${g.gain}</td>
                          </tr>
                        `).join('')}</tbody>
                      </table>
                    </div>
                    <div style="font-size:0.75rem;color:#d97706;font-weight:700;margin-top:6px;">
                      ✅ Best split: <strong>${s.clfIntermediate.entropySteps.gains[0]?.attr}</strong> (Gain = ${s.clfIntermediate.entropySteps.gains[0]?.gain})
                    </div>
                  ` : ''}
                  ${s.clfIntermediate.priors ? `
                    <div style="font-size:0.75rem;font-weight:700;color:#0f172a;margin-bottom:6px;">Class Priors (P(Class)):</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                      ${s.clfIntermediate.priors.map(p => `
                        <div style="background:#fff7ed;border:1px solid #fed7aa;padding:6px 10px;border-radius:7px;">
                          <span style="font-weight:800;">${p.cls}</span>: ${p.count}/${s.clfIntermediate.priors.reduce((a,b)=>a+b.count,0)} = <span style="color:#d97706;font-weight:800;">${p.prior}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                  ${s.clfIntermediate.knnSample ? `
                    <div style="font-size:0.75rem;font-weight:700;color:#0f172a;margin-bottom:6px;">Distances (Test Row 1 → Training Rows, Top 8):</div>
                    <div style="overflow-x:auto;max-height:120px;">
                      <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                        <thead><tr style="background:#fff7ed;border-bottom:1px solid #fed7aa;">
                          <th style="padding:3px 6px;">Rank</th>
                          <th style="padding:3px 6px;">Train Row</th>
                          <th style="padding:3px 6px;">Euclidean Distance</th>
                          <th style="padding:3px 6px;">Class</th>
                          <th style="padding:3px 6px;">K-Selected?</th>
                        </tr></thead>
                        <tbody>${s.clfIntermediate.knnSample.distances.map((d, i) => `
                          <tr style="border-bottom:1px solid #fef3c7;background:${i < s.clfIntermediate.knnSample.k?'#fffbeb':'white'};">
                            <td style="padding:3px 6px;text-align:center;font-weight:700;">${i+1}</td>
                            <td style="padding:3px 6px;text-align:center;">#${d.i+1}</td>
                            <td style="padding:3px 6px;text-align:center;font-weight:700;color:#d97706;">${d.distance}</td>
                            <td style="padding:3px 6px;font-weight:700;">${d.label}</td>
                            <td style="padding:3px 6px;text-align:center;">${i < s.clfIntermediate.knnSample.k ? '✅ Yes' : '—'}</td>
                          </tr>
                        `).join('')}</tbody>
                      </table>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- Prediction Sample -->
              <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
                <div style="font-size:0.8rem;font-weight:800;color:#0f172a;margin-bottom:8px;">Prediction Sample (Test Set)</div>
                <div style="overflow-x:auto;max-height:140px;">
                  <table style="width:100%;border-collapse:collapse;font-size:0.72rem;">
                    <thead><tr style="background:#fff7ed;border-bottom:1px solid #fed7aa;color:#92400e;"><th style="padding:4px 8px;">#</th><th style="padding:4px 8px;">Actual</th><th style="padding:4px 8px;">Predicted</th><th style="padding:4px 8px;">✓/✗</th></tr></thead>
                    <tbody>${result.predictions.map((p, i) => `
                      <tr style="border-bottom:1px solid #f1f5f9;background:${p.correct ? '#f0fdf4' : '#fef2f2'};">
                        <td style="padding:4px 8px;color:#64748b;">${i + 1}</td>
                        <td style="padding:4px 8px;font-weight:700;">${p.actual}</td>
                        <td style="padding:4px 8px;font-weight:700;color:${p.correct ? '#15803d' : '#dc2626'};">${p.predicted}</td>
                        <td style="padding:4px 8px;text-align:center;">${p.correct ? '✓' : '✗'}</td>
                      </tr>
                    `).join('')}</tbody>
                  </table>
                </div>
              </div>

              <!-- Next Stage -->
              <button id="vl-next-to-clu" style="background:linear-gradient(135deg,#059669,#047857);color:white;border:none;padding:11px;border-radius:9px;font-size:0.88rem;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                Continue to Clustering 🔵 →
              </button>
            </div>
          ` : `<div style="background:white;border:2px dashed #fed7aa;border-radius:12px;padding:48px;text-align:center;"><div style="font-size:2rem;">🌿</div><div style="color:#94a3b8;font-size:0.85rem;font-weight:600;margin-top:10px;">Configure target column and features, then click Run Classification</div></div>`}
        </div>
      </div>
    `;
  }

  // ---- VL Tab: CLUSTERING ----
  _vlCluTab(ds, wRows, s) {
    if (!ds) return `<div style="background:white;border:2px dashed #bbf7d0;border-radius:12px;padding:36px;text-align:center;color:#4ade80;font-weight:600;">Upload a dataset first.</div>`;
    const liveAnalysis = wRows.length > 0 ? this._vlAnalyze('_', wRows) : null;
    const numCols = liveAnalysis?.numericCols || ds.numericCols;
    const algos = [{ id: 'kmeans', label: 'K-Means' }, { id: 'kmedoids', label: 'K-Medoids' }, { id: 'hierarchical', label: 'Hierarchical' }, { id: 'dbscan', label: 'DBSCAN' }];
    const colors = ['#2563eb', '#9333ea', '#16a34a', '#ea580c', '#ec4899', '#0284c7'];
    const res = s.cluResult;

    if (!s.cluX && numCols.length > 0) s.cluX = numCols[0];
    if (!s.cluY && numCols.length > 1) s.cluY = numCols[1] || numCols[0];

    return `
      <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:18px;">
        <!-- Config -->
        <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:12px;">
          <h4 style="font-size:0.9rem;font-weight:800;color:#0f172a;margin:0;">🔵 Clustering Config</h4>

          ${numCols.length === 0 ? `
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:10px 12px;border-radius:8px;font-size:0.75rem;color:#166534;line-height:1.4;">
              ⚠️ <strong>Dataset Unsuitable for Distance Calculations:</strong> No numeric columns found. Distance-based clustering requires numeric coordinates. Go to <strong style="color:#7c3aed;">Preprocessing ⚙️</strong> and apply <em>Label Encoding</em> or <em>Min-Max Normalization</em>.
            </div>
          ` : ''}

          <div>
            <div style="font-size:0.72rem;font-weight:700;color:#475569;text-transform:uppercase;margin-bottom:6px;">Algorithm</div>
            ${algos.map(a => `
              <label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border:1.5px solid ${s.cluAlgo === a.id ? '#059669' : '#e2e8f0'};border-radius:7px;cursor:pointer;margin-bottom:5px;background:${s.cluAlgo === a.id ? '#f0fdf4' : 'white'};">
                <input type="radio" name="vl-clu-algo" value="${a.id}" ${s.cluAlgo === a.id ? 'checked' : ''} style="accent-color:#059669;">
                <span style="font-size:0.8rem;font-weight:700;color:${s.cluAlgo === a.id ? '#059669' : '#334155'};">${a.label}</span>
              </label>
            `).join('')}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">Feature X (X Axis)</label>
            <select id="vl-clu-x" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.78rem;">
              ${numCols.length === 0 ? `<option value="">--no numeric cols--</option>` : numCols.map(c => `<option value="${c}" ${s.cluX === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select></div>
            <div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">Feature Y (Y Axis)</label>
            <select id="vl-clu-y" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.78rem;">
              ${numCols.length === 0 ? `<option value="">--no numeric cols--</option>` : numCols.map(c => `<option value="${c}" ${s.cluY === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select></div>
          </div>
          ${(s.cluAlgo === 'kmeans' || s.cluAlgo === 'kmedoids') ? `<div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">K Clusters</label><input type="number" id="vl-clu-k" value="${s.cluK}" min="2" max="8" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.82rem;"></div>` : ''}
          ${s.cluAlgo === 'dbscan' ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">Epsilon (ε)</label><input type="number" id="vl-clu-eps" value="${s.cluEps}" min="0.1" max="10" step="0.1" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.82rem;"></div>
              <div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">MinPts</label><input type="number" id="vl-clu-minpts" value="${s.cluMinPts}" min="2" max="20" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.82rem;"></div>
            </div>
          ` : ''}
          ${s.cluAlgo === 'hierarchical' ? `<div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">Linkage</label><select id="vl-clu-linkage" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.78rem;"><option value="single" ${s.cluLinkage === 'single' ? 'selected' : ''}>Single</option><option value="complete" ${s.cluLinkage === 'complete' ? 'selected' : ''}>Complete</option><option value="average" ${s.cluLinkage === 'average' ? 'selected' : ''}>Average</option></select></div>` : ''}
          <button id="vl-run-clu" style="background:linear-gradient(135deg,#059669,#047857);color:white;border:none;padding:11px;border-radius:9px;font-size:0.88rem;font-weight:800;cursor:pointer;">${s.loading==='clustering'?'⏳ Running…':'▶ Run Clustering'}</button>
        </div>
        <!-- Viz + Results -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
            <h4 style="font-size:0.85rem;font-weight:800;color:#0f172a;margin:0 0 8px;">📈 Scatter Plot</h4>
            <div style="width:100%;height:240px;background:#fafafa;border:1px solid #e2e8f0;border-radius:9px;position:relative;overflow:hidden;">
              <canvas id="vl-clu-canvas" width="500" height="240" style="width:100%;height:100%;display:block;"></canvas>
              ${!res ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.82rem;">Run clustering to see plot</div>` : ''}
            </div>
          </div>
          ${res && res.clusters ? `
            <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
              <h4 style="font-size:0.85rem;font-weight:800;color:#0f172a;margin:0 0 10px;">Cluster Summary</h4>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${(res.clusters || []).map((cls, i) => `
                  <div style="background:${colors[i % colors.length]}15;border:1px solid ${colors[i % colors.length]}33;padding:8px 12px;border-radius:8px;">
                    <div style="font-size:0.65rem;font-weight:800;color:${colors[i % colors.length]};text-transform:uppercase;">Cluster ${i + 1}</div>
                    <div style="font-size:1rem;font-weight:800;color:${colors[i % colors.length]};">${cls.length} pts</div>
                    ${res.finalCentroids?.[i] ? `<div style="font-size:0.65rem;color:#64748b;">C(${res.finalCentroids[i].x?.toFixed?.(2)}, ${res.finalCentroids[i].y?.toFixed?.(2)})</div>` : ''}
                  </div>
                `).join('')}
                ${res.totalIterations ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:8px 12px;border-radius:8px;"><div style="font-size:0.65rem;font-weight:800;color:#475569;text-transform:uppercase;">Iterations</div><div style="font-size:1rem;font-weight:800;color:#0f172a;">${res.totalIterations}</div></div>` : ''}
              </div>
            </div>
          ` : res && res.noise !== undefined ? `
            <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:8px 12px;border-radius:8px;"><div style="font-size:0.62rem;font-weight:700;color:#166534;text-transform:uppercase;">Clusters</div><div style="font-size:1.1rem;font-weight:800;color:#15803d;">${(res.clusters || []).length}</div></div>
                <div style="background:#fef2f2;border:1px solid #fca5a5;padding:8px 12px;border-radius:8px;"><div style="font-size:0.62rem;font-weight:700;color:#991b1b;text-transform:uppercase;">Noise</div><div style="font-size:1.1rem;font-weight:800;color:#dc2626;">${(res.noise || []).length}</div></div>
              </div>
            </div>
          ` : !res ? `<div style="background:white;border:2px dashed #bbf7d0;border-radius:12px;padding:30px;text-align:center;color:#86efac;font-size:0.82rem;font-weight:600;">Cluster results will appear here</div>` : ''}

          <!-- INTERMEDIATE CALCULATIONS -->
          ${s.cluIntermediate ? `
            <div style="background:white;border:1px solid #bbf7d0;border-radius:12px;padding:14px;">
              <div style="font-size:0.85rem;font-weight:800;color:#166534;margin-bottom:10px;">🔍 Intermediate Calculations — ${s.cluIntermediate.algorithm?.toUpperCase()} (${s.cluIntermediate.totalPoints} points)</div>

              ${s.cluIntermediate.iterations && s.cluIntermediate.iterations.length > 0 ? `
                <div style="font-size:0.75rem;font-weight:700;color:#0f172a;margin-bottom:6px;">K-Means / K-Medoids Iteration History (up to 4 iterations shown):</div>
                <div style="overflow-x:auto;max-height:160px;">
                  <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                    <thead><tr style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;">
                      <th style="padding:4px 8px;text-align:left;font-weight:700;color:#166534;">Iteration</th>
                      <th style="padding:4px 8px;font-weight:700;color:#166534;">Centroids (x, y)</th>
                      <th style="padding:4px 8px;font-weight:700;color:#166534;">SSE</th>
                      <th style="padding:4px 8px;font-weight:700;color:#166534;">Centroid Shift</th>
                    </tr></thead>
                    <tbody>${s.cluIntermediate.iterations.map((it, idx) => `
                      <tr style="border-bottom:1px solid #dcfce7;">
                        <td style="padding:4px 8px;font-weight:800;text-align:center;color:#15803d;">${idx + 1}</td>
                        <td style="padding:4px 8px;font-size:0.66rem;">
                          ${(it.centroids || it.medoids || []).map((c, ci) => `<span style="display:inline-block;margin:1px 3px;background:#f0fdf4;border:1px solid #bbf7d0;padding:1px 5px;border-radius:4px;">C${ci+1}(${(c.x||0).toFixed(2)}, ${(c.y||0).toFixed(2)})</span>`).join('')}
                        </td>
                        <td style="padding:4px 8px;text-align:center;color:#0284c7;font-weight:700;">${it.sse !== undefined ? it.sse.toFixed(3) : '—'}</td>
                        <td style="padding:4px 8px;text-align:center;color:${it.shift !== undefined && it.shift < 0.01 ? '#15803d' : '#d97706'};font-weight:700;">${it.shift !== undefined ? it.shift.toFixed(4) : '—'}</td>
                      </tr>
                    `).join('')}</tbody>
                  </table>
                </div>
                ${s.cluIntermediate.finalCentroids ? `
                  <div style="font-size:0.75rem;color:#15803d;font-weight:700;margin-top:6px;">
                    ✅ Converged — Final centroids: ${s.cluIntermediate.finalCentroids.map((c,i)=>`C${i+1}(${(c.x||0).toFixed(2)}, ${(c.y||0).toFixed(2)})`).join(' · ')}
                  </div>
                ` : ''}
              ` : ''}

              ${s.cluIntermediate.mergeSteps && s.cluIntermediate.mergeSteps.length > 0 ? `
                <div style="font-size:0.75rem;font-weight:700;color:#0f172a;margin-bottom:6px;">Hierarchical Merge Steps (first 6 merges):</div>
                <div style="overflow-x:auto;max-height:160px;">
                  <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                    <thead><tr style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;">
                      <th style="padding:4px 8px;font-weight:700;color:#166534;">Step</th>
                      <th style="padding:4px 8px;font-weight:700;color:#166534;">Cluster A</th>
                      <th style="padding:4px 8px;font-weight:700;color:#166534;">Cluster B</th>
                      <th style="padding:4px 8px;font-weight:700;color:#166534;">Distance</th>
                    </tr></thead>
                    <tbody>${s.cluIntermediate.mergeSteps.map((step, idx) => `
                      <tr style="border-bottom:1px solid #dcfce7;">
                        <td style="padding:4px 8px;text-align:center;font-weight:800;color:#15803d;">${idx + 1}</td>
                        <td style="padding:4px 8px;font-size:0.68rem;">${JSON.stringify(step.clusterA || step.a || '?')}</td>
                        <td style="padding:4px 8px;font-size:0.68rem;">${JSON.stringify(step.clusterB || step.b || '?')}</td>
                        <td style="padding:4px 8px;text-align:center;font-weight:700;color:#0284c7;">${(step.distance || step.dist || 0).toFixed(4)}</td>
                      </tr>
                    `).join('')}</tbody>
                  </table>
                </div>
              ` : ''}

              ${s.cluIntermediate.dbscanSummary ? `
                <div style="font-size:0.75rem;font-weight:700;color:#0f172a;margin-bottom:8px;">DBSCAN Point Classification:</div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:8px 14px;border-radius:8px;text-align:center;">
                    <div style="font-size:0.62rem;font-weight:700;color:#166534;text-transform:uppercase;">Core Points</div>
                    <div style="font-size:1.2rem;font-weight:800;color:#15803d;">${s.cluIntermediate.dbscanSummary.core}</div>
                    <div style="font-size:0.65rem;color:#64748b;">≥ MinPts neighbours in ε</div>
                  </div>
                  <div style="background:#eff6ff;border:1px solid #bfdbfe;padding:8px 14px;border-radius:8px;text-align:center;">
                    <div style="font-size:0.62rem;font-weight:700;color:#1e40af;text-transform:uppercase;">Border Points</div>
                    <div style="font-size:1.2rem;font-weight:800;color:#2563eb;">${s.cluIntermediate.dbscanSummary.border}</div>
                    <div style="font-size:0.65rem;color:#64748b;">In ε of a core point</div>
                  </div>
                  <div style="background:#fef2f2;border:1px solid #fca5a5;padding:8px 14px;border-radius:8px;text-align:center;">
                    <div style="font-size:0.62rem;font-weight:700;color:#991b1b;text-transform:uppercase;">Noise Points</div>
                    <div style="font-size:1.2rem;font-weight:800;color:#dc2626;">${s.cluIntermediate.dbscanSummary.noise}</div>
                    <div style="font-size:0.65rem;color:#64748b;">Neither core nor border</div>
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Next Stage button -->
          ${res ? `
            <button id="vl-next-to-arm" style="background:linear-gradient(135deg,#0f766e,#0d9488);color:white;border:none;padding:11px;border-radius:9px;font-size:0.88rem;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              Continue to Association Rules 🔗 →
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  _vlDrawCanvas() {
    const s = this._vlState;
    const canvas = this.mount.querySelector('#vl-clu-canvas');
    if (!canvas || !s.cluResult) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for (let x = 40; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 30; y < H; y += 35) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const colors = ['#2563eb', '#9333ea', '#16a34a', '#ea580c', '#ec4899', '#0284c7'];
    const res = s.cluResult;
    if (res.clusters && (s.cluAlgo === 'kmeans' || s.cluAlgo === 'kmedoids')) {
      const allPts = res.clusters.flatMap(c => c);
      if (!allPts.length) return;
      const xs = allPts.map(p => p.x), ys = allPts.map(p => p.y);
      const mnX = Math.min(...xs) - 0.5, mxX = Math.max(...xs) + 0.5;
      const mnY = Math.min(...ys) - 0.5, mxY = Math.max(...ys) + 0.5;
      const sx = v => 35 + ((v - mnX) / (mxX - mnX || 1)) * (W - 70);
      const sy = v => H - 20 - ((v - mnY) / (mxY - mnY || 1)) * (H - 45);
      res.clusters.forEach((cls, ci) => {
        ctx.fillStyle = colors[ci % colors.length];
        cls.forEach(pt => { ctx.beginPath(); ctx.arc(sx(pt.x), sy(pt.y), 5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(); });
      });
      (res.finalCentroids || res.finalMedoids || []).forEach((c, ci) => {
        ctx.fillStyle = colors[ci % colors.length];
        ctx.beginPath(); ctx.arc(sx(c.x), sy(c.y), 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3; ctx.stroke();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx(c.x) - 5, sy(c.y) - 5); ctx.lineTo(sx(c.x) + 5, sy(c.y) + 5);
        ctx.moveTo(sx(c.x) + 5, sy(c.y) - 5); ctx.lineTo(sx(c.x) - 5, sy(c.y) + 5); ctx.stroke();
      });
    } else if (s.cluAlgo === 'dbscan' && res.clusters) {
      const allPts = [...(res.clusters || []).flatMap(c => c), ...(res.noise || [])];
      if (!allPts.length) return;
      const xs = allPts.map(p => p.x), ys = allPts.map(p => p.y);
      const mnX = Math.min(...xs) - 0.5, mxX = Math.max(...xs) + 0.5;
      const mnY = Math.min(...ys) - 0.5, mxY = Math.max(...ys) + 0.5;
      const sx = v => 35 + ((v - mnX) / (mxX - mnX || 1)) * (W - 70);
      const sy = v => H - 20 - ((v - mnY) / (mxY - mnY || 1)) * (H - 45);
      (res.clusters || []).forEach((cls, ci) => { ctx.fillStyle = colors[ci % colors.length]; cls.forEach(p => { ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 5, 0, Math.PI * 2); ctx.fill(); }); });
      ctx.fillStyle = '#94a3b8'; (res.noise || []).forEach(p => { ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 4, 0, Math.PI * 2); ctx.fill(); });
    }
  }

  // ---- VL Tab: ASSOCIATION RULES ----
  _vlArmTab(ds, wRows, s) {
    if (!ds) return `<div style="background:white;border:2px dashed #99f6e4;border-radius:12px;padding:36px;text-align:center;color:#2dd4bf;font-weight:600;">Upload a dataset first.</div>`;
    // Use live wRows headers so dropped columns don't appear in the list
    const allCols = wRows.length > 0 ? Object.keys(wRows[0]) : ds.headers;
    const res = s.armResult;
    const itemsets = res?.frequentItemsets || [];
    const rules = res?.rules || [];
    return `
      <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:18px;">
        <!-- Config -->
        <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:12px;">
          <h4 style="font-size:0.9rem;font-weight:800;color:#0f172a;margin:0;">🔗 ARM Config</h4>
          <div>
            <div style="font-size:0.72rem;font-weight:700;color:#475569;text-transform:uppercase;margin-bottom:6px;">Item Columns (build transactions from rows)</div>
            <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:7px;padding:8px;max-height:130px;overflow-y:auto;">
              ${allCols.map(c => `
                <label style="display:flex;align-items:center;gap:6px;padding:2px 0;cursor:pointer;font-size:0.78rem;">
                  <input type="checkbox" class="vl-arm-col" value="${c}" ${s.armCols.includes(c) ? 'checked' : ''}>
                  ${c}
                </label>
              `).join('')}
            </div>
            <div style="font-size:0.68rem;color:#0f766e;margin-top:5px;font-weight:600;">Each row → transaction of "Column=Value" items.</div>
            ${s.armCols.length < 2 ? `<div style="font-size:0.68rem;color:#b45309;margin-top:4px;font-weight:700;">⚠️ Select at least 2 columns to form item combinations and discover rules (A → B).</div>` : ''}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">Min Support (%)</label><input type="number" id="vl-arm-sup" value="${s.armSupport}" min="1" max="100" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.82rem;"></div>
            <div><label style="font-size:0.7rem;font-weight:700;color:#475569;display:block;margin-bottom:3px;">Min Confidence (%)</label><input type="number" id="vl-arm-conf" value="${s.armConf}" min="1" max="100" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.82rem;"></div>
          </div>
          <button id="vl-run-arm" style="background:linear-gradient(135deg,#0f766e,#0d9488);color:white;border:none;padding:11px;border-radius:9px;font-size:0.88rem;font-weight:800;cursor:pointer;">${s.loading==='arm'?'⏳ Mining…':'▶ Mine Association Rules'}</button>
          <!-- Formulas -->
          <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:10px;">
            <div style="font-size:0.72rem;font-weight:800;color:#0f766e;text-transform:uppercase;margin-bottom:6px;">Formulas</div>
            ${[['Support(A)', 'Count(A)/N'], ['Confidence(A→B)', 'Sup(A∪B)/Sup(A)'], ['Lift(A→B)', 'Conf(A→B)/Sup(B)']].map(([f, e]) => `
              <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #ccfbf1;font-size:0.72rem;">
                <span style="font-weight:700;color:#0f766e;">${f}</span>
                <span style="font-family:monospace;color:#334155;">${e}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <!-- Results -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${res ? `
            <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
              <h4 style="font-size:0.85rem;font-weight:800;color:#0f172a;margin:0 0 10px;">✅ Mining Results</h4>
              <div style="display:flex;gap:8px;margin-bottom:12px;">
                <div style="background:#f0fdfa;border:1px solid #99f6e4;padding:8px 12px;border-radius:8px;"><div style="font-size:0.62rem;font-weight:700;color:#0f766e;text-transform:uppercase;">Transactions</div><div style="font-size:1.1rem;font-weight:800;">${wRows.length}</div></div>
                <div style="background:#f0fdfa;border:1px solid #99f6e4;padding:8px 12px;border-radius:8px;"><div style="font-size:0.62rem;font-weight:700;color:#0f766e;text-transform:uppercase;">Itemsets</div><div style="font-size:1.1rem;font-weight:800;color:#2563eb;">${itemsets.length}</div></div>
                <div style="background:#f0fdfa;border:1px solid #99f6e4;padding:8px 12px;border-radius:8px;"><div style="font-size:0.62rem;font-weight:700;color:#0f766e;text-transform:uppercase;">Rules</div><div style="font-size:1.1rem;font-weight:800;color:#0f766e;">${rules.length}</div></div>
              </div>

              <!-- INTERMEDIATE: Item support counts -->
              ${s.armIntermediate ? `
                <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:9px;padding:12px;margin-bottom:12px;">
                  <div style="font-size:0.78rem;font-weight:800;color:#0f766e;margin-bottom:8px;">
                    🔍 Item Frequency Analysis — ${s.armIntermediate.totalTransactions} transactions · ${s.armIntermediate.uniqueItems} unique items · Min Support: ${s.armIntermediate.minSupport}%
                  </div>
                  <div style="overflow-x:auto;max-height:130px;">
                    <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                      <thead><tr style="background:#ccfbf1;border-bottom:1px solid #99f6e4;">
                        <th style="padding:4px 8px;text-align:left;font-weight:700;color:#0f766e;">Item</th>
                        <th style="padding:4px 8px;font-weight:700;color:#0f766e;">Count</th>
                        <th style="padding:4px 8px;font-weight:700;color:#0f766e;">Support %</th>
                        <th style="padding:4px 8px;font-weight:700;color:#0f766e;">Frequent?</th>
                      </tr></thead>
                      <tbody>${(s.armIntermediate.itemSupports || []).map(it => {
                        const pct = parseFloat(it.supportPct || it.support || 0);
                        const freq = pct >= s.armIntermediate.minSupport;
                        return `<tr style="border-bottom:1px solid #f0fdfa;background:${freq ? '#f0fdf4' : 'white'};">
                          <td style="padding:4px 8px;font-weight:600;font-size:0.68rem;">${it.item || it.name || '?'}</td>
                          <td style="padding:4px 8px;text-align:center;">${it.count || '—'}</td>
                          <td style="padding:4px 8px;text-align:center;font-weight:700;color:#0f766e;">${pct.toFixed(1)}%</td>
                          <td style="padding:4px 8px;text-align:center;">${freq ? '✅' : '✗'}</td>
                        </tr>`;
                      }).join('')}</tbody>
                    </table>
                  </div>
                </div>
              ` : ''}
              ${itemsets.length > 0 ? `
                <div style="font-size:0.75rem;font-weight:800;color:#475569;text-transform:uppercase;margin-bottom:6px;">Top Frequent Itemsets</div>
                <div style="overflow-x:auto;max-height:120px;">
                  <table style="width:100%;border-collapse:collapse;font-size:0.72rem;">
                    <thead><tr style="background:#f0fdfa;border-bottom:1px solid #99f6e4;color:#0f766e;">
                      <th style="padding:4px 8px;font-weight:700;text-align:left;">Itemset</th>
                      <th style="padding:4px 8px;font-weight:700;">Support%</th>
                    </tr></thead>
                    <tbody>${itemsets.slice(0, 8).map(it => `
                      <tr style="border-bottom:1px solid #f0fdfa;">
                        <td style="padding:4px 8px;font-weight:600;">{${(it.items || it.itemset || []).join(', ')}}</td>
                        <td style="padding:4px 8px;text-align:center;color:#0f766e;font-weight:700;">${(it.support || it.supportPct || 0)?.toFixed?.(1)}%</td>
                      </tr>
                    `).join('')}</tbody>
                  </table>
                </div>
              ` : `<div style="background:#f0fdfa;border:1px solid #99f6e4;padding:12px;border-radius:8px;color:#0f766e;font-size:0.8rem;font-weight:600;">No frequent itemsets found at ${s.armSupport}% min support. Try lowering Min Support to 10-15%.</div>`}
            </div>
            ${rules.length > 0 ? `
              <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
                <div style="font-size:0.75rem;font-weight:800;color:#475569;text-transform:uppercase;margin-bottom:6px;">Association Rules</div>
                <div style="overflow-x:auto;max-height:160px;">
                  <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
                    <thead><tr style="background:#f0fdfa;border-bottom:1px solid #99f6e4;color:#0f766e;">
                      <th style="padding:4px 7px;font-weight:700;text-align:left;">Rule</th>
                      <th style="padding:4px 7px;font-weight:700;">Sup%</th>
                      <th style="padding:4px 7px;font-weight:700;">Conf%</th>
                      <th style="padding:4px 7px;font-weight:700;">Lift</th>
                    </tr></thead>
                    <tbody>${rules.slice(0, 8).map(r => {
                      const lift = parseFloat(r.lift || 1);
                      return `<tr style="border-bottom:1px solid #f0fdfa;">
                        <td style="padding:4px 7px;font-size:0.68rem;font-weight:600;">{${(r.antecedent || r.lhs || []).join(',')}}→{${(r.consequent || r.rhs || []).join(',')}}</td>
                        <td style="padding:4px 7px;text-align:center;">${(r.support || 0)?.toFixed?.(1)}%</td>
                        <td style="padding:4px 7px;text-align:center;">${(r.confidence || 0)?.toFixed?.(1)}%</td>
                        <td style="padding:4px 7px;text-align:center;font-weight:700;color:${lift > 1 ? '#15803d' : '#dc2626'};">${lift?.toFixed?.(3)}</td>
                      </tr>`;
                    }).join('')}</tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- 5-Stage Pipeline Completion Banner -->
            <div style="background:linear-gradient(135deg,#042f2e,#0f766e);border-radius:12px;padding:16px;color:white;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
                <div>
                  <span style="background:#14b8a633;color:#5eead4;padding:3px 10px;border-radius:20px;font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">All 5 Stages Completed 🎉</span>
                  <h4 style="font-size:1.05rem;font-weight:800;margin:6px 0 2px;color:white;">Data Mining Pipeline Complete</h4>
                  <p style="font-size:0.75rem;color:#ccfbf1;margin:0;">Dataset → Preprocessing → Classification → Clustering → Association Rules</p>
                </div>
                <button id="vl-arm-dl-btn" style="background:#14b8a6;color:#042f2e;border:none;padding:9px 16px;border-radius:8px;font-size:0.8rem;font-weight:800;cursor:pointer;">⬇ Download Clean CSV</button>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;font-size:0.7rem;">
                <div style="background:#ffffff15;padding:8px 10px;border-radius:7px;"><div style="color:#99f6e4;font-size:0.62rem;text-transform:uppercase;">1. Dataset</div><strong>${ds.name}</strong><br><span style="color:#ccfbf1;">${ds.totalRows} rows</span></div>
                <div style="background:#ffffff15;padding:8px 10px;border-radius:7px;"><div style="color:#99f6e4;font-size:0.62rem;text-transform:uppercase;">2. Preprocessing</div><strong>${s.prepLog.length} steps</strong><br><span style="color:#ccfbf1;">${wRows.length} active rows</span></div>
                <div style="background:#ffffff15;padding:8px 10px;border-radius:7px;"><div style="color:#99f6e4;font-size:0.62rem;text-transform:uppercase;">3. Classification</div><strong>${s.clfAlgo.toUpperCase()}</strong><br><span style="color:#ccfbf1;">${s.clfResult ? s.clfResult.accuracy + '% acc' : 'Run Clf'}</span></div>
                <div style="background:#ffffff15;padding:8px 10px;border-radius:7px;"><div style="color:#99f6e4;font-size:0.62rem;text-transform:uppercase;">4. Clustering</div><strong>${s.cluAlgo.toUpperCase()}</strong><br><span style="color:#ccfbf1;">${s.cluResult ? (s.cluResult.clusters||[]).length + ' clusters' : 'Run Clu'}</span></div>
                <div style="background:#ffffff15;padding:8px 10px;border-radius:7px;"><div style="color:#99f6e4;font-size:0.62rem;text-transform:uppercase;">5. Association</div><strong>Apriori</strong><br><span style="color:#ccfbf1;">${rules.length} rules mined</span></div>
              </div>
            </div>
          ` : `<div style="background:white;border:2px dashed #99f6e4;border-radius:12px;padding:48px;text-align:center;"><div style="font-size:2rem;">🔗</div><div style="color:#94a3b8;font-size:0.82rem;font-weight:600;margin-top:10px;">Select item columns and click Mine Association Rules to complete the pipeline</div></div>`}
        </div>
      </div>
    `;
  }
}

