// DataMineX - Central Practical Lab Hub Component
// Hands-on experiments with datasets for Data Warehousing & Data Mining

import { SchemaGenerator } from './schemaGenerator.js';
import { DataExplorationDemo } from './miningDemos.js';

export class PracticalLabHub {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.activeSubject = 'warehouse'; // 'warehouse' | 'mining'
    this.activeLab = 'schema'; // 'schema' | 'etl' | 'olap' | 'mining_eda' | 'csv_prep'
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  render() {
    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800; color: #10b981; display: flex; align-items: center; gap: 10px;">
              <i data-lucide="flask-conical" style="width: 26px; height: 26px;"></i>
              <span>DataMineX Practical Lab Hub</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Hands-on interactive experiments with datasets, schemas, ETL pipelines, and preprocessing pipelines
            </p>
          </div>

          <div style="display: flex; gap: 8px; background: var(--bg-tertiary); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color);">
            <button id="btn-lab-wh" class="btn-tab ${this.activeSubject === 'warehouse' ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              🏢 Data Warehousing Labs
            </button>
            <button id="btn-lab-dm" class="btn-tab ${this.activeSubject === 'mining' ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
              ⛏ Data Mining Labs
            </button>
          </div>
        </div>

        <!-- Subject Lab Selection Grid -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 6px;">
          ${this.activeSubject === 'warehouse' ? `
            <button class="lab-select-btn ${this.activeLab === 'schema' ? 'active' : ''}" data-lab="schema" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; background: ${this.activeLab === 'schema' ? '#10b981' : 'var(--bg-secondary)'}; color: ${this.activeLab === 'schema' ? '#000' : 'var(--text-secondary)'};">
              1. Schema Generator (Star/Snowflake)
            </button>
            <button class="lab-select-btn ${this.activeLab === 'etl' ? 'active' : ''}" data-lab="etl" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; background: ${this.activeLab === 'etl' ? '#10b981' : 'var(--bg-secondary)'}; color: ${this.activeLab === 'etl' ? '#000' : 'var(--text-secondary)'};">
              2. ETL Staging &amp; Cleaning
            </button>
            <button class="lab-select-btn ${this.activeLab === 'olap' ? 'active' : ''}" data-lab="olap" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; background: ${this.activeLab === 'olap' ? '#10b981' : 'var(--bg-secondary)'}; color: ${this.activeLab === 'olap' ? '#000' : 'var(--text-secondary)'};">
              3. OLAP Data Cube Operations
            </button>
          ` : `
            <button class="lab-select-btn ${this.activeLab === 'mining_eda' ? 'active' : ''}" data-lab="mining_eda" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; background: ${this.activeLab === 'mining_eda' ? '#10b981' : 'var(--bg-secondary)'}; color: ${this.activeLab === 'mining_eda' ? '#000' : 'var(--text-secondary)'};">
              1. Visual Data Exploration (EDA)
            </button>
            <button class="lab-select-btn ${this.activeLab === 'csv_prep' ? 'active' : ''}" data-lab="csv_prep" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; background: ${this.activeLab === 'csv_prep' ? '#10b981' : 'var(--bg-secondary)'}; color: ${this.activeLab === 'csv_prep' ? '#000' : 'var(--text-secondary)'};">
              2. CSV Preprocessing &amp; Normalization
            </button>
          `}
        </div>

        <!-- Practical Stage Container -->
        <div id="lab-stage-container" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
          <!-- Experiment mounted here -->
        </div>
      </div>
    `;

    // Bind subject switch
    this.mount.querySelector('#btn-lab-wh').addEventListener('click', () => {
      this.activeSubject = 'warehouse';
      this.activeLab = 'schema';
      this.render();
    });

    this.mount.querySelector('#btn-lab-dm').addEventListener('click', () => {
      this.activeSubject = 'mining';
      this.activeLab = 'mining_eda';
      this.render();
    });

    this.mount.querySelectorAll('.lab-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeLab = e.currentTarget.getAttribute('data-lab');
        this.render();
      });
    });

    this.mountExperiment();

    if (window.lucide) window.lucide.createIcons();
  }

  mountExperiment() {
    const stage = this.mount.querySelector('#lab-stage-container');
    if (!stage) return;

    if (this.activeLab === 'schema') {
      new SchemaGenerator('#lab-stage-container');
    } else if (this.activeLab === 'mining_eda') {
      new DataExplorationDemo('#lab-stage-container');
    } else if (this.activeLab === 'etl') {
      stage.innerHTML = `
        <div style="font-family: monospace; font-size: 12px; space-y-4;">
          <h3 style="color: #10b981; font-size: 15px; margin-bottom: 8px;">ETL Data Staging Experiment</h3>
          <p style="color: var(--text-secondary);">Raw Stream: [TX1: "ALICE", "NYC", "$1200"], [TX2: "BOB", "chicago", "$800"], [TX3: NULL, "LA", NULL]</p>
          <div style="padding: 12px; background: var(--bg-tertiary); border-radius: 8px; margin-top: 10px;">
            <div style="color: #38bdf8;">1. Filter Missing / Null Amounts &rarr; Dropped TX3</div>
            <div style="color: #10b981;">2. Standardize City Names &rarr; "NYC" &rarr; "New York", "chicago" &rarr; "Chicago"</div>
            <div style="color: #f59e0b;">3. Generate Surrogate Keys &rarr; CUST_SK_01, CUST_SK_02</div>
          </div>
        </div>
      `;
    } else if (this.activeLab === 'olap') {
      stage.innerHTML = `
        <div style="font-size: 12px; space-y-4;">
          <h3 style="color: #10b981; font-size: 15px; margin-bottom: 8px;">OLAP Cube Exploration Experiment</h3>
          <p style="color: var(--text-secondary);">Multidimensional array index: [Quarter x City x Product]. Try Slicing at Quarter=Q1 or Drilling Down into monthly sub-cubes.</p>
        </div>
      `;
    } else {
      stage.innerHTML = `
        <div style="font-size: 12px;">
          <h3 style="color: #10b981; font-size: 15px; margin-bottom: 8px;">CSV Preprocessing &amp; Feature Cleaning</h3>
          <p style="color: var(--text-secondary);">Upload any CSV file to calculate mean imputation, min-max scaling, and outlier fences.</p>
        </div>
      `;
    }
  }
}
