/**
 * KRONOS - CENTRAL DATA STORE & BUSINESS LOGIC
 * Almacén central de datos reactivo con soporte offline local y sincronización con Supabase.
 */

const WAREHOUSES = [
  {
    id: 'alm-principal',
    altIds: ['alm-1', 'alm-2'],
    name: 'Almacén Principal E.19',
    subtitle: 'Intervención, Equipos ERA & Banco de Trabajo',
    mapImage: 'assets/almacen-principale19.jpg',
    zones: [
      { id: 'A.9', name: 'Perchas Trajes de Intervención A.9', sector: 'Sector A', left: 53.7, top: 7.0, width: 34.0, height: 4.5 },
      { id: 'A.1', name: 'Balda A.1', sector: 'Sector A', left: 53.8, top: 25.2, width: 5.0, height: 13.0 },
      { id: 'A.2', name: 'Balda A.2', sector: 'Sector A', left: 53.8, top: 12.0, width: 5.0, height: 13.0 },
      { id: 'A.3', name: 'Balda A.3', sector: 'Sector A', left: 82.6, top: 19.9, width: 4.8, height: 12.9 },
      { id: 'A.4', name: 'Balda A.4', sector: 'Sector A', left: 82.6, top: 33.0, width: 4.8, height: 12.9 },
      { id: 'A.5', name: 'Mesa de Trabajo A.5', sector: 'Sector A', left: 63.0, top: 49.3, width: 24.5, height: 14.7 },
      { id: 'A.6', name: 'Balda A.6', sector: 'Sector A', left: 79.2, top: 20.1, width: 3.4, height: 5.8 },
      { id: 'A.7', name: 'Balda A.7', sector: 'Sector A', left: 79.2, top: 26.0, width: 3.4, height: 5.8 },
      { id: 'A.8', name: 'Balda A.8', sector: 'Sector A', left: 79.2, top: 32.0, width: 3.4, height: 6.0 },
      
      { id: 'B.1', name: 'Balda B.1', sector: 'Sector B', left: 25.0, top: 28.5, width: 9.0, height: 6.7 },
      { id: 'B.2', name: 'Balda B.2', sector: 'Sector B', left: 19.6, top: 26.4, width: 5.0, height: 8.9 },
      { id: 'B.3', name: 'Balda B.3', sector: 'Sector B', left: 19.6, top: 15.4, width: 5.0, height: 10.7 },
      { id: 'B.4', name: 'Balda B.4', sector: 'Sector B', left: 19.6, top: 7.1, width: 5.0, height: 8.0 },
      { id: 'B.5', name: 'Balda B.5', sector: 'Sector B', left: 25.0, top: 7.1, width: 9.0, height: 6.2 },
      { id: 'B.6', name: 'Módulo B.6', sector: 'Sector B', left: 44.3, top: 10.6, width: 4.8, height: 10.6 },
      { id: 'B.7', name: 'Módulo B.7', sector: 'Sector B', left: 44.3, top: 21.9, width: 4.8, height: 10.7 },

      { id: 'C.1', name: 'Perchas para ERAs C.1', sector: 'Sector C', left: 19.7, top: 41.3, width: 19.7, height: 5.6 },
      { id: 'C.2', name: 'Módulo C.2', sector: 'Sector C', left: 15.0, top: 41.4, width: 2.9, height: 13.4 },
      { id: 'C.3', name: 'Balda C.3', sector: 'Sector C', left: 14.9, top: 55.2, width: 5.6, height: 10.5 },
      { id: 'C.4', name: 'Balda C.4', sector: 'Sector C', left: 14.9, top: 66.0, width: 6.5, height: 10.5 },
      { id: 'C.5', name: 'Balda C.5', sector: 'Sector C', left: 14.9, top: 76.8, width: 6.5, height: 10.5 },
      { id: 'C.6', name: 'Módulo C.6', sector: 'Sector C', left: 25.8, top: 78.5, width: 13.5, height: 8.9 },
      { id: 'C.7', name: 'Balda C.7', sector: 'Sector C', left: 42.5, top: 51.9, width: 6.7, height: 18.0 },
      { id: 'C.8', name: 'Balda C.8', sector: 'Sector C', left: 42.5, top: 70.1, width: 6.7, height: 18.4 }
    ]
  },
  {
    id: 'alm-forestales',
    altIds: ['alm-3'],
    name: 'Almacén Forestales E.14',
    subtitle: 'Herramientas de Extinción Forestal & Contenedores',
    mapImage: 'assets/almacen-forestales-e14.jpg',
    zones: [
      { id: 'F.1', name: 'Balda F.1', sector: 'Sector F', left: 22.4, top: 83.3, width: 16.3, height: 11.8 },
      { id: 'F.2', name: 'Balda F.2', sector: 'Sector F', left: 46.9, top: 47.9, width: 6.8, height: 15.0 },
      { id: 'F.3', name: 'Módulo F.3', sector: 'Sector F', left: 38.9, top: 82.8, width: 14.5, height: 12.2 },
      { id: 'F.4', name: 'Estantería F.4', sector: 'Sector F', left: 49.7, top: 28.0, width: 4.0, height: 9.0 },
      { id: 'F.5', name: 'Estantería F.5', sector: 'Sector F', left: 49.7, top: 37.2, width: 4.0, height: 10.6 },
      { id: 'F.6', name: 'Contenedor F.6', sector: 'Sector F', left: 18.7, top: 13.0, width: 5.8, height: 19.1 },
      { id: 'F.7', name: 'Contenedor F.7', sector: 'Sector F', left: 18.7, top: 33.1, width: 5.8, height: 29.9 },
      { id: 'F.8', name: 'Perchero / Panel F.8', sector: 'Sector F', left: 16.2, top: 11.7, width: 2.4, height: 52.5 },
      { id: 'F.9', name: 'Contenedor Basura Sup. F.9', sector: 'Sector F', left: 27.8, top: 9.6, width: 24.5, height: 13.2 },
      { id: 'F.10', name: 'Contenedor Basura Inf. F.10', sector: 'Sector F', left: 27.8, top: 22.9, width: 24.5, height: 7.2 },
      { id: 'F.11', name: 'Módulo F.11', sector: 'Sector F', left: 45.9, top: 30.6, width: 3.8, height: 10.4 }
    ]
  },
  {
    id: 'contenedor',
    altIds: ['alm-4'],
    name: 'Contenedores',
    subtitle: 'Rescate, Generadores, Sanitario e Incendios',
    mapImage: 'assets/contenedor.jpg',
    zones: [
      { id: 'CR.1', name: 'Balda CR.1', sector: 'Contenedor Rescate (CR)', left: 5.1, top: 62.4, width: 6.5, height: 21.1 },
      { id: 'CR.2', name: 'Balda CR.2', sector: 'Contenedor Rescate (CR)', left: 5.1, top: 41.7, width: 6.5, height: 20.4 },
      { id: 'CR.3', name: 'Balda CR.3', sector: 'Contenedor Rescate (CR)', left: 5.1, top: 20.6, width: 6.5, height: 20.7 },
      { id: 'CR', name: 'Pasillo CR', sector: 'Contenedor Rescate (CR)', left: 11.6, top: 19.3, width: 12.7, height: 65.0 },
      { id: 'AG', name: 'Almacén Generadores (AG)', sector: 'Zona Exterior', left: 33.9, top: 9.1, width: 19.5, height: 25.7 },
      { id: 'ZC', name: 'Zona Central Carga (ZC)', sector: 'Zona Exterior', left: 53.5, top: 9.1, width: 43.4, height: 40.9 },
      { id: 'CS', name: 'Contenedor Sanitario (CS)', sector: 'Contenedores', left: 29.1, top: 50.0, width: 24.3, height: 35.5 },
      { id: 'CI', name: 'Contenedor Incendios (CI)', sector: 'Contenedores', left: 68.0, top: 50.0, width: 19.3, height: 35.5 }
    ]
  },
  {
    id: 'garaje',
    altIds: ['truck'],
    name: 'Garaje E.9 (Camión BUP)',
    subtitle: 'Dotación Móvil del Autobomba Urbano Pesado',
    mapImage: 'assets/garaje-e9.jpg',
    zones: [
      { id: 'CABINA', name: 'Cabina de Conducción y Dotación', sector: 'Vehículo', left: 24.0, top: 45.8, width: 10.9, height: 20.1 },
      { id: 'P1-P2-P3', name: 'Persianas P1-P2-P3 (Lado Conductor)', sector: 'Persianas Laterales', left: 48.7, top: 72.6, width: 21.9, height: 18.0 },
      { id: 'P4-P5-P6', name: 'Persianas P4-P5-P6 (Lado Copiloto)', sector: 'Persianas Laterales', left: 48.7, top: 19.9, width: 21.9, height: 18.4 },
      { id: 'P7', name: 'Persiana Trasera P7 (Bomba Hidráulica)', sector: 'Bomba Trasera', left: 80.5, top: 45.8, width: 10.8, height: 18.4 }
    ]
  },
  {
    id: 'sala-coordinacion',
    altIds: [],
    name: 'Sala de Coordinación E.5',
    subtitle: 'Puesto de Mando Avanzado & Simulación',
    mapImage: 'assets/coordinacion-e5.jpg',
    zones: [
      { id: 'SC.1', name: 'Mesa de Profesor SC.1', sector: 'Mesas', left: 63.1, top: 74.0, width: 12.0, height: 8.5 },
      { id: 'SC.2', name: 'Mesa de Trabajo SC.2', sector: 'Mesas', left: 55.3, top: 24.2, width: 7.1, height: 33.4 },
      { id: 'SC.3', name: 'Mesa de Trabajo SC.3', sector: 'Mesas', left: 34.2, top: 24.2, width: 6.8, height: 33.4 },
      { id: 'SC.4', name: 'Mesa de Trabajo SC.4', sector: 'Mesas', left: 19.2, top: 8.9, width: 7.4, height: 33.5 },
      { id: 'SC.5', name: 'Mesa de Trabajo SC.5', sector: 'Mesas', left: 19.2, top: 42.6, width: 7.4, height: 33.4 },
      { id: 'SC.6', name: 'Mesa de Trabajo SC.6 (PMA)', sector: 'Mesas', left: 68.8, top: 38.0, width: 6.5, height: 33.4 },
      { id: 'SC.7', name: 'Mesa de Simulación SC.7', sector: 'Simulación', left: 68.8, top: 9.0, width: 6.4, height: 20.0 }
    ]
  },
  {
    id: 'seguridad',
    altIds: ['alm-5'],
    name: 'Seguridad',
    subtitle: 'Armarios Blindados, Simulador & Zona de Tiro',
    mapImage: 'assets/seguridad.jpg',
    zones: [
      { id: 'AS.1-2', name: 'Armario Seguridad AS.1-2', sector: 'Armarios Blindados', left: 15.2, top: 42.4, width: 4.5, height: 8.6 },
      { id: 'AS.3-4', name: 'Armario Seguridad AS.3-4', sector: 'Armarios Blindados', left: 19.7, top: 42.4, width: 4.5, height: 8.6 },
      { id: 'AS.5-6', name: 'Armario Seguridad AS.5-6', sector: 'Armarios Blindados', left: 15.2, top: 33.8, width: 4.5, height: 8.4 },
      { id: 'AS.7-8', name: 'Armario Seguridad AS.7-8', sector: 'Armarios Blindados', left: 19.7, top: 33.8, width: 4.5, height: 8.4 },
      { id: 'AS.9-10', name: 'Armario Seguridad AS.9-10', sector: 'Armarios Blindados', left: 15.2, top: 24.8, width: 4.5, height: 8.8 },
      { id: 'AS.11-12', name: 'Armario Seguridad AS.11-12', sector: 'Armarios Blindados', left: 19.7, top: 24.8, width: 4.5, height: 8.8 },
      { id: 'AS.13-14', name: 'Armario Seguridad AS.13-14', sector: 'Armarios Blindados', left: 15.2, top: 16.0, width: 4.5, height: 8.6 },
      { id: 'AS.15-16', name: 'Armario Seguridad AS.15-16', sector: 'Armarios Blindados', left: 19.7, top: 16.0, width: 4.5, height: 8.6 },
      { id: 'AS.17-18', name: 'Armario Seguridad AS.17-18', sector: 'Armarios Blindados', left: 15.2, top: 7.4, width: 4.5, height: 8.6 },
      { id: 'AS.19-20', name: 'Armario Seguridad AS.19-20', sector: 'Armarios Blindados', left: 19.7, top: 7.4, width: 4.5, height: 8.6 },
      
      { id: 'S.1', name: 'Perchas S.1', sector: 'Perchas y Módulos', left: 47.0, top: 89.2, width: 17.8, height: 6.0 },
      { id: 'S.2', name: 'Módulo S.2', sector: 'Perchas y Módulos', left: 57.7, top: 65.9, width: 7.6, height: 14.9 },
      { id: 'S.3', name: 'Percha S.3', sector: 'Perchas y Módulos', left: 62.2, top: 49.4, width: 3.1, height: 16.3 },
      { id: 'S.4', name: 'Percha S.4', sector: 'Perchas y Módulos', left: 15.1, top: 73.0, width: 3.8, height: 19.3 },
      { id: 'S.5', name: 'Módulo S.5', sector: 'Perchas y Módulos', left: 60.2, top: 7.7, width: 5.2, height: 16.5 },
      { id: 'S.6', name: 'Percha S.6', sector: 'Perchas y Módulos', left: 15.1, top: 59.4, width: 3.8, height: 8.9 },
      { id: 'S.7', name: 'Módulo S.7', sector: 'Perchas y Módulos', left: 60.2, top: 24.2, width: 4.5, height: 9.0 },
      { id: 'MESA DE TRABAJO S', name: 'Mesa de Trabajo S', sector: 'Mesas', left: 44.9, top: 81.0, width: 20.6, height: 7.8 },
      { id: 'MALETIN S.8', name: 'Maletín S.8', sector: 'Maletines', left: 47.0, top: 95.3, width: 8.8, height: 3.0 },
      { id: 'MALETIN S.9', name: 'Maletín S.9', sector: 'Maletines', left: 56.0, top: 95.3, width: 8.8, height: 3.0 },
      { id: 'MALETIN S.10', name: 'Maletín S.10', sector: 'Maletines', left: 15.1, top: 54.8, width: 7.2, height: 2.3 },
      { id: 'MALETIN S.11', name: 'Maletín S.11', sector: 'Maletines', left: 15.1, top: 57.1, width: 7.2, height: 2.3 },
      { id: 'MALETIN S.12', name: 'Maletín S.12', sector: 'Maletines', left: 15.1, top: 68.3, width: 7.2, height: 2.3 },
      { id: 'MALETIN S.13', name: 'Maletín S.13', sector: 'Maletines', left: 15.1, top: 70.6, width: 7.2, height: 2.3 },
      { id: 'SIMULADOR', name: 'Simulador', sector: 'Instalaciones', left: 24.8, top: 7.9, width: 35.2, height: 4.5 },
      { id: 'ZONA TIRO', name: 'Zona de Tiro', sector: 'Instalaciones', left: 34.9, top: 28.0, width: 15.1, height: 5.8 }
    ]
  }
];

