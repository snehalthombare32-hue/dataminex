import React, { useState } from 'react';

const RAW_DATASET = [
  { id: 1, age: 25, income: 45000, creditScore: null, purchased: "No" },
  { id: 2, age: 48, income: 82000, creditScore: 720, purchased: "Yes" },
  { id: 3, age: 32, income: null, creditScore: 680, purchased: "No" },
  { id: 4, age: 25, income: 45000, creditScore: null, purchased: "No" }, // Duplicate of 1
  { id: 5, age: 55, income: 110000, creditScore: 790, purchased: "Yes" }
];

export default function DataPreprocessing() {
  const [activeStep, setActiveStep] = useState('cleaning'); // 'cleaning' | 'transformation' | 'reduction'
  const [imputeStrategy, setImputeStrategy] = useState('mean'); // 'mean' | 'drop'
  const [normalizeMethod, setNormalizeMethod] = useState('minmax'); // 'minmax' | 'zscore'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-400 flex items-center gap-2">
            <span>🧹</span> Data Preprocessing Sandbox
          </h2>
          <p className="text-sm text-slate-400">
            Interactive demonstration of Data Cleaning, Transformation (Normalization), and Reduction
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveStep('cleaning')}
            className={`px-3 py-1.5 rounded transition ${activeStep === 'cleaning' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            1. Cleaning
          </button>
          <button
            onClick={() => setActiveStep('transformation')}
            className={`px-3 py-1.5 rounded transition ${activeStep === 'transformation' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            2. Transformation
          </button>
          <button
            onClick={() => setActiveStep('reduction')}
            className={`px-3 py-1.5 rounded transition ${activeStep === 'reduction' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            3. Reduction
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        {/* Step 1: Cleaning */}
        {activeStep === 'cleaning' && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="text-sm font-semibold text-teal-300">Handle Missing Values &amp; Duplicate Records</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Null Strategy:</span>
                <select
                  value={imputeStrategy}
                  onChange={(e) => setImputeStrategy(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-teal-300 px-2 py-1 rounded"
                >
                  <option value="mean">Impute with Mean (Avg)</option>
                  <option value="drop">Drop Incomplete Rows</option>
                </select>
              </div>
            </div>

            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2">ID</th>
                  <th className="py-2">Age</th>
                  <th className="py-2">Income ($)</th>
                  <th className="py-2">Credit Score</th>
                  <th className="py-2">Purchased</th>
                  <th className="py-2">Cleaning Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-2">1</td>
                  <td className="py-2">25</td>
                  <td className="py-2">45,000</td>
                  <td className="py-2 text-teal-400 font-bold">{imputeStrategy === 'mean' ? '730 (Imputed Mean)' : 'null'}</td>
                  <td className="py-2">No</td>
                  <td className="py-2 text-emerald-400">Cleaned</td>
                </tr>
                <tr>
                  <td className="py-2">2</td>
                  <td className="py-2">48</td>
                  <td className="py-2">82,000</td>
                  <td className="py-2">720</td>
                  <td className="py-2">Yes</td>
                  <td className="py-2 text-emerald-400">Valid</td>
                </tr>
                <tr className={imputeStrategy === 'drop' ? 'line-through text-rose-400 bg-rose-950/20' : ''}>
                  <td className="py-2">3</td>
                  <td className="py-2">32</td>
                  <td className="py-2 text-teal-400 font-bold">{imputeStrategy === 'mean' ? '79,000 (Imputed Mean)' : 'null'}</td>
                  <td className="py-2">680</td>
                  <td className="py-2">No</td>
                  <td className="py-2">{imputeStrategy === 'mean' ? <span className="text-emerald-400">Imputed</span> : <span className="text-rose-400 font-bold">Dropped</span>}</td>
                </tr>
                <tr className="line-through text-rose-400 bg-rose-950/30">
                  <td className="py-2">4</td>
                  <td className="py-2">25</td>
                  <td className="py-2">45,000</td>
                  <td className="py-2">null</td>
                  <td className="py-2">No</td>
                  <td className="py-2 text-rose-400 font-bold no-underline">Dropped (Duplicate of ID 1)</td>
                </tr>
                <tr>
                  <td className="py-2">5</td>
                  <td className="py-2">55</td>
                  <td className="py-2">110,000</td>
                  <td className="py-2">790</td>
                  <td className="py-2">Yes</td>
                  <td className="py-2 text-emerald-400">Valid</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Step 2: Transformation */}
        {activeStep === 'transformation' && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="text-sm font-semibold text-teal-300">Feature Scaling &amp; Normalization</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Scaling Technique:</span>
                <select
                  value={normalizeMethod}
                  onChange={(e) => setNormalizeMethod(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-teal-300 px-2 py-1 rounded"
                >
                  <option value="minmax">Min-Max Normalization (0 to 1)</option>
                  <option value="zscore">Z-Score Standardization (Mean=0, Std=1)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300">
              {normalizeMethod === 'minmax' ? (
                <span>Formula: <code>x_norm = (x - min) / (max - min)</code> &rarr; Scales feature values between 0.00 and 1.00</span>
              ) : (
                <span>Formula: <code>x_std = (x - mean) / std_dev</code> &rarr; Centers features around 0 with unit variance</span>
              )}
            </div>

            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2">ID</th>
                  <th className="py-2">Raw Income ($)</th>
                  <th className="py-2 text-teal-400">Normalized Income ({normalizeMethod === 'minmax' ? '[0, 1]' : 'Z-Score'})</th>
                  <th className="py-2">Raw Age</th>
                  <th className="py-2 text-teal-400">Normalized Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2">1</td>
                  <td className="py-2">45,000</td>
                  <td className="py-2 text-teal-300 font-bold">{normalizeMethod === 'minmax' ? '0.000' : '-1.340'}</td>
                  <td className="py-2">25</td>
                  <td className="py-2 text-teal-300 font-bold">{normalizeMethod === 'minmax' ? '0.000' : '-1.180'}</td>
                </tr>
                <tr>
                  <td className="py-2">2</td>
                  <td className="py-2">82,000</td>
                  <td className="py-2 text-teal-300 font-bold">{normalizeMethod === 'minmax' ? '0.569' : '+0.120'}</td>
                  <td className="py-2">48</td>
                  <td className="py-2 text-teal-300 font-bold">{normalizeMethod === 'minmax' ? '0.766' : '+0.650'}</td>
                </tr>
                <tr>
                  <td className="py-2">5</td>
                  <td className="py-2">110,000</td>
                  <td className="py-2 text-teal-300 font-bold">{normalizeMethod === 'minmax' ? '1.000' : '+1.220'}</td>
                  <td className="py-2">55</td>
                  <td className="py-2 text-teal-300 font-bold">{normalizeMethod === 'minmax' ? '1.000' : '+1.120'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Step 3: Reduction */}
        {activeStep === 'reduction' && (
          <div className="space-y-4">
            <span className="text-sm font-semibold text-teal-300">Dimensionality &amp; Volume Reduction (Feature Selection &amp; PCA)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-teal-400">1. Feature Selection (Attribute Subset)</span>
                <p className="text-slate-400">
                  Removes redundant or irrelevant features that do not contribute to prediction. E.g., dropping <code>customer_ip_address</code> or <code>random_session_id</code> while keeping core attributes.
                </p>
                <div className="text-emerald-400 font-mono">Original: 12 Columns &rarr; Reduced: 4 Key Features</div>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-teal-400">2. Principal Component Analysis (PCA)</span>
                <p className="text-slate-400">
                  Linear projection method that transforms high-dimensional correlated features into orthogonal principal components (PC1, PC2) preserving 95%+ variance.
                </p>
                <div className="text-emerald-400 font-mono">Original: 100 dimensions &rarr; 2 Principal Components</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
