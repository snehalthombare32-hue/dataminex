// DataMineX - Guided Mode Instruction Overlays Config

export const guidanceSteps = {
  // ETL Demo
  "etl-dataset": {
    title: "Step 1: Choose Source Dataset",
    text: "Review the transactional raw sales logs. Look closely at the data: you'll notice duplicate transactional records and missing fields. In a production system, these errors would break data models. Click 'Select and Extract' to continue."
  },
  "etl-extract": {
    title: "Step 2: Data Extraction",
    text: "We are fetching files from the source transaction database into our staging area. Now that the raw logs are extracted, we must clean them before loading. Click 'Go to Transform' to prepare the cleaning rules."
  },
  "etl-transform": {
    title: "Step 3: Data Transformation",
    text: "Choose which rules to apply! Select 'Remove Duplicates' and 'Filter Missing Values' to clean up transaction IDs. Observe the record counts adjust. Once finished, click 'Execute and Load'."
  },
  "etl-load": {
    title: "Step 4: Data Loading",
    text: "The cleaned staging records are now loaded into the target Data Warehouse tables. Notice how they are split: business measures go to the Fact table, while names and location info go to Dimension tables. Click 'Explore Data Warehouse'."
  },
  "etl-warehouse": {
    title: "Step 5: View Warehouse Records",
    text: "Congratulations, the ETL pipeline run is complete! You can run analytical queries on the Star Schema. The fact table queries execute fast since duplicates and null values were pruned during transformation."
  },

  // K-Means Demo
  "kmeans-points": {
    title: "Step 1: Place Data Coordinates",
    text: "Click anywhere inside the coordinate grid map to place 10 to 15 data points. These represent customer coordinates (e.g. coordinates representing Income vs Spending habits). Once done, click 'Initialize Centroids'."
  },
  "kmeans-centroids": {
    title: "Step 2: Assign Initial Centroids (K = 3)",
    text: "The algorithm initializes K random group heads (centroids). We've set K=3. Observe the three glowing squares. Next, click 'Run Iteration' to calculate assignments."
  },
  "kmeans-run": {
    title: "Step 3: Calculate Distances and Assign",
    text: "The algorithm calculates Euclidean distances from each coordinate to all 3 centroids, grouping them by color to the nearest centroid. Centroids are then re-centered to the average of their cluster points. Click 'Run Iteration' again."
  },
  "kmeans-converge": {
    title: "Step 4: Centroid Convergence",
    text: "Continue clicking 'Run Iteration'. Centroid coordinates will shift less and less. When the centroids stop moving, convergence is reached, and clustering is complete! Click 'Complete Demo'."
  },

  // OLAP Demo
  "olap-cube": {
    title: "Step 1: The Multi-dimensional Data Cube",
    text: "The cube displays Sales volume across 3 dimensions: Time (Quarter), Location (Cities), and Product (Laptops/Phones). Click 'Slice' in the control panel to see how dimensions are sliced."
  },
  "olap-slice": {
    title: "OLAP Operation: Slice",
    text: "Slicing slices a cross-section of the cube by locking one dimension to a single value (e.g., Quarter = Q1). This simplifies the view to a 2D sheet. Click 'Dice' to extract a sub-cube."
  },
  "olap-dice": {
    title: "OLAP Operation: Dice",
    text: "Dicing extracts a smaller sub-cube by selecting ranges across multiple dimensions (e.g. Chicago/New York locations and Laptops product). Click 'Roll-up'."
  },
  "olap-rollup": {
    title: "OLAP Operation: Roll-Up",
    text: "Roll-up aggregates summary values by climbing up the dimension hierarchy (e.g., summarising city-level Sales up to Country-wide Sales). Click 'Drill-down'."
  },
  "olap-drilldown": {
    title: "OLAP Operation: Drill-Down",
    text: "Drill-down is the inverse of roll-up. It navigates down the hierarchy into detailed levels (e.g., drilling from Quarter totals down to individual Months). Click 'Pivot'."
  },
  "olap-pivot": {
    title: "OLAP Operation: Pivot",
    text: "Pivot rotates the data axes in the visualization. This swaps rows and columns to expose structural patterns without modifying the data values. Click 'Complete Demo'."
  }
};

export function renderGuidance(containerId, stepKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const step = guidanceSteps[stepKey];
  if (!step) {
    container.innerHTML = "";
    container.classList.add('hidden');
    return;
  }
  
  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="guided-overlay-card">
      <div class="guided-overlay-title">
        <i data-lucide="help-circle" style="width: 18px; height: 18px;"></i>
        <span>${step.title}</span>
      </div>
      <p style="font-size: 13.5px; color: var(--text-primary); line-height: 1.5;">${step.text}</p>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