// Compatibilidad: cada almacén expone su array 'shelves' como los ids de sus zonas
WAREHOUSES.forEach(w => {
  w.shelves = w.zones ? w.zones.map(z => z.id) : [];
});

const INITIAL_ITEMS = [
  {
    id: 'item-101',
    code: 'ALM1-A1-001',
    serial_number: 'SN-2023-0101',
    name: 'Equipo ERA Dräger PSS 5000 Completo',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-1',
    location_shelf: 'A.1',
    mfg_date: '2023-02-10',
    use_date: '2023-03-01',
    supplier: 'Dräger Safety Hispania',
    status: 'disponible',
    photo_url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=60',
    doc_url: 'https://www.draeger.com',
    observations: 'Botella de composite 300 bar de 6.8L. Retimbrado al día hasta 2028. Presión actual: 310 bar.',
    current_borrower: null,
    checkout_time: null,
    use_count: 18,
    usage_history: [
      { date: '2026-10-14 09:30', user: 'Prof. García', note: 'Práctica de búsqueda en humo' },
      { date: '2026-10-22 16:15', user: 'Prof. Martínez', note: 'Inspección de estanqueidad' }
    ]
  },
  {
    id: 'item-102',
    code: 'ALM1-A1-002',
    serial_number: 'SN-2023-0102',
    name: 'Equipo ERA Dräger PSS 5000 con máscara FPS 7000',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-1',
    location_shelf: 'A.1',
    mfg_date: '2023-02-10',
    use_date: '2023-03-01',
    supplier: 'Dräger Safety Hispania',
    status: 'sacado',
    photo_url: '',
    doc_url: '',
    observations: 'En uso en el simulador de flashover y humos.',
    current_borrower: 'Carlos Pérez (profesor@murciaeduca.es)',
    checkout_time: '2026-11-02 16:45',
    use_count: 24,
    usage_history: [
      { date: '2026-11-02 16:45', user: 'Carlos Pérez', note: 'Salida para simulación de rescate en espacios confinados' }
    ]
  },
  {
    id: 'item-103',
    code: 'ALM1-A2-005',
    serial_number: 'SN-2022-0941',
    name: 'Espaldera MSA AirGo con pulmoautomático',
    category: 'Rescate',
    warehouse_id: 'alm-1',
    location_shelf: 'A.2',
    mfg_date: '2022-05-14',
    use_date: '2022-06-01',
    supplier: 'MSA Safety España',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Acolchado ignífugo revisado.',
    current_borrower: null,
    checkout_time: null,
    use_count: 9,
    usage_history: []
  },
  {
    id: 'item-104',
    code: 'ALM2-B1-014',
    serial_number: 'SN-2021-4402',
    name: 'Manguera de impulsión 25mm 20m racores Barcelona',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-2',
    location_shelf: 'B.1',
    mfg_date: '2021-11-20',
    use_date: '2022-01-10',
    supplier: 'Iturri S.A.',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Tejido sintético de alta resistencia. Presión de rotura 50 bar.',
    current_borrower: null,
    checkout_time: null,
    use_count: 42,
    usage_history: []
  },
  {
    id: 'item-105',
    code: 'ALM2-B2-018',
    serial_number: 'SN-2024-0012',
    name: 'Bifurcación 70 a 2x45mm con llaves de bola',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-2',
    location_shelf: 'B.2',
    mfg_date: '2024-01-15',
    use_date: '2024-02-01',
    supplier: 'Rosenbauer Ibérica',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Aluminio forjado pulido con junta de nitrilo.',
    current_borrower: null,
    checkout_time: null,
    use_count: 6,
    usage_history: []
  },
  {
    id: 'item-106',
    code: 'ALM3-C1-022',
    serial_number: 'SN-2023-8831',
    name: 'Casco de Bombero Gallet F1XF con visor dorado',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-3',
    location_shelf: 'C.1',
    mfg_date: '2023-06-11',
    use_date: '2023-07-01',
    supplier: 'MSA Safety España',
    status: 'disponible',
    photo_url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=500&auto=format&fit=crop&q=60',
    doc_url: '',
    observations: 'Incluye linterna integrada LED ATEX y cubrenucas aluminizado.',
    current_borrower: null,
    checkout_time: null,
    use_count: 31,
    usage_history: []
  },
  {
    id: 'item-107',
    code: 'ALM3-C1-023',
    serial_number: 'SN-2020-1120',
    name: 'Azada Pulaski con mango de fibra de vidrio',
    category: 'Rescate',
    warehouse_id: 'alm-3',
    location_shelf: 'C.1',
    mfg_date: '2020-03-12',
    use_date: '2020-04-01',
    supplier: 'Vallfirest Tecnologías',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Afilado reciente. Herramienta reglamentaria forestal.',
    current_borrower: null,
    checkout_time: null,
    use_count: 58,
    usage_history: [
      { date: '2026-10-10 11:00', user: 'Prof. Ruiz', note: 'Práctica de líneas de defensa forestal' },
      { date: '2026-10-15 17:00', user: 'Prof. Ruiz', note: 'Manejo de herramientas de corte' },
      { date: '2026-10-23 10:30', user: 'Prof. Ruiz', note: 'Demostración de cortafuegos' }
    ]
  },
  {
    id: 'item-108',
    code: 'ALM4-A1-030',
    serial_number: 'SN-2019-3321',
    name: 'Camilla nido de rescate tipo Basket con eslingas',
    category: 'Sanitario',
    warehouse_id: 'alm-4',
    location_shelf: 'A.1',
    mfg_date: '2019-08-10',
    use_date: '2019-09-01',
    supplier: 'Ferno Medical',
    status: 'mantenimiento',
    photo_url: '',
    doc_url: '',
    observations: 'Correa central de inmovilización deshilachada. Enviar a revisión técnica.',
    current_borrower: null,
    checkout_time: null,
    use_count: 29,
    usage_history: []
  },
  {
    id: 'item-109',
    code: 'ALM5-B3-044',
    serial_number: 'SN-2022-7719',
    name: 'Detector Multigás Dräger X-am 2500 (O2, CO, H2S, Ex)',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-5',
    location_shelf: 'B.3',
    mfg_date: '2022-09-01',
    use_date: '2022-10-01',
    supplier: 'Dräger Safety Hispania',
    status: 'extraviado',
    photo_url: '',
    doc_url: '',
    observations: 'Extraviado durante la maniobra exterior en el polígono. Se mantiene en la base de datos como no disponible para seguimiento.',
    current_borrower: null,
    checkout_time: null,
    use_count: 14,
    usage_history: [
      { date: '2026-10-26 12:00', user: 'Javier Coordinador', note: 'Notificado como extraviado en auditoría' }
    ]
  },
  {
    id: 'item-110',
    code: 'TRUCK-A1-001',
    serial_number: 'SN-CAM-001',
    name: 'Motosierra de salvamento Stihl MS 462 C-M R con cadena widia',
    category: 'Rescate',
    warehouse_id: 'truck',
    location_shelf: 'A.1',
    mfg_date: '2023-04-12',
    use_date: '2023-05-01',
    supplier: 'Stihl España',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Dotación oficial del Autobomba Urbano Pesado (BUP). Tope de profundidad regulable.',
    current_borrower: null,
    checkout_time: null,
    use_count: 19,
    usage_history: []
  },
  {
    id: 'item-111',
    code: 'TRUCK-B1-004',
    serial_number: 'SN-CAM-004',
    name: 'Cizalla de corte Lukas eDRAULIC a batería',
    category: 'Rescate',
    warehouse_id: 'garaje',
    location_shelf: 'P4-P5-P6',
    mfg_date: '2022-10-10',
    use_date: '2022-11-01',
    supplier: 'Lukas Hydraulik',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Fuerza de corte 105 toneladas. Ubicada en persianas derechas P4-P5-P6 del camión.',
    current_borrower: null,
    checkout_time: null,
    use_count: 36,
    usage_history: []
  },
  {
    id: 'item-112',
    code: 'E19-A9-010',
    serial_number: 'SN-EPI-0910',
    name: 'Traje de Intervención Estructural S-Gard Nivel 2',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-principal',
    location_shelf: 'A.9',
    mfg_date: '2023-08-01',
    use_date: '2023-09-15',
    supplier: 'S-Gard Safety',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Norma EN 469. Membrana GORE-TEX AIRLOCK. Ubicado en perchas A.9.',
    current_borrower: null,
    checkout_time: null,
    use_count: 12,
    usage_history: []
  },
  {
    id: 'item-113',
    code: 'E19-C1-020',
    serial_number: 'SN-ERA-0820',
    name: 'Botellas de Aire Comprimido 300 bar Composite (x4)',
    category: 'Incendios e Industrial',
    warehouse_id: 'alm-principal',
    location_shelf: 'C.1',
    mfg_date: '2023-01-20',
    use_date: '2023-02-10',
    supplier: 'Dräger Safety Hispania',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Presión de servicio 300 bar. Colocadas en perchas de recarga para ERAs C.1.',
    current_borrower: null,
    checkout_time: null,
    use_count: 45,
    usage_history: []
  },
  {
    id: 'item-114',
    code: 'E14-F1-001',
    serial_number: 'SN-FOR-0101',
    name: 'Mochila Extintora Forestal Vallfirest 20L',
    category: 'Rescate',
    warehouse_id: 'alm-forestales',
    location_shelf: 'F.1',
    mfg_date: '2022-04-10',
    use_date: '2022-05-01',
    supplier: 'Vallfirest Tecnologías',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Bomba de doble efecto cromada, lona termosellada con tirantes acolchados.',
    current_borrower: null,
    checkout_time: null,
    use_count: 28,
    usage_history: []
  },
  {
    id: 'item-115',
    code: 'E14-F2-005',
    serial_number: 'SN-FOR-0205',
    name: 'Batefuegos Forestal con Mango de Fresno Barnizado',
    category: 'Rescate',
    warehouse_id: 'alm-forestales',
    location_shelf: 'F.2',
    mfg_date: '2021-09-15',
    use_date: '2021-10-01',
    supplier: 'Vallfirest Tecnologías',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Pala de caucho autoextinguible reforzada con tejido interior de poliéster.',
    current_borrower: null,
    checkout_time: null,
    use_count: 51,
    usage_history: []
  },
  {
    id: 'item-116',
    code: 'CR-1-001',
    serial_number: 'SN-RES-3301',
    name: 'Trípode de Rescate en Espacios Confinados Tractel',
    category: 'Rescate',
    warehouse_id: 'contenedor',
    location_shelf: 'CR.1',
    mfg_date: '2020-11-05',
    use_date: '2021-01-10',
    supplier: 'Tractel Ibérica',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Carga nominal 500 kg. Patas telescópicas con cadena perimetral de seguridad.',
    current_borrower: null,
    checkout_time: null,
    use_count: 17,
    usage_history: []
  },
  {
    id: 'item-117',
    code: 'AG-01-010',
    serial_number: 'SN-GEN-5510',
    name: 'Grupo Electrógeno Inverter Pramac 3.5 kW',
    category: 'Incendios e Industrial',
    warehouse_id: 'contenedor',
    location_shelf: 'AG',
    mfg_date: '2022-03-18',
    use_date: '2022-04-01',
    supplier: 'Pramac Generadores',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Gasolina 4 tiempos, arranque manual y eléctrico con tomas Schuko estancas.',
    current_borrower: null,
    checkout_time: null,
    use_count: 22,
    usage_history: []
  },
  {
    id: 'item-118',
    code: 'BUP-CAB-001',
    serial_number: 'SN-TEL-9901',
    name: 'Radiotransmisor Portátil Sepura STP9000 TETRA',
    category: 'Incendios e Industrial',
    warehouse_id: 'garaje',
    location_shelf: 'CABINA',
    mfg_date: '2023-05-12',
    use_date: '2023-06-01',
    supplier: 'Teltronic S.A.',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Canales oficiales de Emergencias 112 Murcia y CARM pregrabados con GPS.',
    current_borrower: null,
    checkout_time: null,
    use_count: 64,
    usage_history: []
  },
  {
    id: 'item-119',
    code: 'BUP-P13-005',
    serial_number: 'SN-HOL-1005',
    name: 'Separador Hidráulico Holmatro SP 5240 CORE',
    category: 'Rescate',
    warehouse_id: 'garaje',
    location_shelf: 'P1-P2-P3',
    mfg_date: '2022-07-22',
    use_date: '2022-08-15',
    supplier: 'Holmatro Rescue',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Presión 720 bar, apertura 725 mm con puntas de tracción para excarcelación.',
    current_borrower: null,
    checkout_time: null,
    use_count: 38,
    usage_history: []
  },
  {
    id: 'item-120',
    code: 'SC-1-001',
    serial_number: 'SN-PMA-001',
    name: 'Estación de Mando Portátil y Cartografía PMA',
    category: 'Rescate',
    warehouse_id: 'sala-coordinacion',
    location_shelf: 'SC.1',
    mfg_date: '2023-09-01',
    use_date: '2023-10-01',
    supplier: 'Sistemas Tácticos CARM',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Ubicado en la Mesa de Profesor SC.1 de la Sala de Coordinación E.5.',
    current_borrower: null,
    checkout_time: null,
    use_count: 15,
    usage_history: []
  },
  {
    id: 'item-121',
    code: 'SEG-AS12-001',
    serial_number: 'SN-GAS-5012',
    name: 'Detector de Gases Portátil Dräger X-am 5000',
    category: 'Incendios e Industrial',
    warehouse_id: 'seguridad',
    location_shelf: 'AS.1-2',
    mfg_date: '2023-03-10',
    use_date: '2023-04-01',
    supplier: 'Dräger Safety Hispania',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Sensores de O2, CO, H2S, LEL calibrados. En armario blindado AS.1-2.',
    current_borrower: null,
    checkout_time: null,
    use_count: 33,
    usage_history: []
  },
  {
    id: 'item-122',
    code: 'SEG-AS56-005',
    serial_number: 'SN-FLIR-5505',
    name: 'Cámara Térmica FLIR K55 de Rescate y Búsqueda',
    category: 'Incendios e Industrial',
    warehouse_id: 'seguridad',
    location_shelf: 'AS.5-6',
    mfg_date: '2022-12-01',
    use_date: '2023-01-15',
    supplier: 'Teledyne FLIR',
    status: 'disponible',
    photo_url: '',
    doc_url: '',
    observations: 'Resolución 320x240 con modo FSX y almacenamiento de capturas de práctica.',
    current_borrower: null,
    checkout_time: null,
    use_count: 41,
    usage_history: []
  }
];

