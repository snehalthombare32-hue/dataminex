// DataMineX - Automated Local Test Suite
// Zero destructive queries against the database, isolated test data, pure deterministic validation

import { queryKnowledgeBase } from '../knowledgeBase.js';
import { NumericalEngine } from '../public/js/numericalEngine.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

function assertClose(actual, expected, tolerance = 0.01, testName) {
  totalTests++;
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName} (${actual} ≈ ${expected})`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} (Expected ${expected}, got ${actual}, diff: ${diff})`);
  }
}

console.log('====================================================');
console.log('🧪 RUNNING DATAMINEX AUTOMATED LOCAL TEST SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST GROUP 1: MATHEMATICAL ALGORITHMS (NumericalEngine)
// ----------------------------------------------------
console.log('📊 [GROUP 1] Numerical Engine Mathematical Correctness');

// 1.1 K-Means Clustering
const kmeansPts = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 8, y: 8 }, { x: 9, y: 8 }];
const kmeansRes = NumericalEngine.kMeans(kmeansPts, 2);
assert(kmeansRes.success === true, 'K-Means returns success status');
assert(kmeansRes.clusters.length === 2, 'K-Means creates exactly K=2 clusters');
assert(kmeansRes.clusters[0].length === 2 && kmeansRes.clusters[1].length === 2, 'K-Means partitions points cleanly into two clusters of 2');

// 1.2 Decision Tree ID3 Entropy & Information Gain
const playData = [
  { Outlook: 'Sunny', Wind: 'Weak', Play: 'No' },
  { Outlook: 'Sunny', Wind: 'Strong', Play: 'No' },
  { Outlook: 'Overcast', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Wind: 'Strong', Play: 'No' },
  { Outlook: 'Overcast', Wind: 'Strong', Play: 'Yes' },
  { Outlook: 'Sunny', Wind: 'Weak', Play: 'No' },
  { Outlook: 'Sunny', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Wind: 'Weak', Play: 'Yes' }
];
const id3Res = NumericalEngine.id3Entropy(playData, 'Play');
assert(id3Res.success === true, 'ID3 Entropy calculation succeeds');
assert(id3Res.systemEntropy > 0, 'System entropy is positive for mixed classes');
assert(id3Res.gains && id3Res.gains.length > 0, 'Information Gain calculated for all attributes');
assert(typeof id3Res.bestSplitAttribute === 'string', 'Best split attribute identified');

// 1.3 Linear Regression (OLS)
const regPts = [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 6 }];
const regRes = NumericalEngine.linearRegression(regPts);
assert(regRes.success === true, 'Linear Regression succeeds');
assertClose(regRes.slope, 0.9, 0.05, 'Linear regression slope b is approximately 0.9');
assertClose(regRes.intercept, 1.3, 0.05, 'Linear regression intercept a is approximately 1.3');
assert(regRes.r2 >= 0 && regRes.r2 <= 1, 'R-squared value is bounded in [0, 1]');

// 1.4 Outlier Detection (IQR Fences)
const iqrNumbers = [10, 12, 14, 15, 17, 18, 19, 21, 22, 55];
const iqrRes = NumericalEngine.iqr(iqrNumbers);
assert(iqrRes.success === true, 'IQR outlier detection succeeds');
assertClose(iqrRes.q1, 14, 0.5, 'First Quartile Q1 is accurate');
assertClose(iqrRes.q3, 21, 0.5, 'Third Quartile Q3 is accurate');
assert(iqrRes.outliers.includes(55), 'Value 55 is correctly flagged as an outlier');
assert(!iqrRes.outliers.includes(15), 'Normal value 15 is not flagged as an outlier');

// 1.5 Feature Normalization (Min-Max & Z-Score)
const normData = [100, 200, 300, 400, 500];
const minmaxRes = NumericalEngine.normalization(normData, 'minmax', 0, 1);
assert(minmaxRes.success === true, 'Min-Max normalization succeeds');
assert(minmaxRes.normalized[0] === 0, 'Minimum value scales to 0');
assert(minmaxRes.normalized[4] === 1, 'Maximum value scales to 1');
assert(minmaxRes.normalized[2] === 0.5, 'Median value 300 scales to 0.5');

const zscoreRes = NumericalEngine.normalization(normData, 'zscore');
assert(zscoreRes.success === true, 'Z-Score standardization succeeds');
assertClose(zscoreRes.normalized[2], 0, 0.05, 'Center value has Z-score 0');

