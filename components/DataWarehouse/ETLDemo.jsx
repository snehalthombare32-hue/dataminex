import React, { useState } from 'react';

const RAW_STREAM = [
  { id: 101, raw_user: "ALICE_M", raw_city: "NYC", item: "Laptop Pro", price: "$1,200.00", tx_time: "2026-08-01 10:14:02", status: "VALID" },
  { id: 102, raw_user: "BOB_J", raw_city: "chicago", item: "Phone X", price: "$800.00", tx_time: "2026-08-02 11:20:15", status: "VALID" },
  { id: 101, raw_user: "ALICE_M", raw_city: "NYC", item: "Laptop Pro", price: "$1,200.00", tx_time: "2026-08-01 10:14:02", status: "DUPLICATE" },
  { id: 103, raw_user: "NULL", raw_city: "Los Angeles", item: "Tablet Air", price: "NULL", tx_time: "2026-08-03 14:05:00", status: "MISSING_VALUES" },
  { id: 104, raw_user: "CHARLIE_K", raw_city: "New York", item: "Keyboard RGB", price: "$150.00", tx_time: "2026-08-04 09:30:10", status: "VALID" }
];

export default function ETLDemo() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
          <span>⚙️</span> Interactive ETL Pipeline Simulation
        </h2>
        <p className="text-sm text-slate-400">
          Walk through the Extract, Clean, Transform, and Load lifecycle with live state transitions
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { step: 1, label: "1. Raw Extraction", desc: "Ingest from OLTP Logs" },
          { step: 2, label: "2. Data Cleaning", desc: "Filter Dups & Nulls" },
          { step: 3, label: "3. Transformation", desc: "Standardize & Key Gen" },
          { step: 4, label: "4. DWH Loading", desc: "Populate Fact & Dims" }
        ].map(s => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`p-3 rounded-lg border transition text-left ${
              currentStep === s.step
                ? 'bg-emerald-950/70 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`text-xs font-bold ${currentStep === s.step ? 'text-emerald-400' : 'text-slate-400'}`}>
              {s.label}
            </div>
            <div className="text-[10px] text-slate-500 truncate">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Stage Visual Card */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        {/* Step 1: Raw */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-sky-400">Step 1: Raw Transaction Ingestion (Staging Area)</span>
              <span className="text-xs bg-sky-950 text-sky-400 border border-sky-800 px-2.5 py-0.5 rounded-full">5 Raw Rows Ingested</span>
            </div>
            <p className="text-xs text-slate-400">
              Operational databases write transactional records continuously. Notice duplicate transaction IDs and null price values.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-left">
                    <th className="py-2">Raw ID</th>
                    <th className="py-2">User Handle</th>
                    <th className="py-2">City</th>
                    <th className="py-2">Item</th>
                    <th className="py-2">Price String</th>
                    <th className="py-2">Quality Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {RAW_STREAM.map((r, idx) => (
                    <tr key={idx} className={r.status !== 'VALID' ? 'bg-rose-950/20 text-rose-300' : 'text-slate-300'}>
                      <td className="py-2">{r.id}</td>
                      <td className="py-2">{r.raw_user}</td>
                      <td className="py-2">{r.raw_city}</td>
                      <td className="py-2">{r.item}</td>
                      <td className="py-2">{r.price}</td>
                      <td className="py-2">
                        {r.status === 'VALID' ? (
                          <span className="text-emerald-400 text-[10px]">OK</span>
                        ) : (
                          <span className="text-rose-400 text-[10px] font-bold">⚠️ {r.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 2: Cleaning */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-400">Step 2: Cleaning &amp; Deduplication Filtering</span>
              <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-0.5 rounded-full">2 Dirty Rows Discarded</span>
            </div>
            <p className="text-xs text-slate-400">
              Applying validation rules: <code>DROP IF id IS DUPLICATE</code> and <code>DROP IF price IS NULL</code>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-left">
                    <th className="py-2">ID</th>
                    <th className="py-2">User Handle</th>
                    <th className="py-2">City</th>
                    <th className="py-2">Item</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Action Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="text-slate-300">
                    <td className="py-2">101</td>
                    <td className="py-2">ALICE_M</td>
                    <td className="py-2">NYC</td>
                    <td className="py-2">Laptop Pro</td>
                    <td className="py-2">$1,200.00</td>
                    <td className="py-2 text-emerald-400">Passed Quality Check</td>
                  </tr>
                  <tr className="text-slate-300">
                    <td className="py-2">102</td>
                    <td className="py-2">BOB_J</td>
                    <td className="py-2">chicago</td>
                    <td className="py-2">Phone X</td>
                    <td className="py-2">$800.00</td>
                    <td className="py-2 text-emerald-400">Passed Quality Check</td>
                  </tr>
                  <tr className="bg-rose-950/40 text-rose-400 line-through">
                    <td className="py-2">101</td>
                    <td className="py-2">ALICE_M</td>
                    <td className="py-2">NYC</td>
                    <td className="py-2">Laptop Pro</td>
                    <td className="py-2">$1,200.00</td>
                    <td className="py-2 text-rose-400 font-bold no-underline">Dropped (Duplicate ID 101)</td>
                  </tr>
                  <tr className="bg-rose-950/40 text-rose-400 line-through">
                    <td className="py-2">103</td>
                    <td className="py-2">NULL</td>
                    <td className="py-2">Los Angeles</td>
                    <td className="py-2">Tablet Air</td>
                    <td className="py-2">NULL</td>
                    <td className="py-2 text-rose-400 font-bold no-underline">Dropped (Null Amount)</td>
                  </tr>
                  <tr className="text-slate-300">
                    <td className="py-2">104</td>
                    <td className="py-2">CHARLIE_K</td>
                    <td className="py-2">New York</td>
                    <td className="py-2">Keyboard RGB</td>
                    <td className="py-2">$150.00</td>
                    <td className="py-2 text-emerald-400">Passed Quality Check</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 3: Transformation */}
        {currentStep === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-400">Step 3: Standardization &amp; Business Transformation</span>
              <span className="text-xs bg-indigo-950 text-indigo-400 border border-indigo-800 px-2.5 py-0.5 rounded-full">Format Standardization</span>
            </div>
            <p className="text-xs text-slate-400">
              City names mapped to standard title-case ("NYC" -&gt; "New York", "chicago" -&gt; "Chicago"), string currencies converted to numeric decimals, and surrogate warehouse keys generated.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-left">
                    <th className="py-2">Customer Key</th>
                    <th className="py-2">Standard Name</th>
                    <th className="py-2">Normalized City</th>
                    <th className="py-2">Product Key</th>
                    <th className="py-2">Parsed Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2 text-sky-400">CUST_SK_01</td>
                    <td className="py-2">Alice M.</td>
                    <td className="py-2 text-emerald-400">New York</td>
                    <td className="py-2 text-sky-400">PROD_SK_501</td>
                    <td className="py-2 font-bold text-amber-300">1200.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-sky-400">CUST_SK_02</td>
                    <td className="py-2">Bob J.</td>
                    <td className="py-2 text-emerald-400">Chicago</td>
                    <td className="py-2 text-sky-400">PROD_SK_502</td>
                    <td className="py-2 font-bold text-amber-300">800.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-sky-400">CUST_SK_03</td>
                    <td className="py-2">Charlie K.</td>
                    <td className="py-2 text-emerald-400">New York</td>
                    <td className="py-2 text-sky-400">PROD_SK_503</td>
                    <td className="py-2 font-bold text-amber-300">150.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 4: Loading */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-400">Step 4: Star Schema Destination Loading</span>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">Loaded into Fact &amp; Dim Tables</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fact Table Card */}
              <div className="bg-slate-900 p-3.5 rounded-lg border border-indigo-800/60 space-y-2">
                <span className="text-xs font-bold text-indigo-300">Fact_Sales Table (Measures Loaded)</span>
                <table className="w-full text-[11px] font-mono">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 text-left">
                      <th>Sale ID</th>
                      <th>CUST_FK</th>
                      <th>PROD_FK</th>
                      <th>Revenue ($)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 divide-y divide-slate-800/40">
                    <tr><td>1</td><td>CUST_SK_01</td><td>PROD_SK_501</td><td className="text-emerald-400 font-bold">$1,200</td></tr>
                    <tr><td>2</td><td>CUST_SK_02</td><td>PROD_SK_502</td><td className="text-emerald-400 font-bold">$800</td></tr>
                    <tr><td>3</td><td>CUST_SK_03</td><td>PROD_SK_503</td><td className="text-emerald-400 font-bold">$150</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Dimension Table Card */}
              <div className="bg-slate-900 p-3.5 rounded-lg border border-sky-800/60 space-y-2">
                <span className="text-xs font-bold text-sky-300">Dim_Customers Table (Attributes Loaded)</span>
                <table className="w-full text-[11px] font-mono">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 text-left">
                      <th>CUST_PK</th>
                      <th>Customer Name</th>
                      <th>Assigned Region</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 divide-y divide-slate-800/40">
                    <tr><td>CUST_SK_01</td><td>Alice M.</td><td>East (NY)</td></tr>
                    <tr><td>CUST_SK_02</td><td>Bob J.</td><td>Midwest (IL)</td></tr>
                    <tr><td>CUST_SK_03</td><td>Charlie K.</td><td>East (NY)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Step Control Buttons */}
        <div className="pt-2 flex justify-between">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-xs font-semibold"
          >
            ← Previous Step
          </button>
          <button
            disabled={currentStep === 4}
            onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg text-xs font-semibold text-white"
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}
