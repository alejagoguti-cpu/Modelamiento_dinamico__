# 🐝 Abejas & Humedal - Juego Ecológico

Un juego educativo interactivo que simula la dinámica ecológica entre las abejas y un humedal a lo largo del tiempo.

## 🎮 Descripción del Juego

El juego modela la relación compleja entre las abejas polinizadoras y el ecosistema del humedal. Observa cómo:

- **Las abejas** buscan flores para polinizar y obtener comida
- **Las flores** dependen del agua del humedal y se reproducen cuando son polinizadas
- **La calidad del agua** afecta la supervivencia de las plantas
- **Las estaciones** cambian los ciclos de reproducción y disponibilidad de recursos

## 🎯 Cómo Jugar

### Instalación y Ejecución

**Requisitos previos:**
- Python 3.7 o superior
- pip (gestor de paquetes)

**Paso 1: Instalar dependencias**
```bash
pip install -r requirements.txt
```

**Paso 2: Ejecutar el juego**
```bash
python bees_wetland_game.py
```

**¡Listo!** La ventana del juego debería aparecer. Si tienes problemas:
- En Linux: puede que necesites instalar librerías de desarrollo: `sudo apt-get install python3-dev libsdl2-dev`
- En Mac: usa `pip3` en lugar de `pip`
- En Windows: asegúrate de tener Python agregado al PATH

### Controles Básicos
- **ESPACIO**: Pausar/Reanudar la simulación
- **R**: Reiniciar el juego completamente
- **Q**: Salir del juego

### Controles Interactivos (Experimentar con Variables)
Estos controles te permiten inyectar eventos e investigar cómo el ecosistema responde:

- **↑ Flecha Arriba**: Agregar 5 abejas (+5 insectos de pequeña escala)
- **↓ Flecha Abajo**: Remover 5 abejas (-5 insectos de pequeña escala)
- **W**: Inyectar contaminación del agua (-30% calidad)
- **A**: Inyectar contaminación del aire (-25% calidad)
- **P**: Desencadenar germinación de flores (evento climático favorable)

**¿Qué sucede cuando cambias estos parámetros?**
- Aumentar abejas → Más polinización, más flores, pero más depredación por aves
- Reducir abejas → Flores sin polinizar, colapso de reproducción
- Contaminar agua → Mueren flores, menos nutrientes, desaparición de microorganismos
- Contaminar aire → Abejas pierden energía más rápido, reducción de capacidad de volar
- Más flores → Más alimento, poblaciones se recuperan, pero ocupación aumenta

## 📊 Elementos del Juego

### Parte Visual (Superior)
- **Puntos Amarillos**: Abejas con buena energía
- **Puntos Naranjas**: Abejas con baja energía
- **Puntos Verdes**: Flores sin polinizar
- **Puntos Verde Oscuro**: Flores polinizadas
- **Puntos Rojos (con borde negro)**: Especies invasoras
- **Círculos Azul Claro (con borde negro grueso)**: Aves - Depredadores/Nectarívoros

### Panel de Información (Inferior)
| Métrica | Significado |
|---------|------------|
| **Año/Mes/Día** | Progresión del tiempo en meses y años |
| **Estación** | Primavera, Verano, Otoño, Invierno |
| **Abejas** | Población actual de abejas |
| **Aves** | Población de aves depredadoras/nectarívoras |
| **Flores** | Población actual de flores nativas |
| **Especies Invasoras** | Organismos no nativos que compiten |
| **Clorofila** | Índice de vegetación (salud de las plantas) |
| **Agua** | Porcentaje de salubridad del recurso hídrico |
| **Aire** | Porcentaje de pureza del aire |
| **Microorganismos** | Actividad descomponedora del suelo |
| **Nutrientes del Suelo** | Disponibilidad de nutrientes para plantas |
| **Ocupación del Hábitat** | Porcentaje de uso de espacio disponible |

## 🌍 Dinámicas Ecológicas

### Métricas Ambientales Clave

#### 🌱 Clorofila (Índice de Vegetación)
- Mide la salud y vitalidad de la vegetación del humedal
- **Basada en**:
  - Cantidad de flores presentes (>70% = mucha vegetación)
  - Calidad del agua (recursos para las plantas)
- **Afecta**:
  - Disponibilidad de alimento para las abejas
  - Producción de oxígeno en el humedal
  - Capacidad de filtración del agua

#### 💧 Calidad del Agua
- Índice de pureza y nutrientes del humedal
- Sube lentamente (+0.15% diario) si no hay contaminación
- **Disminuye por**:
  - Contaminación aleatoria (representa derrames, escorrentía)
  - Sobrepoblación de biomasa
- **Afecta**:
  - Supervivencia de flores y plantas acuáticas
  - Disponibilidad de agua para beber de las abejas
  - Reproducción de la vida acuática

#### 🌫️ Contaminación del Aire
- Mide la pureza del aire alrededor del humedal
- Sube naturalmente pero se contamina por eventos aleatorios
- **Impacto en abejas**:
  - A menor calidad de aire, las abejas pierden más energía
  - Menor ganancia de energía al polinizar
  - Mayor dificultad para encontrar flores

