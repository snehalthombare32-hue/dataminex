// DataMineX - Interactive Practice & Quiz Engine

// Questions Database (3 high-yield questions per lesson for comprehensive mastery)
export const practiceQuestions = {
  // ==========================================
  // DATA WAREHOUSE MODULE LESSONS
  // ==========================================
  "intro-warehouse": [
    {
      id: "iw-q1",
      question: "Which characteristic of a Data Warehouse refers to data remaining constant and unchanging once loaded?",
      options: [
        "Subject-Oriented",
        "Integrated",
        "Non-Volatile",
        "Time-Variant"
      ],
      correctIndex: 2,
      explanation: "Non-Volatile means that once data enters the warehouse, it is read-only and does not change. This ensures historical records remain consistent for analysis."
    },
    {
      id: "iw-q2",
      question: "Why is a Data Warehouse described as 'Subject-Oriented'?",
      options: [
        "It organizes data around core business subjects (customers, products, sales) rather than operational transactions",
        "It requires a subject-matter expert to execute every SQL query",
        "It only stores records from a single corporate department",
        "It automatically purges data subjects every quarter"
      ],
      correctIndex: 0,
      explanation: "Subject-Oriented means data focuses on analyzing key entities (e.g., Sales, Customers, Products) to support decision-making, rather than daily transaction tasks."
    },
    {
      id: "iw-q3",
      question: "What distinguishes 'Time-Variant' data in a warehouse from operational database records?",
      options: [
        "Warehouse data is automatically deleted after 30 days",
        "Every data point in the warehouse is explicitly bound to a historical time horizon (e.g. 5–10 years)",
        "Timestamps cannot be stored or queried in a warehouse",
        "Data can only be loaded during midnight batch windows"
      ],
      correctIndex: 1,
      explanation: "Time-Variant means data is tracked over historical time horizons (e.g., 5 to 10 years), allowing trend analysis and time comparisons."
    }
  ],

  "architecture": [
    {
      id: "wa-q1",
      question: "What is the primary function of the Middle Tier in a three-tier Data Warehouse architecture?",
      options: [
        "Serving raw data source connections",
        "Hosting the OLAP server for multidimensional queries",
        "Displaying visual report dashboards to business managers",
        "Running physical transaction validation checks"
      ],
      correctIndex: 1,
      explanation: "The middle tier typically hosts an OLAP server (ROLAP or MOLAP) which manages multi-dimensional operations and queries between the warehouse database (bottom tier) and client tools (top tier)."
    },
    {
      id: "wa-q2",
      question: "Which component makes up the Bottom Tier in the typical 3-tier warehouse architecture?",
      options: [
        "Web browser reporting portals",
        "Relational database server storing cleaned enterprise data and data marts",
        "Spreadsheet calculation macros",
        "Client-side caching proxies"
      ],
      correctIndex: 1,
      explanation: "The Bottom Tier is the database server (relational DBMS) where warehouse storage, metadata repositories, and data marts physically reside."
    },
    {
      id: "wa-q3",
      question: "What role does the Top Tier play in a Data Warehouse architecture?",
      options: [
        "Executing raw database disk defragmentation",
        "Providing front-end client tools such as BI dashboards, query tools, and data mining workbenches",
        "Managing physical fiber-channel SAN disk arrays",
        "Generating hardware clock interrupts"
      ],
      correctIndex: 1,
      explanation: "The Top Tier consists of the front-end presentation layer where analysts interact with reporting dashboards and query tools."
    }
  ],

  "oltp-vs-olap": [
    {
      id: "oo-q1",
      question: "Which design standard is typically optimized for OLTP databases?",
      options: [
        "Highly normalized schemas (3NF) to prevent anomalies and redundant writes",
        "Denormalized schemas (Star schema) to speed up joins",
        "Wide column stores without constraints",
        "Pre-aggregated tables with indexes"
      ],
      correctIndex: 0,
      explanation: "OLTP databases are designed for rapid, frequent transactional updates (inserts/updates). Highly normalized tables (3NF) reduce redundancy and prevent update anomalies."
    },
    {
      id: "oo-q2",
      question: "What is the typical access pattern and unit of work for an OLAP system?",
      options: [
        "High-frequency, single-record INSERT and UPDATE operations",
        "Complex, read-heavy analytical queries scanning millions of historical records",
        "Simple password validations",
        "Real-time point-of-sale checkout register writes"
      ],
      correctIndex: 1,
      explanation: "OLAP workloads are read-heavy, executing multi-table aggregations and scans across historical data to produce analytical reports."
    },
    {
      id: "oo-q3",
      question: "How does the user base of an OLTP database differ from an OLAP database?",
      options: [
        "OLTP is used by data scientists; OLAP is used by retail customers",
        "OLTP serves operational clerks and end-users; OLAP serves executives, managers, and analysts",
        "Both systems exclusively serve network engineers",
        "OLAP has millions of concurrent writes from mobile app users"
      ],
      correctIndex: 1,
      explanation: "OLTP is operated by frontline staff and transaction systems (e.g., e-commerce buyers), while OLAP is queried by decision makers and data analysts."
    }
  ],

  "etl-process": [
    {
      id: "ep-q1",
      question: "Which operation belongs to the Transform stage of the ETL pipeline?",
      options: [
        "Pulling raw customer files from an external API",
        "Removing duplicate transactions, resolving nulls, and standardizing date formats",
        "Writing uniform rows into the Fact table",
        "Running a SELECT query on loaded tables"
      ],
      correctIndex: 1,
      explanation: "The Transform stage handles data cleaning, de-duplication, format standardisation, and structural rules before loading records into the final warehouse."
    },
    {
      id: "ep-q2",
      question: "What occurs during the 'Extract' phase of ETL?",
      options: [
        "Aggregating sales by quarter",
        "Retrieving raw data from disparate operational sources (ERP, CRM, logs, flat files)",
        "Deleting old warehouse tables",
        "Configuring CSS dashboard color schemes"
      ],
      correctIndex: 1,
      explanation: "Extraction gathers data from operational databases, flat files, ERPs, CRM systems, and external APIs into a staging area."
    },
    {
      id: "ep-q3",
      question: "What is the primary architectural advantage of ELT (Extract, Load, Transform) over traditional ETL?",
      options: [
        "It eliminates the need for data transformation completely",
        "It leverages the massive distributed processing power of cloud warehouses to transform data after loading",
        "It cannot process SQL queries",
        "It only works with local CSV files"
      ],
      correctIndex: 1,
      explanation: "ELT loads raw data directly into high-performance warehouses/lakes first, then executes high-speed in-database transformations."
    }
  ],

  "fact-dimension": [
    {
      id: "fd-q1",
      question: "What does a Fact Table typically store?",
      options: [
        "Product names, descriptions, and categories",
        "Customer addresses and contact directories",
        "Quantitative business metrics and foreign key links to dimensions",
        "Audit logs of database maintenance tasks"
      ],
      correctIndex: 2,
      explanation: "Fact tables contain quantitative metrics, facts, or measures of business activities (e.g. Sales Amount, Units Sold) and foreign keys that connect to dimension records."
    },
    {
      id: "fd-q2",
      question: "What is meant by the 'Grain' of a Fact Table?",
      options: [
        "The physical disk file size on the storage server",
        "The exact atomic level of detail represented by a single row in the table",
        "The number of primary keys defined across the schema",
        "The SQL database collation language"
      ],
      correctIndex: 1,
      explanation: "Grain defines exactly what one row in the fact table represents (e.g., individual item sold per transaction vs. daily sales total per store)."
    },
    {
      id: "fd-q3",
      question: "Which type of table holds descriptive context such as store location, customer segment, or product brand?",
      options: [
        "Fact Table",
        "Dimension Table",
        "Aggregate Metric Table",
        "Transaction Log Table"
      ],
      correctIndex: 1,
      explanation: "Dimension tables hold descriptive context used to filter, group, and slice facts (e.g., Store Name, Customer Demographics, Product Category)."
    }
  ],

  "star-schema": [
    {
      id: "ss-q1",
      question: "Why are dimension tables in a Star Schema denormalized?",
      options: [
        "To reduce the disk space consumed by database files",
        "To optimize query performance by reducing required SQL JOINs",
        "To make inserting records into dimensions faster",
        "To prevent users from writing custom query filters"
      ],
      correctIndex: 1,
      explanation: "Denormalization repeats attributes (like category names) in dimensions. This avoids multiple joins, optimizing read-heavy analytical query execution speeds."
    },
    {
      id: "ss-q2",
      question: "In a Star Schema, how are Dimension Tables connected to the central Fact Table?",
      options: [
        "Each dimension is directly joined to the central Fact Table via Foreign Key to Primary Key relationships",
        "Dimensions form a long daisy-chain of lookup sub-tables",
        "There are zero foreign keys between facts and dimensions",
        "Dimensions are connected to each other without touching the fact table"
      ],
      correctIndex: 0,
      explanation: "In a star schema, all dimensions connect radially directly to the central fact table, resembling a star."
    },
    {
      id: "ss-q3",
      question: "What is the primary benefit of a Star Schema for Business Intelligence tools?",
      options: [
        "Strict 3NF relational purity",
        "Simpler SQL queries, intuitive navigation for report authors, and rapid read aggregation speeds",
        "Zero data redundancy across all tables",
        "Support for high-frequency transactional locking"
      ],
      correctIndex: 1,
      explanation: "Star schemas make SQL queries straightforward (fact JOIN dim1 JOIN dim2) with minimal joins, ideal for fast BI dashboard rendering."
    }
  ],

  "snowflake-schema": [
    {
      id: "sf-q1",
      question: "How does a Snowflake Schema differ from a Star Schema?",
      options: [
        "It eliminates fact tables completely",
        "It normalizes dimension tables, splitting them into lookup sub-tables",
        "It uses only one single massive table",
        "It is designed solely for transactional processing (OLTP)"
      ],
      correctIndex: 1,
      explanation: "A snowflake schema normalizes dimensions to save storage space, decomposing them into secondary lookup tables which resembles a snowflake shape."
    },
    {
      id: "sf-q2",
      question: "What is the primary trade-off of choosing a Snowflake Schema over a Star Schema?",
      options: [
        "Saves disk storage space through normalization, but introduces more complex multi-table SQL JOIN queries",
        "Decreases query times while doubling disk space",
        "Eliminates all foreign keys",
        "Prevents queries from filtering by date"
      ],
      correctIndex: 0,
      explanation: "Snowflake normalizes dimensions to reduce redundancy (saving space), but requires more JOINs during queries, which can slow down query response times."
    },
    {
      id: "sf-q3",
      question: "When is a Snowflake Schema particularly advantageous over a Star Schema?",
      options: [
        "When dimension tables have large hierarchies and minimizing storage redundancy is a key priority",
        "When no business analysts know how to write SQL",
        "When the warehouse only stores 100 rows",
        "When processing sub-second OLTP banking transfers"
      ],
      correctIndex: 0,
      explanation: "When dimensions have deep hierarchies (e.g., Product -> Subcategory -> Category -> Department) with millions of rows, snowflaking saves storage and eases hierarchy updates."
    }
  ],

  "olap-operations": [
    {
      id: "olap-q1",
      question: "Which OLAP operation decreases summary levels to show more detailed sub-elements?",
      options: [
        "Roll-up",
        "Drill-down",
        "Slice",
        "Dice"
      ],
      correctIndex: 1,
      explanation: "Drill-down goes from summary-level data to granular details (e.g., expanding Sales by Quarter down to Sales by Month)."
    },
    {
      id: "olap-q2",
      question: "What is the difference between a Slice and a Dice operation on an OLAP cube?",
      options: [
        "Slice filters on a single dimension value (producing a 2D sub-cube); Dice filters on two or more dimensions (producing a smaller sub-cube)",
        "Slice aggregates numbers; Dice divides them",
        "Slice adds new dimensions; Dice deletes them",
        "Slice is for rows; Dice is for tables"
      ],
      correctIndex: 0,
      explanation: "Slice selects a single dimension value (e.g., Year = 2024), while Dice defines a range/sub-cube across multiple dimensions (e.g., Year in (2023, 2024) AND Location = 'Mumbai' AND Product = 'Electronics')."
    },
    {
      id: "olap-q3",
      question: "Which OLAP operation rotates the data axes in view to give an alternative dimensional perspective?",
      options: [
        "Pivot (Rotate)",
        "Drill-across",
        "Roll-up",
        "De-aggregate"
      ],
      correctIndex: 0,
      explanation: "Pivot (or Rotate) swaps rows and columns or changes dimensional orientation to visualize data from a new angle."
    }
  ],

  // ==========================================
  // DATA MINING MODULE LESSONS
  // ==========================================
  "intro-mining": [
    {
      id: "im-q1",
      question: "What is the other common name for the Data Mining discovery process?",
      options: [
        "KDD (Knowledge Discovery in Databases)",
        "OLAP Operational Structuring",
        "Database Normalization",
        "Structured Extract Pipeline"
      ],
      correctIndex: 0,
      explanation: "KDD (Knowledge Discovery in Databases) is the umbrella process of cleaning, mining, evaluating, and visualising patterns from databases."
    },
    {
      id: "im-q2",
      question: "Which stage of the KDD pipeline is responsible for finding patterns using algorithms?",
      options: [
        "Data Selection",
        "Data Cleaning",
        "Data Mining",
        "Data Warehousing"
      ],
      correctIndex: 2,
      explanation: "The Data Mining stage applies specific algorithms (clustering, classification, association rules) to discover patterns."
    },
    {
      id: "im-q3",
      question: "What distinguishes Data Mining from standard SQL querying?",
      options: [
        "Data Mining discovers previously unknown, hidden, and predictive patterns; SQL queries retrieve known facts matching explicit filters",
        "SQL can only run on text files",
        "Data Mining is only for spreadsheets",
        "There is no difference between them"
      ],
      correctIndex: 0,
      explanation: "SQL answers 'What happened?' for predefined conditions, whereas Data Mining extracts unknown patterns, trends, and future predictive behaviors."
    }
  ],

  "preprocessing": [
    {
      id: "dp-q1",
      question: "Which preprocessing task fits a normalization or scaling action?",
      options: [
        "Data Reduction",
        "Data Transformation",
        "Data Integration",
        "Data Cleaning"
      ],
      correctIndex: 1,
      explanation: "Data Transformation handles normalisation (scaling data ranges to 0-1) and discretization to improve mathematical algorithm performance."
    },
    {
      id: "dp-q2",
      question: "Which technique is commonly used to handle missing numerical attribute values in datasets?",
      options: [
        "Imputing with attribute mean, median, or predictive model estimation",
        "Deleting the entire database table",
        "Replacing all other columns with zeros",
        "Skipping validation checks"
      ],
      correctIndex: 0,
      explanation: "Mean or median imputation replaces missing values with representative statistics without discarding valuable records."
    },
    {
      id: "dp-q3",
      question: "Why is Min-Max normalization performed on input variables before running distance-based algorithms like K-Means or KNN?",
      options: [
        "To ensure attributes with larger raw scales (e.g. Salary: $100,000) do not dominate attributes with smaller scales (e.g. Age: 25)",
        "To encrypt sensitive numbers",
        "To convert floating point numbers to text",
        "To speed up internet connection speeds"
      ],
      correctIndex: 0,
      explanation: "Distance formulas (like Euclidean distance) are sensitive to scale; normalization scales all features to a common range (0 to 1) so every feature contributes fairly."
    }
  ],

  "mining-architecture": [
    {
      id: "ma-q1",
      question: "Which component of a Data Mining system architecture executes algorithms to discover patterns and extract models from transformed data?",
      options: [
        "Knowledge Base (Domain Rules)",
        "Data Mining Engine",
        "Pattern Evaluation Module",
        "Database / Warehouse Server"
      ],
      correctIndex: 1,
      explanation: "The Data Mining Engine contains the core algorithm execution modules (e.g., clustering, association, classification) that perform pattern extraction on transformed data."
    },
    {
      id: "ma-q2",
      question: "What is the primary role of the Pattern Evaluation Module in a Data Mining system?",
      options: [
        "Rendering the CSS user interface",
        "Assessing interestingness measures (such as confidence, lift, support, or accuracy) to filter out uninteresting patterns",
        "Backing up raw transaction logs",
        "Generating randomized training inputs"
      ],
      correctIndex: 1,
      explanation: "Pattern Evaluation assesses candidate patterns against statistical thresholds so that only meaningful, actionable knowledge is presented."
    },
    {
      id: "ma-q3",
      question: "What does the Knowledge Base contain in a data mining architecture?",
      options: [
        "Domain heuristics, user beliefs, and constraints used to guide the search and evaluate discovered patterns",
        "The hard drive operating system",
        "Only SQL connection strings",
        "A list of employee login passwords"
      ],
      correctIndex: 0,
      explanation: "The Knowledge Base stores domain rules, taxonomies, and user constraints that guide algorithm execution and validate findings."
    }
  ],

  "data-exploration": [
    {
      id: "de-q1",
      question: "Which visual exploration plot displays the five-number summary (Min, Q1, Median, Q3, Max) and identifies outlier data points?",
      options: [
        "Pie Chart",
        "Scatter Plot",
        "Box Plot (Box & Whisker)",
        "Word Cloud"
      ],
      correctIndex: 2,
      explanation: "A Box Plot illustrates the median, quartiles (Q1, Q3), whiskers, and individual outlier points outside the 1.5 * IQR fence."
    },
    {
      id: "de-q2",
      question: "Which chart is most effective for visualizing the correlation and relationship between two continuous variables?",
      options: [
        "Scatter Plot",
        "Pie Chart",
        "Gauge Chart",
        "Donut Chart"
      ],
      correctIndex: 0,
      explanation: "A Scatter Plot plots paired (X, Y) coordinates to reveal positive, negative, linear, or non-linear correlation patterns."
    },
    {
      id: "de-q3",
      question: "What formula is used to identify statistical outliers using the IQR (Interquartile Range) method?",
      options: [
        "Points below Q1 - 1.5*IQR or above Q3 + 1.5*IQR",
        "Points below Mean - 10",
        "Points with odd values",
        "Points that have duplicate rows"
      ],
      correctIndex: 0,
      explanation: "Tukey's fences define outliers as points falling beyond [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR], where IQR = Q3 - Q1."
    }
  ],

  "apriori-algorithm": [
    {
      id: "aa-q1",
      question: "In association rules, what metric represents how frequently the items appear together in the transaction set?",
      options: [
        "Confidence",
        "Support",
        "Lift",
        "Gain"
      ],
      correctIndex: 1,
      explanation: "Support is the fraction of total transactions in the database that contain both itemsets A and B."
    },
    {
      id: "aa-q2",
      question: "What does the Apriori Property state regarding itemsets?",
      options: [
        "All non-empty subsets of a frequent itemset must also be frequent",
        "All frequent itemsets have exactly 3 items",
        "Infrequent itemsets become frequent over time",
        "Itemsets must be sorted alphabetically"
      ],
      correctIndex: 0,
      explanation: "The Apriori property (downward closure) states that if {A, B} is frequent, {A} and {B} must also be frequent, enabling candidate pruning."
    },
    {
      id: "aa-q3",
      question: "If the Lift of an association rule A -> B is greater than 1, what does this indicate?",
      options: [
        "Items A and B occur independently with zero relationship",
        "Item A and Item B have a positive correlation; buying A increases the probability of buying B",
        "Item A causes item B to be defective",
        "The rule has 0% confidence"
      ],
      correctIndex: 1,
      explanation: "Lift > 1 indicates positive dependence: the presence of antecedent A increases the likelihood of consequent B compared to chance."
    }
  ],

  "classification": [
    {
      id: "cl-q1",
      question: "Which of these is a supervised learning classifier?",
      options: [
        "K-Means Clustering",
        "Decision Tree",
        "Apriori Association",
        "Dimensionality Reduction"
      ],
      correctIndex: 1,
      explanation: "Decision Tree is a supervised classifier that learns splitting rules based on labeled target classes in training data."
    },
    {
      id: "cl-q2",
      question: "In the ID3 algorithm, what criterion is used to choose the best splitting attribute at each node?",
      options: [
        "Maximum Information Gain (reduction in Entropy)",
        "Minimum Euclidean Distance",
        "Maximum number of characters in the feature name",
        "Random selection"
      ],
      correctIndex: 0,
      explanation: "ID3 calculates Shannon Entropy and selects the attribute that yields the highest Information Gain, producing the purest child nodes."
    },
    {
      id: "cl-q3",
      question: "What core assumption does a Naive Bayes classifier make?",
      options: [
        "All features are completely dependent on one another",
        "All features are conditionally independent of each other given the class label",
        "The dataset contains no numerical columns",
        "The decision tree has a depth of only 1"
      ],
      correctIndex: 1,
      explanation: "Naive Bayes is called 'naive' because it assumes all predictor attributes are conditionally independent given the target class."
    }
  ],

  "kmeans-clustering": [
    {
      id: "km-q1",
      question: "What distance metric is most commonly used in K-Means to assign points to centroids?",
      options: [
        "Manhattan Distance",
        "Euclidean Distance",
        "Cosine Similarity",
        "Hamming Distance"
      ],
      correctIndex: 1,
      explanation: "K-Means measures spatial distance. Euclidean distance (straight-line distance) is the standard formula applied."
    },
    {
      id: "km-q2",
      question: "What is the primary stopping condition for the K-Means clustering algorithm?",
      options: [
        "When cluster centroids stabilize and no longer move significantly between iterations",
        "When all points have value 0",
        "After exactly 10,000 hours of computation",
        "When all clusters contain exactly 1 point"
      ],
      correctIndex: 0,
      explanation: "K-Means converges when cluster assignments no longer change and centroid coordinates shift by less than a convergence threshold."
    },
    {
      id: "km-q3",
      question: "What method is commonly used to find the optimal number of clusters (K) in K-Means?",
      options: [
        "The Elbow Method (plotting SSE / WCSS against K)",
        "Counting the number of rows divided by 2",
        "Using K=100 for all datasets",
        "Sorting the primary key"
      ],
      correctIndex: 0,
      explanation: "The Elbow Method plots Within-Cluster Sum of Squares (WCSS) against values of K and picks the 'elbow' inflection point where improvements plateau."
    }
  ],

  // ==========================================
  // ANALYTICS MODULE LESSONS
  // ==========================================
  "intro-analytics": [
    {
      id: "ia-q1",
      question: "What is the primary focus of exploratory data analysis (EDA)?",
      options: [
        "Running physical database backups",
        "Analyzing data attributes and distributions to find initial trends",
        "Writing production transactional databases",
        "Enforcing strict user schema constraints"
      ],
      correctIndex: 1,
      explanation: "EDA uses statistics and simple charts to understand data shapes, check for outliers, and find interesting initial patterns."
    }
  ],
  "types-analytics": [
    {
      id: "ta-q1",
      question: "Which type of analytics answers the question: 'What should we do to make this event happen?'",
      options: [
        "Descriptive Analytics",
        "Diagnostic Analytics",
        "Predictive Analytics",
        "Prescriptive Analytics"
      ],
      correctIndex: 3,
      explanation: "Prescriptive Analytics recommends specific actions or options that users should take to achieve desired results."
    }
  ],
  "bi-tools": [
    {
      id: "bi-q1",
      question: "What is the primary role of a BI tool like Power BI or Tableau?",
      options: [
        "Modifying database server software configurations",
        "Ingesting, modeling, and visually mapping database statistics to dashboards",
        "Creating new relational database schemas",
        "Encrypting database connections"
      ],
      correctIndex: 1,
      explanation: "BI tools model data and present it in dynamic dashboard visualisations for simple executive evaluation."
    }
  ],
  "dashboard-design": [
    {
      id: "dd-q1",
      question: "Which chart type is recommended when the objective is to display trends over time?",
      options: [
        "Pie Chart",
        "Line Chart",
        "Scatter Plot",
        "Histogram"
      ],
      correctIndex: 1,
      explanation: "Line charts connect series of data points over time, mapping trends and cycles effectively."
    }
  ]
};

