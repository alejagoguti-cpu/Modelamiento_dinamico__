# 🔬 Bioindicadores y Dinámicas Dependientes de Densidad

## El Insight Crítico del Usuario

La presencia de una especie no es binaria (sí/no). Lo que importa es:

1. **¿Cuál es la DENSIDAD?**
   - 2 ratas en zona rural = conducta normal
   - 10,000 ratas en NYC = crisis urbana
   - 500 ratas en humedal = invasión ecológica

2. **¿Qué INDICA esa densidad?**
   - Ratas: indicador de disponibilidad de comida
   - Líquenes verdes: indicador de aire limpio
   - Líquenes blancos: indicador de aire contaminado (pero oxígeno abundante)

3. **El CONTEXTO determina la interpretación:**
   - Misma especie, interpretaciones diferentes según escala

---

## Bioindicadores: Implementación

### Definición Formal

Un **bioindicador** es una especie (o grupo) cuya presencia, ausencia o densidad revela condiciones ambientales específicas.

```python
class Bioindicator:
    """Especie que indica estado del ecosistema"""
    
    def __init__(self, name, indicative_of, density_ranges):
        self.name = name
        self.indicative_of = indicative_of  # Ej: "water_quality", "air_pollution"
        self.density_ranges = {
            # densidad → interpretación
            (0, 10): "Critical",
            (10, 50): "Poor", 
            (50, 200): "Moderate",
            (200, 500): "Healthy",
            (500, float('inf')): "Over-abundant"
        }
    
    def diagnose(self, current_density):
        """¿Qué nos dice esta especie sobre el ecosistema?"""
        for (min_d, max_d), condition in self.density_ranges.items():
            if min_d <= current_density < max_d:
                return condition, self.indicative_of
```

### Ejemplos de Bioindicadores en el Modelo

#### 1. **Ratas (Indicador de Comida Urbana)**

```
Ratas en ciudad:
  0-50:    "Normal" → Ecosistema urbano con control natural
  50-200:  "Moderada" → Comida disponible, gestión adecuada
  200-500: "Alta" → Problema de residuos emergente
  500+:    "Crisis" → Basura masiva, mercado informal sin control

Ratas en humedal:
  0-10:    "No invasoras" → Humedal sano
  10-50:   "Invasión incipiente" → Monitoreo necesario
  50-200:  "Invasión establecida" → Daño ecológico
  200+:    "Invasión masiva" → Colapso de especies nativas
```

**¿Qué indica?**
- Densidad baja → gestión urbana funciona
- Densidad alta → política de residuos falla

#### 2. **Moscas (Indicador de Descomposición)**

```
Moscas (Diptera):
  0-20:   "Bajo" → Poco alimento en descomposición
  20-100: "Moderado" → Descomposición normal
  100-300: "Alto" → Acumulación de materia orgánica
  300+:   "Excesivo" → Contaminación severa

¿Qué indica?
- Moscas altas → mucha materia orgánica disponible
         → comida abundante para ratas
         → próxima explosión de roedores
```

**Moscas como PREDICTOR:**
Si moscas_presentes > 200 por 2 meses consecutivos → Ratas aumentarán en 1-2 meses

#### 3. **Libélulas (Indicador de Calidad de Agua)**

```
Libélulas (Odonata):
  0-5:   "Agua muy contaminada" → Calidad agua < 30%
  5-20:  "Agua moderadamente contaminada" → Calidad 30-60%
  20-50: "Agua limpia" → Calidad 60-90%
  50+:   "Agua pristina" → Calidad > 90%

¿Qué indica?
- Ausencia de libélulas = SEÑAL DE ALARMA
- Presencia abundante = humedal sano
```

#### 4. **Hormigas (Indicador de Salud del Suelo)**

