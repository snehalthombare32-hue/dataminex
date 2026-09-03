import React, { useState, useMemo } from 'react';

const DEFAULT_SALES_DATA = [
  {
    transaction_id: "TX-1001",
    customer_id: "CUST-01",
    customer_name: "Alice Johnson",
    customer_city: "New York",
    customer_state: "NY",
    product_id: "PROD-501",
    product_name: "4K Gaming Monitor",
    category: "Hardware",
    sub_category: "Displays",
    store_id: "STORE-10",
    store_name: "Downtown Tech Hub",
    store_region: "East",
    date: "2026-08-15",
    quarter: "Q3",
    year: 2026,
    quantity: 2,
    unit_price: 350.00,
    total_amount: 700.00
  },
  {
    transaction_id: "TX-1002",
    customer_id: "CUST-02",
    customer_name: "Bob Martinez",
    customer_city: "Chicago",
    customer_state: "IL",
    product_id: "PROD-502",
    product_name: "Mechanical Keyboard",
    category: "Peripherals",
    sub_category: "Keyboards",
    store_id: "STORE-20",
    store_name: "Midwest Digital",
    store_region: "Central",
    date: "2026-08-16",
    quarter: "Q3",
    year: 2026,
    quantity: 1,
    unit_price: 120.00,
    total_amount: 120.00
  }
];

