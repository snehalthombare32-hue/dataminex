import React, { useState } from 'react';

// Pure Deterministic Free Calculation Functions
function solveKMeans(points, k = 3) {
  let centroids = points.slice(0, k).map(p => ({ x: p.x, y: p.y }));
  let clusters = Array.from({ length: k }, () => []);

  points.forEach((pt, idx) => {
    let minDist = Infinity;
    let best = 0;
    centroids.forEach((c, cIdx) => {
      const d = Math.hypot(pt.x - c.x, pt.y - c.y);
      if (d < minDist) {
        minDist = d;
        best = cIdx;
      }
    });
    clusters[best].push({ ...pt, index: idx });
  });

  return { centroids, clusters };
}

function solveIQR(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  const q1 = sorted[Math.floor(mid / 2)];
  const q3 = sorted[mid + Math.floor(mid / 2)];
  const iqrVal = q3 - q1;
  const lowerFence = q1 - 1.5 * iqrVal;
  const upperFence = q3 + 1.5 * iqrVal;
  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

  return { sorted, q1, q3, iqr: iqrVal, lowerFence, upperFence, outliers };
}

export default function NumericalSolver() {
  const [algo, setAlgo] = useState('kmeans');
  const [pointsInput, setPointsInput] = useState("P1: 2, 10\nP2: 2, 5\nP3: 8, 4\nP4: 5, 8\nP5: 7, 5\nP6: 6, 4");
  const [numbersInput, setNumbersInput] = useState("12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65");
  const [result, setResult] = useState(null);

  const handleSolve = () => {
    if (algo === 'kmeans') {
      const pts = pointsInput.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(':');
        const id = parts[0].trim();
        const coords = (parts[1] || '').split(',').map(n => parseFloat(n.trim()));
        return { id, x: coords[0] || 0, y: coords[1] || 0 };
      });
      setResult(solveKMeans(pts, 2));
    } else if (algo === 'iqr') {
      const nums = numbersInput.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
      setResult(solveIQR(nums));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <span>🧮</span> Local Numerical Solver
          </h2>
          <p className="text-sm text-slate-400">
            Deterministic mathematical calculations running 100% locally with zero paid APIs
          </p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button onClick={() => { setAlgo('kmeans'); setResult(null); }} className={`px-4 py-1.5 rounded transition ${algo === 'kmeans' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>K-Means</button>
          <button onClick={() => { setAlgo('iqr'); setResult(null); }} className={`px-4 py-1.5 rounded transition ${algo === 'iqr' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>IQR Outliers</button>
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        {algo === 'kmeans' ? (
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">2D Coordinate Points (Name: X, Y)</label>
            <textarea value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} rows={6} className="w-full bg-slate-900 border border-slate-700 p-3 rounded font-mono text-xs text-amber-300" />
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">Numerical Sequence (Comma Separated)</label>
            <input type="text" value={numbersInput} onChange={(e) => setNumbersInput(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded font-mono text-xs text-amber-300" />
          </div>
        )}

        <button onClick={handleSolve} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition">
          ⚡ Solve Step-by-Step Locally
        </button>

        {result && (
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs space-y-2 mt-4">
            <h4 className="text-emerald-400 font-bold">✓ Deterministic Local Calculation Output:</h4>
            {algo === 'kmeans' ? (
              <div>
                <p className="text-sky-300">Centroids: {result.centroids.map((c, i) => `C${i+1}(${c.x}, ${c.y})`).join(', ')}</p>
                {result.clusters.map((c, i) => (
                  <p key={i} className="text-slate-300">Cluster {i+1}: {c.map(p => p.id).join(', ')}</p>
                ))}
              </div>
            ) : (
              <div>
                <p>Q1: {result.q1} | Q3: {result.q3} | IQR: {result.iqr}</p>
                <p className="text-sky-300">Lower Fence: {result.lowerFence} | Upper Fence: {result.upperFence}</p>
                <p className="text-rose-400 font-bold">Outliers: {result.outliers.length > 0 ? result.outliers.join(', ') : 'None'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
