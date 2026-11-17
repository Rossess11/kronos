/**
 * KRONOS - APLICACIÓN PRINCIPAL & CONTROLADOR UI
 * Control de navegación unificada, reloj, turnos con iconos SVG, modales y estado online.
 */

class App {
  constructor() {
    this.currentView = 'inventory';
    this.uploadedPhotoData = '';
  }

  init() {
    this.startClockAndShiftTracker();
    this.bindNavigation();
    this.bindForms();
    this.bindModals();
    this.updateDbStatusChip();
    this.updateDashboardStats();
    this.renderUsersList();
    this.updateOnlineCount();

    if (window.warehouseMapViewer) window.warehouseMapViewer.init();
    if (window.inventoryManager) window.inventoryManager.init();
    if (window.checkoutsManager) window.checkoutsManager.init();
    if (window.auditManager) window.auditManager.init();

    if (window.authService) {
      if (window.authService.isAuthenticated()) {
        window.authService.updateUserUI();
      } else {
        window.authService.showLoginScreen();
      }
    }
  }

  // --- RELOJ Y CÁLCULO DE TURNOS CON ICONOS SVG ---
  startClockAndShiftTracker() {
    const clockElem = document.getElementById('live-clock-text');
    const shiftPill = document.getElementById('topbar-shift-badge');
    const shiftText = document.getElementById('shift-text-span');
    const shiftIcon = document.getElementById('shift-icon-svg');

    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');

      if (clockElem) {
        clockElem.textContent = `${String(hours).padStart(2, '0')}:${mins}:${secs}`;
      }

      if (shiftPill && shiftText && shiftIcon) {
        if (hours >= 8 && hours < 15) {
          shiftPill.className = 'sb-shift-pill morning';
          shiftText.textContent = 'Turno Mañana (08h - 15h)';
          // Icono Sol SVG
          shiftIcon.innerHTML = `
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          `;
        } else if (hours >= 15 && hours < 22) {
          shiftPill.className = 'sb-shift-pill afternoon';
          shiftText.textContent = 'Turno Tarde (15h - 22h)';
          // Icono Sol de tarde / atardecer SVG
          shiftIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          `;
        } else {
          shiftPill.className = 'sb-shift-pill night';
          shiftText.textContent = 'Turno Noche / Guardia';
          // Icono Luna SVG (estilo FontAwesome / Lucide)
          shiftIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          `;
        }
      }
    };