// ==========================================
// COMPREHENSIVE MODULE QUIZZES (10 QUESTIONS EACH)
// ==========================================
export const topicQuizzes = {
  "warehouse": [
    {
      question: "Which characteristic is NOT a defining attribute of a Data Warehouse according to Inmon?",
      options: ["Subject-Oriented", "Volatile", "Integrated", "Time-Variant"],
      correctIndex: 1,
      explanation: "Data Warehouses are non-volatile. Once written, historical tables do not change.",
      reviewTopic: "1. Introduction to Data Warehouse"
    },
    {
      question: "Which tier of Data Warehouse architecture contains business intelligence tools and report generators?",
      options: ["Bottom Tier", "Middle Tier", "Top Tier", "Staging Area"],
      correctIndex: 2,
      explanation: "The Top Tier consists of client-side querying and BI tools used by analysts.",
      reviewTopic: "2. Data Warehouse Architecture"
    },
    {
      question: "In dimensional modeling, which table contains descriptive attributes of the events?",
      options: ["Fact Table", "Dimension Table", "Bridge Table", "Junk Table"],
      correctIndex: 1,
      explanation: "Dimension tables hold contextual attributes like names, locations, and dates.",
      reviewTopic: "5. Fact and Dimension Tables"
    },
    {
      question: "What schema is characterized by normalized dimensions connected in chains of lookups?",
      options: ["Star Schema", "Snowflake Schema", "Galaxy Schema", "Fact Constellation Schema"],
      correctIndex: 1,
      explanation: "Snowflake schemas normalize dimension tables to reduce storage redundancy.",
      reviewTopic: "7. Snowflake Schema"
    },
    {
      question: "Performing a Roll-up on an OLAP Cube results in which action?",
      options: ["Higher aggregation and less detail", "Lower aggregation and more detail", "A 2D slice sheet", "Swapping rows and columns"],
      correctIndex: 0,
      explanation: "Roll-up climbs the location or product hierarchy, aggregating values to a wider level (e.g. Month to Year).",
      reviewTopic: "8. OLAP Operations"
    },
    {
      question: "What is the primary role of the Staging Area in the ETL pipeline?",
      options: [
        "Running analytical queries for executives",
        "Temporarily storing extracted data to perform cleaning and transformation before loading into the warehouse",
        "Serving as the permanent backup storage for the company",
        "Hosting user authentication passwords"
      ],
      correctIndex: 1,
      explanation: "The Staging Area isolates operational sources from the warehouse, providing a workspace for cleansing, de-duplication, and validation.",
      reviewTopic: "4. ETL Process"
    },
    {
      question: "What is a Fact Constellation (Galaxy Schema)?",
      options: [
        "A schema with multiple fact tables that share common dimension tables (conformed dimensions)",
        "A schema that has no dimensions",
        "A schema with only one table",
        "A 3NF operational OLTP structure"
      ],
      correctIndex: 0,
      explanation: "A Fact Constellation schema contains multiple fact tables (e.g., Sales Facts and Shipping Facts) that share conformed dimensions.",
      reviewTopic: "6. Star Schema"
    },
    {
      question: "Which OLAP architecture stores multidimensional data directly in specialized multidimensional cube arrays?",
      options: ["ROLAP (Relational OLAP)", "MOLAP (Multidimensional OLAP)", "HOLAP (Hybrid OLAP)", "DOLAP (Desktop OLAP)"],
      correctIndex: 1,
      explanation: "MOLAP stores data in optimized multidimensional array structures rather than standard relational tables, offering lightning-fast retrieval.",
      reviewTopic: "2. Data Warehouse Architecture"
    },
    {
      question: "What is a 'Surrogate Key' in Data Warehouse dimensional modeling?",
      options: [
        "A natural key from the source operational database",
        "An artificial, system-generated integer primary key assigned to each dimension record",
        "A database user password",
        "A public encryption key"
      ],
      correctIndex: 1,
      explanation: "Surrogate keys are artificial integer keys created by the warehouse, insulating the warehouse from operational key changes.",
      reviewTopic: "5. Fact and Dimension Tables"
    },
    {
      question: "What does the OLAP 'Drill-across' operation perform?",
      options: [
        "Executes a query across more than one fact table that share conformed dimensions",
        "Drills down to milliseconds",
        "Rotates the cube 180 degrees",
        "Deletes dimensions from memory"
      ],
      correctIndex: 0,
      explanation: "Drill-across links two or more fact tables sharing conformed dimensions (e.g. comparing Actual Sales facts with Forecasted Budget facts).",
      reviewTopic: "8. OLAP Operations"
    }
  ],
  
  "mining": [
    {
      question: "Which step in the KDD process involves resolving null fields and pruning duplicates?",
      options: ["Data Integration", "Data Cleaning", "Data Selection", "Data Mining"],
      correctIndex: 1,
      explanation: "Data Cleaning resolves inconsistencies, nulls, and duplicate values from raw collections.",
      reviewTopic: "2. Data Preprocessing"
    },
    {
      question: "The Apriori algorithm works on which fundamental principle?",
      options: [
        "Centroids migrate to the center of closest coordinate groupings",
        "If an itemset is frequent, all its subsets must also be frequent",
        "Classes can be split linearly by a wide hyper-plane margin",
        "Predicting continuous labels requires line-of-best-fit coefficients"
      ],
      correctIndex: 1,
      explanation: "The Apriori property states that all non-empty subsets of a frequent itemset must also be frequent.",
      reviewTopic: "5. Association Rule Mining (Apriori)"
    },
    {
      question: "What is the difference between supervised and unsupervised learning?",
      options: [
        "Supervised uses labeled training data; unsupervised learns patterns on unlabeled data",
        "Supervised has no target category outputs",
        "Unsupervised requires high human oversight during executions",
        "Supervised is only used in data warehousing"
      ],
      correctIndex: 0,
      explanation: "Supervised learning (Classification) trains model weights using labeled inputs, whereas unsupervised learning (Clustering) maps structures on unlabeled rows.",
      reviewTopic: "6. Classification (Decision Tree & Naive Bayes)"
    },
    {
      question: "In K-Means clustering, how are initial centroids chosen?",
      options: [
        "They are calculated as the true center of all points combined",
        "They are selected randomly inside the coordinate space or from data points",
        "They are always placed at coordinate (0,0)",
        "They are manually typed by the database administrator"
      ],
      correctIndex: 1,
      explanation: "Initial centroids are initialized randomly, and then adjusted iteratively as point groupings settle.",
      reviewTopic: "7. Clustering (K-Means & Hierarchical)"
    },
    {
      question: "Which metric represents the strength of an association rule by checking if A and B are independent?",
      options: ["Support", "Confidence", "Lift", "Distance"],
      correctIndex: 2,
      explanation: "Lift measures the strength of a rule. A Lift value of 1 implies A and B occur independently.",
      reviewTopic: "5. Association Rule Mining (Apriori)"
    },
    {
      question: "What does Information Gain measure in Decision Tree learning (ID3)?",
      options: [
        "The financial profit from deploying the model",
        "The expected reduction in Shannon Entropy achieved by partitioning on an attribute",
        "The memory size of the dataset",
        "The speed of CPU core execution"
      ],
      correctIndex: 1,
      explanation: "Information Gain = System Entropy - Expected Remaining Entropy after splitting. Higher gain indicates a purer partition.",
      reviewTopic: "6. Classification (Decision Tree & Naive Bayes)"
    },
    {
      question: "Which algorithm constructs a tree of clusters called a Dendrogram?",
      options: [
        "Agglomerative Hierarchical Clustering",
        "Linear Regression",
        "Apriori Algorithm",
        "K-Means Clustering"
      ],
      correctIndex: 0,
      explanation: "Hierarchical Agglomerative clustering merges pairs of clusters bottom-up into a tree structure visualized as a Dendrogram.",
      reviewTopic: "7. Clustering (K-Means & Hierarchical)"
    },
    {
      question: "In association rules A -> B, what is the formula for Confidence?",
      options: [
        "Support(A ∪ B) / Support(A)",
        "Support(A) / Support(B)",
        "Count(B) / Total Transactions",
        "Support(A ∪ B) * Lift"
      ],
      correctIndex: 0,
      explanation: "Confidence(A -> B) = P(B|A) = Support(A ∪ B) / Support(A). It indicates how frequently B appears when A is present.",
      reviewTopic: "5. Association Rule Mining (Apriori)"
    },
    {
      question: "What is the primary objective of PCA (Principal Component Analysis) during Data Reduction?",
      options: [
        "Transform high-dimensional correlated features into a smaller set of linearly uncorrelated components while preserving maximum variance",
        "Delete all rows with negative values",
        "Sort data by student names",
        "Convert numerical columns to text labels"
      ],
      correctIndex: 0,
      explanation: "PCA reduces dimensionality by projecting data onto orthogonal principal components with maximum variance, speeding up mining algorithms.",
      reviewTopic: "2. Data Preprocessing"
    },
    {
      question: "What evaluation tool tabulates True Positives, False Positives, True Negatives, and False Negatives?",
      options: [
        "Scatter Diagram",
        "Confusion Matrix",
        "Dendrogram",
        "Star Schema"
      ],
      correctIndex: 1,
      explanation: "A Confusion Matrix summarizes classifier performance by contrasting predicted labels against actual ground truth classes.",
      reviewTopic: "6. Classification (Decision Tree & Naive Bayes)"
    }
  ],
  
  "analytics": [
    {
      question: "A company charts monthly product revenue to check past performance. What analytics type is this?",
      options: ["Descriptive", "Diagnostic", "Predictive", "Prescriptive"],
      correctIndex: 0,
      explanation: "Descriptive analytics charts historical data to answer what has happened in the past.",
      reviewTopic: "2. Four Types of Analytics"
    },
    {
      question: "Which type of analytics is used to build predictive forecasts about upcoming inventory sales trends?",
      options: ["Descriptive", "Diagnostic", "Predictive", "Prescriptive"],
      correctIndex: 2,
      explanation: "Predictive analytics builds forecasting models to outline what is likely to occur in future cycles.",
      reviewTopic: "2. Four Types of Analytics"
    },
    {
      question: "What chart is most appropriate when displaying the composition breakdown of a company's total expenses?",
      options: ["Scatter Plot", "Pie Chart", "Line Chart", "Histogram"],
      correctIndex: 1,
      explanation: "Pie charts and stacked bars display part-to-whole composition relationships.",
      reviewTopic: "4. Dashboard Design & Visualization"
    },
    {
      question: "Why should a BI developer minimize chart clutter on dashboards?",
      options: [
        "To reduce server query loads",
        "To decrease the cognitive load on the user assessing the metrics",
        "To hide database anomalies from managers",
        "To speed up page loading on mobile devices"
      ],
      correctIndex: 1,
      explanation: "Clean dashboard design prevents cognitive overload, allowing users to locate critical KPI metrics instantly.",
      reviewTopic: "4. Dashboard Design & Visualization"
    },
    {
      question: "Exploratory Data Analysis (EDA) is typically conducted at what stage of analytics?",
      options: ["After deploying the BI dashboard", "Before modeling, to inspect distributions and outliers", "Before extracting data from OLTP", "During database server backups"],
      correctIndex: 1,
      explanation: "EDA is run in the early stages to understand data shapes and check rules before complex models are built.",
      reviewTopic: "1. Introduction to Data Analytics"
    }
  ]
};

