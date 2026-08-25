# 🌍 Proyecto: Abejas & Humedal - Modelamiento Dinámico de Ecosistemas

## Resumen Ejecutivo

Un juego interactivo educativo que simula la dinámica compleja de un ecosistema de humedal, mostrando cómo los comportamientos de pequeña escala (insectos individuales) generan efectos emergentes a nivel de ecosistema completo.

**Objetivo:** Comprender cómo funcionan las relaciones ecológicas, qué sucede cuando se perturba el sistema, y cómo emergen comportamientos inesperados de interacciones simples.

---

## 📦 Componentes del Proyecto

### 1. **Archivo Principal: `bees_wetland_game.py`**
- Simulación en tiempo real con Pygame
- ~650 líneas de código orientado a objetos
- Clases para cada especie: Bee, Flower, Bird, InvasiveSpecies, AquaticPlant
- Sistema de estado del ecosistema con 15+ parámetros ambientales

### 2. **Documentación Educativa**

#### `README_JUEGO.md` 
- Manual de usuario completo
- Explicación de dinámicas ecológicas
- Guía de controles interactivos
- Interpretación de resultados
- Sugerencias para experimentación

#### `INTERACTION_NETWORK.md`
- Diagrama completo de la red trófica
- Matriz de interacciones entre especies
- Ciclos de retroalimentación (positivos y negativos)
- Umbrales críticos y puntos de no retorno
- Escenarios de cascadas ecológicas emergentes
- Indicadores de salud del ecosistema

### 3. **Archivo de Requisitos: `requirements.txt`**
- Especifica única dependencia: pygame

---

## 🎮 Características del Juego

### Especies Simuladas (Niveles Tróficos)

```
Productores Primarios:
  🌸 Flores nativas (terrestres)
  🪴 Plantas acuáticas invasoras (buchón)

Consumidores Primarios:
  🐝 Abejas (polinizadores, herbívoras)

Consumidores Secundarios:
  🦅 Aves (depredadoras de abejas, nectarívoras)

Descomponedores:
  🧬 Microorganismos del suelo

Invasores:
  🚨 Especies invasoras terrestres
```

### Parámetros Ambientales Simulados

1. **Recursos Hídricos**
   - Calidad del agua (0-100%)
   - Afecta supervivencia de flora

2. **Aire**
   - Calidad del aire (0-100%)
   - Afecta energía de abejas

3. **Suelo**
   - Microorganismos (0-100%)
   - Nutrientes disponibles (0-100%)
   - Afectan crecimiento de plantas

4. **Vegetación**
   - Índice de clorofila (0-100%)
   - Indicador de salud vegetal

5. **Ecosistema**
   - Ocupación del hábitat (0-100%)
   - Capacidad del humedal

### Dinámicas Ecológicas Implementadas

#### Polinización
- Abejas buscan flores automáticamente
- Al encontrar flor → ganancia de energía + polinización
- Flores polinizadas tienen posibilidad de reproducirse

#### Depredación
- Aves buscan abejas (prioridad) o flores (néctar)
- Encontrar presa → ganancia de energía
- Ciclo depredador-presa natural

#### Competencia
- Especies compiten por nutrientes
- Invasoras dominan si el ecosistema está degradado
- Plantas acuáticas consumen nutrientes agresivamente

#### Ciclos Estacionales
- Primavera: muchas flores, reproducción moderada
- Verano: pocas flores, máxima reproducción de abejas
- Otoño: pocas flores, baja reproducción
- Invierno: casi sin actividad reproductiva

#### Contaminación Ambiental
- Eventos aleatorios de contaminación
- Usuarios pueden inyectar contaminación (teclas W, A)
- Afecta supervivencia y energía de organismos

---

## 🎯 Controles Interactivos

### Controles Básicos
| Tecla | Acción |
|-------|--------|
| ESPACIO | Pausar/Reanudar |
| R | Reiniciar juego |
| Q | Salir |

### Controles Experimentales (Inyectar Eventos)
| Tecla | Evento | Efecto |
|-------|--------|--------|
| ↑ | +5 abejas | Aumenta pequeña escala → observar cascada |
| ↓ | -5 abejas | Reduce presión depredadora |
| W | Contamina agua | -30% calidad agua |
| A | Contamina aire | -25% calidad aire |
| P | Germinar flores | Evento de clima favorable |

**Preguntas para investigar:**
- "¿Qué pasa si añado 15 abejas de golpe?"
- "¿Se recupera el ecosistema si contamino el agua?"
- "¿Cómo afectan simultáneamente la contaminación de agua + aire?"
- "¿Las plantas acuáticas son más resistentes que las nativas?"

---

## 📊 Observaciones Ecológicas Clave

### Emergencias No Obvias

El juego demuestra comportamientos emergentes que no son predecibles de las reglas individuales:

1. **Explosión de Invasoras**
   - Agua contaminada → Invasoras prosperan → Nutrientes se agotan → Flores colapsan

2. **Colapso del Polinizador**
   - Plantas acuáticas abundantes → Consumo de nutrientes → Flores débiles → Abejas sin alimento → Aves sin presas

3. **Ciclos Depredador-Presa**
   - Muchas abejas → Aves aparecer → Depredación → Pocas abejas → Aves desaparecen → Recuperación

4. **Puntos de No Retorno**
   - Hay umbrales donde pequeños cambios crean grandes efectos
   - Pasado cierto punto, el ecosistema NO se recupera

