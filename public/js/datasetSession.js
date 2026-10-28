// DataMineX - Shared Session Dataset Manager
// Enables seamless cross-module dataset sharing between Practical Lab and Numerical Solver
// 100% Client-Side Local Storage (No Database Modifications, No External APIs)

const getScope = () => (typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : {}));

export const DatasetSession = {
  SESSION_KEY: 'dataminex_active_session_dataset',

  getDataset() {
    const scope = getScope();
    if (scope.__DATAMINEX_DATASET__) {
      return scope.__DATAMINEX_DATASET__;
    }
    try {
      if (typeof sessionStorage !== 'undefined') {
        const stored = sessionStorage.getItem(this.SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          scope.__DATAMINEX_DATASET__ = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('DatasetSession read error:', e);
    }
    return null;
  },

  setDataset(dataset) {
    if (!dataset || !dataset.rows || dataset.rows.length === 0) return null;

    const sessionObj = {
      name: dataset.name || 'Uploaded_Dataset.csv',
      headers: Array.isArray(dataset.headers) ? [...dataset.headers] : Object.keys(dataset.rows[0]),
      // Preserve original dataset immutably
      originalRows: dataset.originalRows ? JSON.parse(JSON.stringify(dataset.originalRows)) : JSON.parse(JSON.stringify(dataset.rows)),
      // Active preprocessed rows
      rows: JSON.parse(JSON.stringify(dataset.rows)),
      preprocessedRows: dataset.preprocessedRows ? JSON.parse(JSON.stringify(dataset.preprocessedRows)) : JSON.parse(JSON.stringify(dataset.rows)),
      numericCols: Array.isArray(dataset.numericCols) ? [...dataset.numericCols] : [],
      catCols: Array.isArray(dataset.catCols) ? [...dataset.catCols] : [],
      dataTypes: dataset.dataTypes || {},
      colStats: dataset.colStats || {},
      missingCount: dataset.missingCount || 0,
      dupCount: dataset.dupCount || 0,
      totalRows: dataset.totalRows || dataset.rows.length,
      totalCols: dataset.totalCols || (dataset.headers ? dataset.headers.length : 0),
      preprocessingLog: Array.isArray(dataset.preprocessingLog) ? [...dataset.preprocessingLog] : [],
      updatedAt: new Date().toLocaleTimeString()
    };

    const scope = getScope();
    scope.__DATAMINEX_DATASET__ = sessionObj;

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionObj));
      }
    } catch (e) {
      // If dataset exceeds sessionStorage quota (e.g. >5MB), in-memory scope store remains active
      console.warn('SessionStorage quota exceeded, preserving in memory:', e);
    }

    // Dispatch event so any active component can update reactively
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('dataminex:dataset-updated', { detail: sessionObj }));
    }
    return sessionObj;
  },

  clearDataset() {
    const scope = getScope();
    scope.__DATAMINEX_DATASET__ = null;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(this.SESSION_KEY);
      }
    } catch (e) {}
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('dataminex:dataset-cleared'));
    }
  },

  // Algorithm Compatibility Checker
  checkCompatibility(algoId, dataset) {
    const ds = dataset || this.getDataset();
    if (!ds || !ds.rows || ds.rows.length === 0) {
      return {
        compatible: false,
        status: 'no_dataset',
        title: 'No Dataset Loaded',
        badge: 'No Data',
        color: '#64748b',
        reason: 'Please upload a CSV dataset in the Practical Lab or Numerical Solver first.',
        prepRequired: 'Upload a CSV file.'
      };
    }

    const numCount = (ds.numericCols || []).length;
    const catCount = (ds.catCols || []).length;
    const missing = ds.missingCount || 0;

    switch (algoId) {
      case 'kmeans':
      case 'kmedoids':
      case 'hierarchical':
      case 'dbscan':
        if (numCount >= 2) {
          return {
            compatible: true,
            status: 'compatible',
            badge: 'Compatible',
            color: '#16a34a',
            reason: `Dataset contains ${numCount} numeric feature columns suitable for distance calculations.`,
            prepRequired: missing > 0 ? `Dataset contains ${missing} missing values. Recommend 'Fill Missing' or 'Drop Missing' before running.` : 'No mandatory preprocessing required.'
          };
        } else if (numCount === 1) {
          return {
            compatible: true,
            status: 'partial',
            badge: '1D Only',
            color: '#ea580c',
            reason: 'Dataset contains 1 numeric feature. 1D clustering will use row index or duplicate axis.',
            prepRequired: 'Consider selecting or encoding a second numeric column for 2D clustering.'
          };
        } else {
          return {
            compatible: false,
            status: 'incompatible',
            badge: 'Incompatible',
            color: '#dc2626',
            reason: 'Clustering algorithms require at least 1-2 continuous numerical columns. Found 0 numeric columns.',
            prepRequired: 'Apply Label Encoding or upload a dataset with numerical measurements.'
          };
        }

      case 'id3':
      case 'decisiontree':
        if (ds.headers.length >= 2) {
          return {
            compatible: true,
            status: 'compatible',
            badge: 'Compatible',
            color: '#16a34a',
            reason: `Dataset contains ${ds.headers.length} attributes with class distributions suitable for entropy splitting.`,
            prepRequired: numCount > 0 ? 'Continuous numeric columns will be binned/categorized for ID3 decision splits.' : 'Ensure last column or specified column is the target label.'
          };
        } else {
          return {
            compatible: false,
            status: 'incompatible',
            badge: 'Incompatible',
            color: '#dc2626',
            reason: 'Decision Trees require at least 1 feature attribute and 1 target class attribute.',
            prepRequired: 'Upload a dataset with at least 2 columns.'
          };
        }

      case 'naivebayes':
        if (ds.headers.length >= 2) {
          return {
            compatible: true,
            status: 'compatible',
            badge: 'Compatible',
            color: '#16a34a',
            reason: `Dataset has ${ds.headers.length} columns. Prior and conditional likelihoods can be computed.`,
            prepRequired: missing > 0 ? `Impute or drop ${missing} missing values to avoid likelihood distortion.` : 'Select target class attribute.'
          };
        } else {
          return {
            compatible: false,
            status: 'incompatible',
            badge: 'Incompatible',
            color: '#dc2626',
            reason: 'Naive Bayes classification requires at least 1 predictor and 1 class label.',
            prepRequired: 'Provide a tabular dataset with at least 2 columns.'
          };
        }

      case 'regression':
      case 'linearregression':
        if (numCount >= 2) {
          return {
            compatible: true,
            status: 'compatible',
            badge: 'Compatible',
            color: '#16a34a',
            reason: `Dataset provides ${numCount} continuous numeric columns for OLS regression fitting.`,
            prepRequired: missing > 0 ? `Drop or impute ${missing} missing values before calculating sums.` : 'Select independent variable X and dependent variable Y.'
          };
        } else {
          return {
            compatible: false,
            status: 'incompatible',
            badge: 'Incompatible',
            color: '#dc2626',
            reason: 'Simple Linear Regression requires at least 2 numeric columns (independent X and dependent Y).',
            prepRequired: 'Upload data with 2 numeric columns or encode features.'
          };
        }

      case 'apriori':
        if (catCount >= 1 || ds.headers.length >= 1) {
          return {
            compatible: true,
            status: 'compatible',
            badge: 'Compatible',
            color: '#16a34a',
            reason: `Dataset contains ${ds.headers.length} attribute columns suitable for market basket transaction mining.`,
            prepRequired: numCount > 0 ? 'Numerical values will be treated as discrete item labels or binned into intervals.' : 'Specify transaction row or comma-separated item column.'
          };
        } else {
          return {
            compatible: false,
            status: 'incompatible',
            badge: 'Incompatible',
            color: '#dc2626',
            reason: 'Apriori requires categorical transaction items.',
            prepRequired: 'Upload transaction itemsets or categorical attributes.'
          };
        }

      case 'normalization':
      case 'iqr':
      case 'binning':
        if (numCount >= 1) {
          return {
            compatible: true,
            status: 'compatible',
            badge: 'Compatible',
            color: '#16a34a',
            reason: `Dataset contains ${numCount} numeric feature columns available for transformation.`,
            prepRequired: missing > 0 ? `Handle ${missing} missing values before normalization.` : 'Select target column to transform.'
          };
        } else {
          return {
            compatible: false,
            status: 'incompatible',
            badge: 'Incompatible',
            color: '#dc2626',
            reason: 'Requires at least 1 numeric column.',
            prepRequired: 'Select a dataset with numerical values.'
          };
        }

      default:
        return {
          compatible: true,
          status: 'compatible',
          badge: 'Available',
          color: '#2563eb',
          reason: 'General dataset format accepted.',
          prepRequired: 'Verify feature columns.'
        };
    }
  },

  // Helper to format session dataset for Numerical Solver algorithms
  formatForSolver(algoId, dataset) {
    const ds = dataset || this.getDataset();
    if (!ds || !ds.rows || ds.rows.length === 0) return null;

    const rows = ds.rows;
    const numCols = ds.numericCols || [];
    const headers = ds.headers || [];

    switch (algoId) {
      case 'kmeans':
      case 'kmedoids':
      case 'hierarchical':
      case 'dbscan': {
        const xKey = numCols[0] || headers[0];
        const yKey = numCols[1] || numCols[0] || headers[1] || xKey;
        // Format as (x, y) coordinates for solver input
        const pts = rows.slice(0, 15).map(r => {
          const x = Number(r[xKey]);
          const y = Number(r[yKey]);
          return !isNaN(x) && !isNaN(y) ? `(${x}, ${y})` : null;
        }).filter(p => p !== null);
        return pts.join(', ');
      }

      case 'regression': {
        const xKey = numCols[0] || headers[0];
        const yKey = numCols[1] || numCols[0] || headers[1] || xKey;
        const pts = rows.slice(0, 15).map(r => {
          const x = Number(r[xKey]);
          const y = Number(r[yKey]);
          return !isNaN(x) && !isNaN(y) ? `(${x}, ${y})` : null;
        }).filter(p => p !== null);
        return pts.join(', ');
      }

      case 'id3':
      case 'naivebayes': {
        // Format as CSV table string with headers
        const subset = rows.slice(0, 14);
        const headerLine = headers.join(', ');
        const rowLines = subset.map(r => headers.map(h => (r[h] !== null && r[h] !== undefined ? r[h] : '')).join(', '));
        return [headerLine, ...rowLines].join('\n');
      }

      case 'apriori': {
        // If items are in single column separated by commas
        const catCol = (ds.catCols && ds.catCols[0]) || headers[0];
        const transactions = rows.slice(0, 10).map((r, i) => {
          if (headers.length > 2 && ds.catCols && ds.catCols.length >= 2) {
            // Collect present item columns
            const items = ds.catCols.map(c => r[c]).filter(v => v !== null && v !== undefined && v !== '' && v !== 'No' && v !== '0');
            return `T${i + 1}: ${items.join(', ')}`;
          } else {
            const raw = String(r[catCol] || '');
            return `T${i + 1}: ${raw}`;
          }
        });
        return transactions.join('\n');
      }

      case 'iqr':
      case 'normalization':
      case 'binning': {
        const key = numCols[0] || headers[0];
        const vals = rows.slice(0, 20).map(r => Number(r[key])).filter(v => !isNaN(v));
        return vals.join(', ');
      }

      default:
        return '';
    }
  }
};

if (typeof window !== 'undefined') {
  window.DatasetSession = DatasetSession;
}
