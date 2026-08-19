# DataMineX 📊

DataMineX is an interactive, gamified educational portal designed to help students master core concepts in **Data Warehousing (DWH)**, **Data Mining (KDD)**, and **Data Analytics**. 

The platform features animated video lectures, multiple-choice quizzes, guided live demonstrations, and several interactive hands-on sandboxes.

---

## 🚀 Key Features

### 1. 💻 SQL Query Playground Sandbox
* A built-in web terminal console allowing students to write and execute SQL queries (supporting `SELECT`, `JOIN ... ON`, `WHERE` filtering) on relational warehouse tables.

### 2. 🧩 Star Schema ERD Builder Puzzle
* A drag-and-connect database key mapping puzzle. Students match foreign keys (FK) from a central Fact table to primary keys (PK) in Dimension tables, complete with SVG connector line rendering.

### 3. 🛒 Apriori Association Rules Miner
* An interactive Market Basket Analysis simulator. Set checkout transactions, adjust Support/Confidence thresholds, and mine association rules step-by-step.

### 4. 📊 BI Dashboard Canvas
* Construct live visualizations dynamically using Chart.js. The builder validates your selections and warns you if you make common data visualization design errors.

### 5. 🏆 RPG Gamification progression
* Earn experience points (**XP**) by completing lessons, challenges, demos, and quizzes. Unlock ranks from *Data Novice* to *Data Mine Master*, tracked via a sidebar progress bar and profile statistics.

### 6. 🌓 Dark & Light Theme Switcher
* Instantly toggle between a premium dark theme and a clean light theme, persisted via local storage.

---

## 🛠 Tech Stack
* **Frontend**: Vanilla JavaScript (ES Modules), Custom CSS Grid, Lucide Icons, Chart.js, HTML5.
* **Backend**: Node.js, Express, JSON Web Tokens (JWT) for authentication, BcryptJS.
* **Database**: PostgreSQL (with a **Smart In-Memory Fallback** mode if Postgres is not running).

---

## 🏃 How to Run the App Locally

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

## 🗄 Database Configuration (Optional)
By default, the platform boots into **In-Memory Mock Database mode** if no PostgreSQL server is running. To connect a permanent PostgreSQL database:

1. Install PostgreSQL on your computer.
2. Create a database named `dataminex` and run the tables schema from [`schema.sql`](schema.sql).
3. Create a `.env` file in the root folder and add your credentials:
   ```text
   PORT=3000
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/dataminex
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
4. Restart your server. You will see: `✅ Connected to PostgreSQL database successfully.`
