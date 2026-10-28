# 📊 DataMineX — Interactive Data Warehousing & Data Mining Learning Platform

> **Local Educational Platform & Virtual Laboratory**  
> Learn Data Warehousing, Data Mining, KDD, and Data Analytics by doing — with classroom board-style step-by-step numerical derivations, interactive algorithms, practical virtual labs, and an offline AI study tutor.

---

## 🎯 Overview & Mission

DataMineX is an academic SaaS-grade interactive learning platform that demystifies theoretical Data Warehousing (DWH) and Data Mining (DM) concepts through active experimentation. Instead of static textbook reading, students can:
- Execute **16 numerical algorithms** with full mathematical step-by-step substitutions, intermediate tables, and final results.
- Conduct **17-step virtual lab experiments** on custom uploaded CSV datasets with exploratory statistics, preprocessing, and interactive scatter charts.
- Interact with an **offline AI Study Assistant** trained on Data Warehousing and Data Mining curricula supporting 2, 5, and 10-mark exam formats.
- Earn XP, unlock rank titles, and complete real-world scenario challenges without duplicate XP exploits.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend API** | Node.js (ES Modules), Express.js 4.x, bcryptjs, jsonwebtoken, dotenv |
| **Database** | PostgreSQL with resilient in-memory mock fallback mode for zero-setup local trial |
| **Frontend Core** | Vanilla JavaScript (SPA Hash Router Architecture), Semantic HTML5 |
| **Design System** | Custom Vanilla CSS SaaS Design System with Light default and Dark theme toggle |
| **Data & Charts** | Chart.js 4.x, Lucide Icons, HTML5 Canvas 2D Visualizer |
| **Numerical Engines**| Client-side deterministic `NumericalEngine` (100% free, zero paid APIs) |
| **Testing** | Automated standalone local test suite (`tests/test-suite.js`) |

---

## 📂 Project Structure

```text
dataminex/
├── package.json               # Dependencies and scripts (start, dev, test)
├── server.js                  # Express API server, auth, rate limiting, and AI endpoint
├── db.js                      # Non-destructive DB connection and mock fallback
├── knowledgeBase.js           # Offline educational knowledge retrieval engine
├── schema.sql                 # Reference database schema
├── .env.example               # Environment variable configuration template
├── tests/
│   └── test-suite.js          # 72 automated local tests (Unit, API, Math, Edge cases)
├── public/
│   ├── index.html             # Single Page Application entry shell
│   ├── css/
│   │   └── styles.css         # SaaS design tokens, light theme, dark-theme override
│   └── js/
│       ├── app.js             # Client-side router, state management, UI views
│       ├── numericalEngine.js # Deterministic math calculation engine (13+ algorithms)
│       ├── numericalSolver.js # Dedicated numerical problem solver with 3 input modes
│       ├── practicalLab.js    # 17-step virtual laboratory hub with CSV processing
│       ├── aiAssistant.js     # Interactive AI tutor frontend with prompt shortcuts
│       ├── challenges.js      # Practical case scenario challenge runner
│       ├── achievements.js    # Badge unlocks and achievement toast notifications
│       ├── practice.js        # Lesson practice questions and modular quizzes
│       ├── demos.js           # Interactive ETL, OLAP, and K-Means demos
│       ├── reportExporter.js  # Printable HTML/PDF report generator
│       └── theory/            # Structured syllabus lesson content
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL** *(Optional)*: If running locally, create a database named `dataminex`. If not installed, the application automatically uses the built-in in-memory storage.

### 2. Installation
Open PowerShell or your terminal in the project directory:
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dataminex
JWT_SECRET=super_secret_dataminex_token_key
NODE_ENV=development
```

### 4. Start the Application
```bash
npm start
```
*(Or use `npm run dev` with nodemon for hot-reloading)*

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🧪 Automated Testing