// 1.6 Apriori Association Rules
const transactions = [
  { id: 1, items: ['Bread', 'Milk'] },
  { id: 2, items: ['Bread', 'Diaper', 'Beer', 'Eggs'] },
  { id: 3, items: ['Milk', 'Diaper', 'Beer', 'Cola'] },
  { id: 4, items: ['Bread', 'Milk', 'Diaper', 'Beer'] }
];
const aprioriRes = NumericalEngine.apriori(transactions, 50, 75);
assert(aprioriRes.success === true, 'Apriori rule mining succeeds');
assert(aprioriRes.frequent1Itemsets.length >= 4, 'Identifies frequent 1-itemsets satisfying min_sup');
assert(aprioriRes.rules && aprioriRes.rules.length > 0, 'Generates valid association rules satisfying min_conf');

// 1.7 Confusion Matrix Evaluation Metrics
const cmRes = NumericalEngine.evaluationMetrics({ tp: 80, tn: 90, fp: 10, fn: 20 });
assert(cmRes.success === true, 'Evaluation metrics calculated successfully');
assertClose(cmRes.accuracy, 0.85, 0.01, 'Accuracy is exactly (80+90)/200 = 0.85');
assertClose(cmRes.precision, 0.8889, 0.01, 'Precision is 80/(80+10) ≈ 0.8889');
assertClose(cmRes.recall, 0.80, 0.01, 'Recall is 80/(80+20) = 0.80');

// 1.8 Edge Cases & Advanced Numerical Methods Handling
const emptyKmeans = NumericalEngine.kMeans([]);
assert(emptyKmeans.error !== undefined, 'K-Means safely rejects empty points array');

// K-Means custom initial centroids and convergence verification
const kmCustom = NumericalEngine.kMeans(
  [{ id: 'P1', x: 1, y: 1 }, { id: 'P2', x: 2, y: 1 }, { id: 'P3', x: 8, y: 8 }, { id: 'P4', x: 9, y: 8 }],
  2,
  [{ id: 'P1', x: 1, y: 1 }, { id: 'P3', x: 8, y: 8 }]
);
assert(kmCustom.success === true, 'K-Means with custom initial centroids succeeds');
assert(kmCustom.history.length >= 1, 'K-Means records full iteration history');
assert(kmCustom.finalCentroids.length === 2, 'K-Means computes exact K=2 final centroids');

// K-Medoids PAM validation
const kmedRes = NumericalEngine.kMedoids([{ x: 2, y: 6 }, { x: 3, y: 4 }, { x: 7, y: 3 }, { x: 7, y: 4 }], 2);
assert(kmedRes.success === true, 'K-Medoids PAM algorithm succeeds');
assert(kmedRes.finalMedoids.length === 2, 'K-Medoids PAM selects exactly 2 medoid points');

// Hierarchical Agglomerative Single Linkage validation
const hRes = NumericalEngine.hierarchicalClustering([{ x: 1, y: 1 }, { x: 1.5, y: 1.5 }, { x: 5, y: 5 }], 'single');
assert(hRes.success === true, 'Hierarchical single-linkage clustering succeeds');
assert(hRes.steps.length === 2, 'Hierarchical creates exactly N-1 merge steps for 3 points');

// DBSCAN Core/Border/Noise identification
const dbRes = NumericalEngine.dbscan([{ x: 1, y: 1 }, { x: 1.2, y: 1.1 }, { x: 25, y: 25 }], 1.0, 2);
assert(dbRes.success === true, 'DBSCAN clustering succeeds');
assert(dbRes.noise.length === 1, 'DBSCAN identifies outlier (25, 25) as noise point');

// Naive Bayes predictedClass property validation
const nbData = [
  { Outlook: 'Sunny', Play: 'No' },
  { Outlook: 'Sunny', Play: 'No' },
  { Outlook: 'Overcast', Play: 'Yes' },
  { Outlook: 'Rain', Play: 'Yes' }
];
const nbRes = NumericalEngine.naiveBayes(nbData, 'Play', { Outlook: 'Overcast' });
assert(nbRes.success === true, 'Naive Bayes classifier succeeds');
assert(nbRes.predictedClass === 'Yes', 'Naive Bayes predicts Yes for Overcast Outlook');

// KNN 2D coordinates distance ranking
const knnTrain = [
  { id: 'A1', x: 1, y: 1, label: 'Red' },
  { id: 'A2', x: 2, y: 1, label: 'Red' },
  { id: 'B1', x: 8, y: 8, label: 'Blue' }
];
const knnRes = NumericalEngine.knn(knnTrain, { x: 1.5, y: 1 }, 1);
assert(knnRes.success === true, 'KNN classification succeeds');
assert(knnRes.predictedClass === 'Red', 'KNN classifies nearest point to Red');

// Moore & McCabe IQR with odd and even length datasets
const iqrOdd = NumericalEngine.iqr([12, 14, 15, 18, 19, 21, 22, 23, 25, 29, 65]);
assert(iqrOdd.success === true, 'IQR calculation for odd-length dataset succeeds');
assert(iqrOdd.median === 21, 'IQR median of 11 items is middle element');
assert(iqrOdd.outliers.includes(65), 'IQR flags 65 as outlier');

