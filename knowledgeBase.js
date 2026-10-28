// DataMineX - Comprehensive Offline Educational Knowledge Base & AI Tutor Engine
// 100% Free, Local-First, Zero Paid API Keys

export const KNOWLEDGE_BASE = [
  // 1. STAR SCHEMA VS SNOWFLAKE SCHEMA
  {
    id: 'star-vs-snowflake',
    category: 'Data Warehousing',
    title: 'Star Schema vs Snowflake Schema',
    keywords: ['star schema', 'snowflake schema', 'fact table', 'dimension table', 'dimensional modeling', 'schema design', 'denormalized', 'normalized'],
    summary: 'Comparison of dimensional modeling schemas for Analytical Data Warehouses.',
    twoMarks: `**Star Schema vs Snowflake Schema:**\n- **Star Schema:** Denormalized structure where a central Fact table connects directly to Dimension tables without sub-dimensions. Faster for OLAP read queries (fewer JOINs).\n- **Snowflake Schema:** Normalized structure where Dimension tables are split into sub-dimensions (e.g., Dim_Product -> Dim_Category). Eliminates redundancy but increases query complexity (multiple JOINs).`,
    fiveMarks: `### 1. Definition & Core Concept
- **Star Schema:** A dimensional architecture resembling a star, where a central **Fact Table** is directly linked to multiple denormalized **Dimension Tables**.
- **Snowflake Schema:** An extension of the Star Schema where dimension tables are normalized into 3NF, creating hierarchies of sub-dimension tables resembling a snowflake pattern.

### 2. Key Differences
| Parameter | Star Schema | Snowflake Schema |
| :--- | :--- | :--- |
| **Structure** | Central Fact + 1-level Dimensions | Central Fact + Normalized Sub-dimensions |
| **Normalization** | Denormalized (redundant attributes) | Fully Normalized (3NF) |
| **Query Performance** | Faster (minimal SQL JOINs) | Slower (complex multi-table JOINs) |
| **Storage Space** | Higher disk usage | Lower disk usage (no duplicate data) |
| **Maintenance** | Simpler ETL pipelines | More complex ETL pipelines |

### 3. Real-World Example
- **Star Schema:** \`Fact_Sales\` joins with \`Dim_Store\`, \`Dim_Date\`, and \`Dim_Product\` (which contains product_name, category, and department in one table).
- **Snowflake Schema:** \`Fact_Sales\` joins with \`Dim_Product\`, which joins with \`Dim_Category\`, which joins with \`Dim_Department\`.`,
    tenMarks: `### Comprehensive Guide: Dimensional Modeling Architectures

#### 1. Introduction
In Data Warehousing, dimensional modeling structures data for intuitive querying and analytical performance (OLAP). The two primary schema designs are **Star Schema** and **Snowflake Schema**.

#### 2. Star Schema Architecture
- **Fact Table:** Stores numerical additive metrics (e.g., \`quantity_sold\`, \`total_revenue\`, \`profit\`) and foreign keys referencing dimension tables.
- **Dimension Tables:** Contain descriptive textual context (e.g., customer name, store location, product name). In Star Schema, dimensions are deliberately denormalized to avoid JOIN bottlenecks.
- **Advantages:** Simple SQL queries, easy business comprehension, optimized for aggregation queries (CUBE/ROLLUP).
- **Disadvantages:** Attribute redundancy (e.g., city/state repeated for every customer address).

#### 3. Snowflake Schema Architecture
- **Normalization:** Normalizes dimension tables to remove transitive dependencies (Third Normal Form).
- **Sub-dimension Tables:** For example, \`Dim_Customer\` references \`Dim_City\`, which references \`Dim_Country\`.
- **Advantages:** Zero data redundancy, smaller disk storage footprint, easier updates to master hierarchy metadata.
- **Disadvantages:** Degradation of OLAP read speeds due to cascading SQL JOINs.

#### 4. Comparison Summary
Choose **Star Schema** when query latency and BI reporting simplicity are paramount. Choose **Snowflake Schema** when storage space is constrained or dimension hierarchies are extremely volatile.`,
    numericalExample: `**Scenario:** A retail chain has 10,000,000 sales transactions across 500 product categories and 5,000 products.\n- **Star Schema:** Fact_Sales has 10M rows. Dim_Product has 5,000 rows containing category strings directly. An OLAP query takes 1 JOIN (\`Fact_Sales ⨝ Dim_Product\`).\n- **Snowflake Schema:** Dim_Product has 5,000 rows with category_id. Dim_Category has 500 rows. The query requires 2 JOINs (\`Fact_Sales ⨝ Dim_Product ⨝ Dim_Category\`).`
  },

  // 2. 5 CORE OLAP OPERATIONS
  {
    id: 'olap-operations',
    category: 'Data Warehousing',
    title: '5 Core OLAP Operations & Data Cube',
    keywords: ['olap', 'roll up', 'drill down', 'slice', 'dice', 'pivot', 'data cube', 'olap operations', 'multidimensional'],
    summary: 'The five fundamental OLAP manipulations on a Multidimensional Data Cube.',
    twoMarks: `**5 Core OLAP Operations:**\n1. **Roll-up:** Aggregates data by climbing up a concept hierarchy (e.g., Day -> Month -> Year).\n2. **Drill-down:** Disaggregates data by stepping down a concept hierarchy (e.g., Country -> State -> City).\n3. **Slice:** Selects a single 2D sub-table by locking one dimension (e.g., Time = 'Q1 2026').\n4. **Dice:** Extracts a sub-cube by filtering across multiple dimensions simultaneously.\n5. **Pivot:** Rotates the visualization axes to view data from alternative perspectives.`,
    fiveMarks: `### 1. Definition of OLAP & Data Cube
Online Analytical Processing (OLAP) facilitates multidimensional data analysis for business intelligence. A **Data Cube** allows viewing data across dimensions such as Time, Item, and Location.

### 2. The 5 Operations Explained
1. **Roll-up (Drill-up):** Performs dimension reduction or steps up an attribute hierarchy (e.g., aggregating daily store sales into quarterly national revenue).
2. **Drill-down:** Opposite of Roll-up. Navigates from higher-level summary data into granular atomic records (e.g., Year -> Quarter -> Month -> Day).
3. **Slice:** Performs a selection on one dimension of the cube, resulting in a 2-dimensional sub-table.
4. **Dice:** Defines a sub-cube by executing a selection condition across two or more dimensions (e.g., (Location = 'New York' OR 'Boston') AND (Time = 'Q1') AND (Item = 'Laptops')).
5. **Pivot (Rotate):** Visual operation that rotates the reporting axes (e.g., swapping Rows and Columns) to give an alternate analytical perspective.`,
    tenMarks: `### Multidimensional Data Models & OLAP Operations

#### 1. Concept of Multidimensional Data Cube
A Data Cube is defined by dimensions and facts. Dimensions are the perspectives from which an organization wants to keep records (e.g., Store, Time, Product). Facts are continuous numerical quantities (e.g., Dollars Sold, Units Shipped).

#### 2. Detailed Breakdown of Operations
- **Roll-up:** Reduces the number of dimensions or traverses up a concept hierarchy. Math: Grouping by a coarser grain:
  $$\\text{Sales}(\\text{Region}, \\text{Year}) = \\sum_{\\text{City} \\in \\text{Region}, \\text{Qtr} \\in \\text{Year}} \\text{Sales}(\\text{City}, \\text{Qtr})$$
- **Drill-down:** Introduces finer dimensions or moves down a concept hierarchy. Math: Splitting aggregates into constituent sub-components.
- **Slice:** Projection onto a plane where one dimension index is held constant ($D_i = v$).
- **Dice:** Range selection across multiple dimensions:
  $$\\{ C(d_1, d_2, d_3) \\mid d_1 \\in V_1, d_2 \\in V_2, d_3 \\in V_3 \\}$$
- **Pivot:** Matrix transposition on the display layer without altering underlying database facts.`,
    numericalExample: `**Data Cube Numerical:**\nGiven a 3D Data Cube: Dimensions = Time (4 quarters), Location (3 cities), Product (2 types).\n- Total cells in base cuboid = $4 \\times 3 \\times 2 = 24$ cells.\n- **Slice:** Fix Location = 'Mumbai'. Remaining cells = $4 \\times 1 \\times 2 = 8$ cells (2D grid).\n- **Dice:** Filter Time $\\in \\{Q1, Q2\\}$, Product = 'Electronics', Location $\\in \\{\\text{Mumbai}, \\text{Delhi}\\}$. Remaining cells = $2 \\times 2 \\times 1 = 4$ cells.`
  },

  // 3. THE ETL PIPELINE & ARCHITECTURE
  {
    id: 'etl-process',
    category: 'Data Warehousing',
    title: 'The ETL (Extract, Transform, Load) Pipeline',
    keywords: ['etl', 'extract', 'transform', 'load', 'staging area', 'data warehouse architecture', 'data cleaning', 'surrogate key'],
    summary: 'The end-to-end data integration process that populates a Data Warehouse.',
    twoMarks: `**ETL Pipeline:**\n- **Extract:** Captures raw transactional data from heterogeneous source systems (RDBMS, ERP, APIs, CSV logs).\n- **Transform:** Cleanses errors, resolves missing values, deduplicates rows, normalizes data types, and generates surrogate keys in a staging area.\n- **Load:** Inserts structured facts and dimensions into the analytical Data Warehouse destination.`,
    fiveMarks: `### The ETL Architecture
The ETL process extracts data from operational systems, transforms it into a unified schema, and loads it into the warehouse.

1. **Extract Phase:**
   - Connects to disparate sources: OLTP databases, CRM, web logs, flat files.
   - Utilizes Change Data Capture (CDC) or full batch extraction to fetch new or modified records.
2. **Transform Phase (In Staging Area):**
   - **Data Cleansing:** Imputing missing values, trimming strings, fixing malformed dates.
   - **Deduplication:** Removing identical transaction records.
   - **Data Integration:** Harmonizing mismatched encodings (e.g., 'M'/'F' vs 'Male'/'Female').
   - **Surrogate Key Generation:** Assigning sequential integer primary keys to decouple dimensions from operational source IDs.
3. **Load Phase:**
   - **Initial Load:** Populates historical records into empty warehouse tables.
   - **Incremental / Refresh Load:** Updates fact tables and applies Slowly Changing Dimension (SCD) policies.`,
    tenMarks: `### Detailed Technical Analysis of the ETL Architecture

#### 1. Components of Enterprise ETL
- **Source Systems:** Operational OLTP systems optimized for write throughput (ACID compliance, 3NF).
- **Data Staging Area (DSA):** An intermediate storage area where raw extracts are landed. Direct queries by business users are prohibited in the staging area.
- **Data Warehouse Storage:** The target destination optimized for read throughput (denormalized Star Schema).
- **Data Marts:** Department-specific subsets (e.g., Marketing Mart, Finance Mart).

#### 2. Slowly Changing Dimensions (SCD) in ETL
- **SCD Type 1 (Overwrite):** Replaces old attribute values with new ones. No historical tracking.
- **SCD Type 2 (Add New Row):** Inserts a new record with effective date timestamps (\`start_date\`, \`end_date\`, \`is_current\`). Preserves full history.
- **SCD Type 3 (Add New Column):** Adds a \`previous_value\` column to preserve only the immediate prior state.`,
    numericalExample: `**SCD Type 2 Transformation:**\nCustomer ID 101 moves from 'Boston' to 'Seattle' on 2026-06-01.\n- Row 1: \`Cust_SK=1, ID=101, City='Boston', Start='2020-01-01', End='2026-05-31', Current=FALSE\`\n- Row 2: \`Cust_SK=2, ID=101, City='Seattle', Start='2026-06-01', End='9999-12-31', Current=TRUE\``
  },

  // 4. K-MEANS CLUSTERING
  {
    id: 'kmeans-clustering',
    category: 'Data Mining',
    title: 'K-Means Clustering Algorithm',
    keywords: ['kmeans', 'k-means', 'centroid', 'clustering', 'unsupervised', 'sse', 'euclidean distance', 'wcss'],
    summary: 'Iterative partitioning clustering algorithm grouping data around K centroids.',
    twoMarks: `**K-Means Clustering:**\n- An unsupervised partitioning algorithm that groups $N$ data points into $K$ pre-specified clusters.\n- Each point is assigned to its closest centroid using Euclidean distance: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.\n- Centroids are iteratively updated as the mean of assigned points until positions stabilize (convergence).`,
    fiveMarks: `### 1. Algorithm Overview
K-Means minimizes the Within-Cluster Sum of Squares (WCSS / SSE):
$$SSE = \\sum_{j=1}^{K} \\sum_{x_i \\in C_j} ||x_i - \\mu_j||^2$$

### 2. Step-by-Step Procedure
1. **Initialize:** Choose $K$ initial centroid positions $\\mu_1, \\mu_2, \\dots, \\mu_K$.
2. **Assignment Step:** For each data point $x_i$, compute distance to every centroid:
   $$d(x_i, \\mu_j) = \\sqrt{\\sum_{d=1}^{D} (x_{id} - \\mu_{jd})^2}$$
   Assign $x_i$ to cluster $C_j$ with the minimum distance.
3. **Update Step:** Recalculate each centroid as the arithmetic mean:
   $$\\mu_j = \\frac{1}{|C_j|} \\sum_{x_i \\in C_j} x_i$$
4. **Convergence:** Repeat steps 2 and 3 until centroids no longer move or max iterations are reached.`,
    tenMarks: `### Complete Mathematical Derivation & Analysis of K-Means

#### 1. Objective Function
K-Means seeks to partition $N$ observations into $K$ sets $S = \\{S_1, S_2, \\dots, S_K\\}$ to minimize:
$$J = \\sum_{i=1}^{K} \\sum_{x \\in S_i} ||x - \\mu_i||^2$$

#### 2. Convergence Properties
- The objective function $J$ is guaranteed to monotonically decrease or remain constant with each iteration because both the assignment step and centroid update step minimize SSE.
- Since there are a finite number of possible partitions ($K^N$), the algorithm always terminates in finite steps.
- However, K-Means converges to a **local optimum**, making centroid initialization critical (e.g., K-Means++).

#### 3. Strengths & Limitations
- **Strengths:** Time complexity is linear $O(I \\cdot K \\cdot N \\cdot D)$, efficient for large datasets.
- **Limitations:** User must specify $K$ beforehand; sensitive to outliers (mean is heavily skewed); struggles with non-spherical or overlapping cluster geometries.`,
    numericalExample: `**Step-by-Step K-Means Numerical Calculation:**\nPoints: $P_1(2, 4), P_2(3, 8), P_3(8, 2), P_4(9, 6)$. Let $K = 2$, Initial Centroids: $C_1 = P_1(2, 4), C_2 = P_3(8, 2)$.\n\n**Iteration 1 - Distance to $C_1(2, 4)$ and $C_2(8, 2)$:**\n- $P_1(2, 4)$: $d(P_1, C_1) = 0$, $d(P_1, C_2) = \\sqrt{(2-8)^2 + (4-2)^2} = \\sqrt{36+4} = \\sqrt{40} \\approx 6.32$ $\\rightarrow$ **Cluster 1**\n- $P_2(3, 8)$: $d(P_2, C_1) = \\sqrt{(3-2)^2 + (8-4)^2} = \\sqrt{1+16} = \\sqrt{17} \\approx 4.12$, $d(P_2, C_2) = \\sqrt{(3-8)^2 + (8-2)^2} = \\sqrt{25+36} = \\sqrt{61} \\approx 7.81$ $\\rightarrow$ **Cluster 1**\n- $P_3(8, 2)$: $d(P_3, C_1) = 6.32$, $d(P_3, C_2) = 0$ $\\rightarrow$ **Cluster 2**\n- $P_4(9, 6)$: $d(P_4, C_1) = \\sqrt{(9-2)^2 + (6-4)^2} = \\sqrt{49+4} = \\sqrt{53} \\approx 7.28$, $d(P_4, C_2) = \\sqrt{(9-8)^2 + (6-2)^2} = \\sqrt{1+16} = \\sqrt{17} \\approx 4.12$ $\\rightarrow$ **Cluster 2**\n\n**Cluster Assignments:**\n- Cluster 1 = $\\{P_1, P_2\\}$\n- Cluster 2 = $\\{P_3, P_4\\}$\n\n**New Centroids:**\n- $C_1^{\\text{new}} = (\\frac{2+3}{2}, \\frac{4+8}{2}) = (2.5, 6.0)$\n- $C_2^{\\text{new}} = (\\frac{8+9}{2}, \\frac{2+6}{2}) = (8.5, 4.0)$`
  },

  // 5. APRIORI ALGORITHM
  {
    id: 'apriori-algorithm',
    category: 'Data Mining',
    title: 'Apriori Algorithm & Association Rule Mining',
    keywords: ['apriori', 'association rules', 'support', 'confidence', 'lift', 'market basket', 'frequent itemset', 'anti-monotonicity'],
    summary: 'Mining frequent itemsets and association rules using candidate generation and pruning.',
    twoMarks: `**Apriori Algorithm:**\n- Discovers co-occurrence relationships and association rules ($A \\rightarrow B$) in transactional databases.\n- **Support:** Frequency of an itemset: $\\text{Supp}(A \\cup B) = \\frac{\\text{Count}(A \\cup B)}{N}$.\n- **Confidence:** Conditional certainty: $\\text{Conf}(A \\rightarrow B) = \\frac{\\text{Count}(A \\cup B)}{\\text{Count}(A)}$.\n- **Apriori Principle:** All non-empty subsets of a frequent itemset must also be frequent (anti-monotonicity property).`,
    fiveMarks: `### 1. Core Metrics in Association Rule Mining
1. **Support:** Fraction of transactions that contain $X \\cup Y$:
   $$\\text{Support}(X \\rightarrow Y) = \\frac{\\sigma(X \\cup Y)}{N}$$
2. **Confidence:** Probability that a transaction contains $Y$ given that it contains $X$:
   $$\\text{Confidence}(X \\rightarrow Y) = \\frac{\\sigma(X \\cup Y)}{\\sigma(X)}$$
3. **Lift:** Measures independence between $X$ and $Y$:
   $$\\text{Lift}(X \\rightarrow Y) = \\frac{\\text{Confidence}(X \\rightarrow Y)}{\\text{Support}(Y)} = \\frac{P(X \\cap Y)}{P(X) \\cdot P(Y)}$$
   - $\\text{Lift} > 1$: Positive correlation (items co-occur more than by chance).
   - $\\text{Lift} = 1$: Independent items.
   - $\\text{Lift} < 1$: Negative correlation.

### 2. The Apriori Pruning Principle
If an itemset is infrequent, then all of its supersets will also be infrequent and can be pruned without checking transactions.`,
    tenMarks: `### Comprehensive Association Rule Mining & Candidate Generation

#### 1. The Two-Step Association Mining Process
1. **Frequent Itemset Generation:** Find all itemsets whose support is $\\ge \\text{min\\_sup}$.
2. **Rule Generation:** From frequent itemsets, extract rules with confidence $\\ge \\text{min\\_conf}$.

#### 2. Candidate Generation ($C_k$) & Join Step
- To generate candidate $k$-itemsets ($C_k$), perform a join of $L_{k-1}$ with itself:
  $L_{k-1} \\bowtie L_{k-1}$ where items share the first $k-2$ elements.
- **Pruning Step:** For every candidate $c \\in C_k$, verify if any of its $(k-1)$-subsets is not in $L_{k-1}$. If so, discard $c$.

#### 3. Complexity Analysis
The naive search space for $d$ items is $2^d - 1$ possible itemsets. Apriori drastically trims this exponential lattice using downward closure (the Apriori property).`,
    numericalExample: `**Apriori Worked Numerical:**\nTransactions ($N = 4$):\n- $T_1$: {Bread, Milk}\n- $T_2$: {Bread, Diaper, Beer, Eggs}\n- $T_3$: {Milk, Diaper, Beer, Cola}\n- $T_4$: {Bread, Milk, Diaper, Beer}\nLet $\\text{min\\_sup} = 50\\%$ (Count $\\ge 2$), $\\text{min\\_conf} = 75\\%$.\n\n**Step 1: Frequent 1-itemsets ($L_1$):**\n- Bread: 3 (75%)\n- Milk: 3 (75%)\n- Diaper: 3 (75%)\n- Beer: 3 (75%)\n- Eggs: 1 (<50%, pruned)\n- Cola: 1 (<50%, pruned)\n\n**Step 2: Frequent 2-itemsets ($L_2$):**\n- {Bread, Milk}: 2 (50%)\n- {Bread, Diaper}: 2 (50%)\n- {Bread, Beer}: 2 (50%)\n- {Milk, Diaper}: 2 (50%)\n- {Milk, Beer}: 2 (50%)\n- {Diaper, Beer}: 3 (75%)\n\n**Step 3: Rule Generation for {Diaper, Beer}:**\n- Rule 1: $\\text{Diaper} \\rightarrow \\text{Beer}$\n  $\\text{Confidence} = \\frac{\\text{Count}(\\text{Diaper, Beer})}{\\text{Count}(\\text{Diaper})} = \\frac{3}{3} = 100\\%$ (Valid, $\\ge 75\\%$)\n- Rule 2: $\\text{Beer} \\rightarrow \\text{Diaper}$\n  $\\text{Confidence} = \\frac{3}{3} = 100\\%$ (Valid)`
  },

  // 6. ID3 DECISION TREE (ENTROPY & INFORMATION GAIN)
  {
    id: 'decision-tree-id3',
    category: 'Data Mining',
    title: 'ID3 Decision Tree: Entropy & Information Gain',
    keywords: ['decision tree', 'id3', 'entropy', 'information gain', 'classification', 'gain ratio', 'shannon entropy', 'split attribute'],
    summary: 'Constructing decision trees by greedily choosing attributes with highest Information Gain.',
    twoMarks: `**ID3 Decision Tree & Entropy:**\n- **Shannon Entropy:** Measures impurity or uncertainty in a dataset: $H(S) = -\\sum p_i \\log_2(p_i)$.\n- **Information Gain:** Expected reduction in entropy from splitting on attribute $A$: $\\text{Gain}(S, A) = H(S) - \\sum \\frac{|S_v|}{|S|} H(S_v)$.\n- The attribute with the **highest Information Gain** is chosen as the root/decision node.`,
    fiveMarks: `### 1. Mathematical Formulas
- **Entropy of System $S$:**
  $$H(S) = -\\sum_{i=1}^{c} p_i \\log_2(p_i)$$
  *(where $p_i$ is probability of class $i$, with $0 \\log_2 0 = 0$)*
- **Expected Entropy after Splitting on Attribute $A$:**
  $$H(S, A) = \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)$$
- **Information Gain:**
  $$\\text{Gain}(S, A) = H(S) - H(S, A)$$

### 2. Algorithmic Steps
1. Compute the total system entropy $H(S)$ for the target class.
2. For every candidate attribute $A$, partition dataset into subsets $S_v$.
3. Compute the entropy of each subset $H(S_v)$ and the weighted expected entropy $H(S, A)$.
4. Calculate $\\text{Gain}(S, A)$.
5. Select the attribute with the maximum Information Gain as the decision node.`,
    tenMarks: `### Comprehensive Decision Tree Construction via ID3

#### 1. Concept of Entropy & Purity
Entropy quantifies the disorder of a set:
- If all samples belong to the same class, $H(S) = 0$ (pure).
- If samples are equally split between 2 classes, $H(S) = 1$ (maximum impurity).

#### 2. ID3 Algorithm Recursive Steps
1. If all examples in $S$ belong to class $C$, return single leaf node $C$.
2. If attributes list is empty, return leaf node with majority class.
3. Otherwise, calculate Information Gain for all unused attributes.
4. Set decision node to $A_{\\text{best}} = \\arg\\max \\text{Gain}(S, A)$.
5. For each value $v$ of $A_{\\text{best}}$, create a branch and recursively call ID3 with subset $S_v$.`,
    numericalExample: `**Entropy & Information Gain Worked Calculation:**\nDataset: 14 instances. Target Class: Play Tennis (9 Yes, 5 No).\n\n**1. System Entropy $H(S)$:**\n$$p_{\\text{Yes}} = \\frac{9}{14} \\approx 0.643, \\quad p_{\\text{No}} = \\frac{5}{14} \\approx 0.357$$\n$$H(S) = -\\left(\\frac{9}{14}\\log_2\\frac{9}{14} + \\frac{5}{14}\\log_2\\frac{5}{14}\\right) = -(0.643 \\times (-0.637) + 0.357 \\times (-1.485)) = 0.409 + 0.531 = 0.940$$\n\n**2. Attribute: Wind (Values: Weak, Strong)**\n- Weak (8 instances): 6 Yes, 2 No $\\rightarrow H(\\text{Weak}) = -(\\frac{6}{8}\\log_2\\frac{6}{8} + \\frac{2}{8}\\log_2\\frac{2}{8}) = 0.811$\n- Strong (6 instances): 3 Yes, 3 No $\\rightarrow H(\\text{Strong}) = 1.000$\n\n**3. Expected Entropy:**\n$$H(S, \\text{Wind}) = \\frac{8}{14}(0.811) + \\frac{6}{14}(1.000) = 0.463 + 0.429 = 0.892$$\n\n**4. Information Gain:**\n$$\\text{Gain}(S, \\text{Wind}) = 0.940 - 0.892 = 0.048$$`
  },

  // 7. LINEAR REGRESSION (OLS)
  {
    id: 'linear-regression',
    category: 'Data Mining',
    title: 'Simple Linear Regression (Ordinary Least Squares)',
    keywords: ['linear regression', 'regression', 'slope', 'intercept', 'least squares', 'ols', 'r-squared', 'mse'],
    summary: 'Predicting continuous target variables using optimal slope and intercept parameters.',
    twoMarks: `**Simple Linear Regression:**\n- Fits a linear relationship between independent variable $X$ and dependent variable $Y$: $y = mx + c$.\n- **Slope ($m$):** $m = \\frac{N\\sum XY - \\sum X \\sum Y}{N\\sum X^2 - (\\sum X)^2}$.\n- **Intercept ($c$):** $c = \\bar{Y} - m \\bar{X}$.\n- Evaluated using Mean Squared Error (MSE) and Coefficient of Determination ($R^2$).`,
    fiveMarks: `### 1. Formula & Derivation
The regression line minimizes the sum of squared vertical residuals: $\\sum (y_i - \\hat{y}_i)^2$.

- **Slope ($m$):**
  $$m = \\frac{\\sum_{i=1}^N (x_i - \\bar{X})(y_i - \\bar{Y})}{\\sum_{i=1}^N (x_i - \\bar{X})^2} = \\frac{N\\sum XY - \\sum X\\sum Y}{N\\sum X^2 - (\\sum X)^2}$$
- **Intercept ($c$):**
  $$c = \\bar{Y} - m\\bar{X}$$
- **Goodness-of-Fit ($R^2$):**
  $$R^2 = 1 - \\frac{SS_{\\text{res}}}{SS_{\\text{tot}}} = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{Y})^2}$$`,
    tenMarks: `### Complete Mathematical Theory of Ordinary Least Squares Regression

#### 1. Objective of OLS
Given points $(x_1, y_1), \\dots, (x_N, y_N)$, find line $\\hat{y} = mx + c$ minimizing error loss function:
$$L(m, c) = \\sum_{i=1}^N (y_i - (mx_i + c))^2$$

#### 2. Derivation of Normal Equations
Taking partial derivatives with respect to $m$ and $c$:
1. $\\frac{\\partial L}{\\partial c} = -2\\sum (y_i - mx_i - c) = 0 \\implies c = \\bar{Y} - m\\bar{X}$
2. $\\frac{\\partial L}{\\partial m} = -2\\sum x_i(y_i - mx_i - c) = 0$
Substituting $c$ yields the standard closed-form formula for $m$.`,
    numericalExample: `**Linear Regression Step-by-Step Calculation:**\nData: $(1, 2), (2, 3), (3, 5), (4, 4), (5, 6)$ ($N = 5$).\n\n- $\\sum X = 1+2+3+4+5 = 15 \\rightarrow \\bar{X} = 3$\n- $\\sum Y = 2+3+5+4+6 = 20 \\rightarrow \\bar{Y} = 4$\n- $\\sum XY = (1)(2) + (2)(3) + (3)(5) + (4)(4) + (5)(6) = 2 + 6 + 15 + 16 + 30 = 69$\n- $\\sum X^2 = 1 + 4 + 9 + 16 + 25 = 55$\n\n**Calculate Slope ($m$):**\n$$m = \\frac{5(69) - (15)(20)}{5(55) - (15)^2} = \\frac{345 - 300}{275 - 225} = \\frac{45}{50} = 0.9$$\n\n**Calculate Intercept ($c$):**\n$$c = \\bar{Y} - m\\bar{X} = 4 - (0.9)(3) = 4 - 2.7 = 1.3$$\n\n**Regression Equation:**\n$$\\mathbf{y = 0.9x + 1.3}$$\nFor $x = 6$: $\\hat{y} = 0.9(6) + 1.3 = 6.7$`
  },

  // 8. IQR OUTLIER DETECTION
  {
    id: 'iqr-outliers',
    category: 'Data Mining',
    title: 'Interquartile Range (IQR) & Outlier Detection',
    keywords: ['iqr', 'outlier', 'quartile', 'q1', 'q3', 'box plot', 'fences', 'tukey'],
    summary: 'Detecting anomalous extreme values using non-parametric quartile fences.',
    twoMarks: `**IQR Outlier Detection:**\n- **First Quartile ($Q_1$):** 25th percentile of sorted data.\n- **Third Quartile ($Q_3$):** 75th percentile of sorted data.\n- **Interquartile Range:** $IQR = Q_3 - Q_1$.\n- **Fences:** Lower Fence = $Q_1 - 1.5 \\times IQR$, Upper Fence = $Q_3 + 1.5 \\times IQR$.\n- Values outside the fences are classified as outliers.`,
    fiveMarks: `### 1. Tukey's Fences Methodology
The Interquartile Range method is a robust, non-parametric statistical technique for outlier identification that does not assume normal distribution.

### 2. Steps to Calculate Outliers
1. Sort data in ascending order: $x_{(1)} \\le x_{(2)} \\le \\dots \\le x_{(n)}$.
2. Compute the Median ($Q_2$), dividing data into lower and upper halves.
3. Compute $Q_1$ (median of lower half) and $Q_3$ (median of upper half).
4. Compute $IQR = Q_3 - Q_1$.
5. Establish boundaries:
   $$\\text{Lower Fence} = Q_1 - 1.5 \\times IQR$$
   $$\\text{Upper Fence} = Q_3 + 1.5 \\times IQR$$
6. Flag any point $x_i < \\text{Lower Fence}$ or $x_i > \\text{Upper Fence}$ as an outlier.`,
    tenMarks: `### Full Statistical Foundation of Box Plot & Quartile Analysis

#### 1. Why IQR is Preferred over Z-Score
The Z-Score relies on Mean ($\\mu$) and Standard Deviation ($\\sigma$), both of which are heavily distorted by extreme values (non-resistant statistics). $Q_1$, $Q_3$, and $IQR$ are order-based resistant statistics that remain stable even when extreme anomalies contaminate the sample.

#### 2. Extreme Outliers vs Mild Outliers
- **Mild Outliers:** Values between the inner fences ($1.5 \\times IQR$) and outer fences ($3.0 \\times IQR$).
- **Extreme Outliers:** Values lying beyond outer fences: $x > Q_3 + 3 \\times IQR$ or $x < Q_1 - 3 \\times IQR$.`,
    numericalExample: `**IQR Outlier Worked Calculation:**\nData: $10, 12, 14, 15, 17, 18, 19, 21, 22, 55$ ($N = 10$).\n\n1. Sorted: $10, 12, 14, 15, 17, 18, 19, 21, 22, 55$.\n2. Lower Half: $10, 12, 14, 15, 17 \\rightarrow Q_1 = 14$\n3. Upper Half: $18, 19, 21, 22, 55 \\rightarrow Q_3 = 21$\n4. $IQR = Q_3 - Q_1 = 21 - 14 = 7$\n5. **Lower Fence:** $14 - 1.5(7) = 14 - 10.5 = \\mathbf{3.5}$\n6. **Upper Fence:** $21 + 1.5(7) = 21 + 10.5 = \\mathbf{31.5}$\n\n**Outlier Identification:**\n$55 > 31.5 \\rightarrow$ **55 is an Outlier!**`
  },

  // 9. DATA NORMALIZATION
  {
    id: 'data-normalization',
    category: 'Data Mining',
    title: 'Data Normalization Techniques',
    keywords: ['normalization', 'min-max', 'z-score', 'decimal scaling', 'standardization', 'data preprocessing'],
    summary: 'Scaling numerical attributes into standard ranges for distance-based ML models.',
    twoMarks: `**Data Normalization Techniques:**\n1. **Min-Max Normalization:** Scales data into $[\\text{new\\_min}, \\text{new\\_max}]$ (commonly $[0, 1]$):\n   $$v' = \\frac{v - \\min}{\\max - \\min} (\\text{new\\_max} - \\text{new\\_min}) + \\text{new\\_min}$$\n2. **Z-Score Standardization:** Normalizes to zero mean and unit variance:\n   $$z = \\frac{v - \\mu}{\\sigma}$$\n3. **Decimal Scaling:** Normalizes by shifting decimal point by power of 10: $v' = \\frac{v}{10^j}$.`,
    fiveMarks: `### 1. Purpose of Normalization
Algorithms relying on distance calculations (K-Means, KNN, SVM) are sensitive to feature magnitude. Features with larger ranges dominate distance calculations unless normalized.

### 2. The Three Standard Methods
1. **Min-Max Normalization:**
   Maps values linearly to a designated range (typically $[0, 1]$). Sensitive to future out-of-bound values.
2. **Z-Score Normalization (Standardization):**
   $$z = \\frac{v - \\bar{A}}{\\sigma_A}$$
   Ideal when min/max values are unknown or outliers exist.
3. **Decimal Scaling:**
   $$v' = \\frac{v}{10^j}$$
   where $j$ is the smallest integer such that $\\max(|v'|) < 1$.`,
    tenMarks: `### Comparative Engineering Analysis of Normalization

#### 1. Mathematical Formulas
- **Min-Max:** $v' = \\frac{v - \\min_A}{\\max_A - \\min_A}(new\\_max_A - new\\_min_A) + new\\_min_A$
- **Z-Score:** $v' = \\frac{v - \\mu_A}{\\sigma_A}$, where $\\sigma_A = \\sqrt{\\frac{1}{N}\\sum(v_i - \\mu_A)^2}$
- **Decimal Scaling:** $j = \\lceil \\log_{10}(\\max|A| + 1) \\rceil$

#### 2. Selection Criteria
- Use **Min-Max** when bounds are strictly bounded (e.g., image pixels $[0, 255] \\rightarrow [0, 1]$).
- Use **Z-Score** when data follows Gaussian distribution or contains outliers.`,
    numericalExample: `**Worked Normalization Calculation:**\nData: $\\{200, 300, 500, 800\\}$. Let $v = 500$.\n- $\\min = 200, \\max = 800$.\n- **Min-Max to $[0, 1]$:**\n  $$v' = \\frac{500 - 200}{800 - 200} = \\frac{300}{600} = \\mathbf{0.5}$$\n- **Decimal Scaling:** $\\max = 800 \\implies j = 3$ ($10^3 = 1000$):\n  $$v' = \\frac{500}{1000} = \\mathbf{0.5}$$`
  }
];

