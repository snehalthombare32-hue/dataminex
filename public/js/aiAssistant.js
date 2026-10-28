// DataMineX - Free Educational AI Study Assistant & Offline Tutor
// 100% Free, Zero Mandatory API Keys, Instant Local Offline Knowledge Base

const OFFLINE_KNOWLEDGE_BASE = [
  {
    keywords: ["star schema", "snowflake", "schema", "dimension", "fact"],
    title: "Star Schema vs Snowflake Schema",
    answer: `**Star Schema:**\n- Central Fact table directly referencing denormalized Dimension tables.\n- Highly optimized for OLAP read query speed (minimal SQL JOINs).\n\n**Snowflake Schema:**\n- Normalizes Dimension tables into multiple sub-dimension tables (e.g., Dim_Product -> Dim_Category).\n- Reduces data redundancy and disk footprint, but requires multi-table JOINs in SQL queries.`
  },
  {
    keywords: ["olap", "roll up", "drill down", "slice", "dice", "pivot"],
    title: "5 Core OLAP Multidimensional Operations",
    answer: `The 5 core OLAP operations on a Data Cube are:\n1. **Roll-up:** Climbs up the concept hierarchy to aggregate data (e.g., Day -> Month -> Year).\n2. **Drill-down:** Descends the concept hierarchy into more granular data (e.g., Year -> Quarter -> Month).\n3. **Slice:** Locks one dimension to cut out a 2D sheet (e.g., Year = 2026).\n4. **Dice:** Sub-cube selection filtering across multiple dimensions simultaneously.\n5. **Pivot:** Rotates axes to view data from an alternate analytical perspective.`
  },
  {
    keywords: ["etl", "extract", "transform", "load", "staging"],
    title: "The ETL (Extract, Transform, Load) Pipeline",
    answer: `1. **Extract:** Pulls raw transactional data from heterogeneous OLTP sources.\n2. **Transform:** Cleanses duplicates, handles nulls, normalizes formats, and generates surrogate keys in a staging area.\n3. **Load:** Populates clean facts and dimensions into the analytical Data Warehouse destination.`
  },
  {
    keywords: ["kmeans", "k-means", "centroid", "cluster"],
    title: "K-Means Clustering Algorithm",
    answer: `K-Means is an unsupervised partitioning algorithm:\n1. Specify $K$ and initialize $K$ centroids.\n2. Assign each point to its closest centroid using Euclidean distance: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.\n3. Recalculate centroids as the arithmetic mean of all points assigned to that cluster.\n4. Repeat until centroids converge (no longer shift position).`
  },
  {
    keywords: ["apriori", "support", "confidence", "lift", "association"],
    title: "Apriori Association Rule Mining",
    answer: `Used in Market Basket Analysis:\n- **Support:** $P(A \\cup B) = \\frac{\\text{Count}(A \\cup B)}{N}$\n- **Confidence:** $P(B|A) = \\frac{\\text{Count}(A \\cup B)}{\\text{Count}(A)}$\n- **Lift:** $\\frac{P(A \\cup B)}{P(A) \\times P(B)}$ (Lift > 1 indicates positive correlation).\n- **Apriori Property:** All subsets of a frequent itemset must also be frequent.`
  },
  {
    keywords: ["entropy", "information gain", "id3", "decision tree"],
    title: "ID3 Decision Tree: Entropy & Information Gain",
    answer: `**Shannon Entropy:** $H(S) = -\\sum p_i \\log_2(p_i)$\n**Information Gain:** $\\text{Gain}(S, A) = H(S) - \\sum \\frac{|S_v|}{|S|} H(S_v)$\nSelect the attribute with the highest Information Gain as the decision node.`
  },
  {
    keywords: ["regression", "linear regression", "slope", "intercept"],
    title: "Simple Linear Regression (OLS)",
    answer: `Fits the line $y = mx + c$ minimizing sum of squared errors:\n- **Slope ($m$):** $m = \\frac{N\\sum XY - \\sum X\\sum Y}{N\\sum X^2 - (\\sum X)^2}$\n- **Intercept ($c$):** $c = \\bar{Y} - m\\bar{X}$`
  },
  {
    keywords: ["iqr", "outlier", "fence", "quartile"],
    title: "IQR Outlier Detection Fences",
    answer: `1. Calculate First Quartile ($Q_1$) and Third Quartile ($Q_3$).\n2. $IQR = Q_3 - Q_1$\n3. Lower Fence = $Q_1 - 1.5 \\times IQR$\n4. Upper Fence = $Q_3 + 1.5 \\times IQR$\nAny data point outside the fences is classified as an outlier.`
  }
];

