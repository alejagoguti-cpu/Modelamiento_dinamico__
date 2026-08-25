# 📚 Índice del Proyecto - Abejas & Humedal

## Estructura del Repositorio

```
📁 Modelamiento_dinamico__/
│
├── 📄 INDEX.md                                ← Este archivo (navegación)
├── 📄 README_JUEGO.md                         ← Manual de usuario
├── 📄 PROJECT_SUMMARY.md                      ← Resumen del proyecto
├── 📄 INTERACTION_NETWORK.md                  ← Red de interacciones ecológicas
├── 📄 ECOLOGICAL_TERMINOLOGY_NOTES.md         ← Notas sobre terminología y futuro
│
├── 🎮 bees_wetland_game.py                    ← Código principal del juego (~700 líneas)
├── 📦 requirements.txt                         ← Dependencias (pygame)
│
├── 🆕 VERSIÓN 2.0 - INTEGRACIÓN DE RATAS:
├── 📄 URBAN_ECOLOGY_DIMENSION.md              ← Ratas como biosensores socioecológicos
├── 📄 VERSION_2_RAT_INTEGRATION.md            ← Diseño técnico de integración de ratas
├── 📄 BIOINDICATORS_AND_DENSITY_DYNAMICS.md   ← Bioindicadores y dinámicas poblacionales
├── 📄 FUTURE_DIMENSIONS.md                    ← Visión a escala múltiple (v3.0-v4.0)
│
└── 📦 .git/                                   ← Historial de commits
```

---

## 📖 Guía de Lectura Recomendada

### Para Usuarios Nuevos
1. **Comienza con:** `README_JUEGO.md`
   - Instrucciones de instalación
   - Explicación de dinámicas
   - Controles del juego
   - Sugerencias para experimentar

2. **Luego lee:** `PROJECT_SUMMARY.md`
   - Visión general del proyecto
   - Características completamente documentadas
   - Conceptos de ecología aprendidos

### Para Desarrolladores
1. **Revisar:** `bees_wetland_game.py`
   - Clases principales
   - Lógica de simulación
   - Dinámicas ecológicas implementadas

2. **Documentación complementaria:**
   - `INTERACTION_NETWORK.md` - Dinámicas ecológicas
   - `ECOLOGICAL_TERMINOLOGY_NOTES.md` - Mejoras futuras

### Para Investigadores
1. **Empezar con:** `INTERACTION_NETWORK.md`
   - Matriz completa de interacciones
   - Ciclos de retroalimentación
   - Umbrales críticos
   - Cascadas ecológicas

2. **Luego:** `ECOLOGICAL_TERMINOLOGY_NOTES.md`
   - Propuestas para versión 2.0
   - Mejoras en terminología ecológica
   - Nuevas dinámicas a implementar

### Para Especialistas en Socio-Ecología
1. **Comienza con:** `URBAN_ECOLOGY_DIMENSION.md`
   - Conexión urbano-rural
   - Ratas como biosensores socioecológicos
   - Política pública y ecosistemas

2. **Profundiza con:** `VERSION_2_RAT_INTEGRATION.md`
   - Diseño técnico de integración de ratas
   - Dinámicas urbano-rurales
   - Escenarios emergentes

3. **Especialización:** `BIOINDICATORS_AND_DENSITY_DYNAMICS.md`
   - Bioindicadores ecológicos
   - Dinámicas dependientes de densidad
   - Sistemas de diagnóstico integrado

### Para Desarrollo Futuro (v3.0+)
- Consulta `FUTURE_DIMENSIONS.md` para roadmap completo
- Propone: multi-escala, ecotonos, resiliencia, fragmentación urbana

---

## 📑 Contenido Detallado de Cada Archivo

### 🎮 `bees_wetland_game.py`
**Tipo:** Código Python  
**Tamaño:** ~700 líneas  
**Dependencias:** pygame

