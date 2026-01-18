// Games folder - shows all games in a folder window
Apps.register({
  id: 'games-folder',
  name: 'Games',
  icon: '🎮',
  description: 'Games folder',
  category: '',
  launch() {
    const id = 'games-folder-' + Date.now();
    const games = Apps.listByCategory('games');

    const content = `
      <div style="display:flex; flex-direction:column; height:100%; gap:12px; padding:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:1.1rem; font-weight:600; color:var(--text);">Games</div>
          <button id="btn-view-toggle" title="Toggle View" style="background:var(--panel-2); border:none; border-radius:6px; padding:6px 12px; cursor:pointer; color:var(--text);">☰</button>
        </div>
        <div id="games-list" style="overflow-y:auto; flex:1;"></div>
      </div>
    `;

    const win = WindowManager.makeWindow({
      id,
      title: 'Games',
      content,
      width: 500,
      height: 400
    });

    let viewMode = 'grid';

    function getViewModeStorage() {
      try {
        const stored = localStorage.getItem('webos.games.viewMode.v1');
        return stored || 'grid';
      } catch {
        return 'grid';
      }
    }

    function saveViewModeStorage(mode) {
      try {
        localStorage.setItem('webos.games.viewMode.v1', mode);
      } catch (e) {
        console.error('Failed to save view mode:', e);
      }
    }

    function updateViewToggleButton() {
      const btn = win.querySelector('#btn-view-toggle');
      if (btn) {
        btn.textContent = viewMode === 'grid' ? '🔲' : '☰';
      }
    }

    function render() {
      viewMode = getViewModeStorage();
      updateViewToggleButton();

      const listDiv = win.querySelector('#games-list');

      if (viewMode === 'grid') {
        listDiv.className = 'games-grid';
        listDiv.innerHTML = games.map(game => `
          <button class="games-item games-grid-item" data-app-id="${game.id}" style="
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:8px;
            padding:12px;
            background:var(--panel-2);
            border:none;
            border-radius:8px;
            cursor:pointer;
            transition: background 0.2s ease;
            min-height: 110px;
          ">
            <div style="font-size:2rem;">${game.icon || '🟦'}</div>
            <div style="font-size:0.85rem; color:var(--text); text-align:center; line-height:1.3;">${game.name}</div>
          </button>
        `).join('');
      } else {
        listDiv.className = 'games-list';
        listDiv.innerHTML = games.map(game => `
          <button class="games-item games-list-item" data-app-id="${game.id}" style="
            display:flex;
            gap:12px;
            align-items:center;
            padding:10px;
            background:var(--panel-2);
            border:none;
            border-radius:6px;
            cursor:pointer;
            transition: background 0.2s ease;
            width:100%;
            text-align:left;
          ">
            <div style="font-size:1.5rem;">${game.icon || '🟦'}</div>
            <div style="flex:1; font-size:0.95rem; color:var(--text);">${game.name}</div>
            <div style="font-size:0.85rem; color:var(--muted);">${game.description || ''}</div>
          </button>
        `).join('');
      }

      listDiv.querySelectorAll('.games-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const appId = btn.dataset.appId;
          if (appId) {
            Apps.open(appId);
            WindowManager.closeWindow(id);
          }
        });
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'var(--accent)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'var(--panel-2)';
        });
      });
    }

    win.querySelector('#btn-view-toggle').addEventListener('click', () => {
      viewMode = viewMode === 'grid' ? 'list' : 'grid';
      saveViewModeStorage(viewMode);
      render();
    });

    render();
    Bus.emit('app:opened', { id, title: 'Games', icon: '🎮' });
  }
});