// Helper metadata maps
const moduleNames = {
  warehouse: "Data Warehousing",
  mining: "Data Mining",
  lake: "Data Lake Architecture",
  analytics: "Data Analytics"
};

const lessonTitles = {
  // Warehouse
  'intro-warehouse': 'Introduction to Data Warehouse',
  'architecture': 'Data Warehouse Architecture (3-Tier)',
  'oltp-vs-olap': 'OLTP vs. OLAP Systems',
  'etl-process': 'ETL (Extract, Transform, Load)',
  'fact-dimension': 'Fact & Dimension Tables',
  'star-schema': 'Star Schema Dimensional Modeling',
  'snowflake-schema': 'Snowflake Schema Normalization',
  'olap-operations': 'OLAP Cube Operations (Roll-up, Drill-down, Slice, Dice)',

  // Mining
  'intro-mining': 'Introduction to Data Mining (KDD)',
  'preprocessing': 'Data Preprocessing & Transformation',
  'mining-architecture': 'Data Mining System Architecture',
  'data-exploration': 'Exploratory Data Analysis (EDA)',
  'apriori-algorithm': 'Association Rule Mining (Apriori)',
  'classification': 'Classification & Decision Trees',
  'kmeans-clustering': 'Clustering Analysis (K-Means)',

  // Analytics
  'intro-analytics': 'Introduction to Data Analytics',
  'types-analytics': 'Four Types of Analytics',
  'bi-tools': 'Business Intelligence Tools',
  'dashboard-design': 'Executive Dashboard Design'
};

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