**Contiene:**
- Clase `State` - Estado global del ecosistema
- Clase `Bee` - Abejas polinizadoras
- Clase `Flower` - Flores nativas
- Clase `Bird` - Aves depredadoras/nectarívoras
- Clase `InvasiveSpecies` - Especies invasoras terrestres
- Clase `AquaticPlant` - Plantas acuáticas (buchón)
- Clase `WetlandGame` - Engine de simulación principal

**Dinámicas Implementadas:**
- Búsqueda y polinización de flores
- Depredación de abejas por aves
- Competencia por nutrientes
- Ciclos estacionales
- Contaminación ambiental
- Invasión de especies
- Microorganismos y nutrientes del suelo

---

### 📖 `README_JUEGO.md`
**Tipo:** Documentación educativa  
**Audiencia:** Usuarios finales, estudiantes

**Secciones:**
1. Descripción general del juego
2. Instrucciones de instalación
3. Controles básicos e interactivos
4. Elementos visuales explicados
5. Dinámicas ecológicas detalladas
6. Indicadores de salud del ecosistema
7. Interpretación de resultados
8. Conceptos ecológicos base

**Propósito:** Ser guía amigable para usar el juego y aprender ecología

---

### 📋 `PROJECT_SUMMARY.md`
**Tipo:** Resumen ejecutivo  
**Audiencia:** Stakeholders, profesores, investigadores

**Secciones:**
1. Resumen ejecutivo del proyecto
2. Componentes del proyecto
3. Características del juego
4. Especies simuladas
5. Parámetros ambientales
6. Dinámicas ecológicas
7. Observaciones ecológicas clave
8. Método de estudio recomendado
9. Conceptos aprendidos
10. Métricas y datos generados
11. Posibilidades de extensión

**Propósito:** Visión completa del proyecto para toma de decisiones

---

### 🕸️ `INTERACTION_NETWORK.md`
**Tipo:** Documentación científica  
**Audiencia:** Ecólogos, investigadores, estudiantes avanzados

**Contenido Principal:**
1. **Diagrama ASCII de la red trófica completa**
2. **Matriz de interacciones** (9×9 especies/factores)
3. **Ciclos de retroalimentación:**
   - Positivos (amplificación)
   - Negativos (estabilización)
4. **Triángulo depredador-presa-recurso**
5. **Competencia multi-herbívoro**
6. **Umbrales críticos** para cada factor
7. **Escenarios emergentes:**
   - Contaminación + invasoras
   - Explosión de abejas + depredación
   - Contaminación simultánea
8. **Indicadores de salud ecosistémica**

**Propósito:** Referencia técnica para entender todas las interacciones

---

### 🔬 `ECOLOGICAL_TERMINOLOGY_NOTES.md`
**Tipo:** Documentación especializada  
**Audiencia:** Ecólogos, filósofos de la ciencia, desarrolladores futuro

**Secciones:**
1. **Crítica de terminología:**
   - Por qué "invasora" es problemático
   - Propuesta de "especies ventajosas"
   - Perspectiva posthumana

2. **Especies migratorias:**
   - Concepto no implementado
   - Cómo implementar
   - Nuevos escenarios ecológicos

3. **Agentes específicos:**
   - De genérico a específico
   - Dinámicas por especie

4. **Factores temporales:**
   - Ritmos circadianos
   - Ciclos de vida individuales
   - Periodicidad de recursos

5. **Mejoras de red:**
   - Ciclos hídricos
   - Ciclos de nutrientes
   - Ciclos de energía

6. **Roadmap para versión 2.0**

7. **Reflexión epistemológica**

**Propósito:** Preparar fundación científica para evoluciones futuras

---

### 🏙️ `URBAN_ECOLOGY_DIMENSION.md`
**Tipo:** Análisis socio-ecológico  
**Audiencia:** Ecólogos políticos, investigadores, formuladores de política