const INITIAL_CHECKOUTS = [
  {
    id: 'chk-001',
    receipt_code: '0001.16:45.02112026',
    item_id: 'item-102',
    item_code: 'ALM1-A1-002',
    item_name: 'Equipo ERA Dräger PSS 5000 con máscara FPS 7000',
    borrower_name: 'Carlos Pérez',
    borrower_email: 'profesor@murciaeduca.es',
    purpose: 'Práctica de búsqueda en humo y rescate interior',
    checkout_time: '2026-11-02 16:45',
    checkin_time: null,
    status: 'activo',
    checkin_notes: null
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    created_at: '2026-11-02 16:45:10',
    user_name: 'Carlos Pérez',
    user_email: 'profesor@murciaeduca.es',
    action: 'SALIDA',
    item_id: 'item-102',
    item_code: 'ALM1-A1-002',
    item_name: 'Equipo ERA Dräger PSS 5000 con máscara FPS 7000',
    details: 'Salida autorizada para simulador de humos. Vale: 0001.16:45.02112026'
  },
  {
    id: 'log-002',
    created_at: '2026-10-26 12:00:22',
    user_name: 'Javier Coordinador',
    user_email: 'admin@murciaeduca.es',
    action: 'EXTRAVIO',
    item_id: 'item-109',
    item_code: 'ALM5-B3-044',
    item_name: 'Detector Multigás Dräger X-am 2500',
    details: 'Material marcado como extraviado tras maniobra exterior. Permanece registrado para trazabilidad.'
  },
  {
    id: 'log-003',
    created_at: '2026-10-22 16:30:15',
    user_name: 'Javier Coordinador',
    user_email: 'admin@murciaeduca.es',
    action: 'ALTA',
    item_id: 'item-105',
    item_code: 'ALM2-B2-018',
    item_name: 'Bifurcación 70 a 2x45mm con llaves de bola',
    details: 'Recepción de nuevo suministro del proveedor Rosenbauer Ibérica.'
  }
];

