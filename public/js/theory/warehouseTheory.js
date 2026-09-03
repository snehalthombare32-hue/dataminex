// Data Warehouse Theory Content
// Paste or edit your specific theory details in the content fields below.

export const warehouseTheory = [
  {
    id: "intro-warehouse",
    title: "1. Introduction to Data Warehouse",
    blocks: [
      {
        type: "definition",
        title: "Data Warehouse (DWH)",
        content: "A Data Warehouse is a subject-oriented, integrated, time-variant, and non-volatile collection of data in support of management's decision-making process. It aggregates structured data from multiple sources so it can be queried and analyzed."
      },
      {
        type: "key-concept",
        title: "Subject-Oriented",
        content: "Data is organized around major subjects (e.g., customer, product, sales) rather than the ongoing operations of the organization (like invoicing or inventory)."
      },
      {
        type: "remember",
        title: "Non-Volatile Data",
        content: "Once data is loaded into the warehouse, it does not change. Historical records are preserved, allowing for historical comparisons and analysis."
      }
    ]
  },
  {
    id: "architecture",
    title: "2. Data Warehouse Architecture",
    blocks: [
      {
        type: "key-concept",
        title: "Three-Tier Architecture",
        content: "1. Bottom Tier: Data Warehouse Server (usually a relational database system).\n2. Middle Tier: OLAP Server (multidimensional analysis engine).\n3. Top Tier: Front-end client tools (reporting, analysis, and data mining tools)."
      },
      {
        type: "example",
        title: "Enterprise Architecture",
        content: "Operational DBs -> Staging Area -> Data Warehouse -> Data Marts -> Users querying with BI tools."
      }
    ]
  },
  {
    id: "oltp-vs-olap",
    title: "3. OLTP vs OLAP",
    blocks: [
      {
        type: "definition",
        title: "OLTP vs OLAP",
        content: "OLTP (Online Transaction Processing) is operational, optimized for fast and frequent insert/update actions (e.g., ATM withdrawals). OLAP (Online Analytical Processing) is analytical, optimized for complex query and reporting actions over large datasets."
      },
      {
        type: "table",
        title: "Comparison Matrix",
        headers: ["Feature", "OLTP", "OLAP"],
        rows: [
          ["User", "Clerk, IT Professional", "Knowledge Worker, Manager"],
          ["Function", "Day-to-day operations", "Decision support"],
          ["DB Design", "Application-oriented (3NF)", "Subject-oriented (Star/Snowflake)"],
          ["Data State", "Current, up-to-date", "Historical, summarized"],
          ["Unit of work", "Short, simple transaction", "Complex query"]
        ]
      }
    ]
  },
  {
    id: "etl-process",
    title: "4. ETL Process",
    blocks: [
      {
        type: "definition",
        title: "ETL: Extract, Transform, Load",
        content: "ETL is the three-step data integration pipeline. Data is extracted from raw source files or databases, transformed (cleaned, formatted, validated), and loaded into a destination data warehouse."
      },
      {
        type: "key-concept",
        title: "Transform Step",
        content: "This is where the magic happens. We handle: de-duplication, resolving missing values, schema matching, and business rule applications (e.g. converting currencies, splitting strings)."
      },
      {
        type: "example",
        title: "Real-world ETL Scenario",
        content: "Extracting customer lists from 3 different stores, converting all phone numbers to standard format (Transformation), and saving the uniform list into the master DW table (Load)."
      }
    ]
  },
  {
    id: "fact-dimension",
    title: "5. Fact and Dimension Tables",
    blocks: [
      {
        type: "definition",
        title: "Fact Tables vs Dimension Tables",
        content: "Fact tables contain the quantitative metrics/measures of a business process (e.g., quantity sold, total price) and foreign keys to dimension tables. Dimension tables contain descriptive attributes/context surrounding the business event (e.g., date, store location, product name)."
      },
      {
        type: "remember",
        title: "Granularity",
        content: "The level of detail stored in a fact table is called its grain. Defining the grain is a critical first step in dimensional modeling."
      }
    ]
  },
  {
    id: "star-schema",
    title: "6. Star Schema",
    blocks: [
      {
        type: "definition",
        title: "Star Schema",
        content: "A dimensional model where a single, central Fact Table is directly connected to multiple radial Dimension Tables. It resembles a star. Dimensions are denormalized (meaning information is duplicated within them to optimize query performance)."
      },
      {
        type: "example",
        title: "Star Schema Example",
        content: "Fact_Sales (FK_Date, FK_Product, FK_Store, Quantity, SalesAmount) connected directly to Dim_Date, Dim_Product, and Dim_Store."
      }
    ]
  },
  {
    id: "snowflake-schema",
    title: "7. Snowflake Schema",
    blocks: [
      {
        type: "definition",
        title: "Snowflake Schema",
        content: "A variation of the star schema where dimension tables are normalized, splitting them into further lookup tables. It looks like a snowflake. This saves disk storage space but increases query complexity (due to more SQL JOIN operations)."
      },
      {
        type: "example",
        title: "Normalized Dimension",
        content: "Instead of having product categories in Dim_Product, we have FK_Category in Dim_Product pointing to a separate Dim_Category table."
      }
    ]
  },
  {
    id: "olap-operations",
    title: "8. OLAP Operations",
    blocks: [
      {
        type: "definition",
        title: "Multidimensional Operations",
        content: "OLAP engines organize data in a multi-dimensional structure called a 'Data Cube'. This allows users to view and analyze data from multiple dimensions using quick operations."
      },
      {
        type: "key-concept",
        title: "The Five Main Operations",
        content: "1. Roll-up: Summarizes data by climbing up a hierarchy (e.g., City -> Country).\n2. Drill-down: Breaks down summary data into detailed elements (e.g., Year -> Month).\n3. Slice: Selects a single dimension's value to produce a 2D sub-cube.\n4. Dice: Selects values across multiple dimensions to extract a sub-cube.\n5. Pivot: Rotates the data axes to view the data from different perspectives."
      }
    ]
  },
  {
    id: "dwh-vs-datamart",
    title: "9. Data Warehouse vs Data Mart",
    blocks: [
      {
        type: "definition",
        title: "Enterprise DWH vs Departmental Data Mart",
        content: "A Data Warehouse is enterprise-wide, holding integrated data across all business departments (e.g., HR, Sales, Inventory, Finance). A Data Mart is a decentralized, focused subset of a data warehouse tailored for a single business unit or department."
      },
      {
        type: "table",
        title: "Comparison Matrix",
        headers: ["Characteristic", "Data Warehouse (DWH)", "Data Mart"],
        rows: [
          ["Scope", "Enterprise-wide", "Single department or line-of-business"],
          ["Data Subjects", "Multiple enterprise subjects", "Single subject (e.g., Marketing only)"],
          ["Source", "Multiple operational systems", "DWH or single transaction system"],
          ["Size", "Large (100 GB to Petabytes)", "Smaller (< 100 GB)"],
          ["Implementation Time", "Months to years", "Weeks to months"]
        ]
      }
    ]
  },
  {
    id: "fact-constellation",
    title: "10. Fact Constellation (Galaxy Schema)",
    blocks: [
      {
        type: "definition",
        title: "Fact Constellation Schema",
        content: "A sophisticated dimensional model containing multiple Fact Tables that share common (conformed) Dimension Tables. Because of multiple centers, it resembles a constellation of stars or galaxy."
      },
      {
        type: "example",
        title: "Constellation Example",
        content: "Two fact tables: Fact_Sales and Fact_Shipping, both sharing Dim_Date, Dim_Product, and Dim_Store as conformed dimensions."
      },
      {
        type: "remember",
        title: "Conformed Dimensions",
        content: "A dimension that has exactly the same meaning and keys when referenced across multiple fact tables is called a Conformed Dimension."
      }
    ]
  },
  {
    id: "factless-fact-table",
    title: "11. Factless Fact Table",
    blocks: [
      {
        type: "definition",
        title: "Factless Fact Tables",
        content: "A fact table that does not contain any numeric measures or metrics. It contains only foreign keys referencing dimension tables. It is used to record events or represent coverage/eligibility."
      },
      {
        type: "example",
        title: "Event & Coverage Tracking",
        content: "1. Event Tracking: Student Class Attendance (Student_Key, Course_Key, Date_Key, Room_Key). The occurrence of the row itself represents that attendance took place.\n2. Coverage: Store promotions where no sale occurred."
      }
    ]
  },
  {
    id: "aggregate-fact-table",
    title: "12. Aggregate Fact Table",
    blocks: [
      {
        type: "definition",
        title: "Aggregate / Summary Fact Tables",
        content: "A pre-aggregated, summary fact table derived from a detailed atomic fact table. It rolls up fine-grained records into monthly, regional, or quarterly sums to dramatically accelerate analytical query speeds."
      },
      {
        type: "key-concept",
        title: "Query Optimization",
        content: "Instead of querying 50 million individual daily checkout transactions to find annual sales, the BI dashboard queries the monthly Aggregate_Sales_Fact table containing only a few thousand records."
      }
    ]
  }
];