// Recursive Decision Tree Generation
const fullTreeData = [
  { Outlook: 'Sunny', Humidity: 'High', Play: 'No' },
  { Outlook: 'Sunny', Humidity: 'Normal', Play: 'Yes' },
  { Outlook: 'Overcast', Humidity: 'High', Play: 'Yes' },
  { Outlook: 'Rain', Humidity: 'Normal', Play: 'Yes' },
  { Outlook: 'Rain', Humidity: 'High', Play: 'No' }
];
const fullTreeRes = NumericalEngine.buildDecisionTree(fullTreeData, 'Play');
assert(fullTreeRes.success === true, 'buildDecisionTree succeeds');
assert(fullTreeRes.root && fullTreeRes.root.type === 'node', 'Decision tree root is a split node');
assert(Object.keys(fullTreeRes.root.children).length > 0, 'Decision tree root has child branches');

// Hierarchical Clustering Dynamic Cut Threshold
const cutPoints = [{ x: 1, y: 1 }, { x: 1.5, y: 1.5 }, { x: 8, y: 8 }, { x: 8.5, y: 8.5 }];
const cutHRes = NumericalEngine.hierarchicalClustering(cutPoints, 'single');
const cutClusters = NumericalEngine.getHierarchicalClustersAtCut(cutHRes.finalTree, 2.0);
assert(Array.isArray(cutClusters), 'getHierarchicalClustersAtCut returns cluster array');
assert(cutClusters.length === 2, 'Cut at distance 2.0 produces exactly 2 distinct clusters');

// Linear Regression Prediction and Manual Equation Verification (Textbook y = 2x + 1)
const knownLinePts = [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }, { x: 4, y: 9 }];
const knownLineRes = NumericalEngine.linearRegression(knownLinePts);
assertClose(knownLineRes.slope, 2.0, 0.001, 'Regression slope matches textbook equation 2.0');
assertClose(knownLineRes.intercept, 1.0, 0.001, 'Regression intercept matches textbook equation 1.0');
assertClose(knownLineRes.rSquared, 1.0, 0.001, 'R-squared for perfect linear data is 1.0');

const vertLine = NumericalEngine.linearRegression([{ x: 2, y: 1 }, { x: 2, y: 5 }]);
assert(vertLine.error !== undefined, 'Linear Regression safely handles vertical line undefined slope');

const singleNorm = NumericalEngine.normalization([5, 5, 5], 'minmax');
assert(singleNorm.success === true, 'Normalization safely handles zero range (identical numbers)');

// ----------------------------------------------------
// TEST GROUP 2: AI STUDY ASSISTANT & KNOWLEDGE RETRIEVAL
// ----------------------------------------------------
console.log('\n🤖 [GROUP 2] Offline AI Study Assistant & Knowledge Base');

const q1 = queryKnowledgeBase('Explain Star Schema vs Snowflake schema for 2 marks');
assert(q1.success === true, 'AI knowledge base returns successful result for schema query');
assert(q1.matched === true, 'AI matches Star Schema vs Snowflake topic');
assert(q1.format === '2marks', 'AI detects 2 marks answer request');
assert(q1.answer.includes('Star Schema') && q1.answer.includes('Snowflake'), 'AI answer explains both schemas');

const q2 = queryKnowledgeBase('Explain 5 OLAP operations in Data Warehousing for 5 marks');
assert(q2.success === true, 'AI handles 5 OLAP operations query');
assert(q2.answer.includes('Roll-up') && q2.answer.includes('Slice'), 'AI answer covers Roll-up and Slice');
assert(q2.format === '5marks', 'AI detects 5 marks answer request');

const q3 = queryKnowledgeBase('Solve a K-Means numerical problem step by step');
assert(q3.success === true, 'AI handles numerical calculation query');
assert(q3.format === 'numerical', 'AI detects numerical derivation format');
assert(q3.answer.includes('Iteration') || q3.answer.includes('Centroid'), 'AI answer contains step-by-step math iterations');

const q4 = queryKnowledgeBase('Random unknown gibberish question 12345');
assert(q4.success === true, 'AI handles un-matched queries gracefully');
assert(q4.matched === false, 'Gracefully notes un-matched query');
assert(q4.answer.includes('DataMineX Educational Tutor'), 'Provides friendly guidance to syllabus topics');

// ----------------------------------------------------
// TEST GROUP 3: SERVER API & DUPLICATE XP EXPLOIT PREVENTION
// ----------------------------------------------------
console.log('\n🔒 [GROUP 3] Backend Security & Duplicate XP Prevention (Live API)');

