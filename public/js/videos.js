// DataMineX - Virtual Animated Lecture Video Simulator

const videoData = {
  etl: {
    title: "Lecture: The ETL Integration Pipeline",
    duration: 60,
    captions: [
      { start: 0, end: 12, text: "Welcome to the ETL Lecture. In this module, we explore how data is integrated from operational transaction databases into our warehouse. First, let's extract raw rows from the source logs." },
      { start: 12, end: 25, text: "Here, we extract daily transactions. As you can see, the raw table contains duplicate rows and missing amounts (nulls). We copy these records into our staging area buffer." },
      { start: 25, end: 45, text: "Next, we apply Transformation filters. We run cleaning rules to remove duplicate IDs and filter rows with blank fields. Notice the dirty records disappear, leaving clean rows." },
      { start: 45, end: 60, text: "Finally, the load process executes. Clean rows are loaded: business measures go to the central Fact table, while names and city attributes go to Dimension tables. This completes the ETL cycle." }
    ]
  },
  kmeans: {
    title: "Lecture: K-Means Clustering Theory",
    duration: 60,
    captions: [
      { start: 0, end: 15, text: "Welcome to the K-Means Clustering tutorial. Today, we look at how data coordinates are grouped by similarity. First, we plot coordinate points in our mathematical space." },
      { start: 15, end: 30, text: "Next, we initialize K random centroids (here, K=3). These centroids act as the central reference coordinates for our groups." },
      { start: 30, end: 48, text: "In each iteration, the algorithm computes the distance from each point to all three centroids, assigning points to their nearest color group." },
      { start: 48, end: 60, text: "Then, centroids are re-calculated to the mean of their groups. They shift locations. When centroids stop moving, convergence is reached, and clustering is complete." }
    ]
  },
  olap: {
    title: "Lecture: OLAP Data Cube Operations",
    duration: 60,
    captions: [
      { start: 0, end: 15, text: "Welcome to the OLAP Cube lecture. Business Intelligence uses multi-dimensional structures to index metrics across variables like Time, Product, and Location." },
      { start: 15, end: 32, text: "Let's inspect the Slice operation. Slicing locks one dimension (e.g. Quarter = Q1) to cut out a single 2D layer for closer inspection." },
      { start: 32, end: 45, text: "Dicing goes a step further by selecting sub-ranges across multiple dimensions (e.g. comparing sales of Laptops only in Chicago and New York)." },
      { start: 45, end: 60, text: "Finally, Pivoting rotates the data coordinates, swapping rows and columns to show the report from a new analytical perspective." }
    ]
  },
  "etl-demo": {
    title: "Walkthrough: ETL Pipeline Simulator Guide",
    duration: 40,
    captions: [
      { start: 0, end: 10, text: "Welcome to the ETL Simulator Guide. Here, we demonstrate how to use the interactive ETL tool. We start with raw transactional sales records showing errors." },
      { start: 10, end: 22, text: "In Step 2, we extract the source data. In Step 3, we select transformation rules. Watch the cursor hover and select duplicates/null cleaning boxes." },
      { start: 22, end: 32, text: "In Step 4, clean rows are loaded into Fact_Sales and Dim_Customers. Watch the columns partition into quantitative metrics and descriptions." },
      { start: 32, end: 40, text: "Finally, in Step 5, we execute SQL queries on the star schema. You can run custom queries to check consolidated metrics by city." }
    ]
  },
  "kmeans-demo": {
    title: "Walkthrough: K-Means Coordinates Simulation Guide",
    duration: 40,
    captions: [
      { start: 0, end: 10, text: "Welcome to the K-Means coordinate guide. In this walkthrough, we explain the K-Means simulation. First, coordinates representing data items are plotted on the grid." },
      { start: 10, end: 22, text: "Next, clicking the initialization button places three colored centroids (Red, Green, Blue) at random coordinates on the canvas." },
      { start: 22, end: 32, text: "We then run iterations. In each iteration, points are colored according to their closest centroid star, and centroids recalculate and shift." },
      { start: 32, end: 40, text: "Repeat the iterations until stars stop shifting, meaning convergence is reached. The algorithm has partitioned the points into 3 optimal clusters." }
    ]
  },
  "olap-demo": {
    title: "Walkthrough: OLAP Cube Operations Guide",
    duration: 40,
    captions: [
      { start: 0, end: 10, text: "Welcome to the OLAP Cube operations walkthrough. We will demonstrate how to query multi-dimensional sales facts along Qtr, City, and Product." },
      { start: 10, end: 20, text: "We click Slice (locking Qtr to Q1) to view a single sheet. We click Dice to filter New York/Chicago and Laptops, extracting a sub-cube." },
      { start: 20, end: 30, text: "We click Roll-up to aggregate city records into a USA country sum. We click Drill-down to expand Q1 into Jan, Feb, and Mar." },
      { start: 30, end: 40, text: "Finally, we click Pivot. Swapping rows and columns rotates axes to display products as rows and cities as columns." }
    ]
  }
};