export class AIAssistant {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.chatHistory = [
      {
        sender: "assistant",
        text: "Hello! I am your **DataMineX AI Study Assistant & Academic Tutor**.\n\nAsk me any question about Data Warehousing (Architecture, ETL, Schemas, Cubes, OLAP) or Data Mining (K-Means, K-Medoids, DBSCAN, Apriori, Decision Trees, Regression, Outliers). You can request exam formats like **\"2 marks answer\"**, **\"5 marks answer\"**, or ask to **\"solve a numerical step-by-step\"**!"
      }
    ];
    this.isLoading = false;
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  findOfflineAnswer(query) {
    const lower = query.toLowerCase();
    for (const item of OFFLINE_KNOWLEDGE_BASE) {
      if (item.keywords.some(k => lower.includes(k))) {
        return `### ${item.title}\n\n${item.answer}`;
      }
    }
    return `### Data Engineering Tutor Response\n\nYou asked about: **"${query}"**.\n\nHere are the recommended study steps in DataMineX:\n- Explore our interactive **Numerical Solver** to calculate this algorithm step-by-step.\n- Visit the **Practical Lab** to upload CSV datasets and run experiments.\n- Check syllabus lessons for detailed notes and video tutorials!`;
  }

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/### (.*?)\n/g, '<h4 style="font-size: 15px; font-weight: 700; margin: 10px 0 6px 0; color: #2563eb;">$1</h4>')
      .replace(/#### (.*?)\n/g, '<h5 style="font-size: 13px; font-weight: 700; margin: 8px 0 4px 0; color: #475569;">$1</h5>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(99,102,241,0.1); color: #4f46e5; padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>')
      .replace(/\n\n/g, '<p style="margin-bottom: 8px;"></p>')
      .replace(/\n/g, '<br>');
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 900px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #2563eb; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="bot"></i>
              <span>DataMineX AI Study Assistant</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Educational tutor for Data Warehousing & Data Mining • Offline knowledge base • 100% free
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 11px; background: rgba(37, 99, 235, 0.1); color: #2563eb; border: 1px solid rgba(37, 99, 235, 0.3); padding: 4px 10px; border-radius: 6px; font-weight: 600;">
              ✓ Local Retrieval Active
            </span>
          </div>
        </div>

        <!-- Chat History -->
        <div id="ai-chat-box" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; height: 460px; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
          ${this.chatHistory.map(msg => `
            <div style="align-self: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; max-width: 88%; background: ${msg.sender === 'user' ? 'var(--color-indigo, #4f46e5)' : 'var(--bg-tertiary, #f8fafc)'}; color: ${msg.sender === 'user' ? '#ffffff' : 'var(--text-primary, #0f172a)'}; padding: 14px 18px; border-radius: ${msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px'}; font-size: 13px; line-height: 1.6; border: 1px solid var(--border-color); box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <div style="font-size: 11px; font-weight: bold; opacity: 0.8; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                <span>${msg.sender === 'user' ? '👤 You' : '🤖 DataMineX Tutor'}</span>
                ${msg.sender !== 'user' ? '<span style="font-size: 10px; opacity: 0.7;">Educational Guide</span>' : ''}
              </div>
              <div class="chat-text-content">${this.formatMarkdown(msg.text)}</div>
            </div>
          `).join('')}
          ${this.isLoading ? `
            <div style="align-self: flex-start; background: var(--bg-tertiary); padding: 12px 18px; border-radius: 12px; font-size: 13px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;">
              <span class="loading-spinner" style="display: inline-block; width: 14px; height: 14px; border: 2px solid #2563eb; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
              <span>Consulting educational knowledge base...</span>
            </div>
          ` : ''}
        </div>

        <!-- Quick Question Suggestions -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            Suggested Exam & Numerical Prompts:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${[
              "2 marks: Star Schema vs Snowflake",
              "5 marks: Explain 5 OLAP operations",
              "Solve a K-Means numerical",
              "Apriori rule formulas with example",
              "ID3 Entropy and Information Gain",
              "Calculate Linear Regression line",
              "IQR Outlier detection fences"
            ].map(q => `
              <button class="btn-ai-quick" data-q="${q}" style="font-size: 11px; background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color); padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all 0.15s ease;">
                💡 ${q}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Input Bar -->
        <form id="ai-form" style="display: flex; gap: 10px;">
          <input type="text" id="ai-input" placeholder="Ask any Data Mining, Warehouse, or Lake question..." style="flex: 1; padding: 12px 16px; background: var(--bg-input, #ffffff); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px;" ${this.isLoading ? 'disabled' : ''}>
          <button type="submit" style="padding: 12px 24px; background: #2563eb; color: #ffffff; font-weight: 700; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px;" ${this.isLoading ? 'disabled' : ''}>
            <span>Ask Tutor</span>
            <i data-lucide="send" style="width: 14px; height: 14px;"></i>
          </button>
        </form>
      </div>
    `;

    // Handle form submit
    const form = this.mount.querySelector('#ai-form');
    const input = this.mount.querySelector('#ai-input');
    const chatBox = this.mount.querySelector('#ai-chat-box');

    const handleSend = async (queryText) => {
      const q = queryText || input.value.trim();
      if (!q || this.isLoading) return;

      this.chatHistory.push({ sender: 'user', text: q });
      this.isLoading = true;
      input.value = '';
      this.render();
      chatBox.scrollTop = chatBox.scrollHeight;

      let answer = '';
      try {
        const res = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q })
        });
        if (res.ok) {
          const data = await res.json();
          answer = data.answer || this.findOfflineAnswer(q);
        } else {
          answer = this.findOfflineAnswer(q);
        }
      } catch (err) {
        answer = this.findOfflineAnswer(q);
      }

      this.chatHistory.push({ sender: 'assistant', text: answer });
      this.isLoading = false;
      this.render();
      const updatedBox = this.mount.querySelector('#ai-chat-box');
      if (updatedBox) updatedBox.scrollTop = updatedBox.scrollHeight;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });

    this.mount.querySelectorAll('.btn-ai-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const q = e.currentTarget.getAttribute('data-q');
        handleSend(q);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }
}
