// DataMineX - My Notes & Saved Formulas Component

export class NotesManager {
  constructor(mountSelector) {
    this.mount = document.querySelector(mountSelector);
    this.notes = JSON.parse(localStorage.getItem('dataminex_student_notes') || '[]');
    this.activeTab = 'all'; // 'all' | 'formulas' | 'solutions' | 'custom'
    this.init();
  }

  init() {
    if (!this.mount) return;
    this.render();
  }

  saveNotes() {
    localStorage.setItem('dataminex_student_notes', JSON.stringify(this.notes));
  }

  addNote(title, category, content) {
    const newNote = {
      id: Date.now(),
      title,
      category: category || 'General',
      content,
      createdAt: new Date().toLocaleDateString()
    };
    this.notes.unshift(newNote);
    this.saveNotes();
    this.render();
  }

  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveNotes();
    this.render();
  }

  render() {
    const filteredNotes = this.activeTab === 'all' 
      ? this.notes 
      : this.notes.filter(n => n.category.toLowerCase().includes(this.activeTab));

    this.mount.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800; color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
              <i data-lucide="book-marked" style="width: 26px; height: 26px;"></i>
              <span>My Notes &amp; Saved Formulas</span>
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Save personal study notes, bookmark important algorithm formulas, and review numerical derivations
            </p>
          </div>

          <button id="btn-open-add-note" style="padding: 10px 18px; background: #3b82f6; color: #fff; font-weight: 700; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
            <span>Add New Note</span>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
          ${[
            { id: 'all', label: 'All Saved Notes' },
            { id: 'formula', label: 'Formulas & Equations' },
            { id: 'solution', label: 'Saved Solutions' },
            { id: 'custom', label: 'Personal Notes' }
          ].map(tab => `
            <button class="notes-tab-btn ${this.activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); background: ${this.activeTab === tab.id ? '#3b82f6' : 'var(--bg-secondary)'}; color: ${this.activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)'}; cursor: pointer;">
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Add Note Modal Form (Hidden by Default) -->
        <div id="add-note-modal" style="display: none; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 15px; font-weight: 800; color: var(--text-primary); margin-bottom: 14px;">Create New Study Note</h3>
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 12px;">
            <input type="text" id="note-title-input" placeholder="Note Title (e.g., K-Means Distance Formula)" style="padding: 10px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px;">
            <select id="note-category-select" style="padding: 10px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px;">
              <option value="Formula">Formula &amp; Equation</option>
              <option value="Solution">Saved Numerical Solution</option>
              <option value="Personal">Personal Note</option>
            </select>
          </div>
          <textarea id="note-content-input" rows="5" placeholder="Write your detailed note or formula explanation here..." style="width: 100%; padding: 12px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical; margin-bottom: 14px;"></textarea>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="btn-cancel-note" style="padding: 8px 16px; background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; font-size: 12px;">Cancel</button>
            <button id="btn-save-note" style="padding: 8px 18px; background: #10b981; color: #000; font-weight: bold; border-radius: 6px; border: none; cursor: pointer; font-size: 12px;">Save Note</button>
          </div>
        </div>

        <!-- Notes Grid -->
        {filteredNotes.length > 0 ? (
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;">
            ${filteredNotes.map(n => `
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 10px; font-weight: bold; uppercase; padding: 3px 8px; border-radius: 4px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);">
                      ${n.category}
                    </span>
                    <span style="font-size: 11px; color: var(--text-secondary);">${n.createdAt}</span>
                  </div>
                  <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">${n.title}</h4>
                  <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; font-family: ${n.category === 'Formula' ? 'monospace' : 'inherit'};">
                    ${n.content}
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 14px; pt-2; border-top: 1px solid var(--border-color);">
                  <button class="btn-delete-note" data-id="${n.id}" style="background: none; border: none; color: #f43f5e; font-size: 11px; font-weight: bold; cursor: pointer;">
                    Delete Note
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ) : (
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 40px; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 10px;">📝</div>
            <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">No Saved Notes Yet</h3>
            <p style="font-size: 12px; color: var(--text-secondary); max-width: 450px; margin: 0 auto 16px;">
              Click "Add New Note" above to write down formulas, save numerical solution summaries, or keep track of exam revision points.
            </p>
          </div>
        )}
      </div>
    `;

    // Bind events
    this.mount.querySelectorAll('.notes-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.getAttribute('data-tab');
        this.render();
      });
    });

    const modal = this.mount.querySelector('#add-note-modal');
    const openBtn = this.mount.querySelector('#btn-open-add-note');
    const cancelBtn = this.mount.querySelector('#btn-cancel-note');
    const saveBtn = this.mount.querySelector('#btn-save-note');

    if (openBtn) openBtn.addEventListener('click', () => { modal.style.display = 'block'; });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { modal.style.display = 'none'; });

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const title = this.mount.querySelector('#note-title-input').value.trim();
        const category = this.mount.querySelector('#note-category-select').value;
        const content = this.mount.querySelector('#note-content-input').value.trim();
        if (title && content) {
          this.addNote(title, category, content);
        }
      });
    }

    this.mount.querySelectorAll('.btn-delete-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        this.deleteNote(id);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }
}