export class VirtualVideoPlayer {
  constructor(videoType, containerSelector) {
    this.type = videoData[videoType] ? videoType : 'etl';
    this.meta = videoData[this.type];
    this.container = document.querySelector(containerSelector);
    
    this.isPlaying = false;
    this.currentTime = 0;
    this.playbackRate = 1.0;
    this.intervalId = null;
    
    this.initPlayer();
  }
  
  initPlayer() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="video-player-container">
        <!-- Lecture Title -->
        <div class="video-title-bar">
          <i data-lucide="video" class="gold-icon" style="width: 18px; height: 18px;"></i>
          <span>${this.meta.title}</span>
        </div>
        
        <!-- Video Screen Canvas Stage -->
        <div class="video-screen-stage">
          <canvas id="video-canvas" width="640" height="320"></canvas>
        </div>
        
        <!-- Subtitle overlay -->
        <div class="video-subtitle-overlay" id="video-subtitles">
          [Press play to begin the video lecture]
        </div>
        
        <!-- Controls Bar -->
        <div class="player-controls">
          <button class="player-control-btn" id="player-btn-play" title="Play">
            <i data-lucide="play" id="play-icon"></i>
          </button>
          
          <button class="player-control-btn" id="player-btn-restart" title="Restart">
            <i data-lucide="rotate-ccw"></i>
          </button>
          
          <!-- Scrubber Timeline -->
          <div style="flex: 1; display: flex; align-items: center; gap: 12px; padding: 0 8px;">
            <span class="player-time" id="player-time-current">0:00</span>
            <input type="range" class="player-scrubber" id="player-scrub" min="0" max="${this.meta.duration}" value="0" step="0.1">
            <span class="player-time" id="player-time-total">${this.formatTime(this.meta.duration)}</span>
          </div>
          
          <!-- Playback Speed -->
          <select class="player-speed-select" id="player-rate">
            <option value="1.0">1.0x Speed</option>
            <option value="1.5">1.5x Speed</option>
            <option value="2.0">2.0x Speed</option>
          </select>
        </div>
      </div>
      
      <!-- Synchronized Lecture Transcript Box -->
      <div class="transcript-wrapper">
        <div class="transcript-header">
          <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
          <span>Lecture Transcript</span>
        </div>
        <div class="transcript-box" id="lecture-transcript-list">
          ${this.meta.captions.map((c, idx) => `
            <div class="transcript-line" id="tline-${idx}" data-start="${c.start}" data-end="${c.end}">
              <span class="tline-time">[${this.formatTime(c.start)}]</span>
              <span class="tline-text">${c.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Bind controls
    this.playBtn = this.container.querySelector('#player-btn-play');
    this.restartBtn = this.container.querySelector('#player-btn-restart');
    this.scrubber = this.container.querySelector('#player-scrub');
    this.rateSelect = this.container.querySelector('#player-rate');
    this.canvas = this.container.querySelector('#video-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.restartBtn.addEventListener('click', () => this.restart());
    
    this.scrubber.addEventListener('input', (e) => {
      this.seek(parseFloat(e.target.value));
    });
    
    this.rateSelect.addEventListener('change', (e) => {
      this.playbackRate = parseFloat(e.target.value);
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    });
    
    // Initial draw
    this.drawFrame();
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
  
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  play() {
    this.isPlaying = true;
    this.playBtn.innerHTML = `<i data-lucide="pause"></i>`;
    if (window.lucide) window.lucide.createIcons();
    
    // Calculate interval tick in ms
    const intervalMs = 100 / this.playbackRate;
    this.intervalId = setInterval(() => {
      this.currentTime += 0.1;
      if (this.currentTime >= this.meta.duration) {
        this.currentTime = this.meta.duration;
        this.pause();
      }
      this.updateUI();
    }, intervalMs);
  }
  
  pause() {
    this.isPlaying = false;
    this.playBtn.innerHTML = `<i data-lucide="play"></i>`;
    if (window.lucide) window.lucide.createIcons();
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  restart() {
    this.seek(0);
    this.play();
  }
  
  seek(seconds) {
    this.currentTime = seconds;
    this.updateUI();
  }
  
  destroy() {
    this.pause();
  }
  
  updateUI() {
    this.scrubber.value = this.currentTime;
    this.container.querySelector('#player-time-current').innerText = this.formatTime(this.currentTime);
    
    // Update Subtitle Caption Text
    const cap = this.meta.captions.find(c => this.currentTime >= c.start && this.currentTime < c.end);
    const subContainer = this.container.querySelector('#video-subtitles');
    if (cap) {
      subContainer.innerText = cap.text;
      subContainer.classList.add('active-sub');
    } else {
      subContainer.innerText = "";
      subContainer.classList.remove('active-sub');
    }
    
    // Highlight active transcript line
    this.meta.captions.forEach((c, idx) => {
      const line = this.container.querySelector(`#tline-${idx}`);
      if (line) {
        if (this.currentTime >= c.start && this.currentTime < c.end) {
          line.classList.add('highlighted');
          line.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          line.classList.remove('highlighted');
        }
      }
    });
    
