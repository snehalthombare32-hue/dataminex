import React, { useState } from 'react';

// Canonical Tennis Dataset for Decision Tree & Naive Bayes
const TRAINING_DATA = [
  { outlook: "Sunny", temperature: "Hot", humidity: "High", wind: "Weak", play: "No" },
  { outlook: "Sunny", temperature: "Hot", humidity: "High", wind: "Strong", play: "No" },
  { outlook: "Overcast", temperature: "Hot", humidity: "High", wind: "Weak", play: "Yes" },
  { outlook: "Rain", temperature: "Mild", humidity: "High", wind: "Weak", play: "Yes" },
  { outlook: "Rain", temperature: "Cool", humidity: "Normal", wind: "Weak", play: "Yes" },
  { outlook: "Rain", temperature: "Cool", humidity: "Normal", wind: "Strong", play: "No" },
  { outlook: "Overcast", temperature: "Cool", humidity: "Normal", wind: "Strong", play: "Yes" },
  { outlook: "Sunny", temperature: "Mild", humidity: "High", wind: "Weak", play: "No" },
  { outlook: "Sunny", temperature: "Cool", humidity: "Normal", wind: "Weak", play: "Yes" },
  { outlook: "Rain", temperature: "Mild", humidity: "Normal", wind: "Weak", play: "Yes" }
];