#### 🏞️ Capacidad del Humedal
- Porcentaje de uso de los recursos máximos disponibles
- Calculada como: (Abejas + Flores) / Capacidad Máxima
- **Indica**:
  - Si el ecosistema está sobrecargado (>80% = peligro)
  - Disponibilidad de espacio y recursos
  - Sostenibilidad del actual nivel de biodiversidad

#### 🦅 Aves - Depredadores y Nectarívoros
- Representan el siguiente nivel trófico en la cadena alimentaria
- **Comportamiento**:
  - Se alimentan de **abejas** (depredación) → Ganan mucha energía
  - Se alimentan de **flores** (néctar) → Ganan menos energía
  - Buscan automáticamente el alimento más cercano
  - Aparecen cuando hay suficiente población de abejas
- **Impacto en el ecosistema**:
  - **Control de poblaciones**: Limitan el crecimiento de abejas
  - **Variabilidad ecológica**: Crean ciclos de predador-presa
  - **Dependencia del hábitat**: Necesitan abundancia de flores/insectos
  - **Nidificación**: Se reproducen si hay suficiente alimento
- **Desaparecen si**: 
  - Hay muy pocas abejas o flores disponibles
  - Su energía se agota por falta de alimento
  - Edad máxima alcanzada

#### 🧬 Microorganismos del Suelo
- Descomponedores que procesan la materia orgánica muerta
- **Generan**: 
  - Nutrientes disponibles para plantas
  - Humus y estructura del suelo
  - Ciclo de nutrientes
- **Afectados por**:
  - Calidad del agua (lluvia y nutrientes)
  - Cantidad de biomasa muerta (flores muertas, invasoras)
  - Contaminación del agua
- **Su importancia**:
  - Más microorganismos = Mejor salud del suelo
  - Afectan directamente la disponibilidad de nutrientes
  - Permiten que las plantas crezcan más fuertes

#### 🌿 Nutrientes del Suelo
- Componentes químicos que las plantas necesitan
- **Se consumen por**:
  - Crecimiento de flores
  - Alimentación de abejas
  - Absorción de plantas
- **Se regeneran por**:
  - Actividad de microorganismos
  - Descomposición de materia orgánica
  - Calidad del agua (aporte de nutrientes)
- **Efecto cascada**:
  - Pocos nutrientes → Flores débiles
  - Flores débiles → Abejas débiles
  - Abejas débiles → Menos polinización
  - Menos polinización → Colapso del ciclo

#### 🚨 Especies Invasoras
- Organismos no nativos que colonizan el humedal
- **Aparecen cuando**:
  - La calidad del agua disminuye (oportunidad de establecerse)
  - De manera aleatoria en el ecosistema
  - Más frecuentemente en ecosistemas degradados
- **Impacto negativo**:
  - **Compiten con flores nativas** por espacio y recursos
  - **No son polinizadas por abejas** (no sirven como alimento)
  - **Ocupan espacio en el humedal** (aumentan capacidad)
  - **Alteran el equilibrio ecológico**
  - Cuando abundan (>20), comienzan a **matar flores nativas**
- **Indicadores de invasión**:
  - Color ROJO en el contador si hay más de 30 (crítico)
  - Color NARANJA si hay entre 10-30 (alerta)
  - Disminución de flores nativas coincide con invasoras

#### 📍 Ocupación del Hábitat
- Porcentaje de espacio usado por todos los organismos
- **Límites**: Máximo de ~70% es sostenible
- **Señales de peligro**:
  - >80%: Ecosistema sobrecargado, colapso inminente
  - Competencia intensa por recursos
  - Mortalidad aumentada
  - Reproducción limitada

### Ciclo de las Abejas
1. Las abejas buscan flores automáticamente
2. Al encontrar una flor, obtienen energía y la polinizan
3. Si su energía llega a 0, mueren
4. Con suficiente alimento, se reproducen (más abejas)

### Ciclo de las Flores
1. Nacen flores en el humedal regularmente
2. Si una abeja las poliniza, pueden reproducirse
3. La calidad del agua afecta su supervivencia
4. Después de cierto tiempo, mueren naturalmente

### Estaciones
Cada estación (cada ~90 días) afecta:

- **🌸 Primavera**: Muchas flores, reproducción moderada de abejas
- **☀️ Verano**: Menos flores, máxima reproducción de abejas
- **🍂 Otoño**: Pocas flores, baja reproducción de abejas
- **❄️ Invierno**: Muy pocas flores, casi sin reproducción

### Calidad del Agua
- Se recupera lentamente cada día (+0.1%)
- Ocasionalmente disminuye por contaminación (-5 a -15%)
- Afecta la supervivencia de las flores y plantas

## 🎨 Interpretación de Colores

Los números en el panel se colorean según su estado:

- **🟢 Verde (>70%)**: Excelente estado, muy saludable
- **🟠 Naranja (40-70%)**: Estado medio, requiere atención
- **🔴 Rojo (<40%)**: Crítico, en peligro

