import React, { useState } from 'react';

// Sample 2D Coordinates for Clustering
const DATA_POINTS = [
  { id: "P1", x: 20, y: 30, cluster: 0 },
  { id: "P2", x: 25, y: 35, cluster: 0 },
  { id: "P3", x: 22, y: 28, cluster: 0 },
  { id: "P4", x: 70, y: 80, cluster: 1 },
  { id: "P5", x: 75, y: 85, cluster: 1 },
  { id: "P6", x: 68, y: 78, cluster: 1 },
  { id: "P7", x: 80, y: 25, cluster: 2 },
  { id: "P8", x: 85, y: 30, cluster: 2 },
  { id: "P9", x: 82, y: 20, cluster: 2 }
];

export default function Clustering() {
  const [algo, setAlgo] = useState('kmeans'); // 'kmeans' | 'hierarchical'
  const [kValue, setKValue] = useState(3);
  const [iteration, setIteration] = useState(1);

  const clusterColors = ['#f43f5e', '#10b981', '#38bdf8', '#fbbf24'];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-pink-400 flex items-center gap-2">
            <span>🔍</span> Unsupervised Clustering Visualizer
          </h2>
          <p className="text-sm text-slate-400">
            Partition coordinate datasets using K-Means and Hierarchical Agglomerative Dendrograms
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setAlgo('kmeans')}
            className={`px-4 py-1.5 rounded transition ${algo === 'kmeans' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            K-Means (Centroid-Based)
          </button>
          <button
            onClick={() => setAlgo('hierarchical')}
            className={`px-4 py-1.5 rounded transition ${algo === 'hierarchical' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Hierarchical (Dendrogram)
          </button>
        </div>
      </div>

      {/* Main Canvas View */}
      {algo === 'kmeans' ? (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-semibold">Clusters (K):</span>
              {[2, 3].map(k => (
                <button
                  key={k}
                  onClick={() => { setKValue(k); setIteration(1); }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${kValue === k ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  K = {k}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Iteration: <strong>{iteration}</strong></span>
              <button
                onClick={() => setIteration(prev => Math.min(prev + 1, 4))}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-pink-300 rounded text-xs font-bold"
              >
                Next Iteration &rarr;
              </button>
            </div>
          </div>

          <svg viewBox="0 0 600 300" className="w-full h-auto bg-slate-900/40 rounded-lg p-4">
            {/* Axis */}
            <line x1="40" y1="20" x2="40" y2="260" stroke="#334155" strokeWidth="1.5" />
            <line x1="40" y1="260" x2="560" y2="260" stroke="#334155" strokeWidth="1.5" />

            {/* Centroids */}
            {kValue >= 2 && (
              <g transform="translate(150, 190)">
                <polygon points="0,-8 7,6 -7,6" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                <text x="12" y="4" fill="#f43f5e" fontSize="9" fontWeight="bold">Centroid 1</text>
              </g>
            )}
            {kValue >= 2 && (
              <g transform="translate(420, 60)">
                <polygon points="0,-8 7,6 -7,6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                <text x="12" y="4" fill="#10b981" fontSize="9" fontWeight="bold">Centroid 2</text>
              </g>
            )}
            {kValue >= 3 && (
              <g transform="translate(450, 200)">
                <polygon points="0,-8 7,6 -7,6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                <text x="12" y="4" fill="#38bdf8" fontSize="9" fontWeight="bold">Centroid 3</text>
              </g>
            )}

            {/* Data Points */}
            {DATA_POINTS.map((pt, idx) => {
              const cx = 40 + (pt.x * 5);
              const cy = 260 - (pt.y * 2.5);
              const cIdx = kValue === 2 && pt.cluster === 2 ? 1 : pt.cluster;
              const col = clusterColors[cIdx];
              return (
                <g key={idx}>
                  <circle cx={cx} cy={cy} r="6" fill={col} stroke="#ffffff" strokeWidth="1" />
                  <text x={cx + 8} y={cy + 3} fill="#cbd5e1" fontSize="9" className="font-mono">{pt.id}</text>
                </g>
              );
            })}
          </svg>
          <div className="flex justify-around text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Cluster 1: Low X, Low Y</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Cluster 2: High X, High Y</span>
            {kValue === 3 && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Cluster 3: High X, Low Y</span>}
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">
            Hierarchical Agglomerative Tree (Dendrogram)
          </span>

          <svg viewBox="0 0 600 240" className="w-full h-auto bg-slate-900/40 rounded-lg p-4">
            {/* Base Leaves */}
            {["P1", "P2", "P3", "P4", "P5", "P6"].map((p, i) => (
              <text key={p} x={80 + (i * 80)} y="220" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
                {p}
              </text>
            ))}

            {/* Level 1 merges */}
            {/* P1 & P2 */}
            <path d="M 80 205 L 80 160 L 160 160 L 160 205" fill="none" stroke="#f43f5e" strokeWidth="2" />
            {/* P4 & P5 */}
            <path d="M 320 205 L 320 160 L 400 160 L 400 205" fill="none" stroke="#10b981" strokeWidth="2" />

            {/* Level 2 merges */}
            {/* (P1, P2) & P3 */}
            <path d="M 120 160 L 120 110 L 240 110 L 240 205" fill="none" stroke="#f43f5e" strokeWidth="2" />
            {/* (P4, P5) & P6 */}
            <path d="M 360 160 L 360 110 L 480 110 L 480 205" fill="none" stroke="#10b981" strokeWidth="2" />

            {/* Top root merge */}
            <path d="M 180 110 L 180 50 L 420 50 L 420 110" fill="none" stroke="#c084fc" strokeWidth="2" />

            {/* Distance Cut Threshold Line */}
            <line x1="40" y1="85" x2="540" y2="85" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4" />
            <text x="545" y="88" fill="#facc15" fontSize="10">Cut Distance &rarr; 2 Clusters Formed</text>
          </svg>
        </div>
      )}
    </div>
  );
}