**Contenido Principal:**
1. **Ratas como biosensores** de condiciones socioeconómicas
2. **Cadena causal:** Pobreza → Mercado informal → Basura → Ratas → Humedal degradado
3. **Crítica de terminología:** "Invasoras" como indicadores de falla de política pública
4. **Interconexión urbano-rural** y ciclos viciosos de degradación
5. **Propuestas políticas integradas** para solucionar humedales (requiere cambio urbano)

**Propósito:** Reencuadrar invasiones biológicas como síntomas de injusticia social

---

### 🎯 `VERSION_2_RAT_INTEGRATION.md`
**Tipo:** Especificación técnica de versión 2.0  
**Audiencia:** Desarrolladores, investigadores, educadores

**Contenido Principal:**
1. **Arquitectura urbano-rural** con mercados y poblaciones de ratas
2. **Nuevas clases de agentes:**
   - `UrbanMarket` - genera basura según regulación
   - `RatPopulation` - reproduce/migra según disponibilidad de comida
3. **Dinámicas implementadas:**
   - Reproducción densidad-dependiente
   - Migración a humedal cuando población satura
   - Predación de ratas en aves/insectos del humedal
4. **Controles interactivos de política urbana:**
   - Formalizar mercado, control de plagas, sanidad
5. **Escenarios emergentes:**
   - Mercado formal: ratas controladas, humedal sano
   - Mercado informal: invasión masiva, colapso
   - Intervención tardía: daño residual persistente
6. **Cronograma de implementación:** Fases 1-4

**Propósito:** Plano técnico para implementar Versión 2.0

---

### 🐛 `BIOINDICATORS_AND_DENSITY_DYNAMICS.md`
**Tipo:** Documentación especializada  
**Audiencia:** Ecólogos, educadores, investigadores de sistemas complejos

**Contenido Principal:**
1. **Concepto de bioindicadores:**
   - Especie cuya densidad revela condiciones ambientales
   - NO es binaria (presencia/ausencia) sino continua (densidad)

2. **Ejemplos implementados:**
   - Ratas → indicador de comida urbana y política de residuos
   - Moscas → indicador de materia orgánica disponible (predictor de boom de ratas)
   - Libélulas → indicador de calidad de agua
   - Hormigas → indicador de salud del suelo
   - Chironomidos → indicador de eutrofización

3. **Dinámicas dependientes de densidad:**
   - Baja densidad: crecimiento exponencial, expansión territorial mínima
   - Densidad moderada: equilibrio, reproducción moderada
   - Alta densidad: estrés, competencia, máxima dispersión

4. **Sistema de diagnóstico integrado:**
   - Dashboard mostrando estado de todos los indicadores
   - Predicciones en cascada (moscas altas → boom de ratas → invasión humedal)
   - Ventana temporal para intervención

5. **Poder educativo:**
   - Enseña a "leer" ecosistemas a través de indicadores
   - Conexión entre observación de densidades y causalidad sistémica

**Propósito:** Fundación teórica para modelos avanzados de diagnosis ecosistémica

---

### 📦 `requirements.txt`
**Contiene:** 
```
pygame>=2.0.0
```

**Propósito:** Gestionar dependencias del proyecto

---

## 🎯 Características Principales del Juego

| Característica | Implementada | Archivo |
|---|---|---|
| Abejas polinizadoras | ✅ | bees_wetland_game.py:45-78 |
| Flores nativas | ✅ | bees_wetland_game.py:80-101 |
| Aves depredadoras | ✅ | bees_wetland_game.py:123-174 |
| Especies invasoras | ✅ | bees_wetland_game.py:103-122 |
| Plantas acuáticas | ✅ | bees_wetland_game.py:176-209 |
| Microorganismos | ✅ | Lógica en update() |
| Nutrientes del suelo | ✅ | Lógica en update() |
| Contaminación agua | ✅ | Eventos aleatorios |
| Contaminación aire | ✅ | Eventos aleatorios |
| Ciclos estacionales | ✅ | update() línea 254 |
| Seguimiento mensual/anual | ✅ | update() línea 246-252 |
| Controles interactivos | ✅ | handle_events() |
| Visualización en tiempo real | ✅ | draw() |

