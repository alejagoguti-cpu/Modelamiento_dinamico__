-- Crear tablas para RAPOT POT
-- Ejecuta esto en Supabase Dashboard → SQL Editor

-- 1. ESTRUCTURAS PRINCIPALES
CREATE TABLE IF NOT EXISTS estructuras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  color TEXT,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. COMPONENTES
CREATE TABLE IF NOT EXISTS componentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estructura_id UUID NOT NULL REFERENCES estructuras(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. ELEMENTOS (825+ items)
CREATE TABLE IF NOT EXISTS elementos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  componente_id UUID NOT NULL REFERENCES componentes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT,
  ubicacion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. RELACIONES ENTRE ESTRUCTURAS
CREATE TABLE IF NOT EXISTS relaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_estructura_id UUID NOT NULL REFERENCES estructuras(id),
  to_estructura_id UUID NOT NULL REFERENCES estructuras(id),
  label TEXT,
  quote TEXT,
  page TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES PARA QUERIES RÁPIDAS
CREATE INDEX IF NOT EXISTS idx_componentes_estructura ON componentes(estructura_id);
CREATE INDEX IF NOT EXISTS idx_elementos_componente ON elementos(componente_id);
CREATE INDEX IF NOT EXISTS idx_elementos_nombre ON elementos(nombre);

-- PERMITIR LECTURA PÚBLICA (importante para el cliente)
ALTER TABLE estructuras ENABLE ROW LEVEL SECURITY;
ALTER TABLE componentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE elementos ENABLE ROW LEVEL SECURITY;
ALTER TABLE relaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública" ON estructuras FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON componentes FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON elementos FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON relaciones FOR SELECT USING (true);

-- Insertar estructuras principales
INSERT INTO estructuras (nombre, color, descripcion) VALUES
('Estructura Ecológica Principal', 'verde', 'Sistema de elementos naturales que preservan ecosistemas y servicios ambientales'),
('Estructura Integradora de Patrimonios', 'purpura', 'Sistema de patrimonio material, inmaterial y natural del territorio'),
('Estructura Funcional y del Cuidado', 'azul', 'Sistema de infraestructura física, servicios y espacios de encuentro'),
('Estructura Socioeconómica, Creativa y de Innovación', 'amarillo', 'Sistema de actividades económicas, culturales y de innovación')
ON CONFLICT DO NOTHING;
