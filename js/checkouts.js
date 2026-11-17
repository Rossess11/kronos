/**
 * KRONOS - MATERIAL EN USO (CHECKOUTS ACTIVOS)
 * Muestra exclusivamente el material que se encuentra sacado / en uso en este momento.
 * Permite seleccionar mediante checkboxes para devolver los elementos al inventario de forma masiva.
 */

class CheckoutsManager {
  constructor() {
    this.selectedCheckoutIds = new Set();
  }

  init() {
    this.bindEvents();
    this.renderActiveCheckoutsTable();
  }

  bindEvents() {
    const searchQuick = document.getElementById('chk-search-input');
    if (searchQuick) {
      searchQuick.addEventListener('input', () => {
        this.renderActiveCheckoutsTable();
      });
    }

    // Botón Seleccionar Todos en Material en Uso
    const btnSelectAll = document.getElementById('btn-select-all-en-uso');
    const thSelectAll = document.getElementById('th-select-all-en-uso');

    const toggleSelectAll = () => {
      const activeList = window.store.getActiveCheckouts();
      if (activeList.length === 0) return;

      const allSelected = activeList.every(c => this.selectedCheckoutIds.has(c.id));
      if (allSelected) {
        activeList.forEach(c => this.selectedCheckoutIds.delete(c.id));
      } else {
        activeList.forEach(c => this.selectedCheckoutIds.add(c.id));
      }

      this.updateSelectionUI();
    };

    if (btnSelectAll) btnSelectAll.addEventListener('click', toggleSelectAll);
    if (thSelectAll) thSelectAll.addEventListener('change', toggleSelectAll);

    // Botón "Devolver Selección"
    const btnReturnSelected = document.getElementById('btn-return-selected');
    if (btnReturnSelected) {
      btnReturnSelected.addEventListener('click', () => {
        if (this.selectedCheckoutIds.size === 0) return;
        this.handleBulkCheckin();
      });
    }
  }

  updateSelectionUI() {
    const tableBody = document.getElementById('active-checkouts-table-body');
    const btnReturn = document.getElementById('btn-return-selected');
    const thSelectAll = document.getElementById('th-select-all-en-uso');

    const activeList = window.store.getActiveCheckouts();

    if (tableBody) {
      tableBody.querySelectorAll('.chk-row-checkbox').forEach(cb => {
        const id = cb.dataset.id;
        cb.checked = this.selectedCheckoutIds.has(id);
      });
    }

    if (btnReturn) {
      const count = this.selectedCheckoutIds.size;
      if (count > 0) {
        btnReturn.classList.add('active');
        btnReturn.innerHTML = `
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          <span>Devolver Selección (${count})</span>
        `;
      } else {
        btnReturn.classList.remove('active');
        btnReturn.innerHTML = `
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Devolver Selección</span>
        `;
      }
    }

    if (thSelectAll && activeList.length > 0) {
      thSelectAll.checked = activeList.every(c => this.selectedCheckoutIds.has(c.id));
    }
  }