### Factores de Resiliencia

- **Microorganismos activos** → Recuperación de nutrientes
- **Flores diversas** → Resistencia a invasoras
- **Aves presentes** → Control de plagas
- **Agua limpia** → Base de toda la vida

---

## 🔬 Método de Estudio

### Investigación Recomendada

1. **Exploración Natural (Sin Intervención)**
   - Observar 10+ meses de simulación natural
   - Identificar ciclos estacionales
   - Ver fluctuaciones naturales

2. **Pruebas de Perturbación (Una Variable)**
   - Inyectar un único tipo de estrés
   - Observar recuperación o colapso
   - Medir tiempo de retorno a equilibrio

3. **Estrés Múltiple (Multi-Perturbación)**
   - Aplicar simultáneamente W + A
   - Ver sinergia de impactos
   - Identificar factor limitante

4. **Manipulación de Poblaciones**
   - ↑ para aumentar abejas
   - Observar efecto en cadena trófica
   - Encontrar equilibrio óptimo

---

## 🎓 Conceptos Aprendidos

### Conceptos de Ecología
- ✅ Cadenas y redes tróficas
- ✅ Ciclos biogeoquímicos (nutrientes, agua)
- ✅ Sucesión ecológica
- ✅ Invasión de especies
- ✅ Biodiversidad y resiliencia
- ✅ Umbrales de cambio de régimen
- ✅ Retroalimentación positiva y negativa

### Modelamiento Dinámico
- ✅ Agentes autónomos
- ✅ Sistemas complejos adaptativos
- ✅ Emergencia de comportamientos
- ✅ Causalidad circular
- ✅ Multi-escala (individual → población → ecosistema)

### Aplicaciones Prácticas
- 🌾 Restauración de humedales
- 🐝 Conservación de polinizadores
- 🌿 Control de especies invasoras
- 💧 Gestión de calidad del agua
- 🌍 Cambio climático y biodiversidad

---

## 📈 Métricas y Datos

### Parámetros Rastreados
- Población de 5 grupos principales (abejas, flores, aves, invasoras, plantas acuáticas)
- 6 variables ambientales (agua, aire, nutrientes, microorganismos, clorofila, ocupación)
- Ciclo temporal (días, meses, años)
- Estado de cada individuo (edad, energía, salud)

### Estadísticas Generadas
- Dinámicas temporales de poblaciones
- Correlaciones entre factores ambientales
- Identificación de puntos de quiebre
- Análisis de ciclos predador-presa

---

## 🚀 Posibilidades de Extensión

### Características Futuras Potenciales

1. **Más Especies**
   - Depredadores secundarios (caimanes, águilas)
   - Herbívoros adicionales (peces, crustáceos)
   - Plantas complementarias

2. **Factores Adicionales**
   - Cambio climático gradual (temperatura)
   - Variabilidad de lluvia (ciclos hídricos)
   - Perturbaciones extremas (inundaciones, sequías)

3. **Interfaz Mejorada**
   - Gráficos de series temporales en vivo
   - Red de interacciones visualizada
   - Exportación de datos
   - Modo de tutorial paso a paso

4. **Herramientas de Análisis**
   - Análisis de sensibilidad
   - Identificación de parámetros críticos
   - Simulaciones múltiples para estad ística
   - Predicción de escenarios

5. **Componentes Socio-Ecológicos**
   - Humanos como agentes (pesca, agricultura)
   - Políticas de conservación
   - Costos económicos de degradación
   - Toma de decisiones adaptativa

---

## 📝 Archivos en el Proyecto

```
/home/user/Modelamiento_dinamico__/
│
├── bees_wetland_game.py          # Código principal del juego (~650 líneas)
├── README_JUEGO.md                # Manual educativo completo
├── INTERACTION_NETWORK.md         # Documentación de redes ecológicas
├── PROJECT_SUMMARY.md             # Este archivo
├── requirements.txt               # Dependencias (pygame)
│
└── .git/                          # Historial completo de commits
```

---

## 💡 Reflexiones Finales

Este proyecto demuestra que:

1. **Simplicidad → Complejidad**
   - Reglas simples en individuos crean comportamientos complejos del ecosistema
   - Imposible predecir el sistema completo solo viendo las partes

2. **Múltiples Causas, Un Efecto**
   - El colapso del ecosistema puede venir de muchas direcciones
   - No hay una única "solución"

3. **Importancia de la Escala**
   - Cambios locales (abejas individuales) crean efectos globales
   - La biodiversidad en pequeña escala = resiliencia a gran escala

4. **Vulnerabilidad Inesperada**
   - Sistemas que parecen robustos pueden colapsar rápidamente
   - Puntos de no retorno existen silenciosos

**¡Este es el mensaje central de la ecología moderna!**

---

## 📚 Referencias Ecológicas

- Holling, C.S. (1973). Resilience and Stability of Ecological Systems
- May, R.M. (1976). Simple mathematical models with very complicated dynamics
- Scheffer, M. et al. (2001). Catastrophic shifts in ecosystems
- Dirzo, R. et al. (2014). Defaunation in the Anthropocene

---

**Proyecto completado: Agosto 2026**  
**Estado: Funcional y educativamente completo** ✅

🌍🐝🌸 ¡Observa, experimenta, aprende sobre la dinámica de ecosistemas! 🐝🌸🌍