```
Hormigas (Formicidae):
  0-50:   "Suelo degradado" → Microorganismos < 40%
  50-200: "Suelo moderado" → Microorganismos 40-70%
  200-500: "Suelo sano" → Microorganismos 70-90%
  500+:   "Suelo excelente" → Microorganismos > 90%

¿Qué indica?
- Si hormigas desaparecen = suelo colapsando
- Explosión de hormigas = recuperación de nutrientes
```

#### 5. **Chironomidos - Mosquitos Acuáticos (Indicador de Eutrofización)**

```
Chironomidos:
  0-10:    "Agua oligotrófica" → Nutrientes bajos
  10-50:   "Agua mesotrófica" → Nutrientes moderados (IDEAL)
  50-150:  "Agua eutrófica" → Nutrientes excesivos
  150+:    "Agua hipereutrófica" → Blooms algales inminentes

¿Qué indica?
- Chironomidos altos = demasiados nutrientes
         → plantas acuáticas invasoras pronto van a dominar
         → abejas y flores tendrán dificultades
```

---

## Dinámicas Dependientes de Densidad

### Concepto Clave

El comportamiento de una especie cambia según su densidad absoluta:

```python
def density_dependent_dynamics(species_population, carrying_capacity):
    """
    Comportamiento cambia con densidad relativa
    """
    density_ratio = species_population / carrying_capacity
    
    if density_ratio < 0.2:
        # Baja densidad: reproducción alta, baja competencia
        return "rapid_growth"
    
    elif density_ratio < 0.7:
        # Densidad moderada: equilibrio
        return "stable"
    
    elif density_ratio < 1.0:
        # Densidad alta: competencia, estrés leve
        return "stressed"
    
    else:
        # Sobrepoblación: crisis, colisión con depredadores
        return "collapse_risk"
```

### Dinámicas Específicas de Ratas

#### Comportamiento a Baja Densidad (< 50 individuos)

```
Ratas con pocas ratas alrededor:
├─ Reproducción: MÁXIMA (12-15%)
├─ Dispersión: Baja (permanecen en territorio)
├─ Densidad de alimento/rata: ALTA
└─ Riesgo de predación: Bajo (menos visibles)

En la ciudad: Ratas discretas, no constituyen plaga evidente
En el humedal: Se establecen sin causar invasión inmediata
```

#### Comportamiento a Densidad Moderada (50-300)

```
Ratas con población media:
├─ Reproducción: Moderada (8-10%)
├─ Dispersión: Moderada (búsqueda activa de territorio)
├─ Densidad de alimento/rata: MODERADA
├─ Competencia: Comienza a surgir
└─ Riesgo de predación: Moderado

En la ciudad: Comienzan a verse, reportes iniciales
En el humedal: Invasión activa, depredación observable
```

#### Comportamiento a Densidad ALTA (300+)

```
Ratas con sobrepoblación:
├─ Reproducción: BAJA (4-5%, estrés denso-dependiente)
├─ Dispersión: MÁXIMA (escape de hacinamiento)
├─ Densidad de alimento/rata: BAJA (compiten agresivamente)
├─ Competencia: SEVERA (jerarquías territoriales fuertes)
├─ Estrés social: Alto (agresión, infanticidio)
└─ Riesgo de predación: MÁS ALTO (más visibles, más débiles)

En la ciudad: CRISIS VISIBLE (plagas masivas)
En el humedal: INVASIÓN MASIVA → depredación destructiva → colapso

Efecto: Migration_rate se dispara cuando population >> capacity
```

### Modelo Dinámico de Dispersión

