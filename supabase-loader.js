/**
 * Cargador de datos POT a Supabase desde el navegador
 * Ejecuta una sola vez para migrar datos
 */

const SUPABASE_URL = 'https://yqipzvssmowqyqmqnlcd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LluNHMx-7M287RWLVHNUuw_R2ygvVp1'; // Anon key pública

class SupabaseLoader {
  constructor() {
    this.url = SUPABASE_URL;
    this.key = SUPABASE_KEY;
  }

  async request(method, table, data = null, query = '') {
    const url = `${this.url}/rest/v1/${table}${query}`;
    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    try {
      const options = {
        method,
        headers
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        console.error(`API Error ${response.status}:`, await response.text());
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Request error:', error);
      return null;
    }
  }

  async insertEstructuras(estructuras) {
    console.log('📥 Insertando estructuras...');
    const estructurasMap = {};

    for (const [key, est] of Object.entries(estructuras)) {
      const data = {
        nombre: est.nombre,
        color: est.color,
        descripcion: est.descripcion
      };

      const result = await this.request('POST', 'estructuras', data);
      if (result && result[0]) {
        estructurasMap[key] = result[0].id;
        console.log(`  ✓ ${est.nombre}`);
        await this.delay(100);
      }
    }

    console.log(`✅ ${Object.keys(estructurasMap).length} estructuras creadas\n`);
    return estructurasMap;
  }

  async insertComponentes(estructuras, estructurasMap) {
    console.log('📥 Insertando componentes...');
    const componentesMap = {};
    let count = 0;

    for (const [estKey, est] of Object.entries(estructuras)) {
      const estId = estructurasMap[estKey];
      if (!estId) continue;

      for (const [compKey, comp] of Object.entries(est.componentes || {})) {
        const data = {
          estructura_id: estId,
          nombre: comp.nombre,
          descripcion: comp.descripcion
        };

        const result = await this.request('POST', 'componentes', data);
        if (result && result[0]) {
          componentesMap[`${estKey}_${compKey}`] = result[0].id;
          count++;
          if (count % 5 === 0) {
            console.log(`  ✓ ${count} componentes...`);
          }
          await this.delay(50);
        }
      }
    }

    console.log(`✅ ${count} componentes creados\n`);
    return componentesMap;
  }

  async insertElementos(estructuras, componentesMap) {
    console.log('📥 Insertando elementos...');
    let count = 0;

    for (const [estKey, est] of Object.entries(estructuras)) {
      for (const [compKey, comp] of Object.entries(est.componentes || {})) {
        const compId = componentesMap[`${estKey}_${compKey}`];
        if (!compId) continue;

        const elementos = comp.elementos || [];
        const elementosList = Array.isArray(elementos) ? elementos : [];

        for (const elem of elementosList) {
          const elemName = typeof elem === 'object' ? (elem.nombre || elem.name || '') : String(elem);
          if (!elemName) continue;

          const data = {
            componente_id: compId,
            nombre: elemName,
            tipo: compKey,
            ubicacion: null
          };

          const result = await this.request('POST', 'elementos', data);
          if (result) {
            count++;
            if (count % 50 === 0) {
              console.log(`  ✓ ${count} elementos...`);
            }
            await this.delay(20);
          }
        }
      }
    }

    console.log(`✅ ${count} elementos creados\n`);
  }

  async insertRelaciones(relaciones, estructurasMap) {
    console.log('📥 Insertando relaciones...');

    const mapping = {
      'e1': ['EEP', 'ESECI'],
      'e2': ['EIP', 'EEP'],
      'e3': ['EFC', 'EEP'],
      'e4': ['EFC', 'ESECI'],
      'e5': ['EIP', 'EFC'],
      'e6': ['EIP', 'ESECI']
    };

    let count = 0;
    for (const [relKey, relData] of Object.entries(relaciones)) {
      if (!mapping[relKey]) continue;

      const [fromEst, toEst] = mapping[relKey];
      const fromId = estructurasMap[fromEst];
      const toId = estructurasMap[toEst];

      if (fromId && toId) {
        const data = {
          from_estructura_id: fromId,
          to_estructura_id: toId,
          label: relData.label,
          quote: relData.quote,
          page: relData.page
        };

        const result = await this.request('POST', 'relaciones', data);
        if (result) {
          count++;
          console.log(`  ✓ ${relData.label}`);
          await this.delay(100);
        }
      }
    }

    console.log(`✅ ${count} relaciones creadas\n`);
  }

  async migrate(potData) {
    console.log('\n🚀 MIGRACIÓN A SUPABASE\n');

    const estructuras = potData.estructuras_territoriales;
    const relaciones = potData.relations || {};

    const estructurasMap = await this.insertEstructuras(estructuras);
    const componentesMap = await this.insertComponentes(estructuras, estructurasMap);
    await this.insertElementos(estructuras, componentesMap);
    await this.insertRelaciones(relaciones, estructurasMap);

    console.log('=' + '='.repeat(50));
    console.log('✅ ¡Migración completada!\n');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Función para ejecutar desde la consola
async function cargarDatosASupabase() {
  try {
    console.log('Cargando datos del JSON...');
    const response = await fetch('./data/pot_nodos_completos.json');
    const potData = await response.json();

    const loader = new SupabaseLoader();
    await loader.migrate(potData);

    console.log('💾 Datos guardados en Supabase');
    console.log('Recarga la página para ver los cambios');
  } catch (error) {
    console.error('Error en migración:', error);
  }
}

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SupabaseLoader, cargarDatosASupabase };
}
