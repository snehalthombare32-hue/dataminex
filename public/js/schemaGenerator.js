// DataMineX - Interactive Client-Side Schema Generator

const DEFAULT_SALES_JSON = [
  {
    "transaction_id": "TX-1001",
    "customer_id": "CUST-01",
    "customer_name": "Alice Johnson",
    "customer_city": "New York",
    "customer_state": "NY",
    "product_id": "PROD-501",
    "product_name": "4K Gaming Monitor",
    "category": "Hardware",
    "sub_category": "Displays",
    "store_id": "STORE-10",
    "store_name": "Downtown Tech Hub",
    "store_region": "East",
    "date": "2026-08-15",
    "quarter": "Q3",
    "year": 2026,
    "quantity": 2,
    "unit_price": 350.00,
    "total_amount": 700.00
  },
  {
    "transaction_id": "TX-1002",
    "customer_id": "CUST-02",
    "customer_name": "Bob Martinez",
    "customer_city": "Chicago",
    "customer_state": "IL",
    "product_id": "PROD-502",
    "product_name": "Mechanical Keyboard",
    "category": "Peripherals",
    "sub_category": "Keyboards",
    "store_id": "STORE-20",
    "store_name": "Midwest Digital",
    "store_region": "Central",
    "date": "2026-08-16",
    "quarter": "Q3",
    "year": 2026,
    "quantity": 1,
    "unit_price": 120.00,
    "total_amount": 120.00
  }
];

export class SchemaGenerator {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.schemaType = 'star'; // 'star' | 'snowflake'
    this.jsonData = JSON.stringify(DEFAULT_SALES_JSON, null, 2);
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  setSchemaType(type) {
    this.schemaType = type;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="schema-gen-wrapper animate-fade-in" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--primary-color); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="cpu" style="width: 24px; height: 24px;"></i>
              <span>Automated Dimensional Schema Generator</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Input raw JSON transactions to auto-generate Star Schema & Snowflake Schema architecture models
            </p>
          </div>

          <div style="display: flex; gap: 8px; background: var(--bg-tertiary); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color);">
            <button id="btn-schema-star" class="btn-tab ${this.schemaType === 'star' ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              ⭐ Star Schema
            </button>
            <button id="btn-schema-snowflake" class="btn-tab ${this.schemaType === 'snowflake' ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              ❄️ Snowflake Schema
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">
          <!-- Left: JSON Input -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 13px; font-weight: 700;">Input Transaction Data (JSON)</span>
              <button id="btn-reset-json" style="font-size: 11px; color: var(--primary-color); background: none; border: none; cursor: pointer; text-decoration: underline;">
                Reset Default
              </button>
            </div>
            <textarea id="schema-json-input" rows="16" style="width: 100%; font-family: monospace; font-size: 11px; background: var(--bg-tertiary); color: #10b981; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; resize: vertical;">${this.jsonData}</textarea>
            
            <div style="margin-top: 14px; padding: 12px; background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px; font-size: 11px; color: var(--text-secondary); line-height: 1.5;">
              <strong>Model Type:</strong> ${this.schemaType === 'star' ? 'Denormalized Dimensions (Fastest Query JOIN Performance)' : 'Normalized Hierarchies (Optimized Disk Storage)'}<br>
              <strong>Detected Grain:</strong> One record per individual transaction item
            </div>
          </div>

          <!-- Right: Visual SVG Diagram & Tables -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Interactive SVG Diagram -->
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: 12px;">
                Visual Relational Diagram (${this.schemaType.toUpperCase()} ARCHITECTURE)
              </div>

              <div style="width: 100%; overflow-x: auto;">
                <svg viewBox="0 0 740 380" style="width: 100%; min-width: 600px; height: auto;">
                  <defs>
                    <marker id="schema-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                    </marker>
                    <marker id="sub-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                  </defs>

                  <!-- Fact to Dimensions Links -->
                  <line x1="370" y1="190" x2="140" y2="90" stroke="#6366f1" stroke-width="2" marker-end="url(#schema-arrow)" stroke-dasharray="${this.schemaType === 'star' ? '0' : '4'}" />
                  <line x1="370" y1="190" x2="600" y2="90" stroke="#6366f1" stroke-width="2" marker-end="url(#schema-arrow)" stroke-dasharray="${this.schemaType === 'star' ? '0' : '4'}" />
                  <line x1="370" y1="190" x2="140" y2="290" stroke="#6366f1" stroke-width="2" marker-end="url(#schema-arrow)" stroke-dasharray="${this.schemaType === 'star' ? '0' : '4'}" />
                  <line x1="370" y1="190" x2="600" y2="290" stroke="#6366f1" stroke-width="2" marker-end="url(#schema-arrow)" stroke-dasharray="${this.schemaType === 'star' ? '0' : '4'}" />

                  ${this.schemaType === 'snowflake' ? `
                    <line x1="70" y1="90" x2="25" y2="90" stroke="#10b981" stroke-width="2" marker-end="url(#sub-arrow)" />
                    <line x1="670" y1="90" x2="715" y2="90" stroke="#10b981" stroke-width="2" marker-end="url(#sub-arrow)" />
                  ` : ''}

