# 📊 DataMineX — Interactive Data Warehousing & Data Mining Learning Platform

Learn Data Warehousing, Data Mining, KDD, and Data Analytics by doing — not just reading.

DataMineX is an interactive and gamified educational platform designed to help students understand complex concepts of Data Warehousing (DWH), Knowledge Discovery in Databases (KDD), Data Mining, SQL, and Business Intelligence through hands-on learning.

Instead of relying only on theoretical lectures, DataMineX combines interactive sandboxes, guided demonstrations, quizzes, visualizations, and RPG-style progression to create an engaging learning experience.

---

## 🎯 Problem Statement
Students often find Data Warehousing and Data Mining difficult because many concepts are highly theoretical and require students to understand multiple steps before they can see the actual result.

For example:
* SQL concepts are taught without enough practical experimentation.
* Star schemas can be difficult to visualize.
* Apriori algorithms involve multiple calculation steps.
* Choosing the correct visualization is not always intuitive.
* Students have limited opportunities to experiment with real datasets.
* Traditional learning platforms often lack motivation and progress tracking.

---

## 💡 Our Solution
DataMineX converts theoretical concepts into interactive learning experiences.
Students can write SQL queries, build Star Schemas, simulate Apriori algorithms, create BI dashboards, complete quizzes, earn XP, and progress through different learning ranks.

---

## 🚀 Key Features

### 1. 💻 SQL Query Playground
A browser-based SQL sandbox where students can experiment with relational warehouse data.
#### Supported Operations
* `SELECT`
* `WHERE`
* `JOIN ... ON`
* Filtering
* Table exploration
* Query execution
* Result visualization

Students receive immediate query results, allowing them to learn SQL through experimentation.

### 2. 🧩 Star Schema ERD Builder
An interactive puzzle for learning Data Warehouse dimensional modeling.

Students connect:
**Fact Table → Dimension Tables**

by matching:
**Foreign Keys (FK) → Primary Keys (PK)**

#### Features
* Drag-and-connect interface
* Interactive table nodes
* SVG connector rendering
* Relationship validation
* Immediate feedback
* Schema completion detection

This makes concepts such as Fact Tables, Dimension Tables, PKs, and FKs easier to understand visually.

### 3. 🛒 Apriori Association Rule Miner
An interactive Market Basket Analysis simulator based on the Apriori algorithm.

Students can define transactions such as:
* *Transaction 1* → Bread, Milk
* *Transaction 2* → Bread, Butter
* *Transaction 3* → Bread, Milk, Butter

Then configure:
* Minimum Support
* Minimum Confidence

The system performs the mining process step-by-step.

Students can understand:
* Frequent Itemsets
* Candidate Generation
* Support
* Confidence
* Association Rules
* Market Basket Analysis

### 4. 📊 BI Dashboard Canvas
A dynamic visualization builder powered by Chart.js.

Students can select:
* Dataset
* Dimensions
* Measures
* Chart type
and generate visualizations dynamically.

#### Smart Validation
DataMineX also identifies common visualization mistakes, such as:
* Selecting an unsuitable chart type
* Missing required dimensions
* Incorrect measure selection
* Poor visualization configuration

This helps students understand not only how to create charts, but also when to use them.

### 5. 🎮 RPG-Based Gamification
Learning becomes a progression system.
Students earn XP (Experience Points) by completing:
* 📚 Lessons
* 🧠 Quizzes
* 🧩 Challenges
* 💻 SQL Exercises
* 📊 Dashboard Activities
* 🛒 Data Mining Demonstrations

#### 🏆 Rank Progression
`Data Novice` ➔ `Data Explorer` ➔ `Data Analyst` ➔ `Data Miner` ➔ `Data Mining Expert` ➔ `Data Mine Master 👑`

Student progress is displayed through:
* XP counter
* Progress bar
* Profile statistics
* Completed activities
* Rank progression

### 6. 🌓 Dark & Light Theme
DataMineX provides two UI modes:
* 🌙 Dark Mode
* ☀️ Light Mode

The selected theme is persisted using Browser Local Storage, so the user's preference remains after refreshing the page.

---

## 🚀 How to Run the App Locally

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 2. Installation
Clone or download the project folder, open your terminal inside the root directory, and run:
```bash
npm install
```

### 3. Start the Server
Run the startup script:
```bash
npm start
```
Or start in development hot-reload mode:
```bash
npm run dev
```

The terminal will print:
`🚀 DataMineX Learning Platform running on http://localhost:3000`

### 4. Access the App
Open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Database Configuration (Optional)
By default, the platform boots into **In-Memory Mock Database mode** if no PostgreSQL server is running. To connect a permanent PostgreSQL database:

1. Install PostgreSQL on your computer.
2. Create a database named `dataminex` and run the tables schema from [`schema.sql`](schema.sql).
3. Create a `.env` file in the root folder and add your credentials:
   ```text
   PORT=3000
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/dataminex
   NODE_ENV=development
   ```
4. Restart your server. You will see: `✅ Connected to PostgreSQL database successfully.`

---

## 🎓 Learning Outcomes
After using DataMineX, students should be able to:
* Write basic SQL queries.
* Understand relational warehouse structures.
* Identify Fact and Dimension tables.
* Build a Star Schema.
* Understand PK-FK relationships.
* Calculate Support and Confidence.
* Understand the Apriori algorithm.
* Generate association rules.
* Select appropriate data visualizations.
* Understand basic BI dashboard design.
* Apply theoretical concepts through practical experimentation.

---

## 🌟 Why DataMineX?
* **Traditional Learning**: `Theory` ➔ `Notes` ➔ `Exam`
* **DataMineX**: `Learn` ➔ `Experiment` ➔ `Solve` ➔ `Visualize` ➔ `Earn XP` ➔ `Level Up` 🚀

The goal is to transform passive learning into active learning.

---

## 🔮 Future Scope
Planned improvements include:
* 🤖 AI-powered learning assistant
* 📈 Student performance analytics
* 🧪 More interactive data mining algorithms
* 🌲 Decision Tree simulator
* 🧬 K-Means clustering simulator
* 🔍 Decision Support System
* 🏫 Teacher/Admin dashboard
* 🎓 Certificate generation
* 🌐 Multi-language support
* 🏆 Leaderboards and achievements
* ☁️ Cloud deployment
* 📱 Responsive mobile experience

---

## 🚀 Project Vision
DataMineX aims to become a practical learning environment where students can learn, experiment, fail, retry, and understand data concepts without needing complex external tools.

> **Don't just learn Data Mining. Mine the data yourself. 📊⛏️**

---

## 👩‍💻 Author
**Snehal Thombare**
* B.Tech Computer Engineering
* Vidyalankar Institute of Technology, Mumbai
* GitHub: [snehalthombare32-hue](https://github.com/snehalthombare32-hue/dataminex)

---

## 📄 License
This project is developed for educational and academic purposes.
