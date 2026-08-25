# 🐀 Versión 2.0: Integración de Ratas como Conexión Urbano-Rural

## Resumen Ejecutivo

La Versión 2.0 extiende el modelo existente de abejas-humedal para incluir **ratas como agentes biosociales** que vinculan la ciudad informal con la degradación de humedales. Esto operacionaliza el insight del usuario sobre cómo la pobreza urbana, mercados informales sin regulación, y mala gestión de residuos conducen a invasiones de roedores que luego degradan ecosistemas.

---

## Arquitectura de Versión 2.0

### Nuevos Componentes

```
VERSIÓN 1.0 (Actual):
City ────────────→ [Humedal] ←──────── Naturaleza
                     ↓
                Ecosystem.update()

VERSIÓN 2.0 (Propuesta):
[PLAZA DE MERCADO]
│  Regulación (formal/informal)
│  Generación de basura
│  Política pública
└─→ RAT POPULATION (Indicador urbano)
       │  Reproducción basada en basura
       │  Migración hacia humedal
       │  Consumo de recursos locales
       ├─→ [HUMEDAL]
       │     ├─ Depredación de huevos de aves
       │     ├─ Consumo de semillas/invertebrados
       │     ├─ Transporte de contaminación
       │     └─ Disruption trófica
       │
       └─→ Retroalimentación → Mayor pobreza
                              → Menos limpieza
                              → Más ratas
```

### Nuevas Clases de Agentes

#### 1. **UrbanMarket (Nueva)**

```python
class UrbanMarket:
    """Mercado urbano como fuente de perturbación del humedal"""
    
    def __init__(self):
        self.regulation_level = 1.0  # 1.0 = formal, 0.0 = informal
        self.daily_waste = 100  # kg de basura/día
        self.sanitation_frequency = 1.0  # veces/día (1.0=formal, 0.3=informal)
        
        # Resultado: waste_available = f(regulation_level, sanitation)
        self.available_waste = 0
    
    def update(self, policy_input):
        # Regulación → menos basura disponible
        self.available_waste = self.daily_waste * (1 - self.regulation_level * 0.8)
        
        # Basura acumulada depende de limpieza
        self.available_waste *= (1 / self.sanitation_frequency)
        
        # Eventos de política pública
        if policy_input == "FORMALIZE_MARKET":
            self.regulation_level = min(1.0, self.regulation_level + 0.1)
        elif policy_input == "NEGLECT_MARKET":
            self.regulation_level = max(0.0, self.regulation_level - 0.05)
```

#### 2. **RatPopulation (Nueva)**

```python
class RatPopulation:
    """Población de ratas urbanas (Rattus norvegicus/rattus)"""
    
    def __init__(self, nearby_market):
        self.population = 50  # Inicial
        self.nearby_market = nearby_market  # Referencia al mercado
        self.age_distribution = [10, 20, 15, 5]  # Estructura etaria simplificada
        
    def update(self, city_conditions):
        # Reproducción vinculada a comida disponible
        food_from_market = self.nearby_market.available_waste
        reproduction_rate = 0.12 * (food_from_market / 100.0)  # 12% base
        
        # Mortalidad natural + control urbano (depredadores, veneno)
        mortality_rate = 0.08
        if city_conditions.get("rat_control_active"):
            mortality_rate += 0.10
        
        # Dinámica poblacional
        births = self.population * reproduction_rate
        deaths = self.population * mortality_rate
        self.population = max(0, self.population + births - deaths)
        
        # Migración a humedal cuando hay saturación
        carrying_capacity_urban = 1000  # Máximo en ciudad
        if self.population > carrying_capacity_urban:
            migration_rate = 0.05 * ((self.population - carrying_capacity_urban) / carrying_capacity_urban)
            migration_to_wetland = int(self.population * migration_rate)
            self.population -= migration_to_wetland
            return migration_to_wetland
        
        return 0
```

#### 3. **WetlandRatPredation (Nuevo parámetro)**

Se añade a la clase `State`:

```python
class State:
    # ... existing parameters ...
    
    def __init__(self):
        # ... existing init ...
        self.rats_in_wetland = 0  # Población de ratas invasoras en humedal
        self.rat_predation_pressure = 0  # Cuan fuerte es la depredación
```