    update();
    setInterval(update, 1000);
  }

  // --- LÓGICA DE USUARIOS ONLINE ---
  updateOnlineCount() {
    const onlineText = document.getElementById('online-users-count-text');
    if (onlineText) {
      // 1 usuario activo actualmente
      onlineText.textContent = '1 en línea';
    }
  }

  // --- NAVEGACIÓN UNIFICADA Y MENÚ DESPLEGABLE ---
  isDrawerViewport() {
    return window.innerWidth <= 1180;
  }

  closeSidebarDrawer() {
    const sidebar = document.getElementById('sb-main-sidebar');
    const backdrop = document.getElementById('sb-sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sb-main-sidebar');
    const backdrop = document.getElementById('sb-sidebar-backdrop');
    if (!sidebar) return;

    if (this.isDrawerViewport()) {
      const willOpen = !sidebar.classList.contains('open');
      sidebar.classList.toggle('open', willOpen);
      if (backdrop) backdrop.classList.toggle('active', willOpen);
    } else {
      const willCollapse = !sidebar.classList.contains('collapsed');
      sidebar.classList.toggle('collapsed', willCollapse);
      localStorage.setItem('kronos_sidebar_collapsed', willCollapse ? '1' : '0');
    }
  }

  bindNavigation() {
    const sidebar = document.getElementById('sb-main-sidebar');
    const backdrop = document.getElementById('sb-sidebar-backdrop');
    const mobileBtn = document.getElementById('sb-mobile-btn');
    const collapseBtn = document.getElementById('sb-sidebar-collapse-btn');

    // Restaurar estado colapsado guardado en escritorio
    if (sidebar && !this.isDrawerViewport() && localStorage.getItem('kronos_sidebar_collapsed') === '1') {
      sidebar.classList.add('collapsed');
    }

    // 1. Enlaces del menú lateral único
    document.querySelectorAll('.sb-nav-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) {
          this.switchView(view);
          if (this.isDrawerViewport()) {
            this.closeSidebarDrawer();
          }
        }
      });
    });

    // 2. Botón Configuración Base de Datos
    const settingsLink = document.getElementById('nav-item-settings');
    if (settingsLink) {
      settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.isDrawerViewport()) {
          this.closeSidebarDrawer();
        }
        this.openModal('supabase-settings-modal');
      });
    }

    // 3. Botón Connect en la barra superior
    const connectBtn = document.getElementById('btn-connect-modal');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        this.openModal('supabase-settings-modal');
      });
    }

    // 4. Botones para desplegar / colapsar menú lateral (PC, Tablet y Móvil)
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        if (this.isDrawerViewport()) {
          this.closeSidebarDrawer();
        } else if (sidebar) {
          sidebar.classList.add('collapsed');
          localStorage.setItem('kronos_sidebar_collapsed', '1');
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.closeSidebarDrawer();
      });
    }

    window.addEventListener('resize', () => {
      if (!this.isDrawerViewport()) {
        this.closeSidebarDrawer();
      }
    });

    // 5. Botón Cerrar Sesión
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('¿Deseas cerrar tu sesión en KRONOS?')) {
          window.authService.logout();
        }
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Actualizar elemento activo en la barra lateral única
    document.querySelectorAll('.sb-nav-link[data-view]').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Mostrar panel activo y ocultar el resto
    document.querySelectorAll('.view-panel-container').forEach(panel => {
      const isTarget = panel.id === `view-${viewName}`;
      if (isTarget) {
        panel.style.display = (viewName === 'inventory' || viewName === 'checkouts' || viewName === 'audit' || viewName === 'teachers') ? 'flex' : 'block';
      } else {
        panel.style.display = 'none';
      }
    });

    // Título de la pestaña superior
    const tabTitle = document.getElementById('tab-table-name');
    const tableMap = {
      inventory: 'public.items',
      checkouts: 'public.checkouts',
      audit: 'public.audit_logs',
      teachers: 'public.profiles',
      warehouse: 'public.warehouses_map',
      dashboard: 'public.dashboard_stats',
      'add-item': 'public.items (Añadir)'
    };

    if (tabTitle) tabTitle.textContent = tableMap[viewName] || `public.${viewName}`;

    // Refrescar vistas
    if (viewName === 'inventory' && window.inventoryManager) {
      window.inventoryManager.renderTable();
    } else if (viewName === 'checkouts' && window.checkoutsManager) {
      window.checkoutsManager.renderActiveCheckoutsTable();
    } else if (viewName === 'audit' && window.auditManager) {
      window.auditManager.renderLogs();
    } else if (viewName === 'warehouse' && window.warehouseMapViewer) {
      window.warehouseMapViewer.renderWarehouseView(window.warehouseMapViewer.currentWarehouseId);
    } else if (viewName === 'dashboard') {
      this.updateDashboardStats();
    } else if (viewName === 'teachers') {
      this.renderUsersList();
    } else if (viewName === 'add-item') {
      const whSelect = document.getElementById('item-warehouse');
      const shelfSelect = document.getElementById('item-shelf');
      if (whSelect && shelfSelect && shelfSelect.options.length === 0) {
        this.populateSectionDropdown(whSelect.value);
      }
    }
  }

  populateSectionDropdown(warehouseId, preselectSection = null) {
    const shelfSelect = document.getElementById('item-shelf');
    if (!shelfSelect || !window.store) return;

    const wh = window.store.warehouses.find(w => w.id === warehouseId || (w.altIds && w.altIds.includes(warehouseId)));
    shelfSelect.innerHTML = '';

    if (wh && wh.zones && wh.zones.length > 0) {
      const sectors = {};
      wh.zones.forEach(z => {
        const sec = z.sector || 'Secciones';
        if (!sectors[sec]) sectors[sec] = [];
        sectors[sec].push(z);
      });

      Object.keys(sectors).forEach(secName => {
        const group = document.createElement('optgroup');
        group.label = secName;
        sectors[secName].forEach(z => {
          const opt = document.createElement('option');
          opt.value = z.id;
          opt.textContent = z.name !== z.id ? `${z.id} — ${z.name}` : z.id;
          group.appendChild(opt);
        });
        shelfSelect.appendChild(group);
      });
    } else {
      const opt = document.createElement('option');
      opt.value = 'General';
      opt.textContent = 'Sección General';
      shelfSelect.appendChild(opt);
    }

    if (preselectSection) {
      shelfSelect.value = preselectSection;
    }
  }

  updateDashboardStats() {
    const stats = window.store.getStats();

    const elTotal = document.getElementById('stat-total-items');
    const elAvailable = document.getElementById('stat-available-items');
    const elTaken = document.getElementById('stat-taken-items');
    const elLost = document.getElementById('stat-lost-items');

    if (elTotal) elTotal.textContent = stats.total;
    if (elAvailable) elAvailable.textContent = stats.available;
    if (elTaken) elTaken.textContent = stats.taken;
    if (elLost) elLost.textContent = stats.lost + stats.maintenance;

    // Mini almacenes en Dashboard
    const whQuickGrid = document.getElementById('dashboard-wh-quick-grid');
    if (whQuickGrid) {
      whQuickGrid.innerHTML = '';
      window.store.warehouses.forEach(wh => {
        const count = window.store.items.filter(it => it.warehouse_id === wh.id || (wh.altIds && wh.altIds.includes(it.warehouse_id))).length;
        const takenCount = window.store.items.filter(it => (it.warehouse_id === wh.id || (wh.altIds && wh.altIds.includes(it.warehouse_id))) && it.status === 'sacado').length;

        const card = document.createElement('div');
        card.style.cssText = 'background:var(--sb-bg-canvas); border:1px solid var(--sb-border-subtle); border-radius:4px; padding:8px 10px; cursor:pointer;';
        card.innerHTML = `
          <div style="font-weight:600; font-size:12px; color:var(--sb-text-main);">${wh.name}</div>
          <div style="font-family:var(--sb-font-mono); font-size:16px; font-weight:700; color:var(--sb-green); margin:2px 0;">${count}</div>
          <div style="font-size:10px; color:${takenCount > 0 ? 'var(--sb-amber)' : 'var(--sb-text-dim)'};">${takenCount > 0 ? `${takenCount} sacado(s)` : 'en orden'}</div>
        `;
        card.addEventListener('click', () => {
          this.switchView('warehouse');
          if (window.warehouseMapViewer) window.warehouseMapViewer.selectWarehouse(wh.id);
        });
        whQuickGrid.appendChild(card);
      });
    }

    // Logs recientes en Dashboard
    const recentLogsContainer = document.getElementById('dashboard-recent-logs');
    if (recentLogsContainer) {
      const recentLogs = window.store.getAuditLogs(4);
      recentLogsContainer.innerHTML = '';
      recentLogs.forEach(log => {
        const div = document.createElement('div');
        div.style.cssText = 'font-size:11.5px; border-bottom:1px solid var(--sb-border-subtle); padding-bottom:4px;';
        div.innerHTML = `
          <span style="font-family:var(--sb-font-mono); color:var(--sb-green); font-size:10.5px;">${log.action}</span> &bull; 
          <span style="color:var(--sb-text-main); font-weight:500;">${log.item_name}</span>
          <div style="color:var(--sb-text-dim); font-size:10.5px;">${log.user_name} &bull; ${log.created_at}</div>
        `;
        recentLogsContainer.appendChild(div);
      });
    }
  }

  bindForms() {
    // Formulario de Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        const res = window.authService.login(email, pass);
        if (res.success) {
          this.showToast(`Bienvenido/a, ${res.user.full_name}`, 'success');
          this.switchView('inventory');
        } else {
          alert(res.message);
        }
      });
    }

    // Formulario de Alta de Material
    const addItemForm = document.getElementById('add-item-form');
    const itemWhSelect = document.getElementById('item-warehouse');
    const photoInput = document.getElementById('item-photo-file');
    const photoPreviewImg = document.getElementById('item-photo-preview-img');
    const photoPlaceholder = document.getElementById('item-photo-placeholder');

    if (itemWhSelect) {
      this.populateSectionDropdown(itemWhSelect.value);
      itemWhSelect.addEventListener('change', (e) => {
        this.populateSectionDropdown(e.target.value);
      });
    }

    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            this.uploadedPhotoData = re.target.result;
            if (photoPreviewImg) {
              photoPreviewImg.src = this.uploadedPhotoData;
              photoPreviewImg.style.display = 'block';
            }
            if (photoPlaceholder) photoPlaceholder.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (addItemForm) {
      addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const warehouse_id = document.getElementById('item-warehouse').value;
        const shelf = document.getElementById('item-shelf').value;
        const serial = document.getElementById('item-serial').value;
        const supplier = document.getElementById('item-supplier').value;
        const mfg_date = document.getElementById('item-mfg-date').value;
        const doc_url = document.getElementById('item-doc-url').value;
        const observations = document.getElementById('item-observations').value;

        const prefix = warehouse_id === 'garaje' || warehouse_id === 'truck' ? 'BUP' : warehouse_id.replace('alm-', '').slice(0, 4).toUpperCase();
        const randNum = Math.floor(100 + Math.random() * 900);
        const cleanSec = shelf.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
        const code = `${prefix}-${cleanSec}-${randNum}`;

        const newItem = window.store.addItem({
          code,
          name,
          category,
          warehouse_id,
          location_shelf: shelf,
          serial_number: serial,
          supplier,
          mfg_date,
          doc_url,
          observations,
          photo_url: this.uploadedPhotoData
        });

        this.showToast(`Material registrado correctamente (${newItem.code})`, 'success');
        addItemForm.reset();
        if (itemWhSelect) this.populateSectionDropdown(itemWhSelect.value);
        this.uploadedPhotoData = '';
        if (photoPreviewImg) photoPreviewImg.style.display = 'none';
        if (photoPlaceholder) photoPlaceholder.style.display = 'block';

        this.switchView('inventory');
      });
    }

    // Formulario de Alta de Profesor
    const addTeacherForm = document.getElementById('add-teacher-form');
    if (addTeacherForm) {
      addTeacherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('teacher-email').value;
        const fullName = document.getElementById('teacher-name').value;
        const dept = document.getElementById('teacher-dept').value;
        const pass = document.getElementById('teacher-password').value;

        const res = window.store.addUser({
          email,
          full_name: fullName,
          department: dept,
          password: pass,
          role: 'profesor'
        });

        if (res.success) {
          this.showToast(`Profesor dado de alta con éxito: ${fullName}`, 'success');
          addTeacherForm.reset();
          this.closeModal('add-teacher-modal');
          this.renderUsersList();
        } else {
          alert(res.message);
        }
      });
    }

    // Formulario de Conexión Supabase
    const supabaseForm = document.getElementById('supabase-config-form');
    if (supabaseForm) {
      const urlInput = document.getElementById('supabase-url-input');
      const keyInput = document.getElementById('supabase-key-input');

      if (urlInput) urlInput.value = window.supabaseService.url;
      if (keyInput) keyInput.value = window.supabaseService.anonKey;

      supabaseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value;
        const key = keyInput.value;

        const test = await window.supabaseService.testConnection(url, key);
        if (test.success) {
          window.supabaseService.saveCredentials(url, key);
          this.showToast('¡Conectado a la base de datos Supabase con éxito!', 'success');
          this.updateDbStatusChip();
          this.closeModal('supabase-settings-modal');
        } else {
          alert(`Error de conexión a Supabase: ${test.message}`);
        }
      });

      const btnTestSupabase = document.getElementById('btn-test-supabase');
      if (btnTestSupabase) {
        btnTestSupabase.addEventListener('click', async () => {
          btnTestSupabase.textContent = 'Verificando...';
          const test = await window.supabaseService.testConnection(urlInput.value, keyInput.value);
          btnTestSupabase.textContent = 'Probar Conexión';
          alert(test.message);
        });
      }

      const btnLocalMode = document.getElementById('btn-use-local-mode');
      if (btnLocalMode) {
        btnLocalMode.addEventListener('click', () => {
          window.supabaseService.switchToLocalMode();
          this.showToast('Activado Modo Local Demo', 'warning');
          this.updateDbStatusChip();
          this.closeModal('supabase-settings-modal');
        });
      }
    }
  }

  updateDbStatusChip() {
    const label = document.getElementById('topbar-connect-label');
    const connectBtn = document.getElementById('btn-connect-modal');
    if (!label) return;

    if (window.supabaseService && window.supabaseService.isOnline()) {
      label.textContent = 'Supabase Conectado';
      if (connectBtn) {
        connectBtn.style.color = 'var(--sb-green)';
        connectBtn.style.borderColor = 'rgba(62, 207, 142, 0.4)';
      }
    } else {
      label.textContent = 'Modo Local';
      if (connectBtn) {
        connectBtn.style.color = '#fbbf24';
        connectBtn.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      }
    }
  }

  renderUsersList() {
    const listBody = document.getElementById('teachers-table-body');
    if (!listBody) return;

    listBody.innerHTML = '';
    window.store.users.forEach(u => {
      const tr = document.createElement('tr');
      const idFormatted = `usr-042-${u.id.slice(4, 10)}`;

      tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-text-muted);">${idFormatted}</td>
        <td style="font-family:var(--sb-font-mono); font-size:12px; color:var(--sb-green);">${u.email}</td>
        <td style="font-weight:500;">${u.full_name}</td>
        <td><span class="sb-badge ${u.role === 'admin' ? 'disponible' : 'mantenimiento'}">${u.role === 'admin' ? 'administrador' : 'profesor'}</span></td>
        <td style="color:var(--sb-text-muted);">${u.department || 'Emergencias'}</td>
        <td>
          ${u.role !== 'admin' ? `
            <button class="sb-btn sb-btn-danger-subtle btn-del-user" style="padding:2px 6px; font-size:11px;" data-id="${u.id}">
              Eliminar
            </button>
          ` : '<span style="font-size:11px; color:var(--sb-text-dim);">Admin Principal</span>'}
        </td>
      `;

      const delBtn = tr.querySelector('.btn-del-user');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (confirm(`¿Eliminar la cuenta del profesor "${u.full_name}"?`)) {
            window.store.deleteUser(u.id);
            this.showToast('Cuenta eliminada', 'warning');
            this.renderUsersList();
          }
        });
      }

      listBody.appendChild(tr);
    });
  }

  bindModals() {
    document.querySelectorAll('.sb-modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.sb-modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  showToast(message, type = 'success') {
    let container = document.getElementById('sb-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sb-toast-container';
      container.className = 'sb-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `sb-toast ${type}`;
    toast.innerHTML = `
      <span style="font-family:var(--sb-font-mono); color:${type === 'success' ? 'var(--sb-green)' : type === 'warning' ? 'var(--sb-amber)' : 'var(--sb-red)'};">&#10003;</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      toast.style.transition = 'all 0.15s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3500);
  }
}

window.app = new App();

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
