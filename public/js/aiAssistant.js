// DataMineX - Free Educational AI Study Assistant & Offline Tutor
// 100% Free, Zero Mandatory API Keys, Instant Local Offline Knowledge Base

const OFFLINE_KNOWLEDGE_BASE = [
  {
    keywords: ["star schema", "snowflake", "schema", "dimension", "fact"],
    title: "Star Schema vs Snowflake Schema",
    answer: `**Star Schema:**\n- Features a centralized Fact table directly referencing denormalized Dimension tables.\n- Highly optimized for OLAP query read speed (minimal JOINs).\n\n**Snowflake Schema:**\n- Normalizes Dimension tables into multiple sub-dimension tables (e.g., Dim_Product -> Dim_Category).\n- Reduces data redundancy and disk footprint, but requires multi-table JOINs in SQL queries.`
  },
  {
    keywords: ["olap", "roll up", "drill down", "slice", "dice", "pivot"],
    title: "OLAP Multidimensional Operations",
    answer: `The 5 core OLAP operations on a Data Cube are:\n1. **Roll-up:** Climbs up the hierarchy to aggregate data (e.g., City -> Country).\n2. **Drill-down:** Descends the hierarchy into more granular data (e.g., Year -> Quarter -> Month).\n3. **Slice:** Locks one dimension to cut out a 2D sheet (e.g., Year = 2026).\n4. **Dice:** Sub-cube selection filtering across multiple dimensions simultaneously.\n5. **Pivot:** Rotates axes to view data from an alternate analytical perspective.`
  },
  {
    keywords: ["etl", "extract", "transform", "load", "staging"],
    title: "The ETL (Extract, Transform, Load) Pipeline",
    answer: `1. **Extract:** Pulls raw transactional data from heterogeneous OLTP sources.\n2. **Transform:** Cleanses duplicates, handles nulls, normalizes formats, and generates surrogate keys.\n3. **Load:** Populates clean facts and dimensions in the analytical Data Warehouse destination.`
  },
  {
    keywords: ["data lake", "lake", "medallion", "bronze", "silver", "gold"],
    title: "Data Lake & Medallion Architecture",
    answer: `A Data Lake stores raw multi-structured data using **Schema-on-Read**.\nThe **Medallion Architecture** organizes data into progressive refinement tiers:\n- **Bronze (Raw):** Append-only source log dump.\n- **Silver (Cleaned):** Deduplicated, validated, and enriched tables.\n- **Gold (Curated):** Star schema aggregates, BI dashboard KPIs, and ML feature stores.`
  },
  {
    keywords: ["kmeans", "k-means", "centroid", "cluster"],
    title: "K-Means Clustering Algorithm",
    answer: `K-Means is a partitioning algorithm:\n1. Randomly choose K initial centroids.\n2. Assign each data point to its closest centroid using Euclidean distance: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.\n3. Recalculate centroids as the arithmetic mean of all points assigned to that cluster.\n4. Repeat until centroids converge (no longer shift position).`
  },
  {
    keywords: ["apriori", "support", "confidence", "lift", "association"],
    title: "Apriori Association Rule Mining",
    answer: `Used in Market Basket Analysis:\n- **Support:** $P(A \\cup B) = \\frac{\\text{Count}(A \\cup B)}{N}$\n- **Confidence:** $P(B|A) = \\frac{\\text{Count}(A \\cup B)}{\\text{Count}(A)}$\n- **Lift:** $\\frac{P(A \\cup B)}{P(A) \\times P(B)}$ (Lift > 1 indicates positive correlation).\n- **Apriori Property:** All subsets of a frequent itemset must also be frequent.`
  },
  {
    keywords: ["entropy", "information gain", "id3", "decision tree"],
    title: "ID3 Decision Tree & Entropy",
    answer: `**Shannon Entropy:** $H(S) = -\\sum p_i \\log_2(p_i)$\n**Information Gain:** $Gain(S, A) = H(S) - \\sum \\frac{|S_v|}{|S|} H(S_v)$\nSelect the attribute with the highest Information Gain to split as the node.`
  },
  {
    keywords: ["iqr", "outlier", "fence", "quartile"],
    title: "IQR Outlier Detection Fences",
    answer: `1. Calculate First Quartile (Q1) and Third Quartile (Q3).\n2. $IQR = Q_3 - Q_1$\n3. Lower Fence = $Q_1 - 1.5 \\times IQR$\n4. Upper Fence = $Q_3 + 1.5 \\times IQR$\nAny data point outside the fences is classified as an outlier.`
  }
];