export default function SchemaGenerator() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(DEFAULT_SALES_DATA, null, 2));
  const [schemaType, setSchemaType] = useState('star'); // 'star' | 'snowflake'
  const [error, setError] = useState(null);

  // Parse and analyze input
  const parsedData = useMemo(() => {
    try {
      const data = JSON.parse(jsonInput);
      setError(null);
      return Array.isArray(data) ? data : [data];
    } catch (e) {
      setError("Invalid JSON format: " + e.message);
      return [];
    }
  }, [jsonInput]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-400 flex items-center gap-2">
            <span>🧩</span> Automated Schema Generator
          </h2>
          <p className="text-sm text-slate-400">
            Convert transactional sales JSON into Star &amp; Snowflake Dimensional Models
          </p>
        </div>

        {/* Schema Type Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setSchemaType('star')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
              schemaType === 'star' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Star Schema
          </button>
          <button
            onClick={() => setSchemaType('snowflake')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
              schemaType === 'snowflake' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Snowflake Schema
          </button>
        </div>
      </div>

      {/* Grid: JSON Editor + Schema Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editable JSON */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">Input Dataset (JSON)</label>
            <button
              onClick={() => setJsonInput(JSON.stringify(DEFAULT_SALES_DATA, null, 2))}
              className="text-xs text-indigo-400 hover:underline"
            >
              Reset Sample
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={18}
            className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner resize-y"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="p-3 bg-slate-800/60 rounded-lg text-xs text-slate-400 space-y-1">
            <p><strong>Mode:</strong> {schemaType === 'star' ? 'Denormalized Dimensions (Fastest Read Queries)' : 'Normalized Hierarchies (Reduces Redundancy)'}</p>
            <p><strong>Records Loaded:</strong> {parsedData.length}</p>
          </div>
        </div>

        {/* Right Column: Schema Diagram & Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* SVG Interactive Architecture Diagram */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Visual Architecture ({schemaType.toUpperCase()} SCHEMA)
            </div>

            <svg viewBox="0 0 740 380" className="w-full h-auto">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                </marker>
                <marker id="arrow-emerald" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Connecting Lines from Central Fact to Dimensions */}
              {/* Fact -> Dim_Customer */}
              <line x1="370" y1="190" x2="140" y2="90" stroke="#6366f1" strokeWidth="2" strokeDasharray={schemaType === 'star' ? '0' : '4'} markerEnd="url(#arrow)" />
              {/* Fact -> Dim_Product */}
              <line x1="370" y1="190" x2="600" y2="90" stroke="#6366f1" strokeWidth="2" strokeDasharray={schemaType === 'star' ? '0' : '4'} markerEnd="url(#arrow)" />
              {/* Fact -> Dim_Store */}
              <line x1="370" y1="190" x2="140" y2="290" stroke="#6366f1" strokeWidth="2" strokeDasharray={schemaType === 'star' ? '0' : '4'} markerEnd="url(#arrow)" />
              {/* Fact -> Dim_Date */}
              <line x1="370" y1="190" x2="600" y2="290" stroke="#6366f1" strokeWidth="2" strokeDasharray={schemaType === 'star' ? '0' : '4'} markerEnd="url(#arrow)" />

              {/* If Snowflake: sub-dimension connections */}
              {schemaType === 'snowflake' && (
                <>
                  {/* Dim_Customer -> Dim_State */}
                  <line x1="70" y1="90" x2="30" y2="90" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-emerald)" />
                  {/* Dim_Product -> Dim_Category */}
                  <line x1="670" y1="90" x2="710" y2="90" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-emerald)" />
                </>
              )}

              {/* CENTRAL FACT TABLE */}
              <g transform="translate(290, 110)">
                <rect width="160" height="150" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                <rect width="160" height="28" rx="8" fill="#4f46e5" />
                <text x="80" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">Fact_Sales</text>
                <text x="12" y="48" fill="#a5b4fc" fontSize="10">🔑 transaction_id (PK)</text>
                <text x="12" y="66" fill="#cbd5e1" fontSize="9">🔗 customer_key (FK)</text>
                <text x="12" y="82" fill="#cbd5e1" fontSize="9">🔗 product_key (FK)</text>
                <text x="12" y="98" fill="#cbd5e1" fontSize="9">🔗 store_key (FK)</text>
                <text x="12" y="114" fill="#cbd5e1" fontSize="9">🔗 date_key (FK)</text>
                <text x="12" y="130" fill="#34d399" fontSize="9">📊 quantity: int</text>
                <text x="12" y="144" fill="#34d399" fontSize="9">📊 total_amount: num</text>
              </g>

              {/* DIM 1: CUSTOMER */}
              <g transform="translate(60, 40)">
                <rect width="140" height="100" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <rect width="140" height="24" rx="6" fill="#0284c7" />
                <text x="70" y="16" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Dim_Customer</text>
                <text x="10" y="42" fill="#7dd3fc" fontSize="9">🔑 customer_key (PK)</text>
                <text x="10" y="58" fill="#cbd5e1" fontSize="9">name: varchar</text>
                <text x="10" y="74" fill="#cbd5e1" fontSize="9">{schemaType === 'star' ? 'city & state: varchar' : 'city: varchar'}</text>
                {schemaType === 'snowflake' && (
                  <text x="10" y="90" fill="#a7f3d0" fontSize="9">🔗 state_id (FK)</text>
                )}
              </g>

              {/* DIM 2: PRODUCT */}
              <g transform="translate(540, 40)">
                <rect width="140" height="100" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <rect width="140" height="24" rx="6" fill="#0284c7" />
                <text x="70" y="16" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Dim_Product</text>
                <text x="10" y="42" fill="#7dd3fc" fontSize="9">🔑 product_key (PK)</text>
                <text x="10" y="58" fill="#cbd5e1" fontSize="9">name: varchar</text>
                <text x="10" y="74" fill="#cbd5e1" fontSize="9">{schemaType === 'star' ? 'category & sub_cat' : 'sub_category'}</text>
                {schemaType === 'snowflake' && (
                  <text x="10" y="90" fill="#a7f3d0" fontSize="9">🔗 category_id (FK)</text>
                )}
              </g>

              {/* DIM 3: STORE */}
              <g transform="translate(60, 240)">
                <rect width="140" height="90" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <rect width="140" height="24" rx="6" fill="#0284c7" />
                <text x="70" y="16" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Dim_Store</text>
                <text x="10" y="42" fill="#7dd3fc" fontSize="9">🔑 store_key (PK)</text>
                <text x="10" y="58" fill="#cbd5e1" fontSize="9">name: varchar</text>
                <text x="10" y="74" fill="#cbd5e1" fontSize="9">region: varchar</text>
              </g>

              {/* DIM 4: DATE */}
              <g transform="translate(540, 240)">
                <rect width="140" height="90" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <rect width="140" height="24" rx="6" fill="#0284c7" />
                <text x="70" y="16" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Dim_Date</text>
                <text x="10" y="42" fill="#7dd3fc" fontSize="9">🔑 date_key (PK)</text>
                <text x="10" y="58" fill="#cbd5e1" fontSize="9">full_date: date</text>
                <text x="10" y="74" fill="#cbd5e1" fontSize="9">quarter & year: int</text>
              </g>
            </svg>
          </div>

          {/* Table Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-1.5">
                <span>📊</span> Fact Table (Measures &amp; Foreign Keys)
              </h4>
              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li><span className="text-amber-400">transaction_id</span> - Primary Key</li>
                <li><span className="text-sky-400">customer_key, product_key, store_key, date_key</span> - FKs</li>
                <li><span className="text-emerald-400">quantity</span> - Additive Metric</li>
                <li><span className="text-emerald-400">total_amount</span> - Additive Metric ($)</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h4 className="text-sm font-semibold text-sky-300 mb-2 flex items-center gap-1.5">
                <span>📁</span> Dimension Tables ({schemaType === 'star' ? 'Denormalized' : 'Normalized'})
              </h4>
              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li><strong className="text-slate-100">Dim_Customer:</strong> Name, City, State</li>
                <li><strong className="text-slate-100">Dim_Product:</strong> Name, Category, Sub-Category</li>
                <li><strong className="text-slate-100">Dim_Store:</strong> Name, Region</li>
                <li><strong className="text-slate-100">Dim_Date:</strong> Full_Date, Quarter, Year</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