export default function Classification() {
  const [modelType, setModelType] = useState('tree'); // 'tree' | 'bayes'
  
  // Test Input State
  const [testOutlook, setTestOutlook] = useState('Sunny');
  const [testHumidity, setTestHumidity] = useState('Normal');
  const [testWind, setTestWind] = useState('Strong');

  // Decision Tree Prediction Logic
  // Root: Outlook
  // If Overcast -> Yes
  // If Sunny -> Humidity: High -> No, Normal -> Yes
  // If Rain -> Wind: Strong -> No, Weak -> Yes
  let treePrediction = "Yes";
  if (testOutlook === "Overcast") {
    treePrediction = "Yes (100% confidence)";
  } else if (testOutlook === "Sunny") {
    treePrediction = testHumidity === "High" ? "No (Confidence: 100%)" : "Yes (Confidence: 100%)";
  } else if (testOutlook === "Rain") {
    treePrediction = testWind === "Strong" ? "No (Confidence: 100%)" : "Yes (Confidence: 100%)";
  }

  // Naive Bayes Probabilistic Calculation
  // Prior: P(Yes) = 6/10 = 0.6, P(No) = 4/10 = 0.4
  const pYes = 0.6;
  const pNo = 0.4;
  const pOutlookSunnyGivenYes = 1 / 6;
  const pOutlookSunnyGivenNo = 3 / 4;
  const pHumidityNormGivenYes = 4 / 6;
  const pHumidityNormGivenNo = 1 / 4;
  const pWindStrongGivenYes = 1 / 6;
  const pWindStrongGivenNo = 2 / 4;

  const scoreYes = (pYes * (testOutlook === 'Sunny' ? pOutlookSunnyGivenYes : 0.4) * (testHumidity === 'Normal' ? pHumidityNormGivenYes : 0.3) * (testWind === 'Strong' ? pWindStrongGivenYes : 0.6)).toFixed(4);
  const scoreNo = (pNo * (testOutlook === 'Sunny' ? pOutlookSunnyGivenNo : 0.25) * (testHumidity === 'Normal' ? pHumidityNormGivenNo : 0.75) * (testWind === 'Strong' ? pWindStrongGivenNo : 0.5)).toFixed(4);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-violet-400 flex items-center gap-2">
            <span>🌲</span> Supervised Classification Visualizer
          </h2>
          <p className="text-sm text-slate-400">
            Compare Decision Tree Rule Induction vs. Naive Bayes Probabilistic Classification
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setModelType('tree')}
            className={`px-4 py-1.5 rounded transition ${modelType === 'tree' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Decision Tree
          </button>
          <button
            onClick={() => setModelType('bayes')}
            className={`px-4 py-1.5 rounded transition ${modelType === 'bayes' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Naive Bayes
          </button>
        </div>
      </div>

      {/* Input Test Form & Prediction */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Outlook</label>
          <select
            value={testOutlook}
            onChange={(e) => setTestOutlook(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg"
          >
            <option value="Sunny">Sunny</option>
            <option value="Overcast">Overcast</option>
            <option value="Rain">Rain</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Humidity</label>
          <select
            value={testHumidity}
            onChange={(e) => setTestHumidity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg"
          >
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Wind Speed</label>
          <select
            value={testWind}
            onChange={(e) => setTestWind(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg"
          >
            <option value="Weak">Weak</option>
            <option value="Strong">Strong</option>
          </select>
        </div>

        {/* Prediction Card */}
        <div className="p-3 bg-violet-950/40 rounded-lg border border-violet-800 text-center">
          <span className="text-[10px] uppercase tracking-wider text-violet-300 font-bold block">Model Prediction</span>
          <span className="text-lg font-mono font-bold text-emerald-400 block mt-0.5">
            Play Tennis: {modelType === 'tree' ? treePrediction : (parseFloat(scoreYes) > parseFloat(scoreNo) ? 'Yes' : 'No')}
          </span>
        </div>
      </div>

      {/* Model Visual Stage */}
      {modelType === 'tree' ? (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
            Decision Tree Hierarchy (Trained on Information Gain / Entropy)
          </span>

          <svg viewBox="0 0 680 260" className="w-full h-auto">
            {/* Root Node: Outlook */}
            <g transform="translate(280, 20)">
              <rect width="120" height="40" rx="8" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="2" />
              <text x="60" y="24" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">Root: Outlook?</text>
            </g>

            {/* Branch 1: Sunny */}
            <line x1="300" y1="60" x2="130" y2="120" stroke="#8b5cf6" strokeWidth="2" />
            <text x="190" y="90" fill="#a78bfa" fontSize="11">Sunny</text>
            {/* Child Node 1: Humidity */}
            <g transform="translate(70, 120)">
              <rect width="120" height="38" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
              <text x="60" y="24" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Humidity?</text>
            </g>
            {/* Sunny Leaves */}
            <line x1="100" y1="158" x2="60" y2="200" stroke="#6366f1" strokeWidth="1.5" />
            <text x="55" y="180" fill="#cbd5e1" fontSize="9">High</text>
            <rect x="30" y="200" width="60" height="30" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="60" y="220" textAnchor="middle" fill="#ffe4e6" fontWeight="bold" fontSize="10">No</text>

            <line x1="160" y1="158" x2="200" y2="200" stroke="#6366f1" strokeWidth="1.5" />
            <text x="195" y="180" fill="#cbd5e1" fontSize="9">Normal</text>
            <rect x="170" y="200" width="60" height="30" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="200" y="220" textAnchor="middle" fill="#ecfdf5" fontWeight="bold" fontSize="10">Yes</text>

            {/* Branch 2: Overcast */}
            <line x1="340" y1="60" x2="340" y2="120" stroke="#8b5cf6" strokeWidth="2" />
            <text x="350" y="90" fill="#a78bfa" fontSize="11">Overcast</text>
            {/* Direct Leaf: Yes */}
            <g transform="translate(310, 120)">
              <rect width="60" height="38" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
              <text x="30" y="24" textAnchor="middle" fill="#ecfdf5" fontWeight="bold" fontSize="12">Yes</text>
            </g>

            {/* Branch 3: Rain */}
            <line x1="380" y1="60" x2="550" y2="120" stroke="#8b5cf6" strokeWidth="2" />
            <text x="480" y="90" fill="#a78bfa" fontSize="11">Rain</text>
            {/* Child Node 2: Wind */}
            <g transform="translate(490, 120)">
              <rect width="120" height="38" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
              <text x="60" y="24" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Wind?</text>
            </g>
            {/* Rain Leaves */}
            <line x1="520" y1="158" x2="480" y2="200" stroke="#6366f1" strokeWidth="1.5" />
            <text x="475" y="180" fill="#cbd5e1" fontSize="9">Strong</text>
            <rect x="450" y="200" width="60" height="30" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="480" y="220" textAnchor="middle" fill="#ffe4e6" fontWeight="bold" fontSize="10">No</text>

            <line x1="580" y1="158" x2="620" y2="200" stroke="#6366f1" strokeWidth="1.5" />
            <text x="615" y="180" fill="#cbd5e1" fontSize="9">Weak</text>
            <rect x="590" y="200" width="60" height="30" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="620" y="220" textAnchor="middle" fill="#ecfdf5" fontWeight="bold" fontSize="10">Yes</text>
          </svg>
        </div>
      ) : (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
          <span className="text-xs font-bold text-violet-300 uppercase tracking-wider font-sans block">
            Bayesian Posterior Probability Calculation
          </span>
          <div className="p-3 bg-slate-900 rounded-lg text-slate-300 space-y-1">
            <p>P(Yes | X) &prop; P(Yes) &times; P({testOutlook} | Yes) &times; P({testHumidity} | Yes) &times; P({testWind} | Yes)</p>
            <p className="text-emerald-400 font-bold">Computed Likelihood Score P(Yes | X) = {scoreYes}</p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg text-slate-300 space-y-1">
            <p>P(No | X) &prop; P(No) &times; P({testOutlook} | No) &times; P({testHumidity} | No) &times; P({testWind} | No)</p>
            <p className="text-rose-400 font-bold">Computed Likelihood Score P(No | X) = {scoreNo}</p>
          </div>

          <div className="p-3 bg-violet-950/40 rounded-lg border border-violet-800 text-slate-200">
            <strong>Decision Rule:</strong> Class with higher posterior score is chosen as final prediction: 
            <span className="text-emerald-400 font-bold ml-1">
              {parseFloat(scoreYes) > parseFloat(scoreNo) ? `Play Tennis = YES (${scoreYes} > ${scoreNo})` : `Play Tennis = NO (${scoreNo} > ${scoreYes})`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
