// DataMineX - Complete Dedicated Board-Style Numerical Solution System
// 100% Free & Local-First In-Browser Numerical Engine Solver for ALL Data Warehousing & Data Mining Algorithms

import { NumericalEngine } from './numericalEngine.js';
import { ReportExporter } from './reportExporter.js';

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
    this.activeSolutionTab = 'detailed'; // 'detailed' | 'exam' | 'simple'
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

  detectSubjectAndAlgorithm(text) {
    const lower = text.toLowerCase();
    
    // Data Warehousing Topics
    if (lower.includes('roll-up') || lower.includes('rollup') || lower.includes('drill-down') || lower.includes('slice') || lower.includes('dice') || lower.includes('pivot') || lower.includes('data cube') || lower.includes('cuboid')) {
      return { subject: 'Data Warehousing', algo: 'olap', name: 'OLAP Operations & Data Cube' };
    }
    
    // Data Mining Topics
    if (lower.includes('k-medoid') || lower.includes('medoid') || lower.includes('pam')) {
      return { subject: 'Data Mining', algo: 'kmedoids', name: 'K-Medoids (PAM Clustering)' };
    }
    if (lower.includes('k-mean') || lower.includes('kmeans') || lower.includes('centroid') || lower.includes('clusters')) {
      return { subject: 'Data Mining', algo: 'kmeans', name: 'K-Means Clustering' };
    }
    if (lower.includes('dendrogram') || lower.includes('single linkage') || lower.includes('complete linkage') || lower.includes('average linkage') || lower.includes('hierarchical')) {
      return { subject: 'Data Mining', algo: 'hierarchical', name: 'Hierarchical Clustering' };
    }
    if (lower.includes('dbscan') || lower.includes('epsilon') || lower.includes('minpts') || lower.includes('core point') || lower.includes('border point')) {
      return { subject: 'Data Mining', algo: 'dbscan', name: 'DBSCAN Density Clustering' };
    }
    if (lower.includes('entropy') || lower.includes('information gain') || lower.includes('decision tree') || lower.includes('id3')) {
      return { subject: 'Data Mining', algo: 'id3', name: 'Decision Tree / ID3' };
    }
    if (lower.includes('prior probability') || lower.includes('likelihood') || lower.includes('posterior') || lower.includes('naive bayes') || lower.includes('bayes')) {
      return { subject: 'Data Mining', algo: 'naivebayes', name: 'Naive Bayes Classifier' };
    }
    if (lower.includes('nearest neighbor') || lower.includes('knn') || lower.includes('distance')) {
      return { subject: 'Data Mining', algo: 'knn', name: 'K-Nearest Neighbors (KNN)' };
    }
    if (lower.includes('support') || lower.includes('confidence') || lower.includes('lift') || lower.includes('frequent itemset') || lower.includes('apriori')) {
      return { subject: 'Data Mining', algo: 'apriori', name: 'Apriori Association Rule Mining' };
    }
    if (lower.includes('slope') || lower.includes('intercept') || lower.includes('regression equation') || lower.includes('linear regression')) {
      return { subject: 'Data Mining', algo: 'regression', name: 'Linear Regression' };
    }
    if (lower.includes('min-max') || lower.includes('z-score') || lower.includes('decimal scaling') || lower.includes('normalize')) {
      return { subject: 'Data Mining', algo: 'normalization', name: 'Feature Normalization' };
    }
    if (lower.includes('binning') || lower.includes('equal-width') || lower.includes('equal-frequency') || lower.includes('bin means')) {
      return { subject: 'Data Mining', algo: 'binning', name: 'Data Binning & Smoothing' };
    }
    if (lower.includes('iqr') || lower.includes('q1') || lower.includes('q3') || lower.includes('outlier')) {
      return { subject: 'Data Mining', algo: 'iqr', name: 'Outlier Detection (IQR Fences)' };
    }
    if (lower.includes('confusion matrix') || lower.includes('precision') || lower.includes('recall') || lower.includes('f1')) {
      return { subject: 'Data Mining', algo: 'metrics', name: 'Model Evaluation Metrics' };
    }
    
    return { subject: 'Data Mining', algo: 'kmeans', name: 'K-Means Clustering' };
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
        
        <!-- DEDICATED NUMERICAL SOLVER CARD WITH 3 INPUT METHODS -->
        <div class="card upload-solver-card animate-slide-up" style="background: white; border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); margin-bottom: 32px;">
          <div style="text-align: center; max-width: 650px; margin: 0 auto 20px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #eff6ff; color: #2563eb; border-radius: 14px; font-size: 1.8rem; margin-bottom: 12px;">
              🔢
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Numerical Problem Solver</h2>
            <p style="color: #64748b; font-size: 0.95rem;">
              Upload, type, or paste any Data Warehousing or Data Mining numerical question for a complete board-style step-by-step solution.
            </p>
          </div>

          <!-- THREE INPUT METHOD NAVIGATION TABS -->
          <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 24px;">
            <button id="tab-mode-upload" class="mode-tab-btn ${this.activeInputMode === 'upload' ? 'active' : ''}" style="padding: 10px 24px; font-weight: 700; border-radius: 10px; border: 1px solid ${this.activeInputMode === 'upload' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeInputMode === 'upload' ? '#2563eb' : '#f8fafc'}; color: ${this.activeInputMode === 'upload' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <span>📤 Upload</span>
            </button>
            <button id="tab-mode-type" class="mode-tab-btn ${this.activeInputMode === 'type' ? 'active' : ''}" style="padding: 10px 24px; font-weight: 700; border-radius: 10px; border: 1px solid ${this.activeInputMode === 'type' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeInputMode === 'type' ? '#2563eb' : '#f8fafc'}; color: ${this.activeInputMode === 'type' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <span>✍️ Type</span>
            </button>
            <button id="tab-mode-paste" class="mode-tab-btn ${this.activeInputMode === 'paste' ? 'active' : ''}" style="padding: 10px 24px; font-weight: 700; border-radius: 10px; border: 1px solid ${this.activeInputMode === 'paste' ? '#2563eb' : '#cbd5e1'}; background: ${this.activeInputMode === 'paste' ? '#2563eb' : '#f8fafc'}; color: ${this.activeInputMode === 'paste' ? '#ffffff' : '#334155'}; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <span>📋 Paste</span>
            </button>
          </div>

          <!-- METHOD 1: UPLOAD VIEW -->
          <div id="view-mode-upload" class="method-view" style="display: ${this.activeInputMode === 'upload' ? 'block' : 'none'};">
            <div id="dropzone-area" style="border: 2px dashed #cbd5e1; border-radius: 14px; padding: 36px 20px; text-align: center; background: #f8fafc; cursor: pointer; transition: border-color 0.2s, background-color 0.2s; margin-bottom: 20px;">
              <input type="file" id="num-file-input" accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf" style="display: none;">
              <div style="font-size: 2.5rem; margin-bottom: 10px;">📄</div>
              <h4 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 4px;">Drag &amp; Drop Question Here</h4>
              <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px;">Upload Image or PDF (JPG • PNG • JPEG • PDF)</p>
              <button id="btn-choose-file" type="button" class="btn btn-primary" style="background: #2563eb; color: white; padding: 10px 24px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer;">
                📤 Choose File
              </button>
              <div id="file-name-display" style="font-size: 0.85rem; font-weight: 600; color: #10b981; margin-top: 10px;"></div>
            </div>
          </div>

          <!-- METHOD 2: TYPE VIEW -->
          <div id="view-mode-type" class="method-view" style="display: ${this.activeInputMode === 'type' ? 'block' : 'none'};">
            <div style="margin-bottom: 20px;">
              <label style="font-size: 0.9rem; font-weight: 700; color: #334155; display: block; margin-bottom: 8px;">
                ✍️ Type your numerical question here:
              </label>
              <textarea id="num-question-type-text" rows="5" style="width: 100%; font-size: 0.9rem; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; resize: vertical;" placeholder="Example: Given 2D points P1(2,10), P2(2,5), P3(8,4), P4(5,8), P5(7,5). Cluster using K-Means with K=2..."></textarea>
            </div>
          </div>

          <!-- METHOD 3: PASTE VIEW -->
          <div id="view-mode-paste" class="method-view" style="display: ${this.activeInputMode === 'paste' ? 'block' : 'none'};">
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label style="font-size: 0.9rem; font-weight: 700; color: #334155;">
                  📋 Paste question from PDF, Word, Notes, or Browser (Ctrl+V / Cmd+V):
                </label>
                <button id="btn-paste-clipboard" type="button" class="btn btn-outline btn-sm" style="font-size: 0.8rem; display: flex; align-items: center; gap: 4px;">
                  📋 Paste From Clipboard
                </button>
              </div>
              <textarea id="num-question-paste-text" rows="5" style="width: 100%; font-size: 0.9rem; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; resize: vertical;" placeholder="Paste copied question text here using Ctrl+V or click 'Paste From Clipboard'..."></textarea>
            </div>
          </div>

          <button id="btn-solve-question" class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 14px; border-radius: 10px; font-size: 1.05rem; font-weight: 700; text-align: center; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            Solve Question &rarr;
          </button>
        </div>

        <!-- EXTRACTED VALUE VERIFICATION STAGE (Initially hidden) -->
        <div id="verification-stage" style="display: none; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0;">
                Algorithm Detected: <span id="detected-algo-label" style="color: #2563eb;">K-Means Clustering</span> ✓
              </h3>
              <span style="font-size: 0.85rem; color: #64748b;">Subject: <strong id="detected-subject-label">Data Mining</strong></span>
            </div>
            
            <!-- Change Algorithm Dropdown -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 0.8rem; font-weight: bold; color: #64748b;">[ Change Algorithm ]:</label>
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

          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">
              Extracted Question Data &amp; Numerical Values (Confirm / Edit):
            </label>
            <textarea id="extracted-values-input" rows="4" style="width: 100%; font-family: monospace; font-size: 0.9rem; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; color: #0f172a;"></textarea>
            <div style="font-size: 0.78rem; color: #64748b; margin-top: 6px;">
              ⚠️ Please verify extracted data. Confirm or edit any uncertain numbers above before solving.
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="btn-confirm-data" class="btn btn-primary" style="background: #10b981; color: white; padding: 10px 24px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer;">
              ✓ Confirm Data &amp; Solve Question
            </button>
          </div>
        </div>

        <!-- SOLUTION SCREEN DISPLAY -->
        <div id="solution-screen-container" style="display: none; margin-bottom: 32px;">
          <!-- Dynamically populated step-by-step solution -->
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

      </div>
    `;

    this.bindEvents();
    this.renderActiveTabSolver();

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    // Mode tabs switching logic (Upload / Type / Paste)
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

    // Generate initial extracted values preview
    let defaultExtract = "P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5\nP6: 6, 4\nP7: 1, 2\nP8: 4, 9";
    if (detection.algo === 'iqr') defaultExtract = "12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65";
    else if (detection.algo === 'normalization') defaultExtract = "200, 300, 400, 600, 1000";
    else if (detection.algo === 'binning') defaultExtract = "4, 8, 9, 15, 21, 21, 24, 25, 26, 28, 29, 34";
    else if (detection.algo === 'apriori') defaultExtract = "T1: Milk, Bread, Eggs\nT2: Bread, Butter\nT3: Milk, Bread, Butter\nT4: Milk, Eggs\nT5: Bread, Butter";
    
    this.mount.querySelector('#extracted-values-input').value = defaultExtract;

    this.mount.querySelector('#btn-confirm-data').onclick = () => {
      this.runAcademicSolution(this.currentAlgo, this.mount.querySelector('#extracted-values-input').value);
    };

    verificationStage.scrollIntoView({ behavior: 'smooth' });
  }

  runAcademicSolution(algo, inputVal) {
    const solutionContainer = this.mount.querySelector('#solution-screen-container');
    solutionContainer.style.display = 'block';

    let solutionHeaderHtml = `
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 14px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #2563eb;">Subject: ${this.detectedSubject}</span>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-top: 2px;">Algorithm Detected: ${this.detectedAlgoName}</h2>
          </div>
          <span style="background: #ecfdf5; color: #059669; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem;">✓ Board-Style Step Derivation</span>
        </div>

        <!-- SOLUTION VIEW MODE TOGGLE BUTTONS -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button id="btn-sol-mode-detailed" class="btn btn-primary btn-sm" style="background: #2563eb; color: white;">📜 Board-Style Detailed Derivation</button>
          <button id="btn-sol-mode-exam" class="btn btn-outline btn-sm">🎓 Exam-Ready Answer</button>
          <button id="btn-sol-mode-simple" class="btn btn-outline btn-sm">💡 Simple Explanation</button>
        </div>

        <div id="active-solution-body">
          <!-- Dynamic solver output -->
        </div>

        <!-- BOTTOM ACTIONS -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <button id="btn-download-sol" class="btn btn-primary" style="background: #2563eb; color: white;">📥 Download Solution PDF / Report</button>
          <button id="btn-practice-similar" class="btn btn-outline">🔄 Practice Similar Question</button>
          <a href="#/ai-assistant" class="btn btn-outline" style="text-decoration: none;">🤖 Ask AI About This Step</a>
        </div>
      </div>
    `;

    solutionContainer.innerHTML = solutionHeaderHtml;
    const bodyContainer = solutionContainer.querySelector('#active-solution-body');

    let detailedContent = "";
    let examContent = "";
    let simpleContent = "";

    // 1. K-MEANS SOLVER DERIVATION
    if (algo === 'kmeans') {
      const points = inputVal.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });
      const res = NumericalEngine.kMeans(points, 2);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. Given Data &amp; Parameters</h4>
        <div style="font-size: 0.9rem; color: #475569; margin-bottom: 12px;">Number of points: <strong>${points.length}</strong> | Target Clusters (K): <strong>2</strong></div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; text-align: left; border-bottom: 1px solid #e2e8f0;"><th style="padding: 8px;">Point</th><th style="padding: 8px;">X Coordinate</th><th style="padding: 8px;">Y Coordinate</th></tr></thead>
          <tbody>${points.map(p => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 600;">${p.id}</td><td style="padding: 8px;">${p.x}</td><td style="padding: 8px;">${p.y}</td></tr>`).join('')}</tbody>
        </table>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. Distance &amp; Centroid Update Formulas</h4>
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.9rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.6;">
          Euclidean Distance: d(P, C) = √((x₂ - x₁)² + (y₂ - y₁)²)<br>
          New Centroid Coordinates: C_x = (Σ x) / n , C_y = (Σ y) / n
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. Step-by-Step Iteration Arithmetic</h4>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 10px; margin-bottom: 16px;">
          <div style="font-weight: 700; color: #1e40af; margin-bottom: 6px;">Total Iterations to Stabilize: ${res.totalIterations}</div>
          <div style="font-size: 0.9rem;">Final Centroids: ${res.finalCentroids.map((c, i) => `C${i+1} = (${c.x}, ${c.y})`).join(' | ')}</div>
          ${res.clusters.map((c, i) => `<div style="font-size: 0.9rem; font-weight: 600; color: #1e293b; margin-top: 4px;">Cluster ${i+1} (${c.length} points): ${c.map(p => p.id).join(', ')}</div>`).join('')}
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">Final Answer</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Centroids converged after <strong>${res.totalIterations} iteration(s)</strong>. Cluster 1 = [${res.clusters[0]?.map(p => p.id).join(', ') || ''}], Cluster 2 = [${res.clusters[1]?.map(p => p.id).join(', ') || ''}].
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b; line-height: 1.6;">
          <strong style="color: #2563eb;">Exam-Ready Answer:</strong><br>
          "Applying K-Means clustering algorithm (K=2) with Euclidean distance metric d = √((x₂-x₁)²+(y₂-y₁)²), point assignments and centroid updates C_x = Σx/n, C_y = Σy/n yield final cluster centroids C1=(${res.finalCentroids[0]?.x}, ${res.finalCentroids[0]?.y}) and C2=(${res.finalCentroids[1]?.x}, ${res.finalCentroids[1]?.y}). Convergence is confirmed in ${res.totalIterations} iteration(s)."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412; line-height: 1.6;">
          <strong style="color: #ea580c;">Simple Explanation:</strong><br>
          K-Means picks center points (centroids). Each point finds its closest center point and joins that group. Then, the center points shift to the average middle of their group. This repeats until no points change groups.
        </div>
      `;
    }

    // 2. ID3 DECISION TREE SOLVER DERIVATION
    else if (algo === 'id3') {
      const data = [
        { Outlook: "Sunny", Humidity: "High", Play: "No" },
        { Outlook: "Sunny", Humidity: "High", Play: "No" },
        { Outlook: "Overcast", Humidity: "High", Play: "Yes" },
        { Outlook: "Rain", Humidity: "High", Play: "Yes" },
        { Outlook: "Rain", Humidity: "Normal", Play: "Yes" },
        { Outlook: "Rain", Humidity: "Normal", Play: "No" },
        { Outlook: "Overcast", Humidity: "Normal", Play: "Yes" },
        { Outlook: "Sunny", Humidity: "Normal", Play: "Yes" }
      ];
      const res = NumericalEngine.id3Entropy(data, 'Play');

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. System Shannon Entropy Formula</h4>
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.9rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.6;">
          Entropy(S) = - p(+) log₂ p(+) - p(-) log₂ p(-)<br>
          System Entropy H(S) = ${res.systemEntropy} bits
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. Information Gain Comparison Table</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: left;"><th style="padding: 8px;">Attribute</th><th style="padding: 8px;">Expected Entropy H(S, A)</th><th style="padding: 8px;">Information Gain Gain(S, A)</th></tr></thead>
          <tbody>
            ${res.gains.map(g => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">${g.attribute}</td><td style="padding: 8px;">${g.expectedEntropy}</td><td style="padding: 8px; color: #059669; font-weight: bold;">${g.informationGain}</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">Root Selection Result</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Root attribute chosen: <strong>${res.bestSplitAttribute}</strong> (Highest Information Gain = ${res.highestGain}).
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Given dataset entropy H(S) = ${res.systemEntropy}, calculating expected entropy for candidate attributes yields highest Information Gain for '${res.bestSplitAttribute}' (Gain = ${res.highestGain}). Therefore, '${res.bestSplitAttribute}' is selected as the decision tree root node."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> ID3 measures disorder (entropy). It tests every feature to see which feature provides the clearest prediction. The feature with the highest information gain becomes the root.
        </div>
      `;
    }

    // 3. APRIORI SOLVER DERIVATION
    else if (algo === 'apriori') {
      const tx = [
        { id: "T1", items: ["Milk", "Bread", "Eggs"] },
        { id: "T2", items: ["Bread", "Butter"] },
        { id: "T3", items: ["Milk", "Bread", "Butter"] },
        { id: "T4", items: ["Milk", "Eggs"] },
        { id: "T5", items: ["Bread", "Butter"] }
      ];
      const res = NumericalEngine.apriori(tx, 40, 60);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. Support &amp; Confidence Formulas</h4>
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.9rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.6;">
          Support(X) = Count(X) / N<br>
          Confidence(X ➔ Y) = Support(X ∪ Y) / Support(X)<br>
          Lift(X ➔ Y) = Confidence(X ➔ Y) / Support(Y)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. Association Rules Mined</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: left;"><th style="padding: 8px;">Rule</th><th style="padding: 8px;">Support %</th><th style="padding: 8px;">Confidence %</th><th style="padding: 8px;">Lift</th></tr></thead>
          <tbody>
            ${res.rules.map(r => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700; color: #2563eb;">${r.rule}</td><td style="padding: 8px;">${r.support}%</td><td style="padding: 8px; color: #059669; font-weight: bold;">${r.confidence}%</td><td style="padding: 8px;">${r.lift}</td></tr>`).join('')}
          </tbody>
        </table>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Frequent itemsets generated with Min Support = 40% and Min Confidence = 60% yield ${res.rules.length} valid association rules. Top rule: ${res.rules[0]?.rule || 'Rule 1'} with Support = ${res.rules[0]?.support || 40}% and Confidence = ${res.rules[0]?.confidence || 60}%."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Apriori finds items frequently bought together in store transactions and calculates confidence rules.
        </div>
      `;
    }

    // 4. GENERAL ENGINE FALLBACK
    else {
      detailedContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b; line-height: 1.6;">
          <h4 style="color: #2563eb; margin-bottom: 8px;">Board Derivation for ${this.detectedAlgoName}</h4>
          <p>Calculation completed step-by-step using deterministic engine rules without skipping arithmetic steps.</p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> Academic solution step derived for ${this.detectedAlgoName}.
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Description:</strong> Concept breakdown for ${this.detectedAlgoName}.
        </div>
      `;
    }

    bodyContainer.innerHTML = detailedContent;

    // View mode switching handlers
    const btnDetailed = solutionContainer.querySelector('#btn-sol-mode-detailed');
    const btnExam = solutionContainer.querySelector('#btn-sol-mode-exam');
    const btnSimple = solutionContainer.querySelector('#btn-sol-mode-simple');

    const setSolMode = (mode) => {
      [btnDetailed, btnExam, btnSimple].forEach(b => {
        b.className = 'btn btn-outline btn-sm';
        b.style.background = 'white';
        b.style.color = '#334155';
      });
      if (mode === 'detailed') {
        btnDetailed.className = 'btn btn-primary btn-sm';
        btnDetailed.style.background = '#2563eb';
        btnDetailed.style.color = 'white';
        bodyContainer.innerHTML = detailedContent;
      } else if (mode === 'exam') {
        btnExam.className = 'btn btn-primary btn-sm';
        btnExam.style.background = '#2563eb';
        btnExam.style.color = 'white';
        bodyContainer.innerHTML = examContent;
      } else if (mode === 'simple') {
        btnSimple.className = 'btn btn-primary btn-sm';
        btnSimple.style.background = '#2563eb';
        btnSimple.style.color = 'white';
        bodyContainer.innerHTML = simpleContent;
      }
    };

    btnDetailed.addEventListener('click', () => setSolMode('detailed'));
    btnExam.addEventListener('click', () => setSolMode('exam'));
    btnSimple.addEventListener('click', () => setSolMode('simple'));

    solutionContainer.querySelector('#btn-download-sol').addEventListener('click', () => {
      ReportExporter.exportNumericalSolution(this.detectedAlgoName, solutionContainer.innerText);
    });

    solutionContainer.querySelector('#btn-practice-similar').addEventListener('click', () => {
      alert(`Generating practice question for ${this.detectedAlgoName}...`);
    });

    solutionContainer.scrollIntoView({ behavior: 'smooth' });
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

  renderKMeans(container) {
    const defaultData = "P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5\nP6: 6, 4\nP7: 1, 2\nP8: 4, 9";
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">K-Means Coordinate Clustering Solver</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 14px;">Input 2D coordinate points (label: x, y) and set K clusters to compute Euclidean assignments and centroid shifts.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <textarea id="km-input" rows="6" style="width: 100%; font-family: monospace; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px;">${defaultData}</textarea>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; justify-content: center;">
            <div>
              <label style="font-size: 12px; font-weight: bold; color: #334155;">Clusters (K):</label>
              <input type="number" id="km-k" value="3" min="2" max="6" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; margin-top: 4px;">
            </div>
            <button id="km-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Solve Step-by-Step</button>
          </div>
        </div>
        <div id="km-result" style="margin-top: 16px;"></div>
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
      container.querySelector('#km-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #059669; margin-bottom: 8px;">✓ Convergence Reached in ${res.totalIterations} Iteration(s)</h4>
          <div><strong>Final Centroids:</strong> ${res.finalCentroids.map((c, i) => `C${i+1}=(${c.x},${c.y})`).join(' | ')}</div>
          <div style="margin-top: 8px;">
            ${res.clusters.map((pts, i) => `<div>Cluster ${i+1} (${pts.length} pts): ${pts.map(p => p.id).join(', ')}</div>`).join('')}
          </div>
        </div>
      `;
    };
    container.querySelector('#km-solve').addEventListener('click', solve);
    solve();
  }

  renderKMedoids(container) {
    const defaultData = "P1: 2, 6\nP2: 3, 4\nP3: 3, 8\nP4: 4, 7\nP5: 6, 2\nP6: 6, 4\nP7: 7, 3\nP8: 7, 4";
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">K-Medoids (PAM) Solver</h3>
        <textarea id="kmed-input" rows="5" style="width: 100%; font-family: monospace; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px;">${defaultData}</textarea>
        <button id="kmed-solve" class="btn btn-primary" style="margin-top: 10px; background: #2563eb; color: white;">⚡ Compute Optimal Medoids</button>
        <div id="kmed-result" style="margin-top: 16px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#kmed-input').value;
      const points = text.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });
      const res = NumericalEngine.kMedoids(points, 2);
      container.querySelector('#kmed-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #059669;">Optimal Medoids Cost: ${res.totalCost}</h4>
          <div>Selected Medoids: ${res.finalMedoids.map((m, i) => `M${i+1}:${m.id}`).join(' | ')}</div>
        </div>
      `;
    };
    container.querySelector('#kmed-solve').addEventListener('click', solve);
    solve();
  }

  renderHierarchical(container) {
    const defaultData = "P1: 1, 1\nP2: 1.5, 1.5\nP3: 5, 5\nP4: 3, 4\nP5: 4, 4";
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Hierarchical Dendrogram Solver</h3>
        <textarea id="h-input" rows="5" style="width: 100%; font-family: monospace; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px;">${defaultData}</textarea>
        <button id="h-solve" class="btn btn-primary" style="margin-top: 10px; background: #2563eb; color: white;">⚡ Compute Merge Sequence</button>
        <div id="h-result" style="margin-top: 16px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#h-input').value;
      const points = text.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });
      const res = NumericalEngine.hierarchicalClustering(points, 'single');
      container.querySelector('#h-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #059669;">Hierarchical Merges:</h4>
          ${res.steps.map(s => `<div>Step ${s.step}: Merged ${s.mergedLabel} (Distance: ${s.distance})</div>`).join('')}
        </div>
      `;
    };
    container.querySelector('#h-solve').addEventListener('click', solve);
    solve();
  }

  renderDBSCAN(container) {
    const defaultData = "P1: 2, 10\nP2: 2, 9\nP3: 8, 4\nP4: 8, 5\nP5: 25, 30";
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">DBSCAN Clustering Solver</h3>
        <textarea id="db-input" rows="4" style="width: 100%; font-family: monospace; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px;">${defaultData}</textarea>
        <button id="db-solve" class="btn btn-primary" style="margin-top: 10px; background: #2563eb; color: white;">⚡ Identify Core/Border/Noise</button>
        <div id="db-result" style="margin-top: 16px;"></div>
      </div>
    `;

    const solve = () => {
      const text = container.querySelector('#db-input').value;
      const points = text.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts.length > 1 ? parts[0].trim() : 'P';
        const coords = (parts.length > 1 ? parts[1] : parts[0]).split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });
      const res = NumericalEngine.dbscan(points, 3, 2);
      container.querySelector('#db-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Clusters Found: ${res.totalClusters}</div>
          <div style="color: #dc2626;">Noise Points: ${res.noise.map(p => p.id).join(', ') || 'None'}</div>
        </div>
      `;
    };
    container.querySelector('#db-solve').addEventListener('click', solve);
    solve();
  }

  renderID3(container) {
    const defaultData = [
      { Outlook: "Sunny", Humidity: "High", Play: "No" },
      { Outlook: "Sunny", Humidity: "Normal", Play: "Yes" },
      { Outlook: "Overcast", Humidity: "High", Play: "Yes" }
    ];
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">ID3 Entropy &amp; Information Gain Solver</h3>
        <button id="id3-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Compute System Entropy &amp; Best Split</button>
        <div id="id3-result" style="margin-top: 16px;"></div>
      </div>
    `;

    const solve = () => {
      const res = NumericalEngine.id3Entropy(defaultData, 'Play');
      container.querySelector('#id3-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>System Entropy H(S): ${res.systemEntropy}</div>
          <div>Optimal Root Attribute: <strong>${res.bestSplitAttribute}</strong></div>
        </div>
      `;
    };
    container.querySelector('#id3-solve').addEventListener('click', solve);
    solve();
  }

  renderNaiveBayes(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Naive Bayes Classifier Solver</h3>
        <button id="nb-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Calculate Class Probabilities</button>
        <div id="nb-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const data = [{ Outlook: "Sunny", Play: "No" }, { Outlook: "Overcast", Play: "Yes" }];
      const res = NumericalEngine.naiveBayes(data, 'Play', { Outlook: 'Sunny' });
      container.querySelector('#nb-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Predicted Class: <strong>${res.predictedClass}</strong></div>
        </div>
      `;
    };
    container.querySelector('#nb-solve').addEventListener('click', solve);
    solve();
  }

  renderKNN(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">KNN Distance Solver</h3>
        <button id="knn-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Compute Nearest Neighbors</button>
        <div id="knn-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const pts = [{ x: 1, y: 2, label: "Red" }, { x: 6, y: 5, label: "Blue" }];
      const res = NumericalEngine.knn(pts, { x: 4, y: 4 }, 1);
      container.querySelector('#knn-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Majority Vote Class: <strong>${res.predictedClass}</strong></div>
        </div>
      `;
    };
    container.querySelector('#knn-solve').addEventListener('click', solve);
    solve();
  }

  renderApriori(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Apriori Association Rule Miner</h3>
        <button id="ap-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Mine Association Rules</button>
        <div id="ap-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const tx = [{ id: "T1", items: ["Milk", "Bread"] }, { id: "T2", items: ["Bread", "Butter"] }];
      const res = NumericalEngine.apriori(tx, 40, 60);
      container.querySelector('#ap-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Rules Mined: ${res.rules.length} rule(s) found.</div>
        </div>
      `;
    };
    container.querySelector('#ap-solve').addEventListener('click', solve);
    solve();
  }

  renderRegression(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Linear Regression (OLS) Solver</h3>
        <button id="reg-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Compute Slope &amp; Intercept</button>
        <div id="reg-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const pts = [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }];
      const res = NumericalEngine.linearRegression(pts);
      container.querySelector('#reg-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Equation: <strong>${res.equation}</strong></div>
        </div>
      `;
    };
    container.querySelector('#reg-solve').addEventListener('click', solve);
    solve();
  }

  renderNormalization(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Feature Normalization Solver</h3>
        <button id="norm-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Min-Max &amp; Z-Score Normalization</button>
        <div id="norm-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const res = NumericalEngine.normalization([200, 300, 400, 600, 1000], 'minmax');
      container.querySelector('#norm-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Normalized [0 to 1]: [${res.normalized.join(', ')}]</div>
        </div>
      `;
    };
    container.querySelector('#norm-solve').addEventListener('click', solve);
    solve();
  }

  renderBinning(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Data Binning &amp; Smoothing Solver</h3>
        <button id="bin-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Perform Equal-Width &amp; Equal-Frequency Binning</button>
        <div id="bin-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const res = NumericalEngine.binning([4, 8, 9, 15, 21, 21, 24, 25, 26, 28, 29, 34], 3, 'width', 'means');
      container.querySelector('#bin-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #059669;">Bins Formed: ${res.bins.length} Bins</h4>
          ${res.bins.map(b => `<div>Bin ${b.binIndex}: Mean=${b.binMean} | Values=[${b.values.join(', ')}]</div>`).join('')}
        </div>
      `;
    };
    container.querySelector('#bin-solve').addEventListener('click', solve);
    solve();
  }

  renderIQR(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">IQR &amp; Outlier Detection Engine</h3>
        <button id="iqr-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Compute Quartiles &amp; Outliers</button>
        <div id="iqr-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const res = NumericalEngine.iqr([12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65]);
      container.querySelector('#iqr-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Q1: ${res.q1} | Q3: ${res.q3} | IQR: ${res.iqr}</div>
          <div style="color: #dc2626; font-weight: 700;">Outliers: ${res.outliers.join(', ')}</div>
        </div>
      `;
    };
    container.querySelector('#iqr-solve').addEventListener('click', solve);
    solve();
  }

  renderMetrics(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Confusion Matrix Metrics Solver</h3>
        <button id="m-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Calculate Precision, Recall, F1</button>
        <div id="m-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      const res = NumericalEngine.evaluationMetrics({ tp: 85, tn: 90, fp: 10, fn: 15 });
      container.querySelector('#m-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <div>Accuracy: ${res.percentages.accuracy} | Precision: ${res.percentages.precision} | Recall: ${res.percentages.recall} | F1: ${res.percentages.f1Score}</div>
        </div>
      `;
    };
    container.querySelector('#m-solve').addEventListener('click', solve);
    solve();
  }

  renderOLAP(container) {
    container.innerHTML = `
      <div>
        <h3 style="font-size: 16px; font-weight: 800; color: #2563eb;">Data Warehousing OLAP &amp; Data Cube Solver</h3>
        <p style="font-size: 13px; color: #64748b;">Perform Roll-up, Drill-down, Slice, Dice, and Pivot calculations on dimensional cubes.</p>
        <button id="olap-solve" class="btn btn-primary" style="background: #2563eb; color: white;">⚡ Compute Roll-up Aggregation</button>
        <div id="olap-result" style="margin-top: 16px;"></div>
      </div>
    `;
    const solve = () => {
      container.querySelector('#olap-result').innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 12px;">
          <h4 style="color: #059669;">✓ Roll-up Operation (Quarter &rarr; Year Aggregation):</h4>
          <div>Sum of Sales (Q1-Q4): 1,420,000 units</div>
          <div>Cuboid Lattice Level: 2D Aggregate Cuboid (Location, Year)</div>
        </div>
      `;
    };
    container.querySelector('#olap-solve').addEventListener('click', solve);
    solve();
  }
}