```python
class RatPopulationWithDensityDynamics:
    def __init__(self):
        self.population = 50
        self.territory_expansion = 0  # km² ocupado
        
    def update(self, food_available):
        # Capacidad de carga depende de comida
        K = 20 * food_available  # 20 ratas por kg de comida
        
        # Densidad relativa
        density_ratio = self.population / K if K > 0 else float('inf')
        
        # Tasa de reproducción densidad-dependiente
        if density_ratio < 0.3:
            r = 0.15  # Crecimiento exponencial
        elif density_ratio < 0.7:
            r = 0.08  # Crecimiento logístico
        elif density_ratio < 1.0:
            r = 0.03  # Crecimiento lento
        else:
            r = -0.05  # Declive (sobrepoblación)
        
        # Dinámica logística
        self.population = self.population * (1 + r * (1 - density_ratio))
        
        # CLAVE: Dispersión aumenta con densidad
        if density_ratio > 0.8:
            # Alta densidad → fuerte impulso de emigración
            migration_rate = 0.10 * (density_ratio - 0.8) / 0.2  # Hasta 10%
        else:
            migration_rate = 0.01  # Migración basal
        
        migration = int(self.population * migration_rate)
        self.population -= migration
        
        return migration
```

---

## Insectos Específicos: Reglas Complejas

### Moscas (Diptera) - Indicador Temprano

```python
class Flies:
    """Moscas: rápidas, densidad alta, indicador de comida"""
    
    def __init__(self):
        self.population = 100
        self.generation_time = 7  # días (generación rápida)
    
    def update(self, organic_matter):
        # Moscas explotan materia orgánica RÁPIDAMENTE
        # Reproducción muy sensible a comida
        reproduction_rate = 0.40 * min(1.0, organic_matter / 50)  # 40% máximo
        
        # Mortalidad natural + predación de aves
        mortality_rate = 0.30  # Alta mortalidad
        
        # Dinámica
        births = self.population * reproduction_rate
        deaths = self.population * mortality_rate
        self.population = self.population + births - deaths
        
        # PREDICCIÓN: Si moscas_altas → ratas aumentarán en 1-2 meses
        if self.population > 200:
            return "RAT_BOOM_WARNING"
```

### Libélulas (Odonata) - Indicador de Agua Limpia

```python
class Dragonflies:
    """Libélulas: depredadores de mosquitos, amantes de agua limpia"""
    
    def __init__(self):
        self.population = 30
        self.water_quality_threshold = 60  # Necesitan agua > 60% limpia
    
    def update(self, water_quality, small_insects):
        # Libélulas requieren agua limpia
        if water_quality < self.water_quality_threshold:
            self.population = max(0, self.population * 0.7)  # Emigran
            return "WATER_POLLUTION_DETECTED"
        
        # Si agua está limpia, prosperan
        reproduction_rate = 0.08 * (water_quality / 100)
        mortality_rate = 0.05
        
        # También comen pequeños insectos (control natural)
        predation = min(small_insects * 0.1, self.population * 0.5)
        
        births = self.population * reproduction_rate
        deaths = self.population * mortality_rate
        self.population = self.population + births - deaths
        
        return "WATER_QUALITY_GOOD"
```

### Hormigas (Formicidae) - Indicador de Suelo

```python
class Ants:
    """Hormigas: aeroadores del suelo, indicador de salud edáfica"""
    
    def __init__(self):
        self.population = 500  # Colonias numerosas
        self.colony_strength = 1.0
    
    def update(self, soil_microorganisms, soil_nutrients):
        # Hormigas indican descomposición activa
        total_resources = soil_microorganisms + soil_nutrients
        
        # Reproducción acoplada a recursos del suelo
        reproduction_rate = 0.05 * (total_resources / 150)
        mortality_rate = 0.03
        
        # Estrés por degradación del suelo
        if total_resources < 50:
            self.colony_strength *= 0.8  # Colonias débiles
            return "SOIL_DEGRADATION_WARNING"
        
        births = self.population * reproduction_rate
        deaths = self.population * mortality_rate
        self.population = self.population + births - deaths
        
        # Hormigas aerfican suelo (mejora microorganismos)
        soil_microorganisms *= 1.05 * self.colony_strength
        
        return "SOIL_HEALTHY"
```

### Chironomidos (Mosquitos Acuáticos) - Indicador de Eutrofización