---

## 🔍 Buscar Información Específica

### "¿Cómo funcionan las abejas?"
- **Archivo:** `bees_wetland_game.py`
- **Líneas:** 45-78 (clase Bee)
- **Documentación:** `README_JUEGO.md` - Sección "Ciclo de las Abejas"

### "¿Qué son las plantas acuáticas?"
- **Archivo:** `bees_wetland_game.py`
- **Líneas:** 176-209 (clase AquaticPlant)
- **Documentación:** `INTERACTION_NETWORK.md` - Sección "Ocupación del Hábitat"

### "¿Cómo contamino el agua?"
- **Archivo:** `bees_wetland_game.py`
- **Líneas:** 535-538 (evento W)
- **Documentación:** `README_JUEGO.md` - Sección "Controles Interactivos"

### "¿Cuáles son los ciclos de retroalimentación?"
- **Archivo:** `INTERACTION_NETWORK.md`
- **Sección:** "Redes de Retroalimentación (Ciclos de Refuerzo)"

### "¿Qué es una cascada ecológica?"
- **Archivo:** `INTERACTION_NETWORK.md`
- **Sección:** "Ejemplos de Cascadas Ecológicas Emergentes"

### "¿Cómo mejorar el modelo?"
- **Archivo:** `ECOLOGICAL_TERMINOLOGY_NOTES.md`
- **Sección:** "Propuesta para Versión 2.0"

### "¿Qué son ratas como biosensores?"
- **Archivo:** `URBAN_ECOLOGY_DIMENSION.md`
- **Sección:** "La Rata como Biosensor Socioeconómico"
- **Tema:** Ratas indican condiciones de pobreza urbana y falta de regulación

### "¿Cómo conectar ciudad y humedal?"
- **Archivo:** `URBAN_ECOLOGY_DIMENSION.md`
- **Sección:** "La Ruta de Contaminación: Plaza → Humedal"
- **Tema:** Cadena causal de política urbana a degradación de humedal

### "¿Qué es Versión 2.0 de Ratas?"
- **Archivo:** `VERSION_2_RAT_INTEGRATION.md`
- **Sección Completa:** Arquitectura, clases nuevas, dinámicas implementadas

### "¿Qué son bioindicadores?"
- **Archivo:** `BIOINDICATORS_AND_DENSITY_DYNAMICS.md`
- **Sección:** "Bioindicadores: Implementación"
- **Tema:** Especies cuya densidad revela estado del ecosistema

### "¿Cómo leen los ecólogos los ecosistemas?"
- **Archivo:** `BIOINDICATORS_AND_DENSITY_DYNAMICS.md`
- **Sección:** "El Poder Educativo de los Bioindicadores"
- **Tema:** Usar indicadores para predicción temprana de cambios

### "¿Qué es dinámicas dependientes de densidad?"
- **Archivo:** `BIOINDICATORS_AND_DENSITY_DYNAMICS.md`
- **Sección:** "Dinámicas Dependientes de Densidad"
- **Tema:** Mismo agente, comportamiento diferente según densidad absoluta

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de código Python** | ~700 (v1.0) |
| **Clases de agentes** | 6 (v1.0), +3 planeadas (v2.0) |
| **Parámetros ambientales** | 12+ |
| **Especies simuladas** | 5 (v1.0), +5 bioindicadores (v2.0) |
| **Dinámicas implementadas** | 15+ (v1.0), +10 (v2.0) |
| **Documentación (palabras)** | 15,000+ |
| **Archivos Markdown** | 8 (v1.0 + v2.0 design) |
| **Commits de desarrollo** | 9+ |
| **Escenarios emergentes documentados** | 10+ |
| **Conexión urbano-rural** | ✅ Documentada, v2.0 planeada |

---

## 🚀 Cómo Usar Este Repositorio

