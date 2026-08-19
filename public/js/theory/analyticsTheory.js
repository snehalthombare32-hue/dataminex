// Data Analytics Theory Content
// Paste or edit your specific theory details in the content fields below.

export const analyticsTheory = [
  {
    id: "intro-analytics",
    title: "1. Introduction to Data Analytics",
    blocks: [
      {
        type: "definition",
        title: "Data Analytics",
        content: "Data Analytics is the science and methodology of examining raw datasets to draw conclusions about the information they contain, identify patterns, and optimize business decision-making."
      },
      {
        type: "key-concept",
        title: "The Data Lifecycle",
        content: "1. Data Collection -> 2. Data Cleaning -> 3. Data Integration -> 4. Exploratory Data Analysis (EDA) -> 5. Statistical Modeling -> 6. Data Visualization."
      }
    ]
  },
  {
    id: "types-analytics",
    title: "2. Four Types of Analytics",
    blocks: [
      {
        type: "key-concept",
        title: "Analytics Classifications",
        content: "1. Descriptive: What happened? (e.g., historical sales reporting).\n2. Diagnostic: Why did it happen? (e.g., drilling down into product categories to explain sales dips).\n3. Predictive: What is likely to happen? (e.g., forecast modeling sales volume for next month).\n4. Prescriptive: What actions should we take? (e.g., recommending prices to optimize profit dynamically)."
      },
      {
        type: "remember",
        title: "Value and Difficulty",
        content: "Moving from Descriptive to Prescriptive increases both the technical difficulty and the strategic value delivered to the enterprise."
      }
    ]
  },
  {
    id: "bi-tools",
    title: "3. Business Intelligence (BI) Tools",
    blocks: [
      {
        type: "definition",
        title: "BI Platforms",
        content: "Business Intelligence tools ingest enterprise data from warehouses or databases and present them in intuitive interactive formats like maps, lists, and summary charts."
      },
      {
        type: "example",
        title: "Popular BI Suites",
        content: "Microsoft Power BI, Tableau, Looker, and open-source alternatives like Apache Superset."
      }
    ]
  },
  {
    id: "dashboard-design",
    title: "4. Dashboard Design & Visualization",
    blocks: [
      {
        type: "definition",
        title: "Dashboard Design",
        content: "A visual dashboard coordinates key performance indicators (KPIs) in a single screen layout. Effective dashboard design focuses on visual hierarchy, avoiding cognitive overload, and utilizing appropriate chart selections."
      },
      {
        type: "table",
        title: "Visual Selection Chart",
        headers: ["Goal", "Recommended Chart Type", "Example"],
        rows: [
          ["Comparison", "Bar Chart, Column Chart", "Compare monthly department budgets"],
          ["Composition", "Pie Chart, Stacked Bar", "Breakdown of total sales by region"],
          ["Distribution", "Histogram, Scatter Plot", "Analyze student score spreads"],
          ["Trends over time", "Line Chart, Area Chart", "Quarterly traffic growth over 3 years"]
        ]
      }
    ]
  }
];