  renderActiveCheckoutsTable() {
    const tableBody = document.getElementById('active-checkouts-table-body');
    const countPill = document.getElementById('count-checkouts-pill');
    if (!tableBody) return;

    // Filtrar EXCLUSIVAMENTE materiales actualmente en uso (status 'activo')
    let list = window.store.getActiveCheckouts();
    const searchInput = document.getElementById('chk-search-input');
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (q) {
      list = list.filter(c => 
        c.item_name.toLowerCase().includes(q) ||
        c.item_code.toLowerCase().includes(q) ||
        c.borrower_name.toLowerCase().includes(q) ||
        c.receipt_code.toLowerCase().includes(q)
      );
    }

    if (countPill) countPill.textContent = list.length;

    tableBody.innerHTML = '';

    if (list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 3rem; color: var(--sb-green);">
            <svg style="width:28px; height:28px; margin-bottom:4px; display:inline-block;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <div style="font-weight:600;">Todo el material se encuentra en su almacén</div>
            <div style="font-size:11.5px; color:var(--sb-text-dim);">No hay recursos fuera en este momento.</div>
          </td>
        </tr>
      `;
      this.updateSelectionUI();
      return;
    }

    list.forEach(chk => {
      const isMaint = chk.type === 'mantenimiento' || (chk.purpose && chk.purpose.toLowerCase().includes('mantenimiento'));
      const tr = document.createElement('tr');
      tr.className = isMaint ? 'row-maintenance' : 'row-taken';

      const isChecked = this.selectedCheckoutIds.has(chk.id);

      const statusBadge = isMaint 
        ? '<span class="sb-badge mantenimiento">en mantenimiento</span>' 
        : '<span class="sb-badge sacado">en uso</span>';

      let formattedTime = chk.checkout_time || '';
      if (typeof formattedTime === 'string' && formattedTime.includes('T')) {
        const d = new Date(formattedTime);
        if (!isNaN(d.getTime())) {
          const pad = (n) => String(n).padStart(2, '0');
          formattedTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
      }

      tr.innerHTML = `
        <td><input type="checkbox" class="chk-row-checkbox" data-id="${chk.id}" ${isChecked ? 'checked' : ''}></td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-amber); font-weight:500;">
          ${chk.receipt_code}
        </td>
        <td style="font-weight:500;">${chk.item_name}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-green);">${chk.item_code}</td>
        <td style="font-weight:500; color:var(--sb-text-main);">${chk.borrower_name}</td>
        <td style="color:var(--sb-text-muted); font-size:12px;">${chk.purpose}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11px; color:var(--sb-text-dim);">${formattedTime}</td>
        <td>
          ${statusBadge}
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:4px;">
            <button class="sb-btn sb-btn-emerald btn-checkin" style="padding:2px 6px; font-size:11px;" title="${isMaint ? 'Finalizar mantenimiento y reincorporar al almacén' : 'Devolver al inventario'}" data-id="${chk.id}">
              ${isMaint ? 'Fin Mant.' : 'Devolver'}
            </button>
            <button class="sb-btn sb-btn-subtle btn-print-vale" style="padding:2px 6px; font-size:11px;" data-id="${chk.id}">
              PDF
            </button>
          </div>
        </td>
      `;

      const cb = tr.querySelector('.chk-row-checkbox');
      if (cb) {
        cb.addEventListener('change', () => {
          if (cb.checked) {
            this.selectedCheckoutIds.add(chk.id);
          } else {
            this.selectedCheckoutIds.delete(chk.id);
          }
          this.updateSelectionUI();
        });
      }

      const checkinBtn = tr.querySelector('.btn-checkin');
      if (checkinBtn) {
        checkinBtn.addEventListener('click', () => {
          this.promptCheckin(chk.id);
        });
      }

      tr.querySelector('.btn-print-vale').addEventListener('click', () => {
        this.printCheckoutReceipt(chk);
      });

      tableBody.appendChild(tr);
    });

    this.updateSelectionUI();

    const recordsCountElem = document.getElementById('sb-records-count');
    if (recordsCountElem && window.app.currentView === 'checkouts') {
      recordsCountElem.textContent = `${list.length} registros`;
    }
  }

  handleBulkCheckin() {
    const count = this.selectedCheckoutIds.size;
    if (count === 0) return;

    if (!confirm(`¿Confirmar la devolución de ${count} material(es) al almacén?`)) return;

    const ids = Array.from(this.selectedCheckoutIds);
    const res = window.store.checkinMultipleItems(ids, 'disponible', 'Devolución masiva confirmada');

    if (res.success) {
      if (window.app) {
        window.app.showToast(`Se han devuelto ${res.count} materiales al inventario`, 'success');
      }

      this.selectedCheckoutIds.clear();
      this.renderActiveCheckoutsTable();

      if (window.app) window.app.updateDashboardStats();
      if (window.inventoryManager) window.inventoryManager.renderTable();
      if (window.warehouseMapViewer) window.warehouseMapViewer.renderWarehouseView(window.warehouseMapViewer.currentWarehouseId);
    }
  }

  promptCheckin(checkoutId) {
    const chk = window.store.checkouts.find(c => c.id === checkoutId);
    if (!chk) return;

    const conditionChoice = prompt(
      `Devolución de "${chk.item_name}" (${chk.item_code}):\n\n1: Buen estado / Disponible (Recomendado)\n2: Requiere Mantenimiento\n3: Extraviado / No devuelto\n\nSelecciona 1, 2 o 3:`,
      '1'
    );

    if (!conditionChoice) return;

    let condition = 'disponible';
    if (conditionChoice.trim() === '2') condition = 'mantenimiento';
    else if (conditionChoice.trim() === '3') condition = 'extraviado';

    const notes = prompt('Observaciones de la devolución (opcional):', 'Material reingresado en almacén.');

    const res = window.store.checkinItem(checkoutId, notes || '', condition);
    if (res.success) {
      if (window.app) {
        window.app.showToast(`Material devuelto como ${condition.toUpperCase()}`, condition === 'disponible' ? 'success' : 'warning');
      }

      this.selectedCheckoutIds.delete(checkoutId);
      this.renderActiveCheckoutsTable();

      if (window.app) window.app.updateDashboardStats();
      if (window.inventoryManager) window.inventoryManager.renderTable();
      if (window.warehouseMapViewer) window.warehouseMapViewer.renderWarehouseView(window.warehouseMapViewer.currentWarehouseId);
    }
  }

  printCheckoutReceipt(chk) {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vale de Salida - ${chk.receipt_code}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; margin: 30px; font-size: 12px; }
          .card { border: 1px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
          .title { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .code { font-size: 16px; font-family: monospace; font-weight: bold; background: #eee; padding: 6px; text-align: center; margin: 12px 0; }
          .row { margin-bottom: 6px; }
          .sig { margin-top: 30px; display: flex; justify-content: space-between; }
          .sig-box { border-top: 1px solid #000; width: 45%; text-align: center; font-size: 11px; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title">
            <h3 style="margin:0;">CIFP HESPÉRIDES - VALE DE SALIDA</h3>
            <div style="font-size:11px; color:#555;">Departamento de Emergencias y Protección Civil</div>
          </div>
          <div class="code">REGISTRO: ${chk.receipt_code}</div>
          <div class="row"><b>MATERIAL:</b> ${chk.item_name} (${chk.item_code})</div>
          <div class="row"><b>PROFESOR / RESPONSABLE:</b> ${chk.borrower_name} (${chk.borrower_email})</div>
          <div class="row"><b>PRÁCTICA / MOTIVO:</b> ${chk.purpose}</div>
          <div class="row"><b>FECHA Y HORA:</b> ${chk.checkout_time}</div>
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
}

window.checkoutsManager = new CheckoutsManager();