### Opción 1: Jugar el Juego
```bash
pip install -r requirements.txt
python bees_wetland_game.py
```

### Opción 2: Estudiar Ecología
1. Lee `README_JUEGO.md`
2. Lee `PROJECT_SUMMARY.md`
3. Lee `INTERACTION_NETWORK.md`
4. Experimenta con el juego
5. Consulta `ECOLOGICAL_TERMINOLOGY_NOTES.md` para entender limitaciones

### Opción 3: Investigación
1. Lee `INTERACTION_NETWORK.md` completamente
2. Estudia `bees_wetland_game.py`
3. Lee `ECOLOGICAL_TERMINOLOGY_NOTES.md`
4. Propón mejoras

### Opción 4: Desarrollo Futuro
1. Consulta `ECOLOGICAL_TERMINOLOGY_NOTES.md` - Sección "Propuesta para Versión 2.0"
2. Comienza con clases específicas de especies
3. Implementa ciclos migratorios
4. Añade ritmos circadianos

---

## 📞 Estructura de Commits

```
Versión 1.0 (8 commits):
1. Código base + características principales
2. Controles interactivos + seguimiento mensual/anual
3. Documentación de niveles tróficos
4. Plantas acuáticas invasoras
5. Diagrama de red de interacciones
6. Resumen de proyecto completo
7. Mejoras de instalación
8. Terminología ecológica + roadmap futuro

Versión 2.0 - Diseño (3+ commits):
9. Dimensión urbano-ecológica: Ratas como biosensores
10. Especificación técnica Version 2.0 - Integración de Ratas
11. Bioindicadores y dinámicas dependientes de densidad
(+ commits de implementación pendientes)
```

---

## ✅ Checklist de Completitud

### Versión 1.0 (Completa)
- ✅ Código funcional y documentado
- ✅ Simulación de ecosistema completo
- ✅ Manual de usuario
- ✅ Documentación técnica
- ✅ Guía de interacciones ecológicas
- ✅ Propuestas para mejora
- ✅ Ejemplos de experimentación
- ✅ Instalación clara
- ✅ Comentarios en código
- ✅ Historial de commits limpio

### Versión 2.0 (Diseño Completo, Implementación Pendiente)
- ✅ Documentación de dimensión urbano-ecológica
- ✅ Especificación técnica de integración de ratas
- ✅ Framework de bioindicadores
- ✅ Dinámicas densidad-dependientes documentadas
- ⏳ Implementación de clases `UrbanMarket` y `RatPopulation`
- ⏳ Controles interactivos de política urbana
- ⏳ Sistema de diagnóstico de bioindicadores
- ⏳ Testing con escenarios de perturbación

### Versión 3.0+ (Roadmap Documentado)
- ✅ Propuesta de multi-escala (FUTURE_DIMENSIONS.md)
- ✅ Concepto de ecotonos
- ✅ Métricas de resiliencia
- ✅ Fragmentación urbana
- ⏳ Agentes humanos con comportamientos diversos
- ⏳ Integración de economía y política pública

---

## 🎓 Valor Educativo

Este proyecto proporciona:

1. **Comprensión de Sistemas Complejos**
   - Cómo la complejidad emerge de reglas simples
   - Por qué los ecosistemas son impredecibles

2. **Conceptos de Ecología**
   - Cadenas tróficas reales
   - Ciclos biogeoquímicos
   - Invasión de especies
   - Resiliencia ecosistémica

3. **Herramientas de Análisis**
   - Modelamiento dinámico
   - Simulación basada en agentes
   - Análisis de redes

4. **Investigación Práctica**
   - Experimentación interactiva
   - Observación de emergencias
   - Predicción de colapsos

---

**¡Bienvenido al humedal dinámico!** 🌍🐝🌸  
**Experimenta, observa, aprende.** 📚

---

*Última actualización: Agosto 2026*  
*Estado: Completo y documentado* ✅
