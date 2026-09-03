import React, { useState, useMemo } from 'react';

const TRANSACTIONS = [
  { id: "T1", items: ["Milk", "Bread", "Eggs"] },
  { id: "T2", items: ["Bread", "Butter"] },
  { id: "T3", items: ["Milk", "Bread", "Butter"] },
  { id: "T4", items: ["Milk", "Eggs"] },
  { id: "T5", items: ["Bread", "Butter"] }
];

export default function AssociationRules() {
  const [minSupport, setMinSupport] = useState(40); // %
  const [minConfidence, setMinConfidence] = useState(60); // %

  // Calculate mined rules based on minSupport and minConfidence
  const rules = useMemo(() => {
    // Total transactions = 5
    // Support {Bread} = 4/5 = 80%
    // Support {Butter} = 3/5 = 60%
    // Support {Milk} = 3/5 = 60%
    // Support {Bread, Butter} = 3/5 = 60%
    // Support {Bread, Milk} = 2/5 = 40%
    // Support {Milk, Eggs} = 2/5 = 40%
    const candidateRules = [
      { rule: "Butter ➔ Bread", support: 60, confidence: 100, lift: 1.25 },
      { rule: "Bread ➔ Butter", support: 60, confidence: 75, lift: 1.25 },
      { rule: "Eggs ➔ Milk", support: 40, confidence: 100, lift: 1.67 },
      { rule: "Milk ➔ Bread", support: 40, confidence: 66.7, lift: 0.83 }
    ];

    return candidateRules.filter(r => r.support >= minSupport && r.confidence >= minConfidence);
  }, [minSupport, minConfidence]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>🛒</span> Apriori Market Basket Miner
        </h2>
        <p className="text-sm text-slate-400">
          Discover frequent itemsets and strong association rules with interactive Support and Confidence thresholds
        </p>
      </div>

      {/* Threshold Sliders */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Minimum Support Threshold (min_sup)</span>
            <span className="text-amber-400 font-mono font-bold">{minSupport}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            step="5"
            value={minSupport}
            onChange={(e) => setMinSupport(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <p className="text-[10px] text-slate-500">Filters itemsets appearing in at least {minSupport}% of all baskets.</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Minimum Confidence Threshold (min_conf)</span>
            <span className="text-emerald-400 font-mono font-bold">{minConfidence}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <p className="text-[10px] text-slate-500">Requires that condition A implies B with at least {minConfidence}% certainty.</p>
        </div>
      </div>

      {/* Transactions & Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Baskets */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Baskets (D)</h3>
          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} className="py-2 flex justify-between items-center">
                <span className="text-amber-400 font-bold">{tx.id}</span>
                <span className="text-slate-300">{tx.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mined Association Rules */}
        <div className="lg:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mined Strong Rules</h3>
            <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-0.5 rounded-full font-mono">
              {rules.length} Rule(s) Found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2">Association Rule (A &rarr; B)</th>
                  <th className="py-2">Support</th>
                  <th className="py-2">Confidence</th>
                  <th className="py-2">Lift Ratio</th>
                  <th className="py-2">Correlation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rules.length > 0 ? (
                  rules.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60">
                      <td className="py-2.5 text-amber-300 font-bold">{r.rule}</td>
                      <td className="py-2.5 text-slate-300">{r.support}%</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{r.confidence}%</td>
                      <td className="py-2.5 text-sky-400">{r.lift}</td>
                      <td className="py-2.5">
                        {r.lift > 1 ? (
                          <span className="text-emerald-400 text-[10px] bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">Positive</span>
                        ) : (
                          <span className="text-amber-400 text-[10px] bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">Neutral</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No association rules met the current Support and Confidence thresholds. Lower the sliders to mine more rules.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
