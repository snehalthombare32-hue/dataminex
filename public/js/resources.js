// DataMineX - Academic Resources & Textbook References Component

export class ResourcesManager {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="font-size: 24px; font-weight: 800; color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
            <i data-lucide="library" style="width: 26px; height: 26px;"></i>
            <span>Academic Resources &amp; Textbook References</span>
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
            Formula cheat sheets, sample datasets, university syllabus references, and textbook bibliography
          </p>
        </div>

        <!-- Section 1: Academic Textbook References -->
        <div style="margin-bottom: 30px;">
          <h3 style="font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="book-open" style="width: 18px; height: 18px; color: #3b82f6;"></i>
            <span>Primary Verified Academic Textbooks</span>
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px;">
              <span style="font-size: 10px; font-weight: bold; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 2px 8px; border-radius: 4px;">Data Warehousing</span>
              <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 8px 0 4px;">Data Warehousing Fundamentals</h4>
              <p style="font-size: 12px; color: #10b981; font-weight: bold;">Author: Paulraj Ponniah</p>
              <p style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">
                Authoritative reference for 3-Tier Enterprise Architecture, Star &amp; Snowflake Schema Normalization, Dimensional Fact Modeling, and ETL Staging operations.
              </p>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px;">
              <span style="font-size: 10px; font-weight: bold; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 4px;">Data Mining</span>
              <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 8px 0 4px;">Data Mining: Concepts and Techniques</h4>
              <p style="font-size: 12px; color: #10b981; font-weight: bold;">Authors: Jiawei Han, Micheline Kamber, Jian Pei</p>
              <p style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">
                Standard university textbook for KDD Process, Apriori Market Basket Mining, K-Means &amp; Hierarchical Agglomerative Clustering, and ID3 Information Gain.
              </p>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px;">
              <span style="font-size: 10px; font-weight: bold; background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3); padding: 2px 8px; border-radius: 4px;">Machine Learning &amp; Mining</span>
              <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 8px 0 4px;">Introduction to Data Mining</h4>
              <p style="font-size: 12px; color: #10b981; font-weight: bold;">Authors: Pang-Ning Tan, Michael Steinbach, Anuj Karpatne, Vipin Kumar</p>
              <p style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">
                Covers DBSCAN Density Clustering, Naive Bayes Classification probabilities, KNN distance formulas, and Classifier Evaluation metrics.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2: Formula Cheat Sheets -->
        <div style="margin-bottom: 30px;">
          <h3 style="font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-text" style="width: 18px; height: 18px; color: #f59e0b;"></i>
            <span>Core Mathematical Formula Cheat Sheets</span>
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; font-family: monospace; font-size: 12px; line-height: 1.6;">
              <h4 style="color: #f59e0b; font-family: inherit; font-size: 13px; margin-bottom: 8px;">K-Means Distance &amp; Centroid</h4>
              <p>Euclidean: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$</p>
              <p>Centroid Mean: $C_x = \\frac{1}{N} \\sum x_i, C_y = \\frac{1}{N} \\sum y_i$</p>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; font-family: monospace; font-size: 12px; line-height: 1.6;">
              <h4 style="color: #10b981; font-family: inherit; font-size: 13px; margin-bottom: 8px;">ID3 Entropy &amp; Info Gain</h4>
              <p>Entropy: $H(S) = -\\sum p_i \\log_2(p_i)$</p>
              <p>Gain: $Gain(S, A) = H(S) - \\sum \\frac{|S_v|}{|S|} H(S_v)$</p>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; font-family: monospace; font-size: 12px; line-height: 1.6;">
              <h4 style="color: #38bdf8; font-family: inherit; font-size: 13px; margin-bottom: 8px;">Apriori Market Basket</h4>
              <p>Support: $P(A \\cup B) = \\frac{\\text{Count}(A \\cup B)}{N}$</p>
              <p>Confidence: $P(B|A) = \\frac{\\text{Count}(A \\cup B)}{\\text{Count}(A)}$</p>
              <p>Lift: $\\frac{P(A \\cup B)}{P(A) \\times P(B)}$</p>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; font-family: monospace; font-size: 12px; line-height: 1.6;">
              <h4 style="color: #a855f7; font-family: inherit; font-size: 13px; margin-bottom: 8px;">IQR &amp; Outlier Fences</h4>
              <p>$IQR = Q_3 - Q_1$</p>
              <p>Lower Fence = $Q_1 - 1.5 \\times IQR$</p>
              <p>Upper Fence = $Q_3 + 1.5 \\times IQR$</p>
            </div>
          </div>
        </div>

        <!-- Section 3: Downloads & Datasets -->
        <div>
          <h3 style="font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="download" style="width: 18px; height: 18px; color: #10b981;"></i>
            <span>Sample Datasets &amp; Experiment Templates</span>
          </h3>

          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <div>
                  <h4 style="font-size: 13px; font-weight: bold; color: var(--text-primary);">Sales_Transactions_2026.json</h4>
                  <p style="font-size: 11px; color: var(--text-secondary);">Sample raw sales dataset for Star/Snowflake Schema Generation &amp; ETL testing.</p>
                </div>
                <button class="btn-dl-sample" data-type="sales" style="padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
                  Download JSON
                </button>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="font-size: 13px; font-weight: bold; color: var(--text-primary);">Student_Exam_Performance.csv</h4>
                  <p style="font-size: 11px; color: var(--text-secondary);">Dataset for K-Means Clustering, Regression, and Data Preprocessing labs.</p>
                </div>
                <button class="btn-dl-sample" data-type="student" style="padding: 6px 12px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.mount.querySelectorAll('.btn-dl-sample').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.getAttribute('data-type');
        let content = "";
        let filename = "";

        if (type === 'sales') {
          filename = "Sales_Transactions_2026.json";
          content = JSON.stringify([
            { transaction_id: "TX-1001", customer_id: "CUST-01", customer_name: "Alice Johnson", city: "New York", product_id: "PROD-501", product_name: "4K Monitor", amount: 350.00, date: "2026-08-15" },
            { transaction_id: "TX-1002", customer_id: "CUST-02", customer_name: "Bob Martinez", city: "Chicago", product_id: "PROD-502", product_name: "Keyboard", amount: 120.00, date: "2026-08-16" }
          ], null, 2);
        } else {
          filename = "Student_Exam_Performance.csv";
          content = "Student,StudyHours,Score,Attendance,Grade\nS1,2.5,62,75,C\nS2,5.1,85,90,A\nS3,3.2,70,80,B\nS4,8.5,98,95,A\nS5,1.5,45,60,F";
        }

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }
}