// Smart Query Retrieval & Response Engine
export function queryKnowledgeBase(queryText) {
  if (!queryText || typeof queryText !== 'string') {
    return {
      success: false,
      error: 'Query text is required.'
    };
  }

  const query = queryText.trim().toLowerCase();

  // 1. Detect requested format
  let format = 'auto'; // '2marks' | '5marks' | '10marks' | 'numerical'
  if (query.includes('2 mark') || query.includes('two mark') || query.includes('define') || query.includes('short answer')) {
    format = '2marks';
  } else if (query.includes('5 mark') || query.includes('five mark')) {
    format = '5marks';
  } else if (query.includes('10 mark') || query.includes('ten mark') || query.includes('detail') || query.includes('comprehensive')) {
    format = '10marks';
  } else if (query.includes('numerical') || query.includes('solve') || query.includes('calculate') || query.includes('step by step') || query.includes('example')) {
    format = 'numerical';
  }

  // 2. Score knowledge base entries
  let bestMatch = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (query.includes(kw)) {
        score += kw.length * 2; // longer matched keywords score higher
      }
    }
    if (item.title.toLowerCase().includes(query)) {
      score += 15;
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // 3. Fallback if no specific topic match
  if (!bestMatch || highestScore === 0) {
    return {
      success: true,
      matched: false,
      topic: 'General Data Science & Engineering',
      category: 'DataMineX Education',
      title: 'Data Warehousing & Data Mining Guide',
      answer: `### DataMineX Educational Tutor\n\nYou asked: **"${queryText}"**.\n\nWhile I did not find an exact match for that specific phrase, here are the topics available in DataMineX:\n\n1. **Data Warehousing:** Star Schema vs Snowflake, 5 Core OLAP Operations, ETL Staging Architecture, Data Cubes.\n2. **Clustering & Classification:** K-Means, K-Medoids (PAM), Hierarchical Dendrograms, DBSCAN, ID3 Decision Trees, Naive Bayes, KNN.\n3. **Association & Prediction:** Apriori Algorithm, Support/Confidence/Lift, Linear Regression (OLS).\n4. **Preprocessing & Statistics:** Min-Max & Z-Score Normalization, IQR Outlier Fences, Binning.\n\n💡 *Tip: Try asking: "Explain 5 OLAP operations", "Solve a K-Means numerical", or "Give a 5 mark answer for Star Schema".*`,
      toolsLink: '#/numerical-solver'
    };
  }

  // 4. Construct response according to format
  let responseContent = '';
  if (format === '2marks') {
    responseContent = `### ${bestMatch.title} (2 Marks Exam Answer)\n\n${bestMatch.twoMarks}`;
  } else if (format === '5marks') {
    responseContent = `### ${bestMatch.title} (5 Marks Exam Answer)\n\n${bestMatch.fiveMarks}`;
  } else if (format === '10marks') {
    responseContent = `### ${bestMatch.title} (10 Marks University Exam Answer)\n\n${bestMatch.tenMarks}`;
  } else if (format === 'numerical') {
    responseContent = `### ${bestMatch.title} (Worked Numerical Solution)\n\n${bestMatch.numericalExample || bestMatch.fiveMarks}`;
  } else {
    // Default smart comprehensive answer
    responseContent = `### ${bestMatch.title}\n\n${bestMatch.fiveMarks}\n\n---\n#### 📝 Worked Numerical Example:\n${bestMatch.numericalExample}`;
  }

  return {
    success: true,
    matched: true,
    topic: bestMatch.id,
    category: bestMatch.category,
    title: bestMatch.title,
    format,
    answer: responseContent,
    toolsLink: bestMatch.category === 'Data Mining' ? '#/numerical-solver' : '#/olap-visualizer'
  };
}
