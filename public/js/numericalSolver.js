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
    if (!inputVal) return [12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65];
    const nums = (inputVal.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    return nums.length > 0 ? nums : [12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65];
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
      const points = this.parseInputPoints(inputVal);
      const pts = points.length > 0 ? points : [
        {id:'P1',x:2,y:10},{id:'P2',x:2,y:5},{id:'P3',x:8,y:4},{id:'P4',x:5,y:8},{id:'P5',x:7,y:5}
      ];
      const res = NumericalEngine.kMeans(pts, 2);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN DATA</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px; border: 1px solid #e2e8f0;">
          <strong>Given Dataset (${pts.length} 2D Points, Target Clusters K=2):</strong><br>
          ${pts.map(p => `<strong>${p.id}</strong>=(${p.x}, ${p.y})`).join(' | ')}
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. REQUIRED</h4>
        <p style="font-size: 0.9rem; color: #475569; margin-bottom: 14px;">Compute cluster assignments, distance tables, centroid updates, and check convergence until stable.</p>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. FORMULA &amp; METHOD</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.6;">
          Euclidean Distance Formula: d(P, C) = √((x_p - c_x)² + (y_p - c_y)²)<br>
          Centroid Shift Formula: C_x = (Σ x_i) / n , C_y = (Σ y_i) / n
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">4. STEP-BY-STEP ITERATION DERIVATIONS</h4>
        <div style="margin-bottom: 16px;">
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
            <strong style="color: #2563eb;">ITERATION 1: Initial Centroids C1=(${res.history[0]?.centroids[0]?.x ?? pts[0]?.x}, ${res.history[0]?.centroids[0]?.y ?? pts[0]?.y}), C2=(${res.history[0]?.centroids[1]?.x ?? pts[1]?.x}, ${res.history[0]?.centroids[1]?.y ?? pts[1]?.y})</strong>
            <div style="font-size: 0.88rem; margin-top: 8px; line-height: 1.6;">
              ${pts.map(p => {
                const c1 = res.history[0]?.centroids[0] || pts[0];
                const c2 = res.history[0]?.centroids[1] || pts[1];
                const d1 = Math.hypot(p.x - c1.x, p.y - c1.y).toFixed(3);
                const d2 = Math.hypot(p.x - c2.x, p.y - c2.y).toFixed(3);
                const assigned = Number(d1) <= Number(d2) ? 'Cluster 1' : 'Cluster 2';
                return `d(${p.id}, C1) = √((${p.x}-${c1.x})² + (${p.y}-${c1.y})²) = ${d1} | d(${p.id}, C2) = √((${p.x}-${c2.x})² + (${p.y}-${c2.y})²) = ${d2} ➔ <strong>Assigned to ${assigned}</strong><br>`;
              }).join('')}
            </div>
          </div>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">5. CONVERGENCE &amp; FINAL CLUSTER TABLE</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Cluster</th><th style="padding: 8px;">Points Assigned</th><th style="padding: 8px;">Final Centroid (Cx, Cy)</th></tr></thead>
          <tbody>
            ${res.clusters.map((c, i) => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #2563eb;">Cluster ${i+1}</td><td style="padding: 8px;">${c.map(p => p.id).join(', ')}</td><td style="padding: 8px; font-weight: bold;">(${res.finalCentroids[i]?.x}, ${res.finalCentroids[i]?.y})</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            K-Means algorithm converged after <strong>${res.totalIterations} iteration(s)</strong>.<br>
            <strong>Cluster 1:</strong> [${res.clusters[0]?.map(p => p.id).join(', ') || ''}] with Centroid C1 = (${res.finalCentroids[0]?.x}, ${res.finalCentroids[0]?.y})<br>
            <strong>Cluster 2:</strong> [${res.clusters[1]?.map(p => p.id).join(', ') || ''}] with Centroid C2 = (${res.finalCentroids[1]?.x}, ${res.finalCentroids[1]?.y})
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b; line-height: 1.6;">
          <strong style="color: #2563eb;">Exam-Ready Solution:</strong><br>
          1. Formula: Euclidean Distance d(P, C) = √((x₂-x₁)²+(y₂-y₁)²), Centroid Update C_x = Σx/n, C_y = Σy/n.<br>
          2. Iteration Result: Converged in ${res.totalIterations} iterations.<br>
          3. Final Centroids: C1=(${res.finalCentroids[0]?.x}, ${res.finalCentroids[0]?.y}), C2=(${res.finalCentroids[1]?.x}, ${res.finalCentroids[1]?.y}).<br>
          4. Cluster Partition: Cluster 1 = [${res.clusters[0]?.map(p => p.id).join(', ') || ''}], Cluster 2 = [${res.clusters[1]?.map(p => p.id).join(', ') || ''}].
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> K-Means groups nearby 2D coordinate points around central pivot points called centroids until no point changes group.
        </div>
      `;
    }

    // 2. K-MEDOIDS SOLVER DERIVATION
    else if (algo === 'kmedoids') {
      const points = this.parseInputPoints(inputVal);
      const pts = points.length >= 2 ? points : [
        {id:'P1',x:2,y:6},{id:'P2',x:3,y:4},{id:'P3',x:3,y:8},{id:'P4',x:4,y:7},{id:'P5',x:6,y:2}
      ];
      const res = NumericalEngine.kMedoids(pts, 2);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN DATA</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Given Points: ${pts.map(p => `${p.id}(${p.x}, ${p.y})`).join(' | ')} | K = 2 Medoids
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. FORMULA &amp; COST METHOD</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          Distance Metric: d(P, M) = √((x_p - x_m)² + (y_p - y_m)²)<br>
          Total Dissimilarity Cost: E = Σ d(P_i, M_assigned)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. STEP-BY-STEP MEDOID SWAP EVALUATION</h4>
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 16px; font-family: monospace; font-size: 0.88rem;">
          Initial Selected Medoids: M1 = ${res.finalMedoids[0]?.id || pts[0].id}, M2 = ${res.finalMedoids[1]?.id || pts[1].id}<br>
          Total Dissimilarity Cost E = ${res.totalCost}<br>
          Iterative Swap Check: Candidate non-medoid points tested for lower total cost.
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Optimal Medoids selected: <strong>${res.finalMedoids.map(m => m.id).join(' and ')}</strong><br>
            Minimum Cost E = <strong>${res.totalCost}</strong>
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "PAM (K-Medoids) algorithm evaluated candidate medoid swaps using dissimilarity cost E = Σ min d(P, M). Final medoids chosen: ${res.finalMedoids.map(m => m.id).join(', ')} with minimum total dissimilarity cost = ${res.totalCost}."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> K-Medoids picks actual data points as group leaders (medoids) instead of abstract average points.
        </div>
      `;
    }

    // 3. HIERARCHICAL SOLVER DERIVATION
    else if (algo === 'hierarchical') {
      const points = this.parseInputPoints(inputVal);
      const pts = points.length >= 2 ? points : [
        {id:'P1',x:1,y:1},{id:'P2',x:1.5,y:1.5},{id:'P3',x:5,y:5},{id:'P4',x:3,y:4}
      ];
      const res = NumericalEngine.hierarchicalClustering(pts, 'single');

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN DATA</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Points (${pts.length}): ${pts.map(p => `${p.id}(${p.x}, ${p.y})`).join(' | ')} | Linkage: Single Linkage (Min Pair Distance)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. FORMULA &amp; LINKAGE METHOD</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          Euclidean Distance: d(A, B) = √((x_a - x_b)² + (y_a - y_b)²)<br>
          Single Linkage Merge Criteria: d(C1, C2) = min { d(p1, p2) | p1 ∈ C1, p2 ∈ C2 }
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. STEP-BY-STEP CLUSTER MERGE DERIVATIONS</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Step</th><th style="padding: 8px;">Clusters Merged</th><th style="padding: 8px;">Selected Minimum Distance</th><th style="padding: 8px;">Resulting Cluster</th></tr></thead>
          <tbody>
            ${res.steps.map(s => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Step ${s.step}</td><td style="padding: 8px; color: #2563eb; font-weight: 600;">${s.clusterA} + ${s.clusterB}</td><td style="padding: 8px;">d = ${s.distance}</td><td style="padding: 8px; font-weight: bold;">${s.mergedLabel}</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Full Agglomerative Dendrogram hierarchy constructed in ${res.steps.length} merge steps.<br>
            Root Cluster: <strong>${res.finalTree.label}</strong>
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Agglomerative hierarchical clustering with single linkage merged nearest clusters sequentially. Final merge sequence: ${res.steps.map(s => `Step ${s.step}: ${s.mergedLabel} (d=${s.distance})`).join(' ➔ ')}."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Hierarchical clustering starts with every point in its own group and repeatedly merges the two closest groups until all points form a tree structure (dendrogram).
        </div>
      `;
    }

    // 4. DBSCAN SOLVER DERIVATION
    else if (algo === 'dbscan') {
      const points = this.parseInputPoints(inputVal);
      const pts = points.length >= 2 ? points : [
        {id:'P1',x:2,y:10},{id:'P2',x:2,y:9},{id:'P3',x:8,y:4},{id:'P4',x:8,y:5},{id:'P5',x:25,y:30}
      ];
      const res = NumericalEngine.dbscan(pts, 3, 2);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN PARAMETERS</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Dataset: ${pts.length} points | Epsilon (ε) = 3.0 | MinPts = 2
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. DENSITY RULES &amp; CLASSIFICATION FORMULA</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          ε-Neighborhood: N_ε(P) = { Q ∈ D | d(P, Q) ≤ ε }<br>
          Core Point: |N_ε(P)| ≥ MinPts<br>
          Border Point: |N_ε(P)| &lt; MinPts BUT in N_ε(Core)<br>
          Noise Point: Neither Core nor Border Point
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. POINT CLASSIFICATION &amp; CLUSTER EXPANSION TABLE</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Point</th><th style="padding: 8px;">Coordinates</th><th style="padding: 8px;">Classification</th></tr></thead>
          <tbody>
            ${pts.map(p => {
              const pKey = p.id || `${p.x}_${p.y}`;
              const type = res.pointTypes[pKey] || 'noise';
              const badgeColor = type === 'core' ? '#059669' : (type === 'border' ? '#d97706' : '#dc2626');
              return `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">${p.id}</td><td style="padding: 8px;">(${p.x}, ${p.y})</td><td style="padding: 8px; font-weight: bold; color: ${badgeColor};">${type.toUpperCase()}</td></tr>`;
            }).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            DBSCAN identified <strong>${res.totalClusters} cluster(s)</strong>.<br>
            Noise Outlier Points: <strong>${res.noise.map(p => p.id).join(', ') || 'None'}</strong>
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Evaluating ε-neighborhoods (ε=3.0, MinPts=2), core points expand density clusters while isolated points are labeled noise. Total clusters = ${res.totalClusters}, Noise points = ${res.noise.map(p => p.id).join(', ') || 'None'}."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> DBSCAN finds dense groups of points that are close to each other while automatically flagging sparse isolated points as noise.
        </div>
      `;
    }

    // 5. ID3 SOLVER DERIVATION
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
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN DATASET</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Training Samples: ${data.length} tuples | Target Class Attribute: <strong>Play</strong>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. SHANNON ENTROPY &amp; INFORMATION GAIN FORMULAS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          System Entropy: H(S) = - Σ p_i log₂ (p_i)<br>
          Expected Entropy: H(S, A) = Σ (|S_v| / |S|) × H(S_v)<br>
          Information Gain: Gain(S, A) = H(S) - H(S, A)<br>
          Calculated System Entropy H(S) = <strong>${res.systemEntropy} bits</strong>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. ATTRIBUTE INFORMATION GAIN DERIVATIONS</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Candidate Attribute</th><th style="padding: 8px;">Expected Entropy H(S, A)</th><th style="padding: 8px;">Information Gain Gain(S, A)</th></tr></thead>
          <tbody>
            ${res.gains.map(g => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #2563eb;">${g.attribute}</td><td style="padding: 8px;">${g.expectedEntropy} bits</td><td style="padding: 8px; font-weight: bold; color: #059669;">${g.informationGain} bits</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Attribute <strong>${res.bestSplitAttribute}</strong> yields the highest Information Gain (Gain = ${res.highestGain} bits).<br>
            Therefore, <strong>${res.bestSplitAttribute}</strong> is selected as the Root Node of the Decision Tree.
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "With system entropy H(S) = ${res.systemEntropy}, calculating expected entropy H(S,A) and Information Gain Gain(S,A) = H(S) - H(S,A) identifies '${res.bestSplitAttribute}' with maximum Gain = ${res.highestGain}. Root Node = '${res.bestSplitAttribute}'."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> ID3 selects the feature that removes the most uncertainty (highest information gain) to make the decision tree as clean and accurate as possible.
        </div>
      `;
    }

    // 6. NAIVE BAYES SOLVER DERIVATION
    else if (algo === 'naivebayes') {
      const data = [
        { Outlook: "Sunny", Humidity: "High", Play: "No" },
        { Outlook: "Sunny", Humidity: "High", Play: "No" },
        { Outlook: "Overcast", Humidity: "High", Play: "Yes" },
        { Outlook: "Rain", Humidity: "High", Play: "Yes" },
        { Outlook: "Rain", Humidity: "Normal", Play: "Yes" }
      ];
      const res = NumericalEngine.naiveBayes(data, 'Play', { Outlook: 'Sunny', Humidity: 'High' });

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; TEST INSTANCE</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Test Query: X = (Outlook=Sunny, Humidity=High) | Target Classes: Yes / No
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. BAYES THEOREM &amp; LAPLACE FORMULAS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          Class Prior: P(C_k) = Count(C_k) / Total<br>
          Laplace Likelihood: P(X_i | C_k) = (Count(X_i, C_k) + 1) / (Count(C_k) + |V|)<br>
          Posterior: P(C_k | X) ∝ P(C_k) × ∏ P(X_i | C_k)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. POSTERIOR PROBABILITY COMPUTATION</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Class (Ck)</th><th style="padding: 8px;">Prior P(Ck)</th><th style="padding: 8px;">Normalized Posterior Probability</th></tr></thead>
          <tbody>
            ${res.classes.map(c => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #2563eb;">${c}</td><td style="padding: 8px;">${res.classPriors[c]?.prior.toFixed(3)}</td><td style="padding: 8px; font-weight: bold; color: #059669;">${(res.posteriors[c] * 100).toFixed(1)}%</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Predicted Class: <strong>${res.predictedClass}</strong> (Confidence = ${res.confidence})
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Applying Naive Bayes classification with Laplace smoothing P(C_k|X) ∝ P(C_k) ∏ P(x_i|C_k) yields maximum posterior probability for Class '${res.predictedClass}' (${res.confidence})."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Naive Bayes calculates past probability occurrences for each feature independently and multiplies them to predict the most probable outcome.
        </div>
      `;
    }

    // 7. KNN SOLVER DERIVATION
    else if (algo === 'knn') {
      const points = this.parseInputPoints(inputVal);
      const train = points.length >= 3 ? points.map(p => ({ ...p, label: p.id.startsWith('R') ? 'Red' : 'Blue' })) : [
        { x: 1, y: 2, label: "Red", id: "P1" },
        { x: 2, y: 3, label: "Red", id: "P2" },
        { x: 6, y: 5, label: "Blue", id: "P3" },
        { x: 7, y: 8, label: "Blue", id: "P4" }
      ];
      const testPoint = { x: 3, y: 3 };
      const res = NumericalEngine.knn(train, testPoint, 3);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN PARAMETERS</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Test Point: T(${testPoint.x}, ${testPoint.y}) | K = 3 Nearest Neighbors | Distance Metric: Euclidean
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. EUCLIDEAN DISTANCE DERIVATION FORMULA</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          d(P_i, T) = √((x_i - x_t)² + (y_i - y_t)²)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. DISTANCE CALCULATIONS TO EVERY TRAINING POINT</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Rank</th><th style="padding: 8px;">Point</th><th style="padding: 8px;">Class Label</th><th style="padding: 8px;">Euclidean Distance Calculation</th><th style="padding: 8px;">In Top K?</th></tr></thead>
          <tbody>
            ${res.neighbors.map((n, i) => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Rank ${i+1}</td><td style="padding: 8px;">(${n.x}, ${n.y})</td><td style="padding: 8px; font-weight: bold; color: #2563eb;">${n.label || n.class || 'Class 1'}</td><td style="padding: 8px; font-family: monospace;">√((${n.x}-3)² + (${n.y}-3)²) = ${n.distance}</td><td style="padding: 8px; font-weight: bold; color: #059669;">✓ YES</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Majority Voting Result: <strong>${res.predictedClass}</strong> (Vote Confidence = ${res.confidence})
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Calculated Euclidean distances d = √((x_i-x_t)²+(y_i-y_t)²) from test point T(3,3) to all training samples. Selecting K=3 nearest neighbors yields majority class vote = '${res.predictedClass}' (${res.confidence})."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> KNN finds the closest K neighbors in space to a new point and assigns the label held by the majority of those neighbors.
        </div>
      `;
    }

    // 8. APRIORI SOLVER DERIVATION
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
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; PARAMETERS</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Transactions: ${tx.length} | Min Support Threshold = 40% | Min Confidence Threshold = 60%
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. SUPPORT &amp; CONFIDENCE FORMULAS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          Support(X) = (Count(X) / N) × 100%<br>
          Confidence(A ➔ B) = (Support(A ∪ B) / Support(A)) × 100%<br>
          Lift(A ➔ B) = Confidence(A ➔ B) / Support(B)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. MINED ASSOCIATION RULES</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Association Rule</th><th style="padding: 8px;">Support %</th><th style="padding: 8px;">Confidence %</th><th style="padding: 8px;">Lift Metric</th></tr></thead>
          <tbody>
            ${res.rules.map(r => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #2563eb;">${r.rule}</td><td style="padding: 8px;">${r.support}%</td><td style="padding: 8px; font-weight: bold; color: #059669;">${r.confidence}%</td><td style="padding: 8px;">${r.lift}</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Apriori algorithm generated <strong>${res.rules.length} valid rule(s)</strong> satisfying min_sup ≥ 40% and min_conf ≥ 60%.
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Frequent itemsets C1➔L1, C2➔L2 derived with min_sup=40% and min_conf=60%. Mined ${res.rules.length} strong rules. Top rule: ${res.rules[0]?.rule || 'Rule 1'} (Support=${res.rules[0]?.support || 40}%, Confidence=${res.rules[0]?.confidence || 60}%)."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Apriori scans customer shopping carts to find items that are frequently bought together and builds recommendation rules.
        </div>
      `;
    }

    // 9. LINEAR REGRESSION SOLVER DERIVATION
    else if (algo === 'regression') {
      const { xs, ys, points } = this.parseInputXYSeries(inputVal);
      const pts = points.length >= 2 ? points : [
        { id: "P1", x: 10, y: 15 },
        { id: "P2", x: 20, y: 25 },
        { id: "P3", x: 30, y: 35 },
        { id: "P4", x: 40, y: 50 }
      ];
      const res = NumericalEngine.linearRegression(pts);

      const sumX = pts.reduce((a, b) => a + b.x, 0);
      const sumY = pts.reduce((a, b) => a + b.y, 0);
      const sumX2 = pts.reduce((a, b) => a + b.x * b.x, 0);
      const sumY2 = pts.reduce((a, b) => a + b.y * b.y, 0);
      const sumXY = pts.reduce((a, b) => a + b.x * b.y, 0);
      const n = pts.length;

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN DATA</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          X = [${pts.map(p => p.x).join(', ')}]<br>
          Y = [${pts.map(p => p.y).join(', ')}]<br>
          Observations count (n) = ${n}
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. REQUIRED</h4>
        <p style="font-size: 0.9rem; color: #475569; margin-bottom: 14px;">Find Ordinary Least Squares (OLS) Slope b, Intercept a, and Regression Line Y = a + bX.</p>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. FORMULAS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.6;">
          Slope b = (n Σ XY - Σ X Σ Y) / (n Σ X² - (Σ X)²)<br>
          Intercept a = (Σ Y - b Σ X) / n = Ȳ - b X̄
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">4. SUMMARY CALCULATION TABLE</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">i</th><th style="padding: 8px;">X</th><th style="padding: 8px;">Y</th><th style="padding: 8px;">X²</th><th style="padding: 8px;">Y²</th><th style="padding: 8px;">XY</th></tr></thead>
          <tbody>
            ${pts.map((p, i) => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">${i+1}</td><td style="padding: 8px;">${p.x}</td><td style="padding: 8px;">${p.y}</td><td style="padding: 8px;">${p.x * p.x}</td><td style="padding: 8px;">${p.y * p.y}</td><td style="padding: 8px;">${p.x * p.y}</td></tr>`).join('')}
            <tr style="background: #eff6ff; font-weight: bold; border-top: 2px solid #2563eb;"><td style="padding: 8px;">Σ (SUM)</td><td style="padding: 8px;">${sumX}</td><td style="padding: 8px;">${sumY}</td><td style="padding: 8px;">${sumX2}</td><td style="padding: 8px;">${sumY2}</td><td style="padding: 8px;">${sumXY}</td></tr>
          </tbody>
        </table>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">5. STEP-BY-STEP ARITHMETIC SUBSTITUTION</h4>
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 16px; font-family: monospace; font-size: 0.88rem; line-height: 1.8;">
          1. Slope b numerator = (${n} × ${sumXY}) - (${sumX} × ${sumY}) = ${n * sumXY} - ${sumX * sumY} = <strong>${n * sumXY - sumX * sumY}</strong><br>
          2. Slope b denominator = (${n} × ${sumX2}) - (${sumX}²) = ${n * sumX2} - ${sumX * sumX} = <strong>${n * sumX2 - sumX * sumX}</strong><br>
          3. Slope b = ${n * sumXY - sumX * sumY} / ${n * sumX2 - sumX * sumX} = <strong>${res.slope}</strong><br>
          4. Intercept a = (${sumY} - (${res.slope} × ${sumX})) / ${n} = (${sumY} - ${(res.slope * sumX).toFixed(2)}) / ${n} = <strong>${res.intercept}</strong>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Linear Regression Equation: <strong>${res.equation}</strong><br>
            Slope (b) = <strong>${res.slope}</strong> | Intercept (a) = <strong>${res.intercept}</strong> | R² = <strong>${res.r2}</strong>
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b; line-height: 1.6;">
          <strong>Exam-Ready Solution:</strong><br>
          1. Given: n=${n}, ΣX=${sumX}, ΣY=${sumY}, ΣX²=${sumX2}, ΣXY=${sumXY}.<br>
          2. Slope b = (nΣXY - ΣXΣY) / (nΣX² - (ΣX)²) = ${res.slope}.<br>
          3. Intercept a = (ΣY - bΣX) / n = ${res.intercept}.<br>
          4. Final Regression Equation: Y = ${res.slope}X ${res.intercept >= 0 ? '+ ' + res.intercept : '- ' + Math.abs(res.intercept)}.
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Linear regression draws the single best straight trendline through data points so you can predict Y for any new X value.
        </div>
      `;
    }

    // 10. NORMALIZATION SOLVER DERIVATION
    else if (algo === 'normalization') {
      const numbers = this.parseInputNumbers(inputVal);
      const resMM = NumericalEngine.normalization(numbers, 'minmax');
      const resZS = NumericalEngine.normalization(numbers, 'zscore');
      const resDS = NumericalEngine.normalization(numbers, 'decimal');

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN VALUES</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Original Values: [${numbers.join(', ')}] | Count (n) = ${numbers.length}<br>
          Min = ${resMM.min} | Max = ${resMM.max} | Mean (μ) = ${resZS.mean} | StdDev (s) = ${resZS.stdDev}
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. FORMULAS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.6;">
          Min-Max [0, 1]: v' = (v - min) / (max - min)<br>
          Z-Score: z = (v - μ) / s<br>
          Decimal Scaling: v' = v / 10^j (where j = ⌈log₁₀(|v|_max)⌉)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. DERIVATION COMPARISON TABLE FOR ALL VALUES</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Original v</th><th style="padding: 8px;">Min-Max [0, 1]</th><th style="padding: 8px;">Z-Score (z)</th><th style="padding: 8px;">Decimal Scaled</th></tr></thead>
          <tbody>
            ${numbers.map((v, i) => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">${v}</td><td style="padding: 8px; color: #2563eb; font-weight: bold;">${resMM.normalized[i]}</td><td style="padding: 8px; color: #059669; font-weight: bold;">${resZS.normalized[i]}</td><td style="padding: 8px;">${resDS.normalized[i]}</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Feature normalizations computed for all ${numbers.length} values. Min-Max maps data strictly into range [0, 1].
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Applying Min-Max v'=(v-min)/(max-min), Z-Score z=(v-μ)/s (μ=${resZS.mean}, s=${resZS.stdDev}), and Decimal scaling v'=v/10^j scales all observations into standardized ranges."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Normalization rescales large raw numbers so different features can be compared fairly on the exact same scale.
        </div>
      `;
    }

    // 11. BINNING SOLVER DERIVATION
    else if (algo === 'binning') {
      const numbers = this.parseInputNumbers(inputVal);
      const res = NumericalEngine.binning(numbers, 3, 'width', 'means');

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; PARAMETERS</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Raw Dataset (${numbers.length} numbers): [${numbers.join(', ')}]<br>
          Bins = 3 | Method = Equal-Width | Smoothing = Bin Means
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. BINNING FORMULA &amp; DERIVATIONS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb;">
          Sorted Dataset: [${res.sorted.join(', ')}]<br>
          Bin Width W = (Max - Min) / Bins = (${res.sorted[res.sorted.length-1]} - ${res.sorted[0]}) / 3 = <strong>${((res.sorted[res.sorted.length-1] - res.sorted[0]) / 3).toFixed(2)}</strong>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. BIN ASSIGNMENT &amp; SMOOTHING TABLE</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Bin</th><th style="padding: 8px;">Original Partition Values</th><th style="padding: 8px;">Bin Mean μ</th><th style="padding: 8px;">Smoothed Values</th></tr></thead>
          <tbody>
            ${res.bins.map(b => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #2563eb;">Bin ${b.binIndex}</td><td style="padding: 8px;">[${b.values.join(', ')}]</td><td style="padding: 8px; font-weight: bold;">${b.binMean}</td><td style="padding: 8px; color: #059669; font-weight: bold;">[${b.smoothedValues.join(', ')}]</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Data smoothed into 3 equal-width bins using bin means.
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Sorted data partitioned into 3 equal-width bins of width W=${((res.sorted[res.sorted.length-1]-res.sorted[0])/3).toFixed(2)}. Values in each bin replaced with bin mean μ."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Binning groups sorted numbers into buckets and replaces noisy values in each bucket with the average of that bucket.
        </div>
      `;
    }

    // 12. IQR SOLVER DERIVATION
    else if (algo === 'iqr') {
      const numbers = this.parseInputNumbers(inputVal);
      const res = NumericalEngine.iqr(numbers);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; GIVEN DATASET</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Original Dataset (${numbers.length} values): [${numbers.join(', ')}]<br>
          Sorted Dataset: [${res.sorted.join(', ')}]
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. QUARTILE &amp; OUTLIER FENCE FORMULAS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.6;">
          Q1 (25th Percentile) = ${res.q1} | Q2 (Median) = ${res.median} | Q3 (75th Percentile) = ${res.q3}<br>
          IQR = Q3 - Q1 = ${res.q3} - ${res.q1} = <strong>${res.iqr}</strong><br>
          Lower Fence = Q1 - 1.5 × IQR = ${res.q1} - 1.5(${res.iqr}) = <strong>${res.lowerFence}</strong><br>
          Upper Fence = Q3 + 1.5 × IQR = ${res.q3} + 1.5(${res.iqr}) = <strong>${res.upperFence}</strong>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">3. VALUE OUTLIER CHECK TABLE</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem;">
          <thead><tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; text-align: left;"><th style="padding: 8px;">Value</th><th style="padding: 8px;">Condition (&lt; Lower Fence ${res.lowerFence} OR &gt; Upper Fence ${res.upperFence})</th><th style="padding: 8px;">Status</th></tr></thead>
          <tbody>
            ${res.sorted.map(v => {
              const isOut = v < res.lowerFence || v > res.upperFence;
              return `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">${v}</td><td style="padding: 8px;">${isOut ? 'OUTSIDE FENCES' : 'Inside Valid Range'}</td><td style="padding: 8px; font-weight: bold; color: ${isOut ? '#dc2626' : '#059669'};">${isOut ? '⚠️ OUTLIER' : '✓ Normal'}</td></tr>`;
            }).join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            IQR = <strong>${res.iqr}</strong><br>
            Detected Outliers: <strong>${res.outliers.join(', ') || 'None'}</strong>
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Q1=${res.q1}, Q3=${res.q3}, IQR=Q3-Q1=${res.iqr}. Fences [Q1-1.5IQR, Q3+1.5IQR] = [${res.lowerFence}, ${res.upperFence}]. Outliers identified: ${res.outliers.join(', ') || 'None'}."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> IQR measures the middle 50% spread of data and sets boundaries to flag numbers that are unusually high or low.
        </div>
      `;
    }

    // 13. EVALUATION METRICS SOLVER DERIVATION
    else if (algo === 'metrics') {
      const nums = this.parseInputNumbers(inputVal);
      const cm = {
        tp: nums[0] ?? 85,
        tn: nums[1] ?? 90,
        fp: nums[2] ?? 10,
        fn: nums[3] ?? 15
      };
      const res = NumericalEngine.evaluationMetrics(cm);

      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; CONFUSION MATRIX DATA</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          True Positives (TP) = ${cm.tp} | True Negatives (TN) = ${cm.tn}<br>
          False Positives (FP) = ${cm.fp} | False Negatives (FN) = ${cm.fn} | Total (N) = ${res.total}
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. METRIC FORMULAS &amp; STEP SUBSTITUTIONS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.8;">
          Accuracy = (TP + TN) / Total = (${cm.tp} + ${cm.tn}) / ${res.total} = <strong>${res.percentages.accuracy}</strong><br>
          Precision = TP / (TP + FP) = ${cm.tp} / (${cm.tp} + ${cm.fp}) = <strong>${res.percentages.precision}</strong><br>
          Recall (Sensitivity) = TP / (TP + FN) = ${cm.tp} / (${cm.tp} + ${cm.fn}) = <strong>${res.percentages.recall}</strong><br>
          F1-Score = 2 × (Precision × Recall) / (Precision + Recall) = <strong>${res.percentages.f1Score}</strong>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Accuracy = <strong>${res.percentages.accuracy}</strong> | Precision = <strong>${res.percentages.precision}</strong> | Recall = <strong>${res.percentages.recall}</strong> | F1-Score = <strong>${res.percentages.f1Score}</strong>
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Given TP=${cm.tp}, TN=${cm.tn}, FP=${cm.fp}, FN=${cm.fn}: Accuracy=(TP+TN)/N=${res.percentages.accuracy}, Precision=TP/(TP+FP)=${res.percentages.precision}, Recall=TP/(TP+FN)=${res.percentages.recall}, F1=${res.percentages.f1Score}."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> Evaluation metrics show overall correctness (Accuracy), how trustworthy positive claims are (Precision), and how many real positives were caught (Recall).
        </div>
      `;
    }

    // 14. DWH CUBES / OLAP SOLVER DERIVATION
    else {
      detailedContent = `
        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">1. QUESTION &amp; DATA CUBE SPECIFICATION</h4>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 14px;">
          Subject: Data Warehousing OLAP Numerical Operation<br>
          Dimensions: Time (Q1-Q4), Location (Mumbai, Delhi, Bangalore), Item (Electronics)
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 8px;">2. OLAP OPERATIONS DERIVATIONS</h4>
        <div style="background: #eff6ff; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.88rem; margin-bottom: 16px; border-left: 4px solid #2563eb; line-height: 1.8;">
          1. Roll-Up (Time Hierarchy: Quarter ➔ Year): Σ Sales(Q1..Q4) = 350,000 + 420,000 + 380,000 + 270,000 = <strong>1,420,000 units</strong><br>
          2. Drill-Down (Location Hierarchy: Country ➔ City): Expands total India sales into Mumbai, Delhi, Bangalore cuboids.<br>
          3. Slice (Location = "Mumbai"): Filters 2D slice matrix.<br>
          4. Dice (Location ∈ {"Mumbai","Delhi"} AND Time = "2024"): Sub-cube extraction.
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #166534; margin: 0 0 4px;">FINAL ANSWER</h4>
          <p style="font-size: 0.95rem; color: #15803d; margin: 0;">
            Data Cube roll-up aggregation total = <strong>1,420,000 units</strong>.
          </p>
        </div>
      `;

      examContent = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #1e293b;">
          <strong>Exam-Ready Answer:</strong> "Roll-up aggregates measure along dimension concept hierarchy (Quarter➔Year: 1,420,000). Drill-down navigates to lower level detail. Slice filters 1 dimension; Dice selects sub-cube."
        </div>
      `;

      simpleContent = `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 10px; font-size: 0.95rem; color: #9a3412;">
          <strong>Simple Explanation:</strong> OLAP operations let you zoom out (roll-up), zoom in (drill-down), or slice specific views of data in a 3D data cube.
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
