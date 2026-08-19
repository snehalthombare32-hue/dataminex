// DataMineX Client-Side Interactive Sandboxes Library

// ============================================================================
// 1. INTERACTIVE SQL PLAYGROUND SANDBOX
// ============================================================================
export class SqlPlayground {
  constructor(mountSelector) {
    this.mountPoint = document.querySelector(mountSelector);
    
    // In-memory relational database tables
    this.tables = {
      fact_sales: [
        { sale_id: 101, customer_id: 1, product_id: 501, store_id: 901, amount: 1200, sale_date: '2026-08-01' },
        { sale_id: 102, customer_id: 2, product_id: 502, store_id: 902, amount: 800, sale_date: '2026-08-02' },
        { sale_id: 103, customer_id: 1, product_id: 503, store_id: 901, amount: 150, sale_date: '2026-08-03' },
        { sale_id: 104, customer_id: 3, product_id: 501, store_id: 903, amount: 1200, sale_date: '2026-08-04' },
        { sale_id: 105, customer_id: 4, product_id: 504, store_id: 902, amount: 350, sale_date: '2026-08-05' },
        { sale_id: 106, customer_id: 2, product_id: 501, store_id: 901, amount: 1200, sale_date: '2026-08-06' },
        { sale_id: 107, customer_id: 5, product_id: 502, store_id: 903, amount: 800, sale_date: '2026-08-07' }
      ],
      dim_customers: [
        { customer_id: 1, name: 'Alice Smith', city: 'New York', segment: 'Premium' },
        { customer_id: 2, name: 'Bob Jones', city: 'Chicago', segment: 'Standard' },
        { customer_id: 3, name: 'Charlie Brown', city: 'Los Angeles', segment: 'Premium' },
        { customer_id: 4, name: 'Diana Prince', city: 'New York', segment: 'Standard' },
        { customer_id: 5, name: 'Evan Wright', city: 'Chicago', segment: 'Premium' }
      ],
      dim_products: [
        { product_id: 501, title: 'Super Laptop Pro', price: 1200, category: 'Hardware' },
        { product_id: 502, title: 'Smart Mobile X', price: 800, category: 'Hardware' },
        { product_id: 503, title: 'Wireless Headset', price: 150, category: 'Accessories' },
        { product_id: 504, title: 'Ergonomic Mouse', price: 80, category: 'Accessories' }
      ]
    };
    
    this.init();
  }
  