## 📈 Objetivos de Aprendizaje

Este juego enseña:

✅ **Relaciones ecológicas**: Cómo dependen las especies una de la otra
✅ **Ciclos naturales**: Las estaciones y sus efectos en la biodiversidad
✅ **Equilibrio del ecosistema**: La importancia de mantener poblaciones saludables
✅ **Modelamiento dinámico**: Cómo los sistemas complejos evolucionan con el tiempo
✅ **Impacto ambiental**: Cómo la calidad del agua afecta todo el ecosistema

## 🔬 Interpretación de Resultados

### Ecosistema Saludable 🟢
✅ Abejas: 80+ individuos  
✅ Flores: 100+ plantas  
✅ Clorofila: >80% (vegetación abundante)  
✅ Calidad del Agua: >80% (muy puro)  
✅ Calidad del Aire: >80% (aire limpio)  
✅ Capacidad del Humedal: <60% (no saturado)  

### Ecosistema en Peligro 🔴
❌ Abejas: <20 individuos  
❌ Flores: <30 plantas  
❌ Clorofila: <40% (poca vegetación)  
❌ Calidad del Agua: <40% (contaminado)  
❌ Calidad del Aire: <40% (muy contaminado)  
❌ Capacidad del Humedal: >80% (sobrecargado)  

### Impacto de la Contaminación Ambiental
- **Alto nivel de contaminación del aire**: Las abejas pierden energía más rápido, tienen dificultad para polinizar
- **Agua contaminada**: Las flores tienen baja tasa de supervivencia y reproducción
- **Humedal sobrecargado**: Los recursos se agotan rápidamente, llevando al colapso
- **Baja clorofila**: Indicador de que el ecosistema no es capaz de sostener vida

### Cascada de Colapso Ecológico
1. **Contaminación del agua** → Mueren flores
2. **Menos flores** → Abejas pierden alimento
3. **Aire contaminado** → Abejas pierden energía rapidamente
4. **Abejas débiles** → No pueden polinizar
5. **Sin polinización** → Colapso total del humedal

## 📚 Cadenas Tróficas - Relación de Escalas

El juego modela cómo los cambios en **pequeña escala** (abejas individuales) generan efectos a **escala de ecosistema**:

```
CADENA TRÓFICA DEL HUMEDAL:
─────────────────────────────

Microorganismos (suelo)
        ↓
    Nutrientes
        ↓
   🌸 Flores 🌸
        ↓
  🐝 Abejas 🐝  ← Escala pequeña
        ↓
   🦅 Aves 🦅
        
Y compitiendo: 🚨 Especies Invasoras 🚨
```

### Efectos Cascada en Tiempo Real

**Cuando subes la población de abejas (↑):**
1. Más polinización → Flores se reproducen más
2. Más flores → Más alimento disponible
3. Ocupación del hábitat sube (más biomasa)
4. Aves aumentan (más presas disponibles)
5. Aves comienzan a cazar abejas (ciclo depredador-presa)
6. Balance dinámico o colapso según recursos disponibles

**Cuando contaminas el agua (W):**
1. Calidad del agua baja
2. Mueren flores (necesitan agua limpia)
3. Reducen microorganismos (bajan nutrientes)
4. Especies invasoras proliferan (aprovechan agua contaminada)
5. Abejas sin flores = sin alimento = mueren
6. Aves sin presas = desaparecen
7. Colapso completo del ecosistema

## 💡 Sugerencias para Experimentar

1. **Observa los ciclos naturales**: Pausar y retomar
2. **Experimenta con variables**: Usa ↑/↓ para agregar/quitar abejas
3. **Inyecta estrés ambiental**: W y A para ver resilencia
4. **Mira efectos a largo plazo**: Espera 10-20 meses para ver tendencias
5. **Reinicia y compara**: ¿Diferentes simulaciones = diferentes resultados?
6. **Piensa en**: 
   - ¿Cuántas abejas máximo antes del colapso?
   - ¿Qué pasa si hay mucha contaminación simultánea?
   - ¿Pueden los microorganismos recuperar un ecosistema contaminado?
   - ¿Las invasoras siempre ganan cuando hay contaminación?

## 🔧 Características Técnicas

- Simulación en tiempo real con física y dinámica de poblaciones
- Generación procedural de eventos ambientales
- Interfaz gráfica interactiva con Pygame
- Sistema de comportamiento basado en agentes (abejas autónomas)
- Ciclo ecológico completo

## 📚 Conceptos Ecológicos Base

- **Polinización**: Transferencia de polen entre flores mediante insectos
- **Humedal**: Ecosistema con agua que alberga vida diversa
- **Biodiversidad**: Variedad de especies en un ecosistema
- **Equilibrio ecológico**: Estabilidad natural entre depredadores y presas
- **Ciclos estacionales**: Cambios periódicos en los ecosistemas

---

**¡Disfruta observando la dinámica de la naturaleza!** 🌍🐝🌸
