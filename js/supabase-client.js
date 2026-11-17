/**
 * KRONOS - SUPABASE CLIENT (MODO SUPABASE ESTRICTO, SIN MODO LOCAL)
 * La aplicación solo opera cuando existe conexión real y verificada con Supabase.
 * Soporta credenciales predeterminadas ofuscadas para despliegue público en GitHub Pages.
 */

const KRONOS_STORAGE_KEYS = {
  SUPABASE_URL: 'kronos_supabase_url',
  SUPABASE_ANON_KEY: 'kronos_supabase_key'
};

// Máscara XOR para ocultar URL y Anon Key predeterminadas en repositorios públicos
const KRONOS_CFG_MASK = [107, 114, 51, 110, 48, 115, 95, 72, 101, 115, 112, 50, 54, 33];

/**
 * Credenciales predeterminadas ofuscadas (arrays de bytes cifrados con XOR e invertidos).
 * Pega aquí el bloque generado desde "Ajustes Supabase -> Generar bloque oculto para GitHub"
 * para que cualquier dispositivo se conecte automáticamente por defecto sin exponer texto plano.
 */
const KRONOS_DEFAULT_CLOUD_CFG = {
  u: [228, 227, 191, 223, 196, 181, 191, 175, 147, 157, 122, 44, 69, 84, 67, 46, 49, 26, 27, 4, 236, 242, 219, 211, 218, 180, 173, 149, 142, 148, 116, 106, 4, 15, 11, 41, 39, 0, 9, 6],
  k: [15, 4, 24, 43, 60, 16, 207, 225, 206, 251, 229, 135, 190, 186, 176, 138, 106, 116, 72, 5, 3, 102, 30, 50, 80, 9, 245, 236, 231, 196, 224, 135, 188, 158, 157, 141, 109, 117, 66, 76, 83, 47, 39, 43, 31, 29]
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.url = '';
    this.anonKey = '';
    this.usingDefaultConfig = false;
    this.connected = false;
    this.lastError = '';
    this.loadCredentials();
    this.initClient();
  }

  static encodeSegment(plainText) {
    const raw = (plainText || '').trim();
    if (!raw) return [];
    const bytes = new TextEncoder().encode(raw);
    const out = [];
    for (let i = 0; i < bytes.length; i++) {
      const salt = KRONOS_CFG_MASK[(i * 7 + 3) % KRONOS_CFG_MASK.length];
      out.push((bytes[i] ^ salt ^ ((i * 13) & 0xff)) & 0xff);
    }
    return out.reverse();
  }

  static decodeSegment(encodedArr) {
    if (!Array.isArray(encodedArr) || encodedArr.length === 0) return '';
    try {
      const ordered = encodedArr.slice().reverse();
      const bytes = new Uint8Array(ordered.length);
      for (let i = 0; i < ordered.length; i++) {
        const salt = KRONOS_CFG_MASK[(i * 7 + 3) % KRONOS_CFG_MASK.length];
        bytes[i] = (ordered[i] ^ salt ^ ((i * 13) & 0xff)) & 0xff;
      }
      return new TextDecoder().decode(bytes);
    } catch (e) {
      return '';
    }
  }

  hasDefaultConfig() {
    return (
      Array.isArray(KRONOS_DEFAULT_CLOUD_CFG.u) &&
      KRONOS_DEFAULT_CLOUD_CFG.u.length > 0 &&
      Array.isArray(KRONOS_DEFAULT_CLOUD_CFG.k) &&
      KRONOS_DEFAULT_CLOUD_CFG.k.length > 0
    );
  }

  hasCustomOverride() {
    const localUrl = localStorage.getItem(KRONOS_STORAGE_KEYS.SUPABASE_URL);
    const localKey = localStorage.getItem(KRONOS_STORAGE_KEYS.SUPABASE_ANON_KEY);
    return !!(localUrl && localKey);
  }

  loadCredentials() {
    const localUrl = (localStorage.getItem(KRONOS_STORAGE_KEYS.SUPABASE_URL) || '').trim();
    const localKey = (localStorage.getItem(KRONOS_STORAGE_KEYS.SUPABASE_ANON_KEY) || '').trim();

    if (localUrl && localKey) {
      this.url = localUrl;
      this.anonKey = localKey;
      this.usingDefaultConfig = false;
      return;
    }

    if (this.hasDefaultConfig()) {
      this.url = SupabaseService.decodeSegment(KRONOS_DEFAULT_CLOUD_CFG.u);
      this.anonKey = SupabaseService.decodeSegment(KRONOS_DEFAULT_CLOUD_CFG.k);
      this.usingDefaultConfig = !!(this.url && this.anonKey);
      return;
    }

    this.url = '';
    this.anonKey = '';
    this.usingDefaultConfig = false;
  }

  encodeForPublicRepo(url, key) {
    const uArr = SupabaseService.encodeSegment(url);
    const kArr = SupabaseService.encodeSegment(key);
    return `const KRONOS_DEFAULT_CLOUD_CFG = {\n  u: [${uArr.join(', ')}],\n  k: [${kArr.join(', ')}]\n};`;
  }

  initClient() {
    this.connected = false;
    if (this.url && this.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.url, this.anonKey);
      } catch (e) {
        console.warn('Error al inicializar cliente Supabase:', e);
        this.client = null;
        this.lastError = e.message || 'URL o clave de Supabase inválida';
      }
    } else {
      this.client = null;
      this.lastError = !this.hasDefaultConfig()
        ? 'Faltan credenciales predeterminadas en supabase-client.js (o configúralas en Ajustes BD).'
        : 'No hay credenciales de Supabase configuradas';
    }
  }

  async verifyLiveConnection() {
    if (!this.client || !this.url || !this.anonKey) {
      this.connected = false;
      this.lastError = !window.supabase
        ? 'No se pudo cargar la librería cliente de Supabase (sin internet).'
        : 'Falta configurar la URL y la Anon Key de Supabase.';
      return false;
    }

    try {
      const [itemsRes, logsRes, profilesRes] = await Promise.all([
        this.client.from('items').select('id').limit(1),
        this.client.from('audit_logs').select('id').limit(1),
        this.client.from('profiles').select('id').limit(1)
      ]);

      const firstError = itemsRes.error || logsRes.error || profilesRes.error;
      if (firstError && firstError.code !== 'PGRST116') {
        this.connected = false;
        this.lastError = firstError.code === '42P01'
          ? 'Faltan tablas en Supabase (ejecuta el esquema SQL: items, audit_logs, checkouts, profiles).'
          : (firstError.message || 'Error de conexión con Supabase');
        return false;
      }

      this.connected = true;
      this.lastError = '';
      return true;
    } catch (err) {
      this.connected = false;
      this.lastError = err.message || 'Error de red: sin conexión con Supabase';
      return false;
    }
  }

  async testConnection(testUrl, testKey) {
    const url = (testUrl || this.url || '').trim();
    const key = (testKey || this.anonKey || '').trim();

    if (!url || !key) {
      return { success: false, message: 'Faltan credenciales URL o Anon Key de Supabase' };
    }
    if (!window.supabase) {
      return { success: false, message: 'Sin conexión a internet o SDK de Supabase no cargado' };
    }

    try {
      const tempClient = window.supabase.createClient(url, key);
      const { error: itemsErr } = await tempClient.from('items').select('id').limit(1);
      if (itemsErr && itemsErr.code !== 'PGRST116') {
        if (itemsErr.code === '42P01') {
          return {
            success: false,
            message: 'Conectado al servidor, pero falta la tabla "items" en Supabase.'
          };
        }
        return { success: false, message: itemsErr.message || 'Error al conectar con la base de datos' };
      }

      const { error: logsErr } = await tempClient.from('audit_logs').select('id').limit(1);
      if (logsErr && logsErr.code !== 'PGRST116') {
        return { success: false, message: `Error en tabla audit_logs: ${logsErr.message}` };
      }

      const { error: profErr } = await tempClient.from('profiles').select('id').limit(1);
      if (profErr && profErr.code !== 'PGRST116') {
        return { success: false, message: `Error en tabla profiles: ${profErr.message}` };
      }

      return { success: true, message: '¡Conexión verificada con todas las tablas de Supabase!' };
    } catch (err) {
      return { success: false, message: err.message || 'Error de red al conectar con Supabase' };
    }
  }

  saveCredentials(url, key) {
    this.url = url.trim();
    this.anonKey = key.trim();
    this.usingDefaultConfig = false;
    localStorage.setItem(KRONOS_STORAGE_KEYS.SUPABASE_URL, this.url);
    localStorage.setItem(KRONOS_STORAGE_KEYS.SUPABASE_ANON_KEY, this.anonKey);
    this.initClient();
  }

  resetToDefault() {
    localStorage.removeItem(KRONOS_STORAGE_KEYS.SUPABASE_URL);
    localStorage.removeItem(KRONOS_STORAGE_KEYS.SUPABASE_ANON_KEY);
    this.loadCredentials();
    this.initClient();
  }

  markDisconnected(reason) {
    this.connected = false;
    this.lastError = reason || 'Conexión perdida con Supabase';
  }

  isOnline() {
    return this.connected === true && !!this.client && !!this.url && !!this.anonKey;
  }
}

window.supabaseService = new SupabaseService();