Execute the comprehensive automated test suite locally:
```bash
npm test
```
The test suite executes **72 automated tests** across:
1. **Mathematical Correctness**: K-Means, ID3 Entropy, Linear Regression, IQR Outlier Fences, Min-Max & Z-Score Normalization, Apriori Association Rules, Confusion Matrix Metrics, and edge cases.
2. **AI Study Assistant**: Topic keyword retrieval, 2/5/10 marks formatting, and worked numerical generation.
3. **Security & API**: User registration input validation, password length constraints, JWT verification, route protection, and duplicate XP exploit prevention.

---

## 🧮 Supported Algorithms

| Category | Algorithm / Technique | Primary Educational Capability |
| :--- | :--- | :--- |
| **Clustering** | K-Means Clustering | Centroid recalculation, Euclidean distance, SSE, 2D Scatter plot |
| **Clustering** | K-Medoids (PAM) | Medoid point swapping, total absolute distance cost minimization |
| **Clustering** | Hierarchical Agglomerative | Single, complete, and average linkage distance matrices & Dendrogram |
| **Clustering** | DBSCAN Density Clustering | Epsilon neighborhoods, MinPts threshold, Core, Border, and Noise points |
| **Classification** | ID3 Decision Tree | Shannon Entropy $H(S)$, Information Gain $Gain(S, A)$, Best split attribute |
| **Classification** | Naive Bayes Classifier | Prior probabilities, feature likelihoods, Laplace smoothing, Posteriors |
| **Classification** | K-Nearest Neighbors (KNN) | Euclidean & Manhattan distances, majority voting, confidence % |
| **Association** | Apriori Algorithm | Itemset candidate generation, Minimum Support, Minimum Confidence, Lift |
| **Regression** | Simple Linear Regression | Ordinary Least Squares, Slope $b$, Intercept $a$, Equation $y = mx + c$, $R^2$ |
| **Preprocessing**| Min-Max Normalization | Linear rescaling into arbitrary bounds $[new\_min, new\_max]$ |
| **Preprocessing**| Z-Score Standardization | Scaling to mean $\mu = 0$ and standard deviation $\sigma = 1$ |
| **Preprocessing**| Decimal Scaling | Magnitude shifting by powers of 10 |
| **Statistics** | IQR Outlier Fences | First Quartile $Q_1$, Third Quartile $Q_3$, Lower/Upper Tukey fences |
| **Statistics** | Data Binning & Smoothing | Equal-width, Equal-frequency, bin means and bin boundary smoothing |
| **Evaluation** | Confusion Matrix Metrics | True/False Positives & Negatives, Accuracy, Precision, Recall, F1-Score |
| **Data Warehouse**| OLAP Data Cube Operations | Roll-up, Drill-down, Slice, Dice, and Pivot multidimensional operations |

---

## 🔒 Security & Database Integrity Guarantees

- **Absolute Database Preservation**: Zero schema mutations or migrations executed against existing user data.
- **Duplicate XP Exploit Prevention**: Challenge and progress completion endpoints enforce uniqueness checks on the server to prevent infinite XP farming.
- **Rate Limiting**: In-memory rate limiting shields authentication and API endpoints from brute-force attempts.
- **Security Headers**: Standard security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`) protect client communications.
- **Zero Paid Dependencies**: The entire platform operates 100% locally with zero paid API keys, tokens, or cloud service subscriptions required.

---

## 🚢 Future Deployment Guide (Reference Only — Do Not Deploy Now)

> **Notice**: Deployment is strictly deferred per project requirements. The following instructions are provided solely for future production reference.

When you are ready to deploy DataMineX in the future:
1. **Production Environment**: Set `NODE_ENV=production` and configure a cryptographically secure random `JWT_SECRET`.
2. **Database Provisioning**: Connect a managed PostgreSQL instance (e.g., Supabase, Neon, AWS RDS) via `DATABASE_URL`.
3. **Reverse Proxy**: Place Express behind Nginx or Caddy with HTTPS/TLS termination and Gzip/Brotli compression enabled.
4. **Process Management**: Run the server using PM2 (`pm2 start server.js -i max --name dataminex`) or containerize using Docker.
