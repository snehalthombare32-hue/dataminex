// DataMineX - Pure Deterministic Local Numerical Engine
// 100% Free & Open-Source, No External APIs Required, Runs Locally in Browser

export const NumericalEngine = {
  // 1. K-MEANS CLUSTERING (Iterative, Convergence Checked, Full History)
  kMeans(points, k = 2, maxIter = 25, initialCentroids = null) {
    if (!points || points.length === 0) return { error: "No points provided" };
    if (Array.isArray(maxIter)) {
      initialCentroids = maxIter;
      maxIter = 25;
    }
    k = Math.max(1, Math.min(Math.floor(Number(k) || 2), points.length));

    // Initial centroids: use provided initialCentroids or select evenly spaced/first k points
    let centroids = [];
    if (Array.isArray(initialCentroids) && initialCentroids.length >= k) {
      centroids = initialCentroids.slice(0, k).map(c => ({
        x: Number(Number(c.x).toFixed(3)),
        y: Number(Number(c.y).toFixed(3))
      }));
    } else {
      const step = Math.floor(points.length / k);
      for (let i = 0; i < k; i++) {
        const pt = points[Math.min(i * step, points.length - 1)];
        centroids.push({
          x: Number(Number(pt.x).toFixed(3)),
          y: Number(Number(pt.y).toFixed(3))
        });
      }
    }

    const recordedInitialCentroids = JSON.parse(JSON.stringify(centroids));
    let iterations = [];
    let clusters = Array.from({ length: k }, () => []);
    let converged = false;
    let iter = 0;

    while (iter < maxIter && !converged) {
      iter++;
      clusters = Array.from({ length: k }, () => []);
      const pointDistances = [];

      // Step 1: Assign each point to the nearest centroid
      points.forEach((pt, pIdx) => {
        let minDist = Infinity;
        let bestCluster = 0;
        const dists = centroids.map((c, cIdx) => {
          const d = Math.hypot(pt.x - c.x, pt.y - c.y);
          if (d < minDist) {
            minDist = d;
            bestCluster = cIdx;
          }
          return Number(d.toFixed(3));
        });

        clusters[bestCluster].push({
          ...pt,
          index: pIdx,
          id: pt.id || `P${pIdx + 1}`,
          distToCentroid: Number(minDist.toFixed(3)),
          cluster: bestCluster
        });

        pointDistances.push({
          id: pt.id || `P${pIdx + 1}`,
          pointId: pt.id || `P${pIdx + 1}`,
          x: pt.x,
          y: pt.y,
          d1: dists[0],
          d2: dists[1],
          distancesToCentroids: dists,
          assignedCluster: bestCluster + 1,
          minDistance: Number(minDist.toFixed(3))
        });
      });

      // Step 2: Recalculate centroids
      let newCentroids = [];
      let maxShift = 0;
      for (let cIdx = 0; cIdx < k; cIdx++) {
        const clusterPts = clusters[cIdx];
        if (clusterPts.length === 0) {
          newCentroids.push({ ...centroids[cIdx] });
        } else {
          const avgX = clusterPts.reduce((sum, p) => sum + p.x, 0) / clusterPts.length;
          const avgY = clusterPts.reduce((sum, p) => sum + p.y, 0) / clusterPts.length;
          const shift = Math.hypot(avgX - centroids[cIdx].x, avgY - centroids[cIdx].y);
          if (shift > maxShift) maxShift = shift;
          newCentroids.push({
            x: Number(avgX.toFixed(3)),
            y: Number(avgY.toFixed(3))
          });
        }
      }

      // Step 3: Compute Sum of Squared Errors (SSE)
      let sse = 0;
      clusters.forEach((clusterPts, cIdx) => {
        const c = centroids[cIdx];
        clusterPts.forEach(p => {
          sse += Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
        });
      });

      iterations.push({
        iteration: iter,
        centroids: JSON.parse(JSON.stringify(centroids)),
        newCentroids: JSON.parse(JSON.stringify(newCentroids)),
        pointDistances,
        distanceTable: pointDistances,
        clusters: clusters.map(c => c.map(p => ({ id: p.id || `P${p.index + 1}`, x: p.x, y: p.y }))),
        clustersCount: clusters.map(c => c.length),
        sse: Number(sse.toFixed(3)),
        shift: Number(maxShift.toFixed(3)),
        maxShift: Number(maxShift.toFixed(3))
      });

      if (maxShift < 0.001) {
        converged = true;
      }
      centroids = newCentroids;
    }

    // Final cluster points with assigned centroid coordinates
    const finalClusters = clusters.map((cList, cIdx) => {
      const cent = centroids[cIdx];
      return cList.map(p => ({
        ...p,
        centroidX: cent.x,
        centroidY: cent.y
      }));
    });

    return {
      success: true,
      k,
      totalIterations: iter,
      converged,
      tolerance: 0.001,
      initialCentroids: recordedInitialCentroids,
      finalCentroids: centroids,
      clusters: finalClusters,
      history: iterations,
      sse: iterations.length > 0 ? iterations[iterations.length - 1].sse : 0
    };
  },

  // 2. K-MEDOIDS (PAM Algorithm)
  kMedoids(points, k = 2, maxIter = 15) {
    if (!points || points.length === 0) return { error: "No points provided" };
    k = Math.max(1, Math.min(Math.floor(Number(k) || 2), points.length));

    // Initial medoids are actual data points
    let medoids = points.slice(0, k).map((p, i) => ({ ...p, id: p.id || `P${i + 1}` }));
    let iter = 0;
    let converged = false;
    let iterations = [];

    const computeCost = (meds) => {
      let totalCost = 0;
      points.forEach(pt => {
        let minDist = Math.min(...meds.map(m => Math.hypot(pt.x - m.x, pt.y - m.y)));
        totalCost += minDist;
      });
      return Number(totalCost.toFixed(3));
    };

    let currentCost = computeCost(medoids);

    while (iter < maxIter && !converged) {
      iter++;
      let improved = false;
      let evaluatedSwaps = [];

      for (let mIdx = 0; mIdx < k; mIdx++) {
        for (let pIdx = 0; pIdx < points.length; pIdx++) {
          const candidate = points[pIdx];
          const isCurrentMedoid = medoids.some(m => m.id === candidate.id || (m.x === candidate.x && m.y === candidate.y));
          if (isCurrentMedoid) continue;

          let testMedoids = [...medoids];
          testMedoids[mIdx] = { ...candidate, id: candidate.id || `P${pIdx + 1}` };
          const testCost = computeCost(testMedoids);
          const costDiff = Number((testCost - currentCost).toFixed(3));

          evaluatedSwaps.push({
            currentMedoid: medoids[mIdx].id,
            candidatePoint: candidate.id || `P${pIdx + 1}`,
            newCost: testCost,
            costDiff
          });

          if (testCost < currentCost - 0.001) {
            currentCost = testCost;
            medoids = testMedoids;
            improved = true;
            break;
          }
        }
        if (improved) break;
      }

      iterations.push({
        iteration: iter,
        medoids: JSON.parse(JSON.stringify(medoids)),
        totalCost: currentCost,
        swapsCount: evaluatedSwaps.length,
        evaluatedSwaps: evaluatedSwaps.slice(0, 8)
      });

      if (!improved) converged = true;
    }

    // Final assignments
    let clusters = Array.from({ length: k }, () => []);
    points.forEach((pt, pIdx) => {
      let minDist = Infinity;
      let bestCluster = 0;
      medoids.forEach((m, mIdx) => {
        const d = Math.hypot(pt.x - m.x, pt.y - m.y);
        if (d < minDist) {
          minDist = d;
          bestCluster = mIdx;
        }
      });
      clusters[bestCluster].push({
        ...pt,
        id: pt.id || `P${pIdx + 1}`,
        distance: Number(minDist.toFixed(3)),
        assignedMedoid: medoids[bestCluster].id
      });
    });

    return {
      success: true,
      k,
      totalIterations: iter,
      converged,
      finalMedoids: medoids,
      clusters,
      totalCost: currentCost,
      history: iterations
    };
  },

  // 3. HIERARCHICAL AGGLOMERATIVE CLUSTERING (Distance Matrix & Dendrogram Tree)
  hierarchicalClustering(points, linkage = 'single') {
    if (!points || points.length < 2) return { error: "At least 2 points needed" };

    const cleanPoints = points.map((p, i) => ({
      id: p.id || `P${i + 1}`,
      x: Number(p.x) || 0,
      y: Number(p.y) || 0
    }));

    // Initial Pairwise Distance Matrix
    const initialMatrix = cleanPoints.map(p1 =>
      cleanPoints.map(p2 => Number(Math.hypot(p1.x - p2.x, p1.y - p2.y).toFixed(3)))
    );

    let currentClusters = cleanPoints.map((p, i) => ({
      id: p.id,
      points: [p],
      label: p.id,
      height: 0,
      children: null
    }));

    let steps = [];
    let stepCount = 0;

    while (currentClusters.length > 1) {
      stepCount++;
      let minDistance = Infinity;
      let mergeA = -1;
      let mergeB = -1;

      for (let i = 0; i < currentClusters.length; i++) {
        for (let j = i + 1; j < currentClusters.length; j++) {
          let dist = 0;
          const ptsA = currentClusters[i].points;
          const ptsB = currentClusters[j].points;

          if (linkage === 'single') {
            dist = Infinity;
            ptsA.forEach(a => ptsB.forEach(b => {
              const d = Math.hypot(a.x - b.x, a.y - b.y);
              if (d < dist) dist = d;
            }));
          } else if (linkage === 'complete') {
            dist = -Infinity;
            ptsA.forEach(a => ptsB.forEach(b => {
              const d = Math.hypot(a.x - b.x, a.y - b.y);
              if (d > dist) dist = d;
            }));
          } else {
            // Average linkage
            let sum = 0;
            ptsA.forEach(a => ptsB.forEach(b => {
              sum += Math.hypot(a.x - b.x, a.y - b.y);
            }));
            dist = sum / (ptsA.length * ptsB.length);
          }

          if (dist < minDistance) {
            minDistance = dist;
            mergeA = i;
            mergeB = j;
          }
        }
      }

      const clusterA = currentClusters[mergeA];
      const clusterB = currentClusters[mergeB];
      const mergeDist = Number(minDistance.toFixed(3));

      const newCluster = {
        id: `M${stepCount}`,
        points: [...clusterA.points, ...clusterB.points],
        label: `(${clusterA.label} + ${clusterB.label})`,
        height: mergeDist,
        children: [clusterA, clusterB]
      };

      steps.push({
        step: stepCount,
        clusterA: clusterA.label,
        clusterB: clusterB.label,
        mergedLabel: newCluster.label,
        distance: mergeDist,
        remainingCount: currentClusters.length - 1
      });

      currentClusters = currentClusters.filter((_, idx) => idx !== mergeA && idx !== mergeB);
      currentClusters.push(newCluster);
    }

    return {
      success: true,
      points: cleanPoints,
      linkage,
      initialMatrix,
      steps,
      finalTree: currentClusters[0]
    };
  },

  getHierarchicalClustersAtCut(tree, cutHeight) {
    if (!tree) return [];
    const clusters = [];
    const traverse = (node) => {
      if (!node.children || node.height <= cutHeight) {
        clusters.push({
          label: node.label,
          points: node.points || [],
          height: node.height
        });
        return;
      }
      node.children.forEach(child => traverse(child));
    };
    traverse(tree);
    return clusters;
  },

  // 4. DBSCAN CLUSTERING
  dbscan(points, eps = 3, minPts = 2) {
    if (!points || points.length === 0) return { error: "No points provided" };
    eps = Math.max(0.01, Number(eps) || 3);
    minPts = Math.max(1, Math.floor(Number(minPts) || 2));

    const cleanPoints = points.map((p, i) => ({
      id: p.id || `P${i + 1}`,
      x: Number(p.x) || 0,
      y: Number(p.y) || 0
    }));

    const visited = new Set();
    const clusters = [];
    const noise = [];
    const pointTypes = {};
    const neighborhoods = {};

    const getNeighbors = (p) => {
      return cleanPoints.filter(other => Math.hypot(p.x - other.x, p.y - other.y) <= eps);
    };

    cleanPoints.forEach(p => {
      const pKey = p.id;
      const neighbors = getNeighbors(p);
      neighborhoods[pKey] = neighbors.map(n => n.id);
    });

    let clusterId = 0;

    cleanPoints.forEach(p => {
      const pKey = p.id;
      if (visited.has(pKey)) return;
      visited.add(pKey);

      const neighbors = getNeighbors(p);

      if (neighbors.length < minPts) {
        noise.push(p);
        pointTypes[pKey] = 'noise';
      } else {
        pointTypes[pKey] = 'core';
        clusterId++;
        const currentCluster = [p];

        let queue = [...neighbors.filter(n => n.id !== pKey)];

        for (let i = 0; i < queue.length; i++) {
          const q = queue[i];
          const qKey = q.id;

          if (!visited.has(qKey)) {
            visited.add(qKey);
            const qNeighbors = getNeighbors(q);
            if (qNeighbors.length >= minPts) {
              pointTypes[qKey] = 'core';
              qNeighbors.forEach(qn => {
                if (!queue.some(item => item.id === qn.id)) {
                  queue.push(qn);
                }
              });
            } else {
              pointTypes[qKey] = 'border';
            }
          }

          if (!clusters.some(c => c.some(cp => cp.id === qKey))) {
            currentCluster.push(q);
          }
        }

        clusters.push(currentCluster);
      }
    });

    return {
      success: true,
      eps,
      minPts,
      totalClusters: clusters.length,
      clusters,
      noise: noise.filter(n => !clusters.some(c => c.some(p => p.id === n.id))),
      pointTypes,
      neighborhoods
    };
  },

  // 5. ID3 DECISION TREE (Entropy & Information Gain)
  id3Entropy(data, targetAttr = 'Play') {
    if (!data || data.length === 0) return { error: "No training data" };

    const calcEntropy = (rows) => {
      const counts = {};
      rows.forEach(r => {
        const val = String(r[targetAttr] || '');
        counts[val] = (counts[val] || 0) + 1;
      });
      const total = rows.length;
      let ent = 0;
      for (const val in counts) {
        const p = counts[val] / total;
        if (p > 0) ent -= p * Math.log2(p);
      }
      return Number(ent.toFixed(4));
    };

    const systemEntropy = calcEntropy(data);
    const attributes = Object.keys(data[0]).filter(k => k !== targetAttr && k !== 'id' && k !== 'Day' && k !== 'ID');

    const gains = attributes.map(attr => {
      const distinctVals = [...new Set(data.map(d => String(d[attr] || '')))].sort();
      let weightedEntropy = 0;
      const breakdowns = [];

      distinctVals.forEach(v => {
        const subset = data.filter(d => String(d[attr] || '') === v);
        const subEntropy = calcEntropy(subset);
        const weight = subset.length / data.length;
        weightedEntropy += weight * subEntropy;

        const classCounts = {};
        subset.forEach(r => {
          const c = String(r[targetAttr] || '');
          classCounts[c] = (classCounts[c] || 0) + 1;
        });

        breakdowns.push({
          value: v,
          count: subset.length,
          classCounts,
          entropy: subEntropy,
          weight: Number(weight.toFixed(4))
        });
      });

      const gain = Number((systemEntropy - weightedEntropy).toFixed(4));
      return {
        attribute: attr,
        systemEntropy,
        expectedEntropy: Number(weightedEntropy.toFixed(4)),
        informationGain: gain,
        gain,
        breakdowns
      };
    });

    gains.sort((a, b) => b.informationGain - a.informationGain);
    const bestAttribute = gains[0] || { attribute: attributes[0] || '', informationGain: 0 };

    return {
      success: true,
      systemEntropy,
      targetAttribute: targetAttr,
      attributes,
      gains,
      bestSplitAttribute: bestAttribute.attribute,
      bestAttribute: bestAttribute.attribute,
      highestGain: bestAttribute.informationGain,
      bestGain: bestAttribute.informationGain
    };
  },

  buildDecisionTree(data, targetAttr, maxDepth = 4) {
    if (!data || data.length === 0) return null;
    if (!targetAttr) targetAttr = Object.keys(data[0]).pop();

    const calcEntropy = (rows) => {
      const counts = {};
      rows.forEach(r => { const val = String(r[targetAttr] || ''); counts[val] = (counts[val] || 0) + 1; });
      let ent = 0;
      for (const val in counts) {
        const p = counts[val] / rows.length;
        if (p > 0) ent -= p * Math.log2(p);
      }
      return Number(ent.toFixed(4));
    };

    const buildSubTree = (rows, availableAttrs, depth) => {
      const classCounts = {};
      rows.forEach(r => { const c = String(r[targetAttr] || ''); classCounts[c] = (classCounts[c] || 0) + 1; });
      const distinctClasses = Object.keys(classCounts);
      const majorityClass = distinctClasses.sort((a, b) => classCounts[b] - classCounts[a])[0] || 'Unknown';

      // Pure node
      if (distinctClasses.length === 1) {
        return { type: 'leaf', prediction: distinctClasses[0], classCounts, samples: rows.length, entropy: 0 };
      }
      // No remaining attributes or reached max depth
      if (availableAttrs.length === 0 || depth >= maxDepth) {
        return { type: 'leaf', prediction: majorityClass, classCounts, samples: rows.length, entropy: calcEntropy(rows) };
      }

      const sysEntropy = calcEntropy(rows);
      let bestGain = -1;
      let bestAttr = availableAttrs[0];

      availableAttrs.forEach(attr => {
        const distinctVals = [...new Set(rows.map(d => String(d[attr] || '')))];
        let weightedEnt = 0;
        distinctVals.forEach(v => {
          const subset = rows.filter(d => String(d[attr] || '') === v);
          weightedEnt += (subset.length / rows.length) * calcEntropy(subset);
        });
        const gain = sysEntropy - weightedEnt;
        if (gain > bestGain) {
          bestGain = gain;
          bestAttr = attr;
        }
      });

      const node = {
        type: 'node',
        attribute: bestAttr,
        entropy: sysEntropy,
        gain: Number(bestGain.toFixed(4)),
        samples: rows.length,
        classCounts,
        children: {}
      };

      const remainingAttrs = availableAttrs.filter(a => a !== bestAttr);
      const distinctBranchVals = [...new Set(rows.map(d => String(d[bestAttr] || '')))].sort();

      distinctBranchVals.forEach(v => {
        const subset = rows.filter(d => String(d[bestAttr] || '') === v);
        if (subset.length === 0) {
          node.children[v] = { type: 'leaf', prediction: majorityClass, classCounts: {}, samples: 0, entropy: 0 };
        } else {
          node.children[v] = buildSubTree(subset, remainingAttrs, depth + 1);
        }
      });

      return node;
    };

    const attributes = Object.keys(data[0]).filter(k => k !== targetAttr && k !== 'id' && k !== 'Day' && k !== 'ID');
    const root = buildSubTree(data, attributes, 0);
    return {
      success: true,
      targetAttribute: targetAttr,
      root,
      totalInstances: data.length
    };
  },

  // 6. NAIVE BAYES CLASSIFIER
  naiveBayes(data, targetAttr, testInstance) {
    if (!data || data.length === 0) return { error: "No data provided" };
    if (!targetAttr) return { error: "Target attribute required" };

    const classes = [...new Set(data.map(d => String(d[targetAttr] || '')))].filter(Boolean).sort();
    const totalRows = data.length;

    const classPriors = {};
    classes.forEach(c => {
      const count = data.filter(d => String(d[targetAttr] || '') === c).length;
      classPriors[c] = {
        count,
        prior: count / totalRows,
        priorPct: Number(((count / totalRows) * 100).toFixed(2))
      };
    });

    const likelihoods = {};
    const featureKeys = Object.keys(testInstance || {}).filter(k => k !== targetAttr && k !== 'id');

    classes.forEach(c => {
      const classRows = data.filter(d => String(d[targetAttr] || '') === c);
      likelihoods[c] = {
        features: {},
        rawScore: classPriors[c].prior
      };

      featureKeys.forEach(f => {
        const val = String(testInstance[f] || '');
        const matchCount = classRows.filter(r => String(r[f] || '') === val).length;
        const distinctFeatureVals = [...new Set(data.map(d => String(d[f] || '')))].length;
        // Laplace smoothing (+1)
        const prob = (matchCount + 1) / (classRows.length + distinctFeatureVals);
        likelihoods[c].features[f] = {
          value: val,
          count: matchCount,
          total: classRows.length,
          vocabSize: distinctFeatureVals,
          probability: Number(prob.toFixed(4))
        };
        likelihoods[c].rawScore *= prob;
      });
      likelihoods[c].rawScore = Number(likelihoods[c].rawScore.toFixed(8));
      likelihoods[c].score = likelihoods[c].rawScore;
    });

    const sumScores = Object.values(likelihoods).reduce((sum, item) => sum + item.rawScore, 0);
    const posteriors = {};
    const normalizedProbabilities = {};
    const priorProbabilities = {};
    let predictedClass = classes[0];
    let maxPosterior = -1;

    classes.forEach(c => {
      priorProbabilities[c] = classPriors[c].prior;
      const post = sumScores > 0 ? likelihoods[c].rawScore / sumScores : 1 / classes.length;
      posteriors[c] = Number(post.toFixed(4));
      normalizedProbabilities[c] = `${(post * 100).toFixed(1)}%`;
      if (post > maxPosterior) {
        maxPosterior = post;
        predictedClass = c;
      }
    });

    return {
      success: true,
      targetAttr,
      classes,
      classPriors,
      priorProbabilities,
      likelihoods,
      posteriors,
      normalizedProbabilities,
      predictedClass,
      prediction: predictedClass,
      confidence: `${(maxPosterior * 100).toFixed(1)}%`
    };
  },

  // 7. UNIFIED K-NEAREST NEIGHBORS (Supports 2D Points & Tabular Datasets)
  knn(trainData, testPoint, k = 3, featureCols = null, targetCol = null, distanceMetric = 'euclidean') {
    if (!trainData || trainData.length === 0) return { error: "No training data provided." };
    if (!testPoint) return { error: "Test instance is required." };
    k = Math.max(1, Math.min(parseInt(k) || 3, trainData.length));

    // Mode A: Multi-feature tabular dataset
    if (featureCols && Array.isArray(featureCols) && featureCols.length > 0 && targetCol) {
      const distances = trainData.map((row, idx) => {
        let sumSq = 0;
        featureCols.forEach(col => {
          const a = Number(row[col]) || 0;
          const b = Number(testPoint[col]) || 0;
          sumSq += Math.pow(a - b, 2);
        });
        const dist = Math.sqrt(sumSq);
        return {
          index: idx,
          distance: Number(dist.toFixed(4)),
          label: String(row[targetCol] || ''),
          row
        };
      });

      distances.sort((a, b) => a.distance - b.distance);
      const kNearest = distances.slice(0, k);

      const votes = {};
      kNearest.forEach(n => { votes[n.label] = (votes[n.label] || 0) + 1; });
      const predictedClass = Object.keys(votes).reduce((a, b) => votes[a] >= votes[b] ? a : b);

      return {
        success: true,
        k,
        predictedClass,
        prediction: predictedClass,
        votes,
        kNearest: kNearest.map(n => ({
          index: n.index,
          distance: n.distance,
          label: n.label
        })),
        neighbors: kNearest.map(n => ({
          ...n.row,
          distance: n.distance,
          label: n.label
        })),
        allDistances: distances,
        confidence: `${((votes[predictedClass] / k) * 100).toFixed(1)}%`
      };
    }

    // Mode B: 2D coordinate points
    const isManhattan = distanceMetric === 'manhattan';
    const tx = Number(testPoint.x !== undefined ? testPoint.x : testPoint[0]) || 0;
    const ty = Number(testPoint.y !== undefined ? testPoint.y : testPoint[1]) || 0;

    const distances = trainData.map((row, idx) => {
      const rx = Number(row.x !== undefined ? row.x : row[0]) || 0;
      const ry = Number(row.y !== undefined ? row.y : row[1]) || 0;
      const dist = isManhattan
        ? Math.abs(rx - tx) + Math.abs(ry - ty)
        : Math.hypot(rx - tx, ry - ty);
      const label = row.label || row.class || row.target || `Class ${(idx % 2) + 1}`;
      return {
        ...row,
        id: row.id || `P${idx + 1}`,
        x: rx,
        y: ry,
        index: idx,
        distance: Number(dist.toFixed(4)),
        label
      };
    });

    distances.sort((a, b) => a.distance - b.distance);
    const neighbors = distances.slice(0, k);

    const votes = {};
    neighbors.forEach(n => {
      votes[n.label] = (votes[n.label] || 0) + 1;
    });

    let bestClass = Object.keys(votes)[0];
    let maxVotes = -1;
    for (const c in votes) {
      if (votes[c] > maxVotes) {
        maxVotes = votes[c];
        bestClass = c;
      }
    }

    return {
      success: true,
      k,
      distanceMetric,
      testPoint: { x: tx, y: ty },
      neighbors,
      kNearest: neighbors.map(n => ({
        index: n.index,
        distance: n.distance,
        label: n.label
      })),
      votes,
      predictedClass: bestClass,
      prediction: bestClass,
      confidence: `${((maxVotes / k) * 100).toFixed(1)}%`,
      allDistances: distances
    };
  },

  // 8. APRIORI ALGORITHM (1, 2, and 3-Itemsets, Support, Confidence, Lift)
  apriori(transactions, minSupPercent = 40, minConfPercent = 60) {
    if (!transactions || transactions.length === 0) return { error: "No transactions provided" };
    minSupPercent = Math.max(1, Math.min(100, Number(minSupPercent) || 40));
    minConfPercent = Math.max(1, Math.min(100, Number(minConfPercent) || 60));
    const N = transactions.length;
    const minSupCount = Math.ceil((minSupPercent / 100) * N);

    // Normalize transaction items to trimmed unique arrays
    const cleanTx = transactions.map((t, idx) => {
      const items = Array.isArray(t.items) ? t.items : (Array.isArray(t) ? t : String(t.items || t).split(','));
      return {
        id: t.id || `T${idx + 1}`,
        items: [...new Set(items.map(i => String(i).trim()).filter(Boolean))].sort()
      };
    });

    // C1: Count all distinct items
    const C1Counts = {};
    cleanTx.forEach(t => {
      t.items.forEach(item => {
        C1Counts[item] = (C1Counts[item] || 0) + 1;
      });
    });

    const C1 = Object.keys(C1Counts).sort().map(item => ({
      item,
      count: C1Counts[item],
      supportPct: Number(((C1Counts[item] / N) * 100).toFixed(1))
    }));

    // L1: Frequent 1-itemsets
    const L1 = C1.filter(c => c.count >= minSupCount);
    const frequentItems = L1.map(l => l.item);

    // C2: 2-item combinations
    const C2Counts = {};
    for (let i = 0; i < frequentItems.length; i++) {
      for (let j = i + 1; j < frequentItems.length; j++) {
        const pair = [frequentItems[i], frequentItems[j]].sort();
        const key = pair.join(' + ');
        C2Counts[key] = 0;
      }
    }

    cleanTx.forEach(t => {
      const items = t.items.filter(i => frequentItems.includes(i));
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const key = `${items[i]} + ${items[j]}`;
          if (C2Counts[key] !== undefined) {
            C2Counts[key]++;
          }
        }
      }
    });

    const C2 = Object.keys(C2Counts).map(pair => ({
      pair,
      count: C2Counts[pair],
      supportPct: Number(((C2Counts[pair] / N) * 100).toFixed(1))
    }));

    const L2 = C2.filter(c => c.count >= minSupCount);

    // C3 / L3: 3-item combinations (if applicable)
    const C3Counts = {};
    const L2Pairs = L2.map(l => l.pair.split(' + '));
    const itemsInL2 = [...new Set(L2Pairs.flat())].sort();

    for (let i = 0; i < itemsInL2.length; i++) {
      for (let j = i + 1; j < itemsInL2.length; j++) {
        for (let kIdx = j + 1; kIdx < itemsInL2.length; kIdx++) {
          const triplet = [itemsInL2[i], itemsInL2[j], itemsInL2[kIdx]].sort();
          // Check that all 2-subsets are frequent in L2 (Apriori property)
          const sub1 = `${triplet[0]} + ${triplet[1]}`;
          const sub2 = `${triplet[0]} + ${triplet[2]}`;
          const sub3 = `${triplet[1]} + ${triplet[2]}`;
          if (C2Counts[sub1] >= minSupCount && C2Counts[sub2] >= minSupCount && C2Counts[sub3] >= minSupCount) {
            C3Counts[triplet.join(' + ')] = 0;
          }
        }
      }
    }

    cleanTx.forEach(t => {
      Object.keys(C3Counts).forEach(tripletKey => {
        const triplet = tripletKey.split(' + ');
        if (triplet.every(item => t.items.includes(item))) {
          C3Counts[tripletKey]++;
        }
      });
    });

    const C3 = Object.keys(C3Counts).map(triplet => ({
      triplet,
      count: C3Counts[triplet],
      supportPct: Number(((C3Counts[triplet] / N) * 100).toFixed(1))
    }));

    const L3 = C3.filter(c => c.count >= minSupCount);

    // Generate Association Rules
    const rules = [];

    // Rules from L2
    L2.forEach(itemset => {
      const [itemA, itemB] = itemset.pair.split(' + ');
      const supAB = itemset.count / N;

      // Rule A -> B
      const confAtoB = (itemset.count / C1Counts[itemA]) * 100;
      const liftAtoB = supAB / ((C1Counts[itemA] / N) * (C1Counts[itemB] / N));
      if (confAtoB >= minConfPercent) {
        rules.push({
          rule: `${itemA} ➔ ${itemB}`,
          antecedent: itemA,
          consequent: itemB,
          support: itemset.supportPct,
          confidence: Number(confAtoB.toFixed(1)),
          lift: Number(liftAtoB.toFixed(2))
        });
      }

      // Rule B -> A
      const confBtoA = (itemset.count / C1Counts[itemB]) * 100;
      const liftBtoA = supAB / ((C1Counts[itemB] / N) * (C1Counts[itemA] / N));
      if (confBtoA >= minConfPercent) {
        rules.push({
          rule: `${itemB} ➔ ${itemA}`,
          antecedent: itemB,
          consequent: itemA,
          support: itemset.supportPct,
          confidence: Number(confBtoA.toFixed(1)),
          lift: Number(liftBtoA.toFixed(2))
        });
      }
    });

    // Rules from L3
    L3.forEach(itemset => {
      const items = itemset.triplet.split(' + ');
      const supABC = itemset.count / N;

      // 1 item -> 2 items
      items.forEach(ant => {
        const cons = items.filter(i => i !== ant).join(' + ');
        const conf = (itemset.count / C1Counts[ant]) * 100;
        const consCount = C2Counts[cons] || 0;
        const lift = consCount > 0 ? supABC / ((C1Counts[ant] / N) * (consCount / N)) : 1;
        if (conf >= minConfPercent) {
          rules.push({
            rule: `${ant} ➔ ${cons}`,
            antecedent: ant,
            consequent: cons,
            support: itemset.supportPct,
            confidence: Number(conf.toFixed(1)),
            lift: Number(lift.toFixed(2))
          });
        }
      });

      // 2 items -> 1 item
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const ant = `${items[i]} + ${items[j]}`;
          const cons = items.find(item => item !== items[i] && item !== items[j]);
          const antCount = C2Counts[ant] || 0;
          if (antCount > 0) {
            const conf = (itemset.count / antCount) * 100;
            const lift = supABC / ((antCount / N) * (C1Counts[cons] / N));
            if (conf >= minConfPercent) {
              rules.push({
                rule: `${ant} ➔ ${cons}`,
                antecedent: ant,
                consequent: cons,
                support: itemset.supportPct,
                confidence: Number(conf.toFixed(1)),
                lift: Number(lift.toFixed(2))
              });
            }
          }
        }
      }
    });

    // Populate standardized rule properties
    const formattedRules = rules.map(r => ({
      ...r,
      supportPercentage: r.support,
      confidencePercentage: r.confidence,
      antecedent: Array.isArray(r.antecedent) ? r.antecedent : String(r.antecedent).split(' + '),
      consequent: Array.isArray(r.consequent) ? r.consequent : String(r.consequent).split(' + ')
    }));

    const steps = [
      {
        k: 1,
        title: "Candidate Generation C1 & Frequent Itemsets L1",
        candidateItemsets: C1.map(c => ({ itemset: [c.item], supportCount: c.count, supportPercentage: c.supportPct })),
        frequentItemsets: L1.map(l => ({ itemset: [l.item], supportCount: l.count, supportPercentage: l.supportPct }))
      },
      {
        k: 2,
        title: "Candidate Generation C2 & Frequent Itemsets L2",
        candidateItemsets: C2.map(c => ({ itemset: c.pair.split(' + '), supportCount: c.count, supportPercentage: c.supportPct })),
        frequentItemsets: L2.map(l => ({ itemset: l.pair.split(' + '), supportCount: l.count, supportPercentage: l.supportPct }))
      }
    ];

    if (C3.length > 0) {
      steps.push({
        k: 3,
        title: "Candidate Generation C3 & Frequent Itemsets L3",
        candidateItemsets: C3.map(c => ({ itemset: c.triplet.split(' + '), supportCount: c.count, supportPercentage: c.supportPct })),
        frequentItemsets: L3.map(l => ({ itemset: l.triplet.split(' + '), supportCount: l.count, supportPercentage: l.supportPct }))
      });
    }

    return {
      success: true,
      totalTransactions: N,
      minSupPercent,
      minConfPercent,
      minSupCount,
      candidates: { C1, C2, C3 },
      frequent1Itemsets: L1,
      frequent2Itemsets: L2,
      frequent3Itemsets: L3,
      steps,
      rules: formattedRules
    };
  },

  // 9. SIMPLE LINEAR REGRESSION (OLS)
  linearRegression(points) {
    if (!points || points.length < 2) return { error: "At least 2 points needed" };
    const n = points.length;

    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

    const meanX = sumX / n;
    const meanY = sumY / n;

    const numerator = n * sumXY - sumX * sumY;
    const denominator = n * sumX2 - sumX * sumX;

    if (denominator === 0) return { error: "Vertical line (undefined slope)" };

    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    let ssTot = 0;
    let ssRes = 0;
    const residuals = points.map((p, idx) => {
      const predY = slope * p.x + intercept;
      const res = p.y - predY;
      ssTot += Math.pow(p.y - meanY, 2);
      ssRes += Math.pow(res, 2);
      return {
        id: p.id || `P${idx + 1}`,
        x: p.x,
        actualY: p.y,
        predictedY: Number(predY.toFixed(3)),
        residual: Number(res.toFixed(3))
      };
    });

    const r2 = ssTot !== 0 ? Math.max(0, Math.min(1, 1 - (ssRes / ssTot))) : 1;
    const mse = ssRes / n;
    const rmse = Math.sqrt(mse);

    const table = points.map((p, idx) => ({
      i: idx + 1,
      id: p.id || `P${idx + 1}`,
      x: p.x,
      y: p.y,
      x2: Number((p.x * p.x).toFixed(2)),
      y2: Number((p.y * p.y).toFixed(2)),
      xy: Number((p.x * p.y).toFixed(2))
    }));

    const steps = {
      table,
      sumX: Number(sumX.toFixed(2)),
      sumY: Number(sumY.toFixed(2)),
      sumXY: Number(sumXY.toFixed(2)),
      sumX2: Number(sumX2.toFixed(2)),
      sumY2: Number(sumY2.toFixed(2)),
      meanX: Number(meanX.toFixed(2)),
      meanY: Number(meanY.toFixed(2)),
      n,
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(4)),
      equation: `y = ${slope.toFixed(2)}x ${intercept >= 0 ? '+ ' + intercept.toFixed(2) : '- ' + Math.abs(intercept).toFixed(2)}`,
      rSquared: Number(r2.toFixed(4))
    };

    return {
      success: true,
      n,
      sumX: Number(sumX.toFixed(2)),
      sumY: Number(sumY.toFixed(2)),
      sumXY: Number(sumXY.toFixed(2)),
      sumX2: Number(sumX2.toFixed(2)),
      sumY2: Number(sumY2.toFixed(2)),
      meanX: Number(meanX.toFixed(2)),
      meanY: Number(meanY.toFixed(2)),
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(4)),
      equation: `y = ${slope.toFixed(2)}x ${intercept >= 0 ? '+ ' + intercept.toFixed(2) : '- ' + Math.abs(intercept).toFixed(2)}`,
      r2: Number(r2.toFixed(4)),
      rSquared: Number(r2.toFixed(4)),
      mse: Number(mse.toFixed(4)),
      rmse: Number(rmse.toFixed(4)),
      residuals,
      steps,
      predict: (valX) => Number((slope * Number(valX) + intercept).toFixed(4))
    };
  },

  // 10. DATA NORMALIZATION (Min-Max, Z-Score, Decimal Scaling)
  normalization(numbers, method = 'minmax', newMin = 0, newMax = 1) {
    if (!numbers || numbers.length === 0) return { error: "No numbers provided" };

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);

    let normalized = [];
    const stepDerivations = [];

    if (method === 'minmax') {
      const range = max - min;
      normalized = numbers.map((v, i) => {
        if (range === 0) return newMin;
        const norm = ((v - min) / range) * (newMax - newMin) + newMin;
        const val = Number(norm.toFixed(4));
        stepDerivations.push({
          raw: v,
          formula: `((${v} - ${min}) / (${max} - ${min})) × (${newMax} - ${newMin}) + ${newMin}`,
          result: val
        });
        return val;
      });
    } else if (method === 'zscore') {
      normalized = numbers.map((v, i) => {
        if (stdDev === 0) return 0;
        const z = (v - mean) / stdDev;
        const val = Number(z.toFixed(4));
        stepDerivations.push({
          raw: v,
          formula: `(${v} - ${mean.toFixed(2)}) / ${stdDev.toFixed(2)}`,
          result: val
        });
        return val;
      });
    } else if (method === 'decimal') {
      const maxAbs = Math.max(...numbers.map(Math.abs));
      const j = maxAbs > 0 ? Math.ceil(Math.log10(maxAbs + 1)) : 1;
      const divisor = Math.pow(10, j);
      normalized = numbers.map(v => {
        const val = Number((v / divisor).toFixed(4));
        stepDerivations.push({
          raw: v,
          formula: `${v} / 10^${j}`,
          result: val
        });
        return val;
      });
    }

    return {
      success: true,
      method,
      min,
      max,
      mean: Number(mean.toFixed(3)),
      stdDev: Number(stdDev.toFixed(3)),
      raw: numbers,
      normalized,
      stepDerivations
    };
  },

  // 11. INTERQUARTILE RANGE (IQR) & OUTLIER DETECTION
  // Documented Convention: Moore & McCabe (M&M / Tukey Hinges, Method 1) + Linear Interpolation
  iqr(numbers) {
    if (!numbers || numbers.length === 0) return { error: "No numbers provided" };

    const sorted = [...numbers].map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
    const n = sorted.length;

    const getMedian = (arr) => {
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };

    const median = getMedian(sorted);
    const midIdx = Math.floor(n / 2);
    const lowerHalf = sorted.slice(0, midIdx);
    const upperHalf = n % 2 === 0 ? sorted.slice(midIdx) : sorted.slice(midIdx + 1);

    const q1 = getMedian(lowerHalf);
    const q3 = getMedian(upperHalf);
    const iqrVal = Number((q3 - q1).toFixed(2));

    const lowerBound = Number((q1 - 1.5 * iqrVal).toFixed(2));
    const upperBound = Number((q3 + 1.5 * iqrVal).toFixed(2));

    const outliers = sorted.filter(v => v < lowerBound || v > upperBound);
    const inliers = sorted.filter(v => v >= lowerBound && v <= upperBound);

    // Linear Interpolation Percentiles (R-7 Convention)
    const percentile = (p) => {
      const index = (n - 1) * p;
      const lower = Math.floor(index);
      const frac = index - lower;
      if (lower + 1 < n) {
        return Number((sorted[lower] + frac * (sorted[lower + 1] - sorted[lower])).toFixed(2));
      }
      return sorted[lower];
    };

    const q1Interp = percentile(0.25);
    const q3Interp = percentile(0.75);

    return {
      success: true,
      convention: "Moore & McCabe / Tukey Hinges (Standard University Convention: Median of Lower Half and Upper Half)",
      sorted,
      n,
      min: sorted[0],
      max: sorted[n - 1],
      q1: Number(q1.toFixed(2)),
      q2: Number(median.toFixed(2)),
      median: Number(median.toFixed(2)),
      q3: Number(q3.toFixed(2)),
      iqr: iqrVal,
      lowerFence: lowerBound,
      upperFence: upperBound,
      extremeLowerFence: Number((q1 - 3 * iqrVal).toFixed(2)),
      extremeUpperFence: Number((q3 + 3 * iqrVal).toFixed(2)),
      outliers,
      inliers,
      alternativeInterpolation: {
        q1: q1Interp,
        q3: q3Interp,
        iqr: Number((q3Interp - q1Interp).toFixed(2))
      },
      steps: [
        `Sorted dataset: [${sorted.join(', ')}] (Sample size n = ${n})`,
        `Median (Q2): position ${(n + 1) / 2} = ${median}`,
        `Lower Half: [${lowerHalf.join(', ')}] ➔ Q1 = Median(Lower Half) = ${q1}`,
        `Upper Half: [${upperHalf.join(', ')}] ➔ Q3 = Median(Upper Half) = ${q3}`,
        `Interquartile Range: IQR = Q3 - Q1 = ${q3} - ${q1} = ${iqrVal}`,
        `Lower Inner Fence = Q1 - 1.5 × IQR = ${q1} - ${(1.5 * iqrVal).toFixed(2)} = ${lowerBound}`,
        `Upper Inner Fence = Q3 + 1.5 × IQR = ${q3} + ${(1.5 * iqrVal).toFixed(2)} = ${upperBound}`,
        `Outlier Evaluation: ${outliers.length > 0 ? outliers.join(', ') : 'No points fall outside fences.'}`
      ]
    };
  },

  // 12. EVALUATION METRICS & CONFUSION MATRIX
  evaluationMetrics(confusionMatrix) {
    const tp = Number(confusionMatrix.tp) || 0;
    const tn = Number(confusionMatrix.tn) || 0;
    const fp = Number(confusionMatrix.fp) || 0;
    const fn = Number(confusionMatrix.fn) || 0;
    const total = tp + tn + fp + fn;

    if (total === 0) return { error: "Zero total instances" };

    const accuracy = (tp + tn) / total;
    const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
    const specificity = (tn + fp) > 0 ? tn / (tn + fp) : 0;
    const errorRate = (fp + fn) / total;
    const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return {
      success: true,
      tp, tn, fp, fn,
      total,
      accuracy: Number(accuracy.toFixed(4)),
      precision: Number(precision.toFixed(4)),
      recall: Number(recall.toFixed(4)),
      sensitivity: Number(recall.toFixed(4)),
      specificity: Number(specificity.toFixed(4)),
      errorRate: Number(errorRate.toFixed(4)),
      f1Score: Number(f1Score.toFixed(4)),
      percentages: {
        accuracy: `${(accuracy * 100).toFixed(2)}%`,
        precision: `${(precision * 100).toFixed(2)}%`,
        recall: `${(recall * 100).toFixed(2)}%`,
        specificity: `${(specificity * 100).toFixed(2)}%`,
        f1Score: `${(f1Score * 100).toFixed(2)}%`
      },
      formulas: {
        accuracy: `(TP + TN) / Total = (${tp} + ${tn}) / ${total} = ${accuracy.toFixed(4)}`,
        precision: `TP / (TP + FP) = ${tp} / (${tp} + ${fp}) = ${precision.toFixed(4)}`,
        recall: `TP / (TP + FN) = ${tp} / (${tp} + ${fn}) = ${recall.toFixed(4)}`,
        specificity: `TN / (TN + FP) = ${tn} / (${tn} + ${fp}) = ${specificity.toFixed(4)}`,
        f1Score: `2 × (Precision × Recall) / (Precision + Recall) = ${f1Score.toFixed(4)}`
      }
    };
  },

  // 13. BINNING (Equal-Width, Equal-Frequency, Smoothing by Means/Boundaries)
  binning(numbers, numBins = 3, method = 'width', smoothing = 'means') {
    if (!numbers || numbers.length === 0) return { error: "No numbers provided" };
    const sorted = [...numbers].map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
    numBins = Math.max(1, Math.min(sorted.length, Math.floor(Number(numBins) || 3)));
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const bins = [];

    if (method === 'width') {
      const binWidth = (max - min) / numBins;
      for (let i = 0; i < numBins; i++) {
        const binMin = min + i * binWidth;
        const binMax = i === numBins - 1 ? max : min + (i + 1) * binWidth;
        const values = sorted.filter(v => i === numBins - 1 ? (v >= binMin && v <= binMax) : (v >= binMin && v < binMax));
        bins.push({
          binIndex: i + 1,
          min: Number(binMin.toFixed(2)),
          max: Number(binMax.toFixed(2)),
          values: values.length > 0 ? values : [binMin]
        });
      }
    } else {
      // Equal-frequency
      const binSize = Math.ceil(sorted.length / numBins);
      for (let i = 0; i < numBins; i++) {
        const values = sorted.slice(i * binSize, (i + 1) * binSize);
        if (values.length > 0) {
          bins.push({
            binIndex: i + 1,
            min: values[0],
            max: values[values.length - 1],
            values
          });
        }
      }
    }

    const smoothedBins = bins.map(b => {
      const vals = b.values;
      if (vals.length === 0) return { ...b, smoothedValues: [] };

      if (smoothing === 'means') {
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const meanVal = Number(mean.toFixed(2));
        return { ...b, binMean: meanVal, smoothedValues: vals.map(() => meanVal) };
      } else if (smoothing === 'boundaries') {
        const bMin = vals[0];
        const bMax = vals[vals.length - 1];
        const smoothedValues = vals.map(v => Math.abs(v - bMin) <= Math.abs(v - bMax) ? bMin : bMax);
        return { ...b, smoothedValues };
      } else {
        return { ...b, smoothedValues: vals };
      }
    });

    return {
      success: true,
      raw: numbers,
      sorted,
      method,
      smoothing,
      numBins,
      bins: smoothedBins
    };
  },

  // 14. TRAIN/TEST SPLIT + MULTI-CLASS CLASSIFIER EVALUATION
  evaluateClassifier(rows, featureCols, targetCol, algorithm, params = {}) {
    if (!rows || rows.length < 4) return { error: 'Need at least 4 rows for train/test split.' };
    if (!targetCol) return { error: 'Target column required.' };

    const splitRatio = params.splitRatio || 0.8;
    const splitIdx = Math.floor(rows.length * splitRatio);
    const trainRows = rows.slice(0, splitIdx);
    const testRows  = rows.slice(splitIdx);

    if (trainRows.length === 0 || testRows.length === 0) {
      return { error: 'Train or test set is empty after split. Add more data rows.' };
    }

    const classes = [...new Set(rows.map(r => String(r[targetCol] || '')))].filter(Boolean);
    const predictions = [];

    testRows.forEach(testRow => {
      const actual = String(testRow[targetCol] || '');
      let predicted = '';

      if (algorithm === 'knn') {
        const k = params.k || 3;
        const res = this.knn(trainRows, testRow, k, featureCols, targetCol);
        predicted = res.predictedClass || res.prediction || '';
      } else if (algorithm === 'naivebayes') {
        const res = this.naiveBayes(trainRows, targetCol, testRow);
        predicted = res.predictedClass || res.prediction || '';
      } else if (algorithm === 'id3') {
        const res = this.id3Entropy(trainRows, targetCol);
        const bestAttr = res.bestSplitAttribute || res.bestAttribute;
        if (bestAttr) {
          const testVal = String(testRow[bestAttr] || '');
          const matchingRows = trainRows.filter(r => String(r[bestAttr] || '') === testVal);
          const sourceRows = matchingRows.length > 0 ? matchingRows : trainRows;
          const classCounts = {};
          sourceRows.forEach(r => { const c = String(r[targetCol] || ''); classCounts[c] = (classCounts[c] || 0) + 1; });
          predicted = Object.keys(classCounts).reduce((a, b) => classCounts[a] >= classCounts[b] ? a : b, classes[0] || '');
        } else {
          const cc = {};
          trainRows.forEach(r => { const c = String(r[targetCol] || ''); cc[c] = (cc[c] || 0) + 1; });
          predicted = Object.keys(cc).reduce((a, b) => cc[a] >= cc[b] ? a : b, classes[0] || '');
        }
      }

      predictions.push({ actual, predicted, correct: actual === predicted });
    });

    const matrix = {};
    classes.forEach(c => { matrix[c] = {}; classes.forEach(d => { matrix[c][d] = 0; }); });
    predictions.forEach(p => {
      if (matrix[p.actual] && matrix[p.actual][p.predicted] !== undefined) {
        matrix[p.actual][p.predicted]++;
      }
    });

    const correct = predictions.filter(p => p.correct).length;
    const accuracy = testRows.length > 0 ? correct / testRows.length : 0;

    const perClass = {};
    classes.forEach(cls => {
      const tp = predictions.filter(p => p.actual === cls && p.predicted === cls).length;
      const fp = predictions.filter(p => p.actual !== cls && p.predicted === cls).length;
      const fn = predictions.filter(p => p.actual === cls && p.predicted !== cls).length;
      const prec = (tp + fp) > 0 ? tp / (tp + fp) : 0;
      const rec  = (tp + fn) > 0 ? tp / (tp + fn) : 0;
      const f1   = (prec + rec) > 0 ? 2 * prec * rec / (prec + rec) : 0;
      perClass[cls] = {
        tp, fp, fn,
        precision: Number(prec.toFixed(4)),
        recall: Number(rec.toFixed(4)),
        f1: Number(f1.toFixed(4))
      };
    });

    const macroF1 = classes.length > 0
      ? classes.reduce((s, c) => s + perClass[c].f1, 0) / classes.length
      : 0;

    return {
      success: true,
      algorithm,
      trainSize: trainRows.length,
      testSize: testRows.length,
      classes,
      predictions,
      confusionMatrix: matrix,
      accuracy: Number(accuracy.toFixed(4)),
      accuracyPct: `${(accuracy * 100).toFixed(2)}%`,
      macroF1: Number(macroF1.toFixed(4)),
      perClass
    };
  },

  // 15. CATEGORICAL LABEL ENCODER
  labelEncode(rows, col) {
    if (!rows || !col) return { error: 'Missing rows or column.' };
    const vals = [...new Set(rows.map(r => String(r[col] || '')).filter(Boolean))].sort();
    const mapping = {};
    vals.forEach((v, i) => { mapping[v] = i; });
    const encoded = rows.map(r => ({ ...r, [col]: mapping[String(r[col] || '')] !== undefined ? mapping[String(r[col] || '')] : r[col] }));
    return { success: true, col, mapping, encoded };
  },

  // 16. MODE IMPUTATION
  modeImpute(rows, col) {
    if (!rows || !col) return { error: 'Missing rows or column.' };
    const freq = {};
    rows.forEach(r => {
      const v = r[col];
      if (v !== null && v !== undefined && v !== '') {
        freq[String(v)] = (freq[String(v)] || 0) + 1;
      }
    });
    if (Object.keys(freq).length === 0) return { error: `Column "${col}" has no non-null values.` };
    const mode = Object.keys(freq).reduce((a, b) => freq[a] >= freq[b] ? a : b);
    let imputedCount = 0;
    const encoded = rows.map(r => {
      if (r[col] === null || r[col] === undefined || r[col] === '') {
        imputedCount++;
        return { ...r, [col]: mode };
      }
      return { ...r };
    });
    return { success: true, col, mode, imputedCount, encoded };
  },

  // 17. MEDIAN IMPUTATION
  medianImpute(rows, numericCols) {
    if (!rows || !numericCols) return { error: 'Missing data.' };
    let imputedCount = 0;
    const encoded = rows.map(r => ({ ...r }));
    numericCols.forEach(col => {
      const vals = rows.map(r => Number(r[col])).filter(v => !isNaN(v));
      if (vals.length === 0) return;
      const sorted = [...vals].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      encoded.forEach(r => {
        if (r[col] === null || r[col] === undefined || r[col] === '' || isNaN(Number(r[col]))) {
          r[col] = Number(median.toFixed(4));
          imputedCount++;
        }
      });
    });
    return { success: true, imputedCount, encoded };
  }
};