// Render Interactive Practice Questions (Sequential Multi-Question Flow)
export function renderPracticeQuestion(containerSelector, lessonId, onComplete, moduleId) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  // Resolve module ID if not passed directly
  if (!moduleId) {
    const hashMatch = window.location.hash.match(/#\/module\/([^/]+)/);
    if (hashMatch) {
      moduleId = hashMatch[1];
    } else if (['intro-warehouse', 'architecture', 'oltp-vs-olap', 'etl-process', 'fact-dimension', 'star-schema', 'snowflake-schema', 'olap-operations'].includes(lessonId)) {
      moduleId = 'warehouse';
    } else if (['intro-mining', 'preprocessing', 'mining-architecture', 'data-exploration', 'apriori-algorithm', 'classification', 'kmeans-clustering'].includes(lessonId)) {
      moduleId = 'mining';
    } else {
      moduleId = 'analytics';
    }
  }

  const moduleName = moduleNames[moduleId] || 'Course Module';
  const lessonTitle = lessonTitles[lessonId] || 'Practice Exercise';
  const moduleIcon = moduleId === 'warehouse' ? 'database' : (moduleId === 'mining' ? 'cpu' : 'bar-chart-2');
  
  const questions = practiceQuestions[lessonId];
  if (!questions || questions.length === 0) {
    container.innerHTML = `
      <div class="practice-page-container animate-slide-up">
        <div class="practice-top-bar">
          <div class="practice-breadcrumb">
            <a href="#/dashboard"><i data-lucide="home" style="width: 14px; height: 14px;"></i> Dashboard</a>
            <span class="practice-crumb-sep">/</span>
            <a href="#/module/${moduleId}">${moduleName}</a>
            <span class="practice-crumb-sep">/</span>
            <span class="practice-crumb-active">${lessonTitle}</span>
          </div>
          <a href="#/module/${moduleId}/learn/${lessonId}" class="practice-back-btn">
            <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Back to Lesson
          </a>
        </div>
        <div class="quiz-card" style="text-align: center; padding: 48px 24px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">📚</div>
          <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Practice Completed</h3>
          <p style="color: var(--text-secondary); max-width: 460px; margin: 0 auto 24px; font-size: 0.95rem;">
            You have reviewed this lesson. Continue your learning journey through the syllabus.
          </p>
          <button class="btn btn-primary" id="skip-practice-btn">Continue to Module Overview &rarr;</button>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    document.getElementById('skip-practice-btn').addEventListener('click', () => {
      if (typeof onComplete === 'function') onComplete();
      window.location.hash = `#/module/${moduleId}`;
    });
    return;
  }
  
  let currentQuestionIndex = 0;
  
  function handleFinish(e) {
    if (e) e.preventDefault();
    const btn = document.getElementById('finish-practice-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>Saving & Continuing...</span> <i data-lucide="loader" style="width: 16px; height: 16px;"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
    
    // Call the completion callback
    try {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    } catch (err) {
      console.warn('onComplete error:', err);
    }
    
    // Guaranteed navigation safety fallback
    setTimeout(() => {
      window.location.hash = `#/module/${moduleId}`;
    }, 250);
  }

  function renderCard() {
    const q = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const progressPct = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

    container.innerHTML = `
      <div class="practice-page-container animate-slide-up">
        <!-- Top Navigation & Breadcrumbs -->
        <div class="practice-top-bar">
          <div class="practice-breadcrumb">
            <a href="#/dashboard"><i data-lucide="home" style="width: 14px; height: 14px;"></i> Dashboard</a>
            <span class="practice-crumb-sep">/</span>
            <a href="#/module/${moduleId}">${moduleName}</a>
            <span class="practice-crumb-sep">/</span>
            <span class="practice-crumb-active">${lessonTitle}</span>
          </div>
          <a href="#/module/${moduleId}/learn/${lessonId}" class="practice-back-btn">
            <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Back to Lesson
          </a>
        </div>

        <!-- Hero Header Card -->
        <div class="practice-hero-header module-${moduleId}">
          <div class="practice-hero-top">
            <span class="practice-badge badge-${moduleId}">
              <i data-lucide="${moduleIcon}" style="width: 13px; height: 13px;"></i>
              ${moduleName} Practice
            </span>
            <span class="practice-progress-pill">Question ${currentQuestionIndex + 1} of ${questions.length}</span>
          </div>
          <h1 class="practice-hero-title">${lessonTitle}</h1>
          <p class="practice-hero-desc">Test your understanding with interactive exercise questions and receive immediate diagnostic feedback.</p>
          
          <div class="practice-progress-container">
            <div class="practice-progress-track">
              <div class="practice-progress-fill" style="width: ${progressPct}%;"></div>
            </div>
            <span class="practice-progress-pct">${progressPct}%</span>
          </div>
        </div>

        <!-- Question Card -->
        <div class="quiz-card">
          <div class="question-meta-row">
            <span class="question-counter-badge">
              <i data-lucide="help-circle" style="width: 13px; height: 13px;"></i> Question ${currentQuestionIndex + 1} of ${questions.length}
            </span>
            <span class="question-points-badge">+100 XP Practice Reward</span>
          </div>

          <h2 class="question-text">${q.question}</h2>

          <div class="options-list">
            ${q.options.map((opt, i) => `
              <button class="option-btn" data-index="${i}">
                <div class="option-letter">${optionLetters[i] || (i + 1)}</div>
                <span class="option-text">${opt}</span>
                <div class="option-indicator"></div>
              </button>
            `).join('')}
          </div>

          <div class="challenge-actions">
            <button class="btn ${moduleId === 'mining' ? 'btn-primary-purple' : 'btn-primary'}" id="submit-practice-btn" disabled>
              <i data-lucide="check" style="width: 16px; height: 16px;"></i> Submit Answer
            </button>
            <div id="practice-feedback" class="feedback-section hidden"></div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const optionBtns = container.querySelectorAll('.option-btn');
    const submitBtn = container.querySelector('#submit-practice-btn');
    const feedbackDiv = container.querySelector('#practice-feedback');
    let selectedIndex = null;

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        optionBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedIndex = parseInt(btn.getAttribute('data-index'));
        submitBtn.disabled = false;
      });
    });

    submitBtn.addEventListener('click', () => {
      if (selectedIndex === null) return;
      
      const isCorrect = selectedIndex === q.correctIndex;
      submitBtn.style.display = 'none';

      optionBtns.forEach((btn, idx) => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        if (idx === q.correctIndex) {
          btn.classList.add('correct');
        } else if (idx === selectedIndex) {
          btn.classList.add('incorrect');
        } else {
          btn.style.opacity = '0.6';
        }
      });

      feedbackDiv.classList.remove('hidden');

      if (isCorrect) {
        feedbackDiv.className = 'feedback-section correct-card';
        feedbackDiv.innerHTML = `
          <div class="feedback-status correct">
            <i data-lucide="check-circle" style="width: 22px; height: 22px;"></i> ✓ Correct! Outstanding Work.
          </div>
          <div class="feedback-explanation">
            <strong>Concept Insight:</strong> ${q.explanation}
          </div>
          <div class="feedback-actions-row">
            ${!isLastQuestion ? `
              <button class="btn btn-success" id="next-practice-btn">
                <span>Next Question (${currentQuestionIndex + 2} of ${questions.length})</span>
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              </button>
            ` : `
              <button class="btn btn-success" id="finish-practice-btn">
                <span>Next Step: Complete & Continue</span>
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              </button>
            `}
          </div>
        `;
        
        if (!isLastQuestion) {
          document.getElementById('next-practice-btn').addEventListener('click', () => {
            currentQuestionIndex++;
            renderCard();
          });
        } else {
          document.getElementById('finish-practice-btn').addEventListener('click', handleFinish);
        }
      } else {
        feedbackDiv.className = 'feedback-section incorrect-card';
        feedbackDiv.innerHTML = `
          <div class="feedback-status incorrect">
            <i data-lucide="alert-circle" style="width: 22px; height: 22px;"></i> ✗ Not Quite Right.
          </div>
          <div class="feedback-explanation">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
          <div class="feedback-actions-row">
            <button class="btn btn-outline" id="retry-practice-btn">
              <i data-lucide="rotate-ccw" style="width: 15px; height: 15px;"></i> Try Again
            </button>
            ${!isLastQuestion ? `
              <button class="btn ${moduleId === 'mining' ? 'btn-primary-purple' : 'btn-primary'}" id="skip-next-practice-btn">
                <span>Next Question</span>
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              </button>
            ` : `
              <button class="btn ${moduleId === 'mining' ? 'btn-primary-purple' : 'btn-primary'}" id="finish-practice-btn">
                <span>Complete Practice & Continue</span>
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              </button>
            `}
          </div>
        `;
        
        document.getElementById('retry-practice-btn').addEventListener('click', () => {
          renderCard();
        });
        
        if (!isLastQuestion) {
          document.getElementById('skip-next-practice-btn').addEventListener('click', () => {
            currentQuestionIndex++;
            renderCard();
          });
        } else {
          document.getElementById('finish-practice-btn').addEventListener('click', handleFinish);
        }
      }

      if (window.lucide) window.lucide.createIcons();
    });
  }

  renderCard();
}

// Render Full Module Assessment Quiz (10 Questions)
export function renderModuleQuiz(containerSelector, moduleId, onComplete) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const quiz = topicQuizzes[moduleId];
  const moduleName = moduleNames[moduleId] || moduleId.toUpperCase();
  const moduleIcon = moduleId === 'warehouse' ? 'database' : (moduleId === 'mining' ? 'cpu' : 'bar-chart-2');

  if (!quiz) {
    container.innerHTML = `
      <div class="practice-page-container">
        <div class="quiz-card" style="text-align: center;">
          <h3>No Quiz loaded for module: ${moduleName}</h3>
          <a href="#/module/${moduleId}" class="btn btn-outline" style="margin-top: 16px;">Back to Module</a>
        </div>
      </div>
    `;
    return;
  }
  
  let currentQuestionIndex = 0;
  let score = 0;
  const incorrectReviewTopics = new Set();
  
  function showQuestion() {
    const q = quiz[currentQuestionIndex];
    const progressPct = Math.round(((currentQuestionIndex + 1) / quiz.length) * 100);
    
    container.innerHTML = `
      <div class="practice-page-container animate-slide-up">
        <!-- Top Navigation & Breadcrumbs -->
        <div class="practice-top-bar">
          <div class="practice-breadcrumb">
            <a href="#/dashboard"><i data-lucide="home" style="width: 14px; height: 14px;"></i> Dashboard</a>
            <span class="practice-crumb-sep">/</span>
            <a href="#/module/${moduleId}">${moduleName}</a>
            <span class="practice-crumb-sep">/</span>
            <span class="practice-crumb-active">Comprehensive Quiz</span>
          </div>
          <a href="#/module/${moduleId}" class="practice-back-btn">
            <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Back to Module
          </a>
        </div>

        <!-- Hero Header Card -->
        <div class="practice-hero-header module-${moduleId}">
          <div class="practice-hero-top">
            <span class="practice-badge badge-quiz">
              <i data-lucide="award" style="width: 13px; height: 13px;"></i>
              ${moduleName} Comprehensive Quiz
            </span>
            <span class="practice-progress-pill">Question ${currentQuestionIndex + 1} of ${quiz.length}</span>
          </div>
          <h1 class="practice-hero-title">${moduleName} Assessment</h1>
          <p class="practice-hero-desc">Demonstrate your mastery across all syllabus concepts. Answer at least 8 out of 10 questions correctly to achieve mastery rank.</p>
          
          <div class="practice-progress-container">
            <div class="practice-progress-track">
              <div class="practice-progress-fill" style="width: ${progressPct}%;"></div>
            </div>
            <span class="practice-progress-pct">${progressPct}%</span>
          </div>
        </div>

        <!-- Question Card -->
        <div class="quiz-card">
          <div class="question-meta-row">
            <span class="question-counter-badge">
              <i data-lucide="help-circle" style="width: 13px; height: 13px;"></i> Question ${currentQuestionIndex + 1} of ${quiz.length}
            </span>
            <span class="question-points-badge">${score} Correct so far</span>
          </div>

          <h2 class="question-text">${q.question}</h2>

          <div class="options-list">
            ${q.options.map((opt, i) => `
              <button class="option-btn" data-index="${i}">
                <div class="option-letter">${optionLetters[i] || (i + 1)}</div>
                <span class="option-text">${opt}</span>
                <div class="option-indicator"></div>
              </button>
            `).join('')}
          </div>

          <div class="challenge-actions">
            <button class="btn ${moduleId === 'mining' ? 'btn-primary-purple' : 'btn-primary'}" id="submit-quiz-btn" disabled>
              <i data-lucide="check" style="width: 16px; height: 16px;"></i> Submit Answer
            </button>
            <div id="quiz-feedback" class="feedback-section hidden"></div>
          </div>
        </div>
      </div>
    `;
    
    if (window.lucide) window.lucide.createIcons();

    const optionBtns = container.querySelectorAll('.option-btn');
    const submitBtn = container.querySelector('#submit-quiz-btn');
    const feedbackDiv = container.querySelector('#quiz-feedback');
    let selectedIndex = null;
    
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        optionBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedIndex = parseInt(btn.getAttribute('data-index'));
        submitBtn.disabled = false;
      });
    });
    
    submitBtn.addEventListener('click', () => {
      if (selectedIndex === null) return;
      
      const isCorrect = selectedIndex === q.correctIndex;
      submitBtn.style.display = 'none';
      
      if (isCorrect) {
        score++;
      } else {
        incorrectReviewTopics.add(q.reviewTopic);
      }
      
      optionBtns.forEach((btn, idx) => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        if (idx === q.correctIndex) {
          btn.classList.add('correct');
        } else if (idx === selectedIndex) {
          btn.classList.add('incorrect');
        } else {
          btn.style.opacity = '0.6';
        }
      });
      
      feedbackDiv.classList.remove('hidden');
      if (isCorrect) {
        feedbackDiv.className = 'feedback-section correct-card';
        feedbackDiv.innerHTML = `
          <div class="feedback-status correct">
            <i data-lucide="check-circle" style="width: 22px; height: 22px;"></i> ✓ Correct Answer!
          </div>
          <div class="feedback-explanation">
            <strong>Insight:</strong> ${q.explanation}
          </div>
          <div class="feedback-actions-row">
            <button class="btn ${moduleId === 'mining' ? 'btn-primary-purple' : 'btn-primary'}" id="next-question-btn">
              <span>${currentQuestionIndex === quiz.length - 1 ? 'Show Quiz Results' : 'Next Question'}</span>
              <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        `;
      } else {
        feedbackDiv.className = 'feedback-section incorrect-card';
        feedbackDiv.innerHTML = `
          <div class="feedback-status incorrect">
            <i data-lucide="alert-circle" style="width: 22px; height: 22px;"></i> ✗ Incorrect.
          </div>
          <div class="feedback-explanation">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
          <div class="feedback-actions-row">
            <button class="btn ${moduleId === 'mining' ? 'btn-primary-purple' : 'btn-primary'}" id="next-question-btn">
              <span>${currentQuestionIndex === quiz.length - 1 ? 'Show Quiz Results' : 'Next Question'}</span>
              <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        `;
      }

      if (window.lucide) window.lucide.createIcons();
      
      document.getElementById('next-question-btn').addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quiz.length) {
          showQuestion();
        } else {
          showResults();
        }
      });
    });
  }
  
  function showResults() {
    const passed = score >= Math.ceil(quiz.length * 0.7); // 70%+ passing grade
    let reviewSectionHTML = "";
    
    if (incorrectReviewTopics.size > 0) {
      reviewSectionHTML = `
        <div class="result-recommendation animate-slide-up">
          <div style="font-weight: 700; color: #b45309; display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i> Recommended Lessons to Review:
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 10px;">
            Based on your answers, we recommend reviewing these specific lessons to ensure full mastery:
          </p>
          <ul style="margin-left: 20px; font-size: 0.88rem; display: flex; flex-direction: column; gap: 6px; color: var(--text-primary);">
            ${Array.from(incorrectReviewTopics).map(t => `<li><strong>${t}</strong></li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      reviewSectionHTML = `
        <div class="result-recommendation" style="background: #f0fdf4; border-color: #bbf7d0;">
          <div style="font-weight: 700; color: #15803d; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="award" style="width: 18px; height: 18px;"></i> Perfect Score Mastery Achieved!
          </div>
          <p style="margin-top: 6px; font-size: 0.88rem; color: #166534;">
            Outstanding work! You demonstrated 100% mastery of all concepts in the ${moduleName} module.
          </p>
        </div>
      `;
    }
    
    container.innerHTML = `
      <div class="practice-page-container animate-slide-up">
        <div class="result-container">
          <div class="result-badge-icon ${passed ? 'pass' : 'review'}">
            ${passed ? '🎉' : '📖'}
          </div>
          <h2 class="practice-hero-title">${passed ? 'Quiz Passed with Honors!' : 'Good Effort — Keep Learning!'}</h2>
          <p class="result-score-sub">You completed the ${moduleName} Assessment</p>
          
          <div class="result-score">
            ${score} / ${quiz.length}
          </div>
          <div style="font-size: 0.95rem; font-weight: 700; color: ${passed ? '#16a34a' : '#d97706'}; margin-bottom: 12px;">
            Score: ${Math.round((score / quiz.length) * 100)}% (${passed ? 'Passed' : 'Passing threshold is 70%'})
          </div>
          
          <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 460px; margin: 0 auto;">
            ${passed 
              ? 'Congratulations! You have successfully mastered the theoretical foundations of this module.' 
              : 'Review the suggested topics below and try the quiz again to earn your certificate rank.'}
          </p>
          
          ${reviewSectionHTML}
          
          <div class="result-actions-row">
            <button class="btn btn-outline flex-1" id="retry-quiz-btn">
              <i data-lucide="rotate-ccw" style="width: 15px; height: 15px;"></i> Retry Quiz
            </button>
            <button class="btn ${moduleId === 'mining' ? 'btn-primary-purple' : 'btn-primary'} flex-1" id="complete-quiz-btn">
              <span>Return to Syllabus</span>
              <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    document.getElementById('retry-quiz-btn').addEventListener('click', () => {
      renderModuleQuiz(containerSelector, moduleId, onComplete);
    });
    
    document.getElementById('complete-quiz-btn').addEventListener('click', () => {
      try {
        if (typeof onComplete === 'function') onComplete(score);
      } catch (err) {
        console.warn('onComplete error:', err);
      }
      setTimeout(() => {
        window.location.hash = `#/module/${moduleId}`;
      }, 250);
    });
  }
  
  showQuestion();
}