```python
class Chironomids:
    """Chironomidos: toleran eutrofización, explotan nutrientes excesivos"""
    
    def __init__(self):
        self.population = 50
    
    def update(self, nutrient_level):
        # Chironomidos prosperan en agua eutrófica (muchos nutrientes)
        # Pero indican problema de eutrofización
        
        # Tolerancia a nutrientes altos
        if nutrient_level < 30:
            self.population = max(0, self.population * 0.9)
            return "OLIGOTROPHIC"  # Pocos nutrientes
        
        elif nutrient_level < 70:
            # Nivel ideal de nutrientes
            reproduction_rate = 0.06
            return "MESOTROPHIC"  # Equilibrio
        
        else:
            # Eutrofización: chironomidos EXPLOTAN
            reproduction_rate = 0.20 * (nutrient_level / 100)
            return "EUTROPHIC_WARNING"  # Demasiados nutrientes → algas
        
        mortality_rate = 0.04
        births = self.population * reproduction_rate
        deaths = self.population * mortality_rate
        self.population = self.population + births - deaths
```

---

## Sistema de Diagnóstico Integrado

### Dashboard de Bioindicadores

```
╔════════════════════════════════════════════════════════╗
║           ECOSYSTEM HEALTH DIAGNOSIS                   ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  URBAN CONDITION (Ratas como indicador):              ║
║  ├─ Ratas urbanas: 347 individuos                    ║
║  ├─ Interpretación: "Crisis moderada" ⚠️             ║
║  ├─ Predicción: Invasión de humedal en 2-3 meses   ║
║  └─ Recomendación: FORMALIZAR MERCADO               ║
║                                                        ║
║  FOOD AVAILABILITY (Moscas como indicador):          ║
║  ├─ Moscas presentes: 485 individuos                ║
║  ├─ Interpretación: "Materia orgánica abundante" ⚠️ ║
║  ├─ Predicción: Boom de ratas próximo               ║
║  └─ Correlación: Con basura urbana (+0.87)          ║
║                                                        ║
║  WATER QUALITY (Libélulas como indicador):           ║
║  ├─ Libélulas presentes: 12 individuos              ║
║  ├─ Interpretación: "Agua moderadamente limpia" ⚠️  ║
║  ├─ Valor: 65% calidad                              ║
║  └─ Tendencia: Descendiendo (-5% este mes)          ║
║                                                        ║
║  SOIL HEALTH (Hormigas como indicador):              ║
║  ├─ Hormigas presentes: 1,200 individuos            ║
║  ├─ Interpretación: "Suelo sano" ✅                 ║
║  ├─ Valor: Microorganismos 78%                      ║
║  └─ Estatus: Estable (+2% este mes)                 ║
║                                                        ║
║  NUTRIENT CYCLING (Chironomidos como indicador):    ║
║  ├─ Chironomidos presentes: 340 individuos          ║
║  ├─ Interpretación: "Eutrofización incipiente" ⚠️   ║
║  ├─ Riesgo: Invasión de plantas acuáticas          ║
║  └─ Causa probable: Ratas aportando contaminación   ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║  SYSTEMIC DIAGNOSIS:                                  ║
║                                                        ║
║  La ciudad (mercado informal) genera basura         ║
║  → Moscas explotan la materia orgánica               ║
║  → Ratas explotan la comida de moscas/basura        ║
║  → Ratas migrando a humedal (predicción: 2 meses)   ║
║  → Eutrofización comenzando (chironomidos altos)    ║
║  → Agua se contamina (libélulas disminuyen)         ║
║  → Suelo aún sano (hormigas presentes)              ║
║                                                        ║
║  INTERVENCIÓN RECOMENDADA:                           ║
║  1. URGENTE: Formalizar mercado (F × 5)            ║
║  2. URGENTE: Control de moscas (reduce ratas)       ║
║  3. MODERADO: Monitorear libélulas (agua)          ║
║  4. Mantener salud del suelo (continuar)            ║
║                                                        ║
║  Ventana crítica: 30 días antes de invasión humedal ║
╚════════════════════════════════════════════════════════╝
```