export class AIAssistant {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.chatHistory = [
      {
        sender: "assistant",
        text: "Hello! I am your **DataMineX Study Assistant**. Ask me any question about Data Warehouses, Data Lakes, Data Mining algorithms, SQL queries, or exam calculations. I run 100% free with a local offline learning engine!"
      }
    ];
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
    return `### Data Engineering Tutor Response\n\nYou asked about: **"${query}"**.\n\nHere are the recommended study steps in DataMineX:\n- Explore our interactive **Numerical Solver** to calculate this algorithm step-by-step.\n- Visit the **Universal Question Solver** to paste and solve homework problems.\n- Check the syllabus lessons for detailed theory notes and animated whiteboard videos!`;
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 900px; margin: 0 auto; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #10b981; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="bot"></i>
              <span>DataMineX AI Study Assistant</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Free learning assistant with built-in offline educational knowledge base
            </p>
          </div>
          <span style="font-size: 11px; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 6px; font-weight: bold;">
            100% Free / Local Fallback Active
          </span>
        </div>

        <!-- Chat History -->
        <div id="ai-chat-box" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; height: 420px; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
          ${this.chatHistory.map(msg => `
            <div style="align-self: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; max-width: 85%; background: ${msg.sender === 'user' ? 'var(--primary-color)' : 'var(--bg-tertiary)'}; color: ${msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)'}; padding: 12px 16px; border-radius: ${msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px'}; font-size: 13px; line-height: 1.6; border: 1px solid var(--border-color); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="font-size: 10px; font-weight: bold; opacity: 0.7; margin-bottom: 4px;">
                ${msg.sender === 'user' ? 'You' : 'DataMineX Assistant'}
              </div>
              <div>${msg.text.replace(/\n/g, '<br>')}</div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Question Suggestions -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
          ${[
            "Star Schema vs Snowflake",
            "Explain 5 OLAP operations",
            "How does K-Means work?",
            "Apriori rule formulas",
            "IQR outlier detection"
          ].map(q => `
            <button class="btn-ai-quick" data-q="${q}" style="font-size: 11px; background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color); padding: 5px 10px; border-radius: 6px; cursor: pointer;">
              💡 ${q}
            </button>
          `).join('')}
        </div>

        <!-- Input Bar -->
        <form id="ai-form" style="display: flex; gap: 10px;">
          <input type="text" id="ai-input" placeholder="Ask any Data Mining, Warehouse, or Lake question..." style="flex: 1; padding: 12px 16px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px;">
          <button type="submit" style="padding: 12px 24px; background: #10b981; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;">
            Send
          </button>
        </form>
      </div>
    `;

    // Handle form submit
    const form = this.mount.querySelector('#ai-form');
    const input = this.mount.querySelector('#ai-input');
    const chatBox = this.mount.querySelector('#ai-chat-box');

    const handleSend = (queryText) => {
      const q = queryText || input.value.trim();
      if (!q) return;

      this.chatHistory.push({ sender: 'user', text: q });
      const answer = this.findOfflineAnswer(q);
      this.chatHistory.push({ sender: 'assistant', text: answer });

      input.value = '';
      this.render();
      chatBox.scrollTop = chatBox.scrollHeight;
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
