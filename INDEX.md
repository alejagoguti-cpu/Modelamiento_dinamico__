# 📚 Índice del Proyecto - Abejas & Humedal

## Estructura del Repositorio

```
📁 Modelamiento_dinamico__/
│
├── 📄 INDEX.md                           ← Este archivo
├── 📄 README_JUEGO.md                    ← Manual de usuario
├── 📄 PROJECT_SUMMARY.md                 ← Resumen del proyecto
├── 📄 INTERACTION_NETWORK.md             ← Red de interacciones ecológicas
├── 📄 ECOLOGICAL_TERMINOLOGY_NOTES.md    ← Notas sobre terminología y futuro
│
├── 🎮 bees_wetland_game.py               ← Código principal del juego (~700 líneas)
├── 📦 requirements.txt                    ← Dependencias (pygame)
│
└── 📦 .git/                              ← Historial de commits
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

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de código Python** | ~700 |
| **Clases de agentes** | 6 |
| **Parámetros ambientales** | 12+ |
| **Especies simuladas** | 5 |
| **Dinámicas implementadas** | 15+ |
| **Documentación (palabras)** | 5000+ |
| **Archivos Markdown** | 5 |
| **Commits de desarrollo** | 8+ |
| **Escenarios emergentes documentados** | 3 |

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
8 commits de desarrollo:

1. Código base + características principales
2. Controles interactivos + seguimiento mensual/anual
3. Documentación de niveles tróficos
4. Plantas acuáticas invasoras
5. Diagrama de red de interacciones
6. Resumen de proyecto completo
7. Mejoras de instalación
8. Terminología ecológica + roadmap futuro
```

---

## ✅ Checklist de Completitud

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
