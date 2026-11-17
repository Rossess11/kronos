/**
 * KRONOS - SUPABASE CLIENT (MODO SUPABASE EXCLUSIVO)
 * Conexión obligatoria y directa con Supabase.
 */

const KRONOS_STORAGE_KEYS = {
  SUPABASE_URL: 'kronos_supabase_url',
  SUPABASE_ANON_KEY: 'kronos_supabase_key'
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.url = localStorage.getItem(KRONOS_STORAGE_KEYS.SUPABASE_URL) || '';
    this.anonKey = localStorage.getItem(KRONOS_STORAGE_KEYS.SUPABASE_ANON_KEY) || '';
    this.initClient();
  }

  initClient() {
    if (this.url && this.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.url, this.anonKey);
      } catch (e) {
        console.warn('Error al inicializar cliente Supabase:', e);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  async testConnection(testUrl, testKey) {
    const url = testUrl || this.url;
    const key = testKey || this.anonKey;

    if (!url || !key || !window.supabase) {
      return { success: false, message: 'Faltan credenciales URL o Anon Key de Supabase' };
    }

    try {
      const tempClient = window.supabase.createClient(url, key);
      const { data, error } = await tempClient.from('items').select('id').limit(1);

      if (error && error.code !== 'PGRST116') {
        if (error.code === '42P01') {
          return {
            success: true,
            warning: true,
            message: 'Conectado a Supabase, pero la tabla "items" no existe. Ejecuta supabase-schema.sql en el SQL Editor.'
          };
        }
        return { success: false, message: error.message || 'Error al conectar con la base de datos' };
      }

      return { success: true, message: '¡Conexión establecida con Supabase con éxito!' };
    } catch (err) {
      return { success: false, message: err.message || 'Error de red al conectar con Supabase' };
    }
  }

  saveCredentials(url, key) {
    this.url = url.trim();
    this.anonKey = key.trim();
    localStorage.setItem(KRONOS_STORAGE_KEYS.SUPABASE_URL, this.url);
    localStorage.setItem(KRONOS_STORAGE_KEYS.SUPABASE_ANON_KEY, this.anonKey);
    this.initClient();
  }

  isOnline() {
    return !!this.client && !!this.url && !!this.anonKey;
  }
}

window.supabaseService = new SupabaseService();
