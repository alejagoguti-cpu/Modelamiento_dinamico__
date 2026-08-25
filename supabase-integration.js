/**
 * Integración de Supabase con el sistema RAPOT
 * Reemplaza la carga de JSON con queries a Supabase
 */

const SUPABASE_URL = 'https://yqipzvssmowqyqmqnlcd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LluNHMx-7M287RWLVHNUuw_R2ygvVp1';

class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async request(table, query = '') {
    const url = `${this.url}/rest/v1/${table}${query}`;
    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        console.error(`Error ${response.status}:`, await response.text());
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Supabase error:', error);
      return null;
    }
  }

  async insert(table, data) {
    const url = `${this.url}/rest/v1/${table}`;
    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error(`Insert error ${response.status}:`, await response.text());
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Insert error:', error);
      return null;
    }
  }
}

// Cliente global
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);

// =================== FUNCIONES DE CARGA ===================

/**
 * Cargar estructuras principales
 */
async function loadEstructuras() {
  console.log('📥 Cargando estructuras desde Supabase...');
  const estructuras = await supabase.request('estructuras');
  if (!estructuras) {
    console.error('No se pudieron cargar estructuras');
    return null;
  }

  const map = {};
  estructuras.forEach(est => {
    map[est.nombre.toLowerCase().includes('ecológica') ? 'EEP' :
       est.nombre.toLowerCase().includes('patrimonios') ? 'EIP' :
       est.nombre.toLowerCase().includes('funcional') ? 'EFC' : 'ESECI'] = est.id;
  });

  console.log(`✅ ${estructuras.length} estructuras cargadas`);
  return { estructuras, map };
}

/**
 * Cargar componentes de una estructura
 */
async function loadComponentes(estructuraId) {
  return await supabase.request(
    'componentes',
    `?estructura_id=eq.${estructuraId}&order=nombre.asc`
  );
}

/**
 * Cargar elementos de un componente con paginación
 * @param {string} componenteId
 * @param {number} limit - Máximo de elementos (default 50 en mobile, 300 en desktop)
 * @param {number} offset - Para paginación
 */
async function loadElementos(componenteId, limit = 50, offset = 0) {
  const query = `?componente_id=eq.${componenteId}&order=nombre.asc&limit=${limit}&offset=${offset}`;
  return await supabase.request('elementos', query);
}

/**
 * Cargar todas los elementos de un componente (sin límite)
 */
async function loadAllElementos(componenteId) {
  const query = `?componente_id=eq.${componenteId}&order=nombre.asc&limit=1000`;
  return await supabase.request('elementos', query);
}

/**
 * Cargar relaciones entre estructuras
 */
async function loadRelaciones() {
  return await supabase.request('relaciones');
}

/**
 * Búsqueda global de elementos
 */
async function searchElementos(query) {
  const searchQuery = `?nombre=ilike.%${query}%&limit=20`;
  return await supabase.request('elementos', searchQuery);
}

// =================== REEMPLAZOS PARA scripts.js ===================

/**
 * Reemplazar loadPOTData() con carga desde Supabase
 */
async function loadPOTDataFromSupabase() {
  console.log('🔄 Inicializando Supabase...');

  try {
    const result = await loadEstructuras();
    if (!result) {
      console.error('No se pudo conectar a Supabase, usando JSON local...');
      return null;
    }

    window.supabaseClient = supabase;
    window.supabaseReady = true;

    console.log('✅ Supabase conectado');
    return true;
  } catch (error) {
    console.error('Error inicializando Supabase:', error);
    return null;
  }
}

/**
 * Reemplazar getExpandableElements() para cargar desde Supabase
 */
async function getExpandableElementsFromSupabase(categoryId) {
  console.log(`📥 Cargando elementos de ${categoryId}...`);

  try {
    // Determinar el componente_id basado en categoryId
    const componentes = await supabase.request('componentes');
    const componente = componentes.find(c => {
      const id = c.id.substring(0, 8);
      return id === categoryId.substring(0, 8) || c.nombre.toLowerCase().includes(categoryId.toLowerCase());
    });

    if (!componente) {
      console.error(`Componente no encontrado: ${categoryId}`);
      return [];
    }

    // Cargar elementos con límite según dispositivo
    const limit = window.innerWidth < 768 ? 50 : 300;
    const elementos = await loadElementos(componente.id, limit);

    console.log(`✅ ${elementos.length} elementos cargados`);
    return elementos;
  } catch (error) {
    console.error('Error cargando elementos:', error);
    return [];
  }
}

/**
 * Versión para red completa (sin límite de 50)
 */
async function getExpandableElementsFullNetwork(categoryId) {
  try {
    const componentes = await supabase.request('componentes');
    const componente = componentes.find(c => {
      return c.nombre.toLowerCase().includes(categoryId.toLowerCase());
    });

    if (!componente) return [];

    // Cargar TODOS los elementos (sin límite)
    const todos = await loadAllElementos(componente.id);
    return todos;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// =================== UTILIDADES ===================

/**
 * Verificar conexión a Supabase
 */
async function testSupabaseConnection() {
  try {
    const test = await supabase.request('estructuras', '?limit=1');
    if (test) {
      console.log('✅ Conexión a Supabase exitosa');
      return true;
    }
  } catch (error) {
    console.log('❌ No se pudo conectar a Supabase');
    return false;
  }
}

/**
 * Obtener estadísticas de base de datos
 */
async function getSupabaseStats() {
  try {
    const estructuras = await supabase.request('estructuras');
    const componentes = await supabase.request('componentes');
    const elementos = await supabase.request('elementos?select=count', '?select=count()');

    return {
      estructuras: estructuras ? estructuras.length : 0,
      componentes: componentes ? componentes.length : 0,
      elementos: elementos ? elementos[0].count : 0
    };
  } catch (error) {
    console.error('Error obteniendo stats:', error);
    return null;
  }
}

// Inicializar automáticamente cuando se carga el script
console.log('📦 Supabase integration loaded');
