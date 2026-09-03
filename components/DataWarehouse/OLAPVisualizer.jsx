import React, { useState, useMemo } from 'react';

// Multidimensional Cube Data: [Quarter, City, Product, Sales]
const BASE_SALES_CUBE = [
  { quarter: "Q1", year: "2026", city: "New York", country: "USA", product: "Laptops", category: "Computers", sales: 120 },
  { quarter: "Q1", year: "2026", city: "New York", country: "USA", product: "Phones", category: "Electronics", sales: 90 },
  { quarter: "Q1", year: "2026", city: "Chicago", country: "USA", product: "Laptops", category: "Computers", sales: 80 },
  { quarter: "Q1", year: "2026", city: "Chicago", country: "USA", product: "Phones", category: "Electronics", sales: 110 },
  { quarter: "Q2", year: "2026", city: "New York", country: "USA", product: "Laptops", category: "Computers", sales: 140 },
  { quarter: "Q2", year: "2026", city: "New York", country: "USA", product: "Phones", category: "Electronics", sales: 95 },
  { quarter: "Q2", year: "2026", city: "Chicago", country: "USA", product: "Laptops", category: "Computers", sales: 85 },
  { quarter: "Q2", year: "2026", city: "Chicago", country: "USA", product: "Phones", category: "Electronics", sales: 115 }
];

export default function OLAPVisualizer() {
  const [operation, setOperation] = useState('none'); // 'none' | 'rollup' | 'drilldown' | 'slice' | 'dice' | 'pivot'
  const [sliceQuarter, setSliceQuarter] = useState('Q1');
  const [pivotAxis, setPivotAxis] = useState('city_product'); // 'city_product' | 'product_city'

  // Compute aggregated or filtered data based on active OLAP operation
  const transformedData = useMemo(() => {
    switch (operation) {
      case 'rollup':
        // Roll-up City -> Country level
        return [
          { dimension: "USA - Computers (Laptops)", sales: 425 },
          { dimension: "USA - Electronics (Phones)", sales: 410 }
        ];
      case 'drilldown':
        // Drill-down Quarter -> Months breakdown (simulated)
        return [
          { dimension: "Jan (NY Laptops)", sales: 40 },
          { dimension: "Feb (NY Laptops)", sales: 38 },
          { dimension: "Mar (NY Laptops)", sales: 42 },
          { dimension: "Jan (Chicago Phones)", sales: 35 },
          { dimension: "Feb (Chicago Phones)", sales: 38 },
          { dimension: "Mar (Chicago Phones)", sales: 37 }
        ];
      case 'slice':
        // Slice by Quarter = Q1
        return BASE_SALES_CUBE.filter(r => r.quarter === sliceQuarter).map(r => ({
          dimension: `${r.city} - ${r.product}`,
          sales: r.sales,
          quarter: r.quarter
        }));
      case 'dice':
        // Dice: New York ONLY & Laptops ONLY across Q1 & Q2
        return BASE_SALES_CUBE.filter(r => r.city === "New York" && r.product === "Laptops").map(r => ({
          dimension: `${r.quarter} - ${r.city} (${r.product})`,
          sales: r.sales
        }));
      case 'pivot':
        // Swapped Row/Column perspective
        return BASE_SALES_CUBE.map(r => ({
          dimension: pivotAxis === 'city_product' ? `${r.product} in ${r.city} (${r.quarter})` : `${r.city} : ${r.product} (${r.quarter})`,
          sales: r.sales
        }));
      default:
        return BASE_SALES_CUBE.map(r => ({
          dimension: `${r.quarter} | ${r.city} | ${r.product}`,
          sales: r.sales
        }));
    }
  }, [operation, sliceQuarter, pivotAxis]);

  const maxSales = Math.max(...transformedData.map(d => d.sales), 150);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>🔄</span> OLAP Operations Visualizer
        </h2>
        <p className="text-sm text-slate-400">
          Interactively execute Roll-up, Drill-down, Slice, Dice, and Pivot operations on a 3D Multidimensional Data Cube
        </p>
      </div>

      {/* Operation Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <button
          onClick={() => setOperation('none')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
            operation === 'none' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Cube Default (3D)
        </button>

        <button
          onClick={() => setOperation('rollup')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
            operation === 'rollup' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          ⬆️ Roll-up (Aggregate)
        </button>

        <button
          onClick={() => setOperation('drilldown')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
            operation === 'drilldown' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          ⬇️ Drill-down (Detailed)
        </button>

        <button
          onClick={() => setOperation('slice')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
            operation === 'slice' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🔪 Slice (Single 2D)
        </button>

        <button
          onClick={() => setOperation('dice')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
            operation === 'dice' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🎲 Dice (Sub-Cube)
        </button>

        <button
          onClick={() => setOperation('pivot')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
            operation === 'pivot' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🔃 Pivot (Rotate)
        </button>
      </div>

      {/* Operation Explanation Banner */}
      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div>
          <span className="font-bold text-amber-400 uppercase tracking-wider mr-2">Operation Explanation:</span>
          {operation === 'none' && "Base cube indexed by Time (Q1, Q2), Location (NY, Chicago), and Product (Laptops, Phones)."}
          {operation === 'rollup' && "Climbed up hierarchy: Aggregated City (New York, Chicago) up to Country level (USA)."}
          {operation === 'drilldown' && "Stepped down hierarchy: Expanded Quarterly aggregates into granular monthly sales."}
          {operation === 'slice' && `Locked one dimension: Filtered specifically for Quarter = ${sliceQuarter}.`}
          {operation === 'dice' && "Extracted a sub-cube: Filtered across multiple dimensions (City = 'New York' AND Product = 'Laptops')."}
          {operation === 'pivot' && "Rotated coordinate axes: Swapped row and column dimensions to provide a new view."}
        </div>

        {operation === 'slice' && (
          <select
            value={sliceQuarter}
            onChange={(e) => setSliceQuarter(e.target.value)}
            className="bg-slate-800 text-amber-300 px-2 py-1 rounded text-xs border border-slate-700 ml-3"
          >
            <option value="Q1">Slice: Q1</option>
            <option value="Q2">Slice: Q2</option>
          </select>
        )}
      </div>

      {/* Visual Chart + Table View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Bar Chart Visualizer */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">Visual Metrics Graph (Bar Chart)</h3>
          <div className="space-y-2 pt-2">
            {transformedData.map((item, idx) => {
              const widthPct = Math.round((item.sales / maxSales) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="truncate max-w-xs">{item.dimension}</span>
                    <span className="font-mono text-amber-400 font-bold">${item.sales}k</span>
                  </div>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-500 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabular Output */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">OLAP Analytical Query Results (Table)</h3>
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2">#</th>
                <th className="pb-2">Dimension Key</th>
                <th className="pb-2 text-right">Aggregated Sales ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transformedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="py-2 text-slate-500">{idx + 1}</td>
                  <td className="py-2 text-indigo-300">{row.dimension}</td>
                  <td className="py-2 text-right text-emerald-400 font-bold">${row.sales},000</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