  init() {
    this.mountPoint.innerHTML = `
      <div class="sql-layout animate-slide-up">
        <!-- Schema Sidebar -->
        <aside class="sql-sidebar">
          <h3 style="font-size: 15px; margin-bottom: 12px; font-weight: 700;">Warehouse Schema</h3>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 16px;">Click table headers to inspect columns:</p>
          
          <div class="sql-schema-list">
            <!-- Fact Sales -->
            <div class="sql-schema-table">
              <div class="sql-schema-table-header">Fact_Sales</div>
              <div class="sql-schema-column">sale_id (int)</div>
              <div class="sql-schema-column">customer_id (int)</div>
              <div class="sql-schema-column">product_id (int)</div>
              <div class="sql-schema-column">store_id (int)</div>
              <div class="sql-schema-column">amount (numeric)</div>
              <div class="sql-schema-column">sale_date (date)</div>
            </div>
            
            <!-- Dim Customers -->
            <div class="sql-schema-table">
              <div class="sql-schema-table-header">Dim_Customers</div>
              <div class="sql-schema-column">customer_id (int)</div>
              <div class="sql-schema-column">name (varchar)</div>
              <div class="sql-schema-column">city (varchar)</div>
              <div class="sql-schema-column">segment (varchar)</div>
            </div>
            
            <!-- Dim Products -->
            <div class="sql-schema-table">
              <div class="sql-schema-table-header">Dim_Products</div>
              <div class="sql-schema-column">product_id (int)</div>
              <div class="sql-schema-column">title (varchar)</div>
              <div class="sql-schema-column">price (numeric)</div>
              <div class="sql-schema-column">category (varchar)</div>
            </div>
          </div>
        </aside>
        
        <!-- Console & Results Main -->
        <main class="sql-main">
          <div class="sql-console">
            <h2 style="font-size: 18px; font-weight: 700;">SQL Query Playground Console</h2>
            <p style="font-size: 13px; color: var(--text-secondary);">Write SQL queries to join and analyze our warehouse schemas. Supports SELECT, JOIN, WHERE filters.</p>
            
            <div class="sql-textarea-wrapper">
              <textarea id="sql-query-input" placeholder="SELECT * FROM fact_sales WHERE amount >= 800;"></textarea>
            </div>
            
            <div class="sql-console-actions">
              <div style="font-size: 12.5px; color: var(--text-muted);">
                💡 Tip: Try <code>SELECT name, amount FROM fact_sales JOIN dim_customers ON customer_id</code>
              </div>
              <button class="btn btn-primary" id="btn-execute-sql">Execute Query &rarr;</button>
            </div>
          </div>
          
          <div class="sql-results-container">
            <h3 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Execution Results Output</h3>
            <div id="sql-output-wrapper">
              <div style="font-size: 13px; color: var(--text-muted); font-style: italic; text-align: center; padding: 40px 0;">
                Console idle. Enter SQL query above and click execute.
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
    
    document.getElementById('btn-execute-sql').addEventListener('click', () => this.runQuery());
  }
  
  runQuery() {
    const rawSql = document.getElementById('sql-query-input').value.trim();
    const outputWrapper = document.getElementById('sql-output-wrapper');
    
    if (!rawSql) {
      outputWrapper.innerHTML = `<div class="sql-error-box">Error: Query is empty. Please enter an SQL command.</div>`;
      return;
    }
    
    // Normalize string spaces & casing for parsing
    let sql = rawSql.replace(/\s+/g, ' ').replace(/;$/, '').trim().toLowerCase();
    
    try {
      // 1. Check SELECT statement matches
      if (!sql.startsWith('select')) {
        throw new Error("Syntax Error: Only SELECT queries are supported in the learning sandbox console.");
      }
      
      // Parse FROM table name
      const fromMatch = sql.match(/from\s+([a-zA-Z0-9_]+)/);
      if (!fromMatch) {
        throw new Error("Syntax Error: Missing FROM clause in select statement.");
      }
      
      const primaryTableName = fromMatch[1];
      if (!this.tables[primaryTableName]) {
        throw new Error(`Execution Error: Table '${primaryTableName}' does not exist in schema.`);
      }
      
      let dataset = JSON.parse(JSON.stringify(this.tables[primaryTableName]));
      
      // 2. Parse JOIN statement (supports single JOIN)
      const joinMatch = sql.match(/join\s+([a-zA-Z0-9_]+)\s+on\s+([a-zA-Z0-9_\.]+)\s*=\s*([a-zA-Z0-9_\.]+)/);
      if (joinMatch) {
        const joinTable = joinMatch[1];
        const keyA = joinMatch[2];
        const keyB = joinMatch[3];
        
        if (!this.tables[joinTable]) {
          throw new Error(`Execution Error: Joined Table '${joinTable}' does not exist.`);
        }
        
        // Extract foreign key col names from dotted paths (e.g. fact_sales.customer_id -> customer_id)
        const getCol = (k) => k.includes('.') ? k.split('.')[1] : k;
        const colA = getCol(keyA);
        const colB = getCol(keyB);
        
        const joinData = this.tables[joinTable];
        
        // Perform Hash Join
        dataset = dataset.map(row => {
          const matchRow = joinData.find(jr => jr[colB] === row[colA] || jr[colA] === row[colB]);
          return matchRow ? { ...row, ...matchRow } : row;
        });
      }
      
      // 3. Parse WHERE clause
      const whereMatch = sql.match(/where\s+(.+)$/);
      if (whereMatch) {
        let conditionStr = whereMatch[1];
        // Strip trailing sections if present (like LIMIT, ORDER BY)
        conditionStr = conditionStr.split('order by')[0].split('limit')[0].trim();
        
        // Supports simple checks: column >= value, column = 'value', column > value
        const condMatch = conditionStr.match(/([a-zA-Z0-9_]+)\s*(=|>|<|>=|<=)\s*(.+)/);
        if (!condMatch) {
          throw new Error("Syntax Error: WHERE supports simple numeric comparison or string equality.");
        }
        
        const col = condMatch[1].trim();
        const op = condMatch[2].trim();
        let val = condMatch[3].trim().replace(/['"]/g, ''); // strip string quotes
        
        dataset = dataset.filter(row => {
          if (row[col] === undefined) return false;
          const cellVal = row[col];
          const isNum = !isNaN(cellVal) && !isNaN(val);
          const compareVal = isNum ? parseFloat(val) : val;
          const currentVal = isNum ? parseFloat(cellVal) : cellVal.toString().toLowerCase();
          
          if (op === '=') return currentVal === compareVal;
          if (op === '>') return currentVal > compareVal;
          if (op === '<') return currentVal < compareVal;
          if (op === '>=') return currentVal >= compareVal;
          if (op === '<=') return currentVal <= compareVal;
          return false;
        });
      }
      
      // 4. Parse columns to select
      const selectMatch = sql.match(/^select\s+(.+?)\s+from/);
      if (!selectMatch) {
        throw new Error("Syntax Error: Missing columns list in SELECT clause.");
      }
      
      const columnsList = selectMatch[1].trim();
      let selectColumns = [];
      if (columnsList === '*') {
        if (dataset.length > 0) {
          selectColumns = Object.keys(dataset[0]);
        }
      } else {
        selectColumns = columnsList.split(',').map(c => c.trim().split('.').pop()); // strip table prefixes
      }
      
      // Render results
      if (dataset.length === 0) {
        outputWrapper.innerHTML = `
          <div style="font-size: 13.5px; color: var(--text-secondary); text-align: center; padding: 30px;">
            ⚠️ Query executed successfully, but returned 0 records.
          </div>
        `;
        return;
      }
      
      // Filter keys to requested columns
      const headerHtml = selectColumns.map(col => `<th>${col.toUpperCase()}</th>`).join('');
      const rowsHtml = dataset.map(row => {
        return `<tr>${selectColumns.map(col => `<td>${row[col] !== undefined ? row[col] : 'NULL'}</td>`).join('')}</tr>`;
      }).join('');
      
      outputWrapper.innerHTML = `
        <div style="margin-bottom: 6px; font-size: 12px; color: var(--color-emerald); font-weight: bold;">
          ✓ Success: Query executed. Returned ${dataset.length} row(s).
        </div>
        <div class="table-scroll-container">
          <table class="sql-results-table">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `;
    } catch (err) {
      outputWrapper.innerHTML = `<div class="sql-error-box">${err.message}</div>`;
    }
  }
}

// ============================================================================
// 2. DRAG-AND-DROP ERD RELATIONSHIP PUZZLE
// ============================================================================
export class ErdSchemaBuilder {
  constructor(mountSelector, onCompleteCallback) {
    this.container = document.querySelector(mountSelector);
    this.onComplete = onCompleteCallback;
    
    // Mapping of expected connections: factNodeId -> dimensionNodeId
    this.targetConnections = {
      'fact-customer': 'dim-customer',
      'fact-product': 'dim-product',
      'fact-store': 'dim-store'
    };
    
    this.activeSelection = null; // Stores clicked source node
    this.connections = {}; // established keys: sourceId -> destId
    
    this.init();
  }
  
  init() {
    this.container.innerHTML = `
      <div style="margin-bottom: 12px;">
        <h2 style="font-size: 18px; font-weight: 700;">🧩 Interactive Schema Builder: Star Schema ERD</h2>
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
          Practice setting up a Star Schema! Click on a <b>Foreign Key (FK)</b> node (blue circle) in the central Fact table, and then click the corresponding <b>Primary Key (PK)</b> node in the Dimension tables. Connect all 3 dimensions to build the warehouse.
        </p>
      </div>
      
      <div class="erd-container" id="erd-puzzle-workspace">
        <svg class="erd-svg-layer" id="erd-svg-canvas"></svg>
        
        <div class="erd-tables-grid">
          <!-- Left: Dimension Customer -->
          <div class="erd-card" id="card-dim-cust">
            <div class="erd-card-header">Dim_Customers</div>
            <div class="erd-card-row">
              <span>customer_id [PK]</span>
              <div class="erd-key-node" id="dim-customer" data-type="dim"></div>
            </div>
            <div class="erd-card-row"><span>name</span></div>
            <div class="erd-card-row"><span>city</span></div>
          </div>
          
          <!-- Middle: Fact Sales -->
          <div class="erd-card fact-card" id="card-fact-sales">
            <div class="erd-card-header">Fact_Sales</div>
            <div class="erd-card-row">
              <div class="erd-key-node" id="fact-customer" data-type="fact"></div>
              <span>customer_id [FK]</span>
            </div>
            <div class="erd-card-row">
              <div class="erd-key-node" id="fact-product" data-type="fact"></div>
              <span>product_id [FK]</span>
            </div>
            <div class="erd-card-row">
              <div class="erd-key-node" id="fact-store" data-type="fact"></div>
              <span>store_id [FK]</span>
            </div>
            <div class="erd-card-row">
              <span></span>
              <span>amount</span>
            </div>
            <div class="erd-card-row">
              <span></span>
              <span>date_key</span>
            </div>
          </div>
          
          <!-- Right: Dimension Product -->
          <div class="erd-card" id="card-dim-prod">
            <div class="erd-card-header">Dim_Products</div>
            <div class="erd-card-row">
              <span>product_id [PK]</span>
              <div class="erd-key-node" id="dim-product" data-type="dim"></div>
            </div>
            <div class="erd-card-row"><span>title</span></div>
            <div class="erd-card-row"><span>category</span></div>
          </div>
          
          <!-- Bottom: Dimension Store -->
          <div class="erd-card" id="card-dim-store" style="grid-column: 1 / span 3; margin-top: 20px;">
            <div class="erd-card-header">Dim_Stores</div>
            <div class="erd-card-row">
              <span>store_id [PK]</span>
              <div class="erd-key-node" id="dim-store" data-type="dim"></div>
            </div>
            <div class="erd-card-row"><span>address</span></div>
            <div class="erd-card-row"><span>city</span></div>
          </div>
        </div>
      </div>
      
      <div style="display:flex; justify-content: space-between; align-items:center;">
        <button class="btn btn-outline" id="btn-reset-erd">Reset Links</button>
        <div id="erd-puzzle-status" style="font-weight:700; color: var(--color-amber);">Connections: 0 of 3 established</div>
      </div>
    `;
    
    this.workspace = document.getElementById('erd-puzzle-workspace');
    this.svgCanvas = document.getElementById('erd-svg-canvas');
    
    // Bind listeners to nodes
    const nodes = this.container.querySelectorAll('.erd-key-node');
    nodes.forEach(n => n.addEventListener('click', (e) => this.handleNodeClick(e.target)));
    
    document.getElementById('btn-reset-erd').addEventListener('click', () => this.resetWorkspace());
    
    // Handle responsive resize updates
    window.addEventListener('resize', () => this.redrawAllLines());
  }
  
  handleNodeClick(node) {
    const nodeType = node.getAttribute('data-type');
    const nodeId = node.id;
    
    // 1. If no node is selected, user must select a Fact table node
    if (!this.activeSelection) {
      if (nodeType !== 'fact') {
        alert("Select a Foreign Key (FK) in the central Fact_Sales table first!");
        return;
      }
      this.activeSelection = node;
      node.classList.add('selected');
    } 
    // 2. If a source is selected, connect to clicked destination
    else {
      const srcNode = this.activeSelection;
      srcNode.classList.remove('selected');
      this.activeSelection = null;
      
      // If clicked destination is also a fact node, cancel selection
      if (nodeType === 'fact') {
        if (srcNode.id !== node.id) {
          this.activeSelection = node;
          node.classList.add('selected');
        }
        return;
      }
      
      // Validate mapping match
      const correctDest = this.targetConnections[srcNode.id];
      if (correctDest !== nodeId) {
        alert(`Incorrect connection! Key relationship does not match. FK '${srcNode.id.split('-')[1]}' should connect to PK '${correctDest.split('-')[1]}'.`);
        return;
      }
      
      // Record connection
      this.connections[srcNode.id] = nodeId;
      srcNode.classList.add('connected');
      node.classList.add('connected');
      
      this.drawSvgLine(srcNode.id, nodeId);
      this.checkPuzzleComplete();
    }
  }
  
  drawSvgLine(srcId, destId) {
    const srcEl = document.getElementById(srcId);
    const destEl = document.getElementById(destId);
    if (!srcEl || !destEl) return;
    
    const rect = this.workspace.getBoundingClientRect();
    const srcRect = srcEl.getBoundingClientRect();
    const destRect = destEl.getBoundingClientRect();
    
    // Calculate coordinates relative to workspace SVGLayer
    const x1 = srcRect.left - rect.left + srcRect.width/2;
    const y1 = srcRect.top - rect.top + srcRect.height/2;
    const x2 = destRect.left - rect.left + destRect.width/2;
    const y2 = destRect.top - rect.top + destRect.height/2;
    
    // Create connection path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Draw smooth bezier curves
    const cx1 = x1 + (x2 - x1) / 2;
    const cy1 = y1;
    const cx2 = x1 + (x2 - x1) / 2;
    const cy2 = y2;
    
    path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
    path.setAttribute('stroke', '#10b981'); // Emerald Green
    path.setAttribute('stroke-width', '4');
    path.setAttribute('fill', 'none');
    path.setAttribute('data-link', `${srcId}-${destId}`);
    
    this.svgCanvas.appendChild(path);
  }
  
  redrawAllLines() {
    this.svgCanvas.innerHTML = "";
    Object.keys(this.connections).forEach(src => {
      this.drawSvgLine(src, this.connections[src]);
    });
  }
  
  checkPuzzleComplete() {
    const keysCount = Object.keys(this.connections).length;
    const statusLabel = document.getElementById('erd-puzzle-status');
    statusLabel.innerText = `Connections: ${keysCount} of 3 established`;
    
    if (keysCount === 3) {
      statusLabel.innerHTML = `🎉 <span style="color: var(--color-emerald)">Star Schema Complete! Well Done.</span>`;
      if (this.onComplete) {
        setTimeout(() => this.onComplete(), 1000);
      }
    }
  }
  
  resetWorkspace() {
    this.connections = {};
    this.activeSelection = null;
    this.svgCanvas.innerHTML = "";
    
    const nodes = this.container.querySelectorAll('.erd-key-node');
    nodes.forEach(n => {
      n.classList.remove('connected', 'selected');
    });
    
    this.checkPuzzleComplete();
  }
}

// ============================================================================
// 3. APRIORI ALGORITHM ASSOCIATION RULES SIMULATOR
// ============================================================================
export class AprioriSimulator {
  constructor(mountSelector) {
    this.container = document.querySelector(mountSelector);
    this.selectedItems = new Set();
    this.transactions = [
      { id: 1, items: ['Milk', 'Bread'] },
      { id: 2, items: ['Diapers', 'Beer'] },
      { id: 3, items: ['Milk', 'Diapers', 'Beer'] },
      { id: 4, items: ['Milk', 'Bread', 'Diapers', 'Beer'] },
      { id: 5, items: ['Bread', 'Eggs'] }
    ];
    
    this.init();
  }
  
  init() {
    this.container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-size: 18px; font-weight: 700;">⛏ Market Basket Analysis Sandbox: Apriori Rules Miner</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">
          Create transactions, set support and confidence filters, and watch the Apriori mining algorithm calculate association rules.
        </p>
      </div>
      
      <div class="apriori-simulator animate-slide-up">
        <!-- Left panel control configurations -->
        <aside class="apriori-controls">
          <div>
            <h4 style="font-size: 13.5px; font-weight: 700; margin-bottom: 8px;">1. Add Virtual Basket Transaction</h4>
            <p style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 12px;">Select items and click Add Basket to update transactions list.</p>
            <div class="apriori-items-grid">
              <button class="apriori-item-btn" data-item="Milk">Milk 🥛</button>
              <button class="apriori-item-btn" data-item="Bread">Bread 🍞</button>
              <button class="apriori-item-btn" data-item="Diapers">Diapers 👶</button>
              <button class="apriori-item-btn" data-item="Beer">Beer 🍺</button>
              <button class="apriori-item-btn" data-item="Eggs">Eggs 🥚</button>
            </div>
            <button class="btn btn-primary btn-sm btn-block" id="btn-add-basket" style="margin-top:12px;">Add Basket +</button>
          </div>
          
          <div>
            <h4 style="font-size: 13.5px; font-weight: 700; margin-bottom: 8px;">2. Mining Parameters</h4>
            
            <div style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Min Support</span>
                <span id="support-val" style="font-weight:700;">40%</span>
              </div>
              <input type="range" id="slider-support" min="10" max="80" step="5" value="40" style="width:100%;">
            </div>
            
            <div style="margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Min Confidence</span>
                <span id="confidence-val" style="font-weight:700;">60%</span>
              </div>
              <input type="range" id="slider-confidence" min="20" max="100" step="5" value="60" style="width:100%;">
            </div>
          </div>
          
          <button class="btn btn-primary" id="btn-mine-rules">Execute Apriori Algorithm</button>
        </aside>
        
        <!-- Right panel results tables -->
        <main style="display:flex; flex-direction:column; gap:20px;">
          <div class="rules-output-container" style="max-height: 250px; overflow-y: auto;">
            <h4 style="font-size: 13.5px; font-weight:700; margin-bottom:10px;">Daily Checkout Transaction Database</h4>
            <div class="basket-list" id="apriori-baskets-view"></div>
          </div>
          
          <div class="rules-output-container" style="flex-grow:1;">
            <h4 style="font-size: 13.5px; font-weight:700; margin-bottom:10px;">Discovered Association Rules</h4>
            <div id="apriori-rules-output">
              <div style="font-size:13px; color:var(--text-muted); font-style:italic; text-align:center; padding:30px 0;">
                Click "Execute Apriori Algorithm" to see rules output.
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
    
    // Bind listeners
    const itemBtns = this.container.querySelectorAll('.apriori-item-btn');
    itemBtns.forEach(btn => btn.addEventListener('click', (e) => this.toggleItem(e.target)));
    
    document.getElementById('btn-add-basket').addEventListener('click', () => this.addBasket());
    document.getElementById('btn-mine-rules').addEventListener('click', () => this.mineRules());
    
    const sSlider = document.getElementById('slider-support');
    const cSlider = document.getElementById('slider-confidence');
    
    sSlider.addEventListener('input', (e) => {
      document.getElementById('support-val').innerText = `${e.target.value}%`;
    });
    cSlider.addEventListener('input', (e) => {
      document.getElementById('confidence-val').innerText = `${e.target.value}%`;
    });
    
    this.renderBaskets();
  }
  
  toggleItem(btn) {
    const item = btn.getAttribute('data-item');
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
      btn.classList.remove('selected');
    } else {
      this.selectedItems.add(item);
      btn.classList.add('selected');
    }
  }
  
  addBasket() {
    if (this.selectedItems.size === 0) {
      alert("Select at least one item before adding basket!");
      return;
    }
    
    const itemsArray = Array.from(this.selectedItems);
    this.transactions.push({
      id: this.transactions.length + 1,
      items: itemsArray
    });
    
    // Reset selected items UI
    this.selectedItems.clear();
    const btns = this.container.querySelectorAll('.apriori-item-btn');
    btns.forEach(b => b.classList.remove('selected'));
    
    this.renderBaskets();
  }
  
  renderBaskets() {
    const view = document.getElementById('apriori-baskets-view');
    view.innerHTML = this.transactions.map(t => `
      <div class="basket-item">
        <span style="font-weight:700; color:var(--color-indigo);">Basket #${t.id}</span>
        <span style="font-family:monospace; font-size:12.5px;">{ ${t.items.join(', ')} }</span>
      </div>
    `).join('');
  }
  
  mineRules() {
    const minSup = parseFloat(document.getElementById('slider-support').value) / 100;
    const minConf = parseFloat(document.getElementById('slider-confidence').value) / 100;
    const totalTransactions = this.transactions.length;
    const rulesOutput = document.getElementById('apriori-rules-output');
    
    const itemCounts = {};
    const pairCounts = {};
    
    // Support frequency counting
    this.transactions.forEach(t => {
      t.items.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
      // Generate pairs for item association rules
      for (let i = 0; i < t.items.length; i++) {
        for (let j = i + 1; j < t.items.length; j++) {
          const key = [t.items[i], t.items[j]].sort().join('&');
          pairCounts[key] = (pairCounts[key] || 0) + 1;
        }
      }
    });
    
    const rules = [];
    
    // Calculate candidate association rules from pairs
    Object.keys(pairCounts).forEach(pairKey => {
      const support = pairCounts[pairKey] / totalTransactions;
      if (support >= minSup) {
        const [itemA, itemB] = pairKey.split('&');
        
        // Check Rule: A -> B
        const confA = pairCounts[pairKey] / itemCounts[itemA];
        const liftA = confA / (itemCounts[itemB] / totalTransactions);
        if (confA >= minConf) {
          rules.push({ antecedent: itemA, consequent: itemB, support, confidence: confA, lift: liftA });
        }
        
        // Check Rule: B -> A
        const confB = pairCounts[pairKey] / itemCounts[itemB];
        const liftB = confB / (itemCounts[itemA] / totalTransactions);
        if (confB >= minConf) {
          rules.push({ antecedent: itemB, consequent: itemA, support, confidence: confB, lift: liftB });
        }
      }
    });
    
    if (rules.length === 0) {
      rulesOutput.innerHTML = `
        <div style="font-size: 13.5px; color: var(--text-secondary); text-align: center; padding: 20px;">
          ⚠️ No rules met support/confidence thresholds. Try lowering the sliders and mining again.
        </div>
      `;
      return;
    }
    
    rulesOutput.innerHTML = rules.map(r => `
      <div class="rule-card animate-slide-up">
        <div class="rule-implication">
          ${r.antecedent} &rarr; ${r.consequent}
        </div>
        <div class="rule-metrics">
          <span>Support: <span class="metric-badge">${Math.round(r.support * 100)}%</span></span>
          <span>Confidence: <span class="metric-badge" style="background-color:rgba(16,185,129,0.1); color:var(--color-emerald);">${Math.round(r.confidence * 100)}%</span></span>
          <span>Lift: <span class="metric-badge" style="background-color:rgba(245,158,11,0.1); color:var(--color-amber);">${r.lift.toFixed(2)}</span></span>
        </div>
      </div>
    `).join('');
  }
}

// ============================================================================
// 4. BI DASHBOARD DESIGN CANVAS SIMULATOR
// ============================================================================
export class BiDashboardBuilder {
  constructor(mountSelector) {
    this.container = document.querySelector(mountSelector);
    this.chart = null;
    
    // Dataset definition
    this.dataset = {
      laptops: { Jan: 120, Feb: 140, Mar: 110, Apr: 180, May: 220, Jun: 250 },
      smartphones: { Jan: 300, Feb: 320, Mar: 340, Apr: 410, May: 480, Jun: 520 },
      tablets: { Jan: 80, Feb: 90, Mar: 95, Apr: 110, May: 130, Jun: 155 }
    };
    
    this.init();
  }
  
  init() {
    this.container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-size: 18px; font-weight: 700;">📊 BI Dashboard Design Canvas Sandbox</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">
          Learn dataviz best practices. Design charts by selecting dimensions, measures, and templates. The tool checks for design errors.
        </p>
      </div>
      
      <div class="bi-canvas-layout animate-slide-up">
        <!-- Configuration Controls -->
        <aside class="bi-panel-controls">
          <div>
            <label style="font-size:12.5px; font-weight:700; margin-bottom:6px; display:block;">X-Axis Category (Dimension)</label>
            <select id="bi-select-x" style="width:100%; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); color:var(--text-primary);">
              <option value="months">Months (Jan - Jun)</option>
              <option value="products">Product Categories (Laptops, Phones...)</option>
            </select>
          </div>
          
          <div>
            <label style="font-size:12.5px; font-weight:700; margin-bottom:6px; display:block;">Y-Axis Metric (Measure)</label>
            <select id="bi-select-y" style="width:100%; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); color:var(--text-primary);">
              <option value="sales">Revenue (Sales in $ USD)</option>
              <option value="units">Volume (Units Sold)</option>
              <option value="category">Category Segment (Varchar)</option>
            </select>
          </div>
          
          <div>
            <label style="font-size:12.5px; font-weight:700; margin-bottom:6px; display:block;">Chart Visualization Type</label>
            <select id="bi-select-type" style="width:100%; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); color:var(--text-primary);">
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
          
          <button class="btn btn-primary" id="btn-render-bi-chart">Draw BI Visualization</button>
        </aside>
        
        <!-- Preview Canvas -->
        <main class="chart-preview-wrapper">
          <div class="chart-canvas-container">
            <canvas id="bi-chart-canvas"></canvas>
          </div>
          <div id="bi-chart-feedback" style="width:100%;"></div>
        </main>
      </div>
    `;
    
    document.getElementById('btn-render-bi-chart').addEventListener('click', () => this.drawChart());
    
    // Initial draw
    this.drawChart();
  }
  