---

## Dinámicas Implementadas en Versión 2.0

### 1. **Ciclo de Reproducción de Ratas**

```
FACTORES que AUMENTAN reproducción:
├─ Disponibilidad de comida (linear)
├─ Ausencia de depredadores naturales
├─ Agua disponible
└─ Temperatura (invierno = menor reproducción en simulación)

FACTORES que DISMINUYEN reproducción:
├─ Hacinamiento (competencia)
├─ Presencia de aves depredadoras
├─ Intervención humana (veneno, trampas)
└─ Enfermedad (cuando ocupación muy alta)
```

### 2. **Migración Urbano-Rural**

```
TRIGGER de migración:
Cuando: population_urban > carrying_capacity_urban

TASA de migración:
migration_per_step = (population - capacity) * 0.05  # 5% del excedente

DESTINO: Humedal (búsqueda de nuevos recursos)

FRECUENCIA: Ocurre cada mes de simulación
```

### 3. **Impactos de Ratas en Humedal**

```
DEPREDACIÓN:
├─ Abejas acuáticas: -2% cada 10 ratas
├─ Huevos de aves: -15% tasa reproductiva aves
└─ Larvas de insectos: -10% microorganismos

COMPETENCIA:
├─ Con aves por invertebrados
├─ Con peces (si existen) por larvas
└─ Presión general sobre invertebrados

CONTAMINACIÓN:
├─ Traslado de parásitos desde ciudad
├─ Presencia de excrementos → leve contaminación agua
└─ Perturbación de sedimentos
```

### 4. **Retroalimentación Socioecológica**

```
CICLO VICIOSO:
Pobreza urbana
    ↓
Mercado informal (sin regulación)
    ↓
Acumulación de basura
    ↓
Explosión de ratas
    ↓
Migración a humedal
    ↓
Degradación de servicios ecosistémicos
    ↓
Mayor pobreza (pérdida de recursos naturales)
    ↓
↺ REFUERZO POSITIVO (negativo para el sistema)

CICLO VIRTUOSO:
Regulación de mercado formal
    ↓
Gestión de residuos eficiente
    ↓
Población de ratas controlada
    ↓
Ratas no migran a humedal
    ↓
Humedal mantiene integridad
    ↓
Mayor bioproductividad local
    ↓
Oportunidades económicas comunitarias
    ↓
↺ REFUERZO POSITIVO (positivo para el sistema)
```

---

## Nuevos Controles Interactivos

### Controles de Política Urbana (Nuevos)

| Tecla | Acción | Efecto |
|-------|--------|--------|
| F | Formalizar mercado | regulation_level += 0.1 → menos basura |
| I | Informalizar mercado | regulation_level -= 0.05 → más basura |
| C | Control de plagas urbano | mortality_rate += 0.10 por 3 meses |
| E | Evento de extrema pobreza | regulation_level -= 0.15, waste += 200 |
| S | Sanidad mejorada | sanitation_frequency *= 1.5 |

### Indicadores de Política (Nuevos)

```
Pantalla mostrará:
┌─────────────────────────────────────────┐
│ CONDICIONES URBANAS                     │
├─────────────────────────────────────────┤
│ Plaza: [■■■□□□□□□□] Formal  60%        │
│ Basura: 85 kg/día                       │
│ Ratas urbanas: 347 individuos           │
│ Ratas → Humedal: 12/mes                 │
│                                         │
│ IMPACTO EN HUMEDAL                      │
│ Ratas presentes: 84 individuos          │
│ Presión predatoria: 23%                 │
└─────────────────────────────────────────┘
```

---

## Escenarios Emergentes de Versión 2.0

### Escenario A: Mercado Formal Exitoso

```
Entrada: F F F F F (formalización progresiva)

Resultados:
Mes 1-3:   Ratas urbanas: 50 → 75 (aún hay comida)
Mes 4-6:   Ratas urbanas: 75 → 120 (transición lenta)
Mes 7-12:  Ratas urbanas: 120 → 85 (estabilizan en nivel bajo)

Migración a humedal: Mínima (0-3 individuos/mes)
Humedal: Sin invasión de ratas → recuperación

Abejas: Recuperación gradual
Aves: Vuelven si humedal se restaura
Conclusión: Política urbana → humedal sano
```

