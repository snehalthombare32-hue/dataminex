// DataMineX - Central Demo Videos Component

import { VirtualVideoPlayer } from './videos.js';

const VIDEO_CATALOG = [
  // Data Warehousing Category
  {
    id: "etl",
    category: "warehouse",
    title: "Star Schema & ETL Pipeline Demonstration",
    duration: "5:00",
    topic: "Data Warehousing",
    difficulty: "Beginner",
    description: "Learn how raw operational sales records are extracted, cleansed of duplicates/nulls, and loaded into Star Schema Fact and Dimension tables."
  },
  {
    id: "olap",
    category: "warehouse",
    title: "OLAP Data Cube Operations (Roll-up, Slice, Dice)",
    duration: "4:30",
    topic: "Data Analytics",
    difficulty: "Intermediate",
    description: "Visual step-by-step walkthrough of slicing 2D layers, dicing sub-cubes, and rolling up regional hierarchies into national summaries."
  },
  {
    id: "schema",
    category: "warehouse",
    title: "Star Schema vs Snowflake Schema Architecture",
    duration: "6:00",
    topic: "Schema Modeling",
    difficulty: "Intermediate",
    description: "Compare denormalized Star Schema query performance against normalized Snowflake Schema storage efficiency."
  },

  // Data Mining Category
  {
    id: "kmeans",
    category: "mining",
    title: "K-Means Coordinate Clustering Simulation",
    duration: "5:30",
    topic: "Data Mining",
    difficulty: "Intermediate",
    description: "Watch 2D coordinate points group around moving centroids in real-time as the algorithm computes Euclidean distance convergence."
  },
  {
    id: "apriori",
    category: "mining",
    title: "Apriori Market Basket Rule Extraction",
    duration: "5:00",
    topic: "Association Mining",
    difficulty: "Advanced",
    description: "Discover frequent itemsets and calculate Support %, Confidence %, and Lift ratios from retail market transactions."
  }
];

export class DemoVideosPage {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.selectedCategory = 'all'; // 'all' | 'warehouse' | 'mining'
    this.activePlayer = null;
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  render() {
    const filteredCatalog = this.selectedCategory === 'all' 
      ? VIDEO_CATALOG 
      : VIDEO_CATALOG.filter(v => v.category === this.selectedCategory);

    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="font-size: 24px; font-weight: 800; color: #f59e0b; display: flex; align-items: center; gap: 10px;">
            <i data-lucide="play-circle" style="width: 26px; height: 26px;"></i>
            <span>Video Demonstrations &amp; Walkthroughs</span>
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
            Step-by-step video lectures and interactive whiteboard simulations for Data Warehousing &amp; Data Mining
          </p>
        </div>

        <!-- Video Player Mount Stage -->
        <div id="video-player-stage" style="margin-bottom: 30px;">
          <!-- Active video mounts here -->
        </div>

        <!-- Category Filter Tabs -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
          ${[
            { id: 'all', label: 'All Videos' },
            { id: 'warehouse', label: '🏢 Data Warehousing' },
            { id: 'mining', label: '⛏ Data Mining' }
          ].map(tab => `
            <button class="v-tab-btn ${this.selectedCategory === tab.id ? 'active' : ''}" data-cat="${tab.id}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); background: ${this.selectedCategory === tab.id ? '#f59e0b' : 'var(--bg-secondary)'}; color: ${this.selectedCategory === tab.id ? '#000000' : 'var(--text-secondary)'}; cursor: pointer;">
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Video Cards Catalog Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          ${filteredCatalog.map(vid => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="position: relative; height: 160px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); display: flex; align-items: center; justify-content: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(245, 158, 11, 0.2); border: 2px solid #f59e0b; display: flex; align-items: center; justify-content: center; color: #f59e0b;">
                  <i data-lucide="play" style="width: 22px; height: 22px; margin-left: 2px;"></i>
                </div>
                <span style="position: absolute; bottom: 8px; right: 10px; font-size: 11px; font-family: monospace; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 6px; border-radius: 4px;">${vid.duration}</span>
              </div>

              <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 10px; font-weight: bold; background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); padding: 2px 6px; border-radius: 4px;">
                      ${vid.topic}
                    </span>
                    <span style="font-size: 10px; font-weight: bold; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 2px 6px; border-radius: 4px;">
                      ${vid.difficulty}
                    </span>
                  </div>
                  <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">${vid.title}</h4>
                  <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">${vid.description}</p>
                </div>

                <button class="btn-launch-video" data-id="${vid.id}" style="width: 100%; padding: 10px; background: #f59e0b; color: #000; font-weight: bold; border-radius: 6px; border: none; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  <i data-lucide="play" style="width: 14px; height: 14px;"></i>
                  <span>Watch Demonstration</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Bind events
    this.mount.querySelectorAll('.v-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.getAttribute('data-cat');
        this.render();
      });
    });

    this.mount.querySelectorAll('.btn-launch-video').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.loadVideo(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Default load first video into player stage
    this.loadVideo('etl');

    if (window.lucide) window.lucide.createIcons();
  }

  loadVideo(videoType) {
    if (this.activePlayer) {
      this.activePlayer.destroy();
      this.activePlayer = null;
    }
    this.activePlayer = new VirtualVideoPlayer(videoType, '#video-player-stage');
  }
}