class Store {
  constructor() {
    this.warehouses = WAREHOUSES;
    this.items = [];
    this.checkouts = [];
    this.auditLogs = [];
    this.users = [];
    this.currentUser = null;
    this.onlineUsersCount = 1;
    this._realtimeSubscribed = false;
    this._syncInFlight = null;

    this.init();
  }

  generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  isValidUUID(str) {
    return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  init() {
    // MODO SUPABASE ESTRICTO: eliminar cachés locales de datos y operar solo desde la nube
    localStorage.removeItem('kronos_items');
    localStorage.removeItem('kronos_checkouts');
    localStorage.removeItem('kronos_audit');
    localStorage.removeItem('kronos_users');

    this.items = [];
    this.checkouts = [];
    this.auditLogs = [];
    this.users = [];

    // Cargar sesión activa únicamente para revalidarla contra Supabase al arrancar
    const session = localStorage.getItem('kronos_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
        if (this.currentUser && this.currentUser.email && this.currentUser.email.endsWith('@carm.es')) {
          this.currentUser.email = this.currentUser.email.replace(/@carm\.es$/i, '@murciaeduca.es');
        }
      } catch (e) {
        this.currentUser = null;
      }
    }

    this.saveToStorage();
  }

  saveToStorage() {
    if (this.currentUser) {
      localStorage.setItem('kronos_session', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('kronos_session');
    }
  }

  requireSupabase() {
    if (!window.supabaseService || !window.supabaseService.isOnline()) {
      const msg = 'Sin conexión con Supabase. La aplicación no opera en modo local.';
      if (window.app) {
        window.app.showToast(msg, 'error');
        if (typeof window.app.enforceSupabaseGate === 'function') {
          window.app.enforceSupabaseGate();
        }
      }
      return false;
    }
    return true;
  }

  refreshAllActiveViews() {
    if (window.inventoryManager) window.inventoryManager.renderTable();
    if (window.checkoutsManager) window.checkoutsManager.renderActiveCheckoutsTable();
    if (window.auditManager) window.auditManager.renderLogs();
    if (window.warehouseMapViewer && window.app && window.app.currentView === 'warehouse') {
      window.warehouseMapViewer.renderWarehouseView(window.warehouseMapViewer.currentWarehouseId);
    }
    if (window.app) {
      window.app.updateDashboardStats();
      window.app.renderUsersList();
    }
  }

  setupRealtimeSubscription() {
    if (!window.supabaseService || !window.supabaseService.isOnline()) return;
    if (this._realtimeSubscribed) return;

    const client = window.supabaseService.client;
    if (!client || typeof client.channel !== 'function') return;

    try {
      this._realtimeSubscribed = true;
      this._realtimeChannel = client
        .channel('kronos-shared-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            if (!this.auditLogs.some(l => l.id === payload.new.id)) {
              this.auditLogs.unshift(payload.new);
              this.saveToStorage();
              if (window.auditManager) window.auditManager.renderLogs();
              if (window.app) window.app.updateDashboardStats();
            }
          } else {
            this.trySupabaseSync(false);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
          this.trySupabaseSync(false);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'checkouts' }, () => {
          this.trySupabaseSync(false);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          this.trySupabaseSync(false);
        })
        .subscribe();
    } catch (err) {
      console.warn('No se pudo suscribir a Realtime de Supabase:', err);
    }
  }

  async trySupabaseSync(forceToast = false) {
    if (!window.supabaseService) return false;
    if (this._syncInFlight) return this._syncInFlight;

    this._syncInFlight = (async () => {
      try {
        if (!window.supabaseService.isOnline()) {
          const verified = await window.supabaseService.verifyLiveConnection();
          if (!verified) {
            this.items = [];
            this.checkouts = [];
            this.auditLogs = [];
            this.users = [];
            this.refreshAllActiveViews();
            if (window.app && typeof window.app.updateDbStatusChip === 'function') {
              window.app.updateDbStatusChip();
            }
            return false;
          }
        }

        const client = window.supabaseService.client;

        // 1. Sincronizar Inventario (items)
        const { data: dbItems, error: itemsErr } = await client
          .from('items')
          .select('*')
          .order('code', { ascending: true });

        if (itemsErr) throw itemsErr;
        this.items = Array.isArray(dbItems) ? dbItems : [];

        // 2. Sincronizar Material en Uso (checkouts)
        const { data: dbCheckouts, error: chkErr } = await client
          .from('checkouts')
          .select('*')
          .order('checkout_time', { ascending: false });

        if (chkErr) throw chkErr;
        this.checkouts = Array.isArray(dbCheckouts) ? dbCheckouts : [];

        // 3. Sincronizar Logs Compartidos (audit_logs) para TODOS los usuarios
        const { data: dbLogs, error: logsErr } = await client
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500);

        if (logsErr) throw logsErr;
        this.auditLogs = Array.isArray(dbLogs) ? dbLogs : [];

        // 4. Sincronizar Perfiles de Profesorado (profiles)
        const { data: dbProfiles, error: profErr } = await client
          .from('profiles')
          .select('*');

        if (profErr) throw profErr;
        this.users = (Array.isArray(dbProfiles) ? dbProfiles : []).map(p => ({
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          role: p.role || 'profesor',
          department: p.department || 'Emergencias y Protección Civil',
          password: p.password || null
        }));

        this.saveToStorage();
        this.refreshAllActiveViews();
        this.setupRealtimeSubscription();

        if (window.app && typeof window.app.updateDbStatusChip === 'function') {
          window.app.updateDbStatusChip();
        }
        if (forceToast && window.app) {
          window.app.showToast('Base de datos y logs sincronizados con Supabase', 'success');
        }
        return true;
      } catch (err) {
        console.error('Error de conexión / sincronización con Supabase:', err);
        window.supabaseService.markDisconnected(err.message || 'Error de conexión con Supabase');
        this.items = [];
        this.checkouts = [];
        this.auditLogs = [];
        this.users = [];
        this.refreshAllActiveViews();
        if (window.app) {
          window.app.updateDbStatusChip();
          if (typeof window.app.enforceSupabaseGate === 'function') {
            window.app.enforceSupabaseGate();
          }
        }
        return false;
      } finally {
        this._syncInFlight = null;
      }
    })();

    return this._syncInFlight;
  }

  // --- MÉTODOS DE MATERIALES ---
  getItems(filters = {}) {
    let result = [...this.items];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(item => 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.serial_number && item.serial_number.toLowerCase().includes(q)) ||
        (item.supplier && item.supplier.toLowerCase().includes(q)) ||
        (item.location_shelf && item.location_shelf.toLowerCase().includes(q))
      );
    }

    if (filters.warehouse && filters.warehouse !== 'all') {
      result = result.filter(item => {
        if (item.warehouse_id === filters.warehouse) return true;
        const wh = WAREHOUSES.find(w => w.id === filters.warehouse || (w.altIds && w.altIds.includes(filters.warehouse)));
        if (wh) {
          return item.warehouse_id === wh.id || (wh.altIds && wh.altIds.includes(item.warehouse_id));
        }
        return false;
      });
    }

    if (filters.shelf && filters.shelf !== 'all') {
      const s = filters.shelf.toLowerCase().trim();
      result = result.filter(item => item.location_shelf && item.location_shelf.toLowerCase() === s);
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }

    return result;
  }

  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  addItem(newItem) {
    if (!this.requireSupabase()) return null;
    const item = {
      id: this.generateUUID(),
      code: newItem.code || `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      serial_number: newItem.serial_number || 'S/N',
      name: newItem.name,
      category: newItem.category || 'Incendios e Industrial',
      warehouse_id: newItem.warehouse_id || 'alm-principal',
      location_shelf: newItem.location_shelf || 'A.1',
      mfg_date: newItem.mfg_date || null,
      use_date: newItem.use_date || new Date().toISOString().split('T')[0],
      supplier: newItem.supplier || 'Proveedor oficial',
      status: 'disponible',
      photo_url: newItem.photo_url || '',
      doc_url: newItem.doc_url || '',
      observations: newItem.observations || '',
      current_borrower: null,
      checkout_time: null,
      use_count: 0,
      usage_history: []
    };

    this.items.unshift(item);
    this.saveToStorage();

    this.addAuditLog('ALTA', item.code, item.name, `Material dado de alta en ${item.warehouse_id} sección ${item.location_shelf}`, item.id);

    // Si está conectado a Supabase, enviar inserción
    if (window.supabaseService && window.supabaseService.isOnline()) {
      window.supabaseService.client.from('items').insert([item]).then(({ error }) => {
        if (error) console.error('Error guardando item en Supabase:', error);
      });
    }

    return item;
  }

  updateItem(id, updates) {
    if (!this.requireSupabase()) return null;
    const index = this.items.findIndex(it => it.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
      this.saveToStorage();

      const detailMsg = updates.observations !== undefined
        ? 'Actualización de observaciones técnicas en ficha'
        : 'Edición de ficha de material';
      this.addAuditLog('MODIFICACION', this.items[index].code, this.items[index].name, detailMsg, this.items[index].id);

      if (window.supabaseService && window.supabaseService.isOnline()) {
        const matchCol = this.isValidUUID(id) ? 'id' : 'code';
        const matchVal = this.isValidUUID(id) ? id : this.items[index].code;
        window.supabaseService.client.from('items').update(updates).eq(matchCol, matchVal).then(({ error }) => {
          if (error) console.error('Error actualizando item en Supabase:', error);
        });
      }
      return this.items[index];
    }
    return null;
  }

  deleteItem(id) {
    if (!this.requireSupabase()) return false;
    const item = this.getItemById(id);
    if (!item) return false;

    this.items = this.items.filter(it => it.id !== id);
    this.saveToStorage();

    this.addAuditLog('BAJA', item.code, item.name, 'Material dado de baja del inventario');

    if (window.supabaseService && window.supabaseService.isOnline()) {
      const matchCol = this.isValidUUID(id) ? 'id' : 'code';
      const matchVal = this.isValidUUID(id) ? id : item.code;
      window.supabaseService.client.from('items').delete().eq(matchCol, matchVal).then(({ error }) => {
        if (error) console.error('Error eliminando item en Supabase:', error);
      });
    }
    return true;
  }

  markItemLost(id, reason) {
    if (!this.requireSupabase()) return false;
    const item = this.getItemById(id);
    if (!item) return false;

    const oldObservations = item.observations ? item.observations + ' | ' : '';
    item.status = 'extraviado';
    item.observations = oldObservations + `EXTRAVIADO (${new Date().toLocaleDateString()}): ${reason}`;
    item.current_borrower = null;

    if (!item.usage_history) item.usage_history = [];
    item.usage_history.unshift({
      date: new Date().toLocaleString(),
      user: this.currentUser ? this.currentUser.full_name : 'Usuario',
      note: `Marcado como extraviado: ${reason}`
    });

    this.saveToStorage();
    this.addAuditLog('EXTRAVIO', item.code, item.name, `Motivo: ${reason}`, item.id);

    if (window.supabaseService && window.supabaseService.isOnline()) {
      const matchCol = this.isValidUUID(id) ? 'id' : 'code';
      const matchVal = this.isValidUUID(id) ? id : item.code;
      window.supabaseService.client.from('items').update({
        status: 'extraviado',
        observations: item.observations
      }).eq(matchCol, matchVal).then(({ error }) => {
        if (error) console.error('Error marcando extravío en Supabase:', error);
      });
    }
    return true;
  }

  // --- MÉTODOS DE CAMBIO DE ESTADO EN LOTE (Mantenimiento, Fuera de Mantenimiento, Extraviado, Borrado) ---

  setItemsMaintenance(itemIds, notes = 'Mantenimiento preventivo / correctivo') {
    if (!this.requireSupabase()) return { success: false, count: 0 };
    if (!Array.isArray(itemIds) || itemIds.length === 0) return { success: false, count: 0 };
    let count = 0;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const mins = pad(now.getMinutes());
    const nowFormatted = `${year}-${month}-${day} ${hours}:${mins}`;
    const nowIso = now.toISOString();

    const borrowerName = this.currentUser ? `${this.currentUser.full_name} (Taller)` : 'Taller Mantenimiento';
    const borrowerEmail = this.currentUser ? this.currentUser.email : 'taller@murciaeduca.es';

    itemIds.forEach(id => {
      const item = this.getItemById(id);
      if (!item) return;

      item.status = 'mantenimiento';
      item.current_borrower = borrowerName;
      item.checkout_time = nowIso;

      if (!item.usage_history) item.usage_history = [];
      item.usage_history.unshift({
        date: nowFormatted,
        user: this.currentUser ? this.currentUser.full_name : 'Profesor',
        note: `Enviado a taller/mantenimiento: ${notes}`
      });

      // Crear registro activo en Material en Uso (public.en_uso)
      const seq = String(this.checkouts.length + 1).padStart(4, '0');
      const receiptCode = `${seq}.${hours}:${mins}.${day}${month}${year}`;
      const chkId = this.generateUUID();

      const checkoutDbRecord = {
        id: chkId,
        receipt_code: receiptCode,
        item_id: this.isValidUUID(item.id) ? item.id : null,
        item_code: item.code,
        item_name: item.name,
        borrower_name: borrowerName,
        borrower_email: borrowerEmail,
        purpose: `Mantenimiento: ${notes}`,
        checkout_time: nowIso,
        checkin_time: null,
        status: 'activo',
        checkin_notes: null
      };

      const checkoutLocalRecord = {
        ...checkoutDbRecord,
        item_id: item.id,
        destination: 'Taller / Mantenimiento',
        type: 'mantenimiento',
        notes: notes
      };
      this.checkouts.unshift(checkoutLocalRecord);

      this.addAuditLog('MANTENIMIENTO', item.code, item.name, `Enviado a mantenimiento: ${notes}`, item.id);

      if (window.supabaseService && window.supabaseService.isOnline()) {
        window.supabaseService.client.from('items').update({
          status: 'mantenimiento',
          current_borrower: borrowerName,
          checkout_time: nowIso
        }).eq('id', item.id).then(({ error }) => {
          if (error) console.error('Error actualizando item en mantenimiento en Supabase:', error);
        });

        window.supabaseService.client.from('checkouts').insert([checkoutDbRecord]).then(({ error }) => {
          if (error) console.error('Error insertando checkout de mantenimiento en Supabase:', error);
        });
      }

      count++;
    });

    this.saveToStorage();
    return { success: true, count };
  }

  clearItemsMaintenance(itemIds) {
    if (!this.requireSupabase()) return { success: false, count: 0 };
    if (!Array.isArray(itemIds) || itemIds.length === 0) return { success: false, count: 0 };
    let count = 0;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const mins = pad(now.getMinutes());
    const nowFormatted = `${year}-${month}-${day} ${hours}:${mins}`;
    const nowIso = now.toISOString();

    itemIds.forEach(id => {
      const item = this.getItemById(id);
      if (!item) return;

      item.status = 'disponible';
      item.current_borrower = null;
      item.checkout_time = null;

      if (!item.usage_history) item.usage_history = [];
      item.usage_history.unshift({
        date: nowFormatted,
        user: this.currentUser ? this.currentUser.full_name : 'Profesor',
        note: 'Fin de mantenimiento. Reincorporado al inventario general disponible.'
      });

      // Cerrar checkouts activos de mantenimiento en checkouts (Material en Uso)
      this.checkouts.forEach(chk => {
        if ((chk.item_id === item.id || chk.item_code === item.code) && chk.status === 'activo') {
          chk.status = 'devuelto';
          chk.checkin_time = nowIso;
          chk.checkin_notes = 'Fin de mantenimiento. Equipo operativo.';

          if (window.supabaseService && window.supabaseService.isOnline() && this.isValidUUID(chk.id)) {
            window.supabaseService.client.from('checkouts').update({
              status: 'devuelto',
              checkin_time: nowIso,
              checkin_notes: 'Fin de mantenimiento'
            }).eq('id', chk.id).then(({ error }) => {
              if (error) console.error('Error cerrando checkout mantenimiento en Supabase:', error);
            });
          }
        }
      });

      this.addAuditLog('FIN_MANTENIMIENTO', item.code, item.name, 'Fin de mantenimiento. Reincorporado como disponible.', item.id);

      if (window.supabaseService && window.supabaseService.isOnline()) {
        const matchCol = this.isValidUUID(item.id) ? 'id' : 'code';
        const matchVal = this.isValidUUID(item.id) ? item.id : item.code;
        window.supabaseService.client.from('items').update({
          status: 'disponible',
          current_borrower: null,
          checkout_time: null
        }).eq(matchCol, matchVal).then(({ error }) => {
          if (error) console.error('Error limpiando mantenimiento en Supabase:', error);
        });
      }

      count++;
    });

    this.saveToStorage();
    return { success: true, count };
  }

  setItemsLost(itemIds, reason = 'No localizado') {
    if (!this.requireSupabase()) return { success: false, count: 0 };
    if (!Array.isArray(itemIds) || itemIds.length === 0) return { success: false, count: 0 };
    let count = 0;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const mins = pad(now.getMinutes());
    const nowFormatted = `${year}-${month}-${day} ${hours}:${mins}`;

    itemIds.forEach(id => {
      const item = this.getItemById(id);
      if (!item) return;

      item.status = 'extraviado';
      item.current_borrower = null;
      item.checkout_time = null;
      const oldObs = item.observations ? item.observations + ' | ' : '';
      item.observations = oldObs + `EXTRAVIADO (${now.toLocaleDateString()}): ${reason}`;

      if (!item.usage_history) item.usage_history = [];
      item.usage_history.unshift({
        date: nowFormatted,
        user: this.currentUser ? this.currentUser.full_name : 'Profesor',
        note: `Marcado como extraviado: ${reason}`
      });

      // Cerrar checkouts activos si estaba en uso
      this.checkouts.forEach(chk => {
        if (chk.item_id === item.id && chk.status === 'activo') {
          chk.status = 'devuelto';
          chk.checkin_time = nowFormatted;
          chk.checkin_notes = `Extraviado: ${reason}`;
        }
      });

      this.addAuditLog('EXTRAVIO', item.code, item.name, `Motivo: ${reason}`, item.id);

      if (window.supabaseService && window.supabaseService.isOnline()) {
        window.supabaseService.client.from('items').update({
          status: 'extraviado',
          observations: item.observations,
          current_borrower: null,
          checkout_time: null
        }).eq('id', item.id).then();
      }

      count++;
    });

    this.saveToStorage();
    return { success: true, count };
  }

  deleteMultipleItems(itemIds) {
    if (!this.requireSupabase()) return { success: false, count: 0 };
    if (!Array.isArray(itemIds) || itemIds.length === 0) return { success: false, count: 0 };
    let count = 0;

    const codesToDelete = [];
    itemIds.forEach(id => {
      const item = this.getItemById(id);
      if (item) {
        codesToDelete.push(item.code);
        this.addAuditLog('BAJA', item.code, item.name, 'Eliminado de la base de datos por Administrador.', item.id);
        count++;
      }
    });

    this.items = this.items.filter(it => !itemIds.includes(it.id));

    if (window.supabaseService && window.supabaseService.isOnline()) {
      const validUuids = itemIds.filter(id => this.isValidUUID(id));
      if (validUuids.length > 0) {
        window.supabaseService.client.from('items').delete().in('id', validUuids).then(({ error }) => {
          if (error) console.error('Error borrando items en Supabase:', error);
        });
      }
      if (codesToDelete.length > 0 && validUuids.length !== itemIds.length) {
        window.supabaseService.client.from('items').delete().in('code', codesToDelete).then();
      }
    }

    this.saveToStorage();
    return { success: true, count };
  }

  // --- MÉTODOS DE SALIDAS Y DEVOLUCIONES ---
  checkoutItem(itemId, borrowerName, borrowerEmail, purpose) {
    if (!this.requireSupabase()) return { success: false, message: 'Sin conexión con Supabase' };
    const item = this.getItemById(itemId);
    if (!item) return { success: false, message: 'Material no encontrado' };
    if (item.status === 'sacado') return { success: false, message: 'El material ya se encuentra fuera del centro' };
    if (item.status === 'extraviado') return { success: false, message: 'El material está marcado como extraviado' };

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const mins = pad(now.getMinutes());
    const seq = String(this.checkouts.length + 1).padStart(4, '0');
    
    // Código de registro formato pedido: 0001.15:35.27102026
    const receiptCode = `${seq}.${hours}:${mins}.${day}${month}${year}`;
    const checkoutTimeFormatted = `${year}-${month}-${day} ${hours}:${mins}`;
    const nowIso = now.toISOString();

    item.status = 'sacado';
    item.current_borrower = `${borrowerName} (${borrowerEmail})`;
    item.checkout_time = nowIso;
    item.use_count = (item.use_count || 0) + 1;

    if (!item.usage_history) item.usage_history = [];
    item.usage_history.unshift({
      date: checkoutTimeFormatted,
      user: borrowerName,
      note: `Salida autorizada (${purpose}) - Vale: ${receiptCode}`
    });

    const chkId = this.generateUUID();
    const checkoutRecord = {
      id: chkId,
      receipt_code: receiptCode,
      item_id: item.id,
      item_code: item.code,
      item_name: item.name,
      borrower_name: borrowerName,
      borrower_email: borrowerEmail,
      purpose: purpose || 'Práctica docente',
      checkout_time: nowIso,
      checkin_time: null,
      status: 'activo',
      checkin_notes: null
    };

    this.checkouts.unshift(checkoutRecord);
    this.saveToStorage();

    this.addAuditLog('SALIDA', item.code, item.name, `Retirado por ${borrowerName} (${borrowerEmail}). Motivo: ${purpose}. Vale: ${receiptCode}`, item.id);

    if (window.supabaseService && window.supabaseService.isOnline()) {
      window.supabaseService.client.from('items').update({
        status: 'sacado',
        current_borrower: item.current_borrower,
        checkout_time: nowIso,
        use_count: item.use_count
      }).eq('id', item.id).then(({ error }) => {
        if (error) console.error('Error actualizando item en salida Supabase:', error);
      });

      const dbPayload = {
        ...checkoutRecord,
        item_id: this.isValidUUID(item.id) ? item.id : null
      };
      window.supabaseService.client.from('checkouts').insert([dbPayload]).then(({ error }) => {
        if (error) console.error('Error insertando checkout en Supabase:', error);
      });
    }

    return { success: true, receiptCode, checkoutRecord, item };
  }

  checkinItem(checkoutId, notes = '', condition = 'disponible') {
    if (!this.requireSupabase()) return { success: false, message: 'Sin conexión con Supabase' };
    const chk = this.checkouts.find(c => c.id === checkoutId);
    if (!chk) return { success: false, message: 'Registro de salida no encontrado' };

    const item = this.getItemById(chk.item_id) || this.items.find(i => i.code === chk.item_code);
    const nowFormatted = new Date().toLocaleString();
    const nowIso = new Date().toISOString();

    chk.status = 'devuelto';
    chk.checkin_time = nowIso;
    chk.checkin_notes = notes;

    if (item) {
      item.status = condition; // 'disponible', 'mantenimiento' o 'extraviado'
      item.current_borrower = null;
      item.checkout_time = null;

      if (!item.usage_history) item.usage_history = [];
      item.usage_history.unshift({
        date: nowFormatted,
        user: this.currentUser ? this.currentUser.full_name : 'Profesor',
        note: `Reingreso al almacén (${condition}). Notas: ${notes || 'Sin incidencias'}`
      });

      if (condition === 'mantenimiento') {
        item.observations = (item.observations ? item.observations + ' | ' : '') + `Daño detectado en entrega: ${notes}`;
      }
    }

    this.saveToStorage();
    this.addAuditLog('DEVOLUCION', chk.item_code, chk.item_name, `Devuelto por ${chk.borrower_name}. Estado: ${condition}. Notas: ${notes || 'Correcto'}`, chk.item_id);

    if (window.supabaseService && window.supabaseService.isOnline()) {
      window.supabaseService.client.from('checkouts').update({
        status: 'devuelto',
        checkin_time: nowIso,
        checkin_notes: notes
      }).eq('id', checkoutId).then(({ error }) => {
        if (error) console.error('Error actualizando devolución en Supabase checkouts:', error);
      });

      if (item) {
        window.supabaseService.client.from('items').update({
          status: item.status,
          current_borrower: null,
          checkout_time: null,
          observations: item.observations
        }).eq('id', item.id).then(({ error }) => {
          if (error) console.error('Error actualizando devolución en Supabase items:', error);
        });
      }
    }

    return { success: true, item };
  }

  // --- SALIDA MÚLTIPLE DE MATERIALES SELECCIONADOS ---
  checkoutMultipleItems(itemIds, borrowerName, borrowerEmail, purpose) {
    if (!this.requireSupabase()) return { success: false, message: 'Sin conexión con Supabase' };
    const validItems = [];
    for (const id of itemIds) {
      const item = this.getItemById(id);
      if (item && item.status === 'disponible') {
        validItems.push(item);
      }
    }

    if (validItems.length === 0) {
      return { success: false, message: 'Ninguno de los materiales seleccionados está actualmente disponible.' };
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const mins = pad(now.getMinutes());
    const seq = String(this.checkouts.length + 1).padStart(4, '0');
    const receiptCode = `${seq}.${hours}:${mins}.${day}${month}${year}`;
    const checkoutTimeFormatted = `${year}-${month}-${day} ${hours}:${mins}`;
    const nowIso = now.toISOString();

    const createdCheckouts = [];

    for (const item of validItems) {
      item.status = 'sacado';
      item.current_borrower = `${borrowerName} (${borrowerEmail})`;
      item.checkout_time = nowIso;
      item.use_count = (item.use_count || 0) + 1;

      if (!item.usage_history) item.usage_history = [];
      item.usage_history.unshift({
        date: checkoutTimeFormatted,
        user: borrowerName,
        note: `Salida autorizada (${purpose}) - Vale: ${receiptCode}`
      });

      const checkoutRecord = {
        id: this.generateUUID(),
        receipt_code: receiptCode,
        item_id: item.id,
        item_code: item.code,
        item_name: item.name,
        borrower_name: borrowerName,
        borrower_email: borrowerEmail,
        purpose: purpose || 'Práctica docente',
        checkout_time: nowIso,
        checkin_time: null,
        status: 'activo',
        checkin_notes: null
      };

      this.checkouts.unshift(checkoutRecord);
      createdCheckouts.push(checkoutRecord);

      this.addAuditLog('SALIDA', item.code, item.name, `Retirado por ${borrowerName}. Vale: ${receiptCode}`, item.id);

      if (window.supabaseService && window.supabaseService.isOnline()) {
        window.supabaseService.client.from('items').update({
          status: 'sacado',
          current_borrower: item.current_borrower,
          checkout_time: nowIso,
          use_count: item.use_count
        }).eq('id', item.id).then(({ error }) => {
          if (error) console.error('Error actualizando item en salida múltiple Supabase:', error);
        });

        const dbPayload = {
          ...checkoutRecord,
          item_id: this.isValidUUID(item.id) ? item.id : null
        };
        window.supabaseService.client.from('checkouts').insert([dbPayload]).then(({ error }) => {
          if (error) console.error('Error insertando checkout múltiple en Supabase:', error);
        });
      }
    }

    this.saveToStorage();
    return { success: true, count: validItems.length, receiptCode, items: validItems, checkouts: createdCheckouts };
  }

  // --- DEVOLUCIÓN MÚLTIPLE DE MATERIALES SELECCIONADOS ---
  checkinMultipleItems(checkoutIds, condition = 'disponible', notes = '') {
    if (!this.requireSupabase()) return { success: false, count: 0 };
    let count = 0;
    const nowFormatted = new Date().toLocaleString();
    const nowIso = new Date().toISOString();

    for (const chkId of checkoutIds) {
      const chk = this.checkouts.find(c => c.id === chkId);
      if (!chk || chk.status !== 'activo') continue;

      chk.status = 'devuelto';
      chk.checkin_time = nowIso;
      chk.checkin_notes = notes;

      const item = this.getItemById(chk.item_id) || this.items.find(i => i.code === chk.item_code);
      if (item) {
        item.status = condition;
        item.current_borrower = null;
        item.checkout_time = null;

        if (!item.usage_history) item.usage_history = [];
        item.usage_history.unshift({
          date: nowFormatted,
          user: this.currentUser ? this.currentUser.full_name : 'Profesor',
          note: `Reingreso al almacén (${condition}). ${notes || 'Sin incidencias'}`
        });

        if (window.supabaseService && window.supabaseService.isOnline()) {
          window.supabaseService.client.from('items').update({
            status: item.status,
            current_borrower: null,
            checkout_time: null
          }).eq('id', item.id).then(({ error }) => {
            if (error) console.error('Error actualizando item en devolución múltiple Supabase:', error);
          });
        }
      }

      this.addAuditLog('DEVOLUCION', chk.item_code, chk.item_name, `Devuelto en almacén (${condition}).`, chk.item_id);

      if (window.supabaseService && window.supabaseService.isOnline()) {
        window.supabaseService.client.from('checkouts').update({
          status: 'devuelto',
          checkin_time: nowIso,
          checkin_notes: notes
        }).eq('id', chk.id).then(({ error }) => {
          if (error) console.error('Error actualizando checkout en devolución múltiple Supabase:', error);
        });
      }

      count++;
    }

    this.saveToStorage();
    return { success: true, count };
  }

  getActiveCheckouts() {
    return this.checkouts.filter(c => c.status === 'activo');
  }

  // --- MÉTODOS DE AUDITORÍA EN BASE DE DATOS COMPARTIDA ---
  addAuditLog(action, itemCode, itemName, details, itemId = null) {
    if (!window.supabaseService || !window.supabaseService.isOnline()) return;
    const user = this.currentUser || { full_name: 'Usuario', email: 'usuario@murciaeduca.es' };
    const nowIso = new Date().toISOString();

    let finalItemId = itemId;
    if (!finalItemId && itemCode && itemCode !== 'N/A') {
      const it = this.items.find(i => i.code === itemCode);
      if (it) finalItemId = it.id;
    }

    const logEntry = {
      id: this.generateUUID(),
      created_at: nowIso,
      user_name: user.full_name,
      user_email: user.email,
      action: action, // SALIDA, DEVOLUCION, ALTA, MODIFICACION, EXTRAVIO, BAJA, LOGIN, MANTENIMIENTO
      item_id: finalItemId || 'N/A',
      item_code: itemCode || 'N/A',
      item_name: itemName || 'N/A',
      details: details || ''
    };

    this.auditLogs.unshift(logEntry);
    this.saveToStorage();

    if (window.auditManager && window.app && window.app.currentView === 'audit') {
      window.auditManager.renderLogs();
    }

    if (window.supabaseService && window.supabaseService.isOnline()) {
      window.supabaseService.client.from('audit_logs').insert([logEntry]).then(({ error }) => {
        if (error) {
          console.error('Error al insertar log en Supabase audit_logs:', error);
          if (window.app) {
            window.app.showToast(`Aviso: Log guardado en local pero falló en BD (${error.message})`, 'warning');
          }
        }
      });
    }
  }

  getAuditLogs(limit = 200) {
    return this.auditLogs.slice(0, limit);
  }

  // --- GESTIÓN DE PROFESORES / USUARIOS ---
  addUser(userData) {
    if (!this.requireSupabase()) return { success: false, message: 'Sin conexión con Supabase' };
    const cleanEmail = userData.email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@murciaeduca.es')) {
      return { success: false, message: 'El correo electrónico debe pertenecer al dominio institucional @murciaeduca.es' };
    }
    if (this.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Ya existe un usuario con este correo electrónico' };
    }

    const newUser = {
      id: this.generateUUID(),
      email: cleanEmail,
      password: userData.password || 'murciaeduca123',
      full_name: userData.full_name.trim(),
      role: userData.role || 'profesor',
      department: userData.department || 'Emergencias y Protección Civil'
    };

    this.users.push(newUser);
    this.saveToStorage();

    this.addAuditLog('USUARIO', newUser.role.toUpperCase(), newUser.full_name, `Cuenta dada de alta por el Administrador (${newUser.email})`, newUser.id);

    const client = window.supabaseService.client;
    client.from('profiles').insert([{
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      department: newUser.department,
      password: newUser.password
    }]).then(({ error }) => {
      if (error && error.code === '42703') {
        // Si la tabla profiles aún no tiene columna password, reintentar sin ella
        client.from('profiles').insert([{
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          department: newUser.department
        }]).then(({ error: retryErr }) => {
          if (retryErr) console.error('Error guardando perfil en Supabase:', retryErr);
        });
      } else if (error) {
        console.error('Error guardando perfil en Supabase:', error);
      }
    });

    return { success: true, user: newUser };
  }

  deleteUser(userId) {
    if (!this.requireSupabase()) return { success: false, message: 'Sin conexión con Supabase' };
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;
    if (user.role === 'admin' && this.users.filter(u => u.role === 'admin').length <= 1) {
      return { success: false, message: 'No se puede eliminar el único Administrador' };
    }

    this.users = this.users.filter(u => u.id !== userId);
    this.saveToStorage();
    this.addAuditLog('USUARIO', 'BAJA', user.full_name, `Cuenta eliminada (${user.email})`, user.id);

    if (this.isValidUUID(userId)) {
      window.supabaseService.client.from('profiles').delete().eq('id', userId).then(({ error }) => {
        if (error) console.error('Error eliminando perfil en Supabase:', error);
      });
    }
    return { success: true };
  }

  // --- ESTADÍSTICAS ---
  getStats() {
    const total = this.items.length;
    const available = this.items.filter(i => i.status === 'disponible').length;
    const taken = this.items.filter(i => i.status === 'sacado').length;
    const lost = this.items.filter(i => i.status === 'extraviado').length;
    const maintenance = this.items.filter(i => i.status === 'mantenimiento').length;

    // Salidas esta semana
    const weeklyCheckouts = this.checkouts.length;

    return {
      total,
      available,
      taken,
      lost,
      maintenance,
      weeklyCheckouts
    };
  }
}

window.store = new Store();