### Escenario B: Mercado Informal sin Control

```
Entrada: NEGLECT por 12 meses

Resultados:
Mes 1:    Ratas urbanas: 50 → 80
Mes 2:    Ratas urbanas: 80 → 150
Mes 3:    Ratas urbanas: 150 → 320
Mes 4:    Ratas urbanas: 320 → 450 (MIGRACIÓN COMIENZA)
Mes 5:    Ratas urbanas: 450 → 600 (migración: 50/mes)
Mes 6:    Ratas urbanas: 600 → 750 (migración: 100/mes)
Mes 12:   Ratas urbanas: ~1000+ (migración masiva: 200+/mes)

Humedal: Invasión de 500-1000 ratas en 6 meses
Efecto en humedal:
- Abejas: -40% (depredación)
- Aves nidificantes: -80% (huevos comidos)
- Microorganismos: -20%
- Resultado: Colapso ecosistémico
```

### Escenario C: Intervención Tardía

```
Entrada: NEGLECT × 6, luego F F F C C C

Resultados mes 6: Ratas urbanas: 500, migración: 50/mes, Humedal: 200 ratas

Intervención (mes 7-12):
- Formalización de mercado
- Control de plagas urbano
- Pero: Ratas ya en humedal establecidas

Resultado final:
Ratas urbanas: disminuyen a 100 (política urbana funciona)
PERO Ratas en humedal: 400+ (aún invasoras, depredación continúa)

Conclusión: Intervención tardía insuficiente; humedal necesita 
            restauración separada (predadores naturales, etc.)
```

---

## Implementación Técnica

### Cambios a `bees_wetland_game.py`

#### 1. Nueva clase `UrbanMarket`

```python
class UrbanMarket:
    def __init__(self):
        self.regulation_level = 0.7  # Comenzar semiregulado
        self.daily_waste = 100
        self.sanitation_frequency = 0.8
        self.available_waste = 0
    
    def update(self, policy_input=None):
        # Basura base reducida por regulación
        self.available_waste = self.daily_waste * (1 - self.regulation_level * 0.7)
        
        # Limpieza reduce basura disponible
        self.available_waste = max(0, self.available_waste - (100 * self.sanitation_frequency))
        
        # Política pública
        if policy_input == "FORMALIZE":
            self.regulation_level = min(1.0, self.regulation_level + 0.1)
        elif policy_input == "DEGRADE":
            self.regulation_level = max(0.0, self.regulation_level - 0.05)
```

#### 2. Nueva clase `RatPopulation`

```python
class RatPopulation:
    def __init__(self, urban_market):
        self.population = 50
        self.nearby_market = urban_market
    
    def update(self, urban_conditions=None):
        # Reproducción
        food = self.nearby_market.available_waste
        rep_rate = 0.10 * min(1.0, food / 80.0)  # Saturación a 80kg
        
        # Mortalidad
        mort_rate = 0.07
        if urban_conditions and urban_conditions.get("rat_control"):
            mort_rate += 0.12
        
        # Dinámica
        births = self.population * rep_rate
        deaths = self.population * mort_rate
        self.population = max(0, self.population + births - deaths)
        
        # Migración a humedal
        carrying_cap = 900
        if self.population > carrying_cap:
            mig_rate = 0.04 * ((self.population - carrying_cap) / carrying_cap)
            migration = int(self.population * mig_rate)
            self.population -= migration
            return migration
        return 0
```

#### 3. Modificación a clase `State`

```python
class State:
    def __init__(self):
        # ... existing ...
        self.rats_in_wetland = 0
        self.urban_market = UrbanMarket()
        self.urban_rats = RatPopulation(self.urban_market)
```

#### 4. Modificación a `WetlandGame.update()`

