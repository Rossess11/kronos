/**
 * KRONOS - AUDIT LOGS (ESTILO SUPABASE TABLE EDITOR)
 * Sin checkboxes y mostrando correctamente el identificador item_id.
 */

class AuditManager {
  constructor() {
    this.filterSearch = '';
    this.filterAction = 'all';
  }

  init() {
    this.bindEvents();
    this.renderLogs();
  }

  bindEvents() {
    const searchInput = document.getElementById('audit-search-input');
    const actionFilter = document.getElementById('audit-action-filter');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterSearch = e.target.value.toLowerCase().trim();
        this.renderLogs();
      });
    }

    if (actionFilter) {
      actionFilter.addEventListener('change', (e) => {
        this.filterAction = e.target.value;
        this.renderLogs();
      });
    }
  }

  renderLogs() {
    const tableBody = document.getElementById('audit-table-body');
    const countPill = document.getElementById('count-audit-pill');
    if (!tableBody) return;

    let logs = window.store.getAuditLogs(200);

    if (this.filterAction !== 'all') {
      logs = logs.filter(log => log.action === this.filterAction);
    }

    if (this.filterSearch) {
      logs = logs.filter(log =>
        (log.user_name && log.user_name.toLowerCase().includes(this.filterSearch)) ||
        (log.user_email && log.user_email.toLowerCase().includes(this.filterSearch)) ||
        (log.item_name && log.item_name.toLowerCase().includes(this.filterSearch)) ||
        (log.item_code && log.item_code.toLowerCase().includes(this.filterSearch)) ||
        (log.item_id && log.item_id.toLowerCase().includes(this.filterSearch)) ||
        (log.details && log.details.toLowerCase().includes(this.filterSearch))
      );
    }

    if (countPill) countPill.textContent = logs.length;

    tableBody.innerHTML = '';

    if (logs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 3rem; color: var(--sb-text-dim);">
            No se encontraron registros en public.audit_logs
          </td>
        </tr>
      `;
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');

      // UUID de log
      const idFormatted = log.id.startsWith('log-') ? `e414b482-${log.id.slice(4, 8)}-4c11-a021-${log.id.slice(8, 18)}` : log.id;

      // Resolver item_id real si viene vacío o NULL
      let resolvedItemId = log.item_id;
      if (!resolvedItemId || resolvedItemId === 'NULL' || resolvedItemId === 'null') {
        if (log.item_code && log.item_code !== 'N/A') {
          const matchedItem = window.store.items.find(it => it.code === log.item_code);
          if (matchedItem) {
            resolvedItemId = matchedItem.id;
          } else {
            resolvedItemId = 'it-' + log.item_code.toLowerCase().replace(/[^a-z0-9]/g, '');
          }
        }
      }

      // Formatear item_id con estilo UUID Supabase
      let displayItemId = resolvedItemId ? (resolvedItemId.startsWith('item-') ? `a01b2c3d-e4f5-${resolvedItemId.slice(5, 9)}-9876-${resolvedItemId.slice(9, 18)}` : resolvedItemId) : '<span class="sb-null">NULL</span>';

      let actionBadge = '';
      if (log.action === 'SALIDA') {
        actionBadge = '<span class="sb-badge sacado">SALIDA</span>';
      } else if (log.action === 'DEVOLUCION') {
        actionBadge = '<span class="sb-badge disponible">DEVOLUCIÓN</span>';
      } else if (log.action === 'EXTRAVIO') {
        actionBadge = '<span class="sb-badge extraviado">EXTRAVÍO</span>';
      } else if (log.action === 'ALTA') {
        actionBadge = '<span class="sb-badge disponible">ALTA</span>';
      } else if (log.action === 'BAJA') {
        actionBadge = '<span class="sb-badge extraviado">BAJA</span>';
      } else {
        actionBadge = `<span class="sb-badge mantenimiento">${log.action}</span>`;
      }

      // Nota: SIN CHECKBOX EN AUDITORÍA según lo solicitado por el usuario
      tr.innerHTML = `
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-text-muted);">${idFormatted}</td>
        <td style="font-weight:500;">${log.user_name}</td>
        <td style="color:var(--sb-text-muted);">${log.user_email}</td>
        <td>${actionBadge}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-blue);">${displayItemId}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11.5px; color:var(--sb-green);">${log.item_code || 'N/A'}</td>
        <td style="max-width:260px; overflow:hidden; text-overflow:ellipsis;">${log.item_name}</td>
        <td style="max-width:320px; overflow:hidden; text-overflow:ellipsis; color:var(--sb-text-muted);">${log.details}</td>
        <td style="font-family:var(--sb-font-mono); font-size:11px; color:var(--sb-text-dim);">${log.created_at}</td>
      `;

      tableBody.appendChild(tr);
    });

    const recordsCountElem = document.getElementById('sb-records-count');
    if (recordsCountElem && window.app.currentView === 'audit') {
      recordsCountElem.textContent = `${logs.length} registros`;
    }
  }
}

window.auditManager = new AuditManager();
