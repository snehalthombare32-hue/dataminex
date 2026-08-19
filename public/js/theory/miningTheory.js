// Data Mining Theory Content
// Paste or edit your specific theory details in the content fields below.

export const miningTheory = [
  {
    id: "intro-mining",
    title: "1. Introduction to Data Mining",
    blocks: [
      {
        type: "definition",
        title: "Data Mining (KDD)",
        content: "Data Mining is the computational process of discovering hidden, previously unknown, valid, and actionable patterns, anomalies, and correlations in large datasets. It is also known as Knowledge Discovery in Databases (KDD)."
      },
      {
        type: "key-concept",
        title: "KDD Process Steps",
        content: "1. Data Cleaning -> 2. Data Integration -> 3. Data Selection -> 4. Data Transformation -> 5. Data Mining -> 6. Pattern Evaluation -> 7. Knowledge Presentation."
      }
    ]
  },
  {
    id: "preprocessing",
    title: "2. Data Preprocessing",
    blocks: [
      {
        type: "definition",
        title: "Data Preprocessing",
        content: "Raw real-world data is often incomplete, noisy, inconsistent, and duplicate. Preprocessing transforms raw data into a clean, ready format before mining algorithms are applied."
      },
      {
        type: "key-concept",
        title: "Four Pillars of Preprocessing",
        content: "1. Cleaning: Fill missing values, smooth noisy data.\n2. Integration: Merge multiple sources.\n3. Reduction: Reduce volume but produce analytical outcomes (e.g. PCA).\n4. Transformation: Standardize, normalize, and discretize data."
      }
    ]
  },
  {
    id: "apriori-algorithm",
    title: "3. Association Rule Mining (Apriori)",
    blocks: [
      {
        type: "definition",
        title: "Association Rules",
        content: "Finding relationships between items that are frequently bought or used together. The canonical example is Market Basket Analysis: identifying that customer buying product A also frequently buys product B."
      },
      {
        type: "remember",
        title: "Metrics to Know",
        content: "Support: How frequently the itemset appears in database.\nConfidence: How often the rule is found to be true.\nLift: The strength and correlation of the rule (Lift > 1 implies positive correlation)."
      },
      {
        type: "example",
        title: "Apriori Principle",
        content: "If an itemset is frequent, then all of its subsets must also be frequent. If {Milk, Bread} is frequent, then {Milk} and {Bread} are also frequent. This helps prune candidate sets during calculations."
      }
    ]
  },
  {
    id: "classification",
    title: "4. Classification Techniques",
    blocks: [
      {
        type: "definition",
        title: "Classification",
        content: "A supervised learning technique that assigns data objects to a set of predefined, discrete target categories or classes based on input features (e.g., spam vs non-spam email detection)."
      },
      {
        type: "key-concept",
        title: "Common Classifiers",
        content: "Decision Trees, Naive Bayes (probabilistic), Support Vector Machines (SVM), and K-Nearest Neighbors (KNN)."
      }
    ]
  },
  {
    id: "kmeans-clustering",
    title: "5. Clustering Analysis (K-Means)",
    blocks: [
      {
        type: "definition",
        title: "Clustering",
        content: "An unsupervised learning technique that groups similar data points together based on attribute distances, so objects in the same cluster are highly similar, while objects in different clusters are highly distinct."
      },
      {
        type: "key-concept",
        title: "K-Means Algorithm steps",
        content: "1. Choose the number of clusters (K).\n2. Randomly select K points as initial centroids.\n3. Assign each data point to its closest centroid.\n4. Recompute the centroids of each cluster.\n5. Repeat steps 3 and 4 until centroids stop changing/converge."
      },
      {
        type: "remember",
        title: "Distance Metrics",
        content: "Most implementations use Euclidean distance to calculate the proximity between objects and centroids."
      }
    ]
  }
];
