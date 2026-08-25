#!/usr/bin/env python3
"""
Migración de datos POT a Supabase usando API REST
"""

import json
import requests
import time
from typing import Dict, List

# Configuración Supabase (usar variables de entorno)
import os
PROJECT_URL = os.getenv("SUPABASE_URL", "https://yqipzvssmowqyqmqnlcd.supabase.co")
API_KEY = os.getenv("SUPABASE_KEY", "")  # Pasar como: SUPABASE_KEY=tu_clave python3 migrate...
HEADERS = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def load_json_data():
    """Cargar datos del JSON local"""
    try:
        with open('./data/pot_nodos_completos.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error cargando JSON: {e}")
        return None

def api_call(method: str, table: str, data: Dict = None, query: str = ""):
    """Hacer llamada a API REST de Supabase"""
    url = f"{PROJECT_URL}/rest/v1/{table}{query}"

    try:
        if method == "POST":
            response = requests.post(url, json=data, headers=HEADERS, timeout=10)
        elif method == "GET":
            response = requests.get(url, headers=HEADERS, timeout=10)
        else:
            return None

        if response.status_code in [200, 201]:
            return response.json() if response.text else None
        else:
            print(f"  ⚠️  API Error {response.status_code}: {response.text[:100]}")
            return None
    except Exception as e:
        print(f"  ⚠️  Error en API: {e}")
        return None

def clear_tables():
    """Limpiar tablas existentes (opcional)"""
    print("🗑️  Limpiando tablas existentes...")
    tables = ['relaciones', 'elementos', 'componentes', 'estructuras']

    for table in tables:
        try:
            requests.delete(
                f"{PROJECT_URL}/rest/v1/{table}",
                headers=HEADERS,
                timeout=10
            )
            print(f"  ✓ {table} vaciada")
        except:
            pass
    time.sleep(1)

def migrate_estructuras(pot_data: dict) -> Dict[str, str]:
    """Migrar estructuras principales"""
    print("\n📥 Migrando estructuras...")
    estructuras_map = {}

    for key, estr in pot_data.get('estructuras_territoriales', {}).items():
        data = {
            'nombre': estr.get('nombre'),
            'color': estr.get('color'),
            'descripcion': estr.get('descripcion')
        }

        result = api_call("POST", "estructuras", data)
        if result:
            # Si retorna un array, tomar el primer elemento
            struct_id = result[0]['id'] if isinstance(result, list) else result.get('id')
            if struct_id:
                estructuras_map[key] = struct_id
                print(f"  ✓ {estr.get('nombre')} ({struct_id[:8]}...)")
                time.sleep(0.1)

    print(f"✅ {len(estructuras_map)} estructuras creadas")
    return estructuras_map

def migrate_componentes(pot_data: dict, estructuras_map: dict) -> Dict[str, str]:
    """Migrar componentes"""
    print("\n📥 Migrando componentes...")
    componentes_map = {}
    count = 0

    for est_key, estr_data in pot_data.get('estructuras_territoriales', {}).items():
        est_id = estructuras_map.get(est_key)
        if not est_id:
            continue

        for comp_key, componente in estr_data.get('componentes', {}).items():
            data = {
                'estructura_id': est_id,
                'nombre': componente.get('nombre'),
                'descripcion': componente.get('descripcion')
            }

            result = api_call("POST", "componentes", data)
            if result:
                comp_id = result[0]['id'] if isinstance(result, list) else result.get('id')
                if comp_id:
                    componentes_map[f"{est_key}_{comp_key}"] = comp_id
                    count += 1
                    if count % 5 == 0:
                        print(f"  ✓ {count} componentes...")
                    time.sleep(0.05)

    print(f"✅ {count} componentes creados")
    return componentes_map

def migrate_elementos(pot_data: dict, componentes_map: dict):
    """Migrar elementos (825+ items)"""
    print("\n📥 Migrando elementos...")
    count = 0

    for est_key, estr_data in pot_data.get('estructuras_territoriales', {}).items():
        for comp_key, componente in estr_data.get('componentes', {}).items():
            comp_id = componentes_map.get(f"{est_key}_{comp_key}")
            if not comp_id:
                continue

            elementos = componente.get('elementos', [])
            if isinstance(elementos, dict):
                elementos = elementos.get('elementos', [])

            for elem in elementos:
                elem_name = elem.get('nombre') if isinstance(elem, dict) else str(elem)

                data = {
                    'componente_id': comp_id,
                    'nombre': elem_name,
                    'tipo': comp_key,
                    'ubicacion': None
                }

                result = api_call("POST", "elementos", data)
                if result:
                    count += 1
                    if count % 50 == 0:
                        print(f"  ✓ {count} elementos...")
                    time.sleep(0.02)

    print(f"✅ {count} elementos creados")

def migrate_relaciones(pot_data: dict, estructuras_map: dict):
    """Migrar relaciones entre estructuras"""
    print("\n📥 Migrando relaciones...")

    mapping = {
        'e1': ('EEP', 'ESECI'),
        'e2': ('EIP', 'EEP'),
        'e3': ('EFC', 'EEP'),
        'e4': ('EFC', 'ESECI'),
        'e5': ('EIP', 'EFC'),
        'e6': ('EIP', 'ESECI')
    }

    from_relations = pot_data.get('relations', {})

    count = 0
    for rel_key, rel_data in from_relations.items():
        if rel_key not in mapping:
            continue

        from_est, to_est = mapping[rel_key]
        from_id = estructuras_map.get(from_est)
        to_id = estructuras_map.get(to_est)

        if from_id and to_id:
            data = {
                'from_estructura_id': from_id,
                'to_estructura_id': to_id,
                'label': rel_data.get('label'),
                'quote': rel_data.get('quote'),
                'page': rel_data.get('page')
            }

            result = api_call("POST", "relaciones", data)
            if result:
                count += 1
                print(f"  ✓ {rel_data.get('label')}")
                time.sleep(0.1)

    print(f"✅ {count} relaciones creadas")

def main():
    """Ejecutar migración completa"""
    print("\n🚀 MIGRACIÓN A SUPABASE")
    print("=" * 50)

    # 1. Cargar datos
    print("\n1️⃣  Cargando datos locales...")
    pot_data = load_json_data()
    if not pot_data:
        return
    print(f"✅ {pot_data['metadata']['total_nodos']} nodos cargados")

    # 2. Conectar a Supabase
    print(f"\n2️⃣  Conectando a Supabase...")
    print(f"  URL: {PROJECT_URL}")
    test = api_call("GET", "estructuras", query="?limit=1")
    if test is not None:
        print(f"✅ Conexión exitosa")
    else:
        print(f"❌ No se puede conectar a Supabase")
        return

    # 3. Limpiar (opcional)
    # clear_tables()

    # 4. Migrar datos
    print(f"\n3️⃣  Migrando datos...")
    print("=" * 50)

    estructuras_map = migrate_estructuras(pot_data)
    componentes_map = migrate_componentes(pot_data, estructuras_map)
    migrate_elementos(pot_data, componentes_map)
    migrate_relaciones(pot_data, estructuras_map)

    print("\n" + "=" * 50)
    print("✅ ¡Migración completada!")
    print("\nProximos pasos:")
    print("1. Verificar en Supabase Dashboard")
    print("2. Ejecutar: node integrate_supabase.js")
    print("3. Probar en: http://localhost:3000\n")

if __name__ == "__main__":
    main()