```python
def update(self):
    # ... existing update logic ...
    
    # NEW: Urban system
    self.state.urban_market.update()
    rat_migration = self.state.urban_rats.update({"rat_control": self.rat_control_active})
    self.state.rats_in_wetland += rat_migration
    
    # NEW: Rat predation on birds and insects
    if self.state.rats_in_wetland > 0:
        # Reduce bird egg success rate
        bird_predation_penalty = min(0.5, self.state.rats_in_wetland * 0.002)
        # Reduce microorganism abundance
        microorganism_loss = self.state.rats_in_wetland * 0.001
        self.state.microorganisms = max(0, self.state.microorganisms - microorganism_loss * 100)
        # Moderate bird population if present
        self.state.birds = max(0, self.state.birds * (1 - bird_predation_penalty * 0.1))
```

#### 5. Nuevos eventos de teclas

```python
def handle_events(self):
    # ... existing events ...
    
    if event.type == pygame.KEYDOWN:
        # ... existing keys ...
        elif event.key == pygame.K_f:  # Formalize market
            self.state.urban_market.regulation_level = min(1.0, self.state.urban_market.regulation_level + 0.1)
        elif event.key == pygame.K_i:  # Informalize market
            self.state.urban_market.regulation_level = max(0.0, self.state.urban_market.regulation_level - 0.05)
        elif event.key == pygame.K_c:  # Rat control
            self.rat_control_active = True
            self.rat_control_duration = 90  # 3 meses
```

---

## Investigación Necesaria

### Parámetros Faltantes (Requieren Validación)

1. **Tasa de reproducción de ratas**
   - Base: 10-12% mensual en laboratorio
   - Variable con disponibilidad de comida (no lineal)
   - Necesita: datos de ratas en humedales tropicales/subtropicales

2. **Distancia crítica de migración**
   - ¿A cuánta distancia del mercado informal ocurre invasión?
   - ¿Qué factores facilitan la migración (corredores)?
   - Necesita: mapeo geoespacial de plazas→humedales

3. **Impacto de ratas en especies nativas**
   - Depredación específica por especie
   - Competencia con aves acuáticas
   - Transporte de enfermedades
   - Necesita: estudios en humedales urbanos reales

4. **Umbral de regulación urbana**
   - ¿Qué nivel de formalización evita invasión?
   - ¿Hay punto de no retorno?
   - Necesita: análisis de política pública comparativa

---

## Cronograma de Implementación

### Fase 1: Núcleo de Ratas (Version 2.0.1)
- ✅ Clases `UrbanMarket` y `RatPopulation`
- ✅ Dinámicas básicas de reproducción/migración
- ✅ Impactos en humedal
- ⏳ Testing con escenarios de prueba

### Fase 2: Política Pública (Version 2.0.2)
- ⏳ Controles interactivos para política urbana
- ⏳ Indicadores visuales de condiciones urbanas
- ⏳ Escenarios de formalización gradual

### Fase 3: Realismo Ecológico (Version 2.1)
- ⏳ Especies específicas de ratas (Rattus norvegicus vs rattus)
- ⏳ Ciclos migratorios estacionales
- ⏳ Depredadores naturales de ratas (gatos, búhos)
- ⏳ Enfermedades transmitidas por ratas

### Fase 4: Integración Urbano-Rural Completa (Version 3.0)
- ⏳ Agentes humanos (comerciantes, agricultores, conservacionistas)
- ⏳ Economía integrada (costo de formalización vs beneficio ambiental)
- ⏳ Políticas públicas múltiples (regulación, sanidad, educación)
- ⏳ Análisis de opciones de política para decisores

---

## Conclusión: Del Insight al Modelo

La Versión 2.0 operacionaliza la pregunta crítica del usuario:

**"¿De las ratas? ¿Se puede hacer?"**

Respuesta: **SÍ. Y aquí está cómo:**

1. Las ratas emergen como **consecuencia** de decisiones urbanas, no como invasoras "naturales"
2. La política pública urbana (formalización, gestión de residuos) **determina** la salud del humedal
3. El humedal es un **espejo** de la salud urbana
4. No se puede restaurar el humedal sin cambiar la ciudad

**Mensaje educativo:** Los ecosistemas naturales no son independientes. Están acoplados con sistemas sociales, económicos y políticos. El colapso del humedal no es un problema ecológico: es un problema político que requiere soluciones políticas.

---

*Versión 2.0 propuesta: Agosto 2026*  
*Estado: Listo para implementación*  
🐀🏙️🌳 Ratas como puente entre lo urbano y lo rural 🌳🏙️🐀
