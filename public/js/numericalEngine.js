// DataMineX - Pure Deterministic Local Numerical Engine
// 100% Free & Open-Source, No External APIs Required, Runs Locally in Browser

export const NumericalEngine = {
  // 1. K-MEANS CLUSTERING
  kMeans(points, k = 2, maxIter = 20) {
    if (!points || points.length === 0) return { error: "No points provided" };
    k = Math.min(k, points.length);

    // Initial centroids (first k distinct points or evenly spaced)
    let centroids = [];
    const step = Math.floor(points.length / k);
    for (let i = 0; i < k; i++) {
      centroids.push({ ...points[Math.min(i * step, points.length - 1)] });
    }

    let iterations = [];
    let clusters = Array.from({ length: k }, () => []);
    let converged = false;
    let iter = 0;

    while (iter < maxIter && !converged) {
      iter++;
      clusters = Array.from({ length: k }, () => []);

      // Assign points to nearest centroid
      points.forEach((pt, pIdx) => {
        let minDist = Infinity;
        let bestCluster = 0;
        centroids.forEach((c, cIdx) => {
          const dist = Math.hypot(pt.x - c.x, pt.y - c.y);
          if (dist < minDist) {
            minDist = dist;
            bestCluster = cIdx;
          }
        });
        clusters[bestCluster].push({ ...pt, index: pIdx, distToCentroid: minDist });
      });

      // Recalculate centroids
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
          newCentroids.push({ x: Number(avgX.toFixed(3)), y: Number(avgY.toFixed(3)) });
        }
      }

      // Compute Sum of Squared Errors (SSE)
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
        clustersCount: clusters.map(c => c.length),
        sse: Number(sse.toFixed(3)),
        shift: Number(maxShift.toFixed(3))
      });

      if (maxShift < 0.001) {
        converged = true;
      }
      centroids = newCentroids;
    }

    return {
      success: true,
      k,
      totalIterations: iter,
      converged,
      finalCentroids: centroids,
      clusters,
      history: iterations
    };
  },

  // 2. K-MEDOIDS (PAM Algorithm)
  kMedoids(points, k = 2, maxIter = 10) {
    if (!points || points.length === 0) return { error: "No points provided" };
    k = Math.min(k, points.length);

    // Initial medoids are actual data points
    let medoids = points.slice(0, k).map(p => ({ ...p }));
    let iter = 0;
    let converged = false;
    let iterations = [];

    const computeCost = (meds) => {
      let totalCost = 0;
      points.forEach(pt => {
        let minDist = Math.min(...meds.map(m => Math.hypot(pt.x - m.x, pt.y - m.y)));
        totalCost += minDist;
      });
      return totalCost;
    };

    let currentCost = computeCost(medoids);

    while (iter < maxIter && !converged) {
      iter++;
      let improved = false;

      // Try swapping each medoid with a non-medoid point
      for (let mIdx = 0; mIdx < k; mIdx++) {
        for (let pIdx = 0; pIdx < points.length; pIdx++) {
          const candidate = points[pIdx];
          const isCurrentMedoid = medoids.some(m => m.id === candidate.id || (m.x === candidate.x && m.y === candidate.y));
          if (isCurrentMedoid) continue;

          let testMedoids = [...medoids];
          testMedoids[mIdx] = { ...candidate };
          const testCost = computeCost(testMedoids);

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
        totalCost: Number(currentCost.toFixed(3))
      });

      if (!improved) converged = true;
    }

    // Final assignments
    let clusters = Array.from({ length: k }, () => []);
    points.forEach(pt => {
      let minDist = Infinity;
      let bestCluster = 0;
      medoids.forEach((m, mIdx) => {
        const d = Math.hypot(pt.x - m.x, pt.y - m.y);
        if (d < minDist) {
          minDist = d;
          bestCluster = mIdx;
        }
      });
      clusters[bestCluster].push({ ...pt, distance: Number(minDist.toFixed(3)) });
    });

    return {
      success: true,
      k,
      totalIterations: iter,
      converged,
      finalMedoids: medoids,
      clusters,
      totalCost: Number(currentCost.toFixed(3)),
      history: iterations
    };
  },

  // 3. HIERARCHICAL AGGLOMERATIVE CLUSTERING
  hierarchicalClustering(points, linkage = 'single') {
    if (!points || points.length < 2) return { error: "At least 2 points needed" };

    let currentClusters = points.map((p, i) => ({
      id: `C${i + 1}`,
      points: [p],
      label: p.id || `P${i + 1}`
    }));

    let steps = [];
    let stepCount = 0;

    while (currentClusters.length > 1) {
      stepCount++;
      let minDistance = Infinity;
      let mergeA = -1;
      let mergeB = -1;

      // Find closest pair of clusters
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
      const newCluster = {
        id: `M${stepCount}`,
        points: [...clusterA.points, ...clusterB.points],
        label: `(${clusterA.label} + ${clusterB.label})`
      };

      steps.push({
        step: stepCount,
        clusterA: clusterA.label,
        clusterB: clusterB.label,
        mergedLabel: newCluster.label,
        distance: Number(minDistance.toFixed(3)),
        remainingCount: currentClusters.length - 1
      });

      currentClusters = currentClusters.filter((_, idx) => idx !== mergeA && idx !== mergeB);
      currentClusters.push(newCluster);
    }

    return {
      success: true,
      linkage,
      steps,
      finalTree: currentClusters[0]
    };
  },

  // 4. DBSCAN CLUSTERING
  dbscan(points, eps = 25, minPts = 2) {
    if (!points || points.length === 0) return { error: "No points provided" };

    const visited = new Set();
    const clusters = [];
    const noise = [];
    const pointTypes = {}; // 'core' | 'border' | 'noise'

    const getNeighbors = (p) => {
      return points.filter(other => Math.hypot(p.x - other.x, p.y - other.y) <= eps);
    };

    let clusterId = 0;

    points.forEach(p => {
      const pKey = p.id || `${p.x}_${p.y}`;
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

        let queue = [...neighbors.filter(n => (n.id || `${n.x}_${n.y}`) !== pKey)];

        for (let i = 0; i < queue.length; i++) {
          const q = queue[i];
          const qKey = q.id || `${q.x}_${q.y}`;

          if (!visited.has(qKey)) {
            visited.add(qKey);
            const qNeighbors = getNeighbors(q);
            if (qNeighbors.length >= minPts) {
              pointTypes[qKey] = 'core';
              qNeighbors.forEach(qn => {
                if (!queue.some(item => (item.id || `${item.x}_${item.y}`) === (qn.id || `${qn.x}_${qn.y}`))) {
                  queue.push(qn);
                }
              });
            } else {
              pointTypes[qKey] = 'border';
            }
          }

          if (!clusters.some(c => c.some(cp => (cp.id || `${cp.x}_${cp.y}`) === qKey))) {
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
      noise: noise.filter(n => !clusters.some(c => c.some(p => (p.id || `${p.x}_${p.y}`) === (n.id || `${n.x}_${n.y}`)))),
      pointTypes
    };
  },

  // 5. ID3 DECISION TREE (Entropy & Information Gain)
  id3Entropy(data, targetAttr = 'Play') {
    if (!data || data.length === 0) return { error: "No training data" };

    const calcEntropy = (rows) => {
      const counts = {};
      rows.forEach(r => {
        const val = r[targetAttr];
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
    const attributes = Object.keys(data[0]).filter(k => k !== targetAttr && k !== 'id' && k !== 'Day');

    const gains = attributes.map(attr => {
      // Distinct values
      const distinctVals = [...new Set(data.map(d => d[attr]))];
      let weightedEntropy = 0;
      const breakdowns = [];

      distinctVals.forEach(v => {
        const subset = data.filter(d => d[attr] === v);
        const subEntropy = calcEntropy(subset);
        const weight = subset.length / data.length;
        weightedEntropy += weight * subEntropy;
        breakdowns.push({
          value: v,
          count: subset.length,
          entropy: subEntropy
        });
      });

      const gain = systemEntropy - weightedEntropy;
      return {
        attribute: attr,
        systemEntropy,
        expectedEntropy: Number(weightedEntropy.toFixed(4)),
        informationGain: Number(gain.toFixed(4)),
        breakdowns
      };
    });

    // Best split attribute (highest gain)
    gains.sort((a, b) => b.informationGain - a.informationGain);
    const bestAttribute = gains[0];

    return {
      success: true,
      systemEntropy,
      targetAttribute: targetAttr,
      gains,
      bestSplitAttribute: bestAttribute.attribute,
      highestGain: bestAttribute.informationGain
    };
  },

  // 6. NAIVE BAYES CLASSIFIER
  naiveBayes(data, targetAttr, testInstance) {
    if (!data || data.length === 0) return { error: "No data provided" };

    const classes = [...new Set(data.map(d => d[targetAttr]))];
    const totalRows = data.length;

    const classPriors = {};
    classes.forEach(c => {
      const count = data.filter(d => d[targetAttr] === c).length;
      classPriors[c] = {
        count,
        prior: count / totalRows
      };
    });

    const likelihoods = {};
    const featureKeys = Object.keys(testInstance).filter(k => k !== targetAttr);

    classes.forEach(c => {
      const classRows = data.filter(d => d[targetAttr] === c);
      likelihoods[c] = {
        features: {},
        score: classPriors[c].prior
      };

      featureKeys.forEach(f => {
        const val = testInstance[f];
        const matchCount = classRows.filter(r => r[f] === val).length;
        // Laplace smoothing (+1)
        const prob = (matchCount + 1) / (classRows.length + [...new Set(data.map(d => d[f]))].length);
        likelihoods[c].features[f] = {
          value: val,
          count: matchCount,
          total: classRows.length,
          probability: Number(prob.toFixed(4))
        };
        likelihoods[c].score *= prob;
      });
      likelihoods[c].score = Number(likelihoods[c].score.toFixed(6));
    });

    // Normalize posterior probabilities
    const sumScores = Object.values(likelihoods).reduce((sum, item) => sum + item.score, 0);
    const posteriors = {};
    let predictedClass = classes[0];
    let maxPosterior = -1;

    classes.forEach(c => {
      const post = sumScores > 0 ? likelihoods[c].score / sumScores : 0;
      posteriors[c] = Number(post.toFixed(4));
      if (post > maxPosterior) {
        maxPosterior = post;
        predictedClass = c;
      }
    });

    return {
      success: true,
      classes,
      classPriors,
      likelihoods,
      posteriors,
      predictedClass,
      confidence: `${(maxPosterior * 100).toFixed(1)}%`
    };
  },

  // 7. K-NEAREST NEIGHBORS (KNN)
  knn(trainData, testPoint, k = 3, distanceMetric = 'euclidean') {
    if (!trainData || trainData.length === 0) return { error: "No training data" };

    const distances = trainData.map((row, idx) => {
      let dist = 0;
      if (distanceMetric === 'manhattan') {
        dist = Math.abs(row.x - testPoint.x) + Math.abs(row.y - testPoint.y);
      } else {
        dist = Math.hypot(row.x - testPoint.x, row.y - testPoint.y);
      }
      return {
        ...row,
        index: idx,
        distance: Number(dist.toFixed(3))
      };
    });

    distances.sort((a, b) => a.distance - b.distance);
    const neighbors = distances.slice(0, k);

    // Majority voting for class
    const votes = {};
    neighbors.forEach(n => {
      const c = n.label || n.class || 'Unknown';
      votes[c] = (votes[c] || 0) + 1;
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
      neighbors,
      votes,
      predictedClass: bestClass,
      confidence: `${((maxVotes / k) * 100).toFixed(1)}%`
    };
  },

  // 8. APRIORI ALGORITHM (Support, Confidence, Lift)
  apriori(transactions, minSupPercent = 40, minConfPercent = 60) {
    if (!transactions || transactions.length === 0) return { error: "No transactions" };
    const N = transactions.length;

    // 1-Itemsets count
    const itemCounts = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    });

    // L1: Frequent 1-itemsets
    const L1 = [];
    for (const item in itemCounts) {
      const supPct = (itemCounts[item] / N) * 100;
      if (supPct >= minSupPercent) {
        L1.push({ item, count: itemCounts[item], supportPct: Number(supPct.toFixed(1)) });
      }
    }

    // 2-Itemsets count
    const pairCounts = {};
    transactions.forEach(t => {
      const items = t.items.filter(i => L1.some(l => l.item === i)).sort();
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const pairKey = `${items[i]} + ${items[j]}`;
          pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
        }
      }
    });

    // L2: Frequent 2-itemsets
    const L2 = [];
    const rules = [];

    for (const pair in pairCounts) {
      const supPct = (pairCounts[pair] / N) * 100;
      if (supPct >= minSupPercent) {
        const [itemA, itemB] = pair.split(' + ');
        L2.push({ pair, count: pairCounts[pair], supportPct: Number(supPct.toFixed(1)) });

        // Rule A -> B
        const confAtoB = (pairCounts[pair] / itemCounts[itemA]) * 100;
        const liftAtoB = (pairCounts[pair] / N) / ((itemCounts[itemA] / N) * (itemCounts[itemB] / N));
        if (confAtoB >= minConfPercent) {
          rules.push({
            rule: `${itemA} ➔ ${itemB}`,
            antecedent: itemA,
            consequent: itemB,
            support: Number(supPct.toFixed(1)),
            confidence: Number(confAtoB.toFixed(1)),
            lift: Number(liftAtoB.toFixed(2))
          });
        }

        // Rule B -> A
        const confBtoA = (pairCounts[pair] / itemCounts[itemB]) * 100;
        const liftBtoA = (pairCounts[pair] / N) / ((itemCounts[itemB] / N) * (itemCounts[itemA] / N));
        if (confBtoA >= minConfPercent) {
          rules.push({
            rule: `${itemB} ➔ ${itemA}`,
            antecedent: itemB,
            consequent: itemA,
            support: Number(supPct.toFixed(1)),
            confidence: Number(confBtoA.toFixed(1)),
            lift: Number(liftBtoA.toFixed(2))
          });
        }
      }
    }

    return {
      success: true,
      totalTransactions: N,
      minSupPercent,
      minConfPercent,
      frequent1Itemsets: L1,
      frequent2Itemsets: L2,
      rules
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

    // Slope m and Intercept b: y = m*x + b
    const numerator = n * sumXY - sumX * sumY;
    const denominator = n * sumX2 - sumX * sumX;

    if (denominator === 0) return { error: "Vertical line (undefined slope)" };

    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    // R-squared and MSE
    let ssTot = 0;
    let ssRes = 0;
    points.forEach(p => {
      const predY = slope * p.x + intercept;
      ssTot += Math.pow(p.y - meanY, 2);
      ssRes += Math.pow(p.y - predY, 2);
    });

    const r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 1;
    const mse = ssRes / n;
    const rmse = Math.sqrt(mse);

    return {
      success: true,
      n,
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(4)),
      equation: `y = ${slope.toFixed(2)}x ${intercept >= 0 ? '+ ' + intercept.toFixed(2) : '- ' + Math.abs(intercept).toFixed(2)}`,
      r2: Number(r2.toFixed(4)),
      mse: Number(mse.toFixed(4)),
      rmse: Number(rmse.toFixed(4)),
      meanX: Number(meanX.toFixed(2)),
      meanY: Number(meanY.toFixed(2))
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

    if (method === 'minmax') {
      const range = max - min;
      normalized = numbers.map(v => {
        if (range === 0) return newMin;
        const norm = ((v - min) / range) * (newMax - newMin) + newMin;
        return Number(norm.toFixed(4));
      });
    } else if (method === 'zscore') {
      normalized = numbers.map(v => {
        if (stdDev === 0) return 0;
        const z = (v - mean) / stdDev;
        return Number(z.toFixed(4));
      });
    } else if (method === 'decimal') {
      const maxAbs = Math.max(...numbers.map(Math.abs));
      const j = maxAbs > 0 ? Math.ceil(Math.log10(maxAbs + 1)) : 1;
      const divisor = Math.pow(10, j);
      normalized = numbers.map(v => Number((v / divisor).toFixed(4)));
    }

    return {
      success: true,
      method,
      min,
      max,
      mean: Number(mean.toFixed(3)),
      stdDev: Number(stdDev.toFixed(3)),
      raw: numbers,
      normalized
    };
  },

  // 11. INTERQUARTILE RANGE (IQR) & OUTLIER DETECTION
  iqr(numbers) {
    if (!numbers || numbers.length === 0) return { error: "No numbers provided" };

    const sorted = [...numbers].sort((a, b) => a - b);
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
    const iqrVal = q3 - q1;

    const lowerBound = q1 - 1.5 * iqrVal;
    const upperBound = q3 + 1.5 * iqrVal;

    const outliers = sorted.filter(v => v < lowerBound || v > upperBound);
    const inliers = sorted.filter(v => v >= lowerBound && v <= upperBound);

    return {
      success: true,
      sorted,
      min: sorted[0],
      max: sorted[n - 1],
      q1: Number(q1.toFixed(2)),
      median: Number(median.toFixed(2)),
      q3: Number(q3.toFixed(2)),
      iqr: Number(iqrVal.toFixed(2)),
      lowerFence: Number(lowerBound.toFixed(2)),
      upperFence: Number(upperBound.toFixed(2)),
      outliers,
      inliers
    };
  },

  // 12. EVALUATION METRICS & CONFUSION MATRIX
  evaluationMetrics(confusionMatrix) {
    const { tp, tn, fp, fn } = confusionMatrix;
    const total = tp + tn + fp + fn;

    if (total === 0) return { error: "Zero total instances" };

    const accuracy = (tp + tn) / total;
    const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0; // Sensitivity
    const specificity = (tn + fp) > 0 ? tn / (tn + fp) : 0;
    const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return {
      success: true,
      tp, tn, fp, fn,
      total,
      accuracy: Number(accuracy.toFixed(4)),
      precision: Number(precision.toFixed(4)),
      recall: Number(recall.toFixed(4)),
      specificity: Number(specificity.toFixed(4)),
      f1Score: Number(f1Score.toFixed(4)),
      percentages: {
        accuracy: `${(accuracy * 100).toFixed(2)}%`,
        precision: `${(precision * 100).toFixed(2)}%`,
        recall: `${(recall * 100).toFixed(2)}%`,
        f1Score: `${(f1Score * 100).toFixed(2)}%`
      }
    };
  }
};
