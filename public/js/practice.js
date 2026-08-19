// DataMineX - Interactive Practice & Quiz Engine

// Questions Database
export const practiceQuestions = {
  // Warehouse module lessons
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
    }
  ],
  "oltp-vs-olap": [
    {
      id: "oo-q1",
      question: "Which design standard is typically optimized for OLTP databases?",
      options: [
        "Highly normalized schemas (3NF) to prevent anomalies",
        "Denormalized schemas (Star schema) to speed up joins",
        "Wide column stores without constraints",
        "Pre-aggregated tables with indexes"
      ],
      correctIndex: 0,
      explanation: "OLTP databases are designed for rapid, frequent transactional updates (inserts/updates). Highly normalized tables (3NF) reduce redundancy and prevent update anomalies."
    }
  ],
  "etl-process": [
    {
      id: "ep-q1",
      question: "Which operation belongs to the Transform stage of the ETL pipeline?",
      options: [
        "Pulling raw customer files from an API",
        "Removing duplicate transactions and resolving nulls",
        "Writing uniform rows into the Fact table",
        "Running a SELECT query on loaded tables"
      ],
      correctIndex: 1,
      explanation: "The Transform stage handles data cleaning, de-duplication, format standardisation, and structural rules before loading records into the final warehouse."
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
    }
  ],

  // Mining module lessons
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
    }
  ],

  // Analytics module lessons
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

// Full Topic Quizzes (5 questions each)
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
      reviewTopic: "3. Association Rule Mining (Apriori)"
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
      reviewTopic: "4. Classification Techniques"
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
      reviewTopic: "5. Clustering Analysis (K-Means)"
    },
    {
      question: "Which metric represents the strength of an association rule by checking if A and B are independent?",
      options: ["Support", "Confidence", "Lift", "Distance"],
      correctIndex: 2,
      explanation: "Lift measures the strength of a rule. A Lift value of 1 implies A and B occur independently.",
      reviewTopic: "3. Association Rule Mining (Apriori)"
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

// Render Single Practice Question (End-of-lesson)
export function renderPracticeQuestion(containerSelector, lessonId, onComplete) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const questions = practiceQuestions[lessonId];
  if (!questions || questions.length === 0) {
    container.innerHTML = `
      <div class="quiz-card" style="text-align: center;">
        <h3>No practice questions loaded for this lesson.</h3>
        <button class="btn btn-primary" id="skip-practice-btn" style="margin-top: 16px;">Next Step</button>
      </div>
    `;
    document.getElementById('skip-practice-btn').addEventListener('click', onComplete);
    return;
  }
  
  const q = questions[0];
  
  container.innerHTML = `
    <div class="practice-header">
      <h2 class="path-section-title" style="margin-bottom: 0;">Lesson Practice Exercise</h2>
      <span class="practice-progress">Question 1 of 1</span>
    </div>
    <div class="quiz-card">
      <p class="question-text">${q.question}</p>
      <div class="options-list">
        ${q.options.map((opt, i) => `
          <button class="option-btn" data-index="${i}">${opt}</button>
        `).join('')}
      </div>
      <div class="challenge-actions">
        <button class="btn btn-primary" id="submit-practice-btn" disabled>Submit Answer</button>
        <div id="practice-feedback" class="feedback-section hidden"></div>
      </div>
    </div>
  `;
  
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
    submitBtn.remove();
    
    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('incorrect');
      }
    });
    
    feedbackDiv.classList.remove('hidden');
    if (isCorrect) {
      feedbackDiv.innerHTML = `
        <div class="feedback-status correct">✓ Correct!</div>
        <p class="feedback-explanation">${q.explanation}</p>
        <button class="btn btn-success" id="finish-practice-btn" style="margin-top: 16px;">Next Step →</button>
      `;
    } else {
      feedbackDiv.innerHTML = `
        <div class="feedback-status incorrect">✗ Incorrect</div>
        <p class="feedback-explanation">${q.explanation}</p>
        <button class="btn btn-success" id="finish-practice-btn" style="margin-top: 16px;">Next Step →</button>
      `;
    }
    
    document.getElementById('finish-practice-btn').addEventListener('click', onComplete);
  });
}

