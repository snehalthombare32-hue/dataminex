// DataMineX - Comprehensive Step-by-Step Numerical Solution Generator
// 100% Free & Local-First In-Browser Educational Derivation Engine
// Generates ChatGPT-like, college-level, beginner-friendly derivations for all 18 Data Mining & Data Warehousing algorithms

import { NumericalEngine } from './numericalEngine.js';

export function generateSolutionSteps(algo, rawInput, options = {}) {
  const steps = [];
  let examContent = '';
  let practiceContent = '';
  let practiceAnswerExpected = '';
  let practiceHintText = '';
  let practiceExplanation = '';
  let visualizerCallback = null;

  // Helper for rendering clean HTML tables
  const renderTable = (headers, rows, options = {}) => {
    return `
      <div style="overflow-x: auto; margin: 12px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; font-family: monospace; background: white; border: 1px solid #cbd5e1; border-radius: 8px;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left;">
              ${headers.map(h => `<th style="padding: 8px 12px; font-weight: 700; color: #1e293b;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((r, i) => `
              <tr style="border-bottom: 1px solid #e2e8f0; background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                ${r.map((c, j) => `<td style="padding: 8px 12px; color: ${j === 0 ? '#0f172a; font-weight: 600;' : '#334155;'}">${c}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  // Helper for generating standard ChatGPT-style final summary card
  const renderFinalResultCard = (title, items, interpretation, verification) => `
    <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: white; border-radius: 12px; padding: 20px; margin-top: 16px; box-shadow: 0 4px 14px rgba(5,150,105,0.25);">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
        <span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700;">FINAL COMPUTED RESULT</span>
        <h4 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #ffffff;">${title}</h4>
      </div>
      <div style="background: rgba(0,0,0,0.15); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 0.92rem; line-height: 1.6; margin-bottom: 14px;">
        ${items.map(it => `&bull; <strong>${it.label}:</strong> <span style="color: #a7f3d0; font-weight: 700;">${it.value}</span>`).join('<br>')}
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px; font-size: 0.88rem; line-height: 1.5; color: #ecfdf5;">
        <strong>Pedagogical Interpretation:</strong> ${interpretation}
      </div>
      ${verification ? `
        <div style="margin-top: 8px; font-size: 0.82rem; color: #d1fae5; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px;">
          <strong>Mathematical Verification:</strong> ${verification}
        </div>
      ` : ''}
    </div>
  `;

  // Standard Formula Card
  const renderFormulaCard = (title, formulas) => `
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px;">
      <h4 style="font-size: 0.98rem; font-weight: 700; color: #1e40af; margin: 0 0 8px;">Governing Formulas &bull; ${title}</h4>
      <div style="font-family: monospace; font-size: 0.88rem; line-height: 1.7; color: #1e3a8a;">
        ${formulas.map(f => `&bull; <strong>${f.name}:</strong> <code>${f.formula}</code><br><span style="font-size: 0.8rem; color: #3b82f6; margin-left: 14px;">where ${f.vars}</span>`).join('<br><br>')}
      </div>
    </div>
  `;

  // =========================================================================
  // 1. K-MEANS CLUSTERING
  // =========================================================================
  if (algo === 'kmeans') {
    const pts = options.points && options.points.length >= 2 ? options.points : [
      { id: 'P1', x: 2, y: 10 }, { id: 'P2', x: 2, y: 5 }, { id: 'P3', x: 8, y: 4 },
      { id: 'P4', x: 5, y: 8 }, { id: 'P5', x: 7, y: 5 }, { id: 'P6', x: 6, y: 4 }
    ];
    const k = Math.min(pts.length, Math.max(1, parseInt(options.k) || 2));
    const initCentroids = options.customCentroids || null;
    const res = NumericalEngine.kMeans(pts, k, 20, initCentroids);

    steps.push({
      title: "Problem Setup & Given Coordinates",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Problem Formulation &amp; Input Points</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 10px;">
            We are given <strong>${pts.length}</strong> coordinate points to partition into <strong>K = ${k}</strong> clusters using Euclidean distance.
          </p>
          ${renderTable(['Point Label', 'X Coordinate', 'Y Coordinate'], pts.map(p => [p.id, p.x, p.y]))}
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 0.88rem; margin-top: 10px;">
            <strong>Initial Centroids Selected:</strong>
            ${res.initialCentroids.map((c, i) => `<span style="display: inline-block; margin-right: 12px; font-weight: 700; color: #2563eb;">C${i + 1} = (${c.x}, ${c.y})</span>`).join('')}
          </div>
        </div>
      `
    });

    steps.push({
      title: "Distance & Centroid Updating Formulas",
      html: renderFormulaCard("K-Means Mathematical Definition", [
        { name: "Euclidean Distance Metric", formula: "d(P, C) = √((x_p - c_x)² + (y_p - c_y)²)", vars: "P(x_p, y_p) is data point, C(c_x, c_y) is cluster centroid" },
        { name: "Centroid Recalculation (Mean)", formula: "C_x = (1 / n) ∑ x_i , C_y = (1 / n) ∑ y_i", vars: "n is the number of points currently assigned to cluster C" },
        { name: "Convergence Condition", formula: "ΔC = ||C_{t+1} - C_t|| < 0.001", vars: "Terminates when centroid coordinates remain stationary between successive iterations" }
      ])
    });

    res.history.forEach((it) => {
      const distHeaders = ['Point', ...it.centroids.map((c, i) => `d(P, C${i + 1})`), 'Assigned Cluster', 'Min Distance'];
      const distRows = it.pointDistances.map(pd => [
        `<strong>${pd.id}</strong> (${pd.x}, ${pd.y})`,
        ...pd.distancesToCentroids.map(d => `${d}`),
        `<span style="background: #eff6ff; color: #1d4ed8; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Cluster ${pd.assignedCluster}</span>`,
        pd.minDistance
      ]);

      steps.push({
        title: `Iteration ${it.iteration}: Distance Matrix & Centroid Update`,
        html: `
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 10px;">
              <strong style="color: #2563eb; font-size: 1rem;">Iteration ${it.iteration} Distance Table</strong>
              <span style="font-size: 0.8rem; color: #64748b;">Current Centroids: ${it.centroids.map((c, i) => `C${i + 1}(${c.x}, ${c.y})`).join(' | ')}</span>
            </div>
            ${renderTable(distHeaders, distRows)}
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-top: 10px; font-size: 0.88rem;">
              <strong style="color: #166534;">Recalculated Centroids for Next Iteration:</strong><br>
              ${it.newCentroids.map((nc, idx) => `
                &bull; <strong>C${idx + 1}:</strong> Mean of Cluster ${idx + 1} points = <strong>(${nc.x}, ${nc.y})</strong>
              `).join('<br>')}
              <div style="color: #15803d; margin-top: 6px; font-size: 0.82rem;">
                Max Centroid Shift = <strong>${it.maxShift}</strong> | Iteration SSE = <strong>${it.sse}</strong>
              </div>
            </div>
          </div>
        `
      });
    });

    steps.push({
      title: "Convergence Verification & Final Partition",
      html: renderFinalResultCard(
        `K-Means Converged in ${res.totalIterations} Iteration(s)`,
        [
          { label: "Optimal Number of Clusters (K)", value: `${res.k}` },
          ...res.finalCentroids.map((c, i) => ({ label: `Final Centroid C${i + 1}`, value: `(${c.x}, ${c.y})` })),
          ...res.clusters.map((cl, i) => ({ label: `Cluster ${i + 1} Points (${cl.length})`, value: `[${cl.map(p => p.id).join(', ')}]` })),
          { label: "Final Sum of Squared Errors (SSE)", value: `${res.sse}` }
        ],
        `The K-Means algorithm terminated because the maximum shift in centroid positions fell below the convergence threshold (ΔC < 0.001). The points have reached stable, locally optimal clusters.`,
        `Sum of squared distances of all points to their final respective cluster centroids equals ${res.sse}. Re-evaluating distances with the final centroids yields identical cluster assignments.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; K-Means Clustering [10 Marks]</h4>
        1. <strong>Formulas Stated (2 Marks):</strong> Euclidean distance d(p, c) = √((x_p-c_x)² + (y_p-c_y)²) and centroid mean C = (1/n)∑p.<br>
        2. <strong>First Iteration Distance Calculations (4 Marks):</strong> Computed distances from every point to initial centroids C1(${res.initialCentroids[0]?.x}, ${res.initialCentroids[0]?.y}) and C2(${res.initialCentroids[1]?.x}, ${res.initialCentroids[1]?.y}). Assigned points to closest centroid.<br>
        3. <strong>Centroid Updates &amp; Convergence (3 Marks):</strong> Updated centroids over ${res.totalIterations} iteration(s) until shift ΔC < 0.001.<br>
        4. <strong>Final Clusters (1 Mark):</strong> ${res.clusters.map((c, i) => `Cluster ${i + 1} = {${c.map(p => p.id).join(', ')}} with C${i + 1}=(${res.finalCentroids[i]?.x}, ${res.finalCentroids[i]?.y})`).join('; ')}.
      </div>
    `;

    const sampleP = pts[0];
    const sampleC = res.initialCentroids[0];
    const sampleDist = Math.hypot(sampleP.x - sampleC.x, sampleP.y - sampleC.y).toFixed(2);
    practiceAnswerExpected = sampleDist;
    practiceHintText = `Compute Euclidean distance: √((x_p - c_x)² + (y_p - c_y)²) = √((${sampleP.x} - ${sampleC.x})² + (${sampleP.y} - ${sampleC.y})²).`;
    practiceExplanation = `Euclidean distance between ${sampleP.id}(${sampleP.x}, ${sampleP.y}) and C1(${sampleC.x}, ${sampleC.y}) is √(${Math.pow(sampleP.x - sampleC.x, 2)} + ${Math.pow(sampleP.y - sampleC.y, 2)}) = ${sampleDist}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Initial Distance Computation</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the Euclidean distance from point <strong>${sampleP.id}(${sampleP.x}, ${sampleP.y})</strong> to initial centroid <strong>C1(${sampleC.x}, ${sampleC.y})</strong>? (Round to 2 decimal places):
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${sampleDist}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
          <button id="btn-practice-hint" class="btn btn-outline btn-sm">Show Step Hint</button>
          <button id="btn-practice-solution" class="btn btn-outline btn-sm">Reveal Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 2. K-MEDOIDS (PAM ALGORITHM)
  // =========================================================================
  else if (algo === 'kmedoids') {
    const pts = options.points && options.points.length >= 2 ? options.points : [
      { id: 'P1', x: 2, y: 6 }, { id: 'P2', x: 3, y: 4 }, { id: 'P3', x: 3, y: 8 },
      { id: 'P4', x: 4, y: 7 }, { id: 'P5', x: 6, y: 2 }, { id: 'P6', x: 6, y: 4 },
      { id: 'P7', x: 7, y: 3 }, { id: 'P8', x: 7, y: 4 }, { id: 'P9', x: 8, y: 5 }, { id: 'P10', x: 7, y: 6 }
    ];
    const k = Math.min(pts.length, Math.max(1, parseInt(options.k) || 2));
    const res = NumericalEngine.kMedoids(pts, k, 15);

    steps.push({
      title: "Problem Setup & Initial Medoids Selection",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Problem Formulation &amp; Initial Medoids</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 10px;">
            Unlike K-Means (which uses virtual arithmetic averages), K-Medoids (PAM) selects <strong>actual representative points</strong> from the dataset as medoids to resist outliers.
          </p>
          ${renderTable(['Point Label', 'X Coordinate', 'Y Coordinate'], pts.map(p => [p.id, p.x, p.y]))}
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 0.88rem; margin-top: 10px;">
            <strong>Initial Medoid Points Chosen:</strong>
            ${res.history[0]?.medoids.map((m, i) => `<span style="display: inline-block; margin-right: 12px; font-weight: 700; color: #2563eb;">M${i + 1} = ${m.id}(${m.x}, ${m.y})</span>`).join('')}
          </div>
        </div>
      `
    });

    steps.push({
      title: "PAM Swap Evaluation & Cost Function",
      html: renderFormulaCard("K-Medoids (PAM) Governing Principles", [
        { name: "Total Absolute Error (Cost)", formula: "E = ∑_{i=1}^k ∑_{p ∈ C_i} d(p, o_i)", vars: "o_i is the medoid representing cluster C_i" },
        { name: "Swap Cost Difference", formula: "ΔE = E_{new} - E_{current}", vars: "Swap is accepted if ΔE < 0 (i.e., new configuration reduces total cost)" }
      ])
    });

    res.history.forEach((it) => {
      steps.push({
        title: `Iteration ${it.iteration}: Medoids & Evaluated Swaps`,
        html: `
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
            <strong style="color: #2563eb; font-size: 1rem;">Iteration ${it.iteration} Configuration</strong>
            <p style="font-size: 0.9rem; margin: 8px 0;">
              Current Medoids: <strong>${it.medoids.map(m => m.id).join(', ')}</strong> | Current Total Cost = <strong>${it.totalCost}</strong>
            </p>
            ${it.evaluatedSwaps && it.evaluatedSwaps.length > 0 ? `
              <div style="margin-top: 10px;">
                <span style="font-size: 0.82rem; font-weight: bold; color: #64748b;">Evaluated Medoid Swaps (Sample):</span>
                ${renderTable(
                  ['Current Medoid', 'Candidate Point', 'New Cost', 'Cost Difference (ΔE)'],
                  it.evaluatedSwaps.map(s => [s.currentMedoid, s.candidatePoint, s.newCost, s.costDiff < 0 ? `<span style="color:#059669; font-weight:bold;">${s.costDiff} (Accepted)</span>` : `${s.costDiff} (Rejected)`])
                )}
              </div>
            ` : '<div style="color: #059669; font-weight: bold; margin-top: 8px;">✓ No swap decreased the cost. Convergence reached.</div>'}
          </div>
        `
      });
    });

    steps.push({
      title: "Final Medoids & Optimal Clusters",
      html: renderFinalResultCard(
        `K-Medoids Partition Completed`,
        [
          { label: "Optimal Medoids", value: res.finalMedoids.map((m, i) => `M${i + 1}=${m.id}(${m.x}, ${m.y})`).join(', ') },
          ...res.clusters.map((c, i) => ({ label: `Cluster ${i + 1} (${c.length} pts)`, value: `[${c.map(p => p.id).join(', ')}]` })),
          { label: "Minimum Total Absolute Cost", value: `${res.totalCost}` }
        ],
        `K-Medoids converged because no replacement of a medoid by an existing non-medoid point yields a lower total absolute error. This makes the clustering robust against noisy coordinates and outliers.`,
        `All ${pts.length} points have been assigned to their nearest representative medoid.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Format &bull; K-Medoids PAM [10 Marks]</h4>
        1. <strong>Formulas (2 Marks):</strong> Absolute error cost E = ∑ d(p, o_i). Swap acceptance condition ΔE < 0.<br>
        2. <strong>Initial Cost Evaluation (4 Marks):</strong> Initial medoids selected; total initial cost computed.<br>
        3. <strong>Swap Iterations (3 Marks):</strong> Evaluated non-medoid swaps until no cost reduction was achieved.<br>
        4. <strong>Final Result (1 Mark):</strong> Medoids: ${res.finalMedoids.map(m => m.id).join(', ')} with Total Cost = ${res.totalCost}.
      </div>
    `;

    practiceAnswerExpected = String(res.finalMedoids[0]?.id || 'P1');
    practiceHintText = `Review the final medoids list derived in the solution.`;
    practiceExplanation = `The first medoid point is ${practiceAnswerExpected}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Identifying Optimal Medoids</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the label of the first final medoid point selected by PAM?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 3. HIERARCHICAL AGGLOMERATIVE CLUSTERING
  // =========================================================================
  else if (algo === 'hierarchical') {
    const pts = options.points && options.points.length >= 2 ? options.points : [
      { id: 'P1', x: 1, y: 1 }, { id: 'P2', x: 1.5, y: 1.5 }, { id: 'P3', x: 5, y: 5 }, { id: 'P4', x: 3, y: 4 }
    ];
    const linkage = options.linkage || 'single';
    const res = NumericalEngine.hierarchicalClustering(pts, linkage);

    steps.push({
      title: "Input Coordinates & Initial Distance Matrix (D_0)",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Initial Pairwise Distance Matrix (D_0)</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Starting with ${pts.length} singleton clusters using <strong>${linkage.toUpperCase()} LINKAGE</strong>:
          </p>
          ${renderTable(
            ['Cluster', ...pts.map(p => p.id)],
            pts.map((p1, i) => [p1.id, ...pts.map((p2, j) => i === j ? '-' : `${res.initialMatrix[i][j]}`)])
          )}
        </div>
      `
    });

    steps.push({
      title: "Linkage Metric Definition",
      html: renderFormulaCard(`Agglomerative Hierarchical (${linkage.toUpperCase()} Linkage)`, [
        {
          name: `${linkage.charAt(0).toUpperCase() + linkage.slice(1)} Linkage Distance Rule`,
          formula: linkage === 'single' ? "d(A, B) = min { d(x, y) : x ∈ A, y ∈ B }" : (linkage === 'complete' ? "d(A, B) = max { d(x, y) : x ∈ A, y ∈ B }" : "d(A, B) = (1 / (|A|·|B|)) ∑∑ d(x, y)"),
          vars: "Defines distance between two non-empty clusters A and B at merge step"
        }
      ])
    });

    res.steps.forEach((s) => {
      steps.push({
        title: `Merge Step ${s.step}: Merging (${s.clusterA} & ${s.clusterB}) at Distance d = ${s.distance}`,
        html: `
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px;">
              <strong style="color: #2563eb; font-size: 1rem;">Agglomeration Step ${s.step}</strong>
              <span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">d = ${s.distance}</span>
            </div>
            <div style="font-size: 0.9rem; line-height: 1.6; color: #334155;">
              &bull; <strong>Pair with Minimum Distance:</strong> ${s.clusterA} and ${s.clusterB}<br>
              &bull; <strong>Merged Cluster Result:</strong> <span style="color: #059669; font-weight: bold;">${s.mergedLabel}</span><br>
              &bull; <strong>Remaining Clusters:</strong> ${s.remainingCount}
            </div>
          </div>
        `
      });
    });

    steps.push({
      title: "Dendrogram Hierarchy Summary",
      html: renderFinalResultCard(
        `Hierarchical Clustering Merged into 1 Root Cluster`,
        [
          { label: "Total Agglomeration Steps", value: `${res.steps.length}` },
          { label: "Linkage Criterion Used", value: `${linkage.toUpperCase()}` },
          ...res.steps.map(s => ({ label: `Step ${s.step} Merge`, value: `${s.clusterA} + ${s.clusterB} at d = ${s.distance}` })),
          { label: "Final Dendrogram Root", value: `${res.finalTree.label}` }
        ],
        `Agglomerative clustering iteratively merges the closest pair of clusters until all points belong to a single hierarchy tree (dendrogram). By cutting the dendrogram horizontally at a chosen distance threshold, any desired number of clusters can be obtained.`,
        `Original dataset points ${pts.length} required exactly ${pts.length - 1} binary merge steps.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Hierarchical Clustering [10 Marks]</h4>
        1. <strong>Distance Matrix D_0 (3 Marks):</strong> Constructed initial pairwise Euclidean distance matrix for all ${pts.length} coordinate points.<br>
        2. <strong>Linkage Formula (2 Marks):</strong> Applied ${linkage} linkage formula d(A, B).<br>
        3. <strong>Step-by-Step Merges (4 Marks):</strong><br>
        ${res.steps.map(s => `&nbsp;&nbsp;&bull; Step ${s.step}: Merge ${s.clusterA} and ${s.clusterB} at d = ${s.distance} &rarr; ${s.mergedLabel}`).join('<br>')}<br>
        4. <strong>Final Dendrogram Structure (1 Mark):</strong> Root node ${res.finalTree.label}.
      </div>
    `;

    const firstMerge = res.steps[0];
    practiceAnswerExpected = String(firstMerge?.distance || '1.0');
    practiceHintText = `Inspect the initial distance matrix D_0 and locate the smallest off-diagonal entry.`;
    practiceExplanation = `The smallest distance in D_0 is ${firstMerge.distance} between ${firstMerge.clusterA} and ${firstMerge.clusterB}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: First Merge Distance</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the minimum distance at which the first two clusters are merged?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 4. DBSCAN CLUSTERING
  // =========================================================================
  else if (algo === 'dbscan') {
    const pts = options.points && options.points.length >= 2 ? options.points : [
      { id: 'P1', x: 2, y: 10 }, { id: 'P2', x: 2, y: 5 }, { id: 'P3', x: 8, y: 4 },
      { id: 'P4', x: 5, y: 8 }, { id: 'P5', x: 7, y: 5 }, { id: 'P6', x: 6, y: 4 },
      { id: 'P7', x: 1, y: 2 }, { id: 'P8', x: 25, y: 25 }
    ];
    const eps = Math.max(0.1, parseFloat(options.eps) || 3.5);
    const minPts = Math.max(1, parseInt(options.minPts) || 2);
    const res = NumericalEngine.dbscan(pts, eps, minPts);

    steps.push({
      title: "Problem Setup & Density Parameters (ε and MinPts)",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Input Points &amp; Density Parameters</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Evaluating density-based clusters with <strong>Epsilon (ε) = ${eps}</strong> and <strong>MinPts = ${minPts}</strong>:
          </p>
          ${renderTable(['Point Label', 'X Coordinate', 'Y Coordinate'], pts.map(p => [p.id, p.x, p.y]))}
        </div>
      `
    });

    steps.push({
      title: "Point Type Classification (Core, Border, Noise)",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">2. ε-Neighborhoods &amp; Point Classification</h4>
          ${renderTable(
            ['Point', 'ε-Neighborhood N_ε(P)', 'Neighbor Count', 'Point Type'],
            pts.map(p => {
              const nbrs = res.neighborhoods[p.id] || [];
              const type = res.pointTypes[p.id] || 'noise';
              const typeBadge = type === 'core'
                ? '<span style="background:#ecfdf5; color:#059669; font-weight:bold; padding:2px 8px; border-radius:4px;">Core Point</span>'
                : (type === 'border'
                  ? '<span style="background:#eff6ff; color:#2563eb; font-weight:bold; padding:2px 8px; border-radius:4px;">Border Point</span>'
                  : '<span style="background:#fef2f2; color:#dc2626; font-weight:bold; padding:2px 8px; border-radius:4px;">Noise (Outlier)</span>');
              return [p.id, `{ ${nbrs.join(', ')} }`, `${nbrs.length}`, typeBadge];
            })
          )}
        </div>
      `
    });

    steps.push({
      title: "Density-Connected Clusters & Outliers",
      html: renderFinalResultCard(
        `DBSCAN Formed ${res.totalClusters} Cluster(s) and Flagged ${res.noise.length} Outlier(s)`,
        [
          { label: "Neighborhood Radius (ε)", value: `${res.eps}` },
          { label: "Minimum Density Points (MinPts)", value: `${res.minPts}` },
          ...res.clusters.map((c, i) => ({ label: `Cluster ${i + 1} (${c.length} pts)`, value: `[${c.map(p => p.id).join(', ')}]` })),
          { label: "Noise Points (Outliers)", value: res.noise.length > 0 ? `[${res.noise.map(p => p.id).join(', ')}]` : 'None' }
        ],
        `DBSCAN forms clusters by connecting core points whose ε-neighborhoods overlap. Points that do not contain MinPts neighbors and are not density-reachable from any core point are flagged as Noise outliers.`,
        `Outlier points lie at distance > ε (${eps}) from all core points in the dataset.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Format &bull; DBSCAN Clustering [10 Marks]</h4>
        1. <strong>Core Point Condition (2 Marks):</strong> Point P is a Core Point if |N_ε(P)| ≥ MinPts = ${minPts}.<br>
        2. <strong>Neighborhood Evaluation (4 Marks):</strong> Computed ε-neighborhoods for all ${pts.length} points at radius ε = ${eps}.<br>
        3. <strong>Density Reachability &amp; Expansion (3 Marks):</strong> Formed ${res.totalClusters} connected component(s).<br>
        4. <strong>Noise Outliers (1 Mark):</strong> Identified ${res.noise.length} noise point(s): ${res.noise.map(p => p.id).join(', ') || 'None'}.
      </div>
    `;

    practiceAnswerExpected = String(res.totalClusters);
    practiceHintText = `Review the final cluster count generated by connecting core points.`;
    practiceExplanation = `DBSCAN formed ${res.totalClusters} cluster(s).`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: DBSCAN Cluster Count</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          How many total dense clusters were formed?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 5. DECISION TREE - ID3 (ENTROPY & INFORMATION GAIN)
  // =========================================================================
  else if (algo === 'id3') {
    const tableData = options.data || [
      { Outlook: 'Sunny', Humidity: 'High', Wind: 'Weak', Play: 'No' },
      { Outlook: 'Sunny', Humidity: 'High', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Overcast', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Humidity: 'High', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Rain', Humidity: 'Normal', Wind: 'Strong', Play: 'Yes' }
    ];
    const targetCol = options.targetCol || 'Play';
    const res = NumericalEngine.id3Entropy(tableData, targetCol);
    const treeRes = NumericalEngine.buildDecisionTree(tableData, targetCol);

    steps.push({
      title: "Dataset & Target Class Distribution",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Training Dataset &amp; Class Proportions</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Target class attribute: <strong>"${targetCol}"</strong> across ${tableData.length} training instances.
          </p>
          ${renderTable(Object.keys(tableData[0]), tableData.map(r => Object.values(r)))}
        </div>
      `
    });

    steps.push({
      title: "Entropy & Information Gain Formulas",
      html: renderFormulaCard("ID3 Decision Tree Governing Formulas", [
        { name: "System Entropy", formula: "H(S) = - ∑_{i=1}^c p_i · log₂(p_i)", vars: "p_i is the probability of class i in dataset S" },
        { name: "Conditional Attribute Entropy", formula: "H(S | A) = ∑_{v ∈ Values(A)} (|S_v| / |S|) · H(S_v)", vars: "S_v is subset of instances where attribute A has value v" },
        { name: "Information Gain", formula: "Gain(S, A) = H(S) - H(S | A)", vars: "Reduction in uncertainty achieved by splitting dataset on attribute A" }
      ])
    });

    const gainHeaders = ['Candidate Attribute (A)', 'Expected Conditional Entropy H(S|A)', 'Information Gain (bits)', 'Ranking'];
    const gainRows = res.gains.map((g, idx) => [
      `<strong>${g.attribute}</strong>`,
      `${g.expectedEntropy} bits`,
      `<strong style="color: ${g.attribute === res.bestSplitAttribute ? '#059669' : '#1e293b'};">${g.informationGain} bits</strong>`,
      g.attribute === res.bestSplitAttribute ? '<span style="background:#ecfdf5; color:#059669; font-weight:bold; padding:2px 8px; border-radius:4px;">Rank 1 (Selected Root) ★</span>' : `Rank ${idx + 1}`
    ]);

    steps.push({
      title: "Attribute Entropy & Information Gain Table",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">3. Candidate Splits Comparison</h4>
          <p style="font-size: 0.9rem; margin-bottom: 10px;">
            Overall System Entropy H(S) = <strong>${res.systemEntropy} bits</strong>.
          </p>
          ${renderTable(gainHeaders, gainRows)}
        </div>
      `
    });

    steps.push({
      title: "Root Attribute Selection & Tree Summary",
      html: renderFinalResultCard(
        `Selected Root Split: "${res.bestSplitAttribute}"`,
        [
          { label: "Target Class Column", value: targetCol },
          { label: "Total Training Instances", value: `${tableData.length}` },
          { label: "Initial System Entropy H(S)", value: `${res.systemEntropy} bits` },
          { label: "Optimal Root Attribute", value: `"${res.bestSplitAttribute}"` },
          { label: "Maximum Information Gain", value: `${res.highestGain} bits` }
        ],
        `The ID3 algorithm uses Information Gain as its heuristic split criterion. Attribute "${res.bestSplitAttribute}" maximizes the reduction in entropy, creating the purest initial branches.`,
        `Information Gain = System Entropy (${res.systemEntropy}) - Conditional Entropy (${res.gains[0]?.expectedEntropy}) = ${res.highestGain} bits.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; ID3 Decision Tree [10 Marks]</h4>
        1. <strong>Entropy Formula (2 Marks):</strong> H(S) = -∑ p_i log₂(p_i). System Entropy = ${res.systemEntropy} bits.<br>
        2. <strong>Information Gain Calculations (5 Marks):</strong><br>
        ${res.gains.map(g => `&nbsp;&nbsp;&bull; Gain(S, ${g.attribute}) = ${res.systemEntropy} - ${g.expectedEntropy} = ${g.informationGain} bits`).join('<br>')}<br>
        3. <strong>Root Selection (3 Marks):</strong> Attribute with highest Gain is <strong>${res.bestSplitAttribute}</strong> (${res.highestGain} bits).
      </div>
    `;

    practiceAnswerExpected = String(res.bestSplitAttribute);
    practiceHintText = `Identify the attribute with the largest Information Gain value.`;
    practiceExplanation = `Attribute "${res.bestSplitAttribute}" has the highest Information Gain (${res.highestGain} bits).`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Root Attribute Selection</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          Which attribute is selected as the Root Node of the Decision Tree?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 6. DECISION TREE - CART (GINI INDEX & GINI IMPURITY)
  // =========================================================================
  else if (algo === 'gini') {
    const tableData = options.data || [
      { Outlook: 'Sunny', Humidity: 'High', Wind: 'Weak', Play: 'No' },
      { Outlook: 'Sunny', Humidity: 'High', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Overcast', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Humidity: 'High', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Rain', Humidity: 'Normal', Wind: 'Strong', Play: 'Yes' }
    ];
    const targetCol = options.targetCol || 'Play';
    const res = NumericalEngine.gini(tableData, targetCol);

    steps.push({
      title: "Training Data & System Gini Impurity",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Dataset &amp; Initial Gini Index</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Target class attribute: <strong>"${targetCol}"</strong>. System Gini Impurity = <strong>${res.systemGini}</strong>.
          </p>
          ${renderTable(Object.keys(tableData[0]), tableData.map(r => Object.values(r)))}
        </div>
      `
    });

    steps.push({
      title: "Gini Impurity & Reduction Formulas",
      html: renderFormulaCard("CART Decision Tree (Gini Index)", [
        { name: "Gini Impurity", formula: "Gini(S) = 1 - ∑_{i=1}^c (p_i)²", vars: "p_i is relative frequency of class i in subset S" },
        { name: "Weighted Gini Index", formula: "Gini(S | A) = ∑ (|S_v| / |S|) · Gini(S_v)", vars: "Weighted average Gini across distinct attribute values v" },
        { name: "Gini Gain (Reduction)", formula: "ΔGini = Gini(S) - Gini(S | A)", vars: "Optimal split attribute MINIMIZES Gini(S|A) or MAXIMIZES ΔGini" }
      ])
    });

    const giniHeaders = ['Candidate Attribute (A)', 'Weighted Gini Index Gini(S|A)', 'Gini Reduction (ΔGini)', 'Ranking'];
    const giniRows = res.gains.map((g, idx) => [
      `<strong>${g.attribute}</strong>`,
      `${g.expectedGini}`,
      `<strong style="color: ${g.attribute === res.bestSplitAttribute ? '#059669' : '#1e293b'};">${g.giniReduction}</strong>`,
      g.attribute === res.bestSplitAttribute ? '<span style="background:#ecfdf5; color:#059669; font-weight:bold; padding:2px 8px; border-radius:4px;">Rank 1 (Selected CART Split) ★</span>' : `Rank ${idx + 1}`
    ]);

    steps.push({
      title: "Gini Index Split Comparison",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">3. Gini Index Attribute Evaluations</h4>
          ${renderTable(giniHeaders, giniRows)}
        </div>
      `
    });

    steps.push({
      title: "Optimal CART Split Selection",
      html: renderFinalResultCard(
        `Selected CART Split Attribute: "${res.bestSplitAttribute}"`,
        [
          { label: "System Gini Impurity Gini(S)", value: `${res.systemGini}` },
          { label: "Optimal Split Attribute", value: `"${res.bestSplitAttribute}"` },
          { label: "Lowest Weighted Gini Gini(S|A)", value: `${res.lowestGini}` },
          { label: "Maximum Gini Reduction (ΔGini)", value: `${res.highestReduction}` }
        ],
        `In CART algorithms, the attribute that produces the lowest weighted Gini index (or highest reduction in impurity) is chosen as the split node.`,
        `Gini Reduction = ${res.systemGini} - ${res.lowestGini} = ${res.highestReduction}.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Format &bull; CART Gini Index [10 Marks]</h4>
        1. <strong>Gini Formula (2 Marks):</strong> Gini(S) = 1 - ∑ p_i². System Gini = ${res.systemGini}.<br>
        2. <strong>Weighted Gini Calculations (5 Marks):</strong><br>
        ${res.gains.map(g => `&nbsp;&nbsp;&bull; Gini(S, ${g.attribute}) = ${g.expectedGini} (Reduction = ${g.giniReduction})`).join('<br>')}<br>
        3. <strong>Optimal Split (3 Marks):</strong> Attribute with lowest Gini index is <strong>${res.bestSplitAttribute}</strong> (Gini = ${res.lowestGini}).
      </div>
    `;

    practiceAnswerExpected = String(res.bestSplitAttribute);
    practiceHintText = `The CART split chooses the attribute with the lowest weighted Gini index.`;
    practiceExplanation = `Attribute "${res.bestSplitAttribute}" gives the lowest Gini index (${res.lowestGini}).`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: CART Root Selection</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          Which attribute gives the lowest Gini Impurity?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 7. NAIVE BAYES CLASSIFIER
  // =========================================================================
  else if (algo === 'naivebayes') {
    const tableData = options.data || [
      { Outlook: 'Sunny', Temp: 'Hot', Humidity: 'High', Wind: 'Weak', Play: 'No' },
      { Outlook: 'Sunny', Temp: 'Hot', Humidity: 'High', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Overcast', Temp: 'Hot', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Mild', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Cool', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
      { Outlook: 'Rain', Temp: 'Cool', Humidity: 'Normal', Wind: 'Strong', Play: 'No' },
      { Outlook: 'Overcast', Temp: 'Cool', Humidity: 'Normal', Wind: 'Strong', Play: 'Yes' }
    ];
    const targetCol = options.targetCol || 'Play';
    const testInstance = options.testInstance || { Outlook: 'Sunny', Temp: 'Cool', Humidity: 'High', Wind: 'Weak' };
    const res = NumericalEngine.naiveBayes(tableData, targetCol, testInstance);

    steps.push({
      title: "Training Dataset & Prior Class Probabilities",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Dataset &amp; Prior Probabilities P(C)</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Target column: <strong>"${targetCol}"</strong> across ${tableData.length} records.
          </p>
          ${renderTable(['Class', 'Instance Count', 'Prior Probability P(C)', 'Percentage'], res.classes.map(c => [
            `<strong>${c}</strong>`,
            `${res.classPriors[c].count}`,
            `${res.classPriors[c].prior.toFixed(4)}`,
            `${res.classPriors[c].priorPct}%`
          ]))}
          <div style="background: #eff6ff; padding: 10px 14px; border-radius: 8px; margin-top: 10px; font-size: 0.88rem;">
            <strong>Test Query Instance (X):</strong>
            ${Object.entries(testInstance).map(([k, v]) => `<code>${k} = ${v}</code>`).join(' , ')}
          </div>
        </div>
      `
    });

    steps.push({
      title: "Bayes Theorem & Conditional Likelihoods",
      html: renderFormulaCard("Naive Bayes Probability Formulas", [
        { name: "Bayes Posterior Rule", formula: "P(C_j | X) ∝ P(C_j) · ∏_{i=1}^n P(x_i | C_j)", vars: "Assumes conditional independence between features given the class" },
        { name: "Laplace Smoothed Likelihood", formula: "P(x_i | C_j) = (count(x_i, C_j) + 1) / (|C_j| + |V_i|)", vars: "Prevents zero probability multiplication penalty" }
      ])
    });

    steps.push({
      title: "Conditional Likelihood Computations",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">3. Conditional Feature Probabilities</h4>
          ${res.classes.map(cls => `
            <div style="margin-bottom: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
              <strong style="color: #2563eb; font-size: 0.92rem;">Likelihood for Class "${cls}":</strong>
              <div style="font-size: 0.85rem; font-family: monospace; margin-top: 4px; line-height: 1.6;">
                ${Object.entries(res.likelihoods[cls].features).map(([feat, details]) => `
                  &bull; P(${feat} = "${details.value}" | ${cls}) = (${details.count} + 1) / (${details.total} + ${details.vocabSize}) = <strong>${details.probability}</strong>
                `).join('<br>')}
                <div style="margin-top: 6px; font-weight: bold; color: #0f172a;">
                  Raw Posterior Score = P(${cls}) × ∏ P(x_i | ${cls}) = ${res.likelihoods[cls].rawScore}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `
    });

    steps.push({
      title: "Posterior Normalization & Predicted Class",
      html: renderFinalResultCard(
        `Predicted Class: "${res.prediction}" (${res.confidence})`,
        [
          ...res.classes.map(c => ({ label: `Posterior P(${c} | X)`, value: `${(res.posteriors[c] * 100).toFixed(2)}% (Score: ${res.posteriors[c]})` })),
          { label: "Optimal Predicted Class", value: `"${res.prediction}"` },
          { label: "Classification Confidence", value: `${res.confidence}` }
        ],
        `According to Maximum A Posteriori (MAP) decision rule, class "${res.prediction}" achieves the highest posterior probability product given the features of query instance X.`,
        `Sum of normalized posterior probabilities = 100%. P("${res.prediction}"|X) dominates all other classes.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Naive Bayes [10 Marks]</h4>
        1. <strong>Prior Probabilities (2 Marks):</strong> ${res.classes.map(c => `P(${c}) = ${res.classPriors[c].count}/${tableData.length}`).join(' , ')}.<br>
        2. <strong>Conditional Likelihoods (5 Marks):</strong> Calculated Laplace-smoothed feature probabilities for each feature.<br>
        3. <strong>Posterior Product (2 Marks):</strong> Multiplied priors and likelihoods for each class.<br>
        4. <strong>Final Decision (1 Mark):</strong> MAP Decision rule classifies instance as <strong>"${res.prediction}"</strong>.
      </div>
    `;

    practiceAnswerExpected = String(res.prediction);
    practiceHintText = `Compare the posterior scores for each class; the class with highest score wins.`;
    practiceExplanation = `Class "${res.prediction}" has highest posterior probability (${res.confidence}).`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Predicted Class</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the predicted target class for query instance X?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 8. K-NEAREST NEIGHBORS (KNN)
  // =========================================================================
  else if (algo === 'knn') {
    const pts = options.points && options.points.length >= 2 ? options.points : [
      { id: 'P1', x: 1, y: 2, label: 'Red' },
      { id: 'P2', x: 2, y: 3, label: 'Red' },
      { id: 'P3', x: 3, y: 3, label: 'Blue' },
      { id: 'P4', x: 6, y: 5, label: 'Blue' },
      { id: 'P5', x: 7, y: 8, label: 'Blue' }
    ];
    const testPt = options.testPoint || { x: 2.5, y: 2.5 };
    const kVal = Math.min(pts.length, Math.max(1, parseInt(options.k) || 3));
    const distMetric = options.distanceMetric || 'euclidean';
    const res = NumericalEngine.knn(pts, testPt, kVal, null, null, distMetric);

    steps.push({
      title: "Training Instances & Query Test Point",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Problem Formulation &amp; Training Samples</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Target: Classify test point <strong>T(${testPt.x}, ${testPt.y})</strong> using <strong>K = ${kVal}</strong> nearest neighbors (${distMetric.toUpperCase()} distance).
          </p>
          ${renderTable(['Sample', 'X', 'Y', 'Class Label'], pts.map(p => [p.id, p.x, p.y, `<strong>${p.label}</strong>`]))}
        </div>
      `
    });

    const distHeaders = ['Sample Point', 'Coordinates (x, y)', 'Distance Calculation to Test Point T', 'Distance Value', 'Rank'];
    const distRows = res.allDistances.map((d, i) => [
      `<strong>${d.id}</strong>`,
      `(${d.x}, ${d.y})`,
      distMetric === 'manhattan' ? `|${d.x} - ${testPt.x}| + |${d.y} - ${testPt.y}|` : `√(((${d.x} - ${testPt.x})²) + ((${d.y} - ${testPt.y})²))`,
      `<strong>${d.distance}</strong>`,
      i < kVal ? `<span style="background:#ecfdf5; color:#059669; font-weight:bold; padding:2px 8px; border-radius:4px;">Top ${i + 1} Neighbor ★</span>` : `Rank ${i + 1}`
    ]);

    steps.push({
      title: "Distance Ranking & K-Nearest Neighbors Selection",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">2. Sorted Distance Rankings</h4>
          ${renderTable(distHeaders, distRows)}
        </div>
      `
    });

    steps.push({
      title: "Majority Voting & Prediction",
      html: renderFinalResultCard(
        `Predicted Class: "${res.predictedClass}" (${res.confidence})`,
        [
          { label: "Query Point Coordinates", value: `(${testPt.x}, ${testPt.y})` },
          { label: "Value of K", value: `${kVal}` },
          { label: "Selected K-Nearest Neighbors", value: res.kNearest.map(n => `${pts[n.index]?.id} (${n.label}, d=${n.distance})`).join(', ') },
          { label: "Class Votes Breakdown", value: Object.entries(res.votes).map(([cls, cnt]) => `${cls}: ${cnt} vote(s)`).join(' | ') },
          { label: "Winning Predicted Class", value: `"${res.predictedClass}"` }
        ],
        `The K-Nearest Neighbors algorithm assigns the class label that has majority representation among the K closest data points in the feature space.`,
        `Class "${res.predictedClass}" received ${res.votes[res.predictedClass]} out of ${kVal} total votes (${res.confidence}).`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Format &bull; KNN Classifier [10 Marks]</h4>
        1. <strong>Distance Metric (2 Marks):</strong> Formula d(x, y) applied for all training points.<br>
        2. <strong>Distance Table &amp; Sorting (4 Marks):</strong> Calculated distances to query point (${testPt.x}, ${testPt.y}) and sorted in ascending order.<br>
        3. <strong>K-Nearest Selection (2 Marks):</strong> Identified ${kVal} nearest neighbors.<br>
        4. <strong>Majority Vote (2 Marks):</strong> Assigned class <strong>"${res.predictedClass}"</strong> with ${res.votes[res.predictedClass]}/${kVal} votes.
      </div>
    `;

    practiceAnswerExpected = String(res.predictedClass);
    practiceHintText = `Count which class receives the maximum number of votes among the ${kVal} closest points.`;
    practiceExplanation = `Class "${res.predictedClass}" wins majority vote (${res.votes[res.predictedClass]} votes).`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: KNN Classification</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the majority predicted class for test point T?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 9. APRIORI ASSOCIATION RULE MINING
  // =========================================================================
  else if (algo === 'apriori') {
    const tx = options.transactions && options.transactions.length >= 2 ? options.transactions : [
      { id: 'T1', items: ['Milk', 'Bread', 'Eggs'] },
      { id: 'T2', items: ['Bread', 'Butter'] },
      { id: 'T3', items: ['Milk', 'Bread', 'Butter'] },
      { id: 'T4', items: ['Milk', 'Eggs'] },
      { id: 'T5', items: ['Bread', 'Butter'] }
    ];
    const minSup = parseFloat(options.minSup) || 40;
    const minConf = parseFloat(options.minConf) || 60;
    const res = NumericalEngine.apriori(tx, minSup, minConf);

    steps.push({
      title: "Transaction Database & Thresholds",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Market Basket Database</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Total Transactions: <strong>${res.totalTransactions}</strong> | Minimum Support: <strong>${minSup}%</strong> (count ≥ ${res.minSupCount}) | Minimum Confidence: <strong>${minConf}%</strong>.
          </p>
          ${renderTable(['TID', 'Items in Basket'], tx.map(t => [t.id, `{ ${(t.items || []).join(', ')} }`]))}
        </div>
      `
    });

    steps.push({
      title: "Pass 1: Frequent 1-Itemsets (L1)",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">Pass 1: Candidate C1 &amp; Frequent L1</h4>
          ${renderTable(
            ['Item', 'Support Count', 'Support %', 'Status'],
            res.candidates.C1.map(c => [
              `{ ${c.item} }`,
              `${c.count}`,
              `${c.supportPct}%`,
              c.count >= res.minSupCount ? '<span style="color:#059669; font-weight:bold;">Frequent (In L1) ✓</span>' : '<span style="color:#dc2626;">Pruned ✗</span>'
            ])
          )}
        </div>
      `
    });

    if (res.candidates.C2 && res.candidates.C2.length > 0) {
      steps.push({
        title: "Pass 2: Frequent 2-Itemsets (L2)",
        html: `
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">Pass 2: Candidate C2 &amp; Frequent L2</h4>
            ${renderTable(
              ['2-Itemset Pair', 'Support Count', 'Support %', 'Status'],
              res.candidates.C2.map(c => [
                `{ ${c.pair} }`,
                `${c.count}`,
                `${c.supportPct}%`,
                c.count >= res.minSupCount ? '<span style="color:#059669; font-weight:bold;">Frequent (In L2) ✓</span>' : '<span style="color:#dc2626;">Pruned ✗</span>'
              ])
            )}
          </div>
        `
      });
    }

    steps.push({
      title: "Strong Association Rules Generation",
      html: renderFinalResultCard(
        `Apriori Mined ${res.rules.length} Strong Association Rule(s)`,
        [
          { label: "Frequent 1-Itemsets (L1)", value: res.frequent1Itemsets.map(l => `{${l.item}}`).join(', ') },
          { label: "Frequent 2-Itemsets (L2)", value: res.frequent2Itemsets.length > 0 ? res.frequent2Itemsets.map(l => `{${l.pair}}`).join(', ') : 'None' },
          ...res.rules.map(r => ({ label: `Rule ${r.rule}`, value: `Support: ${r.support}% | Confidence: ${r.confidence}% | Lift: ${r.lift}` }))
        ],
        `Apriori utilizes the downward-closure property (all non-empty subsets of a frequent itemset must also be frequent) to systematically prune infreqent itemsets without combinatorial explosion.`,
        `All derived association rules satisfy both Min_Sup ≥ ${minSup}% and Min_Conf ≥ ${minConf}%.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Format &bull; Apriori Rules [10 Marks]</h4>
        1. <strong>Formulas (2 Marks):</strong> Support(A) = count(A)/N | Confidence(A&rarr;B) = sup(A&cup;B)/sup(A).<br>
        2. <strong>Candidate Passes (5 Marks):</strong> Generated and pruned C1&rarr;L1 and C2&rarr;L2 at Min_Sup = ${minSup}%.<br>
        3. <strong>Rule Generation (3 Marks):</strong> Evaluated confidence for all subsets. Strong rules: ${res.rules.map(r => r.rule).join(' | ') || 'None'}.
      </div>
    `;

    const topRule = res.rules[0];
    practiceAnswerExpected = topRule ? String(Math.round(topRule.confidence)) : "60";
    practiceHintText = `Confidence(A &rarr; B) = (count(A &cup; B) / count(A)) &times; 100%.`;
    practiceExplanation = `Confidence of the primary association rule is ${practiceAnswerExpected}%.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Rule Confidence</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the confidence percentage of the top association rule?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 10. FP-GROWTH & FP-TREE CONSTRUCTION
  // =========================================================================
  else if (algo === 'fpgrowth') {
    const tx = options.transactions && options.transactions.length >= 2 ? options.transactions : [
      { id: 'T1', items: ['r', 'z', 'h', 'j', 'p'] },
      { id: 'T2', items: ['z', 'y', 'x', 'w', 'v', 'u', 't', 's'] },
      { id: 'T3', items: ['z'] },
      { id: 'T4', items: ['r', 'x', 'n', 'o', 's'] },
      { id: 'T5', items: ['y', 'r', 'x', 'z', 'q', 't', 'p'] }
    ];
    const minSup = parseFloat(options.minSup) || 40;
    const res = NumericalEngine.fpGrowth(tx, minSup);

    steps.push({
      title: "Transaction Database & F-List Ordering",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. First Scan: Frequency Counts &amp; F-List</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Total Transactions = <strong>${res.totalTransactions}</strong> | Min_Sup Count = <strong>${res.minSupCount}</strong>.
          </p>
          ${renderTable(
            ['Item', 'Support Count', 'F-List Rank', 'Status'],
            res.fList.map((f, i) => [`{ ${f.item} }`, `${f.count}`, `Rank ${i + 1}`, '<span style="color:#059669; font-weight:bold;">Frequent ✓</span>'])
          )}
        </div>
      `
    });

    steps.push({
      title: "Reordered Transactions (F-List Header Order)",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">2. Second Scan: Filtered &amp; Sorted Transactions</h4>
          ${renderTable(
            ['TID', 'Original Items', 'Filtered in F-List Order'],
            tx.map((t, idx) => [
              t.id,
              `{ ${t.items.join(', ')} }`,
              `<strong>{ ${(res.orderedTransactions[idx]?.items || []).join(', ')} }</strong>`
            ])
          )}
        </div>
      `
    });

    const cpbHeaders = ['Suffix Item', 'Conditional Pattern Base (Prefix Paths)', 'Frequent Patterns Generated'];
    const cpbRows = Object.entries(res.conditionalPatternBases).map(([suffix, paths]) => [
      `<strong>{ ${suffix} }</strong>`,
      paths.length > 0 ? paths.map(p => `{ ${p.path.join(', ')} } : ${p.count}`).join('<br>') : 'None (Direct Root)',
      res.frequentPatterns.filter(fp => fp.pattern.includes(suffix)).map(fp => `{ ${fp.pattern.join(', ')} } (sup: ${fp.count})`).join(', ')
    ]);

    steps.push({
      title: "Conditional Pattern Bases & Pattern Generation",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">3. Mining Conditional Pattern Bases</h4>
          ${renderTable(cpbHeaders, cpbRows)}
        </div>
      `
    });

    steps.push({
      title: "Frequent Pattern Growth Summary",
      html: renderFinalResultCard(
        `FP-Growth Mined ${res.frequentPatterns.length} Frequent Pattern(s)`,
        [
          { label: "Frequent Item Order (F-List)", value: res.fList.map(f => `${f.item}:${f.count}`).join(' > ') },
          { label: "Minimum Support Count Threshold", value: `${res.minSupCount}` },
          ...res.frequentPatterns.map(fp => ({ label: `Pattern {${fp.pattern.join(',')}}`, value: `Count: ${fp.count} (${fp.supportPct}%)` }))
        ],
        `FP-Growth mines frequent itemsets without expensive candidate generation. It compresses the transaction database into a prefix tree and recursively extracts conditional pattern bases bottom-up.`,
        `All generated frequent patterns satisfy support count ≥ ${res.minSupCount}.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; FP-Growth [10 Marks]</h4>
        1. <strong>First Scan &amp; F-List (3 Marks):</strong> Counted items and constructed descending frequency F-List: ${res.fList.map(f => f.item).join(', ')}.<br>
        2. <strong>FP-Tree Construction (3 Marks):</strong> Filtered transactions into header order and inserted prefix paths into FP-tree.<br>
        3. <strong>Conditional Pattern Bases (3 Marks):</strong> Extracted prefix paths for each suffix item.<br>
        4. <strong>Frequent Patterns (1 Mark):</strong> Mined frequent patterns without candidate generation.
      </div>
    `;

    practiceAnswerExpected = String(res.fList[0]?.item || 'z');
    practiceHintText = `The most frequent item appears at the top of the F-List.`;
    practiceExplanation = `Item "${practiceAnswerExpected}" has highest support count (${res.fList[0]?.count}).`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: F-List Primary Item</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          Which item has the highest frequency count and tops the F-List?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 11. SIMPLE LINEAR REGRESSION (OLS)
  // =========================================================================
  else if (algo === 'regression') {
    const pts = options.points && options.points.length >= 2 ? options.points : [
      { id: 'P1', x: 1, y: 2 }, { id: 'P2', x: 2, y: 3 }, { id: 'P3', x: 3, y: 5 },
      { id: 'P4', x: 4, y: 7 }, { id: 'P5', x: 5, y: 9 }
    ];
    const res = NumericalEngine.linearRegression(pts);

    steps.push({
      title: "Input Coordinates & Problem Setup",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Coordinate Points (N = ${pts.length})</h4>
          ${renderTable(['Sample', 'Independent (x)', 'Dependent (y)'], pts.map(p => [p.id, p.x, p.y]))}
        </div>
      `
    });

    const sumHeaders = ['i', 'x', 'y', 'x²', 'y²', 'xy'];
    const sumRows = pts.map((p, i) => [
      i + 1, p.x, p.y, Math.pow(p.x, 2), Math.pow(p.y, 2), p.x * p.y
    ]);
    sumRows.push([
      '<strong>TOTAL (∑)</strong>',
      `<strong>${res.sumX}</strong>`,
      `<strong>${res.sumY}</strong>`,
      `<strong>${res.sumX2}</strong>`,
      `<strong>${res.sumY2}</strong>`,
      `<strong>${res.sumXY}</strong>`
    ]);

    steps.push({
      title: "Summation Table (∑x, ∑y, ∑x², ∑xy)",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">2. Intermediate Arithmetic Table</h4>
          ${renderTable(sumHeaders, sumRows)}
        </div>
      `
    });

    steps.push({
      title: "Slope (m) & Intercept (c) Derivation",
      html: renderFormulaCard("Ordinary Least Squares (OLS) Equations", [
        { name: "Slope Formula (m)", formula: "m = (n·∑xy - ∑x·∑y) / (n·∑x² - (∑x)²)", vars: `m = (${res.n}·${res.sumXY} - ${res.sumX}·${res.sumY}) / (${res.n}·${res.sumX2} - (${res.sumX})²) = ${res.slope}` },
        { name: "Intercept Formula (c)", formula: "c = ȳ - m·x̄", vars: `c = ${res.meanY} - (${res.slope} · ${res.meanX}) = ${res.intercept}` },
        { name: "Coefficient of Determination (R²)", formula: "R² = 1 - (SS_res / SS_tot)", vars: `Measures proportion of variance explained by model: R² = ${res.rSquared}` }
      ])
    });

    steps.push({
      title: "Final Regression Equation & Predictions",
      html: renderFinalResultCard(
        `Fitted Model: ${res.equation}`,
        [
          { label: "Regression Equation", value: `${res.equation}` },
          { label: "Slope (Rate of change m)", value: `${res.slope}` },
          { label: "Intercept (Baseline c)", value: `${res.intercept}` },
          { label: "R-Squared (Model Fit)", value: `${(res.rSquared * 100).toFixed(2)}% (R² = ${res.rSquared})` },
          { label: "Root Mean Squared Error (RMSE)", value: `${res.rmse}` }
        ],
        `The linear regression line represents the unique line that minimizes the sum of squared vertical residuals between actual points and fitted predictions.`,
        `R² value of ${res.rSquared} indicates that ${(res.rSquared * 100).toFixed(1)}% of variance in y is predictable from x.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Linear Regression [10 Marks]</h4>
        1. <strong>Summation Table (3 Marks):</strong> Evaluated ∑x=${res.sumX}, ∑y=${res.sumY}, ∑x²=${res.sumX2}, ∑xy=${res.sumXY}.<br>
        2. <strong>Slope Derivation (3 Marks):</strong> m = (n∑xy - ∑x∑y)/(n∑x² - (∑x)²) = ${res.slope}.<br>
        3. <strong>Intercept Derivation (2 Marks):</strong> c = ȳ - m·x̄ = ${res.intercept}.<br>
        4. <strong>Final Equation &amp; R² (2 Marks):</strong> Equation is <strong>${res.equation}</strong> with R² = ${res.rSquared}.
      </div>
    `;

    practiceAnswerExpected = String(res.slope);
    practiceHintText = `Use formula: m = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²).`;
    practiceExplanation = `Slope m is calculated as ${res.slope}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Linear Regression Slope</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the calculated slope (m) of the regression equation?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 12. DISTANCE AND SIMILARITY MEASURES
  // =========================================================================
  else if (algo === 'distance') {
    const vecA = options.vecA || [1, 2, 3];
    const vecB = options.vecB || [4, 6, 8];
    const pOrder = options.p || 3;
    const res = NumericalEngine.distanceSimilarity(vecA, vecB, pOrder);

    steps.push({
      title: "Input Vectors & Component Differences",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Vectors &amp; Coordinate Breakdown</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Vector A = <strong>[${res.vecA.join(', ')}]</strong> | Vector B = <strong>[${res.vecB.join(', ')}]</strong> (${res.dimensions} dimensions)
          </p>
          ${renderTable(
            ['Dimension (i)', 'A_i', 'B_i', 'Difference (A-B)', 'Squared Difference (A-B)²', 'Product (A·B)'],
            res.breakdown.map(b => [b.dimension, b.a, b.b, b.diff, b.sqDiff, b.prod])
          )}
        </div>
      `
    });

    steps.push({
      title: "Distance & Similarity Formulas",
      html: renderFormulaCard("Distance & Similarity Metric Formulas", [
        { name: "Euclidean Distance", formula: "d_E(A, B) = √(∑ (A_i - B_i)²)", vars: "L2-Norm geometric straight-line distance" },
        { name: "Manhattan Distance", formula: "d_M(A, B) = ∑ |A_i - B_i|", vars: "L1-Norm grid / city block distance" },
        { name: "Minkowski Distance (p=3)", formula: "d_{Mink}(A, B) = (∑ |A_i - B_i|^p)^(1/p)", vars: "Generalized metric of order p" },
        { name: "Cosine Similarity", formula: "cos(θ) = (A · B) / (||A|| · ||B||)", vars: "Measures angle orientation between vectors, invariant to scale" },
        { name: "Jaccard Similarity", formula: "J(A, B) = ∑ min(A_i, B_i) / ∑ max(A_i, B_i)", vars: "Continuous Jaccard similarity coefficient" }
      ])
    });

    steps.push({
      title: "Calculated Distance & Similarity Summary",
      html: renderFinalResultCard(
        `Distance & Similarity Metrics Computed`,
        [
          { label: "Euclidean Distance (L2)", value: `${res.euclidean}` },
          { label: "Manhattan Distance (L1)", value: `${res.manhattan}` },
          { label: `Minkowski Distance (p=${res.pOrder})`, value: `${res.minkowski}` },
          { label: "Cosine Similarity", value: `${res.cosineSimilarity} (Cosine Distance: ${res.cosineDistance})` },
          { label: "Jaccard Similarity", value: `${res.jaccardSimilarity} (Jaccard Distance: ${res.jaccardDistance})` }
        ],
        `Euclidean measures straight-line distance, Manhattan measures grid steps, while Cosine captures orientation angle regardless of magnitude.`,
        `Triangle inequality and symmetry properties hold across all metric distance computations.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Distance Measures [10 Marks]</h4>
        1. <strong>Euclidean Distance (3 Marks):</strong> d_E = √∑(A_i - B_i)² = ${res.euclidean}.<br>
        2. <strong>Manhattan Distance (3 Marks):</strong> d_M = ∑|A_i - B_i| = ${res.manhattan}.<br>
        3. <strong>Cosine Similarity (2 Marks):</strong> cos(θ) = (A·B)/(||A||·||B||) = ${res.cosineSimilarity}.<br>
        4. <strong>Minkowski &amp; Jaccard (2 Marks):</strong> Minkowski(p=${res.pOrder}) = ${res.minkowski} | Jaccard = ${res.jaccardSimilarity}.
      </div>
    `;

    practiceAnswerExpected = String(res.euclidean);
    practiceHintText = `Apply Euclidean distance formula: √∑(A_i - B_i)².`;
    practiceExplanation = `Euclidean distance is ${res.euclidean}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Euclidean Distance</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the Euclidean distance between Vector A and Vector B?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 13. DATA NORMALIZATION (MIN-MAX, Z-SCORE, DECIMAL SCALING)
  // =========================================================================
  else if (algo === 'normalization') {
    const nums = options.numbers && options.numbers.length > 0 ? options.numbers : [200, 300, 400, 600, 1000];
    const method = options.method || 'minmax';
    const res = NumericalEngine.normalization(nums, method, 0, 1);
    const zRes = NumericalEngine.normalization(nums, 'zscore');

    steps.push({
      title: "Input Dataset & Summary Statistics",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Dataset Summary Statistics</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Raw Values: [${nums.join(', ')}]
          </p>
          ${renderTable(
            ['Metric', 'Calculated Value'],
            [
              ['Minimum Value (min)', res.min],
              ['Maximum Value (max)', res.max],
              ['Range (max - min)', res.max - res.min],
              ['Arithmetic Mean (μ)', res.mean],
              ['Standard Deviation (σ)', res.stdDev]
            ]
          )}
        </div>
      `
    });

    steps.push({
      title: "Normalization Formulas",
      html: renderFormulaCard("Data Normalization Mathematical Techniques", [
        { name: "Min-Max Normalization", formula: "v' = ((v - min) / (max - min)) · (new_max - new_min) + new_min", vars: "Linearly maps values into bounded interval [new_min, new_max]" },
        { name: "Z-Score Standardization", formula: "v' = (v - μ) / σ", vars: "Transforms distribution to have zero mean and unit variance" },
        { name: "Decimal Scaling", formula: "v' = v / 10^j", vars: "j is smallest integer such that Max(|v'|) < 1" }
      ])
    });

    const normHeaders = ['Raw Value (v)', 'Min-Max [0, 1]', 'Z-Score (σ units)', 'Step Substitution'];
    const normRows = nums.map((v, i) => [
      `<strong>${v}</strong>`,
      `${res.normalized[i]}`,
      `${zRes.normalized[i]}`,
      `<code>((${v} - ${res.min}) / ${res.max - res.min}) = ${res.normalized[i]}</code>`
    ]);

    steps.push({
      title: "Step-by-Step Normalized Table",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">3. Normalized Values Table</h4>
          ${renderTable(normHeaders, normRows)}
        </div>
      `
    });

    steps.push({
      title: "Normalization Results Summary",
      html: renderFinalResultCard(
        `Feature Normalization Completed`,
        [
          { label: "Original Range", value: `[${res.min}, ${res.max}]` },
          { label: "Min-Max Normalized Series [0, 1]", value: `[${res.normalized.join(', ')}]` },
          { label: "Z-Score Standardized Series", value: `[${zRes.normalized.join(', ')}]` }
        ],
        `Normalization ensures features on different numerical scales contribute proportionately to distance-based algorithms, eliminating dominance by arbitrarily large scale variables.`,
        `Minimum raw value (${res.min}) maps exactly to 0.0, and maximum raw value (${res.max}) maps to 1.0.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Normalization [10 Marks]</h4>
        1. <strong>Summary Statistics (2 Marks):</strong> min = ${res.min}, max = ${res.max}, mean = ${res.mean}, std = ${res.stdDev}.<br>
        2. <strong>Min-Max Formula &amp; Substitution (4 Marks):</strong> v' = (v - min)/(max - min). Transformed values: [${res.normalized.join(', ')}].<br>
        3. <strong>Z-Score Standardization (4 Marks):</strong> v' = (v - mean)/std. Standardized values: [${zRes.normalized.join(', ')}].
      </div>
    `;

    practiceAnswerExpected = String(res.normalized[1] || '0.125');
    practiceHintText = `Formula: (v - min) / (max - min) for the second value.`;
    practiceExplanation = `Normalized value is ${practiceAnswerExpected}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Min-Max Normalization</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the Min-Max normalized value for second data element (${nums[1]}) in [0, 1]?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 14. DATA DISCRETIZATION & BINNING
  // =========================================================================
  else if (algo === 'binning') {
    const nums = options.numbers && options.numbers.length > 0 ? options.numbers : [4, 8, 9, 15, 21, 21, 24, 25, 26, 28, 29, 34];
    const numBins = Math.min(nums.length, Math.max(1, parseInt(options.numBins) || 3));
    const widthRes = NumericalEngine.binning(nums, numBins, 'width', 'means');
    const freqRes = NumericalEngine.binning(nums, numBins, 'frequency', 'means');

    steps.push({
      title: "Sorted Dataset & Binning Parameters",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Sorted Input Data</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Dataset (${nums.length} items): [${widthRes.sorted.join(', ')}] | Number of Bins (k) = <strong>${numBins}</strong>
          </p>
          <div style="background: #eff6ff; padding: 10px 14px; border-radius: 8px; font-size: 0.88rem; color: #1e40af;">
            &bull; <strong>Equal-Width Interval:</strong> Width W = (max - min) / k = (${widthRes.sorted[widthRes.sorted.length - 1]} - ${widthRes.sorted[0]}) / ${numBins} = <strong>${((widthRes.sorted[widthRes.sorted.length - 1] - widthRes.sorted[0]) / numBins).toFixed(2)}</strong><br>
            &bull; <strong>Equal-Frequency Depth:</strong> Depth D = ⌈N / k⌉ = ⌈${nums.length} / ${numBins}⌉ = <strong>${Math.ceil(nums.length / numBins)} items/bin</strong>
          </div>
        </div>
      `
    });

    steps.push({
      title: "Equal-Width Binning & Smoothing by Means",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">Equal-Width Partition</h4>
          ${renderTable(
            ['Bin #', 'Interval Range', 'Original Values in Bin', 'Smoothed by Bin Means'],
            widthRes.bins.map(b => [
              `Bin ${b.binIndex}`,
              `[${b.min} to ${b.max}]`,
              `[${b.values.join(', ')}]`,
              `Mean = ${b.binMean} &rarr; [${b.smoothedValues.join(', ')}]`
            ])
          )}
        </div>
      `
    });

    steps.push({
      title: "Equal-Frequency (Equi-Depth) Binning",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">Equal-Frequency (Equal-Depth) Partition</h4>
          ${renderTable(
            ['Bin #', 'Values Count', 'Original Values in Bin', 'Smoothed by Bin Means'],
            freqRes.bins.map(b => [
              `Bin ${b.binIndex}`,
              `${b.values.length} items`,
              `[${b.values.join(', ')}]`,
              `Mean = ${b.binMean} &rarr; [${b.smoothedValues.join(', ')}]`
            ])
          )}
        </div>
      `
    });

    steps.push({
      title: "Binning & Discretization Summary",
      html: renderFinalResultCard(
        `Discretization into ${numBins} Bins Completed`,
        [
          { label: "Equal-Width Bin 1", value: `[${widthRes.bins[0]?.values.join(', ')}] (Mean: ${widthRes.bins[0]?.binMean})` },
          { label: "Equal-Width Bin 2", value: `[${widthRes.bins[1]?.values.join(', ')}] (Mean: ${widthRes.bins[1]?.binMean})` },
          { label: "Equal-Width Bin 3", value: `[${widthRes.bins[2]?.values.join(', ')}] (Mean: ${widthRes.bins[2]?.binMean})` }
        ],
        `Binning reduces data noise and converts continuous values into discrete categorical bands. Smoothing by bin means replaces individual elements with their cluster average.`,
        `All ${nums.length} continuous values have been partitioned into ${numBins} discrete groups.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Binning [10 Marks]</h4>
        1. <strong>Sorted Data (2 Marks):</strong> [${widthRes.sorted.join(', ')}].<br>
        2. <strong>Equal-Width Partitioning (4 Marks):</strong> Bin width W = (max - min)/k = ${((widthRes.sorted[widthRes.sorted.length - 1] - widthRes.sorted[0]) / numBins).toFixed(2)}.<br>
        3. <strong>Equal-Frequency Partitioning (4 Marks):</strong> Each bin allocated ${Math.ceil(nums.length / numBins)} items. Smoothed by bin means.
      </div>
    `;

    practiceAnswerExpected = String(widthRes.bins[0]?.binMean || '7');
    practiceHintText = `Calculate the arithmetic average of the values contained in Bin 1.`;
    practiceExplanation = `Mean of Bin 1 is ${practiceAnswerExpected}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Bin Mean Smoothing</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the smoothed mean value for Equal-Width Bin 1?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 15. OUTLIER DETECTION (INTERQUARTILE RANGE - IQR)
  // =========================================================================
  else if (algo === 'iqr') {
    const nums = options.numbers && options.numbers.length > 0 ? options.numbers : [12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65];
    const res = NumericalEngine.iqr(nums);

    steps.push({
      title: "Sorted Dataset & Quartile Positions",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Sorted Dataset (n = ${res.n})</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 10px;">
            Sorted values: [${res.sorted.join(', ')}]
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 0.88rem; line-height: 1.6;">
            &bull; <strong>Median (Q2):</strong> ${res.q2}<br>
            &bull; <strong>First Quartile (Q1 - 25th percentile):</strong> ${res.q1}<br>
            &bull; <strong>Third Quartile (Q3 - 75th percentile):</strong> ${res.q3}
          </div>
        </div>
      `
    });

    steps.push({
      title: "IQR & Boxplot Inner/Outer Fences",
      html: renderFormulaCard("Interquartile Range Outlier Fences", [
        { name: "Interquartile Range", formula: "IQR = Q3 - Q1", vars: `IQR = ${res.q3} - ${res.q1} = ${res.iqr}` },
        { name: "Lower Inner Fence", formula: "Lower Fence = Q1 - 1.5 · IQR", vars: `Lower Fence = ${res.q1} - (1.5 · ${res.iqr}) = ${res.lowerFence}` },
        { name: "Upper Inner Fence", formula: "Upper Fence = Q3 + 1.5 · IQR", vars: `Upper Fence = ${res.q3} + (1.5 · ${res.iqr}) = ${res.upperFence}` }
      ])
    });

    steps.push({
      title: "Outlier Evaluation & Five-Number Summary",
      html: renderFinalResultCard(
        res.outliers.length > 0 ? `Identified ${res.outliers.length} Outlier Point(s): [${res.outliers.join(', ')}]` : `No Outliers Detected`,
        [
          { label: "First Quartile (Q1)", value: `${res.q1}` },
          { label: "Median (Q2)", value: `${res.q2}` },
          { label: "Third Quartile (Q3)", value: `${res.q3}` },
          { label: "Interquartile Range (IQR)", value: `${res.iqr}` },
          { label: "Lower Boundary Fence", value: `${res.lowerFence}` },
          { label: "Upper Boundary Fence", value: `${res.upperFence}` },
          { label: "Detected Outlier Values", value: res.outliers.length > 0 ? `[${res.outliers.join(', ')}]` : 'None' }
        ],
        `Any value falling strictly below Lower Fence (${res.lowerFence}) or strictly above Upper Fence (${res.upperFence}) is classified as a mild outlier according to Tukey's 1.5×IQR boxplot convention.`,
        `Value ${res.outliers[0] || 'N/A'} exceeds the upper threshold: ${res.outliers[0] || 'N/A'} > ${res.upperFence}.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; IQR Outliers [10 Marks]</h4>
        1. <strong>Quartiles (3 Marks):</strong> Sorted dataset. Q1 = ${res.q1}, Median = ${res.q2}, Q3 = ${res.q3}.<br>
        2. <strong>IQR Calculation (2 Marks):</strong> IQR = Q3 - Q1 = ${res.iqr}.<br>
        3. <strong>Fences (3 Marks):</strong> Lower = Q1 - 1.5×IQR = ${res.lowerFence} | Upper = Q3 + 1.5×IQR = ${res.upperFence}.<br>
        4. <strong>Outlier Identification (2 Marks):</strong> Outliers: ${res.outliers.join(', ') || 'None'}.
      </div>
    `;

    practiceAnswerExpected = String(res.iqr);
    practiceHintText = `Formula: IQR = Q3 - Q1.`;
    practiceExplanation = `IQR = ${res.q3} - ${res.q1} = ${res.iqr}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Interquartile Range</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the calculated value of the Interquartile Range (IQR)?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 16. MODEL EVALUATION METRICS & CONFUSION MATRIX
  // =========================================================================
  else if (algo === 'metrics') {
    const cm = options.matrix || { tp: 85, fp: 15, fn: 10, tn: 90 };
    const res = NumericalEngine.evaluationMetrics(cm);

    steps.push({
      title: "Confusion Matrix & Marginal Totals",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. 2×2 Confusion Matrix (Total N = ${res.total})</h4>
          ${renderTable(
            ['', 'Predicted Positive (P)', 'Predicted Negative (N)', 'Actual Totals'],
            [
              ['Actual Positive (P)', `<strong>TP = ${res.tp}</strong>`, `FN = ${res.fn}`, `Actual P = ${res.tp + res.fn}`],
              ['Actual Negative (N)', `FP = ${res.fp}`, `<strong>TN = ${res.tn}</strong>`, `Actual N = ${res.fp + res.tn}`],
              ['Predicted Totals', `Pred P = ${res.tp + res.fp}`, `Pred N = ${res.fn + res.tn}`, `Total = ${res.total}`]
            ]
          )}
        </div>
      `
    });

    steps.push({
      title: "Metric Formulas & Substitutions",
      html: renderFormulaCard("Classifier Performance Formulas", [
        { name: "Accuracy", formula: "Accuracy = (TP + TN) / Total", vars: res.formulas.accuracy },
        { name: "Precision", formula: "Precision = TP / (TP + FP)", vars: res.formulas.precision },
        { name: "Recall / Sensitivity", formula: "Recall = TP / (TP + FN)", vars: res.formulas.recall },
        { name: "Specificity", formula: "Specificity = TN / (TN + FP)", vars: res.formulas.specificity },
        { name: "F1-Score", formula: "F1 = 2 · (Precision · Recall) / (Precision + Recall)", vars: res.formulas.f1Score }
      ])
    });

    steps.push({
      title: "Final Evaluation Scores Table",
      html: renderFinalResultCard(
        `Classifier Evaluation Summary (Accuracy: ${res.percentages.accuracy})`,
        [
          { label: "Overall Accuracy", value: `${res.percentages.accuracy} (${res.accuracy})` },
          { label: "Precision (Positive Predictive Value)", value: `${res.percentages.precision} (${res.precision})` },
          { label: "Recall / Sensitivity", value: `${res.percentages.recall} (${res.recall})` },
          { label: "Specificity (True Negative Rate)", value: `${res.percentages.specificity} (${res.specificity})` },
          { label: "Harmonic Mean F1-Score", value: `${res.percentages.f1Score} (${res.f1Score})` },
          { label: "Error Rate (1 - Accuracy)", value: `${(res.errorRate * 100).toFixed(2)}% (${res.errorRate})` }
        ],
        `Accuracy reflects overall correct classifications. High precision indicates few false alarms (low FP), while high recall indicates few missed positive cases (low FN).`,
        `Total instances N = ${res.tp} + ${res.tn} + ${res.fp} + ${res.fn} = ${res.total}. Accuracy = (${res.tp} + ${res.tn}) / ${res.total} = ${res.accuracy}.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Confusion Matrix [10 Marks]</h4>
        1. <strong>Accuracy (2 Marks):</strong> (TP + TN)/Total = ${res.accuracy} (${res.percentages.accuracy}).<br>
        2. <strong>Precision (2 Marks):</strong> TP/(TP + FP) = ${res.precision} (${res.percentages.precision}).<br>
        3. <strong>Recall / Sensitivity (2 Marks):</strong> TP/(TP + FN) = ${res.recall} (${res.percentages.recall}).<br>
        4. <strong>Specificity (2 Marks):</strong> TN/(TN + FP) = ${res.specificity} (${res.percentages.specificity}).<br>
        5. <strong>F1-Score (2 Marks):</strong> 2(P·R)/(P + R) = ${res.f1Score} (${res.percentages.f1Score}).
      </div>
    `;

    practiceAnswerExpected = String(res.accuracy);
    practiceHintText = `Formula: Accuracy = (TP + TN) / (TP + TN + FP + FN).`;
    practiceExplanation = `Accuracy = (${res.tp} + ${res.tn}) / ${res.total} = ${res.accuracy}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Overall Accuracy</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the overall classification accuracy in decimal form?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 17. DATA WAREHOUSING: OLAP OPERATIONS & DATA CUBE AGGREGATION
  // =========================================================================
  else if (algo === 'olap') {
    const cubeData = options.cubeData || [];
    const op = options.operation || 'rollup';
    const res = NumericalEngine.olapOperations(cubeData, op, options.params || {});

    steps.push({
      title: "Data Cube Schema & Base Cuboid",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Multidimensional Data Cube Dimensions</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 8px;">
            Dimensions: <strong>[${res.dimensions.join(', ')}]</strong> | Measure: <strong>"${res.measure}"</strong> | Lattice Cuboid Count = <strong>${res.totalCuboids}</strong>
          </p>
          <div style="background: #eff6ff; padding: 10px 14px; border-radius: 8px; font-size: 0.88rem; color: #1e40af;">
            <strong>Lattice of Cuboids Formula:</strong> For an n-dimensional data cube with ${res.dimensions.length} dimensions, total cuboids = <code>2^n = ${res.totalCuboids} cuboids</code> (from base cuboid at bottom to apex 0D cuboid at top).
          </div>
        </div>
      `
    });

    steps.push({
      title: "OLAP Operation Execution",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #2563eb; margin: 0 0 6px;">${res.title}</h4>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 12px;">${res.explanation}</p>
          ${renderTable(
            Object.keys(res.result[0] || {}),
            res.result.map(r => Object.values(r))
          )}
        </div>
      `
    });

    steps.push({
      title: "OLAP Aggregation Summary",
      html: renderFinalResultCard(
        `OLAP Operation Successfully Calculated`,
        [
          { label: "Operation Performed", value: `${op.toUpperCase()}` },
          { label: "Cube Dimensions Count", value: `${res.dimensions.length} dimensions` },
          { label: "Total Cuboids in Lattice", value: `${res.latticeFormula}` },
          { label: "Output Records Generated", value: `${res.resultCount} rows` }
        ],
        `OLAP provides fast multidimensional querying. Roll-up aggregates measures by climbing concept hierarchies; Slice extracts a 2D sheet along one dimension; Dice isolates a sub-cube across multiple dimensions.`,
        `Aggregations verify against the underlying relational base cuboid.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Format &bull; OLAP Operations [10 Marks]</h4>
        1. <strong>Lattice of Cuboids (3 Marks):</strong> Number of cuboids in n-dimensional cube = 2^n = ${res.totalCuboids}.<br>
        2. <strong>Operation Definition (3 Marks):</strong> ${res.explanation}.<br>
        3. <strong>Resulting Aggregation (4 Marks):</strong> Generated ${res.resultCount} aggregated rows for operation ${op}.
      </div>
    `;

    practiceAnswerExpected = String(res.totalCuboids);
    practiceHintText = `Formula: 2^n where n is the number of dimensions (${res.dimensions.length}).`;
    practiceExplanation = `Total cuboids in lattice is 2^${res.dimensions.length} = ${res.totalCuboids}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Lattice Cuboid Count</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          How many total cuboids exist in the lattice for this ${res.dimensions.length}-dimensional data cube?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  // =========================================================================
  // 18. DATA WAREHOUSING: STAR SCHEMA & FACT TABLE SIZING
  // =========================================================================
  else if (algo === 'starschema') {
    const params = options.params || { numStores: 100, daysPerYear: 365, txPerStorePerDay: 5000, retentionYears: 3, factRowBytes: 40 };
    const res = NumericalEngine.starSchemaAnalysis(params);

    steps.push({
      title: "Warehouse Parameters & Fact Grain",
      html: `
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">1. Star Schema Dimensional Parameters</h4>
          ${renderTable(
            ['Parameter', 'Specified Value', 'Description'],
            [
              ['Store Outlets Count', res.parameters.numStores, 'Number of retail store locations'],
              ['Transactions per Store / Day', res.parameters.txPerStorePerDay, 'Daily average transactions per store'],
              ['Operating Days per Year', res.parameters.daysPerYear, 'Days of operation annually'],
              ['Historical Retention Span', `${res.parameters.retentionYears} Years`, 'Total data warehouse retention period'],
              ['Fact Row Width', `${res.parameters.factRowBytes} Bytes`, 'Estimated bytes per fact record']
            ]
          )}
        </div>
      `
    });

    steps.push({
      title: "Fact Row Count & Data Volume Derivation",
      html: renderFormulaCard("Dimensional Storage Estimation Formulas", [
        { name: "Daily Fact Rows", formula: "Daily = Stores · Transactions/Day", vars: `${res.parameters.numStores} · ${res.parameters.txPerStorePerDay} = ${res.dailyFactRows.toLocaleString()} rows/day` },
        { name: "Annual Fact Rows", formula: "Annual = Daily · Days/Year", vars: `${res.dailyFactRows.toLocaleString()} · ${res.parameters.daysPerYear} = ${res.annualFactRows.toLocaleString()} rows/year` },
        { name: "Multi-Year Total Rows", formula: "Total = Annual · RetentionYears", vars: `${res.annualFactRows.toLocaleString()} · ${res.parameters.retentionYears} = ${res.totalFactRows.toLocaleString()} total fact rows` },
        { name: "Raw Fact Storage", formula: "Raw Size = TotalRows · RowBytes", vars: `${res.totalFactRows.toLocaleString()} · ${res.parameters.factRowBytes} bytes = ${res.factDataMB.toLocaleString()} MB (~${res.factDataGB} GB)` }
      ])
    });

    steps.push({
      title: "Measures Classification & Sizing Summary",
      html: renderFinalResultCard(
        `Star Schema Storage: ${res.totalWarehouseGB} GB Required`,
        [
          { label: "Total Fact Records (3 Years)", value: `${res.totalFactRows.toLocaleString()} rows` },
          { label: "Raw Fact Table Size", value: `${res.factDataGB} GB (${res.factDataMB} MB)` },
          { label: "Index & Aggregates Overhead (35%)", value: `${res.indexOverheadGB} GB` },
          { label: "Total Recommended Warehouse Disk", value: `${res.totalWarehouseGB} GB` }
        ],
        `Star schema design provides optimal query performance by surrounding a central fact table with de-normalized dimension tables. Additive measures can be rolled up across any dimension combination.`,
        `Estimated storage covers fact table rows plus necessary B-tree and bitmap index structures.`
      )
    });

    examContent = `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; font-size: 0.92rem; line-height: 1.8;">
        <h4 style="color: #1e3a8a; font-size: 1.1rem; font-weight: 800; margin: 0 0 10px;">University Exam Standard Solution &bull; Star Schema Sizing [10 Marks]</h4>
        1. <strong>Daily &amp; Annual Rows (3 Marks):</strong> Daily = ${res.dailyFactRows.toLocaleString()} rows. Annual = ${res.annualFactRows.toLocaleString()} rows.<br>
        2. <strong>Total Fact Records (3 Marks):</strong> Over ${res.parameters.retentionYears} years = ${res.totalFactRows.toLocaleString()} rows.<br>
        3. <strong>Storage Size (3 Marks):</strong> Raw data = ${res.factDataGB} GB. With 35% index overhead = ${res.totalWarehouseGB} GB.<br>
        4. <strong>Measure Types (1 Mark):</strong> Identified Additive, Semi-additive, and Non-additive measures.
      </div>
    `;

    practiceAnswerExpected = String(res.totalFactRows);
    practiceHintText = `Formula: Stores × Transactions/Day × Days/Year × RetentionYears.`;
    practiceExplanation = `Total fact records = ${res.totalFactRows.toLocaleString()}.`;
    practiceContent = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px;">
        <h4 style="color: #92400e; font-size: 1.05rem; font-weight: 800; margin: 0 0 8px;">PRACTICE PROBLEM: Fact Table Records</h4>
        <p style="font-size: 0.92rem; color: #78350f; margin-bottom: 12px;">
          What is the total number of fact table rows over the ${res.parameters.retentionYears}-year retention period?
        </p>
        <div style="display: flex; gap: 10px; max-width: 420px; margin-bottom: 12px;">
          <input type="text" id="practice-ans-input" placeholder="e.g. ${practiceAnswerExpected}" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
          <button id="btn-practice-check" class="btn btn-primary" style="background: #2563eb; color: white;">Check Answer</button>
        </div>
        <div id="practice-feedback-box" style="display: none; padding: 12px; border-radius: 8px; font-size: 0.9rem;"></div>
      </div>
    `;
  }

  return {
    steps,
    examContent,
    practiceContent,
    practiceAnswerExpected,
    practiceHintText,
    practiceExplanation
  };
}