                  <!-- Fact Table -->
                  <g transform="translate(290, 110)">
                    <rect width="160" height="150" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="2" />
                    <rect width="160" height="28" rx="8" fill="#4f46e5" />
                    <text x="80" y="19" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="12">Fact_Sales</text>
                    <text x="12" y="48" fill="#a5b4fc" font-size="10">🔑 transaction_id (PK)</text>
                    <text x="12" y="66" fill="#cbd5e1" font-size="9">🔗 customer_key (FK)</text>
                    <text x="12" y="82" fill="#cbd5e1" font-size="9">🔗 product_key (FK)</text>
                    <text x="12" y="98" fill="#cbd5e1" font-size="9">🔗 store_key (FK)</text>
                    <text x="12" y="114" fill="#cbd5e1" font-size="9">🔗 date_key (FK)</text>
                    <text x="12" y="130" fill="#34d399" font-size="9">📊 quantity: int</text>
                    <text x="12" y="144" fill="#34d399" font-size="9">📊 total_amount: num</text>
                  </g>

                  <!-- Dim Customer -->
                  <g transform="translate(60, 40)">
                    <rect width="140" height="100" rx="6" fill="var(--bg-tertiary)" stroke="#38bdf8" stroke-width="1.5" />
                    <rect width="140" height="24" rx="6" fill="#0284c7" />
                    <text x="70" y="16" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">Dim_Customer</text>
                    <text x="10" y="42" fill="#7dd3fc" font-size="9">🔑 customer_key (PK)</text>
                    <text x="10" y="58" fill="#cbd5e1" font-size="9">name: varchar</text>
                    <text x="10" y="74" fill="#cbd5e1" font-size="9">${this.schemaType === 'star' ? 'city & state: varchar' : 'city: varchar'}</text>
                    ${this.schemaType === 'snowflake' ? `<text x="10" y="90" fill="#a7f3d0" font-size="9">🔗 state_id (FK)</text>` : ''}
                  </g>

                  <!-- Dim Product -->
                  <g transform="translate(540, 40)">
                    <rect width="140" height="100" rx="6" fill="var(--bg-tertiary)" stroke="#38bdf8" stroke-width="1.5" />
                    <rect width="140" height="24" rx="6" fill="#0284c7" />
                    <text x="70" y="16" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">Dim_Product</text>
                    <text x="10" y="42" fill="#7dd3fc" font-size="9">🔑 product_key (PK)</text>
                    <text x="10" y="58" fill="#cbd5e1" font-size="9">name: varchar</text>
                    <text x="10" y="74" fill="#cbd5e1" font-size="9">${this.schemaType === 'star' ? 'category & sub_category' : 'sub_category: varchar'}</text>
                    ${this.schemaType === 'snowflake' ? `<text x="10" y="90" fill="#a7f3d0" font-size="9">🔗 category_id (FK)</text>` : ''}
                  </g>

                  <!-- Dim Store -->
                  <g transform="translate(60, 240)">
                    <rect width="140" height="90" rx="6" fill="var(--bg-tertiary)" stroke="#38bdf8" stroke-width="1.5" />
                    <rect width="140" height="24" rx="6" fill="#0284c7" />
                    <text x="70" y="16" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">Dim_Store</text>
                    <text x="10" y="42" fill="#7dd3fc" font-size="9">🔑 store_key (PK)</text>
                    <text x="10" y="58" fill="#cbd5e1" font-size="9">name: varchar</text>
                    <text x="10" y="74" fill="#cbd5e1" font-size="9">region: varchar</text>
                  </g>

                  <!-- Dim Date -->
                  <g transform="translate(540, 240)">
                    <rect width="140" height="90" rx="6" fill="var(--bg-tertiary)" stroke="#38bdf8" stroke-width="1.5" />
                    <rect width="140" height="24" rx="6" fill="#0284c7" />
                    <text x="70" y="16" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">Dim_Date</text>
                    <text x="10" y="42" fill="#7dd3fc" font-size="9">🔑 date_key (PK)</text>
                    <text x="10" y="58" fill="#cbd5e1" font-size="9">full_date: date</text>
                    <text x="10" y="74" fill="#cbd5e1" font-size="9">quarter & year: int</text>
                  </g>
                </svg>
              </div>
            </div>

            <!-- Detailed Tables Definition Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
                <h4 style="font-size: 13px; font-weight: 700; color: #818cf8; margin-bottom: 8px;">📊 Fact Table</h4>
                <ul style="font-family: monospace; font-size: 11px; line-height: 1.6; color: var(--text-secondary); margin: 0; padding-left: 16px;">
                  <li><strong style="color: #fbbf24;">PK:</strong> transaction_id</li>
                  <li><strong style="color: #38bdf8;">FKs:</strong> customer_key, product_key, store_key, date_key</li>
                  <li><strong style="color: #34d399;">Additive Measures:</strong> quantity (int), total_amount (numeric)</li>
                </ul>
              </div>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
                <h4 style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">📁 Dimension Tables</h4>
                <ul style="font-family: monospace; font-size: 11px; line-height: 1.6; color: var(--text-secondary); margin: 0; padding-left: 16px;">
                  <li><strong>Dim_Customer:</strong> Name, City, State</li>
                  <li><strong>Dim_Product:</strong> Name, Category, Sub-Category</li>
                  <li><strong>Dim_Store:</strong> Name, Region</li>
                  <li><strong>Dim_Date:</strong> Full_Date, Quarter, Year</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Event Listeners
    const btnStar = this.container.querySelector('#btn-schema-star');
    const btnSnowflake = this.container.querySelector('#btn-schema-snowflake');
    const btnReset = this.container.querySelector('#btn-reset-json');
    const textarea = this.container.querySelector('#schema-json-input');

    btnStar.addEventListener('click', () => this.setSchemaType('star'));
    btnSnowflake.addEventListener('click', () => this.setSchemaType('snowflake'));
    btnReset.addEventListener('click', () => {
      this.jsonData = JSON.stringify(DEFAULT_SALES_JSON, null, 2);
      this.render();
    });
    textarea.addEventListener('input', (e) => {
      this.jsonData = e.target.value;
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}
