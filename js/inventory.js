/**
 * KRONOS - INVENTARIO GENERAL (TABLA FORMATO SUPABASE TABLE EDITOR)
 * Selección múltiple con checkbox, botón dinámico en verde fuerte para sacar selección,
 * y selección masiva con botón "Seleccionar Todos".
 */

class InventoryManager {
  constructor() {
    this.currentFilters = {
      search: '',
      warehouse: 'all',
      status: 'all'
    };
    this.selectedItemIds = new Set();
    this.selectedItemForModal = null;
  }

  init() {
    this.bindFilters();
    this.bindSelectionControls();
    this.renderTable();
  }

  bindFilters() {
    const searchInput = document.getElementById('inv-search-input');
    const whFilter = document.getElementById('inv-wh-filter');
    const statusFilter = document.getElementById('inv-status-filter');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilters.search = e.target.value;
        this.renderTable();
      });
    }

    if (whFilter) {
      whFilter.addEventListener('change', (e) => {
        this.currentFilters.warehouse = e.target.value;
        this.renderTable();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.currentFilters.status = e.target.value;
        this.renderTable();
      });
    }
  }

  bindSelectionControls() {
    // Botón "Seleccionar Todos"
    const btnSelectAll = document.getElementById('btn-select-all-inv');
    const thSelectAll = document.getElementById('th-select-all-inv');

    const toggleSelectAll = () => {
      const currentItems = window.store.getItems(this.currentFilters);
      if (currentItems.length === 0) return;

      const allSelected = currentItems.every(it => this.selectedItemIds.has(it.id));
      if (allSelected) {
        currentItems.forEach(it => this.selectedItemIds.delete(it.id));
      } else {
        currentItems.forEach(it => this.selectedItemIds.add(it.id));
      }

      this.updateSelectionUI();
    };

    if (btnSelectAll) btnSelectAll.addEventListener('click', toggleSelectAll);
    if (thSelectAll) thSelectAll.addEventListener('change', toggleSelectAll);

    // Botón "Sacar Materiales"
    const btnCheckout = document.getElementById('btn-checkout-selected');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', () => {
        if (this.selectedItemIds.size === 0) {
          alert('Selecciona al menos un material disponible para registrar su salida.');
          return;
        }
        // Filtrar solo los seleccionados que estén disponibles
        const selectedAvailable = Array.from(this.selectedItemIds).filter(id => {
          const it = window.store.getItemById(id);
          return it && it.status === 'disponible';
        });

        if (selectedAvailable.length === 0) {
          alert('Ninguno de los materiales seleccionados está en estado "disponible" para salir.');
          return;
        }

        this.openBulkCheckoutModal(selectedAvailable);
      });
    }

    // Dropdown de cambio de estado (Mantenimiento, Fuera de Mantenimiento, Extraviado)
    const statusDropdownToggle = document.getElementById('btn-status-dropdown-toggle');
    const statusDropdownMenu = document.getElementById('status-dropdown-menu');

    if (statusDropdownToggle && statusDropdownMenu) {
      statusDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = statusDropdownMenu.style.display === 'block';
        statusDropdownMenu.style.display = isShown ? 'none' : 'block';
      });

      document.addEventListener('click', (e) => {
        if (!statusDropdownToggle.contains(e.target) && !statusDropdownMenu.contains(e.target)) {
          statusDropdownMenu.style.display = 'none';
        }
      });
    }

    // Acción: Marcar en Mantenimiento (va a Material en Uso)
    const btnActionMaint = document.getElementById('btn-action-set-maintenance');
    if (btnActionMaint) {
      btnActionMaint.addEventListener('click', () => {
        if (statusDropdownMenu) statusDropdownMenu.style.display = 'none';
        if (this.selectedItemIds.size === 0) {
          alert('Selecciona al menos un material de la tabla para enviar a mantenimiento.');
          return;
        }

        const notes = prompt('Motivo o detalle del mantenimiento / revisión técnica:', 'Revisión técnica de seguridad');
        if (notes === null) return;

        const res = window.store.setItemsMaintenance(Array.from(this.selectedItemIds), notes || 'Revisión técnica');
        if (res.success) {
          this.selectedItemIds.clear();
          this.renderTable();
          if (window.checkoutsManager) window.checkoutsManager.renderActiveCheckoutsTable();
          if (window.app) window.app.updateDashboardStats();
        }
      });
    }

    // Acción: Fuera de Mantenimiento (Reincorporar disponible)
    const btnActionClearMaint = document.getElementById('btn-action-clear-maintenance');
    if (btnActionClearMaint) {
      btnActionClearMaint.addEventListener('click', () => {
        if (statusDropdownMenu) statusDropdownMenu.style.display = 'none';
        if (this.selectedItemIds.size === 0) {
          alert('Selecciona al menos un material en mantenimiento para reincorporar como disponible.');
          return;
        }

        const res = window.store.clearItemsMaintenance(Array.from(this.selectedItemIds));
        if (res.success) {
          this.selectedItemIds.clear();
          this.renderTable();
          if (window.checkoutsManager) window.checkoutsManager.renderActiveCheckoutsTable();
          if (window.app) window.app.updateDashboardStats();
        }
      });
    }

    // Acción: Marcar como Extraviado
    const btnActionLost = document.getElementById('btn-action-set-lost');
    if (btnActionLost) {
      btnActionLost.addEventListener('click', () => {
        if (statusDropdownMenu) statusDropdownMenu.style.display = 'none';
        if (this.selectedItemIds.size === 0) {
          alert('Selecciona al menos un material para declarar como extraviado.');
          return;
        }

        const reason = prompt('Motivo o circunstancias del extravío:', 'No localizado tras práctica');
        if (reason === null) return;

        const res = window.store.setItemsLost(Array.from(this.selectedItemIds), reason || 'No localizado');
        if (res.success) {
          this.selectedItemIds.clear();
          this.renderTable();
          if (window.checkoutsManager) window.checkoutsManager.renderActiveCheckoutsTable();
          if (window.app) window.app.updateDashboardStats();
        }
      });
    }

    // Acción: Borrar Selección (Solo Administrador)
    const btnDeleteSelected = document.getElementById('btn-delete-selected');
    if (btnDeleteSelected) {
      btnDeleteSelected.addEventListener('click', () => {
        if (this.selectedItemIds.size === 0) {
          alert('Selecciona al menos un material para eliminar.');
          return;
        }

        const count = this.selectedItemIds.size;
        if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente ${count} material(es) del inventario? Esta acción es irreversible.`)) {
          return;
        }

        const res = window.store.deleteMultipleItems(Array.from(this.selectedItemIds));
        if (res.success) {
          this.selectedItemIds.clear();
          this.renderTable();
          if (window.checkoutsManager) window.checkoutsManager.renderActiveCheckoutsTable();
          if (window.app) window.app.updateDashboardStats();
        }
      });
    }

    // Formulario de salida masiva
    const bulkForm = document.getElementById('bulk-checkout-form');
    if (bulkForm) {
      bulkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleBulkCheckoutSubmit();
      });
    }

    // Edición de Observaciones Técnicas en Ficha de Material
    const btnEditObs = document.getElementById('btn-edit-modal-observations');
    const btnCancelObs = document.getElementById('btn-cancel-modal-observations');
    const btnSaveObs = document.getElementById('btn-save-modal-observations');
    const obsReadEl = document.getElementById('modal-item-observations');
    const obsEditBox = document.getElementById('modal-observations-edit-box');
    const obsTextarea = document.getElementById('modal-observations-textarea');

    if (btnEditObs && obsReadEl && obsEditBox && obsTextarea) {
      btnEditObs.addEventListener('click', () => {
        if (!this.selectedItemForModal) return;
        obsTextarea.value = this.selectedItemForModal.observations || '';
        obsReadEl.style.display = 'none';
        btnEditObs.style.display = 'none';
        obsEditBox.style.display = 'block';
        obsTextarea.focus();
      });
    }

    if (btnCancelObs && obsReadEl && obsEditBox && btnEditObs) {
      btnCancelObs.addEventListener('click', () => {
        obsEditBox.style.display = 'none';
        obsReadEl.style.display = 'block';
        btnEditObs.style.display = 'inline-flex';
      });
    }

    if (btnSaveObs && obsTextarea && obsReadEl && obsEditBox && btnEditObs) {
      btnSaveObs.addEventListener('click', () => {
        if (!this.selectedItemForModal) return;
        const newObs = obsTextarea.value.trim();
        const updated = window.store.updateItem(this.selectedItemForModal.id, { observations: newObs });
        if (updated) {
          this.selectedItemForModal = updated;
          obsReadEl.textContent = newObs || 'Sin observaciones registradas.';
          obsEditBox.style.display = 'none';
          obsReadEl.style.display = 'block';
          btnEditObs.style.display = 'inline-flex';

          this.renderTable();
          if (window.auditManager && window.app && window.app.currentView === 'audit') {
            window.auditManager.renderLogs();
          }
          if (window.app) {
            window.app.showToast('Observaciones técnicas actualizadas correctamente', 'success');
          }
        }
      });
    }
  }

  updateSelectionUI() {
    const tableBody = document.getElementById('inv-table-body');
    const btnCheckout = document.getElementById('btn-checkout-selected');
    const thSelectAll = document.getElementById('th-select-all-inv');

    const currentItems = window.store.getItems(this.currentFilters);
    const availableSelected = Array.from(this.selectedItemIds).filter(id => {
      const it = window.store.getItemById(id);
      return it && it.status === 'disponible';
    });

    // Actualizar checkboxes de las filas
    if (tableBody) {
      tableBody.querySelectorAll('.row-checkbox').forEach(cb => {
        const id = cb.dataset.id;
        cb.checked = this.selectedItemIds.has(id);
      });
    }

    // Actualizar estado del botón "Sacar Materiales" (Solo activo si hay disponibles seleccionados)
    if (btnCheckout) {
      const count = availableSelected.length;
      if (count > 0) {
        btnCheckout.classList.add('active');
        btnCheckout.innerHTML = `
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          <span>Sacar Materiales (${count})</span>
        `;
      } else {
        btnCheckout.classList.remove('active');
        btnCheckout.innerHTML = `
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span>Sacar Materiales</span>
        `;
      }
    }

    if (thSelectAll && currentItems.length > 0) {
      thSelectAll.checked = currentItems.every(it => this.selectedItemIds.has(it.id));
    }
  }

  renderTable() {
    const tableBody = document.getElementById('inv-table-body');
    const countPill = document.getElementById('count-items-pill');
    if (!tableBody) return;

    const items = window.store.getItems(this.currentFilters);
    if (countPill) countPill.textContent = items.length;

    tableBody.innerHTML = '';

    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align:center; padding: 3rem; color: var(--sb-text-dim);">
            No se encontraron registros en public.items
          </td>
        </tr>
      `;
      this.updateSelectionUI();
      return;
    }

    items.forEach(item => {
      const tr = document.createElement('tr');
      if (item.status === 'extraviado') {
        tr.className = 'row-lost';
      } else if (item.status === 'sacado') {
        tr.className = 'row-taken';
      } else if (item.status === 'mantenimiento' || item.status === 'en_mantenimiento') {
        tr.className = 'row-maintenance';
      }

      const idFormatted = item.id.startsWith('item-') ? `a01b2c3d-e4f5-${item.id.slice(5, 9)}-9876-${item.id.slice(9, 18)}` : item.id;

      let statusBadge = '';
      if (item.status === 'disponible') {
        statusBadge = '<span class="sb-badge disponible">disponible</span>';
      } else if (item.status === 'sacado') {
        statusBadge = '<span class="sb-badge sacado">sacado</span>';
      } else if (item.status === 'extraviado') {
        statusBadge = '<span class="sb-badge extraviado">EXTRAVIADO</span>';
      } else if (item.status === 'mantenimiento' || item.status === 'en_mantenimiento') {
        statusBadge = '<span class="sb-badge mantenimiento">mantenimiento</span>';
      } else {
        statusBadge = `<span class="sb-badge">${item.status}</span>`;
      }

      const isChecked = this.selectedItemIds.has(item.id);

      tr.innerHTML = `
        <td>
          <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isChecked ? 'checked' : ''}>
        </td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-text-muted);">${idFormatted}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-green); font-weight:500;">${item.code}</td>
        <td style="font-weight:500; max-width:240px; overflow:hidden; text-overflow:ellipsis;" title="${item.name}">${item.name}</td>
        <td>${statusBadge}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px;">${item.warehouse_id}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-green);">${item.location_shelf}</td>
        <td style="color:var(--sb-text-muted);">${item.category}</td>
        <td style="color:var(--sb-text-muted);">${item.supplier || '<span class="sb-null">NULL</span>'}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; text-align:right;">${item.use_count || 0}</td>
        <td style="font-size:11.5px; max-width:160px; overflow:hidden; text-overflow:ellipsis;">
          ${item.current_borrower ? `<span style="color:#fbbf24;">${item.current_borrower.split('(')[0]}</span>` : '<span class="sb-null">NULL</span>'}
        </td>
        <td>
          <button class="sb-btn sb-btn-subtle btn-item-details" style="padding:2px 8px; font-size:11px; display:inline-flex; align-items:center; gap:5px;" title="Ver ficha técnica completa" data-id="${item.id}">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>Ficha</span>
          </button>
        </td>
      `;

      // Evento de checkbox de fila
      const cb = tr.querySelector('.row-checkbox');
      if (cb) {
        cb.addEventListener('change', () => {
          if (cb.checked) {
            this.selectedItemIds.add(item.id);
          } else {
            this.selectedItemIds.delete(item.id);
          }
          this.updateSelectionUI();
        });
      }

      tr.querySelector('.btn-item-details').addEventListener('click', () => {
        this.openItemModal(item.id);
      });

      tableBody.appendChild(tr);
    });

    this.updateSelectionUI();

    const recordsCountElem = document.getElementById('sb-records-count');
    if (recordsCountElem && window.app.currentView === 'inventory') {
      recordsCountElem.textContent = `${items.length} registros`;
    }
  }

  preselectItemForCheckout(itemId) {
    this.selectedItemIds.clear();
    this.selectedItemIds.add(itemId);
    this.updateSelectionUI();
    this.openBulkCheckoutModal();
  }

  openBulkCheckoutModal(targetIds = null) {
    const modal = document.getElementById('bulk-checkout-modal');
    const listElem = document.getElementById('bulk-checkout-items-list');
    const borrowerNameInput = document.getElementById('bulk-borrower-name');
    const borrowerEmailInput = document.getElementById('bulk-borrower-email');

    if (!modal || !listElem) return;

    listElem.innerHTML = '';
    const ids = targetIds || Array.from(this.selectedItemIds);
    this.pendingCheckoutIds = ids;
    const selectedItems = ids.map(id => window.store.getItemById(id)).filter(it => it && it.status === 'disponible');

    selectedItems.forEach(it => {
      const itemRow = document.createElement('div');
      itemRow.style.cssText = 'padding:6px 8px; border-bottom:1px solid var(--sb-border-subtle); display:flex; justify-content:space-between; align-items:center; font-size:12px;';
      itemRow.innerHTML = `
        <div>
          <span style="font-family:var(--sb-font-mono); color:var(--sb-green); font-weight:600;">${it.code}</span>
          <span style="font-weight:500; margin-left:6px;">${it.name}</span>
        </div>
        <span style="color:var(--sb-text-dim); font-size:11px;">${it.warehouse_id} (${it.location_shelf})</span>
      `;
      listElem.appendChild(itemRow);
    });

    if (window.authService.currentUser) {
      if (borrowerNameInput) borrowerNameInput.value = window.authService.currentUser.full_name;
      if (borrowerEmailInput) borrowerEmailInput.value = window.authService.currentUser.email;
    }

    modal.classList.add('active');
  }

  handleBulkCheckoutSubmit() {
    const borrowerNameInput = document.getElementById('bulk-borrower-name');
    const borrowerEmailInput = document.getElementById('bulk-borrower-email');
    const purposeInput = document.getElementById('bulk-purpose');

    const borrowerName = borrowerNameInput ? borrowerNameInput.value.trim() : '';
    const borrowerEmail = borrowerEmailInput ? borrowerEmailInput.value.trim() : '';
    const purpose = purposeInput ? purposeInput.value.trim() : 'Práctica docente';

    if (!borrowerName) {
      alert('Introduce el nombre del profesor o responsable que retira el material.');
      return;
    }

    const ids = this.pendingCheckoutIds || Array.from(this.selectedItemIds);
    const res = window.store.checkoutMultipleItems(ids, borrowerName, borrowerEmail, purpose);

    if (res.success) {
      if (window.app) {
        window.app.showToast(`Salida registrada (${res.count} materiales). Vale: ${res.receiptCode}`, 'success');
        window.app.closeModal('bulk-checkout-modal');
      }

      this.selectedItemIds.clear();
      this.pendingCheckoutIds = null;
      this.renderTable();

      if (confirm(`Se han extraído ${res.count} materiales correctamente.\nVale oficial: ${res.receiptCode}\n\n¿Deseas generar el vale de salida en formato de impresión / PDF?`)) {
        this.printBulkCheckoutReceipt(res.receiptCode, borrowerName, borrowerEmail, purpose, res.items);
      }

      if (window.app) window.app.updateDashboardStats();
      if (window.checkoutsManager) window.checkoutsManager.renderActiveCheckoutsTable();
      if (window.warehouseMapViewer) window.warehouseMapViewer.renderWarehouseView(window.warehouseMapViewer.currentWarehouseId);
    } else {
      alert(res.message);
    }
  }

  printBulkCheckoutReceipt(receiptCode, borrowerName, borrowerEmail, purpose, items) {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    let rowsHtml = '';
    items.forEach((it, idx) => {
      rowsHtml += `
        <tr>
          <td style="padding:6px; border:1px solid #ddd; text-align:center;">${idx + 1}</td>
          <td style="padding:6px; border:1px solid #ddd; font-family:monospace; font-weight:bold;">${it.code}</td>
          <td style="padding:6px; border:1px solid #ddd;"><b>${it.name}</b></td>
          <td style="padding:6px; border:1px solid #ddd;">${it.warehouse_id} (Balda ${it.location_shelf})</td>
          <td style="padding:6px; border:1px solid #ddd;">${it.serial_number || '-'}</td>
        </tr>
      `;
    });

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vale de Salida - ${receiptCode}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; margin: 30px; font-size: 12px; }
          .card { border: 2px solid #000; padding: 20px; max-width: 680px; margin: 0 auto; }
          .title { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .code { font-size: 16px; font-family: monospace; font-weight: bold; background: #eee; padding: 6px; text-align: center; margin: 12px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          th { background: #f0f0f0; border: 1px solid #ddd; padding: 6px; text-align: left; }
          .sig { margin-top: 35px; display: flex; justify-content: space-between; }
          .sig-box { border-top: 1px solid #000; width: 45%; text-align: center; font-size: 11px; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title">
            <h2 style="margin:0;">CIFP HESPÉRIDES - VALE DE SALIDA COLECTIVO</h2>
            <div style="font-size:11px; color:#555;">Departamento de Emergencias y Protección Civil</div>
          </div>
          <div class="code">REGISTRO OFICIAL: ${receiptCode}</div>
          <div><b>PROFESOR / RESPONSABLE:</b> ${borrowerName} (${borrowerEmail})</div>
          <div><b>MOTIVO / PRÁCTICA:</b> ${purpose}</div>
          <div><b>FECHA Y HORA:</b> ${new Date().toLocaleString()}</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>CÓDIGO</th>
                <th>MATERIAL</th>
                <th>UBICACIÓN</th>
                <th>Nº SERIE</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <div class="sig">
            <div class="sig-box">Firma Profesor Solicitante</div>
            <div class="sig-box">VºBº Coordinador de Almacén</div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  openItemModal(itemId) {
    const item = window.store.getItemById(itemId);
    if (!item) return;

    this.selectedItemForModal = item;
    const modal = document.getElementById('item-detail-modal');
    if (!modal) return;

    const wh = window.store.warehouses.find(w => w.id === item.warehouse_id || (w.altIds && w.altIds.includes(item.warehouse_id)));

    document.getElementById('modal-item-title').textContent = item.name;
    document.getElementById('modal-item-code').textContent = item.code;
    document.getElementById('modal-item-serial').textContent = item.serial_number || 'NULL';
    document.getElementById('modal-item-category').textContent = item.category;
    document.getElementById('modal-item-location').textContent = `${wh ? wh.name : item.warehouse_id} (Sección ${item.location_shelf})`;
    document.getElementById('modal-item-supplier').textContent = item.supplier || 'NULL';
    document.getElementById('modal-item-mfg').textContent = item.mfg_date || 'NULL';
    document.getElementById('modal-item-use-date').textContent = item.use_date || 'NULL';
    document.getElementById('modal-item-uses-count').textContent = `${item.use_count || 0} usos`;

    const obsReadEl = document.getElementById('modal-item-observations');
    const obsEditBox = document.getElementById('modal-observations-edit-box');
    const btnEditObs = document.getElementById('btn-edit-modal-observations');
    if (obsReadEl) {
      obsReadEl.textContent = item.observations || 'Sin observaciones registradas.';
      obsReadEl.style.display = 'block';
    }
    if (obsEditBox) obsEditBox.style.display = 'none';
    if (btnEditObs) btnEditObs.style.display = 'inline-flex';

    const statusBox = document.getElementById('modal-item-status-box');
    if (statusBox) {
      let badgeClass = 'disponible';
      let label = 'disponible';
      if (item.status === 'sacado') {
        badgeClass = 'sacado';
        label = `sacado por ${item.current_borrower || 'profesor'}`;
      } else if (item.status === 'extraviado') {
        badgeClass = 'extraviado';
        label = 'EXTRAVIADO (No disponible)';
      } else if (item.status === 'mantenimiento') {
        badgeClass = 'mantenimiento';
        label = 'mantenimiento';
      }
      statusBox.innerHTML = `<span class="sb-badge ${badgeClass}">${label}</span>`;
    }

    const imgElem = document.getElementById('modal-item-image');
    const placeholderElem = document.getElementById('modal-item-placeholder');
    if (item.photo_url) {
      imgElem.src = item.photo_url;
      imgElem.style.display = 'block';
      placeholderElem.style.display = 'none';
    } else {
      imgElem.style.display = 'none';
      placeholderElem.style.display = 'flex';
    }

    const timelineElem = document.getElementById('modal-item-timeline');
    if (timelineElem) {
      timelineElem.innerHTML = '';
      const history = item.usage_history || [];
      if (history.length === 0) {
        timelineElem.innerHTML = '<div style="color:var(--sb-text-dim); font-size:11px; padding:4px 0;">Sin historial previo registrado.</div>';
      } else {
        history.forEach(entry => {
          const div = document.createElement('div');
          div.style.cssText = 'border-left: 2px solid var(--sb-green); padding-left: 8px; margin-bottom: 6px; font-size: 11.5px;';
          div.innerHTML = `
            <div style="color:var(--sb-green); font-family:var(--sb-font-mono); font-size:10.5px;">${entry.date} &bull; ${entry.user}</div>
            <div style="color:var(--sb-text-main);">${entry.note}</div>
          `;
          timelineElem.appendChild(div);
        });
      }
    }

    const docLinkElem = document.getElementById('modal-item-doc-link');
    if (docLinkElem) {
      if (item.doc_url) {
        docLinkElem.href = item.doc_url;
        docLinkElem.style.display = 'inline-flex';
      } else {
        docLinkElem.style.display = 'none';
      }
    }

    const modalActionBtn = document.getElementById('modal-item-action-btn');
    if (modalActionBtn) {
      if (item.status === 'disponible') {
        modalActionBtn.style.display = 'inline-flex';
        modalActionBtn.textContent = 'Sacar Material';
        modalActionBtn.onclick = () => {
          this.closeModal('item-detail-modal');
          this.preselectItemForCheckout(item.id);
        };
      } else {
        modalActionBtn.style.display = 'none';
      }
    }

    modal.classList.add('active');
  }

  promptMarkLost(itemId) {
    const item = window.store.getItemById(itemId);
    if (!item) return;

    const reason = prompt(
      `ATENCIÓN: Declarar material "${item.name}" (${item.code}) como EXTRAVIADO.\n\nEl material quedará no disponible (marcado en rojo) pero registrado en la base de datos para trazabilidad.\n\nIndica el motivo o circunstancias:`,
      'Extraviado en la última maniobra exterior'
    );

    if (reason && reason.trim()) {
      window.store.markItemLost(itemId, reason.trim());
      if (window.app) window.app.showToast('Material marcado como extraviado y registrado en auditoría', 'warning');
      this.renderTable();
      if (window.app) window.app.updateDashboardStats();
    }
  }

  confirmDeleteItem(itemId) {
    const item = window.store.getItemById(itemId);
    if (!item) return;

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente "${item.name}" (${item.code}) de public.items?`)) {
      window.store.deleteItem(itemId);
      if (window.app) window.app.showToast('Material eliminado correctamente', 'success');
      this.renderTable();
      if (window.app) window.app.updateDashboardStats();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  printInventoryReport() {
    const items = window.store.getItems(this.currentFilters);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const code = `0001.${pad(now.getHours())}:${pad(now.getMinutes())}.${pad(now.getDate())}${pad(now.getMonth()+1)}${now.getFullYear()}`;

    const printWin = window.open('', '_blank');
    if (!printWin) return;

    let rowsHtml = '';
    items.forEach(it => {
      rowsHtml += `
        <tr>
          <td style="padding:6px; border:1px solid #ddd; font-family:monospace;">${it.code}</td>
          <td style="padding:6px; border:1px solid #ddd;"><b>${it.name}</b><br><small>${it.category}</small></td>
          <td style="padding:6px; border:1px solid #ddd;">${it.warehouse_id} (${it.location_shelf})</td>
          <td style="padding:6px; border:1px solid #ddd; text-transform:uppercase;">${it.status}</td>
          <td style="padding:6px; border:1px solid #ddd;">${it.supplier || '-'}</td>
          <td style="padding:6px; border:1px solid #ddd;">${it.serial_number || '-'}</td>
        </tr>
      `;
    });

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inventario CIFP Hespérides - ${code}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 25px; color: #222; font-size: 12px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background-color: #f5f5f5; border: 1px solid #ddd; padding: 6px; text-align: left; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h2 style="margin:0;">CIFP HESPÉRIDES - INVENTARIO DE RECURSOS</h2>
            <div style="color:#666;">Departamento de Emergencias y Protección Civil</div>
          </div>
          <div>
            <div style="font-family:monospace; font-weight:bold; background:#eee; padding:3px 6px;">REG: ${code}</div>
            <div style="font-size:10px; margin-top:4px;">${now.toLocaleString()}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>MATERIAL / CATEGORÍA</th>
              <th>UBICACIÓN</th>
              <th>ESTADO</th>
              <th>PROVEEDOR</th>
              <th>Nº SERIE</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }
}

window.inventoryManager = new InventoryManager();