    this.drawFrame();
  }
  
  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
  
  // ==========================================
  // LECTURE CANVAS ANIMATION ENGINE
  // ==========================================
  drawFrame() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.currentTime;
    
    // Clear canvas with premium background
    ctx.fillStyle = '#0f172a'; // Deep dark blue-gray
    ctx.fillRect(0, 0, w, h);
    
    // Draw grid background for blackboard aesthetic
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 20; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    if (this.type === 'etl') {
      this.drawETLLecture(ctx, w, h, t);
    } else if (this.type === 'kmeans') {
      this.drawKMeansLecture(ctx, w, h, t);
    } else if (this.type === 'olap') {
      this.drawOLAPLecture(ctx, w, h, t);
    } else if (this.type === 'etl-demo') {
      this.drawETLLecture(ctx, w, h, t * 1.5);
    } else if (this.type === 'kmeans-demo') {
      this.drawKMeansLecture(ctx, w, h, t * 1.5);
    } else if (this.type === 'olap-demo') {
      this.drawOLAPLecture(ctx, w, h, t * 1.5);
    }
  }
  
  // Draw ETL animation frame
  drawETLLecture(ctx, w, h, t) {
    // Labels & cylinders positions
    const dbX = 80;
    const dbY = 160;
    
    const stageX = 320;
    const stageY = 160;
    
    const factX = 540;
    const factY = 100;
    const dimX = 540;
    const dimY = 220;
    
    // 1. OLTP Source Database
    this.drawCylinder(ctx, dbX, dbY, 40, 65, "#6366f1", "OLTP Source");
    
    // 2. Staging Area
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(stageX - 60, stageY - 70, 120, 140);
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(stageX - 60, stageY - 70, 120, 140);
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText("STAGING BUFFER", stageX, stageY - 80);
    
    // 3. Targets (Fact & Dimensions)
    this.drawCylinder(ctx, factX, factY, 45, 50, "#8b5cf6", "Fact_Sales");
    this.drawCylinder(ctx, dimX, dimY, 45, 50, "#10b981", "Dim_Customers");
    
    // Extraction Arrows (Active t: 0 to 20)
    if (t >= 2 && t < 22) {
      const progress = (t - 2) / 20; // 0 to 1
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dbX + 40, dbY);
      ctx.lineTo(dbX + 40 + (stageX - 60 - dbX - 40) * progress, dbY);
      ctx.stroke();
      
      // Moving dots
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(dbX + 40 + (stageX - 60 - dbX - 40) * progress, dbY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#6366f1';
      ctx.font = '11px Inter';
      ctx.fillText("Extracting...", (dbX + stageX) / 2, dbY - 10);
    }
    
    // Table records render inside stage (t: 12 to 45)
    if (t >= 12 && t < 45) {
      const entries = [
        { tx: 101, name: "Alice", val: "$1200", clean: true },
        { tx: 101, name: "Alice", val: "$1200", clean: false, dup: true }, // Duplicate
        { tx: 102, name: "Bob", val: "$800", clean: true },
        { tx: 103, name: "NULL", val: "NULL", clean: false, missing: true } // Null
      ];
      
      ctx.textAlign = 'left';
      ctx.font = '9px monospace';
      entries.forEach((e, idx) => {
        const rowY = stageY - 40 + (idx * 24);
        
        // Highlight logic
        if (t >= 25) { // Transforming phase active
          if (!e.clean) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; // Highlight deleted red
            ctx.fillRect(stageX - 55, rowY - 12, 110, 20);
            ctx.fillStyle = '#ef4444';
            ctx.fillText(`DEL: TX_${e.tx}`, stageX - 50, rowY + 2);
            return;
          }
        }
        
        ctx.fillStyle = e.clean ? '#10b981' : '#f59e0b';
        ctx.fillText(`TX_${e.tx} | ${e.name} | ${e.val}`, stageX - 50, rowY + 2);
      });
      
      if (t >= 25 && t < 45) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText("Cleaning: Deduplicating...", stageX, stageY + 90);
      }
    }
    
    // Loading Phase (Active t: 45 to 60)
    if (t >= 45) {
      const loadProgress = Math.min((t - 45) / 10, 1);
      
      // Arrow to Fact
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(stageX + 60, stageY - 20);
      ctx.lineTo(stageX + 60 + (factX - 45 - stageX - 60) * loadProgress, stageY - 20 - (stageY - 20 - factY) * loadProgress);
      ctx.stroke();
      
      // Arrow to Dim
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(stageX + 60, stageY + 20);
      ctx.lineTo(stageX + 60 + (dimX - 45 - stageX - 60) * loadProgress, stageY + 20 + (dimY - stageY - 20) * loadProgress);
      ctx.stroke();
      
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(stageX + 60 + (factX - 45 - stageX - 60) * loadProgress, stageY - 20 - (stageY - 20 - factY) * loadProgress, 5, 0, Math.PI * 2);
      ctx.arc(stageX + 60 + (dimX - 45 - stageX - 60) * loadProgress, stageY + 20 + (dimY - stageY - 20) * loadProgress, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText("LOADING DATA WAREHOUSE", stageX + 110, stageY - 80);
    }
  }
  
  // Draw K-Means animation frame
  drawKMeansLecture(ctx, w, h, t) {
    const gridX = w / 2;
    const gridY = h / 2;
    const size = 120;
    
    // Draw 2D Coordinates grid axis
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gridX - size, gridY);
    ctx.lineTo(gridX + size, gridY);
    ctx.moveTo(gridX, gridY - size);
    ctx.lineTo(gridX, gridY + size);
    ctx.stroke();
    
    // Static coordinate points
    const pts = [
      { x: gridX - 50, y: gridY - 60 },
      { x: gridX - 70, y: gridY - 30 },
      { x: gridX - 40, y: gridY - 40 },
      
      { x: gridX + 60, y: gridY - 40 },
      { x: gridX + 80, y: gridY - 20 },
      { x: gridX + 50, y: gridY - 60 },
      
      { x: gridX - 10, y: gridY + 60 },
      { x: gridX + 20, y: gridY + 80 },
      { x: gridX - 30, y: gridY + 50 }
    ];
    
    // Draw Points (t >= 3)
    if (t >= 3) {
      pts.forEach((p, idx) => {
        let color = '#9ca3af'; // Default Grey
        
        // Group coloring (t >= 30)
        if (t >= 30) {
          if (idx < 3) color = '#ef4444';      // Cluster 1 Red
          else if (idx < 6) color = '#10b981'; // Cluster 2 Emerald
          else color = '#3b82f6';              // Cluster 3 Indigo
        }
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
    
    // Centroids (t >= 15)
    if (t >= 15) {
      // Centroid positions (initial vs final computed convergence)
      let cRed = { x: gridX - 90, y: gridY - 80 };
      let cGreen = { x: gridX + 90, y: gridY - 80 };
      let cBlue = { x: gridX + 10, y: gridY + 20 };
      
      if (t >= 48) { // Moving centroids to mean centers
        const p = Math.min((t - 48) / 8, 1); // interpolating
        cRed = { x: cRed.x + (gridX - 53 - cRed.x) * p, y: cRed.y + (gridY - 43 - cRed.y) * p };
        cGreen = { x: cGreen.x + (gridX + 63 - cGreen.x) * p, y: cGreen.y + (gridY - 40 - cGreen.y) * p };
        cBlue = { x: cBlue.x + (gridX - 7 - cBlue.x) * p, y: cBlue.y + (gridY + 63 - cBlue.y) * p };
      }
      
      // Draw Red Centroid
      this.drawCentroidStar(ctx, cRed.x, cRed.y, '#ef4444');
      // Draw Green Centroid
      this.drawCentroidStar(ctx, cGreen.x, cGreen.y, '#10b981');
      // Draw Blue Centroid
      this.drawCentroidStar(ctx, cBlue.x, cBlue.y, '#3b82f6');
    }
    
    // Print algorithm labels
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 12px Outfit';
    ctx.textAlign = 'left';
    if (t >= 3 && t < 15) ctx.fillText("1. Plot coordinate items", 20, 40);
    else if (t >= 15 && t < 30) ctx.fillText("2. Initialize centroids randomly", 20, 40);
    else if (t >= 30 && t < 48) ctx.fillText("3. Assign points to nearest star", 20, 40);
    else if (t >= 48) ctx.fillText("4. Recompute centers & converge!", 20, 40);
  }
  
  // Draw OLAP operations cube frame
  drawOLAPLecture(ctx, w, h, t) {
    const gridX = w / 2;
    const gridY = h / 2 + 10;
    
    // Draw 3D Cube lines (t: 0 to 15, or default frame)
    if (t < 15 || t >= 45) {
      // Standard isometric cube
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 2;
      this.drawIsometricCube(ctx, gridX, gridY, 80, 80, 80);
      
      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText("Sales Data Cube (3D View)", gridX, gridY - 90);
    }
    
    // Slice representation (t: 15 to 32)
    if (t >= 15 && t < 32) {
      // Draw isometric cube wireframe
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      this.drawIsometricCube(ctx, gridX, gridY, 80, 80, 80);
      
      // Draw intersecting color plane for Q1
      ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Iso coordinates front layer
      ctx.moveTo(gridX - 80, gridY - 20);
      ctx.lineTo(gridX, gridY - 60);
      ctx.lineTo(gridX, gridY + 20);
      ctx.lineTo(gridX - 80, gridY + 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText("OLAP Operation: Slice (Time = Q1)", gridX, gridY - 90);
    }
    
    // Dice representation (t: 32 to 45)
    if (t >= 32 && t < 45) {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      this.drawIsometricCube(ctx, gridX, gridY, 80, 80, 80);
      
      // Draw a smaller highlighted cube inside
      ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      this.drawIsometricCube(ctx, gridX - 20, gridY + 10, 40, 40, 40, true);
      
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText("OLAP Operation: Dice (Sub-cube)", gridX, gridY - 90);
    }
    
    // Pivot representation rotating in space (t: 45 to 60)
    if (t >= 45) {
      const angle = (t - 45) * 5 * (Math.PI / 180); // rotation factor
      
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText("OLAP Operation: Pivot (Rotate Axes)", gridX, gridY - 90);
      
      // Rotate drawing
      ctx.save();
      ctx.translate(gridX, gridY);
      ctx.rotate(angle);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(-40, -40, 80, 80);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(-40, -40, 80, 80);
      ctx.restore();
    }
  }
  
  // HELPER VECTOR GEOMETRY FUNCTIONS
  
  drawCylinder(ctx, x, y, radius, height, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    
    // Draw bottom ellipse
    ctx.beginPath();
    ctx.ellipse(x, y + height / 2, radius, radius / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw body
    ctx.beginPath();
    ctx.moveTo(x - radius, y - height / 2);
    ctx.lineTo(x - radius, y + height / 2);
    ctx.moveTo(x + radius, y - height / 2);
    ctx.lineTo(x + radius, y + height / 2);
    ctx.stroke();
    
    // Draw top ellipse
    ctx.beginPath();
    ctx.ellipse(x, y - height / 2, radius, radius / 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    
    // Write label
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y);
  }
  
  drawCentroidStar(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.rect(x - 6, y - 6, 12, 12);
    ctx.fill();
    ctx.stroke();
  }
  
  drawIsometricCube(ctx, x, y, dx, dy, dz, fillOnly = false) {
    // Front-Right face
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y - dx / 2);
    ctx.lineTo(x + dx, y - dx / 2 + dz);
    ctx.lineTo(x, y + dz);
    ctx.closePath();
    if (fillOnly) ctx.fill(); else ctx.stroke();
    
    // Front-Left face
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - dy, y - dy / 2);
    ctx.lineTo(x - dy, y - dy / 2 + dz);
    ctx.lineTo(x, y + dz);
    ctx.closePath();
    if (fillOnly) ctx.fill(); else ctx.stroke();
    
    // Top face
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y - dx / 2);
    ctx.lineTo(x + dx - dy, y - dx / 2 - dy / 2);
    ctx.lineTo(x - dy, y - dy / 2);
    ctx.closePath();
    if (fillOnly) ctx.fill(); else ctx.stroke();
  }
}