---

## Implementación en Versión 2.1

### Nueva clase `BioindicatorSystem`

```python
class BioindicatorSystem:
    def __init__(self):
        self.indicators = {
            'flies': Flies(),
            'dragonflies': Dragonflies(),
            'ants': Ants(),
            'chironomids': Chironomids(),
        }
        self.diagnoses = {}
    
    def update(self, state):
        # Actualizar todas las poblaciones de indicadores
        self.diagnoses['flies'] = self.indicators['flies'].update(state.organic_matter)
        self.diagnoses['dragonflies'] = self.indicators['dragonflies'].update(state.water_quality, state.small_insects)
        self.diagnoses['ants'] = self.indicators['ants'].update(state.microorganisms, state.nutrients)
        self.diagnoses['chironomids'] = self.indicators['chironomids'].update(state.nutrients)
    
    def get_system_diagnosis(self):
        """Retorna diagnóstico integrado del ecosistema"""
        warnings = []
        
        if self.diagnoses.get('flies') == "RAT_BOOM_WARNING":
            warnings.append("⚠️ Boom de ratas predicho en 1-2 meses")
        
        if self.diagnoses.get('dragonflies') == "WATER_POLLUTION_DETECTED":
            warnings.append("⚠️ Contaminación de agua detectada")
        
        if self.diagnoses.get('ants') == "SOIL_DEGRADATION_WARNING":
            warnings.append("⚠️ Degradación del suelo")
        
        if self.diagnoses.get('chironomids') == "EUTROPHIC_WARNING":
            warnings.append("⚠️ Eutrofización: invasión de plantas acuáticas próxima")
        
        return warnings
```

---

## El Poder Educativo de los Bioindicadores

### Aprendizaje Clave

**No miras la especie en sí. Miras la especie para entender lo que está sucediendo en el sistema.**

```
Usuario novato:
"¿Hay libélulas?"
"Sí, 20"
"Okay, ¿y eso qué significa?"

Usuario experto:
"¿Hay libélulas y cuántas?"
"Hay 20, pero hace 3 meses había 60"
"Significa que el agua se está contaminando. 
 Dentro de 2 meses vamos a ver problemas serios."
```

### Ejemplo de Cadena Predictiva

```
MES 1: Moscas aumentan a 300 (basura urbana se acumula)
       → Diagnóstico: Comida abundante para ratas

MES 2: Ratas urbanas suben a 450 (explotan moscas + basura)
       → Diagnóstico: Crisis urbana emergente

MES 3: Chironomidos suben a 400 (contaminación por ratas)
       → Diagnóstico: Eutrofización comenzando

MES 4: Libélulas bajan a 8 (agua se contamina)
       → Diagnóstico: Colapso de calidad de agua

MES 5: Ratas en humedal = 200+ (invasión masiva)
       → Resultado: Humedal invadido

LECCIÓN: La cascada comenzó hace 4 meses con moscas.
         Cada indicador predice el siguiente.
         El usuario que vigila bioindicadores 
         puede intervenir temprano.
```

---

## Conclusión: Densidad y Densidad Contextual

La densidad no es un número. Es una **lectura del estado del sistema**.

- 2 ratas = "Normal"
- 50 ratas = "Atención"
- 500 ratas = "Crisis"

Y cada uno de esos estados tiene **predictores** (bioindicadores) que lo precedieron.

El modelo Version 2.1 enseña:
✅ Las especies no son buenas/malas, son **indicadores**
✅ La densidad revela procesos subyacentes
✅ Observar indicadores permite **predicción temprana**
✅ Los sistemas son **acoplados**: cambios en uno revelan cambios en otro

---

*Bioindicadores: La ecología es lectura, no conteo* 🔬🐛🐀

*Versión 2.1 propuesta: Agosto 2026*
