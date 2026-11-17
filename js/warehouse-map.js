/**
 * KRONOS - VISOR INTERACTIVO DE ALMACENES CON MAPAS Y PLANOS VISUALES
 * Permite navegar por los 6 planos oficiales, hacer clic en zonas interactivas (hotspots)
 * e inspeccionar en tiempo real los materiales asignados a cada balda/zona.
 */

class WarehouseMapViewer {
  constructor() {
    this.currentWarehouseId = 'alm-principal';
    this.selectedZoneId = null;
    this.searchQuery = '';
  }

  init() {
    this.bindGlobalEvents();
    this.renderTabs();
    this.renderWarehouseView(this.currentWarehouseId);
  }

  bindGlobalEvents() {
    // Buscador dentro de la balda en el inspector
    const searchInput = document.getElementById('shelf-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (this.selectedZoneId) {
          this.renderInspectorItems(this.currentWarehouseId, this.selectedZoneId);
        }
      });
    }

    // Botón: Abrir en Inventario General con filtro
    const btnGotoInv = document.getElementById('btn-goto-inventory-filtered');
    if (btnGotoInv) {
      btnGotoInv.addEventListener('click', () => {
        if (!this.selectedZoneId) return;
        if (window.app) {
          window.app.switchView('inventory');
          const whFilter = document.getElementById('inv-wh-filter');
          const searchInput = document.getElementById('inv-search-input');
          if (whFilter) whFilter.value = this.currentWarehouseId;
          if (searchInput) searchInput.value = this.selectedZoneId;
          if (window.inventoryManager) {
            window.inventoryManager.currentFilters.warehouse = this.currentWarehouseId;
            window.inventoryManager.currentFilters.search = this.selectedZoneId;
            window.inventoryManager.renderTable();
          }
        }
      });
    }

    // Botón: + Añadir Material en esta Zona
    const btnAddInZone = document.getElementById('btn-add-item-in-zone');
    if (btnAddInZone) {
      btnAddInZone.addEventListener('click', () => {
        if (!this.selectedZoneId) return;
        if (window.app) {
          window.app.switchView('add-item');
          const whSelect = document.getElementById('item-warehouse');
          const nameInput = document.getElementById('item-name');
          if (whSelect) {
            whSelect.value = this.currentWarehouseId;
            if (window.app.populateSectionDropdown) {
              window.app.populateSectionDropdown(this.currentWarehouseId, this.selectedZoneId);
            }
          }
          if (nameInput) nameInput.focus();
        }
      });
    }
  }

  renderTabs() {
    const container = document.getElementById('wh-tabs-container');
    if (!container) return;

    container.innerHTML = '';
    const warehouses = window.store.warehouses;

    warehouses.forEach(wh => {
      const btn = document.createElement('button');
      const isActive = wh.id === this.currentWarehouseId || (wh.altIds && wh.altIds.includes(this.currentWarehouseId));
      btn.className = `sb-btn ${isActive ? 'sb-btn-emerald' : 'sb-btn-subtle'}`;
      btn.dataset.whId = wh.id;
      btn.innerHTML = `<span>${wh.name}</span>`;

      btn.addEventListener('click', () => {
        this.selectWarehouse(wh.id);
      });
      container.appendChild(btn);
    });
  }

  selectWarehouse(whId) {
    this.currentWarehouseId = whId;
    this.selectedZoneId = null;
    this.searchQuery = '';
    const searchInput = document.getElementById('shelf-search-input');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('#wh-tabs-container .sb-btn').forEach(btn => {
      const isActive = btn.dataset.whId === whId;
      btn.className = `sb-btn ${isActive ? 'sb-btn-emerald' : 'sb-btn-subtle'}`;
    });

    this.renderWarehouseView(whId);
  }

  getWarehouseItems(wh) {
    return window.store.items.filter(it => {
      if (it.warehouse_id === wh.id) return true;
      if (wh.altIds && wh.altIds.includes(it.warehouse_id)) return true;
      return false;
    });
  }

  getItemsInZone(wh, zoneId) {
    const whItems = this.getWarehouseItems(wh);
    const zLower = zoneId.toLowerCase();
    return whItems.filter(it => {
      if (!it.location_shelf) return false;
      const sLower = it.location_shelf.toLowerCase();
      return sLower === zLower || sLower === `balda ${zLower}` || sLower.replace(/\s+/g, '') === zLower.replace(/\s+/g, '');
    });
  }

  renderWarehouseView(whId) {
    const wh = window.store.warehouses.find(w => w.id === whId || (w.altIds && w.altIds.includes(whId)));
    if (!wh) return;

    const titleElem = document.getElementById('map-wh-title');
    const descElem = document.getElementById('map-wh-desc');
    const mapImg = document.getElementById('wh-map-img');
    const hotspotsLayer = document.getElementById('wh-map-hotspots-layer');
    const pillsContainer = document.getElementById('wh-zones-pills-container');
    const zonesCountPill = document.getElementById('wh-zones-count-pill');

    if (titleElem) titleElem.textContent = wh.name;
    if (descElem) descElem.textContent = wh.subtitle;
    if (mapImg) {
      mapImg.src = wh.mapImage;
      mapImg.alt = wh.name;
    }

    if (zonesCountPill) {
      zonesCountPill.textContent = `${wh.zones ? wh.zones.length : 0} zonas interactivas`;
    }

    // 1. Renderizar Capa de Hotspots Interactivos sobre el Mapa
    if (hotspotsLayer) {
      hotspotsLayer.innerHTML = '';
      if (wh.zones && wh.zones.length > 0) {
        wh.zones.forEach(zone => {
          const items = this.getItemsInZone(wh, zone.id);
          const hasTaken = items.some(it => it.status === 'sacado');
          const hasMaint = items.some(it => it.status === 'mantenimiento');
          const hasItems = items.length > 0;

          const hotspot = document.createElement('div');
          hotspot.className = 'sb-map-hotspot';
          hotspot.dataset.zoneId = zone.id;

          if (hasItems) hotspot.classList.add('has-items');
          if (hasTaken) hotspot.classList.add('has-taken');
          if (hasMaint) hotspot.classList.add('has-maintenance');

          hotspot.style.left = `${zone.left}%`;
          hotspot.style.top = `${zone.top}%`;
          hotspot.style.width = `${zone.width}%`;
          hotspot.style.height = `${zone.height}%`;

          // Tooltip descriptivo
          let statusLabel = 'Vacía';
          if (hasItems) {
            statusLabel = `${items.length} material${items.length > 1 ? 'es' : ''}`;
            if (hasTaken) statusLabel += ' (en uso)';
            if (hasMaint) statusLabel += ' (mantenimiento)';
          }

          hotspot.innerHTML = `
            <div class="sb-hotspot-tooltip">${zone.name} &bull; ${statusLabel}</div>
            ${hasItems ? `<span class="sb-hotspot-pin">${items.length}</span>` : ''}
          `;

          hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectZone(wh.id, zone.id);
          });

          hotspotsLayer.appendChild(hotspot);
        });
      }
    }

    // 2. Renderizar Selector Rápido de Zonas (Pills)
    if (pillsContainer) {
      pillsContainer.innerHTML = '';
      if (wh.zones && wh.zones.length > 0) {
        wh.zones.forEach(zone => {
          const items = this.getItemsInZone(wh, zone.id);
          const pill = document.createElement('button');
          pill.className = 'sb-zone-pill-btn';
          pill.dataset.zoneId = zone.id;
          pill.title = zone.name;

          const dotColor = items.some(it => it.status === 'sacado') ? 'var(--sb-amber)' :
                           items.some(it => it.status === 'mantenimiento') ? '#38bdf8' :
                           items.length > 0 ? 'var(--sb-green)' : 'var(--sb-text-dim)';

          pill.innerHTML = `
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${dotColor};"></span>
            <span>${zone.id}</span>
            <span style="opacity:0.75; font-size:10px;">(${items.length})</span>
          `;

          pill.addEventListener('click', () => {
            this.selectZone(wh.id, zone.id);
          });

          pillsContainer.appendChild(pill);
        });
      }
    }

    // Seleccionar automáticamente la primera zona con material o la primera zona
    if (wh.zones && wh.zones.length > 0) {
      const defaultZone = wh.zones.find(z => this.getItemsInZone(wh, z.id).length > 0) || wh.zones[0];
      this.selectZone(wh.id, defaultZone.id);
    }
  }

  selectZone(whId, zoneId) {
    this.selectedZoneId = zoneId;
    const wh = window.store.warehouses.find(w => w.id === whId || (w.altIds && w.altIds.includes(whId)));
    if (!wh) return;

    const zone = wh.zones ? wh.zones.find(z => z.id === zoneId) : null;
    if (!zone) return;

    // Actualizar estado activo en hotspots del mapa
    document.querySelectorAll('#wh-map-hotspots-layer .sb-map-hotspot').forEach(el => {
      if (el.dataset.zoneId === zoneId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Actualizar estado activo en las pills
    document.querySelectorAll('#wh-zones-pills-container .sb-zone-pill-btn').forEach(btn => {
      if (btn.dataset.zoneId === zoneId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Badge superior de zona activa
    const activeBadge = document.getElementById('map-active-zone-badge');
    const activeName = document.getElementById('map-active-zone-name');
    if (activeBadge && activeName) {
      activeBadge.style.display = 'inline-flex';
      activeName.textContent = zone.name;
    }

    // Actualizar inspector
    const sectorTag = document.getElementById('shelf-sector-tag');
    const inspectorTitle = document.getElementById('shelf-inspector-title');
    if (sectorTag) sectorTag.textContent = zone.sector || 'Zona de Almacén';
    if (inspectorTitle) inspectorTitle.textContent = zone.name;

    this.renderInspectorItems(whId, zoneId);
  }

  renderInspectorItems(whId, zoneId) {
    const wh = window.store.warehouses.find(w => w.id === whId || (w.altIds && w.altIds.includes(whId)));
    if (!wh) return;

    const zone = wh.zones ? wh.zones.find(z => z.id === zoneId) : null;
    let items = this.getItemsInZone(wh, zoneId);

    const countBadge = document.getElementById('shelf-items-count-badge');
    const inspectorSub = document.getElementById('shelf-inspector-subtitle');
    const itemsList = document.getElementById('shelf-items-container');

    if (countBadge) countBadge.textContent = `${items.length} recurso${items.length === 1 ? '' : 's'}`;
    if (inspectorSub) {
      const dispCount = items.filter(it => it.status === 'disponible').length;
      inspectorSub.textContent = `${items.length} material(es) (${dispCount} disponible${dispCount === 1 ? '' : 's'})`;
    }

    if (!itemsList) return;
    itemsList.innerHTML = '';

    // Filtrar por texto de búsqueda si se ha introducido
    if (this.searchQuery) {
      const q = this.searchQuery;
      items = items.filter(it => 
        (it.name && it.name.toLowerCase().includes(q)) ||
        (it.code && it.code.toLowerCase().includes(q)) ||
        (it.category && it.category.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      itemsList.innerHTML = `
        <div style="text-align:center; padding: 2.2rem 1rem; color:var(--sb-text-dim); font-size:12px; background:var(--sb-bg-canvas); border-radius:4px; border:1px dashed var(--sb-border-subtle);">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin:0 auto 8px auto; opacity:0.4; display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          ${this.searchQuery ? 'No hay materiales que coincidan con la búsqueda.' : 'No hay materiales almacenados en esta zona.'}
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--sb-bg-canvas); border:1px solid var(--sb-border-subtle); border-radius:4px; padding:8px 10px; display:flex; flex-direction:column; gap:4px; transition:border-color 0.15s ease;';

      let statusBadge = '';
      if (item.status === 'disponible') {
        statusBadge = '<span class="sb-badge disponible" style="font-size:10px;">disponible</span>';
      } else if (item.status === 'sacado') {
        statusBadge = '<span class="sb-badge sacado" style="font-size:10px;">en uso</span>';
      } else if (item.status === 'mantenimiento') {
        statusBadge = '<span class="sb-badge mantenimiento" style="font-size:10px;">mantenimiento</span>';
      } else {
        statusBadge = '<span class="sb-badge extraviado" style="font-size:10px;">extraviado</span>';
      }

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-family:var(--sb-font-mono); font-size:11px; color:var(--sb-green); font-weight:600;">${item.code}</span>
          ${statusBadge}
        </div>
        <div style="font-size:12px; font-weight:500; color:var(--sb-text-main); margin-top:2px;">${item.name}</div>
        <div style="font-size:11px; color:var(--sb-text-dim); display:flex; justify-content:space-between; margin-top:1px;">
          <span>${item.category}</span>
          <span>${item.use_count || 0} usos</span>
        </div>
        ${item.current_borrower ? `
          <div style="font-size:10.5px; color:#fbbf24; background:rgba(245,158,11,0.08); padding:2px 6px; border-radius:3px; margin-top:2px;">
            En uso por: ${item.current_borrower.split('(')[0]}
          </div>
        ` : ''}
        <div style="display:flex; gap:6px; margin-top:6px; justify-content:flex-end;">
          <button class="sb-btn sb-btn-subtle btn-inspect-view" style="padding:2px 7px; font-size:11px;" title="Ver ficha técnica">
            Ficha
          </button>
          ${item.status === 'disponible' ? `
            <button class="sb-btn sb-btn-emerald btn-inspect-checkout" style="padding:2px 7px; font-size:11px;" title="Sacar material">
              Sacar
            </button>
          ` : ''}
        </div>
      `;

      card.querySelector('.btn-inspect-view').addEventListener('click', () => {
        if (window.inventoryManager) window.inventoryManager.openItemModal(item.id);
      });

      const chkBtn = card.querySelector('.btn-inspect-checkout');
      if (chkBtn) {
        chkBtn.addEventListener('click', () => {
          if (window.inventoryManager) {
            window.inventoryManager.selectedItemIds.clear();
            window.inventoryManager.selectedItemIds.add(item.id);
            window.inventoryManager.openBulkCheckoutModal([item.id]);
          }
        });
      }

      itemsList.appendChild(card);
    });
  }
}

window.warehouseMapViewer = new WarehouseMapViewer();