// Render Full Module Quiz
export function renderModuleQuiz(containerSelector, moduleId, onComplete) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const quiz = topicQuizzes[moduleId];
  if (!quiz) {
    container.innerHTML = `<h3>No Quiz loaded for module: ${moduleId}</h3>`;
    return;
  }
  
  let currentQuestionIndex = 0;
  let score = 0;
  const incorrectReviewTopics = new Set();
  
  function showQuestion() {
    const q = quiz[currentQuestionIndex];
    
    container.innerHTML = `
      <div class="practice-header">
        <h2 class="path-section-title" style="margin-bottom: 0;">Module Comprehensive Quiz</h2>
        <span class="practice-progress">Question ${currentQuestionIndex + 1} of ${quiz.length}</span>
      </div>
      <div class="quiz-card animate-slide-up">
        <p class="question-text">${q.question}</p>
        <div class="options-list">
          ${q.options.map((opt, i) => `
            <button class="option-btn" data-index="${i}">${opt}</button>
          `).join('')}
        </div>
        <div class="challenge-actions">
          <button class="btn btn-primary" id="submit-quiz-btn" disabled>Submit Answer</button>
          <div id="quiz-feedback" class="feedback-section hidden"></div>
        </div>
      </div>
    `;
    
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
      submitBtn.remove();
      
      if (isCorrect) {
        score++;
      } else {
        incorrectReviewTopics.add(q.reviewTopic);
      }
      
      optionBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correctIndex) {
          btn.classList.add('correct');
        } else if (idx === selectedIndex) {
          btn.classList.add('incorrect');
        }
      });
      
      feedbackDiv.classList.remove('hidden');
      feedbackDiv.innerHTML = `
        <div class="feedback-status ${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </div>
        <p class="feedback-explanation">${q.explanation}</p>
        <button class="btn btn-primary" id="next-question-btn" style="margin-top: 16px;">
          ${currentQuestionIndex === quiz.length - 1 ? 'Show Results' : 'Next Question →'}
        </button>
      `;
      
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
    const passed = score >= 4; // 80% passing grade
    let reviewSectionHTML = "";
    
    if (incorrectReviewTopics.size > 0) {
      reviewSectionHTML = `
        <div class="result-recommendation animate-slide-up">
          <div style="font-weight: 700; color: var(--color-amber); display: flex; align-items: center; gap: 8px;">
            <i data-lucide="alert-triangle"></i> Recommended Reviews:
          </div>
          <p style="margin-top: 6px; font-size: 13px; color: var(--text-secondary);">
            Based on your answers, we recommend reviewing these specific lessons:
          </p>
          <ul style="margin-left: 20px; margin-top: 8px; font-size: 13px; display: flex; flex-direction: column; gap: 4px;">
            ${Array.from(incorrectReviewTopics).map(t => `<li><strong>${t}</strong></li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      reviewSectionHTML = `
        <div class="result-recommendation" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.2);">
          <div style="font-weight: 700; color: var(--color-emerald); display: flex; align-items: center; gap: 8px;">
            <i data-lucide="check-circle"></i> Perfect Score!
          </div>
          <p style="margin-top: 6px; font-size: 13px; color: var(--text-secondary);">
            Outstanding! You demonstrated mastery of all concepts in this module. Ready for the next challenge!
          </p>
        </div>
      `;
    }
    
    container.innerHTML = `
      <div class="result-container animate-slide-up">
        <h2 class="welcome-title">${passed ? '🎉 Congratulations!' : '👍 Keep Practicing!'}</h2>
        <p class="welcome-subtitle">You completed the ${moduleId.toUpperCase()} Module Quiz</p>
        
        <div class="result-score">
          ${score} / ${quiz.length}
        </div>
        
        <p style="font-size: 15px; color: var(--text-secondary); text-align: center;">
          You answered ${score} out of ${quiz.length} questions correctly.
        </p>
        
        ${reviewSectionHTML}
        
        <div style="display: flex; gap: 16px; margin-top: 12px; width: 100%;">
          <button class="btn btn-outline flex-1" id="retry-quiz-btn">Retry Quiz</button>
          <button class="btn btn-primary flex-1" id="complete-quiz-btn">Back to Module</button>
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
      onComplete(score);
    });
  }
  
  showQuestion();
}