async function runApiTests() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // 3.1 Check Server Status
    const statusRes = await fetch(`${baseUrl}/api/status`);
    assert(statusRes.ok, 'Server status endpoint responds HTTP 200');
    const statusData = await statusRes.json();
    assert(statusData.status === 'online', 'Server reports online status');

    // 3.2 Test Registration Input Validation
    const invalidEmailRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Tester', email: 'not-an-email', password: 'password123' })
    });
    assert(invalidEmailRes.status === 400, 'Registration rejects invalid email format with HTTP 400');

    const shortPassRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Tester', email: 'valid@test.com', password: '123' })
    });
    assert(shortPassRes.status === 400, 'Registration rejects password shorter than 6 chars with HTTP 400');

    // 3.3 Register Valid Test User
    const testEmail = `test_runner_${Date.now()}@dataminex.local`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Automated Tester', email: testEmail, password: 'secure_password_123' })
    });
    assert(regRes.status === 201, 'User registration succeeds with HTTP 201');
    const regData = await regRes.json();
    const token = regData.token;
    assert(typeof token === 'string' && token.length > 20, 'Registration returns valid JWT authentication token');

    // 3.4 Login Verification
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'secure_password_123' })
    });
    assert(loginRes.ok, 'User login succeeds with correct credentials');
    const loginData = await loginRes.json();
    assert(loginData.user.email === testEmail, 'Login returns matched user profile');

    // 3.5 Protected Route Access Verification
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(meRes.ok, 'Authenticated user can fetch profile via /api/auth/me');

    const noAuthRes = await fetch(`${baseUrl}/api/auth/me`);
    assert(noAuthRes.status === 401, 'Unauthorized request without token is rejected with HTTP 401');

    // 3.6 DUPLICATE CHALLENGE XP EXPLOIT PREVENTION TEST
    const chal1Res = await fetch(`${baseUrl}/api/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ challengeId: 'retail-basket-analysis' })
    });
    assert(chal1Res.ok, 'First challenge submission succeeds');
    const chal1Data = await chal1Res.json();
    assert(chal1Data.alreadyCompleted === false, 'First submission is marked newly completed');
    assert(chal1Data.xpAward === 200, 'First challenge submission awards +200 XP');
    const initialXp = chal1Data.xp;

    // Second submission of the exact same challenge
    const chal2Res = await fetch(`${baseUrl}/api/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ challengeId: 'retail-basket-analysis' })
    });
    assert(chal2Res.ok, 'Second challenge submission responds HTTP 200');
    const chal2Data = await chal2Res.json();
    assert(chal2Data.alreadyCompleted === true, 'Duplicate challenge submission is detected as already completed');
    assert(chal2Data.xpAward === 0, 'Duplicate challenge submission awards 0 XP');
    assert(chal2Data.xp === initialXp, `User XP did NOT increase on repeat submission (${chal2Data.xp} === ${initialXp})`);

    // 3.7 DUPLICATE PROGRESS XP EXPLOIT PREVENTION TEST
    const prog1Res = await fetch(`${baseUrl}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ moduleId: 'warehouse', topicId: 'architecture', type: 'lesson' })
    });
    assert(prog1Res.ok, 'First lesson completion succeeds');
    const prog1Data = await prog1Res.json();
    assert(prog1Data.alreadyCompleted === false, 'First lesson progress is marked newly completed');
    assert(prog1Data.xpAward === 100, 'First lesson completion awards +100 XP');
    const xpAfterLesson = prog1Data.xp;

    // Second submission of the exact same lesson progress
    const prog2Res = await fetch(`${baseUrl}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ moduleId: 'warehouse', topicId: 'architecture', type: 'lesson' })
    });
    assert(prog2Res.ok, 'Second lesson progress responds HTTP 200');
    const prog2Data = await prog2Res.json();
    assert(prog2Data.alreadyCompleted === true, 'Duplicate lesson progress is detected as already completed');
    assert(prog2Data.xpAward === 0, 'Duplicate lesson progress awards 0 XP');
    assert(prog2Data.xp === xpAfterLesson, `User XP did NOT increase on repeat progress (${prog2Data.xp} === ${xpAfterLesson})`);

    // 3.8 AI Assistant HTTP Endpoint Verification
    const aiApiRes = await fetch(`${baseUrl}/api/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is Star Schema?' })
    });
    assert(aiApiRes.ok, '/api/ai/ask endpoint responds HTTP 200');
    const aiApiData = await aiApiRes.json();
    assert(aiApiData.freeMode === true, 'AI endpoint confirms free offline mode');
    assert(aiApiData.answer && aiApiData.answer.length > 50, 'AI endpoint returns comprehensive educational answer');

  } catch (err) {
    console.error('API Test connection error:', err.message);
    failedTests++;
  }

  // Final Summary
  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} TOTAL`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runApiTests();
