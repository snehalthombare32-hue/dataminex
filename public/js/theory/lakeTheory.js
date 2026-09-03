// Data Lake Theory Content

export const lakeTheory = [
  {
    id: "intro-lake",
    title: "1. What is a Data Lake?",
    blocks: [
      {
        type: "definition",
        title: "Data Lake",
        content: "A Data Lake is a centralized storage repository that holds vast amounts of raw data in its native format until needed. It can ingest structured data from relational databases, semi-structured data (JSON, XML, logs), and unstructured data (emails, PDFs, images, video, audio)."
      },
      {
        type: "key-concept",
        title: "Schema-on-Read vs Schema-on-Write",
        content: "Traditional Data Warehouses use Schema-on-Write: data must be cleaned, transformed, and conformed to a strict relational schema before it can be loaded. In contrast, Data Lakes use Schema-on-Read: raw data is dumped immediately into storage, and structure/schema is applied only when the data is read or queried by an analytical engine."
      },
      {
        type: "remember",
        title: "Decoupled Storage and Compute",
        content: "Modern data lakes decouple storage (like Amazon S3, Google Cloud Storage, Azure Data Lake) from compute query engines (like Apache Spark, Trino, Presto, Databricks). This allows organizations to scale storage at low cost independently of computing power."
      }
    ]
  },
  {
    id: "lake-architecture",
    title: "2. Data Lake Architecture (Medallion)",
    blocks: [
      {
        type: "key-concept",
        title: "The Medallion Architecture (Bronze ➔ Silver ➔ Gold)",
        content: "Modern data lakes and lakehouses organize data into progressive refinement tiers:\n\n1. Bronze (Raw): Untouched raw dump from source systems (append-only history).\n2. Silver (Cleaned): Validated, deduplicated, enriched, and structured data ready for analytics.\n3. Gold (Curated): Business-level aggregations, dimensional star schemas, and machine learning feature stores."
      },
      {
        type: "example",
        title: "Lake Ingestion Pipeline",
        content: "IoT Smart Meter Streams -> S3 Bronze Bucket (raw JSON) -> Apache Spark Clean/Deduplicate -> Delta Lake Silver Tables -> Gold Aggregates -> PowerBI Dashboard."
      }
    ]
  },
  {
    id: "lake-vs-warehouse",
    title: "3. Data Lake vs Data Warehouse",
    blocks: [
      {
        type: "definition",
        title: "Comparison Overview",
        content: "While Data Warehouses excel at fast, governed, historical SQL reporting on structured business data, Data Lakes provide flexibility for big data, machine learning, and multi-structured data exploration."
      },
      {
        type: "table",
        title: "DWH vs Data Lake Feature Matrix",
        headers: ["Feature", "Data Lake", "Data Warehouse"],
        rows: [
          ["Data Formats", "Structured, Semi-structured, Unstructured", "Strictly structured relational data"],
          ["Schema Paradigm", "Schema-on-Read", "Schema-on-Write"],
          ["Storage Cost", "Very Low (Cloud Object Storage)", "Higher (Database disks/appliances)"],
          ["Processing", "ELT (Extract, Load, Transform)", "ETL (Extract, Transform, Load)"],
          ["Agility", "Highly agile, rapid raw ingestion", "Structured, changes require schema migration"],
          ["Target Users", "Data Scientists, ML Engineers, Big Data Devs", "Business Analysts, Executives, SQL Users"]
        ]
      },
      {
        type: "remember",
        title: "What is a Data Swamp?",
        content: "A poorly managed data lake lacking data governance, metadata catalogs, and data quality checks turns into a 'Data Swamp', where data cannot be discovered or trusted."
      }
    ]
  }
];
