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
    id: "mining-architecture",
    title: "3. Data Mining System Architecture",
    blocks: [
      {
        type: "definition",
        title: "System Components",
        content: "A typical data mining system consists of: 1. Database / Data Warehouse / Information Repository, 2. Database / DWH Server, 3. Knowledge Base (domain knowledge & heuristics), 4. Data Mining Engine (algorithms), 5. Pattern Evaluation Module, and 6. Graphical User Interface."
      },
      {
        type: "key-concept",
        title: "KDD Pipeline Architecture",
        content: "Raw Data ➔ Selection & Cleaning ➔ Preprocessed Data ➔ Transformation ➔ Transformed Data ➔ Data Mining Engine ➔ Patterns ➔ Evaluation & Presentation ➔ Actionable Knowledge."
      }
    ]
  },
  {
    id: "data-exploration",
    title: "4. Exploratory Data Analysis (EDA)",
    blocks: [
      {
        type: "definition",
        title: "Visual Data Exploration",
        content: "Before building models, analysts inspect feature distributions, central tendencies, correlations, and outliers using visual plots."
      },
      {
        type: "key-concept",
        title: "Essential Plot Types",
        content: "1. Scatter Plot: Reveals bivariate relationships and correlation trends between two continuous numerical variables.\n2. Bar Chart: Visualizes frequency distributions across discrete categories.\n3. Box Plot (Box & Whisker): Displays the five-number summary (Minimum, Q1, Median, Q3, Maximum) and detects outliers."
      }
    ]
  },
  {
    id: "apriori-algorithm",
    title: "5. Association Rule Mining (Apriori)",
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
    title: "6. Classification (Decision Tree & Naive Bayes)",
    blocks: [
      {
        type: "definition",
        title: "Supervised Classification",
        content: "A predictive modeling technique that maps input data attributes into predefined discrete target classes based on labeled training records."
      },
      {
        type: "key-concept",
        title: "Decision Trees vs Naive Bayes",
        content: "1. Decision Tree: Uses Information Gain or Gini Index to recursively split dataset into pure branch nodes, producing human-interpretable IF-THEN rules.\n2. Naive Bayes: Probabilistic classifier based on Bayes' Theorem with the assumption of conditional independence among predictors: P(C|X) = P(X|C) * P(C) / P(X)."
      }
    ]
  },
  {
    id: "kmeans-clustering",
    title: "7. Clustering (K-Means & Hierarchical)",
    blocks: [
      {
        type: "definition",
        title: "Clustering Analysis",
        content: "An unsupervised learning technique that groups data objects into clusters such that objects within the same cluster have high similarity, while objects in different clusters have low similarity."
      },
      {
        type: "key-concept",
        title: "Partitioning vs Hierarchical",
        content: "1. K-Means (Partitioning): Divides N data points into K pre-specified clusters by iteratively minimizing the sum of squared distances to cluster centroids.\n2. Hierarchical Clustering (Agglomerative): Starts with each point as an individual cluster and iteratively merges the closest pairs of clusters into a tree structure called a Dendrogram."
      },
      {
        type: "remember",
        title: "Euclidean Distance",
        content: "The standard distance metric between two points (x1, y1) and (x2, y2) is: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)."
      }
    ]
  }
];
