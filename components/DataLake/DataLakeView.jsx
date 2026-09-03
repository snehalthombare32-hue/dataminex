import React, { useState } from 'react';

export default function DataLakeView() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture' | 'comparison'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <span>🌊</span> Data Lake Engineering Architecture
          </h2>
          <p className="text-sm text-slate-400">
            High-scale, cost-effective storage repository for raw structured, semi-structured, and unstructured big data
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'overview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'architecture' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Architecture Diagram
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'comparison' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Lake vs Warehouse
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-2xl">📥</span>
            <h3 className="text-sm font-bold text-cyan-300">Schema-on-Read</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike traditional databases that enforce schema when data is written (Schema-on-Write), a Data Lake allows raw data to be ingested as-is. Schema is applied when querying.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-2xl">📦</span>
            <h3 className="text-sm font-bold text-cyan-300">All Data Formats</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stores structured data (Postgres / MySQL tables), semi-structured data (JSON logs, XML, CSV), and unstructured data (PDFs, audio streams, sensor feeds).
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-2xl">🚀</span>
            <h3 className="text-sm font-bold text-cyan-300">Cost-Effective Big Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built on scalable cloud object storage (AWS S3, Azure Data Lake Storage, GCP Cloud Storage) decoupled from compute engines (Spark, Trino, Presto).
            </p>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
            Medallion Architecture (Bronze ➔ Silver ➔ Gold)
          </div>

          <svg viewBox="0 0 740 240" className="w-full h-auto">
            <defs>
              <marker id="lake-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Ingestion Sources */}
            <g transform="translate(20, 40)">
              <rect width="110" height="150" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="55" y="25" textAnchor="middle" fill="#cbd5e1" fontWeight="bold" fontSize="11">Data Sources</text>
              <text x="12" y="55" fill="#94a3b8" fontSize="10">🔹 IoT Sensors</text>
              <text x="12" y="80" fill="#94a3b8" fontSize="10">🔹 App Logs (JSON)</text>
              <text x="12" y="105" fill="#94a3b8" fontSize="10">🔹 RDBMS Raws</text>
              <text x="12" y="130" fill="#94a3b8" fontSize="10">🔹 Clickstreams</text>
            </g>

            {/* Arrow 1 */}
            <line x1="135" y1="115" x2="175" y2="115" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#lake-arrow)" />

            {/* Bronze Layer */}
            <g transform="translate(180, 40)">
              <rect width="140" height="150" rx="8" fill="#451a03" stroke="#b45309" strokeWidth="1.5" />
              <rect width="140" height="26" rx="8" fill="#78350f" />
              <text x="70" y="17" textAnchor="middle" fill="#fde68a" fontWeight="bold" fontSize="11">🥉 BRONZE (RAW)</text>
              <text x="12" y="55" fill="#fef3c7" fontSize="10">• Append-only dump</text>
              <text x="12" y="78" fill="#fef3c7" fontSize="10">• Unfiltered history</text>
              <text x="12" y="101" fill="#fef3c7" fontSize="10">• Parquet / JSON</text>
              <text x="12" y="124" fill="#fef3c7" fontSize="10">• Schema-on-Read</text>
            </g>

            {/* Arrow 2 */}
            <line x1="325" y1="115" x2="365" y2="115" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#lake-arrow)" />

            {/* Silver Layer */}
            <g transform="translate(370, 40)">
              <rect width="140" height="150" rx="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
              <rect width="140" height="26" rx="8" fill="#475569" />
              <text x="70" y="17" textAnchor="middle" fill="#f8fafc" fontWeight="bold" fontSize="11">🥈 SILVER (CLEAN)</text>
              <text x="12" y="55" fill="#e2e8f0" fontSize="10">• Deduplicated data</text>
              <text x="12" y="78" fill="#e2e8f0" fontSize="10">• Validated schema</text>
              <text x="12" y="101" fill="#e2e8f0" fontSize="10">• Enriched attributes</text>
              <text x="12" y="124" fill="#e2e8f0" fontSize="10">• Data engineering</text>
            </g>

            {/* Arrow 3 */}
            <line x1="515" y1="115" x2="555" y2="115" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#lake-arrow)" />

            {/* Gold Layer */}
            <g transform="translate(560, 40)">
              <rect width="150" height="150" rx="8" fill="#713f12" stroke="#eab308" strokeWidth="1.5" />
              <rect width="150" height="26" rx="8" fill="#a16207" />
              <text x="75" y="17" textAnchor="middle" fill="#fef08a" fontWeight="bold" fontSize="11">🥇 GOLD (CURATED)</text>
              <text x="12" y="55" fill="#fef9c3" fontSize="10">• Star / Snowflake DWH</text>
              <text x="12" y="78" fill="#fef9c3" fontSize="10">• Aggregated KPIs</text>
              <text x="12" y="101" fill="#fef9c3" fontSize="10">• BI Dashboards</text>
              <text x="12" y="124" fill="#fef9c3" fontSize="10">• ML Feature Store</text>
            </g>
          </svg>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">Criteria</th>
                <th className="py-3 px-3 text-cyan-400">🌊 Data Lake</th>
                <th className="py-3 px-3 text-indigo-400">🏢 Data Warehouse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-200">Data Types</td>
                <td className="py-2.5 px-3 text-cyan-300">Structured, Semi-Structured &amp; Unstructured</td>
                <td className="py-2.5 px-3 text-indigo-300">Strictly Structured relational tables</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-200">Schema Architecture</td>
                <td className="py-2.5 px-3 text-cyan-300">Schema-on-Read (applied upon query)</td>
                <td className="py-2.5 px-3 text-indigo-300">Schema-on-Write (modeled upfront)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-200">Processing Paradigm</td>
                <td className="py-2.5 px-3 text-cyan-300">ELT (Extract, Load, Transform)</td>
                <td className="py-2.5 px-3 text-indigo-300">ETL (Extract, Transform, Load)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-200">Storage Cost</td>
                <td className="py-2.5 px-3 text-cyan-300">Very Low (Object storage e.g. S3)</td>
                <td className="py-2.5 px-3 text-indigo-300">Higher (Engine-coupled disk blocks)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-200">Primary Users</td>
                <td className="py-2.5 px-3 text-cyan-300">Data Scientists, ML Engineers</td>
                <td className="py-2.5 px-3 text-indigo-300">Business Analysts, Executives</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
