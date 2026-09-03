import React, { useState } from 'react';

const SAMPLE_POINTS = [
  { student: "S1", studyHours: 2.5, score: 62, attendance: 75, grade: "C" },
  { student: "S2", studyHours: 5.1, score: 85, attendance: 90, grade: "A" },
  { student: "S3", studyHours: 3.2, score: 70, attendance: 80, grade: "B" },
  { student: "S4", studyHours: 8.5, score: 98, attendance: 95, grade: "A" },
  { student: "S5", studyHours: 1.5, score: 45, attendance: 60, grade: "F" },
  { student: "S6", studyHours: 6.0, score: 88, attendance: 88, grade: "A" },
  { student: "S7", studyHours: 4.0, score: 76, attendance: 82, grade: "B" },
  { student: "S8", studyHours: 2.0, score: 55, attendance: 65, grade: "D" }
];

export default function DataExploration() {
  const [chartType, setChartType] = useState('scatter'); // 'scatter' | 'bar' | 'boxplot'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-fuchsia-400 flex items-center gap-2">
            <span>📊</span> Exploratory Data Analysis (EDA)
          </h2>
          <p className="text-sm text-slate-400">
            Inspect distributions, outliers, and bivariate relationships using Scatter Plots, Bar Charts, and Box Plots
          </p>
        </div>

        {/* Chart Selector */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setChartType('scatter')}
            className={`px-3 py-1.5 rounded transition ${chartType === 'scatter' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Scatter Plot (Bivariate)
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded transition ${chartType === 'bar' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Bar Chart (Category Distribution)
          </button>
          <button
            onClick={() => setChartType('boxplot')}
            className={`px-3 py-1.5 rounded transition ${chartType === 'boxplot' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Box Plot (5-Number Summary)
          </button>
        </div>
      </div>

      {/* Main Visual Stage */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
        {chartType === 'scatter' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>X-Axis: Study Hours (0 - 10 hrs)</span>
              <span>Y-Axis: Exam Score (0 - 100%)</span>
            </div>

            <svg viewBox="0 0 600 300" className="w-full h-auto bg-slate-900/50 rounded-lg p-4">
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="50" y2="250" stroke="#334155" strokeWidth="1.5" />
              <line x1="50" y1="250" x2="560" y2="250" stroke="#334155" strokeWidth="1.5" />

              {/* Y Axis ticks */}
              {[0, 25, 50, 75, 100].map((tick, i) => (
                <g key={tick} transform={`translate(20, ${250 - (tick * 2.2)})`}>
                  <text x="25" y="4" fill="#94a3b8" fontSize="10" textAnchor="end">{tick}</text>
                  <line x1="28" y1="0" x2="560" y2="0" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                </g>
              ))}

              {/* Data Points */}
              {SAMPLE_POINTS.map((pt, idx) => {
                const cx = 50 + (pt.studyHours * 50);
                const cy = 250 - (pt.score * 2.2);
                return (
                  <g key={idx} className="cursor-pointer group">
                    <circle cx={cx} cy={cy} r="6" fill="#d946ef" stroke="#ffffff" strokeWidth="1.5" className="transition group-hover:r-8" />
                    <text x={cx + 8} y={cy - 6} fill="#f5d0fe" fontSize="9" className="font-mono">{pt.student} ({pt.score}%)</text>
                  </g>
                );
              })}
            </svg>
            <p className="text-xs text-slate-400 text-center">
              Positive linear correlation detected: higher study hours correlate directly with higher exam scores.
            </p>
          </div>
        )}

        {chartType === 'bar' && (
          <div className="space-y-4">
            <span className="text-xs text-slate-400">Student Count by Grade Category</span>
            <div className="grid grid-cols-5 gap-3 pt-4 items-end h-64 border-b border-slate-800 pb-2">
              {[
                { grade: 'Grade A', count: 3, height: '75%', color: 'bg-emerald-500' },
                { grade: 'Grade B', count: 2, height: '50%', color: 'bg-sky-500' },
                { grade: 'Grade C', count: 1, height: '25%', color: 'bg-amber-500' },
                { grade: 'Grade D', count: 1, height: '25%', color: 'bg-orange-500' },
                { grade: 'Grade F', count: 1, height: '25%', color: 'bg-rose-500' }
              ].map(b => (
                <div key={b.grade} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-mono font-bold text-slate-300">{b.count} students</span>
                  <div className={`w-full rounded-t-md ${b.color} transition-all duration-500`} style={{ height: b.height }} />
                  <span className="text-xs font-semibold text-slate-400">{b.grade}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartType === 'boxplot' && (
          <div className="space-y-6">
            <span className="text-xs text-slate-400">Exam Score Five-Number Summary Distribution</span>
            <svg viewBox="0 0 600 160" className="w-full h-auto bg-slate-900/50 rounded-lg p-4">
              {/* Horizontal line for range (Min: 45 to Max: 98) */}
              <line x1="140" y1="80" x2="480" y2="80" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Min Whisker (45) */}
              <line x1="140" y1="60" x2="140" y2="100" stroke="#f43f5e" strokeWidth="3" />
              <text x="140" y="120" textAnchor="middle" fill="#f43f5e" fontSize="10">Min: 45</text>

              {/* IQR Box (Q1: 62 to Q3: 88) */}
              <rect x="220" y="45" width="180" height="70" rx="4" fill="#3b0764" stroke="#c026d3" strokeWidth="2" />
              <text x="220" y="35" textAnchor="middle" fill="#e879f9" fontSize="10">Q1: 62</text>
              <text x="400" y="35" textAnchor="middle" fill="#e879f9" fontSize="10">Q3: 88</text>

              {/* Median Line (76) */}
              <line x1="310" y1="45" x2="310" y2="115" stroke="#facc15" strokeWidth="3" />
              <text x="310" y="135" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">Median: 76</text>

              {/* Max Whisker (98) */}
              <line x1="480" y1="60" x2="480" y2="100" stroke="#10b981" strokeWidth="3" />
              <text x="480" y="120" textAnchor="middle" fill="#10b981" fontSize="10">Max: 98</text>
            </svg>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono text-center">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">Interquartile Range (IQR): <strong>26</strong></div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">Outliers: <strong>None detected</strong></div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">Mean Score: <strong>72.4</strong></div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">Sample Size (N): <strong>8</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