  drawChart() {
    const xSelect = document.getElementById('bi-select-x').value;
    const ySelect = document.getElementById('bi-select-y').value;
    const typeSelect = document.getElementById('bi-select-type').value;
    
    const feedbackBox = document.getElementById('bi-chart-feedback');
    feedbackBox.innerHTML = ""; // reset feedback
    
    // Validate Design Mistakes
    let feedbackWarning = "";
    
    // Error 1: Qualitative Column on Y-Axis
    if (ySelect === 'category') {
      feedbackWarning = `
        <div class="bi-warning-box">
          <b>⚠️ Viz Error: Category Segment on Y-Axis</b><br>
          Avoid placing description text attributes (Varchars) on the Y-Axis! The Y-Axis should plot metrics and numbers (such as Sales Revenue or Units Sold) to calculate heights and bar widths.
        </div>
      `;
    }
    // Error 2: Pie chart on temporal dimensions
    else if (xSelect === 'months' && typeSelect === 'pie') {
      feedbackWarning = `
        <div class="bi-warning-box">
          <b>⚠️ Viz Alert: Temporal Pie Chart</b><br>
          Temporal metrics (time series like months/quarters) should almost never be shown on a Pie Chart! Pie charts show proportion shares, not continuous intervals. Try using a <b>Line</b> or <b>Bar</b> chart to track chronological progress.
        </div>
      `;
    }
    // Correct choices
    else if (xSelect === 'months' && typeSelect === 'line') {
      feedbackWarning = `
        <div class="bi-warning-box" style="border-color: var(--color-emerald); color: var(--color-emerald); background-color: rgba(16, 185, 129, 0.05)">
          <b>✨ Clean Dataviz Choice!</b><br>
          Excellent. Line charts are the best industry standard for visualizing trend intervals over continuous time periods.
        </div>
      `;
    }
    
    feedbackBox.innerHTML = feedbackWarning;
    
    // Draw canvas chart
    if (this.chart) {
      this.chart.destroy();
    }
    
    // Build chart configuration
    const labels = xSelect === 'months' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] : ['Laptops', 'Smartphones', 'Tablets'];
    let data = [];
    if (xSelect === 'months') {
      // consolidate product categories
      data = ySelect === 'sales' ? [45000, 52000, 48000, 68000, 83000, 93000] : [500, 550, 545, 700, 830, 925];
    } else {
      data = ySelect === 'sales' ? [70000, 110000, 25000] : [975, 2370, 720];
    }
    
    // Zero out data if qualitative column selected on Y-axis
    if (ySelect === 'category') {
      data = [0, 0, 0, 0, 0, 0];
    }
    
    const ctx = document.getElementById('bi-chart-canvas').getContext('2d');
    
    // Theme responsive coloring colors
    const isDark = !document.documentElement.classList.contains('light-theme');
    const labelColor = isDark ? '#9ca3af' : '#475569';
    const gridColor = isDark ? '#374151' : '#cbd5e1';
    
    this.chart = new Chart(ctx, {
      type: typeSelect,
      data: {
        labels: labels,
        datasets: [{
          label: ySelect === 'sales' ? 'Revenue ($ USD)' : (ySelect === 'units' ? 'Units Sold' : 'Varchars'),
          data: data,
          backgroundColor: typeSelect === 'pie' ? ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#3b82f6'] : '#6366f1',
          borderColor: typeSelect === 'pie' ? 'transparent' : '#6366f1',
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: labelColor }
          }
        },
        scales: typeSelect !== 'pie' ? {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: labelColor }
          }
        } : {}
      }
    });
  }
}
